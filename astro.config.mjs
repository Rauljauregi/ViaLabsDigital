import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import tailwind from '@astrojs/tailwind';
import rehypeKatex from 'rehype-katex';
import remarkMath from 'remark-math';
import { remarkReadingTime } from './src/utils/readTime.ts';
import vercel from '@astrojs/vercel/serverless'; // 👈 ADAPTADOR CORRECTO
import partytown from '@astrojs/partytown';

export default defineConfig({
  site: 'https://mindfulml.vialabsdigital.com/',
  output: 'server',
  adapter: vercel(), // 👈 YA USANDO SERVERLESS
  trailingSlash: 'always',

  vite: {
    assetsInclude: ['**/*.fit'],
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
    tailwind(),
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
    })
  ]
});
// force rebuild