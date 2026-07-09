import { NextRequest, NextResponse } from "next/server";
import { requireRole } from "@/lib/auth-helpers";
import { checkRateLimit } from "@/lib/rate-limit";
import { withTimeout, TimeoutError } from "@/lib/timeout";
import { fetchPbbStats } from "@/lib/pbb-queries";

const QUERY_TIMEOUT_MS = 10_000;

export async function GET(request: NextRequest) {
  const authResult = await requireRole(["kepala_desa", "pamong_pajak"]);
  if ("error" in authResult) return authResult.error;

  const userId = authResult.session.user?.id ?? "unknown";
  const rl = checkRateLimit(`stats:get:${userId}`, {
    windowMs: 60 * 1000,
    maxAttempts: 60,
  });
  if (!rl.allowed) {
    return NextResponse.json(
      { error: "Terlalu banyak permintaan. Coba lagi nanti." },
      { status: 429 },
    );
  }

  const { searchParams } = new URL(request.url);
  const yearRaw = parseInt(searchParams.get("year") ?? "2026");
  const monthRaw = parseInt(searchParams.get("month") ?? "7");

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

  const year = yearRaw;
  const month = monthRaw;

  try {
    const data = await withTimeout(
      fetchPbbStats(year, month),
      QUERY_TIMEOUT_MS,
    );
    return NextResponse.json(data);
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
