import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { setRequestLocale } from 'next-intl/server';
import { Hero } from '@/components/Hero';
import { FaqAccordion } from '@/components/FaqAccordion';
import { Reveal } from '@/components/Reveal';
import { Link } from '@/i18n/navigation';
import { serviceSlugs } from '@/config/site';

const TRUST = ['flightTracking', 'freeWaiting', 'fixedPrice', 'payInCar'] as const;
const FLEET = [
  { slug: 'business', img: '/images/fleet-business.jpg', pax: 3, bags: 3 },
  { slug: 'van', img: '/images/fleet-van.jpg', pax: 7, bags: 7 },
  { slug: 'sprinter', img: '/images/fleet-sprinter.jpg', pax: 16, bags: 16 },
] as const;
const STEPS = ['1', '2', '3'] as const;

export default function HomePage({ params: { locale } }: { params: { locale: string } }) {
  setRequestLocale(locale);
  return (
    <>
      <Hero />
      <TrustSection />
      <ServicesSection />
      <ProcessSection />
      <FleetSection />
      <ExperienceBand />
      <CoverageSection />
      <FaqSection />
    </>
  );
}

function SectionHeading({
  index,
  eyebrow,
  title,
  subtitle,
  dark = false,
}: {
  index: string;
  eyebrow: string;
  title: string;
  subtitle?: string;
  dark?: boolean;
}) {
  return (
    <div className="flex flex-col gap-4 border-t border-line pt-6 md:flex-row md:items-end md:justify-between">
      <div>
        <span className="eyebrow">
          <span className="font-mono">{index}</span> {eyebrow}
        </span>
        <h2 className={`mt-4 font-display text-3xl font-medium tracking-tight md:text-5xl ${dark ? 'text-paper' : 'text-ink'}`}>
          {title}
        </h2>
      </div>
      {subtitle && (
        <p className={`max-w-sm text-sm ${dark ? 'text-paper/60' : 'text-graphite'}`}>{subtitle}</p>
      )}
    </div>
  );
}

