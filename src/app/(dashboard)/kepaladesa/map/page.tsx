import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import type { MapBlok } from "@/lib/types";
import { MapClient } from "./map-client";
import { fetchPbbStats } from "@/lib/pbb-queries";

function toMapBlok(
  blok: {
    blok: string;
    totalPlots: number;
    paid: number;
    unpaid: number;
    percentage: number;
  },
  index: number,
): MapBlok {
  const baseLat = -8.08;
  const baseLng = 112.22;
  const offset = index * 0.005;

  const coordinates: [number, number][] = [
    [baseLat + offset, baseLng + offset],
    [baseLat + offset + 0.003, baseLng + offset],
    [baseLat + offset + 0.003, baseLng + offset + 0.003],
    [baseLat + offset, baseLng + offset + 0.003],
  ];

  let status: MapBlok["status"] = "belum";
  if (blok.percentage === 100) {
    status = "lunas";
  } else if (blok.percentage > 0) {
    status = "sebagian";
  }

  return {
    id: blok.blok,
    name: blok.blok,
    coordinates,
    status,
    stats: blok,
  };
}

export default async function MapPage() {
  const session = await auth();
  if (!session) redirect("/login");

  const year = new Date().getFullYear();
  const month = new Date().getMonth() + 1;
  const stats = await fetchPbbStats(year, month);
  const bloks: MapBlok[] = stats.blokStats.map(toMapBlok);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Peta PBB</h1>
        <p className="text-muted-foreground">
          Visualisasi status pembayaran per blok
        </p>
      </div>

      <MapClient bloks={bloks} />
    </div>
  );
}
