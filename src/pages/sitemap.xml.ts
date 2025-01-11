import { getCollection } from 'astro:content';

export const prerender = true;

export async function GET() {
  // Obtiene los posts de la colección 'blog'
  const posts = await getCollection('blog');

  // Define las páginas estáticas
  const staticPages = ['', 'about', 'contact']; // Asegúrate de incluir aquí tus páginas estáticas
  const site = import.meta.env.SITE;

  // Genera el contenido XML
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${staticPages
    .map((page) => `
    <url>
      <loc>${site}${page ? `/${page}` : ''}</loc>
      <lastmod>${new Date().toISOString()}</lastmod>
    </url>
  `)
    .join('')}
  ${posts
    .map((post) => `
    <url>
      <loc>${site}/post/${post.slug}</loc>
      <lastmod>${post.data.updated || post.data.published || new Date().toISOString()}</lastmod>
    </url>
  `)
    .join('')}
</urlset>`;

  // Devuelve la respuesta XML
  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600', // Cache de 1 hora
    },
  });
}
