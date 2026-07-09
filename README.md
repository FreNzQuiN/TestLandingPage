# Website Desa Tulungrejo

Website resmi Desa Tulungrejo, Kecamatan Wates, Kabupaten Blitar.

## Fitur Utama

### 1. Portal Warga (Publik)

- Artikel berita desa terbaru
- Profil desa, struktur organisasi, kontak
- Tidak perlu login

### 2. Dashboard Pamong Pajak

- Monitoring PBB per blok
- Tandai pembayaran per warga (centang satu per satu)
- Statistik blok: lunas vs belum lunas
- Bulk operations

### 3. Dashboard Kepala Desa

- Ringkasan statistik PBB desa
- Peta interaktif dengan color-coded status blok
- Grafik tren pembayaran
- Export laporan (Excel/PDF)

### 4. Dashboard Jurnalis

- Manajemen artikel (CRUD)
- Rich text editor
- Publish langsung tanpa approval

## Tech Stack

| Layer      | Technology                    |
| ---------- | ----------------------------- |
| Framework  | Next.js 16+ (App Router)      |
| Language   | TypeScript                    |
| Database   | TiDB Cloud (MySQL-compatible) |
| ORM        | Prisma                        |
| Auth       | NextAuth.js                   |
| Content    | Decap CMS (artikel saja)      |
| Styling    | Tailwind CSS + shadcn/ui      |
| Maps       | Leaflet (react-leaflet)       |
| Charts     | Recharts                      |
| Deployment | Vercel                        |

## Roles

| Role             | Akses                             | Login |
| ---------------- | --------------------------------- | ----- |
| **User/Warga**   | Portal publik (artikel, profil)   | Tidak |
| **Jurnalis**     | Dashboard artikel + publik        | Ya    |
| **Pamong Pajak** | Dashboard PBB + publik            | Ya    |
| **Kepala Desa**  | Dashboard lengkap + peta + publik | Ya    |

## Getting Started

### Prerequisites

- Node.js 18+
- npm
- TiDB Cloud account (free tier)
- GitHub account

### Installation

```bash
# Clone repository
git clone https://github.com/username/desa-tulungrejo.git
cd desa-tulungrejo

# Install dependencies
npm install

# Setup environment
cp .env.example .env.local
# Edit .env.local with your credentials

# Setup database
npx prisma db push
npx prisma db seed

# Run development server
npm run dev
```

### Environment Variables

```env
# TiDB Cloud
DATABASE_URL="mysql://username:password@host:port/database?sslaccept=strict"

# NextAuth.js (v5 — uses AUTH_ prefix, not NEXTAUTH_)
AUTH_SECRET="your-secret-key-here"
# AUTH_URL is auto-detected in production; only set for local dev if needed
# AUTH_URL="http://localhost:3000"

# Decap CMS — no env vars needed (config in public/admin/config.yml)
# For production: enable Git Gateway in your hosting provider (Vercel/Netlify)
```

### Test Accounts

| Name             | Email                  | Password    | Role         |
| ---------------- | ---------------------- | ----------- | ------------ |
| Kades Tulungrejo | kades@tulungrejo.id    | password123 | kepala_desa  |
| Pamong Blok 1    | pamong1@tulungrejo.id  | password123 | pamong_pajak |
| Pamong Blok 2    | pamong2@tulungrejo.id  | password123 | pamong_pajak |
| Jurnalis Desa    | jurnalis@tulungrejo.id | password123 | jurnalis     |

## Project Structure

```
desa-tulungrejo/
├── prisma/          ← Database schema
├── content/         ← Decap CMS articles (MDX)
├── public/
│   └── admin/       ← Decap CMS config
├── src/
│   ├── app/         ← Next.js routes
│   │   ├── (auth)/  ← Login page
│   │   ├── (dashboard)/ ← Role-based dashboards
│   │   ├── (public)/ ← Public pages
│   │   └── api/     ← API routes
│   ├── components/  ← React components
│   ├── lib/         ← Utilities
│   ├── hooks/       ← Custom hooks
│   └── types/       ← TypeScript types
├── proxy.ts         ← Route protection (Next.js 16)
└── docs/            ← Documentation
```

## Documentation

- [Admin Guide](docs/admin-guide.md) — Panduan untuk perangkat desa

## Development

```bash
# Development
npm run dev

# Build
npm run build

# Start production
npm start

# Lint
npm run lint

# Type check
npx tsc --noEmit

# Database push
npx prisma db push

# Database seed
npx prisma db seed
```

## Deployment

Project ini di-deploy ke Vercel. Setiap push ke branch `main` akan trigger automatic deployment.

### Vercel Setup

1. Import repository ke Vercel
2. Set environment variables
3. Deploy

## License

MIT License

## Contact

Desa Tulungrejo
Kecamatan Wates, Kabupaten Blitar
Jawa Timur, Indonesia
