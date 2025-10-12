import React from 'react'

const DataTable = ({
	columns = [],
	data = [],
	onRowClick,
	onAction,
	emptyState = null,
	loading = false,
	className = '',
}) => {
	const renderCellContent = (column, item, index) => {
		if (column.render) {
			return column.render(item, index)
		}

		if (column.key) {
			return item[column.key] || '-'
		}

		return '-'
	}

	const renderHeaderContent = column => {
		if (column.headerRender) {
			return column.headerRender()
		}

		if (column.icon) {
			return (
				<div className='flex items-center space-x-1'>
					<span>{column.title}</span>
					<div className='w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center'>
						<span className='text-white text-xs font-bold'>i</span>
					</div>
				</div>
			)
		}

		return column.title
	}

	if (loading) {
		return (
			<div className='bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden'>
				<div className='flex items-center justify-center py-12'>
					<div className='animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600'></div>
				</div>
			</div>
		)
	}

	return (
		<div
			className={`bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden ${className}`}
		>
			<div className='overflow-x-auto'>
				<table className='w-full'>
					<thead className='bg-gray-50 dark:bg-gray-700'>
						<tr>
							{columns.map((column, index) => (
								<th
									key={index}
									className='px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider'
									style={{ width: column.width }}
								>
									{renderHeaderContent(column)}
								</th>
							))}
						</tr>
					</thead>
					<tbody className='bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700'>
						{data.length > 0 ? (
							data.map((item, index) => (
								<tr
									key={item.id || index}
									className={`hover:bg-gray-50 dark:hover:bg-gray-700 ${
										onRowClick ? 'cursor-pointer' : ''
									}`}
									onClick={() => onRowClick && onRowClick(item)}
								>
									{columns.map((column, colIndex) => (
										<td
											key={colIndex}
											className='px-6 py-4 whitespace-nowrap text-sm'
											onClick={e => {
												if (column.onClick) {
													e.stopPropagation()
													column.onClick(item, index)
												}
											}}
										>
											{renderCellContent(column, item, index)}
										</td>
									))}
								</tr>
							))
						) : (
							<tr>
								<td colSpan={columns.length} className='text-center py-12'>
									{emptyState || (
										<div className='flex flex-col items-center space-y-4'>
											<div className='w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center'>
												<svg
													className='w-8 h-8 text-gray-400'
													fill='none'
													stroke='currentColor'
													viewBox='0 0 24 24'
												>
													<path
														strokeLinecap='round'
														strokeLinejoin='round'
														strokeWidth={2}
														d='M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4'
													/>
												</svg>
											</div>
											<p className='text-gray-500 dark:text-gray-400'>
												Hech qanday ma'lumot topilmadi
											</p>
										</div>
									)}
								</td>
							</tr>
						)}
					</tbody>
				</table>
			</div>
		</div>
	)
}

export default DataTable
