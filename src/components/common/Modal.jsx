import { X } from 'lucide-react'
import React from 'react'

const Modal = ({ isOpen, onClose, title, children, size = 'md' }) => {
	if (!isOpen) return null

	const sizeClasses = {
		sm: 'max-w-md',
		md: 'max-w-lg',
		lg: 'max-w-2xl',
		xl: 'max-w-4xl',
	}

	return (
		<div className='fixed inset-0 z-50 overflow-y-auto'>
			<div className='flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0'>
				<div
					className='fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75 dark:bg-gray-900 dark:bg-opacity-75'
					onClick={onClose}
				></div>

				<div
					className={`inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle ${sizeClasses[size]} sm:w-full`}
				>
					<div className='bg-white dark:bg-gray-800 px-4 pt-5 pb-4 sm:p-6 sm:pb-4'>
						<div className='flex items-center justify-between mb-4'>
							<h3 className='text-lg font-medium text-gray-900 dark:text-white'>
								{title}
							</h3>
							<button
								onClick={onClose}
								className='rounded-md text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'
							>
								<X className='h-6 w-6' />
							</button>
						</div>
						{children}
					</div>
				</div>
			</div>
		</div>
	)
}

export default Modal
