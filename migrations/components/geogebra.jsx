import React from 'react'

const Geogebra = ({ title, src, width, height }) => {
	width = width || '100%'
	height = height || '600'
	return (
		<iframe
			title={title}
			src={src}
			width={width}
			height={height}
			allowFullScreen
			style={{
				borderWidth: '1px',
				borderStyle: 'solid',
				borderColor: '#e4e4e4',
				borderRadius: '4px'
			}}
		></iframe>
	)
}

export default Geogebra
