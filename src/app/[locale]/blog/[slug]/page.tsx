import Image from 'next/image';
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
      <Link href="/blog" className="text-xs font-medium uppercase tracking-[0.14em] text-graphite transition hover:text-gold-dark">
        ← Blog
      </Link>
      <p className="mt-8 font-mono text-[11px] uppercase tracking-[0.08em] text-gold">{post.date}</p>
      <h1 className="mt-3 font-display text-4xl font-semibold leading-[1.08] tracking-tight text-ink md:text-5xl">
        {post.title[l]}
      </h1>
      <div className="relative mt-8 aspect-[16/9] overflow-hidden border border-line">
        <Image src={post.image} alt={post.title[l]} fill priority sizes="(max-width: 768px) 100vw, 768px" className="object-cover" />
      </div>
      <p className="mt-8 text-lg leading-relaxed text-graphite">{post.body[l]}</p>
    </article>
  );
}
