'use client';

import { useLocale } from 'next-intl';
import { useParams } from 'next/navigation';
import { usePathname, useRouter } from '@/i18n/navigation';
import { routing } from '@/i18n/routing';

const LABELS: Record<string, string> = { de: 'DE', en: 'EN', tr: 'TR' };

// Switches locale while preserving the current (localized) pathname.
export function LanguageSwitcher() {
  const locale = useLocale();
  const pathname = usePathname();
  const params = useParams();
  const router = useRouter();

  return (
    <div className="flex items-center gap-1 text-sm">
      {routing.locales.map((l) => (
        <button
          key={l}
          type="button"
          // @ts-expect-error -- next-intl validates params against the pathname
          onClick={() => router.replace({ pathname, params }, { locale: l })}
          aria-current={l === locale ? 'true' : undefined}
          className={`rounded-none px-2 py-1 font-mono text-xs uppercase tracking-[0.08em] transition ${
            l === locale ? 'bg-platinum text-charcoal' : 'text-platinum-light/60 hover:text-paper'
          }`}
        >
          {LABELS[l]}
        </button>
      ))}
    </div>
  );
}
