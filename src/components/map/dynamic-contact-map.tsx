"use client";

import dynamic from "next/dynamic";

const ContactMap = dynamic(
  () => import("@/components/map/contact-map").then((m) => m.ContactMap),
  { ssr: false },
);

interface DynamicContactMapProps {
  center: [number, number];
}

export function DynamicContactMap({ center }: DynamicContactMapProps) {
  return <ContactMap center={center} />;
}
