import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import type { Metadata } from 'next';
import { Link } from '@/i18n/navigation';

const FLEET = [
  { slug: 'business', img: '/images/fleet-business.jpg', pax: 4, bags: 4 },
  { slug: 'first', img: '/images/fleet-first.jpg', pax: 4, bags: 4 },
  { slug: 'van', img: '/images/fleet-van.jpg', pax: 8, bags: 8 },
  { slug: 'sprinter', img: '/images/fleet-sprinter.jpg', pax: 16, bags: 16 },
] as const;

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
      <span className="eyebrow text-graphite">{t('sectionTitle')}</span>
      <h1 className="mt-4 max-w-2xl font-display text-4xl font-semibold tracking-tight text-ink md:text-5xl">
        {t('sectionSubtitle')}
      </h1>

      <div className="mt-16 space-y-16 lg:space-y-24">
        {FLEET.map((v, i) => {
          const features = t.raw(`${v.slug}.features`) as string[];
          const reversed = i % 2 === 1;
          return (
            <article
              key={v.slug}
              className="grid items-center gap-8 lg:grid-cols-2 lg:gap-14"
            >
              <div className={`relative aspect-[4/3] w-full overflow-hidden border border-line bg-ink ${reversed ? 'lg:order-2' : ''}`}>
                <Image
                  src={v.img}
                  alt={t(`${v.slug}.name`)}
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                  priority={i === 0}
                />
                <span className="absolute left-4 top-4 bg-charcoal/80 px-2.5 py-1 font-mono text-[11px] text-platinum backdrop-blur">
                  {t(`${v.slug}.class`)}
                </span>
              </div>

              <div className={reversed ? 'lg:order-1' : ''}>
                <span className="mono-label text-graphite">
                  {String(i + 1).padStart(2, '0')} / {t('classLabel')}
                </span>
                <h2 className="mt-3 font-display text-2xl font-semibold text-ink md:text-3xl">
                  {t(`${v.slug}.name`)}
                </h2>
                <p className="mt-4 max-w-lg leading-relaxed text-graphite">{t(`${v.slug}.long`)}</p>

                <div className="mt-6 flex flex-wrap gap-3">
                  <span className="inline-flex items-baseline gap-2 border border-line bg-white px-3 py-1.5">
                    <span className="font-mono text-base font-semibold text-ink">{v.pax}</span>
                    <span className="mono-label text-graphite">{t('passengers')}</span>
                  </span>
                  <span className="inline-flex items-baseline gap-2 border border-line bg-white px-3 py-1.5">
                    <span className="font-mono text-base font-semibold text-ink">{v.bags}</span>
                    <span className="mono-label text-graphite">{t('luggage')}</span>
                  </span>
                </div>

                <p className="mt-6 mono-label text-graphite">{t('featuresTitle')}</p>
                <ul className="mt-3 grid gap-2 sm:grid-cols-2">
                  {features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm text-ink">
                      <svg viewBox="0 0 24 24" className="mt-0.5 h-4 w-4 shrink-0 text-gold" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      {f}
                    </li>
                  ))}
                </ul>

                <p className="mt-6 text-sm text-graphite">
                  <span className="mono-label">{t('bestForLabel')}:</span>{' '}
                  <span className="text-ink">{t(`${v.slug}.bestFor`)}</span>
                </p>

                <Link href="/" className="btn-primary mt-7 inline-flex">
                  {t('bookCta')}
                </Link>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
