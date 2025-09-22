// src/pages/sitemap.xml.ts
import { getCollection } from 'astro:content';

export const prerender = true;

export async function GET() {
  const site = (import.meta.env.SITE || 'https://mindfulml.vialabsdigital.com').replace(/\/$/, '');
  const posts = await getCollection('blog', (p) => !p.data.draft);

  // set de tags (minúsculas)
  const tags = new Set<string>();
  for (const p of posts) {
    (p.data.tags || []).map((t: string) => String(t).toLowerCase()).forEach((t) => tags.add(t));
  }

  const today = new Date().toISOString();

  const entries = [
    `<sitemap><loc>${site}/sitemaps/sitemap-posts.xml</loc><lastmod>${today}</lastmod></sitemap>`,
    ...Array.from(tags).map(
      (t) => `<sitemap><loc>${site}/sitemaps/sitemap-tag-${encodeURIComponent(t)}.xml</loc><lastmod>${today}</lastmod></sitemap>`
    ),
  ].join('');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries}
</sitemapindex>`.trim();

  return new Response(xml, {
    status: 200,
    headers: { 'Content-Type': 'application/xml; charset=utf-8', 'Cache-Control': 'max-age=300, public' }
  });
}
