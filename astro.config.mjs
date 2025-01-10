import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import { vercel } from '@astrojs/vercel';
import tailwind from '@astrojs/tailwind';
import partytown from '@astrojs/partytown';
import rehypeKatex from 'rehype-katex';
import remarkReadingTime from 'remark-reading-time'; // Reemplazo con paquete externo

export default defineConfig({
  output: 'server',
  adapter: vercel(),
  site: 'https://mindfulml.vialabsdigital.com/',
  markdown: {
    remarkPlugins: [remarkReadingTime],
    drafts: true,
    shikiConfig: {
      theme: 'material-theme-palenight',
      wrap: true,
    },
  },
  integrations: [
    mdx({
      syntaxHighlight: 'shiki',
      rehypePlugins: [rehypeKatex, { throwOnError: true }],
      shikiConfig: {
        theme: 'material-theme-palenight',
        wrap: true,
      },
      drafts: true,
    }),
    sitemap({
      priority: (url) => {
        if (url === 'https://mindfulml.vialabsdigital.com/') return 1.0;
        if (url.includes('/post')) return 0.8;
        if (url.includes('/newsletter')) return 0.6;
        return 0.5;
      },
      changefreq: (url) => {
        if (url.includes('/post')) return 'weekly';
        if (url.includes('/newsletter')) return 'monthly';
        return 'yearly';
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
