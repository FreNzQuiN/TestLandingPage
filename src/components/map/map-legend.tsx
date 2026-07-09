const LEGEND_ITEMS = [
  { label: "Lunas", color: "#16a34a" },
  { label: "Sebagian (1-99%)", color: "#d97706" },
  { label: "Belum (0%)", color: "#dc2626" },
] as const;

export function MapLegend() {
  return (
    <div className="absolute bottom-4 left-4 z-[1000] bg-card border rounded-lg p-3 shadow-sm">
      {LEGEND_ITEMS.map((item) => (
        <div key={item.label} className="flex items-center gap-2 text-sm">
          <span
            className="inline-block h-3 w-3 rounded-full shrink-0"
            style={{ backgroundColor: item.color }}
          />
          {item.label}
        </div>
      ))}
    </div>
  );
}
