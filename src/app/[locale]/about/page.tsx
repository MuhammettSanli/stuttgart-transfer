import { useTranslations } from 'next-intl';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import type { Metadata } from 'next';

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: 'Nav' });
  return { title: t('about') };
}

export default function AboutPage({ params: { locale } }: { params: { locale: string } }) {
  setRequestLocale(locale);
  return <About />;
}

function About() {
  const nav = useTranslations('Nav');
  const t = useTranslations('Trust');
  const TRUST = ['flightTracking', 'freeWaiting', 'fixedPrice', 'payInCar'] as const;
  return (
    <div className="container-page py-16">
      <h1 className="text-3xl font-bold text-brand">{nav('about')}</h1>
      <div className="mt-8 grid gap-6 sm:grid-cols-2">
        {TRUST.map((key) => (
          <div key={key} className="rounded-xl border border-gray-100 bg-gray-50 p-5">
            <h2 className="font-semibold text-brand">{t(key)}</h2>
            <p className="mt-2 text-sm text-gray-600">{t(`${key}Desc`)}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
