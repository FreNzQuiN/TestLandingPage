// MIDLLEWARE.ts depecrated, use proxy.ts
import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";
import { checkRateLimit } from "@/lib/rate-limit";

function getClientIp(req: Request): string {
  return (
    req.headers.get("x-real-ip") ??
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    "unknown"
  );
}

export default auth((req) => {
  const path = req.nextUrl.pathname;

  if (path.startsWith("/api/")) {
    const ip = getClientIp(req);
    const rl = checkRateLimit(`edge:api:${ip}`, {
      windowMs: 60_000,
      maxAttempts: 60,
    });
    if (!rl.allowed) {
      return NextResponse.json(
        { error: "Terlalu banyak permintaan. Coba lagi nanti." },
        { status: 429 },
      );
    }
    return NextResponse.next();
  }

  const session = req.auth;

  if (!session) {
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("callbackUrl", path);
    return NextResponse.redirect(loginUrl);
  }

  const role = session.user?.role;

  if (path.startsWith("/kepaladesa") && role !== "kepala_desa") {
    return NextResponse.redirect(new URL("/unauthorized", req.url));
  }

  if (path.startsWith("/pamong") && role !== "pamong_pajak") {
    return NextResponse.redirect(new URL("/unauthorized", req.url));
  }

  if (path.startsWith("/jurnalis") && role !== "jurnalis") {
    return NextResponse.redirect(new URL("/unauthorized", req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    "/api/((?!auth).*)", // auth excluded: rate limiting breaks NextAuth flows
    "/kepaladesa/:path*",
    "/pamong/:path*",
    "/jurnalis/:path*",
  ],
};
