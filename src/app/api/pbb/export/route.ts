import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireRole, getRole } from "@/lib/auth-helpers";
import { checkRateLimit } from "@/lib/rate-limit";
import { withTimeout, TimeoutError } from "@/lib/timeout";
import XlsxPopulate from "xlsx-populate";
import { jsPDF } from "jspdf";
import { autoTable } from "jspdf-autotable";

const QUERY_TIMEOUT_MS = 15_000;

interface BlokStat {
  blok: string;
  totalPlots: number;
  paid: number;
  unpaid: number;
  percentage: number;
}

interface OverallStats {
  totalPlots: number;
  totalPaid: number;
  totalUnpaid: number;
  percentage: number;
  totalTarget: number;
  totalRealization: number;
}

async function fetchStats(year: number, month: number, blokFilter?: string) {
  const blokWhere = blokFilter ? { blok: blokFilter } : {};

  const [totalPlots, paidPlots] = await Promise.all([
    prisma.landPlot.count({ where: blokWhere }),
    prisma.payment.findMany({
      where: { year, month, status: "lunas", landPlot: blokWhere },
      select: { landPlotId: true },
    }),
  ]);

  const paidPlotIds = new Set(paidPlots.map((p) => p.landPlotId));
  const totalPaid = paidPlotIds.size;
  const totalUnpaid = totalPlots - totalPaid;
  const percentage = totalPlots > 0 ? (totalPaid / totalPlots) * 100 : 0;
  const targetAgg = await prisma.landPlot.aggregate({
    where: blokWhere,
    _sum: { pbbAmount: true },
  });
  const totalTarget = Number(targetAgg._sum.pbbAmount) || 0;

  const paidWithAmount = await prisma.payment.findMany({
    where: { year, month, status: "lunas", landPlot: blokWhere },
    select: { landPlot: { select: { pbbAmount: true } } },
  });
  const totalRealization = paidWithAmount.reduce(
    (sum, p) => sum + (Number(p.landPlot.pbbAmount) || 0),
    0,
  );

  const blokGroups = await prisma.landPlot.groupBy({
    by: ["blok"],
    where: blokWhere,
    _count: { id: true },
  });

  const allPaid = await prisma.payment.findMany({
    where: { year, month, status: "lunas", landPlot: blokWhere },
    select: { landPlotId: true },
  });
  const paidSet = new Set(allPaid.map((p) => p.landPlotId));

  const allPlots = await prisma.landPlot.findMany({
    where: blokWhere,
    select: { id: true, blok: true },
  });

  const plotsByBlok = new Map<string, number[]>();
  for (const p of allPlots) {
    const ids = plotsByBlok.get(p.blok) ?? [];
    ids.push(p.id);
    plotsByBlok.set(p.blok, ids);
  }

  const blokStats: BlokStat[] = blokGroups.map((b) => {
    const plotIds = plotsByBlok.get(b.blok) ?? [];
    const paidCount = plotIds.filter((id) => paidSet.has(id)).length;

    return {
      blok: b.blok,
      totalPlots: b._count.id,
      paid: paidCount,
      unpaid: b._count.id - paidCount,
      percentage: b._count.id > 0 ? (paidCount / b._count.id) * 100 : 0,
    };
  });

  const overallStats: OverallStats = {
    totalPlots,
    totalPaid,
    totalUnpaid,
    percentage,
    totalTarget,
    totalRealization,
  };

  return { overallStats, blokStats };
}

import { formatCurrency } from "@/lib/utils";

const HEADER_FILL = {
  type: "pattern" as const,
  pattern: "solid",
  foreground: { rgb: "FF22783A" },
};
const HEADER_STYLE = {
  bold: true,
  fontColor: "FFFFFFFF",
  fill: HEADER_FILL,
};

async function buildExcelBuffer(
  overall: OverallStats,
  blokStats: BlokStat[],
  year: number,
  month: number,
): Promise<Buffer> {
  const wb = await XlsxPopulate.fromBlankAsync();

  const ws1 = wb.sheet(0).name("Ringkasan");

  ws1.column(1).width(20);
  ws1.column(2).width(25);

  ws1.range("A1:B1").merged(true).value("Laporan PBB Desa Tulungrejo");
  ws1.cell("A1").style({ bold: true, fontSize: 14 });

  ws1.range("A2:B2").merged(true).value(`Bulan ${month} Tahun ${year}`);

  ws1.cell("A4").value("Keterangan");
  ws1.cell("B4").value("Jumlah");
  ws1.range("A4:B4").style(HEADER_STYLE);

  ws1.cell("A5").value("Total Plot");
  ws1.cell("B5").value(overall.totalPlots);
  ws1.cell("A6").value("Sudah Bayar");
  ws1.cell("B6").value(overall.totalPaid);
  ws1.cell("A7").value("Belum Bayar");
  ws1.cell("B7").value(overall.totalUnpaid);
  ws1.cell("A8").value("Persentase");
  ws1.cell("B8").value(`${overall.percentage.toFixed(1)}%`);
  ws1.cell("A9").value("Target PBB");
  ws1.cell("B9").value(formatCurrency(overall.totalTarget));
  ws1.cell("A10").value("Realisasi");
  ws1.cell("B10").value(formatCurrency(overall.totalRealization));

  const ws2 = wb.addSheet("Per Blok");

  ws2.column(1).width(10);
  ws2.column(2).width(12);
  ws2.column(3).width(14);
  ws2.column(4).width(14);
  ws2.column(5).width(12);

  ws2.cell("A1").value("Blok");
  ws2.cell("B1").value("Total Plot");
  ws2.cell("C1").value("Sudah Bayar");
  ws2.cell("D1").value("Belum Bayar");
  ws2.cell("E1").value("Persentase");
  ws2.range("A1:E1").style(HEADER_STYLE);

  for (let i = 0; i < blokStats.length; i++) {
    const b = blokStats[i]!;
    const row = i + 2;
    ws2.cell(`A${row}`).value(b.blok);
    ws2.cell(`B${row}`).value(b.totalPlots);
    ws2.cell(`C${row}`).value(b.paid);
    ws2.cell(`D${row}`).value(b.unpaid);
    ws2.cell(`E${row}`).value(`${b.percentage.toFixed(1)}%`);
  }

  const buf = await wb.outputAsync();
  return Buffer.from(buf);
}

