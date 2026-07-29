// Minibar catalog — the SINGLE source of truth for extra prices, used by BOTH
// the client BookingForm (live total preview) and the server /api/booking
// (authoritative price). Prices are integer cents (EUR). Labels are localized
// in the message catalogs under Booking.minibar_<id>.

export interface MinibarItem {
  id: string;
  priceCents: number;
}

export const MINIBAR_ITEMS: MinibarItem[] = [
  { id: 'water', priceCents: 200 },
  { id: 'cola', priceCents: 300 },
  { id: 'soda', priceCents: 300 },
  { id: 'juice', priceCents: 350 },
  { id: 'beer', priceCents: 400 },
  { id: 'wine', priceCents: 600 },
  { id: 'prosecco', priceCents: 1200 },
];

const PRICE_BY_ID = new Map(MINIBAR_ITEMS.map((i) => [i.id, i.priceCents]));

/** Max quantity per item (guards against absurd/abusive quantities). */
export const MINIBAR_MAX_QTY = 20;

/**
 * Sum the minibar selection using server-side prices. Unknown ids are ignored
 * and quantities are clamped, so the client can never dictate the price.
 */
export function minibarTotalCents(selection: Record<string, number> | undefined | null): number {
  if (!selection) return 0;
  let total = 0;
  for (const [id, qtyRaw] of Object.entries(selection)) {
    const price = PRICE_BY_ID.get(id);
    if (!price) continue;
    const qty = Math.max(0, Math.min(MINIBAR_MAX_QTY, Math.floor(Number(qtyRaw) || 0)));
    total += price * qty;
  }
  return total;
}
