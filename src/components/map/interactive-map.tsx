"use client";

import dynamic from "next/dynamic";
import type { MapBlok } from "@/lib/types";
import { BlokBolygon } from "./blok-polygon";
import { MapLegend } from "./map-legend";

const MapContainer = dynamic(
  () => import("react-leaflet").then((m) => m.MapContainer),
  { ssr: false },
);

const TileLayer = dynamic(
  () => import("react-leaflet").then((m) => m.TileLayer),
  { ssr: false },
);

interface InteractiveMapProps {
  bloks: MapBlok[];
}

export function InteractiveMap({ bloks }: InteractiveMapProps) {
  return (
    <div className="relative h-[600px] w-full rounded-lg border bg-card overflow-hidden">
      <MapContainer
        center={[-8.08, 112.22]}
        zoom={14}
        className="h-full w-full"
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {bloks.map((blok) => (
          <BlokBolygon key={blok.id} blok={blok} />
        ))}
      </MapContainer>
      <MapLegend />
    </div>
  );
}
