/**
 * Server-side Google Maps helpers. Uses the *server* key (Distance Matrix),
 * which is separate from the browser key used for Places autocomplete.
 * Never import this into client components.
 */

const DISTANCE_MATRIX_URL =
  'https://maps.googleapis.com/maps/api/distancematrix/json';

export interface DistanceResult {
  distanceMeters: number;
  durationSeconds: number;
}

/** Keywords that mark an address as an airport, triggering the airport fee. */
const AIRPORT_KEYWORDS = [
  'flughafen',
  'airport',
  'terminal',
  'str ', // Stuttgart airport code appears in some formatted names
];

export function looksLikeAirport(address: string): boolean {
  const a = address.toLowerCase();
  return (
    a.includes('flughafen') ||
    a.includes('airport') ||
    /\b(str|fra|muc|txl|ber|dus|ham|cgn|zrh)\b/.test(a)
  );
}

/**
 * Query the Distance Matrix API for driving distance/duration between two
 * addresses. Throws on a non-OK API status so callers can surface an error.
 */
export async function getDistance(
  origin: string,
  destination: string,
): Promise<DistanceResult> {
  const key = process.env.GOOGLE_MAPS_SERVER_KEY;
  if (!key) {
    throw new Error('GOOGLE_MAPS_SERVER_KEY is not configured');
  }

  const url = new URL(DISTANCE_MATRIX_URL);
  url.searchParams.set('origins', origin);
  url.searchParams.set('destinations', destination);
  url.searchParams.set('mode', 'driving');
  url.searchParams.set('units', 'metric');
  url.searchParams.set('language', 'de');
  url.searchParams.set('key', key);

  const res = await fetch(url.toString(), { cache: 'no-store' });
  if (!res.ok) {
    throw new Error(`Distance Matrix HTTP ${res.status}`);
  }

  const data = (await res.json()) as {
    status: string;
    rows?: Array<{
      elements: Array<{
        status: string;
        distance?: { value: number };
        duration?: { value: number };
      }>;
    }>;
  };

  if (data.status !== 'OK') {
    throw new Error(`Distance Matrix status: ${data.status}`);
  }

  const element = data.rows?.[0]?.elements?.[0];
  if (!element || element.status !== 'OK' || !element.distance || !element.duration) {
    throw new Error(`No route found (element status: ${element?.status ?? 'MISSING'})`);
  }

  return {
    distanceMeters: element.distance.value,
    durationSeconds: element.duration.value,
  };
}
