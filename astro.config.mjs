import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import tailwind from '@astrojs/tailwind';
import { remarkReadingTime } from './src/utils/readTime.ts';
import vercel from '@astrojs/vercel';
import { fileURLToPath } from 'node:url';
import * as path from 'path';
import partytown from '@astrojs/partytown';
import rehypeKatex from 'rehype-katex';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// https://astro.build/config
export default defineConfig({
	output: 'server',
	adapter: vercel(),
	site: 'https://mindfulml.vialabsdigital.com/', // URL base del sitio web
	markdown: {
		remarkPlugins: [remarkReadingTime],
		rehypePlugins: [rehypeKatex],
		drafts: true,
		shikiConfig: {
			theme: 'material-theme-palenight',
			wrap: true,
		},
	},
	integrations: [
		mdx({
			syntaxHighlight: 'shiki',
			rehypePlugins: [['rehype-katex', { throwOnError: true }]],
			shikiConfig: {
				theme: 'material-theme-palenight',
				wrap: true,
			},
			drafts: true,
		}),
		sitemap({
			customPages: [
				'https://mindfulml.vialabsdigital.com/inteligencia-artificial',
				'https://mindfulml.vialabsdigital.com/newsletter',
			],
			priority: (url) => {
				if (url === 'https://mindfulml.vialabsdigital.com/') return 1.0; // Prioridad alta para la página principal
				if (url.includes('/post')) return 0.8; // Mayor prioridad para posts de blog
				if (url.includes('/newsletter')) return 0.6; // Prioridad media para newsletters
				return 0.5; // Prioridad predeterminada
			},
			changefreq: (url) => {
				if (url.includes('/post')) return 'weekly'; // Los posts se actualizan semanalmente
				if (url.includes('/newsletter')) return 'monthly'; // Las newsletters se actualizan menos frecuentemente
				return 'yearly'; // Páginas estáticas cambian muy raramente
			},
		}),
		partytown({
			config: {
				forward: ['dataLayer.push'],
			},
		}),
		tailwind(),
	],
});
