import { getCollection } from 'astro:content';

export const getNewsletterCategories = async () => {
	const newsletters = await getCollection('newsletter');
	const categories = new Set(newsletters.map((newsletter) => newsletter.data.category));
	return Array.from(categories);
};

export const getNewsletterPosts = async (max?: number) => {
	return (await getCollection('newsletter'))
		.filter((post) => !post.data.draft) // Excluir borradores
		.sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf()) // Ordenar por fecha
		.map((post) => ({
			...post,
			url: `https://mindfulml.vialabsdigital.com/newsletter/${post.slug}`,
		}));
};
