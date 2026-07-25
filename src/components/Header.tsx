'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { LanguageSwitcher } from './LanguageSwitcher';
import { siteConfig } from '@/config/site';

const NAV: Array<{ href: '/' | '/about' | '/services' | '/fleet' | '/blog' | '/contact'; key: string }> = [
  { href: '/', key: 'home' },
  { href: '/services', key: 'services' },
  { href: '/fleet', key: 'fleet' },
  { href: '/about', key: 'about' },
  { href: '/blog', key: 'blog' },
  { href: '/contact', key: 'contact' },
];

export function Header() {
  const t = useTranslations('Nav');
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-paper/90 text-ink backdrop-blur">
      <div className="container-page flex h-16 items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-2 font-display text-lg font-semibold tracking-tight">
          <span className="h-2.5 w-2.5 bg-signal" aria-hidden />
          Stuttgart <span className="text-graphite">Transfer</span>
        </Link>

        <nav className="hidden items-center gap-7 lg:flex">
          {NAV.map((item) => (
            <Link
              key={item.key}
              href={item.href}
              className="font-mono text-xs uppercase tracking-mono text-graphite transition hover:text-signal"
            >
              {t(item.key)}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-5 lg:flex">
          <a href={siteConfig.phoneHref} className="font-mono text-xs tracking-mono text-ink transition hover:text-signal">
            {siteConfig.phone}
          </a>
          <LanguageSwitcher />
        </div>

        <button
          type="button"
          className="lg:hidden"
          aria-label="Menu"
          onClick={() => setOpen((v) => !v)}
        >
          <span className="block h-0.5 w-6 bg-ink" />
          <span className="mt-1.5 block h-0.5 w-6 bg-ink" />
          <span className="mt-1.5 block h-0.5 w-6 bg-ink" />
        </button>
      </div>

      {open && (
        <nav className="border-t border-line bg-paper lg:hidden">
          <div className="container-page flex flex-col py-3">
            {NAV.map((item) => (
              <Link
                key={item.key}
                href={item.href}
                onClick={() => setOpen(false)}
                className="py-2 font-mono text-xs uppercase tracking-mono text-graphite hover:text-signal"
              >
                {t(item.key)}
              </Link>
            ))}
            <div className="mt-3 flex items-center justify-between border-t border-line pt-3">
              <a href={siteConfig.phoneHref} className="font-mono text-xs tracking-mono text-ink">
                {siteConfig.phone}
              </a>
              <LanguageSwitcher />
            </div>
          </div>
        </nav>
      )}
    </header>
  );
}
