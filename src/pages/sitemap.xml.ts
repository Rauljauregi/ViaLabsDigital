import { getCollection } from 'astro:content';

export async function get({ site }) {
	const posts = await getCollection('blog');
	const newsletters = await getCollection('newsletter');

	// Generar URLs dinámicas
	const pages = [
		{ url: `${site}/`, priority: 1.0, changefreq: 'yearly' },
		...posts.map((post) => ({
			url: `${site}/blog/${post.slug}`,
			priority: 0.8,
			changefreq: 'weekly',
		})),
		...newsletters.map((newsletter) => ({
			url: `${site}/newsletter/${newsletter.slug}`,
			priority: 0.6,
			changefreq: 'monthly',
		})),
	];

	// Construir el contenido del sitemap.xml
	const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
	${pages
		.map(
			(page) => `
	<url>
		<loc>${page.url}</loc>
		<priority>${page.priority}</priority>
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
