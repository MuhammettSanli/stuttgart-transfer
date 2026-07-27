'use client';

import Image from 'next/image';
import { useRef, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { serviceSlugs } from '@/config/site';

// Addison-Lee-style horizontal service carousel: large cards, thin gold arrows,
// click-and-drag scrolling, and a gold progress indicator.
export function ServicesCarousel() {
  const t = useTranslations('Services');
  const scroller = useRef<HTMLDivElement>(null);
  const drag = useRef({ down: false, startX: 0, scrollLeft: 0, moved: false });
  const [bar, setBar] = useState({ left: 0, width: 30 });

  const scroll = (dir: 'prev' | 'next') => {
    const el = scroller.current;
    if (!el) return;
    const amount = Math.min(el.clientWidth * 0.85, 640);
    el.scrollBy({ left: dir === 'next' ? amount : -amount, behavior: 'smooth' });
  };

  const updateBar = () => {
    const el = scroller.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    const ratio = el.clientWidth / el.scrollWidth;
    const progress = max > 0 ? el.scrollLeft / max : 0;
    setBar({ left: progress * (1 - ratio) * 100, width: ratio * 100 });
  };

  const onPointerDown = (e: React.PointerEvent) => {
    const el = scroller.current;
    if (!el) return;
    drag.current = { down: true, startX: e.clientX, scrollLeft: el.scrollLeft, moved: false };
  };
  const onPointerMove = (e: React.PointerEvent) => {
    const el = scroller.current;
    if (!el || !drag.current.down) return;
    const dx = e.clientX - drag.current.startX;
    if (Math.abs(dx) > 4) drag.current.moved = true;
    el.scrollLeft = drag.current.scrollLeft - dx;
  };
  const endDrag = () => {
    drag.current.down = false;
  };
  // Suppress the click that follows a drag so cards don't navigate mid-swipe.
  const onClickCapture = (e: React.MouseEvent) => {
    if (drag.current.moved) {
      e.preventDefault();
      e.stopPropagation();
    }
  };

  return (
    <div>
      {/* Arrows */}
      <div className="mb-8 flex items-center gap-4">
        {(['prev', 'next'] as const).map((dir) => (
          <button
            key={dir}
            type="button"
            aria-label={dir === 'prev' ? 'Zurück' : 'Weiter'}
            onClick={() => scroll(dir)}
            className="text-gold transition hover:scale-110 hover:text-gold-light"
          >
            <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d={dir === 'prev' ? 'M15 5l-7 7 7 7' : 'M9 5l7 7-7 7'} strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        ))}
      </div>

      {/* Track */}
      <div
        ref={scroller}
        onScroll={updateBar}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerLeave={endDrag}
        onClickCapture={onClickCapture}
        onDragStart={(e) => e.preventDefault()}
        className="flex cursor-grab gap-6 overflow-x-auto scroll-smooth pb-2 select-none active:cursor-grabbing [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        style={{ scrollSnapType: 'x mandatory' }}
      >
        {serviceSlugs.map((slug) => (
          <Link
            key={slug}
            href={{ pathname: '/services/[slug]', params: { slug } }}
            className="group w-[78vw] shrink-0 sm:w-[400px] lg:w-[480px]"
            style={{ scrollSnapAlign: 'start' }}
          >
            <div className="relative aspect-[3/2] overflow-hidden">
              <Image
                src={`/images/service-${slug}.jpg`}
                alt={t(`${slug}.title`)}
                fill
                sizes="(max-width: 640px) 78vw, 480px"
                draggable={false}
                className="pointer-events-none object-cover transition duration-700 group-hover:scale-105"
              />
            </div>
            <h3 className="mt-6 font-display text-2xl font-bold uppercase tracking-tight text-paper md:text-3xl">
              {t(`${slug}.title`)}
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-platinum-light/70">{t(`${slug}.desc`)}</p>
            <span className="mt-6 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-paper transition group-hover:text-gold">
              {t('learnMore')}
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
          </Link>
        ))}
      </div>

      {/* Progress bar */}
      <div className="relative mt-8 h-px bg-platinum/15">
        <div
          className="absolute top-0 h-px bg-gold transition-[left,width] duration-150"
          style={{ left: `${bar.left}%`, width: `${bar.width}%` }}
        />
      </div>
    </div>
  );
}
