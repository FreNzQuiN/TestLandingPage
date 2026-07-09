"use client";

import { useState, useCallback } from "react";

interface PlotData {
  id: number;
  nop: string;
  ownerName: string;
  address: string;
  blok: string;
  pbbAmount: number | null;
  currentStatus: string;
}

interface PlotListProps {
  initialData: PlotData[];
}

export function PlotList({ initialData }: PlotListProps) {
  const [plots, setPlots] = useState(initialData);
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  const toggleSelect = useCallback((id: number) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const toggleAll = useCallback(() => {
    if (selected.size === plots.length) {
      setSelected(new Set());
    } else {
      setSelected(new Set(plots.map((p) => p.id)));
    }
  }, [selected.size, plots]);

  const markAsPaid = useCallback(async () => {
    if (selected.size === 0) return;
    setLoading(true);

    const res = await fetch("/api/pbb/payments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        landPlotIds: Array.from(selected),
        year: new Date().getFullYear(),
        month: new Date().getMonth() + 1,
        status: "lunas",
      }),
    });

    if (res.ok) {
      setPlots((prev) =>
        prev.map((p) =>
          selected.has(p.id) ? { ...p, currentStatus: "lunas" } : p,
        ),
      );
      setSelected(new Set());
    }

    setLoading(false);
  }, [selected]);

  const filtered = plots.filter(
    (p) =>
      p.nop.toLowerCase().includes(search.toLowerCase()) ||
      p.ownerName.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="rounded-lg border bg-card">
      <div className="p-4 border-b flex items-center justify-between gap-4">
        <input
          type="text"
          placeholder="Cari NOP atau nama..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 max-w-sm rounded-md border bg-background px-3 py-1.5 text-sm outline-none focus:ring-2 focus:ring-ring"
        />
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">
            {selected.size} dipilih
          </span>
          <button
            onClick={markAsPaid}
            disabled={selected.size === 0 || loading}
            className="rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
          >
            {loading ? "Memproses..." : "Tandai Lunas"}
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-muted/50">
              <th className="p-3 text-left">
                <input
                  type="checkbox"
                  checked={selected.size === plots.length && plots.length > 0}
                  onChange={toggleAll}
                  className="rounded"
                />
              </th>
              <th className="p-3 text-left font-medium">NOP</th>
              <th className="p-3 text-left font-medium">Nama Pemilik</th>
              <th className="p-3 text-left font-medium">Alamat</th>
              <th className="p-3 text-right font-medium">PBB</th>
              <th className="p-3 text-center font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((plot) => (
              <tr
                key={plot.id}
                className="border-b last:border-b-0 hover:bg-muted/30"
              >
                <td className="p-3">
                  <input
                    type="checkbox"
                    checked={selected.has(plot.id)}
                    onChange={() => toggleSelect(plot.id)}
                    disabled={plot.currentStatus === "lunas"}
                    className="rounded"
                  />
                </td>
                <td className="p-3 font-mono text-xs">{plot.nop}</td>
                <td className="p-3">{plot.ownerName}</td>
                <td className="p-3 text-muted-foreground">{plot.address}</td>
                <td className="p-3 text-right">
                  {plot.pbbAmount
                    ? new Intl.NumberFormat("id-ID", {
                        style: "currency",
                        currency: "IDR",
                        minimumFractionDigits: 0,
                      }).format(plot.pbbAmount)
                    : "-"}
                </td>
                <td className="p-3 text-center">
                  <span
                    className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${
                      plot.currentStatus === "lunas"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {plot.currentStatus === "lunas" ? "Lunas" : "Belum"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filtered.length === 0 && (
        <div className="p-8 text-center text-muted-foreground">
          Tidak ada data ditemukan
        </div>
      )}
    </div>
  );
}
