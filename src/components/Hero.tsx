import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { BookingForm } from './BookingForm';

export function Hero() {
  const t = useTranslations('Hero');
  const trust = useTranslations('Trust');
  const points = ['flightTracking', 'freeWaiting', 'fixedPrice'] as const;

  return (
    <section className="relative isolate overflow-hidden bg-midnight text-ivory">
      {/* Cinematic backdrop */}
      <Image
        src="/images/hero.jpg"
        alt=""
        fill
        priority
        sizes="100vw"
        className="-z-10 object-cover object-right"
      />
      {/* Navy wash — heavier on the left for headline legibility */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-midnight via-midnight/85 to-midnight/30" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-t from-midnight/90 via-transparent to-midnight/40" />

      <div className="container-page grid gap-12 py-20 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:py-28">
        <div className="max-w-xl">
          <span className="eyebrow">{t('badge')}</span>
          <h1 className="mt-6 font-display text-4xl font-normal leading-[1.06] text-ivory md:text-6xl">
            {t('title')}
          </h1>
          <p className="mt-6 max-w-lg text-lg leading-relaxed text-ivory/75">
            {t('subtitle')}
          </p>

          <ul className="mt-8 flex flex-wrap gap-x-8 gap-y-3">
            {points.map((p) => (
              <li key={p} className="flex items-center gap-2 text-sm text-ivory/85">
                <span className="text-gold" aria-hidden>
                  ✦
                </span>
                {trust(p)}
              </li>
            ))}
          </ul>
        </div>

        <div className="lg:pl-4">
          <BookingForm />
        </div>
      </div>
    </section>
  );
}
