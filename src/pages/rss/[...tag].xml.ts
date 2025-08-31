// src/pages/rss/[tag].xml.ts
import rss, { type RSSFeedItem } from '@astrojs/rss';
import type { APIContext } from 'astro';
import { getCollection } from 'astro:content';

export const prerender = true;

function abs(site: string, path: string) {
  const cleaned = path.startsWith('/') ? path : `/${path}`;
  return new URL(cleaned, site).toString();
}

export async function GET({ params }: APIContext) {
  const site = (import.meta.env.SITE || 'https://mindfulml.vialabsdigital.com').replace(/\/$/, '') + '/';
  const tagParam = String(params?.tag || '').toLowerCase();

  const blog = await getCollection('blog', (p) => !p.data.draft);
  const filtered = blog.filter((p) =>
    (p.data.tags || []).map((t: string) => t.toLowerCase()).includes(tagParam)
  );

  const items: RSSFeedItem[] = filtered.map((p) => ({
    title: p.data.title,
    description: p.data.description,
    pubDate: new Date(p.data.lastmod || p.data.pubDate),
    link: abs(site, `/post/${p.slug}/`),
    categories: [ ...(p.data.category ? [String(p.data.category)] : []), ...p.data.tags || [] ],
  }));

  return rss({
    title: `Feed: ${tagParam}`,
    description: `Últimos artículos etiquetados con ${tagParam}`,
    site,
    items,
  });
}
