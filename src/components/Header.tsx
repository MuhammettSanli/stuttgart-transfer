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
    <header className="sticky top-0 z-50 border-b border-white/10 bg-charcoal/80 text-paper backdrop-blur">
      <div className="container-page flex h-16 items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-2.5 font-display text-lg font-semibold tracking-tight">
          <span className="h-2 w-2 rounded-full bg-platinum" aria-hidden />
          Stuttgart <span className="text-platinum-dark">Transfer</span>
        </Link>

        <nav className="hidden items-center gap-8 lg:flex">
          {NAV.map((item) => (
            <Link
              key={item.key}
              href={item.href}
              className="text-xs font-medium uppercase tracking-[0.12em] text-platinum-light/70 transition hover:text-paper"
            >
              {t(item.key)}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-5 lg:flex">
          <a href={siteConfig.phoneHref} className="font-mono text-xs tracking-[0.06em] text-paper transition hover:text-platinum">
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
          <span className="block h-0.5 w-6 bg-paper" />
          <span className="mt-1.5 block h-0.5 w-6 bg-paper" />
          <span className="mt-1.5 block h-0.5 w-6 bg-paper" />
        </button>
      </div>

      {open && (
        <nav className="border-t border-white/10 bg-charcoal lg:hidden">
          <div className="container-page flex flex-col py-3">
            {NAV.map((item) => (
              <Link
                key={item.key}
                href={item.href}
                onClick={() => setOpen(false)}
                className="py-2 text-xs font-medium uppercase tracking-[0.12em] text-platinum-light/70 hover:text-paper"
              >
                {t(item.key)}
              </Link>
            ))}
            <div className="mt-3 flex items-center justify-between border-t border-white/10 pt-3">
              <a href={siteConfig.phoneHref} className="font-mono text-xs tracking-[0.06em] text-paper">
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
