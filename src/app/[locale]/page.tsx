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
  eyebrow,
  title,
  subtitle,
  align = 'center',
  dark = false,
}: {
  eyebrow: string;
  title: string;
  subtitle?: string;
  align?: 'center' | 'left';
  dark?: boolean;
}) {
  return (
    <div className={align === 'center' ? 'mx-auto max-w-2xl text-center' : 'max-w-2xl'}>
      <span className={`eyebrow ${align === 'center' ? 'justify-center' : ''}`}>{eyebrow}</span>
      <h2 className={`mt-4 font-display text-3xl font-normal md:text-4xl ${dark ? 'text-ivory' : 'text-brand'}`}>
        {title}
      </h2>
      {subtitle && (
        <p className={`mt-3 ${dark ? 'text-ivory/70' : 'text-brand/60'}`}>{subtitle}</p>
      )}
    </div>
  );
}

function TrustSection() {
  const t = useTranslations('Trust');
  return (
    <section className="border-b border-brand/10 bg-white py-10">
      <div className="container-page grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
        {TRUST.map((key) => (
          <div key={key} className="flex gap-3">
            <span className="mt-0.5 text-gold" aria-hidden>✦</span>
            <div>
              <h3 className="text-sm font-semibold text-brand">{t(key)}</h3>
              <p className="mt-1 text-sm leading-relaxed text-brand/55">{t(`${key}Desc`)}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function ServicesSection() {
  const t = useTranslations('Services');
  return (
    <section className="bg-ivory py-20">
      <div className="container-page">
        <Reveal>
          <SectionHeading eyebrow={t('sectionTitle')} title={t('sectionSubtitle')} />
        </Reveal>
        <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {serviceSlugs.map((slug) => (
            <Link
              key={slug}
              href={{ pathname: '/services/[slug]', params: { slug } }}
              className="group flex flex-col rounded-2xl border border-brand/10 bg-white p-7 transition hover:-translate-y-1 hover:border-gold/40 hover:shadow-elevated"
            >
              <h3 className="font-display text-xl font-normal text-brand">{t(`${slug}.title`)}</h3>
              <p className="mt-3 flex-1 text-sm leading-relaxed text-brand/60">{t(`${slug}.desc`)}</p>
              <span className="mt-5 text-xs font-semibold uppercase tracking-wider text-gold-dark">
                {t('learnMore')} →
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
          <SectionHeading eyebrow={t('sectionTitle')} title={t('sectionTitle')} />
          <div className="mt-14 grid gap-10 md:grid-cols-3">
            {STEPS.map((n) => (
              <div key={n} className="relative">
                <span className="font-display text-5xl font-normal text-gold/40">0{n}</span>
                <h3 className="mt-3 font-display text-xl font-normal text-brand">{t(`step${n}Title`)}</h3>
                <p className="mt-2 text-sm leading-relaxed text-brand/60">{t(`step${n}Desc`)}</p>
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
    <section className="bg-midnight py-20 text-ivory">
      <div className="container-page">
        <Reveal>
          <SectionHeading eyebrow={t('sectionTitle')} title={t('sectionSubtitle')} dark />
        </Reveal>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {FLEET.map((v) => (
            <div
              key={v.slug}
              className="overflow-hidden rounded-2xl border border-white/10 bg-brand/40 transition hover:border-gold/40"
            >
              <div className="relative aspect-[4/3] bg-black/30">
                <Image
                  src={v.img}
                  alt={t(`${v.slug}.name`)}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="font-display text-xl font-normal text-ivory">{t(`${v.slug}.name`)}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ivory/65">{t(`${v.slug}.desc`)}</p>
                <div className="mt-4 flex gap-5 text-xs uppercase tracking-wider text-gold">
                  <span>{v.pax} {t('passengers')}</span>
                  <span>{v.bags} {t('luggage')}</span>
                </div>
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
    <section className="relative isolate overflow-hidden bg-midnight py-24 text-ivory">
      <Image
        src="/images/interior.jpg"
        alt=""
        fill
        sizes="100vw"
        className="-z-10 object-cover object-center opacity-40"
      />
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-midnight via-midnight/70 to-midnight/40" />
      <div className="container-page">
        <div className="max-w-xl">
          <span className="eyebrow">{t('payInCar')}</span>
          <h2 className="mt-4 font-display text-3xl font-normal text-ivory md:text-4xl">
            {t('flightTracking')} · {t('freeWaiting')}
          </h2>
          <p className="mt-4 text-ivory/75">{t('fixedPriceDesc')}</p>
        </div>
      </div>
    </section>
  );
}

function CoverageSection() {
  const t = useTranslations('Coverage');
  const cities = t('cities').split(',').map((c) => c.trim());
  return (
    <section className="bg-brand py-20 text-ivory">
      <div className="container-page">
        <Reveal>
          <SectionHeading eyebrow={t('sectionTitle')} title={t('sectionSubtitle')} dark />
          <div className="mt-10 flex flex-wrap justify-center gap-x-3 gap-y-4">
            {cities.map((city) => (
              <span
                key={city}
                className="rounded-full border border-gold/30 px-5 py-2 text-sm text-gold"
              >
                {city}
              </span>
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
    <section className="bg-ivory py-20">
      <div className="container-page">
        <Reveal>
          <SectionHeading eyebrow={t('sectionTitle')} title={t('sectionTitle')} />
        </Reveal>
        <div className="mt-12">
          <FaqAccordion />
        </div>
      </div>
    </section>
  );
}
