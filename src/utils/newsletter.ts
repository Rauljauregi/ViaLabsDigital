import { getCollection } from 'astro:content'

export const getNewsletterCategories = async() => {
	const newsletters = await getCollection('newsletter');
	const categories = new Set(newsletters.map((newsletter) => newsletter.data.category))
	return Array.from(categories);
}

export const getNewsletterPosts = async (max?: number) => {
	return (await getCollection('newsletter'))
		.filter((post) => !post.data.draft)
		.sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf()) // Nota la modifica qui
		.slice(0, max);
}

