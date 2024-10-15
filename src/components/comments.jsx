import * as React from 'react'
import Giscus from '@giscus/react'

const Comments = (props) => {
	const { enabled } = props
	if (enabled == false || enabled == null) {
		return <></>
	}
	return (
		<div className='comments'>
			<Giscus id='comments' {...props} />
		</div>
	)
}

export default Comments
