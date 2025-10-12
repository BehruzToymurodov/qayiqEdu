import { Bell, Headphones, Moon, Sun } from 'lucide-react'
import React from 'react'
import { useLocation } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { useTheme } from '../../hooks/useTheme'

const Header = () => {
	const { user } = useAuth()
	const { isDark, toggleTheme } = useTheme()
	const location = useLocation()

	const getPageTitle = () => {
		switch (location.pathname) {
			case '/home':
				return 'Bosh sahifa'
			case '/olympics':
				return 'Olimpiadalar'
			case '/profile':
				return 'Profil'
			default:
				return 'Dashboard'
		}
	}

	return (
		<header className='bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700'>
			<div className='flex items-center justify-between px-6 py-4'>
				<div className='flex items-center space-x-4'>
					<h1 className='text-2xl font-bold text-gray-900 dark:text-white'>
						{getPageTitle()}
					</h1>
				</div>

				<div className='flex items-center space-x-4'>
					{/* Support Button */}
					<button className='p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full transition-colors'>
						<Headphones className='h-5 w-5' />
					</button>

					{/* Notifications */}
					<button className='p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full transition-colors'>
						<Bell className='h-5 w-5' />
					</button>

					{/* Theme Toggle */}
					<button
						onClick={toggleTheme}
						className='flex items-center bg-blue-600 hover:bg-blue-700 text-white rounded-full px-3 py-2 transition-colors'
					>
						{isDark ? (
							<Sun className='h-4 w-4' />
						) : (
							<Moon className='h-4 w-4' />
						)}
					</button>

					{/* User Info */}
					<div className='flex items-center space-x-3'>
						<span className='text-sm font-medium text-gray-900 dark:text-white'>
							{user?.firstName} {user?.lastName}
						</span>
						<img
							src={user?.avatar || '/api/placeholder/40/40'}
							alt='Profile'
							className='h-8 w-8 rounded-full object-cover'
						/>
					</div>
				</div>
			</div>
		</header>
	)
}

export default Header
