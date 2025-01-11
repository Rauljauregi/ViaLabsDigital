import { getCollection } from 'astro:content';

export const prerender = true;

export async function GET() {
  const posts = await getCollection('blog');
  const pages = ['', 'about', 'contact'];
  const site = import.meta.env.SITE;

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${pages.map((page) => `
    <url>
      <loc>${site}${page ? `/${page}` : ''}</loc>
      <lastmod>${new Date().toISOString()}</lastmod>
    </url>
  `).join('')}
  ${posts.map((post) => `
    <url>
      <loc>${site}/blog/${post.slug}</loc>
      <lastmod>${post.data.updatedDate || post.data.publishDate}</lastmod>
    </url>
  `).join('')}
</urlset>`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600'
    }
  });
}