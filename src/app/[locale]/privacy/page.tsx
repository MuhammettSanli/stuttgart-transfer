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
  return { title: t('privacyTitle'), robots: { index: true, follow: false } };
}

export default function PrivacyPage({ params: { locale } }: { params: { locale: string } }) {
  setRequestLocale(locale);
  return <Privacy />;
}

function Privacy() {
  const t = useTranslations('Legal');
  return (
    <div className="container-page max-w-3xl py-16">
      <h1 className="text-3xl font-bold text-brand">{t('privacyTitle')}</h1>
      <p className="mt-2 text-sm text-amber-600">{t('placeholderNote')}</p>

      <div className="mt-8 space-y-6 text-gray-700">
        <section>
          <h2 className="font-semibold text-brand">1. Verantwortlicher</h2>
          <p className="mt-2">
            {siteConfig.name}, {siteConfig.address.street}, {siteConfig.address.postalCode} {siteConfig.address.city}.
            E-Mail: {siteConfig.email}
          </p>
        </section>
        <section>
          <h2 className="font-semibold text-brand">2. Erhebung und Verarbeitung personenbezogener Daten</h2>
          <p className="mt-2">
            Bei einer Buchungs- oder Kontaktanfrage verarbeiten wir die von Ihnen angegebenen Daten
            (Name, E-Mail, Telefon, Abhol- und Zieladresse, Datum/Uhrzeit) ausschließlich zur
            Bearbeitung Ihrer Anfrage und zur Durchführung der Fahrt (Art. 6 Abs. 1 lit. b DSGVO).
          </p>
        </section>
        <section>
          <h2 className="font-semibold text-brand">3. Google Maps</h2>
          <p className="mt-2">
            Zur Adresseingabe und Distanzberechnung nutzen wir Dienste von Google (Places, Distance
            Matrix). Dabei können Daten an Google übertragen werden. Details:
            https://policies.google.com/privacy
          </p>
        </section>
        <section>
          <h2 className="font-semibold text-brand">4. Ihre Rechte</h2>
          <p className="mt-2">
            Sie haben das Recht auf Auskunft, Berichtigung, Löschung, Einschränkung der Verarbeitung
            sowie auf Datenübertragbarkeit. Kontakt: {siteConfig.email}
          </p>
        </section>
      </div>
    </div>
  );
}
