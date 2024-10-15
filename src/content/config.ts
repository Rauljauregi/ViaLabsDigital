import { defineCollection, z } from 'astro:content'
import { CATEGORIES } from '@/data/categories'
import { siteConfig } from '@/site-config'

const blog = defineCollection({
	// Type-check frontmatter using a schema
	schema: ({ image }) =>
		z.object({
			title: z.string().max(80),
			description: z.string(),
			index: z.boolean().default(false),
			date: z.string().or(z.date()).optional(),
			// Transform string to Date object
			pubDate: z
				.string()
				.or(z.date())
				.transform((val) => new Date(val))
				.optional(),
			heroImage: image().optional(),
			category: z
				.enum([CATEGORIES[0].slug, ...CATEGORIES.slice(1).map((c) => c.slug)])
				.or(z.string())
				.or(
					z.object({
						name: z.string(),
						index: z.number().optional(),
						depth: z.number().optional()
					})
				),
			tags: z.array(z.string()).default([]),
			comments: z.boolean().default(false),
			draft: z.boolean().default(siteConfig.config.commentsEnabled)
		})
})

export const collections = { blog }
