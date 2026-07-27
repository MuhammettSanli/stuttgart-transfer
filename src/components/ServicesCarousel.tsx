'use client';

import Image from 'next/image';
import { useRef } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { serviceSlugs } from '@/config/site';

// Addison-Lee-style horizontal service carousel with prev/next arrows.
export function ServicesCarousel() {
  const t = useTranslations('Services');
  const scroller = useRef<HTMLDivElement>(null);

  const scroll = (dir: 'prev' | 'next') => {
    const el = scroller.current;
    if (!el) return;
    const amount = Math.min(el.clientWidth * 0.85, 420);
    el.scrollBy({ left: dir === 'next' ? amount : -amount, behavior: 'smooth' });
  };

  return (
    <div>
      {/* Arrows */}
      <div className="mb-8 flex gap-3">
        {(['prev', 'next'] as const).map((dir) => (
          <button
            key={dir}
            type="button"
            aria-label={dir === 'prev' ? 'Zurück' : 'Weiter'}
            onClick={() => scroll(dir)}
            className="flex h-11 w-11 items-center justify-center border border-platinum/25 text-gold transition hover:border-gold hover:bg-gold hover:text-charcoal"
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
              <path d={dir === 'prev' ? 'M15 6l-6 6 6 6' : 'M9 6l6 6-6 6'} strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        ))}
      </div>

      {/* Track */}
      <div
        ref={scroller}
        className="flex gap-6 overflow-x-auto scroll-smooth pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        style={{ scrollSnapType: 'x mandatory' }}
      >
        {serviceSlugs.map((slug) => (
          <Link
            key={slug}
            href={{ pathname: '/services/[slug]', params: { slug } }}
            className="group w-[80vw] shrink-0 sm:w-[360px] lg:w-[400px]"
            style={{ scrollSnapAlign: 'start' }}
          >
            <div className="relative aspect-[4/3] overflow-hidden">
              <Image
                src={`/images/service-${slug}.jpg`}
                alt={t(`${slug}.title`)}
                fill
                sizes="(max-width: 640px) 80vw, 400px"
                className="object-cover transition duration-700 group-hover:scale-105"
              />
            </div>
            <h3 className="mt-5 font-display text-2xl font-bold uppercase tracking-tight text-paper">
              {t(`${slug}.title`)}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-platinum-light/70">{t(`${slug}.desc`)}</p>
            <span className="mt-5 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-paper transition group-hover:text-gold">
              {t('learnMore')}
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
