# Austin Clinician Circle

A membership network for licensed therapists in Austin, TX — consultation, referrals, resources, and continuing education. Founded by Sarah Arnold, LPC-S (Restored Family Counseling). This serves therapists, not their clients.

---

## Tech Stack

- **Framework:** Next.js 16 (App Router, Turbopack)
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4 + CSS custom properties (design tokens in `app/globals.css`)
- **Database:** PostgreSQL via Prisma ORM (schema is ready; see [Database](#database) below)
- **Auth:** Clerk, with a cookie-based mock sign-in fallback for local dev
- **Payments:** Stripe (sandbox-mode ready)
- **Email:** Resend
- **PDF generation:** Robolly (CEU certificates), @react-pdf/renderer (lead-magnet playbook)

---

## Getting Started

### Prerequisites

- Node.js 20+
- npm

### Install & Run

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

**No environment variables are required to run locally.** Every integration (Clerk, Stripe, Resend, Robolly, the database) has a graceful fallback — the app runs entirely on mock data and a demo cookie-based sign-in until you configure real credentials. Copy `.env.example` to `.env.local` and fill in only the integrations you're actively testing.

### Production build

```bash
npm run build
npx next start
```

(`npm run start` runs a standalone-build script intended for containerized deploys — see `scripts/start-standalone.mjs`. For a quick local production check, use `npx next start` directly against the regular `npm run build` output.)

---

## Database

The Prisma schema (`prisma/schema.prisma`) models the full data layer — users, clinician profiles, subscriptions, applications, certificates, resources, events/RSVPs, network actions, and leads — even though most pages currently read from mock arrays in-file. Every write path that touches Prisma (certificates, profile saves, network actions, newsletter signups) checks `hasDatabaseConfig` / `hasClerkCredentials` first and no-ops safely when they aren't set, so nothing breaks in demo mode.

To go live: provision a Postgres database (e.g. Railway), set `DATABASE_URL`, then run:

```bash
npx prisma generate
npx prisma migrate deploy
```

No further code changes are needed for the routes that already write through Prisma.

---

## Project Structure

```
app/
  (public)/           Marketing site — /, /who-we-are, /what-we-offer, /find-a-clinician,
                       /join, /leadmagnet, /privacy, /terms
  (auth)/              /sign-in, /sign-up
  (dashboard)/         Member portal — /dashboard/*
  (standalone)/        /coming-soon (unlisted invite page)
  api/                 Route handlers (leads, applications, profile, network actions,
                       newsletter, certificates, Stripe)
(admin)/                Admin portal — /admin/*
components/
  ui/                  Hand-rolled design-system primitives (Button, Card, Badge, Toggle, ...)
  ui/shadcn/            shadcn/ui (Base UI) primitives used by a few ported blocks
  layout/               Nav, footer, mobile side panel
  landing/, auth/, billing/, cards/
lib/                    auth, env, prisma, stripe, robolly, ics, relativeDates, events
prisma/                 Database schema
docs/                   Design docs, PRD, system design
public/                 Static assets
```

---

## Routes

| Route | Description |
|---|---|
| `/` | Homepage — hero, why Austin Clinician Circle exists, membership carousel, pricing, testimonials |
| `/who-we-are` | Founder story, origin, values |
| `/what-we-offer` | Membership benefits, pricing, FAQ |
| `/find-a-clinician` | Public clinician directory (coming soon) |
| `/join` | Membership application (multi-step, writes to `/api/application`) |
| `/leadmagnet` | Free practice-playbook opt-in (writes to `/api/leads`) |
| `/privacy`, `/terms` | Legal |
| `/sign-in`, `/sign-up` | Auth (Clerk, or mock sign-in when unconfigured) |
| `/dashboard` | Member overview |
| `/dashboard/free` | Free-tier preview (no auth gate) |
| `/dashboard/{billing,events,files,network,profile,resources}` | Paid-member sections |
| `/admin` | Admin overview (stats/charts derived from the other admin pages) |
| `/admin/{members,applications,events,resources}` | Admin management tables |

**Note:** in demo mode (no Clerk credentials), `/admin` has no authentication gate — set `CLERK_*` and `CLERK_ADMIN_EMAILS` before deploying anywhere real member data would be exposed.

---

## Design System

- **Fonts:** Playfair Display (serif, headings) + DM Sans (sans, body)
- **Colors:** Sage green primary, amber accent, cream/parchment surfaces — all via CSS custom properties in `app/globals.css`, not raw hex in JSX
- Full spec in `docs/design-system.md`
