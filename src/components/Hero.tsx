import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { serviceSlugs, siteConfig } from '@/config/site';

export function Hero() {
  const t = useTranslations('Hero');
  const s = useTranslations('Services');

  return (
    <section className="relative isolate flex min-h-[88vh] items-center overflow-hidden bg-charcoal text-paper">
      {/* Cinematic full-bleed backdrop */}
      <Image
        src="/images/hero.jpg"
        alt=""
        fill
        priority
        sizes="100vw"
        className="-z-10 object-cover object-center"
      />
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-charcoal via-charcoal/80 to-charcoal/30" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-t from-charcoal/95 via-transparent to-charcoal/50" />

      <div className="container-page py-24">
        <div className="max-w-3xl">
          <span className="eyebrow text-gold">{t('badge')}</span>

          <h1 className="mt-7 font-display text-5xl font-semibold leading-[1.03] tracking-tight text-paper md:text-7xl">
            {t('title')}
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-platinum-light/85">
            {t('subtitle')}
          </p>

          {/* Keyword chips — what the company does */}
          <div className="mt-8 flex flex-wrap gap-2.5">
            {serviceSlugs.map((slug) => (
              <span
                key={slug}
                className="border border-platinum/25 px-3.5 py-1.5 text-[11px] font-medium uppercase tracking-[0.12em] text-platinum-light/80"
              >
                {s(`${slug}.title`)}
              </span>
            ))}
          </div>

          <div className="mt-11 flex flex-wrap items-center gap-4">
            <a
              href="#booking"
              className="inline-flex items-center gap-2 rounded-none bg-gold px-8 py-4 text-xs font-semibold uppercase tracking-[0.14em] text-charcoal transition hover:bg-gold-light"
            >
              {t('cta')} ↓
            </a>
            <a href={siteConfig.phoneHref} className="btn-ghost">
              {siteConfig.phone}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
