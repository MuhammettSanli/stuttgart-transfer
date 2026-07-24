/**
 * Central site configuration — company contact details and static data used
 * across components, SEO/JSON-LD and emails.
 *
 * NOTE: These are the real details of "Airport Taxi Limousinen Service GbR"
 * (stuttgartflughafentransfer.de), for whom this site is being built as a draft
 * for client approval. Confirm all values with the client before going live.
 */
export const siteConfig = {
  // Display brand (shown in header/footer)
  name: 'Stuttgart Flughafen Transfer',
  shortName: 'Stuttgart Transfer',

  // Legal entity (Impressum)
  legalName: 'Airport Taxi Limousinen Service GbR',
  owners: 'Ramazan Yapıcı, Gülizar Yapıcı',
  vatId: 'DE353351515',
  taxNumber: '97112/30126',

  phone: '+49 711 997 712 13',
  phoneHref: 'tel:+4971199771213',
  whatsapp: '+49 711 997 712 13',
  email: 'info@stuttgartflughafentransfer.de',
  address: {
    street: 'Karlsruher Straße 11/1',
    postalCode: '70771',
    city: 'Leinfelden-Echterdingen',
    country: 'DE',
  },
  coverageCities: [
    'Stuttgart',
    'Frankfurt',
    'München',
    'Berlin',
    'Düsseldorf',
    'Hamburg',
    'Köln',
    'Zürich',
  ],
  social: {
    instagram: '',
    facebook: '',
  },
} as const;

/** Service slugs mapped to their message keys under the "Services" namespace. */
export const serviceSlugs = ['airport', 'event', 'corporate', 'hourly'] as const;
export type ServiceSlug = (typeof serviceSlugs)[number];
