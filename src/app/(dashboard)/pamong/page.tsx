import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { StatsOverview } from "@/components/pbb/stats-overview";
import { PlotList } from "@/components/pbb/plot-list";
import { prisma } from "@/lib/prisma";
import { fetchPbbStats, fetchPlotsByBlok } from "@/lib/pbb-queries";

export default async function PamongPage() {
  const session = await auth();
  if (!session) redirect("/login");

  const userId = Number(session.user?.id);
  const user = userId
    ? await prisma.user.findUnique({
        where: { id: userId },
        select: { assignedBlok: true },
      })
    : null;

  const userBlok = user?.assignedBlok;
  if (!userBlok) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Dashboard Pamong Pajak</h1>
          <p className="text-destructive mt-1">
            Anda belum ditugaskan ke blok tertentu. Hubungi Kepala Desa.
          </p>
        </div>
      </div>
    );
  }

  const year = new Date().getFullYear();
  const month = new Date().getMonth() + 1;
  const [stats, plotData] = await Promise.all([
    fetchPbbStats(year, month),
    fetchPlotsByBlok({ blok: userBlok, limit: 50 }),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Dashboard Pamong Pajak</h1>
        <p className="text-muted-foreground">Monitoring PBB — {userBlok}</p>
      </div>

      <StatsOverview stats={stats.overallStats} />

      <PlotList initialData={plotData.data} />
    </div>
  );
}
