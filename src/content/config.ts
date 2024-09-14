import { defineCollection, z } from 'astro:content'
import { CATEGORIES } from '@/data/categories'

const blog = defineCollection({
	// Type-check frontmatter using a schema
	schema: ({ image }) =>
		z.object({
			title: z.string().max(80),
			description: z.string(),
			date: z
				.string()
				.or(z.date())
				.default(new Date())
				.transform((val) => new Date(val)),
			// Transform string to Date object
			pubDate: z
				.string()
				.or(z.date())
				.transform((val) => new Date(val))
				.optional(),
			heroImage: image().optional(),
			category: z.enum(CATEGORIES).or(
				z.object({
					names: z.string()
				})
			),
			tags: z.array(z.string()).default([]),
			comments: z.boolean().default(true),
			draft: z.boolean().default(false)
		})
})

export const collections = { blog }
