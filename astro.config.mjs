import { defineConfig } from 'astro/config'
import react from '@astrojs/react'
import mdx from '@astrojs/mdx'
import sitemap from '@astrojs/sitemap'
import tailwind from '@astrojs/tailwind'
import { remarkReadingTime } from './src/utils/readTime.ts'
import { RemarkMermaidClient } from "./src/plugins/mermaid";

import starlight from '@astrojs/starlight';
import starlightDocSearch from "@astrojs/starlight-docsearch";

// https://astro.build/config
export default defineConfig({
    site: 'https://blog-template-gray.vercel.app/', // Write here your website url
    markdown: {
        remarkPlugins: [
            remarkReadingTime,
            RemarkMermaidClient,
        ],
        drafts: true,
        shikiConfig: {
            theme: 'material-theme-palenight',
            wrap: true,
            transformers: [],
        }
    },
    redirects: {
        '/[category]/': '/[category]/1/',
    },
    integrations: [
        react(),
        // starlight({
        //     title: 'astro-blog-template',
        //     plugins: [
        //         starlightDocSearch({
        //             indexName: "Pages",
        //             appId: process.env.GATSBY_ALGOLIA_APP_ID ?? '',
        //             apiKey: process.env.GATSBY_ALGOLIA_WRITE_KEY ?? '',
        //         })
        //     ]
        // }),
        mdx({
            syntaxHighlight: 'shiki',
            shikiConfig: {
                experimentalThemes: {
                    light: 'vitesse-light',
                    dark: 'material-theme-palenight',
                  },
                wrap: true,
                transformers: [],
            },
            drafts: true
            }),
        sitemap(),
        tailwind(),
    ]
})