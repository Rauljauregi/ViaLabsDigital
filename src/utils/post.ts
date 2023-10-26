import { getCollection } from 'astro:content'

export const getCategories = async () => {
	const posts = await getCollection('blog')
	const categories = new Set(posts.map((post) => post.data.category))
	return Array.from(categories)
}

export const getPosts = async (max?: number) => {
	return (await getCollection('blog'))
		.filter((post) => !post.data.draft)
		.sort((a, b) => a.data.pubDate.valueOf() - b.data.pubDate.valueOf())
		.slice(0, max)
}

export const getNewsletterCategories = async() => {
	const posts = await getCollection('newsletter');
	const categories = new Set(posts.map((post) => post.data.category))
	return Array.from(categories);
}

export const getNewsletterPosts = async (max?: number) => {
	return (await getCollection('newsletter'))
		.filter((post) => !post.data.draft)
		.sort((a, b) => a.data.pubDate.valueOf() - b.data.pubDate.valueOf())
		.slice(0, max)
}

