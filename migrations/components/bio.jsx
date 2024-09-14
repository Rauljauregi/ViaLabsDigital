/**
 * Bio component that queries for data
 * with Gatsby's useStaticQuery component
 *
 * See: https://www.gatsbyjs.com/docs/how-to/querying-data/use-static-query/
 */

import * as React from 'react'
import { useStaticQuery, graphql } from 'gatsby'
import { GatsbyImage, StaticImage, getImage } from 'gatsby-plugin-image'
import { rhythm } from '../utils/typography'

const Bio = () => {
	const data = useStaticQuery(graphql`
		query BioQuery {
			site {
				siteMetadata {
					author {
						name
						summary
					}
					social {
						twitter
						github
					}
				}
			}

			avatar: file(relativePath: { eq: "assets/avatar.png" }) {
				childImageSharp {
					gatsbyImageData(
						layout: FIXED
						placeholder: BLURRED
						formats: [AUTO, WEBP, AVIF]
						width: 50
						height: 50
						quality: 95
					)
				}
			}
		}
	`)

	// Set these values by editing "siteMetadata" in gatsby-config.js
	const author = data.site.siteMetadata?.author
	const social = data.site.siteMetadata?.social
	const assetPath = data.site.siteMetadata?.assetPath

	return (
		<div
			className='bio'
			style={{
				display: `flex`,
				marginBottom: rhythm(2.5)
			}}
		>
			<GatsbyImage className='bio-avatar' image={getImage(data.avatar)} alt={author?.name} />
			{author?.name && (
				<p>
					Written by <strong>{author.name}</strong>
					<br />
					{author?.summary || null}
					{` `}
					<br />
					<a href={`https://twitter.com/${social.twitter}`}>
						<img
							alt='Twitter Follow'
							src={`https://img.shields.io/twitter/follow/${social.twitter}?style=social`}
						></img>
					</a>
					<a href={`https://github.com/${social.github}`}>
						<img
							alt='GitHub followers'
							src={`https://img.shields.io/github/followers/${social.github}?style=social`}
						></img>
					</a>
				</p>
			)}
		</div>
	)
}

export default Bio
