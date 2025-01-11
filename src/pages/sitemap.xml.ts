import { getCollection } from 'astro:content';

export async function get({ site }) {
    const posts = await getCollection('blog');
    const newsletters = await getCollection('newsletter');

    const pages = [
        { url: `${site}/`, priority: 1.0, changefreq: 'yearly' },
        ...posts.map((post) => ({
            url: `${site}/post/${post.slug}`,
            priority: 0.8,
            changefreq: 'weekly',
        })),
        ...newsletters.map((newsletter) => ({
            url: `${site}/newsletter/post/${newsletter.slug}`,
            priority: 0.6,
            changefreq: 'monthly',
        })),
    ];

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
        body: sitemap,
        headers: {
            'Content-Type': 'application/xml',
        },
    };
}