function TrustSection() {
  const t = useTranslations('Trust');
  return (
    <section className="border-y border-line bg-white">
      <div className="container-page grid divide-y divide-line md:grid-cols-4 md:divide-x md:divide-y-0">
        {TRUST.map((key, i) => (
          <div key={key} className="py-6 md:px-6 md:first:pl-0">
            <span className="font-mono text-[11px] text-signal">{String(i + 1).padStart(2, '0')}</span>
            <h3 className="mt-2 text-sm font-semibold text-ink">{t(key)}</h3>
            <p className="mt-1 text-sm leading-relaxed text-graphite">{t(`${key}Desc`)}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function ServicesSection() {
  const t = useTranslations('Services');
  return (
    <section className="bg-paper py-20">
      <div className="container-page">
        <Reveal>
          <SectionHeading index="01" eyebrow={t('sectionTitle')} title={t('sectionTitle')} subtitle={t('sectionSubtitle')} />
        </Reveal>
        <div className="mt-12 grid gap-px border border-line bg-line md:grid-cols-2 lg:grid-cols-4">
          {serviceSlugs.map((slug, i) => (
            <Link
              key={slug}
              href={{ pathname: '/services/[slug]', params: { slug } }}
              className="group flex flex-col bg-paper p-7 transition hover:bg-white"
            >
              <span className="font-mono text-[11px] text-graphite">{String(i + 1).padStart(2, '0')}</span>
              <h3 className="mt-4 font-display text-xl font-medium text-ink">{t(`${slug}.title`)}</h3>
              <p className="mt-3 flex-1 text-sm leading-relaxed text-graphite">{t(`${slug}.desc`)}</p>
              <span className="mt-6 font-mono text-[11px] uppercase tracking-mono text-signal">
                {t('learnMore')} ⟶
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

function ProcessSection() {
  const t = useTranslations('Process');
  return (
    <section className="bg-white py-20">
      <div className="container-page">
        <Reveal>
          <SectionHeading index="02" eyebrow={t('sectionTitle')} title={t('sectionTitle')} />
          <div className="mt-12 grid gap-px border border-line bg-line md:grid-cols-3">
            {STEPS.map((n) => (
              <div key={n} className="bg-white p-8">
                <span className="font-mono text-4xl font-medium text-signal">0{n}</span>
                <h3 className="mt-4 font-display text-xl font-medium text-ink">{t(`step${n}Title`)}</h3>
                <p className="mt-2 text-sm leading-relaxed text-graphite">{t(`step${n}Desc`)}</p>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function FleetSection() {
  const t = useTranslations('Fleet');
  return (
    <section className="bg-paper py-20">
      <div className="container-page">
        <Reveal>
          <SectionHeading index="03" eyebrow={t('sectionTitle')} title={t('sectionSubtitle')} />
        </Reveal>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {FLEET.map((v, i) => (
            <div key={v.slug} className="border border-line bg-white">
              <div className="relative aspect-[4/3] w-full overflow-hidden border-b border-line bg-ink">
                <Image
                  src={v.img}
                  alt={t(`${v.slug}.name`)}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover"
                />
                <span className="absolute left-3 top-3 bg-paper px-2 py-1 font-mono text-[11px] text-ink">
                  {String(i + 1).padStart(2, '0')}
                </span>
              </div>
              <div className="p-6">
                <h3 className="font-display text-xl font-medium text-ink">{t(`${v.slug}.name`)}</h3>
                <p className="mt-2 text-sm leading-relaxed text-graphite">{t(`${v.slug}.desc`)}</p>
                <dl className="mt-5 space-y-2 border-t border-line pt-4">
                  <div className="flex justify-between">
                    <dt className="mono-label">{t('passengers')}</dt>
                    <dd className="font-mono text-sm text-ink">{String(v.pax).padStart(2, '0')}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="mono-label">{t('luggage')}</dt>
                    <dd className="font-mono text-sm text-ink">{String(v.bags).padStart(2, '0')}</dd>
                  </div>
                </dl>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ExperienceBand() {
  const t = useTranslations('Trust');
  return (
    <section className="relative isolate overflow-hidden bg-ink py-24 text-paper">
      <Image
        src="/images/interior.jpg"
        alt=""
        fill
        sizes="100vw"
        className="-z-10 object-cover object-center opacity-30"
      />
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-ink via-ink/85 to-ink/40" />
      <div className="container-page">
        <div className="max-w-xl">
          <span className="eyebrow">{t('payInCar')}</span>
          <h2 className="mt-4 font-display text-3xl font-medium tracking-tight text-paper md:text-4xl">
            {t('flightTracking')} · {t('freeWaiting')}
          </h2>
          <p className="mt-4 text-paper/70">{t('fixedPriceDesc')}</p>
        </div>
      </div>
    </section>
  );
}

function CoverageSection() {
  const t = useTranslations('Coverage');
  const cities = t('cities').split(',').map((c) => c.trim());
  return (
    <section className="bg-white py-20">
      <div className="container-page">
        <Reveal>
          <SectionHeading index="04" eyebrow={t('sectionTitle')} title={t('sectionSubtitle')} />
          <div className="mt-10 grid grid-cols-2 gap-px border border-line bg-line sm:grid-cols-4">
            {cities.map((city, i) => (
              <div key={city} className="flex items-baseline gap-2 bg-white px-4 py-4">
                <span className="font-mono text-[11px] text-signal">{String(i + 1).padStart(2, '0')}</span>
                <span className="text-sm font-medium text-ink">{city}</span>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function FaqSection() {
  const t = useTranslations('Faq');
  return (
    <section className="bg-paper py-20">
      <div className="container-page">
        <Reveal>
          <SectionHeading index="05" eyebrow={t('sectionTitle')} title={t('sectionTitle')} />
        </Reveal>
        <div className="mt-12">
          <FaqAccordion />
        </div>
      </div>
    </section>
  );
}
