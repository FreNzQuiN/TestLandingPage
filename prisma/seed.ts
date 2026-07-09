import { PrismaClient, Role } from "@prisma/client";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import bcrypt from "bcryptjs";

if (process.env.NODE_ENV === "production" && !process.env.ALLOW_SEED_PROD) {
  throw new Error(
    "Refusing to seed in production. Set ALLOW_SEED_PROD=true to override.",
  );
}

const dbUrl = new URL(process.env.DATABASE_URL!);
const adapter = new PrismaMariaDb({
  host: dbUrl.hostname,
  user: decodeURIComponent(dbUrl.username),
  password: decodeURIComponent(dbUrl.password),
  database: dbUrl.pathname.slice(1),
  port: Number(dbUrl.port) || 4000,
  ssl: { rejectUnauthorized: false },
});
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Seeding database...");

  // Hash password
  // ⚠️ SECURITY: This is a seed password for development only.
  // In production, generate unique passwords per user and NEVER commit them.
  const passwordHash = await bcrypt.hash("password123", 10);

  // Create users
  const kades = await prisma.user.upsert({
    where: { email: "kades@tulungrejo.id" },
    update: {},
    create: {
      email: "kades@tulungrejo.id",
      passwordHash,
      name: "Kades Tulungrejo",
      role: Role.kepala_desa,
    },
  });

  const pamong1 = await prisma.user.upsert({
    where: { email: "pamong1@tulungrejo.id" },
    update: {},
    create: {
      email: "pamong1@tulungrejo.id",
      passwordHash,
      name: "Pamong Blok 1",
      role: Role.pamong_pajak,
      assignedBlok: "Blok 1",
    },
  });

  const pamong2 = await prisma.user.upsert({
    where: { email: "pamong2@tulungrejo.id" },
    update: {},
    create: {
      email: "pamong2@tulungrejo.id",
      passwordHash,
      name: "Pamong Blok 2",
      role: Role.pamong_pajak,
      assignedBlok: "Blok 2",
    },
  });

  const jurnalis = await prisma.user.upsert({
    where: { email: "jurnalis@tulungrejo.id" },
    update: {},
    create: {
      email: "jurnalis@tulungrejo.id",
      passwordHash,
      name: "Jurnalis Desa",
      role: Role.jurnalis,
    },
  });

  console.log("Users created:", { kades, pamong1, pamong2, jurnalis });

  // Sample land plots
  const bloks = ["Blok 1", "Blok 2", "Blok 3", "Blok 4", "Blok 5"];
  const plots = [];

  for (let i = 1; i <= 20; i++) {
    const blok = bloks[i % 5]!;
    const nop = `3505010001${String(i).padStart(4, "0")}`;
    const pbbAmount = Math.floor(Math.random() * 500000) + 100000;

    const plot = await prisma.landPlot.upsert({
      where: { nop },
      update: {},
      create: {
        nop,
        ownerName: `Warga ${i}`,
        ownerNik: `350501${String(i).padStart(10, "0")}`,
        address: `Jl. Desa Tulungrejo No. ${i}`,
        blok,
        landArea: Math.floor(Math.random() * 200) + 50,
        buildingArea: Math.floor(Math.random() * 100) + 20,
        njopLand: Math.floor(Math.random() * 50000000) + 10000000,
        njopBuilding: Math.floor(Math.random() * 30000000) + 5000000,
        pbbAmount,
      },
    });
    plots.push(plot);
  }

  console.log(`Created ${plots.length} land plots`);

  // Sample payments (some paid, some unpaid)
  const year = 2026;
  const month = 7;

  for (const plot of plots) {
    const isPaid = Math.random() > 0.6;
    await prisma.payment.upsert({
      where: {
        landPlotId_year_month: {
          landPlotId: plot.id,
          year,
          month,
        },
      },
      update: {},
      create: {
        landPlotId: plot.id,
        year,
        month,
        status: isPaid ? "lunas" : "belum_lunas",
        paymentDate: isPaid ? new Date() : null,
        markedBy: isPaid ? pamong1.id : null,
      },
    });
  }

  console.log("Payments seeded");
  console.log("Seeding complete!");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
