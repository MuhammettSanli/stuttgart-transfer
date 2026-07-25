import { useTranslations } from 'next-intl';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import type { Metadata } from 'next';
import { siteConfig } from '@/config/site';

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: 'Legal' });
  return { title: t('imprintTitle'), robots: { index: true, follow: false } };
}

export default function ImprintPage({ params: { locale } }: { params: { locale: string } }) {
  setRequestLocale(locale);
  return <Imprint />;
}

function Imprint() {
  const t = useTranslations('Legal');
  return (
    <div className="container-page max-w-3xl py-16">
      <span className="eyebrow text-graphite">{t('imprintTitle')}</span>
      <h1 className="mt-4 font-display text-4xl font-semibold tracking-tight text-ink">{t('imprintTitle')}</h1>

      <div className="mt-10 space-y-8 border-t border-line pt-8 text-graphite">
        <section>
          <h2 className="mono-label text-gold">Angaben gemäß § 5 TMG</h2>
          <p className="mt-2">
            {siteConfig.legalName}<br />
            {siteConfig.address.street}<br />
            {siteConfig.address.postalCode} {siteConfig.address.city}
          </p>
        </section>

        <section>
          <h2 className="mono-label text-gold">Vertreten durch</h2>
          <p className="mt-2">{siteConfig.owners}</p>
        </section>

        <section>
          <h2 className="mono-label text-gold">{t('contactHeading')}</h2>
          <p className="mt-2">
            Tel: {siteConfig.phone}<br />
            E-Mail: {siteConfig.email}
          </p>
        </section>

        <section className="text-sm text-gray-500">
          <p>Umsatzsteuer-ID (§ 27a UStG): {siteConfig.vatId}</p>
          <p>Steuernummer: {siteConfig.taxNumber}</p>
          <p>Rechtsform: Gesellschaft bürgerlichen Rechts (GbR)</p>
        </section>
      </div>
    </div>
  );
}
