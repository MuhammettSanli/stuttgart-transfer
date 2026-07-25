import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { BookingForm } from './BookingForm';

export function Hero() {
  const t = useTranslations('Hero');
  const trust = useTranslations('Trust');
  const specs = ['flightTracking', 'freeWaiting', 'fixedPrice'] as const;

  return (
    <section className="bg-paper">
      <div className="container-page grid gap-12 pt-16 pb-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-start lg:pt-24">
        <div className="max-w-xl">
          <span className="eyebrow">Stuttgart · STR · 24/7</span>

          <h1 className="mt-7 font-display text-5xl font-medium leading-[1.02] tracking-tight text-ink md:text-7xl">
            {t('title')}
          </h1>
          <p className="mt-6 max-w-md text-lg leading-relaxed text-graphite">
            {t('subtitle')}
          </p>

          {/* Instrument-style spec strip */}
          <div className="mt-10 grid grid-cols-3 border-t border-line">
            {specs.map((s, i) => (
              <div key={s} className="border-r border-line py-4 pr-4 last:border-r-0">
                <span className="font-mono text-[11px] text-signal">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <p className="mt-2 text-sm font-medium leading-snug text-ink">{trust(s)}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:pt-2">
          <BookingForm />
        </div>
      </div>

      {/* Framed spec photograph — the car as an engineering exhibit */}
      <div className="container-page pb-16">
        <figure className="relative border border-ink/10">
          <div className="relative aspect-[21/9] w-full overflow-hidden">
            <Image
              src="/images/hero.jpg"
              alt="Mercedes-Benz S-Klasse Chauffeur"
              fill
              priority
              sizes="100vw"
              className="object-cover object-center"
            />
          </div>
          <figcaption className="flex items-center justify-between border-t border-line bg-white px-4 py-2">
            <span className="mono-label">S-Klasse · Chauffeur</span>
            <span className="mono-label text-signal">STR ⟶ Stuttgart</span>
          </figcaption>
        </figure>
      </div>
    </section>
  );
}
