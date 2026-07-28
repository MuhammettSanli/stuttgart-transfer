'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';

const ITEMS = ['1', '2', '3', '4', '5', '6', '7', '8'] as const;

export function FaqAccordion() {
  const t = useTranslations('Faq');
  const [open, setOpen] = useState<string | null>('1');

  return (
    <div className="mx-auto max-w-3xl divide-y divide-line border-y border-line">
      {ITEMS.map((n) => {
        const isOpen = open === n;
        return (
          <div key={n}>
            <button
              type="button"
              className="flex w-full items-center justify-between gap-4 py-5 text-left"
              onClick={() => setOpen(isOpen ? null : n)}
              aria-expanded={isOpen}
            >
              <span className="flex items-baseline gap-3">
                <span className="font-mono text-[11px] text-graphite">{String(ITEMS.indexOf(n) + 1).padStart(2, '0')}</span>
                <span className="font-display text-lg font-semibold text-ink">{t(`q${n}`)}</span>
              </span>
              <span className="font-mono text-lg text-ink">{isOpen ? '−' : '+'}</span>
            </button>
            {isOpen && <p className="pb-5 pl-8 text-sm leading-relaxed text-graphite">{t(`a${n}`)}</p>}
          </div>
        );
      })}
    </div>
  );
}
