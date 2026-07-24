import { useTranslations } from 'next-intl';
import { setRequestLocale } from 'next-intl/server';
import { Hero } from '@/components/Hero';
import { FaqAccordion } from '@/components/FaqAccordion';
import { Reveal } from '@/components/Reveal';
import { Link } from '@/i18n/navigation';
import { serviceSlugs } from '@/config/site';

const TRUST = ['flightTracking', 'freeWaiting', 'fixedPrice', 'payInCar'] as const;
const FLEET = ['business', 'van', 'sprinter'] as const;
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
      <CoverageSection />
      <FaqSection />
    </>
  );
}

function TrustSection() {
  const t = useTranslations('Trust');
  return (
    <section className="border-b bg-white py-12">
      <div className="container-page grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {TRUST.map((key) => (
          <div key={key} className="rounded-xl border border-gray-100 bg-gray-50 p-5">
            <h3 className="font-semibold text-brand">{t(key)}</h3>
            <p className="mt-2 text-sm text-gray-600">{t(`${key}Desc`)}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function ServicesSection() {
  const t = useTranslations('Services');
  return (
    <section className="bg-gray-50 py-16">
      <div className="container-page">
        <Reveal>
        <div className="mb-10 text-center">
          <h2 className="text-3xl font-bold text-brand">{t('sectionTitle')}</h2>
          <p className="mt-2 text-gray-600">{t('sectionSubtitle')}</p>
        </div>
        </Reveal>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {serviceSlugs.map((slug) => (
            <Link
              key={slug}
              href={{ pathname: '/services/[slug]', params: { slug } }}
              className="group rounded-2xl bg-white p-6 shadow-sm transition hover:shadow-md"
            >
              <h3 className="text-lg font-semibold text-brand group-hover:text-gold-dark">
                {t(`${slug}.title`)}
              </h3>
              <p className="mt-2 text-sm text-gray-600">{t(`${slug}.desc`)}</p>
              <span className="mt-4 inline-block text-sm font-medium text-gold-dark">
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
    <section className="bg-white py-16">
      <div className="container-page">
        <Reveal>
        <h2 className="mb-10 text-center text-3xl font-bold text-brand">{t('sectionTitle')}</h2>
        <div className="grid gap-8 md:grid-cols-3">
          {STEPS.map((n) => (
            <div key={n} className="text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-gold text-lg font-bold text-brand-dark">
                {n}
              </div>
              <h3 className="font-semibold text-brand">{t(`step${n}Title`)}</h3>
              <p className="mt-2 text-sm text-gray-600">{t(`step${n}Desc`)}</p>
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
    <section className="bg-gray-50 py-16">
      <div className="container-page">
        <Reveal>
        <div className="mb-10 text-center">
          <h2 className="text-3xl font-bold text-brand">{t('sectionTitle')}</h2>
          <p className="mt-2 text-gray-600">{t('sectionSubtitle')}</p>
        </div>
        </Reveal>
        <div className="grid gap-6 md:grid-cols-3">
          {FLEET.map((slug) => (
            <div key={slug} className="rounded-2xl bg-white p-6 shadow-sm">
              <div className="mb-4 flex h-32 items-center justify-center rounded-xl bg-brand/5 text-gray-300">
                🚗
              </div>
              <h3 className="text-lg font-semibold text-brand">{t(`${slug}.name`)}</h3>
              <p className="mt-2 text-sm text-gray-600">{t(`${slug}.desc`)}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CoverageSection() {
  const t = useTranslations('Coverage');
  return (
    <section className="bg-brand py-16 text-white">
      <Reveal>
      <div className="container-page text-center">
        <h2 className="text-3xl font-bold">{t('sectionTitle')}</h2>
        <p className="mt-2 text-white/80">{t('sectionSubtitle')}</p>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-gold">{t('cities')}</p>
      </div>
      </Reveal>
    </section>
  );
}

function FaqSection() {
  const t = useTranslations('Faq');
  return (
    <section className="bg-white py-16">
      <div className="container-page">
        <h2 className="mb-10 text-center text-3xl font-bold text-brand">{t('sectionTitle')}</h2>
        <FaqAccordion />
      </div>
    </section>
  );
}
