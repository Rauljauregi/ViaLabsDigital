import * as React from 'react'

export const MermaidModule = () => {
	const scriptText = `
        import mermaid from 'https://cdn.jsdelivr.net/npm/mermaid@10/dist/mermaid.esm.min.mjs';
        mermaid.initialize({startOnLoad:false});
        await mermaid.run();
    `
	return <script type='module' dangerouslySetInnerHTML={{ __html: scriptText }} />
}

const Mermaid = ({ withCode, children }) => {
	let diagramCode = ''
	// If children is array or contains React elements
	React.Children.map(children, (child) => {
		if (typeof child === 'string') {
			diagramCode += child
		} else if (React.isValidElement(child)) {
			diagramCode += child.props.value
		}
	})
	let diagramNode = <></>
	if (diagramCode != null) {
		diagramNode = <pre className='mermaid' dangerouslySetInnerHTML={{ __html: diagramCode }} />
	}
	return (
		<>
			{diagramNode}
			<MermaidModule />
		</>
	)
}

export default Mermaid
