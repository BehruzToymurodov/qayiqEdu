import { Moon, Sun } from 'lucide-react'
import React from 'react'
import { useTheme } from '../../hooks/useTheme'

const AuthLayout = ({ children }) => {
	const { isDark, toggleTheme } = useTheme()

	return (
		<div className='min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 dark:from-gray-900 dark:to-gray-800 flex'>
			<div className='absolute top-4 right-4 z-10'>
				<button
					onClick={toggleTheme}
					className='p-2 rounded-lg bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-colors'
				>
					{isDark ? (
						<Sun className='h-5 w-5 text-white' />
					) : (
						<Moon className='h-5 w-5 text-gray-700' />
					)}
				</button>
			</div>

			<div className='flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8'>
				<div className='max-w-md w-full'>
					<div className='bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8'>
						<div className='text-center mb-8'>
							<div className='inline-flex items-center space-x-2 mb-4'>
								<img
									src='/src/assets/qayiqEdu.png'
									alt='QayiqEDU Logo'
									className='h-12 w-auto'
								/>
								<span className='text-2xl font-bold text-gray-900 dark:text-white'>
									QayiqEDU
								</span>
							</div>
							<p className='text-gray-600 dark:text-gray-400'>
								Platformasiga xush kelibsiz
							</p>
						</div>
						{children}
					</div>
				</div>
			</div>

			<div className='hidden lg:flex flex-1 items-center justify-center bg-gradient-to-br from-blue-600 to-blue-700 relative overflow-hidden'>
				<img
					src='/src/assets/right_side_image.png'
					alt='Welcome to qayiqEDU'
					className='w-1/2 h-1/2 object-contain'
				/>
			</div>
		</div>
	)
}

export default AuthLayout
