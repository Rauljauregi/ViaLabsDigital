import * as React from 'react'
import { useEffect } from 'react'
import { Script } from 'gatsby'
import { MDXProvider } from '@mdx-js/react'
import Geogebra from './geogebra.jsx'
import Comments from './comments.jsx'
import {
	FITDataProvider,
	ActivityEmbedViewer,
	HeartRateViewer,
	PaceViewer,
	CadenceViewer
} from './fit.jsx'
import Mermaid, { MermaidModule } from './mermaid'
import Search from './search'

// import { rhythm, scale } from "../utils/typography"
import 'katex/dist/katex.min.css'

const Layout = ({ location, title, children, commentsEnabled, commentsProps, algoliaProps }) => {
	const rootPath = `${__PATH_PREFIX__}/`
	const isRootPath = location.pathname === rootPath
	const shortcodes = {
		FITDataProvider,
		GeoGebra: Geogebra,
		Mermaid,
		Comments,
		ActivityEmbedViewer,
		HeartRateViewer,
		PaceViewer,
		CadenceViewer
	}
	const searchIndices = [
		{
			name: algoliaProps?.indexName,
			title: `Pages`
		}
	]
	useEffect(() => {
		if (window.twttr !== undefined) {
			// load twitter embedded after component mounted
			twttr.widgets.load()
		}
	})
	return (
		<MDXProvider components={shortcodes}>
			<div className='global-wrapper' data-is-root-path={isRootPath}>
				<header className='global-header'>
					<Search indices={searchIndices} />
				</header>
				<main>{children}</main>
				<Comments enabled={commentsEnabled} {...commentsProps} />
				<footer>
					© {new Date().getFullYear()}, Built with
					{` `}
					<a href='https://www.gatsbyjs.com'>Gatsby</a>
				</footer>
			</div>
			<Script src={`https://platform.twitter.com/widgets.js`} async />
			<MermaidModule />
		</MDXProvider>
	)
}

export default Layout
