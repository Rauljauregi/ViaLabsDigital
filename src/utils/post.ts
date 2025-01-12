import { getCollection } from 'astro:content';

export const getCategories = async () => {
	const posts = await getCollection('blog');
	const categories = new Set(posts.map((post) => post.data.category));
	return Array.from(categories);
};

export const getPosts = async () => {
	const posts = await getCollection('blog');
	return posts
		.filter((post) => !post.data.draft) // Excluir borradores
		.sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf()) // Ordenar por fecha descendente
		.map((post) => ({
			...post,
			url: `https://mindfulml.vialabsdigital.com/blog/${post.slug}`,
		}));
};
export const getTags = async () => {
	// const posts = await getCollection('blog')
	// const posts = await getAllCollection()
	const posts = await getPosts()
	const tags = new Set()
	posts.forEach((post) => {
		post.data.tags.forEach((tag) => {
			tags.add(tag.toLowerCase())
		})
	})

	return Array.from(tags)
}
export const getPostByTag = async (tag: string) => {
	const posts = await getPosts()
	const lowercaseTag = tag.toLowerCase()
	return posts.filter((post) => {
		return post.data.tags.some((postTag) => postTag.toLowerCase() === lowercaseTag)
	})
}
