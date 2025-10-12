import React from 'react'
import homePageImage from '../assets/home.png'

const Home = () => {
	return (
		<div className='flex items-center justify-center h-full w-full overflow-hidden -m-6'>
			<img
				src={homePageImage}
				alt='QayiqEdu Home Page'
				className='w-full h-full object-contain'
			/>
		</div>
	)
}

export default Home
