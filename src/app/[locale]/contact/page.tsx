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
  const t = await getTranslations({ locale, namespace: 'Nav' });
  return { title: t('contact') };
}

export default function ContactPage({ params: { locale } }: { params: { locale: string } }) {
  setRequestLocale(locale);
  return <Contact />;
}

function Contact() {
  const nav = useTranslations('Nav');
  const f = useTranslations('Footer');

  const rows = [
    { label: f('contact'), value: siteConfig.phone, href: siteConfig.phoneHref },
    { label: 'E-Mail', value: siteConfig.email, href: `mailto:${siteConfig.email}` },
    {
      label: siteConfig.address.city,
      value: `${siteConfig.address.street}, ${siteConfig.address.postalCode} ${siteConfig.address.city}`,
    },
  ];

  return (
    <div className="container-page py-16">
      <span className="eyebrow text-graphite">{nav('contact')}</span>
      <h1 className="mt-4 font-display text-4xl font-semibold tracking-tight text-ink md:text-5xl">
        {nav('contact')}
      </h1>

      <div className="mt-12 grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
        <dl className="divide-y divide-line border-y border-line">
          {rows.map((r) => (
            <div key={r.label} className="py-5">
              <dt className="mono-label text-graphite">{r.label}</dt>
              <dd className="mt-1 text-ink">
                {r.href ? (
                  <a href={r.href} className="transition hover:text-gold-dark">{r.value}</a>
                ) : (
                  r.value
                )}
              </dd>
            </div>
          ))}
        </dl>

        <ContactForm />
      </div>
    </div>
  );
}
