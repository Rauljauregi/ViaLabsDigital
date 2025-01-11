import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import tailwind from '@astrojs/tailwind';
import rehypeKatex from 'rehype-katex';
import remarkMath from 'remark-math';
import { remarkReadingTime } from './src/utils/readTime.ts';
import vercel from '@astrojs/vercel/serverless';

export default defineConfig({
    site: 'https://mindfulml.vialabsdigital.com/', // URL base del sitio web
    output: 'server', // Necesario para rutas dinámicas en Vercel
    adapter: vercel(), // Adaptador de Vercel
    vite: {
        assetsInclude: ['**/*.fit'], // Incluye tipos de archivos adicionales si es necesario
    },
    markdown: {
        remarkPlugins: [
            remarkReadingTime,
            [remarkMath, { singleDollar: false }], // Matemáticas inline con $
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
        sitemap({
            customPages: [
                'https://mindfulml.vialabsdigital.com/inteligencia-artificial',
            ],
        }),
        tailwind(),
    ],
});
