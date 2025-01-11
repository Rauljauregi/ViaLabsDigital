import { getCollection } from 'astro:content';

export async function get({ site }) {
    // Obtener colecciones de posts y newsletters
    const posts = await getCollection('blog');
    const newsletters = await getCollection('newsletter');

    // Construir las páginas para el sitemap
    const pages = [
        { url: `${site}/`, priority: 1.0, changefreq: 'yearly' }, // Página principal
        ...posts.map((post) => ({
            url: `${site}/post/${post.slug}`, // Ruta para cada post
            priority: 0.8,
            changefreq: 'weekly',
        })),
        ...newsletters.map((newsletter) => ({
            url: `${site}/newsletter/post/${newsletter.slug}`, // Ruta para cada newsletter
            priority: 0.6,
            changefreq: 'monthly',
        })),
    ];

    // Generar el contenido del sitemap en formato XML
    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages
    .map(
        (page) => `
  <url>
    <loc>${page.url}</loc>
    <priority>${page.priority.toFixed(1)}</priority>
    <changefreq>${page.changefreq}</changefreq>
  </url>`
    )
    .join('')}
</urlset>`;

    return {
        body: sitemap, // Contenido del sitemap
        headers: {
            'Content-Type': 'application/xml', // Encabezado para indicar XML
        },
    };
}
