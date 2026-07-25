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

      <div className="mt-12 divide-y divide-line border-y border-line">
        {posts.map((post, i) => (
          <Link
            key={post.slug}
            href={{ pathname: '/blog/[slug]', params: { slug: post.slug } }}
            className="group flex flex-col gap-2 py-7 transition hover:bg-white md:flex-row md:items-baseline md:gap-8"
          >
            <span className="font-mono text-[11px] text-graphite md:w-28">
              {String(i + 1).padStart(2, '0')} · {post.date}
            </span>
            <div className="flex-1">
              <h2 className="font-display text-2xl font-semibold text-ink transition group-hover:text-gold-dark">
                {post.title[locale]}
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-graphite">{post.excerpt[locale]}</p>
            </div>
            <span className="text-gold transition group-hover:translate-x-1">⟶</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
