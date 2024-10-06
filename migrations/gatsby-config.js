/**
 * Configure your Gatsby site with this file.
 *
 * See: https://www.gatsbyjs.com/docs/reference/config-files/gatsby-config/
 */

require(`dotenv`).config()

// Patch from https://www.gatsbyjs.com/plugins/gatsby-plugin-mdx#mdxoptions
const wrapESMPlugin = (name) =>
	function wrapESM(opts) {
		return async (...args) => {
			const mod = await import(name)
			const plugin = mod.default(opts)
			return plugin(...args)
		}
	}

/**
 * @type {import('gatsby').GatsbyConfig}
 */
module.exports = ({
	contentPath = `${__dirname}/content`,
	assetPath = `${__dirname}/content/assets`,
	categoryNameForAll = 'all',
	paginationPageSize = 10,
	commentsEnabled = true,
	commentsProps = {
		// repo="lucernae/gatsby-starter-lucernae",
		// repoId="R_kgDOKRTVcw",
		// category="Announcements",
		// categoryId="DIC_kwDOKRTVc84CaVF-",
		// mapping="pathname",
		// strict="0",
		// reactionsEnabled="1",
		// emitMetadata="1",
		// inputPosition="top",
		// theme="preferred_color_scheme",
		// lang="en",
		// loading="lazy",
	},
	algoliaProps = {
		// indexName="Pages",
	}
}) => ({
	siteMetadata: {
		title: `Maulana's Gatsby Theme`,
		author: {
			name: `Rizky Maulana Nugraha`,
			summary: `Software Developer. Currently remotely working from Indonesia.`
		},
		description: `Personal blog theme.`,
		siteUrl: `https://gatsby-starter.maulana.id/`,
		social: {
			twitter: `maulana_pcfre`,
			github: `lucernae`
		},
		config: {
			categoryNameForAll: categoryNameForAll,
			paginationPageSize: paginationPageSize,
			contentPath: contentPath,
			assetPath: assetPath,
			commentsEnabled: commentsEnabled || true,
			commentsProps: commentsProps || {},
			algoliaProps: algoliaProps || {}
		}
	},
	plugins: [
		`gatsby-plugin-mdx-embed`,
		`gatsby-plugin-image`,
		`gatsby-transformer-sharp`,
		`gatsby-plugin-sharp`,
		{
			resolve: `gatsby-plugin-mdx`,
			options: {
				extensions: [`.mdx`, `.md`],
				gatsbyRemarkPlugins: [
					{
						resolve: require.resolve(`${__dirname}/plugins/gatsby-remark-mermaid-client`)
					},
					{
						resolve: `gatsby-remark-images`,
						options: {
							maxWidth: 590
						}
					},
					{
						resolve: `gatsby-remark-responsive-iframe`,
						options: {
							wrapperStyle: `margin-bottom: 1.0725rem`
						}
					},
					// Ignored because the plugin doesn't work
					{
						resolve: `gatsby-remark-katex`,
						options: {
							strict: `ignore`
						}
					},
					`gatsby-remark-autolink-headers`,
					`gatsby-remark-prismjs`,
					`gatsby-remark-copy-linked-files`,
					`gatsby-remark-smartypants`
				],
				mdxOptions: {
					remarkPlugins: [
						require(`remark-gfm`)
						// require(`remark-math`),
						// wrapESMPlugin(`remark-frontmatter`),
						// wrapESMPlugin(`remark-mdx-frontmatter`),
						// [require(`remark-html-katex`), {strict: "ignore"}],
					]
					// rehypePlugins: [
					//   require(`rehype-katex`),
					// ],
				}
			}
		},
		{
			resolve: `gatsby-plugin-algolia`,
			options: {
				appId: process.env.GATSBY_ALGOLIA_APP_ID ?? '',
				apiKey: process.env.GATSBY_ALGOLIA_WRITE_KEY ?? '',
				dryRun: process.env.GATSBY_ALGOLIA_DRY_RUN === 'true',
				continueOnFailure: process.env.GATSBY_ALGOLIA_CONTINUE_ON_FAILURE === 'true',
				queries: require('./src/utils/algolia-queries')
			}
		},
		{
			resolve: `gatsby-plugin-manifest`,
			options: {
				name: `Gatsby Starter Blog`,
				short_name: `Gatsby`,
				start_url: `/`,
				background_color: `#ffffff`,
				// This will impact how browsers show your PWA/website
				// https://css-tricks.com/meta-theme-color-and-trickery/
				// theme_color: `#663399`,
				display: `minimal-ui`,
				icon: `content/assets/gatsby-icon.png` // This path is relative to the root of the site.
			}
		},
		{
			resolve: `gatsby-plugin-typography`,
			options: {
				pathToConfigModule: `${__dirname}/src/utils/typography`
			}
		},
		`gatsby-plugin-styled-components`,
		`gatsby-plugin-postcss`
		// this (optional) plugin enables Progressive Web App + Offline functionality
		// To learn more, visit: https://gatsby.dev/offline
		// `gatsby-plugin-offline`,
	]
})
