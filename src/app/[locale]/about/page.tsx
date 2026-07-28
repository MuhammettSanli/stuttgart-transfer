import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import type { Metadata } from 'next';
import { Link } from '@/i18n/navigation';
import { siteConfig } from '@/config/site';
import { CountUp } from '@/components/CountUp';

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: 'About' });
  return { title: t('eyebrow'), description: t('lead') };
}

export default function AboutPage({ params: { locale } }: { params: { locale: string } }) {
  setRequestLocale(locale);
  return <About />;
}

const VALUES = ['flightTracking', 'freeWaiting', 'fixedPrice', 'payInCar'] as const;

const VALUE_ICONS = [
  <svg key="1" viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.6">
    <path d="M12 2l3 7 7 3-7 3-3 7-3-7-7-3 7-3 3-7z" strokeLinejoin="round" />
  </svg>,
  <svg key="2" viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.6">
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7v5l3 2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>,
  <svg key="3" viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.6">
    <path d="M12 3l7 3v5c0 4.5-3 8-7 10-4-2-7-5.5-7-10V6l7-3z" strokeLinejoin="round" />
    <path d="M9 12l2 2 4-4" strokeLinecap="round" strokeLinejoin="round" />
  </svg>,
  <svg key="4" viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.6">
    <rect x="3" y="6" width="18" height="12" rx="1.5" />
    <path d="M3 10h18" />
  </svg>,
];

function About() {
  const t = useTranslations('About');
  const trust = useTranslations('Trust');
  const nav = useTranslations('Nav');
  const st = useTranslations('Stats');

  const stats: { to?: number; suffix?: string; display?: string; label: string }[] = [
    { to: 22, suffix: '+', label: st('fleet') },
    { to: 1594, label: st('passengers') },
    { to: 13, suffix: '+', label: st('partners') },
    { display: '24/7', label: st('available') },
  ];

  return (
    <>
      {/* Intro */}
      <section className="bg-paper py-16 md:py-20">
        <div className="container-page max-w-4xl">
          <span className="eyebrow text-graphite">{t('eyebrow')}</span>
          <h1 className="mt-5 font-display text-4xl font-semibold leading-[1.08] tracking-tight text-ink md:text-6xl">
            {t('title')}
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-graphite">{t('lead')}</p>
        </div>
      </section>

      {/* Story + image */}
      <section className="bg-white py-16 md:py-20">
        <div className="container-page grid gap-10 lg:grid-cols-2 lg:items-center lg:gap-16">
          <div className="relative aspect-[4/3] overflow-hidden border border-line">
            <Image src="/images/interior.jpg" alt="" fill sizes="(max-width: 1024px) 100vw, 50vw" className="object-cover" />
          </div>
          <div>
            <span className="mono-label text-gold">{siteConfig.shortName}</span>
            <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight text-ink">{t('storyTitle')}</h2>
            <p className="mt-5 leading-relaxed text-graphite">{t('storyText')}</p>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-charcoal py-16 text-paper">
        <div className="container-page">
          <div className="grid grid-cols-2 gap-y-10 md:grid-cols-4">
            {stats.map((s, i) => (
              <div key={i} className={`px-4 text-center md:px-8 ${i > 0 ? 'md:border-l md:border-platinum/15' : ''}`}>
                <div className="font-display text-4xl font-semibold tracking-tight text-paper md:text-5xl">
                  {s.display ? s.display : (<><CountUp to={s.to as number} />{s.suffix ?? ''}</>)}
                </div>
                <p className="mt-3 mono-label text-gold">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="bg-paper py-16 md:py-20">
        <div className="container-page">
          <div className="border-t border-line pt-6">
            <h2 className="font-display text-3xl font-semibold tracking-tight text-ink md:text-4xl">
              {t('valuesTitle')}
            </h2>
          </div>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {VALUES.map((key, i) => (
              <div key={key} className="group border border-line bg-white p-7 transition duration-300 hover:-translate-y-1 hover:border-gold/40 hover:shadow-panel">
                <div className="flex h-14 w-14 items-center justify-center rounded-full border border-gold/40 text-gold transition duration-300 group-hover:bg-gold group-hover:text-charcoal">
                  {VALUE_ICONS[i]}
                </div>
                <h3 className="mt-6 font-display text-lg font-semibold text-ink">{trust(key)}</h3>
                <p className="mt-2 text-sm leading-relaxed text-graphite">{trust(`${key}Desc`)}</p>
              </div>
            ))}
          </div>

          <div className="mt-12 flex flex-wrap items-center gap-4">
            <Link href="/" className="btn-primary">{nav('bookNow')}</Link>
            <a href={siteConfig.phoneHref} className="text-sm font-medium text-ink transition hover:text-gold-dark">
              {siteConfig.phone}
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
