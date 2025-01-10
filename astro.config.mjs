import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import tailwind from '@astrojs/tailwind';
import rehypeKatex from 'rehype-katex';
import remarkMath from 'remark-math';
import { remarkReadingTime } from './src/utils/readTime.ts';
import vercel from '@astrojs/vercel/serverless'; // Importando el adaptador de Vercel

export default defineConfig({
    site: 'https://mindfulml.vialabsdigital.com/', // URL base del sitio web
    output: 'server', // Necesario para el adaptador de Vercel
    adapter: vercel(), // Adaptador de Vercel
    vite: {
        assetsInclude: ['**/*.fit'], // Incluye tipos de archivos adicionales si es necesario
    },
    markdown: {
        remarkPlugins: [remarkReadingTime, remarkMath], // Plugins de remark para lectura y matemáticas
        rehypePlugins: [rehypeKatex], // Renderizado de fórmulas matemáticas con KaTeX
        drafts: true, // Habilita borradores
        shikiConfig: {
            theme: 'material-theme-palenight', // Tema para resaltado de código
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
                'https://mindfulml.vialabsdigital.com/newsletter',
            ],
            priority: (url) => {
                if (url === 'https://mindfulml.vialabsdigital.com/') return 1.0; // Prioridad alta para la página principal
                if (url.includes('/post')) return 0.8; // Prioridad media-alta para publicaciones
                if (url.includes('/newsletter')) return 0.6; // Prioridad media para newsletters
                return 0.5; // Prioridad predeterminada
            },
            changefreq: (url) => {
                if (url.includes('/post')) return 'weekly'; // Frecuencia semanal para publicaciones
                if (url.includes('/newsletter')) return 'monthly'; // Frecuencia mensual para newsletters
                return 'yearly'; // Frecuencia anual para páginas estáticas
            },
        }),
        tailwind(), // Estilos con Tailwind CSS
    ],
});
