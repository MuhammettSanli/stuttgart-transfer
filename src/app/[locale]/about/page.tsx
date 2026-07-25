import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import type { Metadata } from 'next';
import { Link } from '@/i18n/navigation';
import { siteConfig } from '@/config/site';

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

const TRUST = ['flightTracking', 'freeWaiting', 'fixedPrice', 'payInCar'] as const;

function About() {
  const nav = useTranslations('Nav');
  const t = useTranslations('Trust');
  const hero = useTranslations('Hero');

  return (
    <>
      <section className="container-page py-16">
        <span className="eyebrow text-graphite">{nav('about')}</span>
        <h1 className="mt-4 max-w-3xl font-display text-4xl font-semibold leading-[1.06] tracking-tight text-ink md:text-6xl">
          {hero('title')}
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-graphite">{hero('subtitle')}</p>
      </section>

      <section className="relative isolate overflow-hidden bg-charcoal">
        <div className="relative aspect-[21/9] w-full">
          <Image src="/images/interior.jpg" alt="" fill sizes="100vw" className="object-cover" />
        </div>
      </section>

      <section className="bg-paper py-16">
        <div className="container-page grid gap-px border border-line bg-line md:grid-cols-2">
          {TRUST.map((key, i) => (
            <div key={key} className="bg-paper p-8">
              <span className="font-mono text-[11px] text-gold">{String(i + 1).padStart(2, '0')}</span>
              <h2 className="mt-3 font-display text-xl font-semibold text-ink">{t(key)}</h2>
              <p className="mt-2 text-sm leading-relaxed text-graphite">{t(`${key}Desc`)}</p>
            </div>
          ))}
        </div>
        <div className="container-page mt-12">
          <Link href="/" className="btn-primary">{nav('bookNow')}</Link>
          <a href={siteConfig.phoneHref} className="ml-4 text-sm font-medium text-ink transition hover:text-gold-dark">
            {siteConfig.phone}
          </a>
        </div>
      </section>
    </>
  );
}
