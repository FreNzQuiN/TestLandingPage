export type UserRole = "kepala_desa" | "pamong_pajak" | "jurnalis";

export interface User {
  id: number;
  email: string;
  name: string;
  role: UserRole;
}

export interface LandPlot {
  id: number;
  nop: string;
  ownerName: string;
  ownerNik?: string;
  address: string;
  villageName: string;
  kecamatan: string;
  blok: string;
  landArea?: number;
  buildingArea?: number;
  njopLand?: number;
  njopBuilding?: number;
  pbbAmount?: number;
}

export interface Payment {
  id: number;
  landPlotId: number;
  year: number;
  month: number;
  status: "lunas" | "belum_lunas";
  paymentDate?: Date;
  markedBy?: number;
  notes?: string;
}

export interface PaymentWithPlot extends Payment {
  landPlot: LandPlot;
}

export interface PBBStats {
  totalPlots: number;
  totalPaid: number;
  totalUnpaid: number;
  percentage: number;
  totalTarget: number;
  totalRealization: number;
}

export interface BlokStats {
  blok: string;
  totalPlots: number;
  paid: number;
  unpaid: number;
  percentage: number;
}

export interface ArticleFrontmatter {
  title: string;
  slug: string;
  date: string;
  author: string;
  category: string;
  excerpt: string;
  coverImage?: string;
  tags?: string[];
  published: boolean;
}

export interface Article extends ArticleFrontmatter {
  content: string;
}

export interface VillageProfile {
  name: string;
  body: string;
}

export interface HeadMessage {
  name: string;
  title: string;
  body: string;
}

export interface OrgStructureMember {
  position: string;
  name: string;
  photo?: string;
  period?: string;
}

export interface OrgStructure {
  members: OrgStructureMember[];
}

export interface ContactInfo {
  address: string;
  phone: string;
  email: string;
  socialMedia?: { platform: string; url: string }[];
}

export interface KadesDashboard {
  overallStats: PBBStats;
  blokStats: BlokStats[];
  monthlyTrend: MonthlyTrend[];
  topBlok: BlokStats[];
  bottomBlok: BlokStats[];
}

export interface PamongDashboard {
  assignedBlok: string;
  blokStats: BlokStats;
  recentPayments: PaymentWithPlot[];
  unpaidPlots: LandPlot[];
}

export interface JurnalisDashboard {
  totalArticles: number;
  publishedArticles: number;
  draftArticles: number;
  recentArticles: Article[];
}

export interface MonthlyTrend {
  month: string;
  paid: number;
  unpaid: number;
  percentage: number;
}

export interface MapBlok {
  id: string;
  name: string;
  coordinates: [number, number][];
  status: "lunas" | "sebagian" | "belum";
  stats: BlokStats;
}

export type Category =
  "Politik" | "Budaya" | "Ekonomi" | "Pembangunan" | "Sosial";
