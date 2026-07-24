import { notFound } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import type { Metadata } from 'next';
import { Link } from '@/i18n/navigation';
import { routing } from '@/i18n/routing';
import { serviceSlugs, type ServiceSlug } from '@/config/site';

export function generateStaticParams() {
  return routing.locales.flatMap((locale) =>
    serviceSlugs.map((slug) => ({ locale, slug })),
  );
}

function isServiceSlug(slug: string): slug is ServiceSlug {
  return (serviceSlugs as readonly string[]).includes(slug);
}

export async function generateMetadata({
  params: { locale, slug },
}: {
  params: { locale: string; slug: string };
}): Promise<Metadata> {
  if (!isServiceSlug(slug)) return {};
  const t = await getTranslations({ locale, namespace: 'Services' });
  return { title: t(`${slug}.title`), description: t(`${slug}.desc`) };
}

export default function ServiceDetailPage({
  params: { locale, slug },
}: {
  params: { locale: string; slug: string };
}) {
  setRequestLocale(locale);
  if (!isServiceSlug(slug)) notFound();
  return <ServiceDetail slug={slug} />;
}

function ServiceDetail({ slug }: { slug: ServiceSlug }) {
  const t = useTranslations('Services');
  const b = useTranslations('Nav');
  return (
    <article className="container-page py-16">
      <Link href="/services" className="text-sm text-gold-dark">← {b('services')}</Link>
      <h1 className="mt-4 text-3xl font-bold text-brand">{t(`${slug}.title`)}</h1>
      <p className="mt-4 max-w-2xl text-lg text-gray-600">{t(`${slug}.desc`)}</p>
      <div className="mt-8">
        <Link href="/" className="btn-primary">{b('bookNow')}</Link>
      </div>
    </article>
  );
}
