import styled, { css } from 'styled-components'
import SearchResult from './search-result'

const Popover = css`
	max-height: 80vh;
	overflow: scroll;
	-webkit-overflow-scrolling: touch;
	position: absolute;
	z-index: 2;
	right: 0;
	top: 100%;
	margin-top: 0.5em;
	width: 80vw;
	max-width: 30em;
	box-shadow: 0 0 5px 0;
	padding: 1em;
	border-radius: 2px;
	background: ${({ theme }) => theme.background};
`

export default styled(SearchResult)`
	display: ${(props) => (props.show ? `block` : `none`)};
	${Popover}

	.HitCount {
		display: flex;
		justify-content: flex-end;
	}

	.Hits {
		ol {
			list-style: none;
			margin-left: 0;
		}

		li.ais-Hits-item {
			margin-bottom: 0px;
			margin-top: 0px;
			padding: 0.5em;
			border-bottom: 2px solid salmon;

			a {
				color: ${({ theme }) => theme.foreground};

				h4 {
					margin-top: 0;
					margin-bottom: 0.2em;
				}
			}
		}

		li.ais-Hits-item:hover {
			background-color: lightsalmon;
		}
	}

	.ais-PoweredBy {
		display: flex;
		justify-content: flex-end;
		font-size: 80%;

		svg {
			width: 130px;
		}
	}
`
