import { getCollection } from 'astro:content'
import { CATEGORIES } from '@/data/categories.ts'
import { unsluglify } from './sluglify.ts'

export const getAllCollection = async () => {
	const allPosts = [await getCollection('blog'), await getCollection('soft-dev')]
	return allPosts.flat()
}

export const getCategories = async () => {
	// const posts = await getCollection('blog')
	const posts = await getAllCollection()
	const categories = new Set(posts.map((post) => getCategoryName(post.data.category)))
	return Array.from(categories)
}

export const getCategoryTitleFromSlug = (cat: string | any) => {
	const name = getCategoryName(cat)
	const title = CATEGORIES.find((o) => o.slug === name)?.title
	return title || unsluglify(cat)
}

export const getCategoryName = (cat: string | any) => {
	switch (typeof cat) {
		case 'string':
			return cat
		case 'object':
			return cat.name
	}
	return cat
}

export const getPosts = async (max?: number) => {
	// return (await getCollection('soft-dev'))
	return (await getAllCollection())
		.filter((post) => !post.data.draft)
		.map((post) => {
			if (post.data.date) {
				post.data.pubDate = post.data.date
			}
			if (post.data.tags === undefined) {
				post.data.tags = []
			}
			return post
		})
		.sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf())
		.slice(0, max)
}

export const getTags = async () => {
	// const posts = await getCollection('blog')
	const posts = await getAllCollection()
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

export const filterPostsByCategory = async (category: string) => {
	const posts = await getPosts()
	return posts.filter((post) => post.data.category.toLowerCase() === category)
}
