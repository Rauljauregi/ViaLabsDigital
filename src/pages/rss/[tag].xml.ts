// src/pages/rss/[tag].xml.ts
import rss, { type RSSFeedItem } from '@astrojs/rss';
import type { APIContext } from 'astro';
import { getCollection } from 'astro:content';

export const prerender = true;

// Enumerar los tags existentes para prerender
export async function getStaticPaths() {
  const posts = await getCollection('blog', (p) => !p.data.draft);
  const tags = new Set<string>();
  for (const p of posts) {
    (p.data.tags || [])
      .map((t: string) => String(t).toLowerCase())
      .forEach((t) => tags.add(t));
  }
  return Array.from(tags).map((tag) => ({ params: { tag } }));
}

function abs(site: string, path: string) {
  const cleaned = path.startsWith('/') ? path : `/${path}`;
  return new URL(cleaned, site).toString();
}

export async function GET({ params }: APIContext) {
  const site = (import.meta.env.SITE || 'https://mindfulml.vialabsdigital.com').replace(/\/$/, '') + '/';
  const tagParam = String(params?.tag || '').toLowerCase();
  if (!tagParam) return new Response('Missing tag', { status: 400 });

  const blog = await getCollection('blog', (p) => !p.data.draft);
  const filtered = blog.filter((p) =>
    (p.data.tags || []).map((t: string) => t.toLowerCase()).includes(tagParam)
  );

  const items: RSSFeedItem[] = filtered
    .map((p) => {
      const link = abs(site, `/post/${p.slug}/`);
      const pub = new Date(p.data.lastmod || p.data.pubDate);
      const categories = [
        ...(p.data.category ? [String(p.data.category)] : []),
        ...((p.data.tags || []) as string[]),
      ];
      const media = p.data.heroImage
        ? `<media:content xmlns:media="http://search.yahoo.com/mrss/" url="${abs(site, p.data.heroImage)}" medium="image"/>`
        : '';
      return {
        title: p.data.title,
        description: p.data.description,
        pubDate: pub,
        link,
        categories,
        customData: media,
      };
    })
    .sort((a, b) => (b.pubDate?.getTime() || 0) - (a.pubDate?.getTime() || 0));

  return rss({
    title: `Feed: ${tagParam}`,
    description: `Últimos artículos etiquetados con ${tagParam}`,
    site,
    items,
    customData: `
      <language>es</language>
      <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    `,
  });
}
