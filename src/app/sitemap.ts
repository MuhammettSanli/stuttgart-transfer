import type { MetadataRoute } from 'next';
import { routing } from '@/i18n/routing';
import { serviceSlugs } from '@/config/site';
import { posts } from '@/content/posts';

// Localized sitemap. Emits every top-level page and dynamic route per locale.
export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';
  const staticPaths = ['', '/services', '/fleet', '/about', '/blog', '/contact'];

  const entries: MetadataRoute.Sitemap = [];

  for (const locale of routing.locales) {
    for (const p of staticPaths) {
      entries.push({ url: `${base}/${locale}${p}`, changeFrequency: 'weekly', priority: p === '' ? 1 : 0.7 });
    }
    for (const slug of serviceSlugs) {
      entries.push({ url: `${base}/${locale}/services/${slug}`, changeFrequency: 'monthly', priority: 0.6 });
    }
    for (const post of posts) {
      entries.push({ url: `${base}/${locale}/blog/${post.slug}`, changeFrequency: 'monthly', priority: 0.5 });
    }
  }

  return entries;
}
