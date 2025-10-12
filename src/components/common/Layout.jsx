import React from 'react'
import Header from './Header'
import Sidebar from './Sidebar'

const Layout = ({ children }) => {
	return (
		<div className='flex h-screen bg-gray-50 dark:bg-gray-900'>
			<Sidebar />
			<div className='flex-1 flex flex-col overflow-hidden'>
				<Header />
				<main className='flex-1 overflow-y-auto p-6'>
					<div className='max-w-7xl mx-auto'>{children}</div>
				</main>
			</div>
		</div>
	)
}

export default Layout
