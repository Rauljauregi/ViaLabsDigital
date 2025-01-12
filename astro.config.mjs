import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import tailwind from '@astrojs/tailwind';
import rehypeKatex from 'rehype-katex';
import remarkMath from 'remark-math';
import { remarkReadingTime } from './src/utils/readTime.ts';
import vercel from '@astrojs/vercel/serverless';

export default defineConfig({
    site: 'https://mindfulml.vialabsdigital.com/', // URL base del sitio web
    output: 'server', // Generación dinámica de rutas
    adapter: vercel(),
    vite: {
        assetsInclude: ['**/*.fit'], // Archivos adicionales
    },
    markdown: {
        remarkPlugins: [
            remarkReadingTime,
            [remarkMath, { singleDollar: false }],
        ],
        rehypePlugins: [
            [rehypeKatex, { throwOnError: false, strict: false }],
        ],
        drafts: true,
        shikiConfig: {
            theme: 'material-theme-palenight',
            wrap: true,
        },
    },
    integrations: [
        mdx({
            syntaxHighlight: 'shiki',
            shikiConfig: {
                experimentalThemes: {
                    light: 'vitesse-light',
                    dark: 'material-theme-palenight',
                },
                wrap: true,
            },
            drafts: true,
        }),
        tailwind(),
    ],
});
