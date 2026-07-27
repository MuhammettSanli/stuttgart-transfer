import { prisma } from './prisma';
import { getDistance, looksLikeAirport } from './maps';
import { calculateQuote, type PricingParams, type QuoteResult } from './pricing';
import type { QuoteRequest } from './validation';

export interface QuoteServiceResult extends QuoteResult {
  distanceMeters: number | null;
  durationSeconds: number | null;
  vehicle: { id: string; slug: string; name: string; multiplierMilli: number };
}

/** Lowercase + strip diacritics so "Zürich"/"Zurich", "München"/"Munchen" match. */
function normalizeCity(s: string): string {
  return s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '');
}

/** Extract a coarse city token from a formatted address for route matching. */
function extractCity(address: string, cities: string[]): string | null {
  const norm = normalizeCity(address);
  return cities.find((c) => norm.includes(normalizeCity(c))) ?? null;
}

/**
 * Compute an authoritative quote for a trip. Loads the active pricing rule and
 * the selected vehicle from the DB, applies a fixed route if one matches the
 * city pair, otherwise measures distance via the Distance Matrix API.
 *
 * Throws with a `code` property ('NO_RULE' | 'NO_VEHICLE' | 'NO_ROUTE') so the
 * API layer can map failures to friendly messages.
 */
export async function computeQuote(input: QuoteRequest): Promise<QuoteServiceResult> {
  const [rule, vehicle, routes] = await Promise.all([
    prisma.pricingRule.findFirst({ where: { active: true } }),
    prisma.vehicle.findUnique({ where: { slug: input.vehicleSlug } }),
    prisma.route.findMany({ where: { active: true } }),
  ]);

  if (!rule) throw Object.assign(new Error('No active pricing rule'), { code: 'NO_RULE' });
  if (!vehicle) throw Object.assign(new Error('Unknown vehicle'), { code: 'NO_VEHICLE' });

  const params: PricingParams = {
    baseFareCents: rule.baseFareCents,
    perKmRateCents: rule.perKmRateCents,
    airportFeeCents: rule.airportFeeCents,
    nightSurchargeCents: rule.nightSurchargeCents,
    nightStartHour: rule.nightStartHour,
    nightEndHour: rule.nightEndHour,
    minFareCents: rule.minFareCents,
  };

  const pickupDate = new Date(input.pickupAt);
  const pickupHour = Number.isNaN(pickupDate.getTime()) ? 12 : pickupDate.getHours();
  const isAirport = looksLikeAirport(input.pickup) || looksLikeAirport(input.dropoff);

  // 1) Try a fixed route (city pair) before measuring distance.
  const cityList = Array.from(
    new Set(routes.flatMap((r) => [r.fromCity, r.toCity])),
  );
  const fromCity = extractCity(input.pickup, cityList);
  const toCity = extractCity(input.dropoff, cityList);

  let fixedRouteBaseCents: number | null = null;
  if (fromCity && toCity && fromCity !== toCity) {
    const match = routes.find(
      (r) =>
        (r.fromCity === fromCity && r.toCity === toCity) ||
        (r.bidirectional && r.fromCity === toCity && r.toCity === fromCity),
    );
    if (match) fixedRouteBaseCents = match.fixedPriceCents;
  }

  let distanceMeters: number | null = null;
  let durationSeconds: number | null = null;

  if (fixedRouteBaseCents === null) {
    // 2) Metered: measure driving distance.
    try {
      const dist = await getDistance(input.pickup, input.dropoff);
      distanceMeters = dist.distanceMeters;
      durationSeconds = dist.durationSeconds;
    } catch (err) {
      throw Object.assign(new Error('Distance lookup failed'), {
        code: 'NO_ROUTE',
        cause: err,
      });
    }
  }

  const quote = calculateQuote(
    {
      distanceMeters: distanceMeters ?? 0,
      vehicleMultiplierMilli: vehicle.multiplierMilli,
      pickupHour,
      isAirport,
      fixedRouteBaseCents,
    },
    params,
  );

  return {
    ...quote,
    distanceMeters,
    durationSeconds,
    vehicle: {
      id: vehicle.id,
      slug: vehicle.slug,
      name: vehicle.name,
      multiplierMilli: vehicle.multiplierMilli,
    },
  };
}
