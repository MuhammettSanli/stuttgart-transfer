import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { BookingForm } from './BookingForm';

export function Hero() {
  const t = useTranslations('Hero');
  const trust = useTranslations('Trust');
  const specs = ['flightTracking', 'freeWaiting', 'fixedPrice'] as const;

  return (
    <section className="relative isolate overflow-hidden bg-charcoal text-paper">
      {/* Cinematic full-bleed backdrop */}
      <Image
        src="/images/hero.jpg"
        alt=""
        fill
        priority
        sizes="100vw"
        className="-z-10 object-cover object-center"
      />
      {/* Charcoal wash for legibility */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-charcoal via-charcoal/85 to-charcoal/25" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-t from-charcoal/95 via-transparent to-charcoal/50" />

      <div className="container-page grid gap-12 py-20 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:py-28">
        <div className="max-w-xl">
          <span className="eyebrow text-platinum">{t('badge')}</span>

          <h1 className="mt-6 font-display text-4xl font-semibold leading-[1.05] tracking-tight text-paper md:text-6xl">
            {t('title')}
          </h1>
          <p className="mt-6 max-w-md text-lg leading-relaxed text-platinum-light/80">
            {t('subtitle')}
          </p>

          {/* Spec strip */}
          <div className="mt-10 grid max-w-lg grid-cols-3 border-t border-platinum/20">
            {specs.map((s, i) => (
              <div key={s} className="border-r border-platinum/20 py-4 pr-4 last:border-r-0">
                <span className="font-mono text-[11px] text-platinum">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <p className="mt-2 text-sm leading-snug text-paper/90">{trust(s)}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:pl-6">
          <BookingForm />
        </div>
      </div>
    </section>
  );
}
