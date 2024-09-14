import React from 'react'
import { Link } from 'gatsby'
import { Highlight, Hits, Index, Snippet, PoweredBy, useStats } from 'react-instantsearch'

const HitCount = () => {
	const { nbHits } = useStats()

	return nbHits > 0 ? (
		<div className='HitCount'>
			{nbHits} result{nbHits !== 1 ? 's' : ''}
		</div>
	) : null
}

const PageHit = ({ hit }) => (
	<div>
		<Link to={hit.slug}>
			<h4>
				<Highlight attribute='title' hit={hit} />
			</h4>
		</Link>
		<Snippet attribute='excerpt' hit={hit} />
	</div>
)

const HitsInIndex = ({ index }) => (
	<Index indexName={index.name}>
		<HitCount />
		<Hits className='Hits' hitComponent={PageHit} />
	</Index>
)

const SearchResult = ({ indices, className }) => (
	<div className={className}>
		{indices.map((index) => (
			<HitsInIndex index={index} key={index.name} />
		))}
		<PoweredBy />
	</div>
)

export default SearchResult
