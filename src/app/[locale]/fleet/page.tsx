import { useTranslations } from 'next-intl';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import type { Metadata } from 'next';

const FLEET = ['business', 'van', 'sprinter'] as const;
const CAPACITY: Record<string, { pax: number; bags: number }> = {
  business: { pax: 3, bags: 3 },
  van: { pax: 7, bags: 7 },
  sprinter: { pax: 16, bags: 16 },
};

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: 'Fleet' });
  return { title: t('sectionTitle') };
}

export default function FleetPage({ params: { locale } }: { params: { locale: string } }) {
  setRequestLocale(locale);
  return <FleetList />;
}

function FleetList() {
  const t = useTranslations('Fleet');
  return (
    <div className="container-page py-16">
      <h1 className="text-3xl font-bold text-brand">{t('sectionTitle')}</h1>
      <p className="mt-2 text-gray-600">{t('sectionSubtitle')}</p>
      <div className="mt-10 grid gap-6 md:grid-cols-3">
        {FLEET.map((slug) => (
          <div key={slug} className="rounded-2xl border border-gray-200 bg-white p-6">
            <div className="mb-4 flex h-40 items-center justify-center rounded-xl bg-brand/5 text-5xl">
              🚐
            </div>
            <h2 className="text-lg font-semibold text-brand">{t(`${slug}.name`)}</h2>
            <p className="mt-2 text-sm text-gray-600">{t(`${slug}.desc`)}</p>
            <div className="mt-4 flex gap-4 text-sm text-gray-500">
              <span>👤 {CAPACITY[slug].pax} {t('passengers')}</span>
              <span>🧳 {CAPACITY[slug].bags} {t('luggage')}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
