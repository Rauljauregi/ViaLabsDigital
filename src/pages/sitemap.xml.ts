import { getCollection } from 'astro:content';

export const prerender = true;

export async function GET() {
  // Define la URL base del sitio
  const site = 'https://mindfulml.vialabsdigital.com';

  // Obtiene las publicaciones desde la colección 'blog'
  const posts = await getCollection('blog');

  // Genera el contenido XML
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${site}/</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
  </url>
  ${posts
    .map((post) => {
      const slug = post.slug.startsWith('/') ? post.slug.substring(1) : post.slug; // Elimina slash inicial si existe
      return `
    <url>
      <loc>${site}/post/${slug}</loc>
      <lastmod>${post.data.updated || post.data.published || new Date().toISOString()}</lastmod>
    </url>
  `;
    })
    .join('')}
</urlset>`;

  // Devuelve el contenido XML con encabezados correctos
  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600', // Cache de 1 hora
    },
  });
}
