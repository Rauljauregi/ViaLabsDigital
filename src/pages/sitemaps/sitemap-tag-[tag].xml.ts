// src/pages/sitemaps/sitemap-tag-[tag].xml.ts
import type { APIContext } from 'astro';
import { getCollection } from 'astro:content';

export const prerender = true;

// Enumerar todos los tags existentes para prerenderizar rutas estáticas
export async function getStaticPaths() {
  const posts = await getCollection('blog', (p) => !p.data.draft);
  const tags = new Set<string>();
  for (const p of posts) {
    (p.data.tags || [])
      .map((t: string) => String(t).toLowerCase())
      .forEach((t) => tags.add(t));
  }

  // Devuelve una ruta por cada tag
  return Array.from(tags).map((tag) => ({
    params: { tag },
  }));
}

export async function GET({ params }: APIContext) {
  const site = (import.meta.env.SITE || 'https://mindfulml.vialabsdigital.com').replace(/\/$/, '');
  const tagParam = String(params?.tag || '').toLowerCase();
  if (!tagParam) {
    return new Response('Missing tag', { status: 400 });
  }

  const posts = await getCollection('blog', (p) => {
    if (p.data.draft) return false;
    const tags = (p.data.tags || []).map((t: string) => String(t).toLowerCase());
    return tags.includes(tagParam);
  });

  const imageNS = 'xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"';
  const header =
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" ${imageNS}>`;

  const body = posts
    .map((p) => {
      const slug = p.slug.startsWith('/') ? p.slug.slice(1) : p.slug;
      const url = `${site}/post/${slug}/`;
      const lastmod = new Date(p.data.lastmod || p.data.pubDate).toISOString();
      const hero = p.data.heroImage ? `${site}${p.data.heroImage}` : null;
      const img = hero ? `<image:image><image:loc>${hero}</image:loc></image:image>` : '';
      return `<url><loc>${url}</loc><lastmod>${lastmod}</lastmod>${img}</url>`;
    })
    .sort((a, b) => {
      const aDate = a.match(/<lastmod>(.*?)<\/lastmod>/)?.[1] || '';
      const bDate = b.match(/<lastmod>(.*?)<\/lastmod>/)?.[1] || '';
      return bDate.localeCompare(aDate);
    })
    .join('\n');

  const xml = `${header}\n${body}\n</urlset>`;

  return new Response(xml, {
    status: 200,
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'max-age=300, public'
    }
  });
}
