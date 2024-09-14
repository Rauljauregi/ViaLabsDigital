import type { RemarkPlugin } from '@astrojs/markdown-remark'
import type * as mdast from 'mdast'
import { visit } from 'unist-util-visit'

const metaRe = /\b([-\w]+)(?:=(?:"([^"]*)"|'([^']*)'|([^"'\s]+)))?/g

const visitorFunc = (markdownAST: mdast.Root) => {
	visit(markdownAST, 'code', async (node, index, parent) => {
		if (node == null || node.lang !== 'mermaid' || node.meta === null) {
			return
		}
		const { meta } = { ...node }
		metaRe.lastIndex = 0
		let render = false
		let match
		while ((match = metaRe.exec(meta))) {
			if (match[1] === 'render') {
				render = true
			}
		}
		if (!render) {
			return
		}
		const value = node.value
		let replacementNode = {
			type: 'html',
			value: `<div class="mermaid">${value}</div>`
		}
		parent.children[index] = replacementNode
	})
}

export const RemarkMermaidClient: RemarkPlugin<[]> = () => {
	return function (markdownAST, { data }) {
		visitorFunc(markdownAST)
	}
}
