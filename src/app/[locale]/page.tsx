import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { setRequestLocale } from 'next-intl/server';
import { Hero } from '@/components/Hero';
import { BookingForm } from '@/components/BookingForm';
import { FaqAccordion } from '@/components/FaqAccordion';
import { Reveal } from '@/components/Reveal';
import { CountUp } from '@/components/CountUp';
import { ServicesCarousel } from '@/components/ServicesCarousel';

const FLEET = [
  { slug: 'business', img: '/images/fleet-business.jpg', pax: 4, bags: 4 },
  { slug: 'first', img: '/images/fleet-first.jpg', pax: 4, bags: 4 },
  { slug: 'van', img: '/images/fleet-van.jpg', pax: 8, bags: 8 },
  { slug: 'sprinter', img: '/images/fleet-sprinter.jpg', pax: 16, bags: 16 },
] as const;
const STEPS = ['1', '2', '3'] as const;

export default function HomePage({ params: { locale } }: { params: { locale: string } }) {
  setRequestLocale(locale);
  return (
    <>
      {/* Alternating dark / light rhythm */}
      <Hero />
      <BookingSection />
      <ServicesSection />
      <ProcessSection />
      <FleetSection />
      <CoverageSection />
      <ExperienceBand />
      <FaqSection />
    </>
  );
}

function SectionHeading({
  eyebrow,
  title,
  subtitle,
  dark = false,
}: {
  index?: string;
  eyebrow: string;
  title: string;
  subtitle?: string;
  dark?: boolean;
}) {
  return (
    <div className={`flex flex-col gap-4 border-t pt-6 md:flex-row md:items-end md:justify-between ${dark ? 'border-platinum/20' : 'border-line'}`}>
      <div>
        <span className={`eyebrow ${dark ? 'text-platinum' : 'text-graphite'}`}>
          {eyebrow}
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
    <section className="bg-charcoal py-20 text-paper">
      <div className="container-page">
        <Reveal>
          <span className="eyebrow text-platinum">{t('sectionSubtitle')}</span>
          <h2 className="mt-4 font-display text-4xl font-bold uppercase tracking-tight md:text-6xl">
            {t('sectionTitle')
              .split(' ')
              .map((word, i, arr) => (
                <span key={i} className={i === arr.length - 1 ? 'text-gold' : 'text-paper'}>
                  {word}
                  {i < arr.length - 1 ? ' ' : ''}
                </span>
              ))}
          </h2>
        </Reveal>
        <div className="mt-12">
          <ServicesCarousel />
        </div>
      </div>
    </section>
  );
}

function ProcessSection() {
  const t = useTranslations('Process');
  return (
    <section className="bg-white py-24">
      <div className="container-page">
        <Reveal>
          <SectionHeading index="02" eyebrow={t('sectionTitle')} title={t('sectionTitle')} />
          <div className="mt-16 grid gap-x-8 gap-y-12 md:grid-cols-3">
            {STEPS.map((n, i) => (
              <div key={n} className="group relative">
                <div className="flex items-center gap-4">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-gold/50 font-mono text-lg text-gold transition duration-300 group-hover:bg-gold group-hover:text-charcoal">
                    0{n}
                  </div>
                  {i < STEPS.length - 1 && (
                    <div className="hidden h-px flex-1 bg-gradient-to-r from-gold/50 to-line md:block" />
                  )}
                </div>
                <h3 className="mt-7 font-display text-2xl font-semibold tracking-tight text-ink">
                  {t(`step${n}Title`)}
                </h3>
                <p className="mt-3 max-w-xs text-sm leading-relaxed text-graphite">{t(`step${n}Desc`)}</p>
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
  const st = useTranslations('Stats');
  const stats: { to?: number; suffix?: string; display?: string; label: string }[] = [
    { to: 22, suffix: '+', label: st('fleet') },
    { to: 1594, label: st('passengers') },
    { to: 13, suffix: '+', label: st('partners') },
    { display: '24/7', label: st('available') },
  ];
  return (
    <section className="relative isolate overflow-hidden bg-charcoal py-24 text-paper">
      <Image
        src="/images/interior.jpg"
        alt=""
        fill
        sizes="100vw"
        className="-z-10 object-cover object-center opacity-30"
      />
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-charcoal via-charcoal/90 to-charcoal/60" />
      <div className="container-page">
        <div className="grid grid-cols-2 gap-y-12 md:grid-cols-4">
          {stats.map((s, i) => (
            <div
              key={i}
              className={`px-4 text-center md:px-10 ${i > 0 ? 'md:border-l md:border-platinum/15' : ''}`}
            >
              <div className="font-display text-5xl font-semibold tracking-tight text-paper md:text-6xl">
                {s.display ? (
                  s.display
                ) : (
                  <>
                    <CountUp to={s.to as number} />
                    {s.suffix ?? ''}
                  </>
                )}
              </div>
              <p className="mt-4 mono-label text-gold">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CoverageSection() {
  const t = useTranslations('Coverage');
  const cities = t('cities').split(',').map((c) => c.trim());
  return (
    <section className="overflow-hidden bg-white py-24">
      <div className="container-page">
        <Reveal>
          <SectionHeading eyebrow={t('sectionTitle')} title={t('sectionSubtitle', { count: cities.length })} />
        </Reveal>
      </div>

      {/* Kinetic city marquee */}
      <div className="marquee-group relative mt-14 flex overflow-hidden border-y border-line py-8">
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-white to-transparent md:w-40" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-white to-transparent md:w-40" />
        {[0, 1].map((dup) => (
          <ul key={dup} aria-hidden={dup === 1} className="flex shrink-0 animate-marquee items-center">
            {cities.map((city) => (
              <li key={city} className="flex items-center gap-8 pr-8">
                <span className="font-display text-4xl font-semibold text-ink md:text-6xl">{city}</span>
                <span className="text-xl text-gold">✦</span>
              </li>
            ))}
          </ul>
        ))}
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
