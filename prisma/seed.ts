import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // --- Fleet: three tiers (multiplier stored ×1000) ---
  const vehicles = [
    {
      slug: 'business',
      name: 'Business (E-Klasse)',
      maxPassengers: 4,
      maxLuggage: 4,
      multiplierMilli: 1000, // ×1.0
      sortOrder: 1,
    },
    {
      slug: 'first',
      name: 'First Class (S-Klasse)',
      maxPassengers: 4,
      maxLuggage: 4,
      multiplierMilli: 1300, // ×1.3
      sortOrder: 2,
    },
    {
      slug: 'van',
      name: 'Van (V-Klasse)',
      maxPassengers: 8,
      maxLuggage: 8,
      multiplierMilli: 1400, // ×1.4
      sortOrder: 3,
    },
    {
      slug: 'sprinter',
      name: 'Sprinter',
      maxPassengers: 16,
      maxLuggage: 16,
      multiplierMilli: 1800, // ×1.8
      sortOrder: 4,
    },
  ];

  for (const v of vehicles) {
    await prisma.vehicle.upsert({
      where: { slug: v.slug },
      update: v,
      create: v,
    });
  }

  // --- Default pricing rule (all amounts in cents) ---
  const existingRule = await prisma.pricingRule.findFirst({ where: { name: 'default' } });
  const ruleData = {
    name: 'default',
    baseFareCents: 2500, // €25 base
    perKmRateCents: 200, // €2.00 / km (before vehicle multiplier)
    airportFeeCents: 600, // €6 airport handling
    nightSurchargeCents: 1000, // €10 night surcharge
    nightStartHour: 22,
    nightEndHour: 6,
    minFareCents: 4500, // €45 minimum fare
    currency: 'EUR',
    active: true,
  };
  if (existingRule) {
    await prisma.pricingRule.update({ where: { id: existingRule.id }, data: ruleData });
  } else {
    await prisma.pricingRule.create({ data: ruleData });
  }

  // --- Sample fixed-price routes (Business-tier base price, in cents) ---
  // Fixed one-way prices (Business tier), multiplied per vehicle. Distant
  // cities where metered would be far too expensive get a fixed fare.
  const routes = [
    { fromCity: 'Stuttgart', toCity: 'Frankfurt', fixedPriceCents: 29900 }, // ~210 km
    { fromCity: 'Stuttgart', toCity: 'München', fixedPriceCents: 34900 }, // ~220 km
    { fromCity: 'Stuttgart', toCity: 'Zürich', fixedPriceCents: 39900 }, // ~215 km (int'l)
    { fromCity: 'Stuttgart', toCity: 'Köln', fixedPriceCents: 52900 }, // ~360 km
    { fromCity: 'Stuttgart', toCity: 'Düsseldorf', fixedPriceCents: 59900 }, // ~410 km
    { fromCity: 'Stuttgart', toCity: 'Berlin', fixedPriceCents: 89900 }, // ~630 km
    { fromCity: 'Stuttgart', toCity: 'Hamburg', fixedPriceCents: 94900 }, // ~660 km
  ];
  for (const r of routes) {
    await prisma.route.upsert({
      where: { fromCity_toCity: { fromCity: r.fromCity, toCity: r.toCity } },
      update: r,
      create: r,
    });
  }

  console.log('Seed complete: %d vehicles, 1 pricing rule, %d routes', vehicles.length, routes.length);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
