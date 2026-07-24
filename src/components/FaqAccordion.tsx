'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';

const ITEMS = ['1', '2', '3', '4'] as const;

export function FaqAccordion() {
  const t = useTranslations('Faq');
  const [open, setOpen] = useState<string | null>('1');

  return (
    <div className="mx-auto max-w-3xl divide-y divide-gray-200 rounded-2xl border border-gray-200">
      {ITEMS.map((n) => {
        const isOpen = open === n;
        return (
          <div key={n}>
            <button
              type="button"
              className="flex w-full items-center justify-between px-5 py-4 text-left font-semibold text-brand"
              onClick={() => setOpen(isOpen ? null : n)}
              aria-expanded={isOpen}
            >
              {t(`q${n}`)}
              <span className="ml-4 text-gold">{isOpen ? '−' : '+'}</span>
            </button>
            {isOpen && <p className="px-5 pb-4 text-gray-600">{t(`a${n}`)}</p>}
          </div>
        );
      })}
    </div>
  );
}
