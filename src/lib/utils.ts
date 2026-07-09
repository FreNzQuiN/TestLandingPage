import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function sanitizeSearch(input: string | null): string | null {
  if (!input) return null;

  const sanitized = input
    .trim()
    .slice(0, 100)
    .replace(/[<>"'`;]/g, "");

  return sanitized || null;
}

export function maskNik(nik: string | null | undefined): string | null {
  if (!nik || nik.length <= 4) return nik ?? null;
  return "*".repeat(nik.length - 4) + nik.slice(-4);
}
