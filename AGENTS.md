# AGENTS.md — Desa Tulungrejo

## Purpose

This file is a compass, not a map. It documents stable architectural decisions and conventions unique to this project. For agent behavior rules, see workspace `~/.config/opencode/AGENTS.md`.

## Project

**Desa Tulungrejo** — village website with PBB (property tax) monitoring for officials and public article publishing for citizens.

**Stack:** Next.js 16 (App Router) + TypeScript + Prisma + TiDB Cloud + NextAuth v5 + Decap CMS + Tailwind + shadcn/ui + Leaflet

**Users:** Warga (public), Pamong Pajak (tax officials), Kepala Desa (village head), Jurnalis (journalists)

---

## Architecture Decisions

### Route Groups

- `(public)` — public pages, no auth required
- `(auth)` — login page
- `(dashboard)` — role-gated segments (`/kepaladesa`, `/pamong`, `/jurnalis`)

### Proxy Pattern (Next.js 16)

- `src/proxy.ts` replaces `middleware.ts`
- Edge-level rate limiting applied before route handlers
- Route-level rate limiting as defense in depth

### Dual Auth System

- **NextAuth v5 Credentials (JWT)** for officials — email/password login
- **Decap CMS Git Gateway** for journalists — separate auth, separate trust domain
- Why separated: different trust models, different access patterns

### Blok-Level Scoping

- Pamong can only see their assigned blok
- Enforced server-side in every API handler — never from client input
- Why: prevents horizontal privilege escalation

### Database

- TiDB Cloud (MySQL-compatible) via PrismaMariaDb driver adapter
- `relationMode = "prisma"` — no foreign keys at DB level, enforced by Prisma
- In-memory rate limiting — no Redis, resets on restart (acceptable for village website scale)
- Why simplicity matches threat level

### Article System

- MDX files in `content/articles/` with gray-matter frontmatter
- No MDX compiler — manual markdown rendering in page components

---

## Conventions

- **No code comments.** Code is self-documenting through naming and structure.
- **`@/*` path alias** → `./src/*`
- **shadcn/ui** new-york style
- **Security headers** enforced in `next.config.ts` (CSP, HSTS in production, X-Frame-Options DENY)
- **Passwords** hashed with bcryptjs
- **Cookies:** sameSite lax, httpOnly, secure in production

---

## Production & Development Concerns

### Dependency Policy

- **Use latest stable versions.** Pin to `^` range, not exact. Upgrade when stable releases land.
- **Prefer lightweight deps.** If a library adds >50KB gzipped, justify it or find an alternative.
- **No feature creep in deps.** Each new dependency must solve a real problem. Check if existing deps already cover the need.
- **Audit before adding.** Check bundle size, maintenance status, security advisories (`npm audit`), and alternatives before installing.

### Performance Budget

- **Mobile-first.** Pamong works from phone in the field. Desktop for kades.
- **Lazy load heavy components.** Map (Leaflet), charts (Recharts), PDF generation (jsPDF) — all dynamically imported where possible.
- **No unnecessary re-renders.** Server components by default, client components only when interactivity required.

### Security Baseline

- All API routes validate input at the boundary
- Role checks happen server-side, never trusting client-provided role
- Rate limiting at edge + route level
- Secrets in env vars only, never committed

### Deployment

- Netlify via `@netlify/plugin-nextjs`
- Build: `prisma generate && next build`
- No runtime config changes without env var updates
