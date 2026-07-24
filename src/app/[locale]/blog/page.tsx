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
      <h1 className="text-3xl font-bold text-brand">{t('blog')}</h1>
      <div className="mt-10 grid gap-6 md:grid-cols-2">
        {posts.map((post) => (
          <Link
            key={post.slug}
            href={{ pathname: '/blog/[slug]', params: { slug: post.slug } }}
            className="rounded-2xl border border-gray-200 bg-white p-6 transition hover:shadow-md"
          >
            <p className="text-xs text-gray-400">{post.date}</p>
            <h2 className="mt-2 text-lg font-semibold text-brand">{post.title[locale]}</h2>
            <p className="mt-2 text-sm text-gray-600">{post.excerpt[locale]}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
