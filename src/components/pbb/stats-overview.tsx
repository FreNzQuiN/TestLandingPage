import type { PBBStats } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";

interface StatsOverviewProps {
  stats: PBBStats;
}

export function StatsOverview({ stats }: StatsOverviewProps) {
  const cards = [
    {
      label: "Total Plot",
      value: stats.totalPlots.toLocaleString("id-ID"),
    },
    {
      label: "Sudah Bayar",
      value: stats.totalPaid.toLocaleString("id-ID"),
    },
    {
      label: "Belum Bayar",
      value: stats.totalUnpaid.toLocaleString("id-ID"),
    },
    {
      label: "Persentase",
      value: `${stats.percentage.toFixed(1)}%`,
    },
    {
      label: "Target PBB",
      value: formatCurrency(stats.totalTarget),
    },
    {
      label: "Realisasi",
      value: formatCurrency(stats.totalRealization),
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      {cards.map((card) => (
        <div key={card.label} className="rounded-lg border bg-card p-4">
          <p className="text-xs text-muted-foreground">{card.label}</p>
          <p className="text-lg font-semibold mt-1">{card.value}</p>
        </div>
      ))}
    </div>
  );
}
