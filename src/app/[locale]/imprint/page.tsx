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
      <h1 className="text-3xl font-bold text-brand">{t('imprintTitle')}</h1>
      <p className="mt-2 text-sm text-amber-600">{t('placeholderNote')}</p>

      <div className="mt-8 space-y-6 text-gray-700">
        <section>
          <h2 className="font-semibold text-brand">Angaben gemäß § 5 TMG</h2>
          <p className="mt-2">
            {siteConfig.name}<br />
            {siteConfig.address.street}<br />
            {siteConfig.address.postalCode} {siteConfig.address.city}
          </p>
        </section>

        <section>
          <h2 className="font-semibold text-brand">{t('contactHeading')}</h2>
          <p className="mt-2">
            Tel: {siteConfig.phone}<br />
            E-Mail: {siteConfig.email}
          </p>
        </section>

        <section>
          <h2 className="font-semibold text-brand">{t('responsible')}</h2>
          <p className="mt-2">
            [Vor- und Nachname]<br />
            {siteConfig.address.street}, {siteConfig.address.postalCode} {siteConfig.address.city}
          </p>
        </section>

        <section className="text-sm text-gray-500">
          <p>USt-IdNr.: [DE… – falls vorhanden]</p>
          <p>Handelsregister / Registergericht: [falls vorhanden]</p>
        </section>
      </div>
    </div>
  );
}
