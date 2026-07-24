import { notFound } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';
import type { Metadata } from 'next';
import { Link } from '@/i18n/navigation';
import { routing } from '@/i18n/routing';
import { posts, getPost } from '@/content/posts';

type Locale = 'de' | 'en' | 'tr';

export function generateStaticParams() {
  return routing.locales.flatMap((locale) =>
    posts.map((p) => ({ locale, slug: p.slug })),
  );
}

export async function generateMetadata({
  params: { locale, slug },
}: {
  params: { locale: string; slug: string };
}): Promise<Metadata> {
  const post = getPost(slug);
  if (!post) return {};
  const l = locale as Locale;
  return { title: post.title[l], description: post.excerpt[l] };
}

export default function BlogPostPage({
  params: { locale, slug },
}: {
  params: { locale: string; slug: string };
}) {
  setRequestLocale(locale);
  const post = getPost(slug);
  if (!post) notFound();
  const l = locale as Locale;

  return (
    <article className="container-page max-w-3xl py-16">
      <Link href="/blog" className="text-sm text-gold-dark">← Blog</Link>
      <p className="mt-4 text-xs text-gray-400">{post.date}</p>
      <h1 className="mt-2 text-3xl font-bold text-brand">{post.title[l]}</h1>
      <p className="mt-6 leading-relaxed text-gray-700">{post.body[l]}</p>
    </article>
  );
}
