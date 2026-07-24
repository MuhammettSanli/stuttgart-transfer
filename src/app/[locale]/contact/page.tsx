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
  return (
    <div className="container-page py-16">
      <h1 className="text-3xl font-bold text-brand">{nav('contact')}</h1>
      <div className="mt-8 grid gap-8 md:grid-cols-2">
        <div className="space-y-3 text-gray-700">
          <p>
            <span className="font-semibold text-brand">{f('contact')}:</span><br />
            <a href={siteConfig.phoneHref} className="text-gold-dark">{siteConfig.phone}</a><br />
            <a href={`mailto:${siteConfig.email}`} className="text-gold-dark">{siteConfig.email}</a>
          </p>
          <p>
            {siteConfig.address.street}<br />
            {siteConfig.address.postalCode} {siteConfig.address.city}
          </p>
        </div>
        <ContactForm />
      </div>
    </div>
  );
}
