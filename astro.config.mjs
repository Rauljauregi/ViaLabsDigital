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
    output: 'server', // Necesario para el adaptador de Vercel
    adapter: vercel(),
    vite: {
        assetsInclude: ['**/*.fit'], // Incluye tipos de archivos adicionales si es necesario
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
        sitemap({
            // Páginas estáticas adicionales
            customPages: [
                'https://mindfulml.vialabsdigital.com/inteligencia-artificial',
                'https://mindfulml.vialabsdigital.com/newsletter',
            ],
            // Ajustar prioridades
            priority: (url) => {
                if (url === 'https://mindfulml.vialabsdigital.com/') return 1.0; // Alta prioridad para la página principal
                if (url.includes('/blog')) return 0.8; // Prioridad para posts del blog
                if (url.includes('/newsletter')) return 0.6; // Prioridad para newsletters
                return 0.5; // Prioridad predeterminada
            },
            // Ajustar frecuencia de cambio
            changefreq: (url) => {
                if (url.includes('/blog')) return 'weekly'; // Actualizaciones semanales para el blog
                if (url.includes('/newsletter')) return 'monthly'; // Actualizaciones mensuales para newsletters
                return 'yearly'; // Páginas estáticas actualizadas anualmente
            },
            // Filtrar para incluir solo URLs válidas
            filter: (page) => !page.includes('draft'), // Excluye borradores
        }),
        tailwind(),
    ],
});
