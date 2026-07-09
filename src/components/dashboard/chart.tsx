"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface BlokChartProps {
  data: {
    blok?: string;
    month?: string;
    paid: number;
    unpaid: number;
    percentage: number;
  }[];
}

export function BlokChart({ data }: BlokChartProps) {
  const chartData = data.map((d) => ({
    name: d.blok ?? d.month ?? "",
    Lunas: d.paid,
    Belum: d.unpaid,
  }));

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" fontSize={12} />
        <YAxis fontSize={12} />
        <Tooltip />
        <Bar dataKey="Lunas" fill="#22c55e" radius={[4, 4, 0, 0]} />
        <Bar dataKey="Belum" fill="#ef4444" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
