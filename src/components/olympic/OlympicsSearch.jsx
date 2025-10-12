import { Plus, Search } from 'lucide-react'
import React from 'react'

const OlympicsSearch = ({ searchTerm, setSearchTerm, onCreateNew }) => {
	return (
		<div className='flex items-center justify-between'>
			<div className='flex-1 relative max-w-md'>
				<Search className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4' />
				<input
					type='text'
					placeholder='Olimpiada qidirish'
					value={searchTerm}
					onChange={e => setSearchTerm(e.target.value)}
					className='w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white'
				/>
			</div>
			<button
				onClick={onCreateNew}
				className='flex items-center justify-center w-10 h-10 bg-blue-600 hover:bg-blue-700 text-white rounded-full transition-colors'
			>
				<Plus className='h-4 w-4' />
			</button>
		</div>
	)
}

export default OlympicsSearch
