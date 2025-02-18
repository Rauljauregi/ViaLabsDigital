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
    trailingSlash: 'ignore', // 🔹 Asegura que Astro genere rutas con "/"
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
            filter: (page) => !page.includes("/drafts/"), // Excluye borradores si es necesario
            serialize: ({ canonicalURL }) => ({
                loc: canonicalURL.replace(/\/?$/, "/"), // 🔹 Forzar siempre "/" al final
                lastmod: new Date().toISOString(),
                changefreq: "weekly",
                priority: 0.8,
            }),
        }),
    ],
});
