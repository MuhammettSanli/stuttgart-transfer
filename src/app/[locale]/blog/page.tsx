import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { setRequestLocale } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { posts } from '@/content/posts';

type Locale = 'de' | 'en' | 'tr';

export default function BlogPage({ params: { locale } }: { params: { locale: string } }) {
  setRequestLocale(locale);
  return <BlogList locale={locale as Locale} />;
}

function BlogList({ locale }: { locale: Locale }) {
  const t = useTranslations('Nav');
  return (
    <div className="container-page py-16">
      <span className="eyebrow text-graphite">{t('blog')}</span>
      <h1 className="mt-4 font-display text-4xl font-semibold tracking-tight text-ink md:text-5xl">{t('blog')}</h1>

      <div className="mt-12 grid gap-8 md:grid-cols-2">
        {posts.map((post) => (
          <Link
            key={post.slug}
            href={{ pathname: '/blog/[slug]', params: { slug: post.slug } }}
            className="group flex flex-col border border-line bg-white transition hover:-translate-y-1 hover:shadow-panel"
          >
            <div className="relative aspect-[16/9] overflow-hidden border-b border-line bg-ink">
              <Image
                src={post.image}
                alt={post.title[locale]}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover transition duration-700 group-hover:scale-105"
              />
            </div>
            <div className="flex flex-1 flex-col p-7">
              <span className="font-mono text-[11px] uppercase tracking-[0.08em] text-gold">{post.date}</span>
              <h2 className="mt-3 font-display text-2xl font-semibold text-ink transition group-hover:text-gold-dark">
                {post.title[locale]}
              </h2>
              <p className="mt-3 flex-1 text-sm leading-relaxed text-graphite">{post.excerpt[locale]}</p>
              <span className="mt-6 inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-ink transition group-hover:translate-x-1">
                {t('blog')} ⟶
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