function buildPdfBuffer(
  overall: OverallStats,
  blokStats: BlokStat[],
  year: number,
  month: number,
): Buffer {
  const doc = new jsPDF();

  doc.setFontSize(16);
  doc.text("Laporan PBB Desa Tulungrejo", 14, 22);
  doc.setFontSize(12);
  doc.text(`Bulan ${month} Tahun ${year}`, 14, 30);

  autoTable(doc, {
    startY: 38,
    head: [["Keterangan", "Jumlah"]],
    body: [
      ["Total Plot", String(overall.totalPlots)],
      ["Sudah Bayar", String(overall.totalPaid)],
      ["Belum Bayar", String(overall.totalUnpaid)],
      ["Persentase", `${overall.percentage.toFixed(1)}%`],
      ["Target PBB", formatCurrency(overall.totalTarget)],
      ["Realisasi", formatCurrency(overall.totalRealization)],
    ],
    styles: { fontSize: 10 },
    headStyles: { fillColor: [34, 120, 58] },
    columnStyles: {
      0: { cellWidth: 60 },
    },
  });

  const lastTableY =
    (doc as jsPDF & { lastAutoTable?: { finalY?: number } }).lastAutoTable
      ?.finalY ?? 38;

  doc.setFontSize(14);
  doc.text("Rincian per Blok", 14, lastTableY + 14);

  autoTable(doc, {
    startY: lastTableY + 20,
    head: [["Blok", "Total Plot", "Sudah Bayar", "Belum Bayar", "Persentase"]],
    body: blokStats.map((b) => [
      b.blok,
      String(b.totalPlots),
      String(b.paid),
      String(b.unpaid),
      `${b.percentage.toFixed(1)}%`,
    ]),
    styles: { fontSize: 9 },
    headStyles: { fillColor: [34, 120, 58] },
    columnStyles: {
      0: { cellWidth: 20 },
      1: { halign: "right" },
      2: { halign: "right" },
      3: { halign: "right" },
      4: { halign: "right" },
    },
  });

  const pdfArray = doc.output("arraybuffer");
  return Buffer.from(pdfArray);
}

export async function GET(request: NextRequest) {
  const authResult = await requireRole(["kepala_desa", "pamong_pajak"]);
  if ("error" in authResult) return authResult.error;

  const role = getRole(authResult);
  let blokFilter: string | undefined;

  if (role === "pamong_pajak") {
    const userId = Number(authResult.session.user?.id);
    const user = userId
      ? await prisma.user.findUnique({
          where: { id: userId },
          select: { assignedBlok: true },
        })
      : null;
    if (!user?.assignedBlok) {
      return NextResponse.json(
        { error: "Anda belum ditugaskan ke blok tertentu" },
        { status: 403 },
      );
    }
    blokFilter = user.assignedBlok;
  }

  const userId = authResult.session.user?.id ?? "unknown";
  const rl = checkRateLimit(`export:${userId}`);
  if (!rl.allowed) {
    return NextResponse.json(
      { error: "Terlalu banyak permintaan export. Coba lagi nanti." },
      { status: 429 },
    );
  }

  const { searchParams } = new URL(request.url);
  const format = searchParams.get("format") ?? "excel";
  const year = parseInt(searchParams.get("year") ?? "2026");
  const month = parseInt(searchParams.get("month") ?? "7");

  if (
    isNaN(year) ||
    isNaN(month) ||
    year < 2000 ||
    year > 2100 ||
    month < 1 ||
    month > 12
  ) {
    return NextResponse.json(
      { error: "Invalid year or month parameter" },
      { status: 400 },
    );
  }

  try {
    const { overallStats, blokStats } = await withTimeout(
      fetchStats(year, month, blokFilter),
      QUERY_TIMEOUT_MS,
    );

    if (format === "excel") {
      const buf = await buildExcelBuffer(overallStats, blokStats, year, month);
      return new NextResponse(new Uint8Array(buf), {
        headers: {
          "Content-Type":
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          "Content-Disposition": `attachment; filename="laporan-pbb.xlsx"`,
        },
      });
    }

    if (format === "pdf") {
      const buf = buildPdfBuffer(overallStats, blokStats, year, month);
      return new NextResponse(new Uint8Array(buf), {
        headers: {
          "Content-Type": "application/pdf",
          "Content-Disposition": `attachment; filename="laporan-pbb.pdf"`,
        },
      });
    }

    return NextResponse.json(
      { error: 'Invalid format. Use "excel" or "pdf".' },
      { status: 400 },
    );
  } catch (e) {
    if (e instanceof TimeoutError) {
      return NextResponse.json(
        { error: "Query timeout. Coba lagi nanti." },
        { status: 504 },
      );
    }
    throw e;
  }
}
