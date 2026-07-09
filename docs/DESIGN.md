# DESIGN.md — Dashboard Design System

## References

| Source                                                                                              | Relevance                                                                                       |
| --------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------- |
| [balongbesuk/pbb-app](https://github.com/balongbesuk/pbb-app)                                       | Same stack (Next.js 16 + Prisma + Leaflet), PBB-specific dashboard, GIS heatmap, role hierarchy |
| [anh-tuan/next-shadcn-dashboard-starter](https://github.com/anh-tuan/next-shadcn-dashboard-starter) | Dashboard layout, feature-based folder structure, shadcn patterns                               |
| [kenneth-loto/real-property-tax-mapping](https://github.com/kenneth-loto/real-property-tax-mapping) | Leaflet color-coded polygon pattern for tax parcels                                             |
| [GIS PBB Kab. Batang](https://gis-pbb.batangkab.go.id/)                                             | Real Indonesian government GIS-PBB reference UI                                                 |
| [SmartMap Intelligence System](https://www.peta.25codes.com/)                                       | Drill-down PBB map from kabupaten to individual bidang                                          |

---

## Design Principles

1. **Data-dense but scannable** — Pamong sees 20+ plots per page; density is a feature, not a bug
2. **Color = status** — Green/lunas, red/belum, yellow/sebagian. No ambiguous palettes
3. **Mobile-first for pamong** — Pamong works from phone in the field. Desktop for kades
4. **Bahasa Indonesia everywhere** — No English in UI labels
5. **Minimal cognitive load** — Non-technical users (village officials). Large click targets, clear hierarchy

---

## Color System

### Semantic Colors (Payment Status)

| Token               | Light     | Dark      | Usage                    |
| ------------------- | --------- | --------- | ------------------------ |
| `--status-lunas`    | `#16a34a` | `#4ade80` | Paid plot, success badge |
| `--status-belum`    | `#dc2626` | `#f87171` | Unpaid plot, error badge |
| `--status-sebagian` | `#d97706` | `#fbbf24` | Partially paid blok      |

### Map Polygon Colors

| Status           | Fill Color | Fill Opacity | Stroke    |
| ---------------- | ---------- | ------------ | --------- |
| Lunas            | `#16a34a`  | 0.35         | `#16a34a` |
| Sebagian (1-99%) | `#d97706`  | 0.35         | `#d97706` |
| Belum (0%)       | `#dc2626`  | 0.35         | `#dc2626` |

### Dashboard Neutral Palette

Uses shadcn `neutral` base. Earthy accent: `oklch(0.37 0.08 150)` (forest green) for primary actions.

---

## Typography

| Element       | Size              | Weight   | Usage                           |
| ------------- | ----------------- | -------- | ------------------------------- |
| Page title    | `text-2xl` (24px) | Bold     | `<h1>` per page                 |
| Section title | `text-lg` (18px)  | Semibold | Card headers, table groups      |
| Stat value    | `text-2xl` (24px) | Bold     | KPI cards                       |
| Body          | `text-sm` (14px)  | Normal   | Table cells, descriptions       |
| Label         | `text-xs` (12px)  | Medium   | Stat card labels, table headers |
| Badge         | `text-xs` (12px)  | Semibold | Status badges                   |

Font: Geist Sans (via `next/font`). Monospace: Geist Mono (NOP display).

---

## Layout Architecture

### Public Layout

```
┌──────────────────────────────────────┐
│ Header (sticky, h-14)               │
│ Logo    [Beranda] [Artikel] ... [Masuk] │
├──────────────────────────────────────┤
│ Main content (container, max-w-7xl)  │
│ ...                                  │
├──────────────────────────────────────┤
│ Footer (3-col, border-t)            │
└──────────────────────────────────────┘
```

### Dashboard Layout

```
┌──────────────┬──────────────────────────────┐
│ Sidebar (w-64)│ Header (sticky, h-14)       │
│              │                              │
│ Logo + Role  │ [Breadcrumbs]    [User menu] │
│ ─────────── │ ├──────────────────────────────┤
│ Nav items    │ Main (p-6, overflow-auto)     │
│ (role-based) │                              │
│              │ ...                          │
│              │                              │
│ ─────────── │                              │
│ email        │                              │
│ [Keluar]     │                              │
└──────────────┴──────────────────────────────┘
```

Sidebar: Fixed 256px (desktop), Sheet overlay (mobile via hamburger in header).

---

## Component Specifications

### KPI Stat Card

```
┌─────────────────────┐
│ Total Plot           │  ← text-xs, muted-foreground
│ 2.898                │  ← text-2xl, font-semibold
└─────────────────────┘
```

6 cards per row on desktop, 3 on tablet, 2 on mobile.

### Payment Status Badge

```
Lunas:     bg-green-100 text-green-700     "Lunas"
Belum:     bg-red-100   text-red-700       "Belum"
Sebagian:  bg-yellow-100 text-yellow-700   "Sebagian"
```

### Data Table (Plot List)

| Column       | Width    | Align  | Format                                                          |
| ------------ | -------- | ------ | --------------------------------------------------------------- |
| ☑ Checkbox   | 40px     | center | Bulk select                                                     |
| NOP          | 140px    | left   | `font-mono text-xs`                                             |
| Nama Pemilik | flexible | left   | —                                                               |
| Alamat       | flexible | left   | `text-muted-foreground`                                         |
| PBB          | 120px    | right  | `Intl.NumberFormat("id-ID", {style:"currency",currency:"IDR"})` |
| Status       | 80px     | center | Badge component                                                 |

Row hover: `bg-muted/30`. Selected: `bg-muted/50`.

### Map Legend

```
┌──────────────────┐
│ ● Lunas           │  Green dot
│ ● Sebagian (1-99%)│  Yellow dot
│ ● Belum (0%)      │  Red dot
└──────────────────┘
```

Floating bottom-left on map, `bg-card border rounded-lg p-3 shadow-sm`.

---

## Role-Based Navigation

### Kepala Desa

| Label     | Icon      | Route             |
| --------- | --------- | ----------------- |
| Dashboard | BarChart3 | `/kepaladesa`     |
| Peta PBB  | Map       | `/kepaladesa/map` |

### Pamong Pajak

| Label     | Icon            | Route           |
| --------- | --------------- | --------------- |
| Dashboard | LayoutDashboard | `/pamong`       |
| Data Plot | TableProperties | `/pamong/plots` |

### Jurnalis

| Label     | Icon      | Route                |
| --------- | --------- | -------------------- |
| Dashboard | FileText  | `/jurnalis`          |
| Artikel   | Newspaper | `/jurnalis/articles` |

---

## Map Design (Leaflet)

### Center & Zoom

| Context       | Center            | Zoom  |
| ------------- | ----------------- | ----- |
| Desa overview | `[-8.08, 112.22]` | 14    |
| Blok detail   | Auto-fit bounds   | 15-16 |

### Polygon Interactions

- **Hover**: Increase opacity to 0.55, show tooltip with blok name + percentage
- **Click**: Navigate to blok detail or open modal with plot list
- **Mobile**: Touch opens bottom sheet with blok info

### Tile Layer

OpenStreetMap default. Attribution: `© OpenStreetMap contributors`.

### SSR Handling

```tsx
"use client";
import dynamic from "next/dynamic";
const MapContainer = dynamic(
  () => import("react-leaflet").then((m) => m.MapContainer),
  { ssr: false },
);
```

---

## Responsive Breakpoints

| Breakpoint | Width      | Sidebar       | Cards      | Table               |
| ---------- | ---------- | ------------- | ---------- | ------------------- |
| Mobile     | <768px     | Sheet overlay | 2-col grid | Card list (stacked) |
| Tablet     | 768-1024px | Sheet overlay | 3-col grid | Compact table       |
| Desktop    | >1024px    | Fixed sidebar | 6-col grid | Full table          |

---

## Loading States

| Context            | Pattern                                 |
| ------------------ | --------------------------------------- |
| Page load          | `<Skeleton>` matching content shape     |
| Table data         | Skeleton rows (5 rows × 6 cols)         |
| Map                | Gray box with centered spinner          |
| Stats cards        | Skeleton circle + line                  |
| Action (mark paid) | Button `disabled` + "Memproses..." text |

---

## Error States

| Context       | UI                                                       |
| ------------- | -------------------------------------------------------- |
| Auth required | Redirect to `/login`                                     |
| No data       | "Tidak ada data ditemukan" (centered, muted)             |
| API error     | Toast notification (bottom-right)                        |
| 404           | Full-page "404 — Halaman tidak ditemukan" with back link |
| 403           | "403 — Anda tidak memiliki akses" with back link         |

---

## Spacing & Layout Tokens

| Token                 | Value                 | Usage                        |
| --------------------- | --------------------- | ---------------------------- |
| Page padding          | `p-6` (24px)          | Main content area            |
| Card padding          | `p-4` (16px)          | Stat cards, chart containers |
| Table cell            | `p-3` (12px)          | All table cells              |
| Gap (grid)            | `gap-4` (16px)        | Stat card grid               |
| Section gap           | `space-y-6` (24px)    | Between page sections        |
| Border radius         | `rounded-lg` (0.5rem) | Cards, containers            |
| Border radius (badge) | `rounded-full`        | Status badges                |
