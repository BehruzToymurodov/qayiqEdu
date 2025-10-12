import React from 'react'

const Pagination = ({
	currentPage,
	totalPages,
	totalItems,
	itemsPerPage,
	onPageChange,
}) => {
	const startItem = (currentPage - 1) * itemsPerPage + 1
	const endItem = Math.min(currentPage * itemsPerPage, totalItems)

	const renderPageNumbers = () => {
		const pages = []
		const maxVisiblePages = 5

		if (totalPages <= maxVisiblePages) {
			for (let i = 1; i <= totalPages; i++) {
				pages.push(i)
			}
		} else {
			if (currentPage <= 3) {
				for (let i = 1; i <= 4; i++) {
					pages.push(i)
				}
				pages.push('...')
				pages.push(totalPages)
			} else if (currentPage >= totalPages - 2) {
				pages.push(1)
				pages.push('...')
				for (let i = totalPages - 3; i <= totalPages; i++) {
					pages.push(i)
				}
			} else {
				pages.push(1)
				pages.push('...')
				for (let i = currentPage - 1; i <= currentPage + 1; i++) {
					pages.push(i)
				}
				pages.push('...')
				pages.push(totalPages)
			}
		}

		return pages
	}

	return (
		<div className='flex items-center justify-between mt-6'>
			{/* Items per page selector */}
			<div className='flex items-center space-x-4'>
				<div className='w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold'>
					{itemsPerPage}
				</div>
				<span className='text-sm text-gray-600 dark:text-gray-400'>
					{totalItems} ta yozuvdan {startItem} dan {endItem} gacha
					ko'rsatilmoqda
				</span>
			</div>

			{/* Pagination controls */}
			<div className='flex items-center space-x-2'>
				{renderPageNumbers().map((page, index) => (
					<button
						key={index}
						onClick={() => typeof page === 'number' && onPageChange(page)}
						disabled={page === '...'}
						className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
							page === currentPage
								? 'bg-blue-600 text-white'
								: page === '...'
								? 'text-gray-400 cursor-default'
								: 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
						}`}
					>
						{page}
					</button>
				))}
			</div>
		</div>
	)
}

export default Pagination
