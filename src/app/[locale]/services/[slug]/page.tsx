import Image from 'next/image';
import { notFound } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import type { Metadata } from 'next';
import { Link } from '@/i18n/navigation';
import { routing } from '@/i18n/routing';
import { serviceSlugs, siteConfig, type ServiceSlug } from '@/config/site';

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
  const nav = useTranslations('Nav');
  const index = serviceSlugs.indexOf(slug) + 1;

  return (
    <article>
      {/* Image hero */}
      <section className="relative isolate flex min-h-[54vh] items-end overflow-hidden bg-charcoal text-paper">
        <Image
          src={`/images/service-${slug}.jpg`}
          alt={t(`${slug}.title`)}
          fill
          priority
          sizes="100vw"
          className="-z-10 object-cover object-center"
        />
        <div className="absolute inset-0 -z-10 bg-gradient-to-t from-charcoal via-charcoal/60 to-charcoal/20" />
        <div className="container-page py-14">
          <Link href="/services" className="text-xs font-medium uppercase tracking-[0.14em] text-platinum-light/80 transition hover:text-paper">
            ← {nav('services')}
          </Link>
          <div className="mt-6 flex items-center gap-3">
            <span className="font-mono text-sm text-gold">{String(index).padStart(2, '0')}</span>
            <span className="h-px w-8 bg-gold" />
          </div>
          <h1 className="mt-4 max-w-3xl font-display text-4xl font-semibold leading-[1.05] tracking-tight text-paper md:text-6xl">
            {t(`${slug}.title`)}
          </h1>
        </div>
      </section>

      {/* Content */}
      <section className="bg-paper py-16">
        <div className="container-page max-w-3xl">
          <p className="text-xl leading-relaxed text-graphite">{t(`${slug}.desc`)}</p>
          <div className="mt-10 flex flex-wrap items-center gap-4 border-t border-line pt-10">
            <Link href="/" className="btn-primary">{nav('bookNow')}</Link>
            <a href={siteConfig.phoneHref} className="text-sm font-medium text-ink transition hover:text-gold-dark">
              {siteConfig.phone}
            </a>
          </div>
        </div>
      </section>
    </article>
  );
}
