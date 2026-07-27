'use client';

import { useState, type ReactNode } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { LanguageSwitcher } from './LanguageSwitcher';
import { siteConfig, serviceSlugs } from '@/config/site';

const NAV: Array<{ href: '/' | '/about' | '/services' | '/fleet' | '/blog' | '/contact'; key: string }> = [
  { href: '/', key: 'home' },
  { href: '/services', key: 'services' },
  { href: '/fleet', key: 'fleet' },
  { href: '/about', key: 'about' },
  { href: '/blog', key: 'blog' },
  { href: '/contact', key: 'contact' },
];

const FLEET_SLUGS = ['business', 'first', 'van', 'sprinter'] as const;

const navLink =
  'text-xs font-medium uppercase tracking-[0.12em] text-platinum-light/70 transition hover:text-paper';

// Desktop hover dropdown wrapper.
function Dropdown({
  label,
  href,
  children,
}: {
  label: string;
  href: '/services' | '/fleet';
  children: ReactNode;
}) {
  return (
    <div className="group relative">
      <Link href={href} className={`flex items-center gap-1 ${navLink}`}>
        {label}
        <svg viewBox="0 0 24 24" className="h-3 w-3 transition group-hover:rotate-180" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </Link>
      <div className="invisible absolute left-1/2 top-full z-50 -translate-x-1/2 pt-4 opacity-0 transition duration-200 group-hover:visible group-hover:opacity-100">
        <div className="min-w-[260px] border border-white/10 bg-charcoal shadow-xl">{children}</div>
      </div>
    </div>
  );
}

const dropdownItem =
  'block border-b border-white/5 px-5 py-3.5 text-sm text-platinum-light/80 transition last:border-b-0 hover:bg-white/5 hover:text-gold';

export function Header() {
  const t = useTranslations('Nav');
  const s = useTranslations('Services');
  const fl = useTranslations('Fleet');
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-charcoal/80 text-paper backdrop-blur">
      <div className="container-page flex h-16 items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-2.5 font-display text-lg font-semibold tracking-tight">
          <span className="h-2 w-2 rounded-full bg-gold" aria-hidden />
          Stuttgart <span className="text-platinum-dark">Transfer</span>
        </Link>

        <nav className="hidden items-center gap-8 lg:flex">
          {NAV.map((item) => {
            if (item.key === 'services') {
              return (
                <Dropdown key={item.key} label={t('services')} href="/services">
                  {serviceSlugs.map((slug) => (
                    <Link key={slug} href={{ pathname: '/services/[slug]', params: { slug } }} className={dropdownItem}>
                      {s(`${slug}.title`)}
                    </Link>
                  ))}
                </Dropdown>
              );
            }
            if (item.key === 'fleet') {
              return (
                <Dropdown key={item.key} label={t('fleet')} href="/fleet">
                  {FLEET_SLUGS.map((slug) => (
                    <Link key={slug} href="/fleet" className={dropdownItem}>
                      {fl(`${slug}.name`)}
                    </Link>
                  ))}
                </Dropdown>
              );
            }
            return (
              <Link key={item.key} href={item.href} className={navLink}>
                {t(item.key)}
              </Link>
            );
          })}
        </nav>

        <div className="hidden items-center gap-5 lg:flex">
          <a href={siteConfig.phoneHref} className="font-mono text-xs tracking-[0.06em] text-gold transition hover:text-gold-light">
            {siteConfig.phone}
          </a>
          <LanguageSwitcher />
        </div>

        <button type="button" className="lg:hidden" aria-label="Menu" onClick={() => setOpen((v) => !v)}>
          <span className="block h-0.5 w-6 bg-paper" />
          <span className="mt-1.5 block h-0.5 w-6 bg-paper" />
          <span className="mt-1.5 block h-0.5 w-6 bg-paper" />
        </button>
      </div>

      {open && (
        <nav className="border-t border-white/10 bg-charcoal lg:hidden">
          <div className="container-page flex flex-col py-3">
            {NAV.map((item) => (
              <div key={item.key}>
                <Link
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="block py-2 text-xs font-medium uppercase tracking-[0.12em] text-platinum-light/70 hover:text-paper"
                >
                  {t(item.key)}
                </Link>
                {item.key === 'services' && (
                  <div className="mb-1 ml-3 flex flex-col border-l border-white/10 pl-3">
                    {serviceSlugs.map((slug) => (
                      <Link
                        key={slug}
                        href={{ pathname: '/services/[slug]', params: { slug } }}
                        onClick={() => setOpen(false)}
                        className="py-1.5 text-xs text-platinum-light/60 hover:text-gold"
                      >
                        {s(`${slug}.title`)}
                      </Link>
                    ))}
                  </div>
                )}
                {item.key === 'fleet' && (
                  <div className="mb-1 ml-3 flex flex-col border-l border-white/10 pl-3">
                    {FLEET_SLUGS.map((slug) => (
                      <Link
                        key={slug}
                        href="/fleet"
                        onClick={() => setOpen(false)}
                        className="py-1.5 text-xs text-platinum-light/60 hover:text-gold"
                      >
                        {fl(`${slug}.name`)}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
            <div className="mt-3 flex items-center justify-between border-t border-white/10 pt-3">
              <a href={siteConfig.phoneHref} className="font-mono text-xs tracking-[0.06em] text-gold">
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
