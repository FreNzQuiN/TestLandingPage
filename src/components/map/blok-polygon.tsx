"use client";

import { useState } from "react";
import { Polygon, Tooltip } from "react-leaflet";
import type { MapBlok } from "@/lib/types";

const STATUS_COLORS = {
  lunas: "#16a34a",
  sebagian: "#d97706",
  belum: "#dc2626",
} as const;

interface BlokBolygonProps {
  blok: MapBlok;
  onClick?: (blok: MapBlok) => void;
}

export function BlokBolygon({ blok, onClick }: BlokBolygonProps) {
  const [hovered, setHovered] = useState(false);

  const fillColor = STATUS_COLORS[blok.status];
  const fillOpacity = hovered ? 0.55 : 0.35;

  return (
    <Polygon
      positions={blok.coordinates}
      pathOptions={{
        fillColor,
        fillOpacity,
        color: fillColor,
        weight: 2,
      }}
      eventHandlers={{
        mouseover: () => setHovered(true),
        mouseout: () => setHovered(false),
        click: () => onClick?.(blok),
      }}
    >
      <Tooltip>
        {blok.name} — {blok.stats.percentage.toFixed(1)}%
      </Tooltip>
    </Polygon>
  );
}
