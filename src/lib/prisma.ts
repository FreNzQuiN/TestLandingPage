import { PrismaClient } from "@prisma/client";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function createPrismaClient() {
  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error("DATABASE_URL environment variable is not set");
  }

  const parsed = new URL(url);
  const adapter = new PrismaMariaDb({
    host: parsed.hostname,
    user: decodeURIComponent(parsed.username),
    password: decodeURIComponent(parsed.password),
    database: parsed.pathname.slice(1),
    port: Number(parsed.port) || 4000,
    ssl: process.env.DB_CA_CERT
      ? { rejectUnauthorized: true, ca: process.env.DB_CA_CERT }
      : { rejectUnauthorized: false },
    connectTimeout: 10_000,
    connectionLimit: 5,
    idleTimeout: 10_000,
  });

  return new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === "production" ? [] : ["error", "warn"],
  });
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();
globalForPrisma.prisma = prisma;
