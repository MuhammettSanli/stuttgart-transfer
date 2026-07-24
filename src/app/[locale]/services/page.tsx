import { useTranslations } from 'next-intl';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import type { Metadata } from 'next';
import { Link } from '@/i18n/navigation';
import { serviceSlugs } from '@/config/site';

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: 'Services' });
  return { title: t('sectionTitle') };
}

export default function ServicesPage({ params: { locale } }: { params: { locale: string } }) {
  setRequestLocale(locale);
  return <ServicesList />;
}

function ServicesList() {
  const t = useTranslations('Services');
  return (
    <div className="container-page py-16">
      <h1 className="text-3xl font-bold text-brand">{t('sectionTitle')}</h1>
      <p className="mt-2 text-gray-600">{t('sectionSubtitle')}</p>
      <div className="mt-10 grid gap-6 md:grid-cols-2">
        {serviceSlugs.map((slug) => (
          <Link
            key={slug}
            href={{ pathname: '/services/[slug]', params: { slug } }}
            className="rounded-2xl border border-gray-200 bg-white p-6 transition hover:shadow-md"
          >
            <h2 className="text-xl font-semibold text-brand">{t(`${slug}.title`)}</h2>
            <p className="mt-2 text-gray-600">{t(`${slug}.desc`)}</p>
            <span className="mt-4 inline-block text-sm font-medium text-gold-dark">
              {t('learnMore')} →
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
