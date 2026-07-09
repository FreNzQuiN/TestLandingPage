"use client";

import { InteractiveMap } from "@/components/map/interactive-map";
import type { MapBlok } from "@/lib/types";

interface MapClientProps {
  bloks: MapBlok[];
}

export function MapClient({ bloks }: MapClientProps) {
  return <InteractiveMap bloks={bloks} />;
}
