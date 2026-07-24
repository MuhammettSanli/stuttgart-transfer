import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // --- Fleet: three tiers (multiplier stored ×1000) ---
  const vehicles = [
    {
      slug: 'business',
      name: 'Business (E-Class)',
      maxPassengers: 3,
      maxLuggage: 3,
      multiplierMilli: 1000, // ×1.0
      sortOrder: 1,
    },
    {
      slug: 'van',
      name: 'Van (V-Class)',
      maxPassengers: 7,
      maxLuggage: 7,
      multiplierMilli: 1400, // ×1.4
      sortOrder: 2,
    },
    {
      slug: 'sprinter',
      name: 'Sprinter',
      maxPassengers: 16,
      maxLuggage: 16,
      multiplierMilli: 1800, // ×1.8
      sortOrder: 3,
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
    baseFareCents: 2000, // €20 base
    perKmRateCents: 180, // €1.80 / km (before vehicle multiplier)
    airportFeeCents: 500, // €5 airport handling
    nightSurchargeCents: 1000, // €10 night surcharge
    nightStartHour: 22,
    nightEndHour: 6,
    minFareCents: 3900, // €39 minimum fare
    currency: 'EUR',
    active: true,
  };
  if (existingRule) {
    await prisma.pricingRule.update({ where: { id: existingRule.id }, data: ruleData });
  } else {
    await prisma.pricingRule.create({ data: ruleData });
  }

  // --- Sample fixed-price routes (Business-tier base price, in cents) ---
  const routes = [
    { fromCity: 'Stuttgart', toCity: 'Frankfurt', fixedPriceCents: 29900 },
    { fromCity: 'Stuttgart', toCity: 'München', fixedPriceCents: 34900 },
    { fromCity: 'Stuttgart', toCity: 'Zürich', fixedPriceCents: 39900 },
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
