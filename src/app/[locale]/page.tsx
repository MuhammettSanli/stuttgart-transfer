import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { setRequestLocale } from 'next-intl/server';
import { Hero } from '@/components/Hero';
import { BookingForm } from '@/components/BookingForm';
import { FaqAccordion } from '@/components/FaqAccordion';
import { Reveal } from '@/components/Reveal';
import { Link } from '@/i18n/navigation';
import { serviceSlugs } from '@/config/site';

const FLEET = [
  { slug: 'business', img: '/images/fleet-business.jpg', pax: 3, bags: 3 },
  { slug: 'first', img: '/images/fleet-first.jpg', pax: 3, bags: 3 },
  { slug: 'van', img: '/images/fleet-van.jpg', pax: 7, bags: 7 },
  { slug: 'sprinter', img: '/images/fleet-sprinter.jpg', pax: 16, bags: 16 },
] as const;
const STEPS = ['1', '2', '3'] as const;

export default function HomePage({ params: { locale } }: { params: { locale: string } }) {
  setRequestLocale(locale);
  return (
    <>
      <Hero />
      <BookingSection />
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
    <div className={`flex flex-col gap-4 border-t pt-6 md:flex-row md:items-end md:justify-between ${dark ? 'border-platinum/20' : 'border-line'}`}>
      <div>
        <span className={`eyebrow ${dark ? 'text-platinum' : 'text-graphite'}`}>
          <span className="font-mono">{index}</span> {eyebrow}
        </span>
        <h2 className={`mt-4 font-display text-3xl font-semibold tracking-tight md:text-5xl ${dark ? 'text-paper' : 'text-ink'}`}>
          {title}
        </h2>
      </div>
      {subtitle && (
        <p className={`max-w-sm text-sm ${dark ? 'text-platinum-light/70' : 'text-graphite'}`}>{subtitle}</p>
      )}
    </div>
  );
}

function BookingSection() {
  const t = useTranslations('Booking');
  const nav = useTranslations('Nav');
  const trust = useTranslations('Trust');
  const points = ['flightTracking', 'freeWaiting', 'fixedPrice', 'payInCar'] as const;
  return (
    <section id="booking" className="scroll-mt-20 border-b border-line bg-paper py-20">
      <div className="container-page grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
        <div>
          <span className="eyebrow text-graphite">{nav('bookNow')}</span>
          <h2 className="mt-4 font-display text-3xl font-semibold tracking-tight text-ink md:text-4xl">
            {t('title')}
          </h2>
          <p className="mt-3 max-w-md text-graphite">{t('priceNote')}</p>
          <ul className="mt-8 space-y-5 border-t border-line pt-6">
            {points.map((p, i) => (
              <li key={p} className="flex gap-3">
                <span className="font-mono text-[11px] text-gold">{String(i + 1).padStart(2, '0')}</span>
                <div>
                  <p className="text-sm font-semibold text-ink">{trust(p)}</p>
                  <p className="mt-0.5 text-sm leading-relaxed text-graphite">{trust(`${p}Desc`)}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
        <BookingForm />
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
        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {serviceSlugs.map((slug, i) => (
            <Link
              key={slug}
              href={{ pathname: '/services/[slug]', params: { slug } }}
              className="group flex flex-col border border-line bg-white transition hover:shadow-panel"
            >
              <div className="relative aspect-[16/10] overflow-hidden border-b border-line bg-ink">
                <Image
                  src={`/images/service-${slug}.jpg`}
                  alt={t(`${slug}.title`)}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover transition duration-700 group-hover:scale-[1.04]"
                />
                <span className="absolute left-3 top-3 bg-charcoal/80 px-2 py-1 font-mono text-[11px] text-platinum backdrop-blur">
                  {String(i + 1).padStart(2, '0')}
                </span>
              </div>
              <div className="flex flex-1 flex-col p-7">
                <h3 className="font-display text-xl font-semibold text-ink">{t(`${slug}.title`)}</h3>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-graphite">{t(`${slug}.desc`)}</p>
                <span className="mt-6 text-[11px] font-semibold uppercase tracking-[0.14em] text-ink transition group-hover:translate-x-1">
                  {t('learnMore')} ⟶
                </span>
              </div>
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
                <span className="font-mono text-4xl font-medium text-ink/25">0{n}</span>
                <h3 className="mt-4 font-display text-xl font-semibold text-ink">{t(`step${n}Title`)}</h3>
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
    <section className="bg-charcoal py-20 text-paper">
      <div className="container-page">
        <Reveal>
          <SectionHeading index="03" eyebrow={t('sectionTitle')} title={t('sectionSubtitle')} dark />
        </Reveal>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {FLEET.map((v, i) => (
            <div key={v.slug} className="border border-platinum/15 bg-ink">
              <div className="relative aspect-[4/3] w-full overflow-hidden border-b border-platinum/15">
                <Image
                  src={v.img}
                  alt={t(`${v.slug}.name`)}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover"
                />
                <span className="absolute left-3 top-3 bg-charcoal/80 px-2 py-1 font-mono text-[11px] text-platinum backdrop-blur">
                  {String(i + 1).padStart(2, '0')}
                </span>
              </div>
              <div className="p-6">
                <h3 className="font-display text-xl font-semibold text-paper">{t(`${v.slug}.name`)}</h3>
                <p className="mt-2 text-sm leading-relaxed text-platinum-light/70">{t(`${v.slug}.desc`)}</p>
                <dl className="mt-5 space-y-2 border-t border-platinum/15 pt-4">
                  <div className="flex justify-between">
                    <dt className="mono-label text-platinum">{t('passengers')}</dt>
                    <dd className="font-mono text-sm text-paper">{String(v.pax).padStart(2, '0')}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="mono-label text-platinum">{t('luggage')}</dt>
                    <dd className="font-mono text-sm text-paper">{String(v.bags).padStart(2, '0')}</dd>
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
    <section className="relative isolate overflow-hidden bg-charcoal py-24 text-paper">
      <Image
        src="/images/interior.jpg"
        alt=""
        fill
        sizes="100vw"
        className="-z-10 object-cover object-center opacity-35"
      />
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-charcoal via-charcoal/85 to-charcoal/40" />
      <div className="container-page">
        <div className="max-w-xl">
          <span className="eyebrow text-platinum">{t('payInCar')}</span>
          <h2 className="mt-4 font-display text-3xl font-semibold tracking-tight text-paper md:text-4xl">
            {t('flightTracking')} · {t('freeWaiting')}
          </h2>
          <p className="mt-4 text-platinum-light/75">{t('fixedPriceDesc')}</p>
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
                <span className="font-mono text-[11px] text-graphite">{String(i + 1).padStart(2, '0')}</span>
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
