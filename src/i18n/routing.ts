import { defineRouting } from 'next-intl/routing';

/**
 * Locale configuration. German is the default and fallback locale.
 * Localized pathnames let each language use natural URLs (e.g. /hizmetler
 * in TR, /leistungen in DE, /services in EN) while sharing one route file.
 */
export const routing = defineRouting({
  locales: ['de', 'en', 'tr'],
  defaultLocale: 'de',
  localePrefix: 'always',
  pathnames: {
    '/': '/',
    '/about': {
      de: '/ueber-uns',
      en: '/about',
      tr: '/hakkimizda',
    },
    '/services': {
      de: '/leistungen',
      en: '/services',
      tr: '/hizmetler',
    },
    '/services/[slug]': {
      de: '/leistungen/[slug]',
      en: '/services/[slug]',
      tr: '/hizmetler/[slug]',
    },
    '/fleet': {
      de: '/fahrzeuge',
      en: '/fleet',
      tr: '/araclar',
    },
    '/blog': '/blog',
    '/blog/[slug]': '/blog/[slug]',
    '/contact': {
      de: '/kontakt',
      en: '/contact',
      tr: '/iletisim',
    },
    '/imprint': {
      de: '/impressum',
      en: '/imprint',
      tr: '/kunye',
    },
    '/privacy': {
      de: '/datenschutz',
      en: '/privacy',
      tr: '/gizlilik',
    },
    '/terms': {
      de: '/agb',
      en: '/terms',
      tr: '/sartlar',
    },
    '/admin': '/admin',
  },
});

export type Locale = (typeof routing.locales)[number];
