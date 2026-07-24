import { siteConfig } from '@/config/site';

// LocalBusiness structured data for rich results. Rendered once in the layout.
export function JsonLd() {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';
  const data = {
    '@context': 'https://schema.org',
    '@type': 'TaxiService',
    name: siteConfig.name,
    telephone: siteConfig.phone,
    email: siteConfig.email,
    url: base,
    address: {
      '@type': 'PostalAddress',
      streetAddress: siteConfig.address.street,
      postalCode: siteConfig.address.postalCode,
      addressLocality: siteConfig.address.city,
      addressCountry: siteConfig.address.country,
    },
    areaServed: siteConfig.coverageCities,
    availableLanguage: ['de', 'en', 'tr'],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
