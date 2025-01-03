import { defineConfig } from 'astro/config'
import mdx from '@astrojs/mdx'
import sitemap from '@astrojs/sitemap'
import tailwind from '@astrojs/tailwind'
import { remarkReadingTime } from './src/utils/readTime.ts'
import vercel from '@astrojs/vercel/serverless'
import { fileURLToPath } from 'node:url'
import * as path from 'path'
import fs from 'node:fs'
import partytown from '@astrojs/partytown'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const directoryPath = path.join(__dirname, 'src', 'content', 'blog')
const NewsletterDirectoryPath = path.join(__dirname, 'src', 'content', 'newsletter')
const files = fs.readdirSync(directoryPath)
const newsletterFiles = fs.readdirSync(NewsletterDirectoryPath)
const blogUrl = 'https://mindfulml.vialabsdigital.com/post'
const newsletterUrl = 'https://mindfulml.vialabsdigital.com/newsletter/post'

const blogUrls = files.map((file) => {
	const fileName = file.split('.')[0]
	return `${blogUrl}/${fileName}`
})

const newsletterUrls = newsletterFiles.map((file) => {
	const newsletterfileName = file.split('.')[0]
	return `${newsletterUrl}/${newsletterfileName}`
})

// https://astro.build/config
export default defineConfig({
	output: 'static',
	adapter: vercel(),
	site: 'https://mindfulml.vialabsdigital.com/', // Write here your website url
	markdown: {
		remarkPlugins: [remarkReadingTime],
		drafts: true,
		shikiConfig: {
			theme: 'material-theme-palenight',
			wrap: true
		}
	},
	integrations: [
		mdx({
			syntaxHighlight: 'shiki',
			shikiConfig: {
				theme: 'material-theme-palenight',
				wrap: true
			},
			drafts: true
		}),
		sitemap({
			customPages: [
				'https://mindfulml.vialabsdigital.com/inteligencia-artificial',
				'https://mindfulml.vialabsdigital.com/newsletter',
				'https://mindfulml.vialabsdigital.com/newsletter/Deep-Learning',
				'https://mindfulml.vialabsdigital.com/newsletter/Inteligencia-Artificial',
				'https://mindfulml.vialabsdigital.com/newsletter/Machine-Learning'
			].concat(blogUrls, newsletterUrls),
			priority: 0.5,
			changefreq: 'weekly'
		}),
		partytown({
			config: {
				forward: ['dataLayer.push']
			}
		}),
		tailwind()
	]
})
