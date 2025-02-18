import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap'; // Importa el módulo de sitemap
import mdx from '@astrojs/mdx';
import tailwind from '@astrojs/tailwind';
import rehypeKatex from 'rehype-katex';
import remarkMath from 'remark-math';
import { remarkReadingTime } from './src/utils/readTime.ts';
import vercel from '@astrojs/vercel';
import partytown from '@astrojs/partytown';

export default defineConfig({
    site: 'https://mindfulml.vialabsdigital.com/', // Define tu dominio correctamente
    output: 'server',
    adapter: vercel(),
    vite: {
        assetsInclude: ['**/*.fit'],
    },
    markdown: {
        remarkPlugins: [
            remarkReadingTime,
            [remarkMath, {
                singleDollar: false,
                strict: false
            }],
        ],
        rehypePlugins: [
            [rehypeKatex, {
                throwOnError: false,
                strict: false,
                output: 'html',
                trust: true,
                macros: {
                    "\\eqref": "\\href{##1}{(\\text{#1})}",
                }
            }],
        ],
        drafts: true,
        shikiConfig: {
            theme: 'material-theme-palenight',
            wrap: true,
        },
    },
    integrations: [
        mdx({
            remarkPlugins: [
                remarkReadingTime,
                [remarkMath, {
                    singleDollar: false,
                    strict: false
                }],
            ],
            rehypePlugins: [
                [rehypeKatex, {
                    throwOnError: false,
                    strict: false,
                    output: 'html',
                    trust: true
                }],
            ],
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
        partytown({
            config: {
                forward: ["dataLayer.push", "gtag"],
                debug: false
            }
        }),
        sitemap({ 
            filter: (page) => !page.includes('/drafts/'), // Excluye borradores si es necesario
            customPages: [
                'https://mindfulml.vialabsdigital.com/custom-page'
            ], // Añade URLs manualmente si no están en Astro
            entryLimit: 5000, // Límite de URLs por sitemap (para grandes sitios)
            changefreq: 'weekly', // Frecuencia de actualización sugerida
            priority: 0.8, // Prioridad en los motores de búsqueda
        })
    ],
});
