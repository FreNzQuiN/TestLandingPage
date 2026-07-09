import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth, requireRole, getRole } from "@/lib/auth-helpers";
import { checkRateLimit, RATE_LIMIT_PRESETS } from "@/lib/rate-limit";
import { sanitizeSearch, maskNik } from "@/lib/utils";

export async function GET(request: NextRequest) {
  const authResult = await requireAuth();
  if ("error" in authResult) return authResult.error;

  const userId = authResult.session.user?.id ?? "unknown";
  const rl = checkRateLimit(`plots:get:${userId}`, RATE_LIMIT_PRESETS.api);
  if (!rl.allowed) {
    return NextResponse.json(
      { error: "Terlalu banyak permintaan. Coba lagi nanti." },
      { status: 429 },
    );
  }

  const { searchParams } = new URL(request.url);
  const blok = searchParams.get("blok");
  const status = searchParams.get("status");
  const search = sanitizeSearch(searchParams.get("search"));
  const pageRaw = parseInt(searchParams.get("page") ?? "1");
  const limitRaw = parseInt(searchParams.get("limit") ?? "20");
  const yearRaw = parseInt(
    searchParams.get("year") ?? String(new Date().getFullYear()),
  );
  const monthRaw = parseInt(
    searchParams.get("month") ?? String(new Date().getMonth() + 1),
  );

  if (isNaN(pageRaw) || isNaN(limitRaw) || isNaN(yearRaw) || isNaN(monthRaw)) {
    return NextResponse.json(
      { error: "Invalid query parameters" },
      { status: 400 },
    );
  }
  if (yearRaw < 2000 || yearRaw > 2100 || monthRaw < 1 || monthRaw > 12) {
    return NextResponse.json(
      { error: "Invalid year or month" },
      { status: 400 },
    );
  }
  if (pageRaw < 1 || limitRaw < 1 || limitRaw > 100) {
    return NextResponse.json(
      { error: "Invalid page or limit" },
      { status: 400 },
    );
  }
  if (status && status !== "lunas" && status !== "belum_lunas") {
    return NextResponse.json(
      { error: "Invalid status filter" },
      { status: 400 },
    );
  }

  const page = pageRaw;
  const limit = limitRaw;
  const year = yearRaw;
  const month = monthRaw;
  const skip = (page - 1) * limit;

  const role = getRole(authResult);
  const where: Record<string, unknown> = {};

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
    where.blok = user.assignedBlok;
  } else if (blok) {
    where.blok = blok;
  }

  if (search) {
    where.OR = [
      { nop: { contains: search } },
      { ownerName: { contains: search } },
      { ownerNik: { contains: search } },
    ];
  }

  if (status === "lunas") {
    where.payments = {
      some: { status: "lunas", year, month },
    };
  } else if (status === "belum_lunas") {
    where.payments = {
      none: { status: "lunas", year, month },
    };
  }

  const [plots, total] = await Promise.all([
    prisma.landPlot.findMany({
      where,
      include: {
        payments: {
          where: { year, month },
          select: { status: true },
        },
      },
      skip,
      take: limit,
      orderBy: { nop: "asc" },
    }),
    prisma.landPlot.count({ where }),
  ]);

  return NextResponse.json({
    data: plots.map((p) => ({
      ...p,
      ownerNik: role === "kepala_desa" ? p.ownerNik : maskNik(p.ownerNik),
      currentStatus: p.payments[0]?.status ?? "belum_lunas",
    })),
    meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
  });
}

export async function POST(request: NextRequest) {
  const authResult = await requireRole(["kepala_desa", "pamong_pajak"]);
  if ("error" in authResult) return authResult.error;

  const role = getRole(authResult);

  const userId = authResult.session.user?.id ?? "unknown";
  const rl = checkRateLimit(`plots:post:${userId}`, RATE_LIMIT_PRESETS.api);
  if (!rl.allowed) {
    return NextResponse.json(
      { error: "Terlalu banyak permintaan. Coba lagi nanti." },
      { status: 429 },
    );
  }

  const body = await request.json();
  const {
    nop,
    ownerName,
    ownerNik,
    address,
    blok,
    landArea,
    buildingArea,
    njopLand,
    njopBuilding,
    pbbAmount,
  } = body;

  if (!nop || !ownerName || !address || !blok) {
    return NextResponse.json(
      { error: "nop, ownerName, address, blok are required" },
      { status: 400 },
    );
  }

  if (typeof nop !== "string" || nop.length < 5 || nop.length > 50) {
    return NextResponse.json(
      { error: "nop must be a string (5-50 chars)" },
      { status: 400 },
    );
  }
  if (
    typeof ownerName !== "string" ||
    ownerName.length < 1 ||
    ownerName.length > 255
  ) {
    return NextResponse.json(
      { error: "ownerName must be a string (1-255 chars)" },
      { status: 400 },
    );
  }
  if (typeof address !== "string" || address.length < 1) {
    return NextResponse.json(
      { error: "address must be a non-empty string" },
      { status: 400 },
    );
  }
  if (typeof blok !== "string" || blok.length < 1 || blok.length > 50) {
    return NextResponse.json(
      { error: "blok must be a string (1-50 chars)" },
      { status: 400 },
    );
  }
  if (
    ownerNik !== undefined &&
    ownerNik !== null &&
    (typeof ownerNik !== "string" || ownerNik.length > 20)
  ) {
    return NextResponse.json(
      { error: "ownerNik must be a string (max 20 chars)" },
      { status: 400 },
    );
  }

  const numericFields = {
    landArea,
    buildingArea,
    njopLand,
    njopBuilding,
    pbbAmount,
  };
  for (const [key, val] of Object.entries(numericFields)) {
    if (val !== undefined && val !== null && val !== "") {
      const num = Number(val);
      if (isNaN(num) || num < 0) {
        return NextResponse.json(
          { error: `${key} must be a non-negative number` },
          { status: 400 },
        );
      }
    }
  }

  const plot = await prisma.landPlot.create({
    data: {
      nop,
      ownerName,
      ownerNik,
      address,
      blok,
      landArea: landArea ? parseFloat(landArea) : null,
      buildingArea: buildingArea ? parseFloat(buildingArea) : null,
      njopLand: njopLand ? parseFloat(njopLand) : null,
      njopBuilding: njopBuilding ? parseFloat(njopBuilding) : null,
      pbbAmount: pbbAmount ? parseFloat(pbbAmount) : null,
    },
  });

  return NextResponse.json(
    {
      ...plot,
      ownerNik: role === "kepala_desa" ? plot.ownerNik : maskNik(plot.ownerNik),
    },
    { status: 201 },
  );
}
