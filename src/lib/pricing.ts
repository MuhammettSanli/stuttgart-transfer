/**
 * Pricing engine — the single source of truth for fare calculation.
 *
 * Used by BOTH the client-side PriceCalculator (preview) and the server-side
 * /api/quote endpoint. The server result is authoritative; the client preview
 * is a UX convenience. Keep this module free of framework / DB / DOM imports so
 * it runs identically in both environments.
 *
 * ALL money is in integer cents (EUR). Never introduce floats for currency.
 * The vehicle multiplier is passed as milli-units (×1000): 1.0 => 1000.
 */

export interface PricingParams {
  baseFareCents: number;
  perKmRateCents: number;
  airportFeeCents: number;
  nightSurchargeCents: number;
  nightStartHour: number; // inclusive, 0-23
  nightEndHour: number; // exclusive, 0-23
  minFareCents: number;
}

export interface QuoteInput {
  /** Distance in meters from the Distance Matrix API (metered trips only). */
  distanceMeters: number;
  /** Vehicle price multiplier in milli-units (×1000). 1.0 => 1000. */
  vehicleMultiplierMilli: number;
  /** Local pickup hour (0-23) used to decide the night surcharge. */
  pickupHour: number;
  /** Whether the trip touches an airport (adds the airport fee). */
  isAirport: boolean;
  /**
   * Optional fixed route base price (cents) for the Business tier. If provided,
   * it replaces the metered baseFare + distance component; the vehicle
   * multiplier, night surcharge and airport fee still apply.
   */
  fixedRouteBaseCents?: number | null;
}

export interface QuoteResult {
  totalCents: number;
  currency: 'EUR';
  breakdown: {
    baseFareCents: number;
    distanceCents: number;
    nightSurchargeCents: number;
    airportFeeCents: number;
    minFareAppliedCents: number; // amount added to reach the minimum fare, if any
    isFixedRoute: boolean;
  };
}

/** True when `hour` falls inside the (possibly midnight-wrapping) night window. */
export function isNightHour(hour: number, startHour: number, endHour: number): boolean {
  if (startHour === endHour) return false;
  if (startHour < endHour) {
    // Same-day window, e.g. 1..5
    return hour >= startHour && hour < endHour;
  }
  // Wraps midnight, e.g. 22..6 => [22,23] ∪ [0,5]
  return hour >= startHour || hour < endHour;
}

function metersToKm(distanceMeters: number): number {
  return distanceMeters / 1000;
}

/**
 * Compute a fare. Deterministic and pure.
 *
 * Metered:  base + round(km × perKm × multiplier) + night + airport
 * Fixed:    round(fixedBase × multiplier) + night + airport
 * Then the minimum-fare floor is applied to the total.
 */
export function calculateQuote(input: QuoteInput, params: PricingParams): QuoteResult {
  const {
    distanceMeters,
    vehicleMultiplierMilli,
    pickupHour,
    isAirport,
    fixedRouteBaseCents,
  } = input;

  const isFixedRoute =
    typeof fixedRouteBaseCents === 'number' && fixedRouteBaseCents > 0;

  let baseFareCents: number;
  let distanceCents: number;

  if (isFixedRoute) {
    // Fixed route: the base price already covers distance; apply multiplier to it.
    baseFareCents = Math.round((fixedRouteBaseCents as number) * vehicleMultiplierMilli / 1000);
    distanceCents = 0;
  } else {
    baseFareCents = params.baseFareCents;
    const km = metersToKm(distanceMeters);
    distanceCents = Math.round(km * params.perKmRateCents * vehicleMultiplierMilli / 1000);
  }

  const nightSurchargeCents = isNightHour(pickupHour, params.nightStartHour, params.nightEndHour)
    ? params.nightSurchargeCents
    : 0;

  const airportFeeCents = isAirport ? params.airportFeeCents : 0;

  const subtotal = baseFareCents + distanceCents + nightSurchargeCents + airportFeeCents;

  const minFareAppliedCents = subtotal < params.minFareCents ? params.minFareCents - subtotal : 0;
  const totalCents = subtotal + minFareAppliedCents;

  return {
    totalCents,
    currency: 'EUR',
    breakdown: {
      baseFareCents,
      distanceCents,
      nightSurchargeCents,
      airportFeeCents,
      minFareAppliedCents,
      isFixedRoute,
    },
  };
}

/** Format integer cents as a localized EUR string, e.g. 4900 => "49,00 €" (de). */
export function formatEuroCents(cents: number, locale: string = 'de'): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: 'EUR',
  }).format(cents / 100);
}
