# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

> **Status: greenfield.** As of this writing the repository is empty — no code has been scaffolded yet. This file documents the *intended* architecture agreed with the owner so that the first implementation stays consistent. Update it to reflect reality once code exists, and remove this notice.

## What this project is

An airport transfer / VIP chauffeur booking website for the Stuttgart region (modeled on the structure of stuttgartflughafentransfer.de, but built from scratch as a custom app rather than WordPress). Core user flow: visitor enters pickup + destination + date/time + vehicle, gets an **instant calculated price**, and submits a booking.

Primary market is German-speaking (Stuttgart + surrounding cities: Frankfurt, München, Berlin, Düsseldorf, Hamburg, Köln, Zürich). The UI is multilingual (DE / EN / TR) with German as default.

## Intended stack

- **Next.js (App Router) + TypeScript** — frontend and API in one project
- **Tailwind CSS** for styling; **Framer Motion** for animation
- **react-hook-form + zod** for forms and validation
- **next-intl** for i18n via a `[locale]` route segment (`de` default, `en`, `tr`)
- **Prisma + PostgreSQL (Supabase)** for persistence
- **Google Maps Places + Distance Matrix APIs** for address autocomplete and distance/duration
- Email via **Resend** for booking notifications (to admin) and confirmation (to customer)
- **Protected admin panel** (single-admin auth) to list bookings and update their status
- Deploy: **Vercel** (app) + **Supabase** (DB)

**Payment is out of scope: fares are paid in the car (cash/card). There is no online payment / Stripe.** Do not add payment collection unless the owner explicitly changes this decision.

## Architecture (the parts that span multiple files)

The system has three tiers that must stay in sync:

1. **Booking UI** (`components/BookingForm.tsx`, `PriceCalculator.tsx`) collects trip inputs and shows a live price.
2. **Quote API** (`app/api/quote/`) takes pickup/destination/vehicle/time and returns a price. It calls the Maps helpers in `lib/maps.ts` for distance, then the **pricing engine** in `lib/pricing.ts`.
3. **Booking API** (`app/api/booking/`) persists the booking (Prisma) and sends confirmation email.

**The pricing engine (`lib/pricing.ts`) is the heart of the app.** Price is computed as:

```
price = baseFare
      + (distanceKm × perKmRate × vehicleMultiplier)
      + nightSurcharge   (22:00–06:00)
      + airportFee
```

The fleet has **three tiers**, each with a price multiplier: **Business** (E-Class, ~3 pax) ×1.0, **Van / V-Class** (~7 pax) ×1.4, **Sprinter** (~16 pax) ×1.8. These rates and multipliers live in DB (`pricing_rules`, `vehicles` tables) — **never hardcode them in components**, because both the client-side `PriceCalculator` preview and the server-side `quote` endpoint must produce the same number. Treat the server `quote` result as authoritative; the client preview is a UX convenience only.

### Route structure

```
app/[locale]/         → de | en | tr
  page.tsx            → home (hero + booking form)
  hakkimizda|about/   → about
  hizmetler/[slug]/   → services: airport / event(VIP limo) / trade-show / hourly
  araclar/            → fleet
  blog/[slug]/        → SEO blog (static MDX)
  iletisim/           → contact
  admin/              → protected: booking list + status updates
app/api/quote/        → price calculation
app/api/booking/      → save booking + email
```

The four services (all in scope) are: **airport transfer** (primary), **event / VIP limousine**, **trade-show / corporate**, and **hourly chauffeur**.

### Data model (core tables)

`bookings`, `vehicles`, `pricing_rules`, `routes` (optional fixed-price city pairs that override the distance calculation).

## Conventions specific to this project

- **Money:** store and compute prices in integer cents (EUR); never use floats for currency.
- **i18n:** no user-facing string literals in components — all copy goes through next-intl message catalogs, keyed per locale. German is the fallback locale.
- **Content is static:** blog posts and service copy live in the repo (MDX/code), not a CMS. There is no CMS integration.
- **Secrets:** Google Maps keys, Supabase keys, Resend key, and the admin credential all live in `.env.local` (never committed). The Maps *browser* key (Places autocomplete) is restricted by HTTP referrer; the *server* key (Distance Matrix) is separate and unrestricted-by-referrer but IP/API-restricted.
- **Fixed routes vs. metered:** if a `routes` row matches the pickup/destination pair, use its fixed price instead of the metered `distanceKm` calculation.

## Commands

_None yet — project is not scaffolded. Once created with `create-next-app`, expect the standard:_

- `npm run dev` — local dev server
- `npm run build` / `npm run start` — production build & serve
- `npm run lint` — ESLint
- `npx prisma migrate dev` — apply DB migrations locally
- `npx prisma studio` — inspect the database

Fill in the real test command here once a test runner is added.
