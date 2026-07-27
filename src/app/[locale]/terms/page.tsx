import { useTranslations } from 'next-intl';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import type { Metadata } from 'next';

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: 'Legal' });
  return { title: t('termsTitle'), robots: { index: true, follow: false } };
}

export default function TermsPage({ params: { locale } }: { params: { locale: string } }) {
  setRequestLocale(locale);
  return <Terms />;
}

function Terms() {
  const t = useTranslations('Legal');
  return (
    <div className="container-page max-w-3xl py-16">
      <span className="eyebrow text-graphite">{t('termsTitle')}</span>
      <h1 className="mt-4 font-display text-4xl font-semibold tracking-tight text-ink">{t('termsTitle')}</h1>
      <p className="mt-3 text-sm text-graphite">{t('placeholderNote')}</p>

      <div className="mt-10 space-y-8 border-t border-line pt-8 text-graphite">
        <section>
          <h2 className="mono-label text-gold">1. Geltungsbereich</h2>
          <p className="mt-2">
            Diese AGB gelten für alle Beförderungs- und Chauffeurleistungen zwischen dem Kunden und
            dem Anbieter.
          </p>
        </section>
        <section>
          <h2 className="mono-label text-gold">2. Buchung und Preise</h2>
          <p className="mt-2">
            Der bei der Buchung angezeigte Preis ist ein Festpreis. Die Zahlung erfolgt bar oder mit
            Karte direkt im Fahrzeug. Eine Online-Zahlung findet nicht statt.
          </p>
        </section>
        <section>
          <h2 className="mono-label text-gold">3. Wartezeiten und Flugüberwachung</h2>
          <p className="mt-2">
            Bei Flughafenabholungen sind 60 Minuten Wartezeit inklusive. Die Flugzeiten werden
            überwacht und die Abholung entsprechend angepasst.
          </p>
        </section>
        <section>
          <h2 className="mono-label text-gold">4. Stornierung</h2>
          <p className="mt-2">
            Stornierungen sind bis 24 Stunden vor Fahrtbeginn kostenfrei möglich. Bei
            kurzfristigeren Stornierungen oder Nichterscheinen kann der volle Fahrpreis berechnet
            werden.
          </p>
        </section>
      </div>
    </div>
  );
}
