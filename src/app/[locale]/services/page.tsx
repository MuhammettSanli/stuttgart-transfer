import Image from 'next/image';
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
      <span className="eyebrow text-graphite">{t('sectionTitle')}</span>
      <h1 className="mt-4 max-w-2xl font-display text-4xl font-semibold tracking-tight text-ink md:text-5xl">
        {t('sectionSubtitle')}
      </h1>

      <div className="mt-12 grid gap-6 md:grid-cols-2">
        {serviceSlugs.map((slug, i) => (
          <Link
            key={slug}
            href={{ pathname: '/services/[slug]', params: { slug } }}
            className="group flex flex-col border border-line bg-white transition hover:shadow-panel"
          >
            <div className="relative aspect-[16/10] overflow-hidden border-b border-line bg-ink">
              <Image
                src={`/images/service-${slug}.jpg`}
                alt={t(`${slug}.title`)}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover transition duration-700 group-hover:scale-[1.04]"
              />
              <span className="absolute left-3 top-3 bg-charcoal/80 px-2 py-1 font-mono text-[11px] text-platinum backdrop-blur">
                {String(i + 1).padStart(2, '0')}
              </span>
            </div>
            <div className="flex flex-1 flex-col p-7">
              <h2 className="font-display text-xl font-semibold text-ink">{t(`${slug}.title`)}</h2>
              <p className="mt-3 flex-1 text-sm leading-relaxed text-graphite">{t(`${slug}.desc`)}</p>
              <span className="mt-6 text-[11px] font-semibold uppercase tracking-[0.14em] text-gold-dark transition group-hover:translate-x-1">
                {t('learnMore')} ⟶
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
