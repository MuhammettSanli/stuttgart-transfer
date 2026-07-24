/**
 * Central site configuration — company contact details and static data used
 * across components, SEO/JSON-LD and emails. Update these to the real values.
 */
export const siteConfig = {
  name: 'Stuttgart Flughafen Transfer',
  shortName: 'Stuttgart Transfer',
  phone: '+49 711 000 000 00',
  phoneHref: 'tel:+4971100000000',
  whatsapp: '+49 711 000 000 00',
  email: 'info@example.de',
  address: {
    street: 'Musterstraße 1',
    postalCode: '70629',
    city: 'Stuttgart',
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
