import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { StatsOverview } from "@/components/pbb/stats-overview";
import { BlokChart } from "@/components/dashboard/chart";
import { ExportButton } from "@/components/dashboard/export-button";
import { fetchPbbStats } from "@/lib/pbb-queries";

export default async function KadesPage() {
  const session = await auth();
  if (!session) redirect("/login");

  const year = new Date().getFullYear();
  const month = new Date().getMonth() + 1;
  const stats = await fetchPbbStats(year, month);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Dashboard Kepala Desa</h1>
          <p className="text-muted-foreground">Ringkasan PBB Desa Tulungrejo</p>
        </div>
        <ExportButton />
      </div>

      <StatsOverview stats={stats.overallStats} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="rounded-lg border bg-card p-4">
          <h2 className="font-semibold mb-4">Tren Pembayaran</h2>
          <BlokChart data={stats.monthlyTrend} />
        </div>
        <div className="rounded-lg border bg-card p-4">
          <h2 className="font-semibold mb-4">Status per Blok</h2>
          <BlokChart data={stats.blokStats} />
        </div>
      </div>

      <div className="rounded-lg border bg-card p-4">
        <h2 className="font-semibold mb-4">Semua Blok</h2>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-muted/50">
              <th className="p-3 text-left font-medium">Blok</th>
              <th className="p-3 text-right font-medium">Total</th>
              <th className="p-3 text-right font-medium">Lunas</th>
              <th className="p-3 text-right font-medium">Belum</th>
              <th className="p-3 text-right font-medium">%</th>
            </tr>
          </thead>
          <tbody>
            {stats.blokStats.map((b) => (
              <tr
                key={b.blok}
                className="border-b last:border-b-0 hover:bg-muted/30"
              >
                <td className="p-3">{b.blok}</td>
                <td className="p-3 text-right">
                  {b.totalPlots.toLocaleString("id-ID")}
                </td>
                <td className="p-3 text-right">
                  {b.paid.toLocaleString("id-ID")}
                </td>
                <td className="p-3 text-right">
                  {b.unpaid.toLocaleString("id-ID")}
                </td>
                <td className="p-3 text-right">{b.percentage.toFixed(1)}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
