import dotenv from 'dotenv'
dotenv.config()
import { queries } from '../utils/algolia-queries'

interface SiteConfig {
	author: {
		name: string
		summary: string
	}
	title: string
	description: string
	siteUrl: string
	social: {
		twitter: string
		github: string
	}
	config: {
		categoryNameForAll: string
		paginationPageSize: number
		// contentPath: string
		// assetPath: string
		commentsEnabled: boolean
		commentsProps: {
			repo: string
			repoId: string
			category: string
			categoryId: string
			mapping: string
			strict: string
			reactionsEnabled: string
			emitMetadata: string
			inputPosition: string
			theme: string
			lang: string
			loading: string
		}
		algoliaProps: {
			indexName: string
			appId: string
			apiKey: string
			dryRun: boolean
			continueOnFailure: boolean
			queries: string
		}
	}
	lang: string
	ogLocale: string
	shareMessage: string
	paginationSize: number
}

export const siteConfig: SiteConfig = {
	author: {
		name: `Rizky Maulana Nugraha`,
		summary: `Software Developer. Currently remotely working from Indonesia.`
	},
	title: `Maulana's Astro Theme`,
	description: `Personal blog theme.`,
	siteUrl: `https://astro-starter.maulana.id/`,
	social: {
		twitter: `maulana_pcfre`,
		github: `lucernae`
	},
	config: {
		// contentPath: `${__dirname}/../content`,
		// assetPath: `${__dirname}/../assets`,
		categoryNameForAll: 'all',
		paginationPageSize: 10,
		commentsEnabled: true,
		commentsProps: {
			repo: 'lucernae/astro-blog-template',
			repoId: 'R_kgDOMuDGhA',
			category: 'Announcements',
			categoryId: 'DIC_kwDOMuDGhM4Cij7I',
			mapping: 'pathname',
			strict: '0',
			reactionsEnabled: '1',
			emitMetadata: '1',
			inputPosition: 'top',
			theme: 'preferred_color_scheme',
			lang: 'en',
			loading: 'lazy'
		},
		algoliaProps: {
			indexName: 'Pages',
			appId: process.env.GATSBY_ALGOLIA_APP_ID ?? '',
			apiKey: process.env.GATSBY_ALGOLIA_WRITE_KEY ?? '',
			dryRun: process.env.GATSBY_ALGOLIA_DRY_RUN === 'true',
			continueOnFailure: process.env.GATSBY_ALGOLIA_CONTINUE_ON_FAILURE === 'true',
			queries: queries
		}
	},
	lang: 'en-US',
	ogLocale: 'en_US',
	shareMessage: 'Share this post', // Message to share a post on social media
	paginationSize: 6 // Number of posts per page
}
