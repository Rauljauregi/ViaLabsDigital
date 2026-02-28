// src/pages/rss.xml.ts
import rss, { type RSSFeedItem } from '@astrojs/rss';
import { getCollection } from 'astro:content';
import { siteConfig } from '@/site-config';

export const prerender = true;

function abs(site: string, path: string) {
  const cleaned = path.startsWith('/') ? path : `/${path}`;
  return new URL(cleaned, site).toString();
}

export async function GET() {
  const site = (import.meta.env.SITE || 'https://mindfulml.vialabsdigital.com').replace(/\/$/, '') + '/';

  // Colecciones
  const blog = await getCollection('blog', (p) => !p.data.draft);

  // Mapear a items RSS
  const blogItems: RSSFeedItem[] = blog.map((post) => {
    const link = abs(site, `/post/${post.slug}/`);
    const pub = new Date(post.data.lastmod || post.data.pubDate);
    const title = post.data.title;
    const description = post.data.description;
    const categories = [
      ...(post.data.category ? [String(post.data.category)] : []),
      ...((post.data.tags || []).map((t: string) => String(t))),
    ];

    // Media: imagen principal si existe
    const media = post.data.heroImage
      ? `<media:content xmlns:media="http://search.yahoo.com/mrss/" url="${abs(site, post.data.heroImage)}" medium="image"/>`
      : '';

    return {
      title,
      description,
      pubDate: pub,
      link,
      categories,
      customData: media,
    };
  });

  // Ordenar por fecha desc
  const items = [...blogItems].sort(
    (a, b) => (b.pubDate?.getTime() || 0) - (a.pubDate?.getTime() || 0)
  );

  // Datos extra para el canal (language, lastBuildDate)
  const nowRfc822 = new Date().toUTCString();
  const channelExtra = `
    <language>es</language>
    <lastBuildDate>${nowRfc822}</lastBuildDate>
  `;

  return rss({
    title: siteConfig.title,
    description: siteConfig.description,
    site,
    items,
    customData: channelExtra,
  });
}
