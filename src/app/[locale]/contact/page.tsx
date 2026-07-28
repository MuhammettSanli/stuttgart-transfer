import { useTranslations } from 'next-intl';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import type { Metadata } from 'next';
import { siteConfig } from '@/config/site';
import { ContactForm } from '@/components/ContactForm';

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: 'Contact' });
  return { title: t('title'), description: t('lead') };
}

export default function ContactPage({ params: { locale } }: { params: { locale: string } }) {
  setRequestLocale(locale);
  return <Contact />;
}

const ICONS: Record<string, React.ReactNode> = {
  phone: (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.6">
      <path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1-9.4 0-17-7.6-17-17 0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1l-2.2 2.2z" />
    </svg>
  ),
  whatsapp: (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
      <path d="M17.47 14.38c-.3-.15-1.75-.86-2.02-.96-.27-.1-.47-.15-.67.15-.2.3-.77.96-.94 1.16-.17.2-.35.22-.65.07-.3-.15-1.25-.46-2.38-1.47-.88-.78-1.47-1.75-1.64-2.05-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.07-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.8.37-.27.3-1.04 1.02-1.04 2.48s1.07 2.88 1.22 3.08c.15.2 2.1 3.2 5.08 4.49.71.31 1.26.49 1.69.63.71.22 1.36.19 1.87.12.57-.09 1.75-.72 2-1.41.25-.7.25-1.29.17-1.41-.07-.13-.27-.2-.57-.35zM12 2C6.48 2 2 6.48 2 12c0 1.77.46 3.44 1.27 4.89L2 22l5.25-1.38A9.94 9.94 0 0012 22c5.52 0 10-4.48 10-10S17.52 2 12 2z" />
    </svg>
  ),
  email: (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.6">
      <rect x="3" y="5" width="18" height="14" rx="1.5" />
      <path d="M3 7l9 6 9-6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  address: (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.6">
      <path d="M12 21s-6-5.7-6-10a6 6 0 1112 0c0 4.3-6 10-6 10z" strokeLinejoin="round" />
      <circle cx="12" cy="11" r="2" />
    </svg>
  ),
  hours: (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.6">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
};

function Contact() {
  const nav = useTranslations('Nav');
  const c = useTranslations('Contact');
  const waNumber = siteConfig.whatsapp.replace(/[^0-9]/g, '');

  const items = [
    { icon: 'phone', label: c('phone'), value: siteConfig.phone, href: siteConfig.phoneHref },
    { icon: 'whatsapp', label: c('whatsapp'), value: siteConfig.whatsapp, href: `https://wa.me/${waNumber}` },
    { icon: 'email', label: c('email'), value: siteConfig.email, href: `mailto:${siteConfig.email}` },
    {
      icon: 'address',
      label: c('address'),
      value: `${siteConfig.address.street}, ${siteConfig.address.postalCode} ${siteConfig.address.city}`,
    },
    { icon: 'hours', label: c('hours'), value: c('hoursValue') },
  ];

  return (
    <div className="container-page py-16">
      <span className="eyebrow text-graphite">{nav('contact')}</span>
      <h1 className="mt-4 font-display text-4xl font-semibold tracking-tight text-ink md:text-5xl">
        {c('title')}
      </h1>
      <p className="mt-4 max-w-xl text-graphite">{c('lead')}</p>

      <div className="mt-12 grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
          {items.map((it) => {
            const content = (
              <div className="flex items-start gap-4 border border-line bg-white p-5 transition hover:border-gold/40">
                <span className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-gold/40 text-gold">
                  {ICONS[it.icon]}
                </span>
                <div>
                  <p className="mono-label text-graphite">{it.label}</p>
                  <p className="mt-1 text-ink">{it.value}</p>
                </div>
              </div>
            );
            return it.href ? (
              <a key={it.icon} href={it.href} target={it.icon === 'whatsapp' ? '_blank' : undefined} rel="noopener noreferrer" className="block">
                {content}
              </a>
            ) : (
              <div key={it.icon}>{content}</div>
            );
          })}
        </div>

        <ContactForm />
      </div>
    </div>
  );
}
