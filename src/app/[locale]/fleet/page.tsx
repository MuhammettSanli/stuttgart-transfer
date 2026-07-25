import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import type { Metadata } from 'next';

const FLEET = [
  { slug: 'business', img: '/images/fleet-business.jpg', pax: 4, bags: 4 },
  { slug: 'first', img: '/images/fleet-first.jpg', pax: 4, bags: 4 },
  { slug: 'van', img: '/images/fleet-van.jpg', pax: 8, bags: 8 },
  { slug: 'sprinter', img: '/images/fleet-sprinter.jpg', pax: 16, bags: 16 },
] as const;

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: 'Fleet' });
  return { title: t('sectionTitle') };
}

export default function FleetPage({ params: { locale } }: { params: { locale: string } }) {
  setRequestLocale(locale);
  return <FleetList />;
}

function FleetList() {
  const t = useTranslations('Fleet');
  return (
    <div className="container-page py-16">
      <span className="eyebrow text-graphite">{t('sectionTitle')}</span>
      <h1 className="mt-4 font-display text-4xl font-semibold tracking-tight text-ink">{t('sectionSubtitle')}</h1>

      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {FLEET.map((v, i) => (
          <div key={v.slug} className="border border-line bg-white">
            <div className="relative aspect-[4/3] w-full overflow-hidden border-b border-line bg-ink">
              <Image
                src={v.img}
                alt={t(`${v.slug}.name`)}
                fill
                sizes="(max-width: 768px) 100vw, 25vw"
                className="object-cover"
              />
              <span className="absolute left-3 top-3 bg-charcoal/80 px-2 py-1 font-mono text-[11px] text-platinum backdrop-blur">
                {String(i + 1).padStart(2, '0')}
              </span>
            </div>
            <div className="p-6">
              <h2 className="font-display text-xl font-semibold text-ink">{t(`${v.slug}.name`)}</h2>
              <p className="mt-2 text-sm leading-relaxed text-graphite">{t(`${v.slug}.desc`)}</p>
              <dl className="mt-5 space-y-2 border-t border-line pt-4">
                <div className="flex justify-between">
                  <dt className="mono-label text-graphite">{t('passengers')}</dt>
                  <dd className="font-mono text-sm text-ink">{String(v.pax).padStart(2, '0')}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="mono-label text-graphite">{t('luggage')}</dt>
                  <dd className="font-mono text-sm text-ink">{String(v.bags).padStart(2, '0')}</dd>
                </div>
              </dl>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
