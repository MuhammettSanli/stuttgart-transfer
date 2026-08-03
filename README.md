# Stuttgart Flughafen Transfer

A custom **airport-transfer / VIP chauffeur booking website** for the Stuttgart region. Visitors enter a pickup and destination, pick a date/time and a vehicle, get an **instant, distance-based fixed price**, and submit a booking. A protected admin panel lets the operator manage and respond to those bookings.

Built from scratch as a modern web app (not WordPress). Multilingual **DE / EN / TR** with German as the default.

> **Payment is out of scope by design.** Fares are paid in the car (cash or card). There is no online payment / Stripe integration.

---

## Features

- **Instant fare calculation** – live price from real driving distance (Google Distance Matrix) via a server-authoritative pricing engine.
- **3-step booking wizard** – (1) trip & price → (2) extras → (3) contact & finish.
- **Paid extras** – in-car minibar (water, cola, soda, juice, beer, wine, prosecco) added to the total; free child seats by age (infant / child / booster).
- **Fixed city routes** – flat prices for long-distance city pairs override the metered calculation.
- **Three-tier fleet** – Business (E-Class), First Class (S-Class), Van (V-Class), Sprinter – each with its own price multiplier.
- **Multilingual (DE / EN / TR)** – all copy via `next-intl` message catalogs; German is the fallback.
- **Admin panel** – single-admin login, booking list with status workflow (New → Confirmed → Done / Cancelled), live search, and one-click **Call / WhatsApp / Email** replies with a ready-made, localized confirmation message.
- **Email notifications** – operator notification + customer confirmation via Resend.
- **Abuse protection** – per-IP rate limiting (Postgres-backed, shared across serverless instances) on the quote, booking, contact and admin-login endpoints.

## Tech stack

| Area | Choice |
|------|--------|
| Framework | Next.js (App Router) + TypeScript |
| Styling | Tailwind CSS, Framer Motion |
| i18n | next-intl (`[locale]` route segment) |
| Database | PostgreSQL (Supabase) via Prisma |
| Maps | Google Maps Places (autocomplete) + Distance Matrix (distance/duration) |
| Email | Resend |
| Hosting | Vercel (app) + Supabase (DB) |

## Architecture

Three tiers must stay in sync:

1. **Booking UI** (`components/BookingForm.tsx`) collects trip inputs and shows a live price.
2. **Quote API** (`app/api/quote/`) calls `lib/maps.ts` for distance, then the pricing engine in `lib/pricing.ts`.
3. **Booking API** (`app/api/booking/`) re-quotes server-side (authoritative), persists the booking, and sends emails.

**The pricing engine (`lib/pricing.ts`) is the heart of the app:**

```
price = baseFare
      + (distanceKm × perKmRate × vehicleMultiplier)
      + nightSurcharge   (22:00–06:00)
      + airportFee
      + paid extras (minibar)
```

Rates, multipliers and fixed routes live in the database (`pricing_rules`, `vehicles`, `routes`) — never hardcoded in components, so the client preview and the server quote always produce the same number. **The server quote is authoritative; the client preview is a UX convenience only.** All money is stored and computed in **integer cents (EUR)** — never floats.

## Project structure

```
src/
  app/[locale]/        de | en | tr localized pages
    page.tsx           home (hero + booking form)
    about, services/[slug], fleet, blog/[slug], contact
    admin/             protected: booking list + status + quick replies
  app/api/
    quote/             price calculation
    booking/           save booking + email
    contact/           contact form email
    admin/             login / logout / status update
  components/          UI (BookingForm, Header, admin/BookingsTable, …)
  lib/                 pricing.ts, maps.ts, quote-service.ts, email.ts,
                       auth.ts, validation.ts, extras.ts, rate-limit.ts, prisma.ts
  i18n/                next-intl routing/request/navigation
  config/site.ts       company contact details & service slugs
messages/{de,en,tr}.json   translation catalogs
prisma/schema.prisma + seed.ts
```

Core tables: `bookings`, `vehicles`, `pricing_rules`, `routes`, `rate_limits`.

## Getting started

**Prerequisites:** Node.js 18+, a Supabase (PostgreSQL) database, and Google Maps + Resend API keys.

```bash
# 1. Install dependencies
npm install

# 2. Configure environment
cp .env.example .env.local   # then fill in the values below

# 3. Set up the database
npm run db:migrate           # apply migrations
npm run db:seed              # seed vehicles, pricing rule, sample routes

# 4. Run the dev server
npm run dev                  # http://localhost:3000 (redirects to /de)
```

### Environment variables (`.env.local`)

| Variable | Purpose |
|----------|---------|
| `DATABASE_URL` / `DIRECT_URL` | Supabase Postgres connection strings |
| `NEXT_PUBLIC_GOOGLE_MAPS_BROWSER_KEY` | Places autocomplete (restrict by HTTP referrer) |
| `GOOGLE_MAPS_SERVER_KEY` | Distance Matrix (server-side; keep secret) |
| `RESEND_API_KEY` | Email delivery |
| `BOOKING_NOTIFY_EMAIL` | Where operator notifications are sent |
| `BOOKING_FROM_EMAIL` | Sender address (needs a verified Resend domain) |
| `ADMIN_USERNAME` / `ADMIN_PASSWORD` | Admin panel credentials |
| `ADMIN_SESSION_SECRET` | Signs the admin session cookie |
| `NEXT_PUBLIC_SITE_URL` | Canonical site URL (metadata, sitemap) |

Without `DATABASE_URL` the app still builds and renders, but `/api/quote` and `/api/booking` fail at runtime.

## Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Local dev server |
| `npm run build` / `npm run start` | Production build & serve |
| `npm run lint` | ESLint |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run db:migrate` | Apply Prisma migrations |
| `npm run db:seed` | Seed vehicles, pricing rule, routes |
| `npm run db:studio` | Inspect the database |

## Deployment

Deployed on **Vercel** (app) with **Supabase** (database). Pushing to `main` triggers an automatic deploy. Set the same environment variables in the Vercel project settings.

## Conventions

- **Money** is always integer cents (EUR); never floats.
- **No user-facing string literals** in components — all copy goes through `next-intl` catalogs.
- **Content is static** — blog posts and service copy live in the repo (no CMS).
- **Secrets** live only in `.env.local` / Vercel env — never committed.
