export const SITE_NAME = "Desa Tulungrejo";
export const SITE_DESCRIPTION =
  "Website resmi Desa Tulungrejo, Kecamatan Wates, Kabupaten Blitar";
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const NAV_ITEMS = [
  { label: "Beranda", href: "/" },
  { label: "Artikel", href: "/articles" },
  { label: "Profil", href: "/profile" },
  { label: "Struktur", href: "/structure" },
  { label: "Kontak", href: "/contact" },
] as const;

export const DASHBOARD_ROUTES = {
  kepaladesa: "/kepaladesa",
  pamong: "/pamong",
  jurnalis: "/jurnalis",
} as const;

export const CATEGORIES = [
  "Politik",
  "Budaya",
  "Ekonomi",
  "Pembangunan",
  "Sosial",
] as const;

export const PBB_MONTHS = [
  "Januari",
  "Februari",
  "Maret",
  "April",
  "Mei",
  "Juni",
  "Juli",
  "Agustus",
  "September",
  "Oktober",
  "November",
  "Desember",
] as const;
