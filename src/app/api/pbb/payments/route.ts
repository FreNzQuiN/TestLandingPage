import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth, requireRole, getRole } from "@/lib/auth-helpers";
import { checkRateLimit, RATE_LIMIT_PRESETS } from "@/lib/rate-limit";

export async function GET(request: NextRequest) {
  const authResult = await requireAuth();
  if ("error" in authResult) return authResult.error;

  const userId = authResult.session.user?.id ?? "unknown";
  const rl = checkRateLimit(`payments:get:${userId}`, RATE_LIMIT_PRESETS.api);
  if (!rl.allowed) {
    return NextResponse.json(
      { error: "Terlalu banyak permintaan. Coba lagi nanti." },
      { status: 429 },
    );
  }

  const { searchParams } = new URL(request.url);
  const yearRaw = parseInt(searchParams.get("year") ?? "2026");
  const monthRaw = parseInt(searchParams.get("month") ?? "7");
  const blok = searchParams.get("blok");
  const status = searchParams.get("status");

  if (
    isNaN(yearRaw) ||
    isNaN(monthRaw) ||
    yearRaw < 2000 ||
    yearRaw > 2100 ||
    monthRaw < 1 ||
    monthRaw > 12
  ) {
    return NextResponse.json(
      { error: "Invalid year or month parameter" },
      { status: 400 },
    );
  }
  if (status && status !== "lunas" && status !== "belum_lunas") {
    return NextResponse.json(
      { error: "Invalid status filter" },
      { status: 400 },
    );
  }

  const year = yearRaw;
  const month = monthRaw;

  const role = getRole(authResult);
  const where: Record<string, unknown> = { year, month };

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
    where.landPlot = { blok: user.assignedBlok };
  } else if (blok) {
    where.landPlot = { blok };
  }

  if (status) {
    where.status = status;
  }

  const payments = await prisma.payment.findMany({
    where,
    include: { landPlot: true },
    orderBy: { createdAt: "desc" },
    take: 100,
  });

  return NextResponse.json(payments);
}

export async function POST(request: NextRequest) {
  const authResult = await requireRole(["pamong_pajak"]);
  if ("error" in authResult) return authResult.error;
  const { session } = authResult;

  const userId = session.user?.id ?? "unknown";
  const rl = checkRateLimit(`payments:post:${userId}`, {
    windowMs: 60 * 1000,
    maxAttempts: 20,
  });
  if (!rl.allowed) {
    return NextResponse.json(
      { error: "Terlalu banyak permintaan. Coba lagi nanti." },
      { status: 429 },
    );
  }

  const body = await request.json();
  const { landPlotIds, year, month, status, notes } = body;

  if (!Array.isArray(landPlotIds) || !landPlotIds.length || !year || !month) {
    return NextResponse.json(
      { error: "landPlotIds (array), year, month are required" },
      { status: 400 },
    );
  }

  if (
    !landPlotIds.every(
      (id: unknown) => typeof id === "number" && Number.isInteger(id) && id > 0,
    )
  ) {
    return NextResponse.json(
      { error: "Each landPlotId must be a positive integer" },
      { status: 400 },
    );
  }

  if (!Number.isInteger(year) || year < 2000 || year > 2100) {
    return NextResponse.json({ error: "Invalid year" }, { status: 400 });
  }
  if (!Number.isInteger(month) || month < 1 || month > 12) {
    return NextResponse.json({ error: "Invalid month" }, { status: 400 });
  }
  if (status && status !== "lunas" && status !== "belum_lunas") {
    return NextResponse.json({ error: "Invalid status" }, { status: 400 });
  }

  const markedBy = Number(session.user?.id);
  if (!markedBy) {
    return NextResponse.json({ error: "Invalid session" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { id: markedBy },
    select: { assignedBlok: true, role: true },
  });
  if (!user?.assignedBlok || user.role !== "pamong_pajak") {
    return NextResponse.json({ error: "Invalid session" }, { status: 401 });
  }

  const plotsInBlok = await prisma.landPlot.findMany({
    where: { id: { in: landPlotIds }, blok: user.assignedBlok },
    select: { id: true },
  });
  const validPlotIds = new Set(plotsInBlok.map((p) => p.id));
  const unauthorizedIds = landPlotIds.filter(
    (id: number) => !validPlotIds.has(id),
  );

  if (unauthorizedIds.length > 0) {
    return NextResponse.json(
      {
        error: "Beberapa plot tidak termasuk dalam blok yang ditugaskan",
      },
      { status: 403 },
    );
  }

  const results = await prisma.$transaction(
    landPlotIds.map((plotId: number) =>
      prisma.payment.upsert({
        where: {
          landPlotId_year_month: {
            landPlotId: plotId,
            year,
            month,
          },
        },
        update: {
          status: status ?? "lunas",
          paymentDate: status === "lunas" ? new Date() : null,
          markedBy,
          notes,
        },
        create: {
          landPlotId: plotId,
          year,
          month,
          status: status ?? "lunas",
          paymentDate: status === "lunas" ? new Date() : null,
          markedBy,
          notes,
        },
      }),
    ),
  );

  return NextResponse.json(results, { status: 201 });
}
