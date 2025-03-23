import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import mdx from '@astrojs/mdx';
import tailwind from '@astrojs/tailwind'; // Añade esta importación
import rehypeKatex from 'rehype-katex';
import remarkMath from 'remark-math';
import { remarkReadingTime } from './src/utils/readTime.ts';
//import vercel from '@astrojs/vercel/serverless';
import vercel from '@astrojs/vercel';
import partytown from '@astrojs/partytown';

// Elimina esta línea:
// import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  site: 'https://mindfulml.vialabsdigital.com/',
  output: 'server',
  adapter: vercel(),
  trailingSlash: 'always',

  vite: {
    assetsInclude: ['**/*.fit'],
    // Elimina esta línea:
    // plugins: [tailwindcss()]
  },

  markdown: {
    remarkPlugins: [
      remarkReadingTime,
      [remarkMath, {
        singleDollar: false,
        strict: false
      }]
    ],
    rehypePlugins: [
      [rehypeKatex, {
        throwOnError: false,
        strict: false,
        output: 'html',
        trust: true,
        macros: {
          "\\eqref": "\\href{##1}{(\\text{#1})}"
        }
      }]
    ],
    drafts: true,
    shikiConfig: {
      theme: 'material-theme-palenight',
      wrap: true
    }
  },

  integrations: [
    tailwind(), // Añade esta línea para activar la integración de Tailwind
    mdx({
      remarkPlugins: [
        remarkReadingTime,
        [remarkMath, {
          singleDollar: false,
          strict: false
        }]
      ],
      rehypePlugins: [
        [rehypeKatex, {
          throwOnError: false,
          strict: false,
          output: 'html',
          trust: true
        }]
      ],
      syntaxHighlight: 'shiki',
      shikiConfig: {
        experimentalThemes: {
          light: 'vitesse-light',
          dark: 'material-theme-palenight'
        },
        wrap: true
      },
      drafts: true
    }),
    partytown({
      config: {
        forward: ['dataLayer.push', 'gtag'],
        debug: false
      }
    }),
    sitemap({
      filter: (page) => !page.includes('/drafts/'),
      serialize: ({ canonicalURL }) => ({
        loc: canonicalURL.endsWith('/') ? canonicalURL : `${canonicalURL}/`,
        lastmod: new Date().toISOString(),
        changefreq: 'weekly',
        priority: 0.8
      })
    })
  ]
});