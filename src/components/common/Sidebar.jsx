import { Home, LogOut, Trophy, User } from 'lucide-react'
import React from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import lightQayiqEduLogo from '../../assets/light_qayiqEDU.png'
import qayiqEduLogo from '../../assets/qayiqEdu.png'
import { useAuth } from '../../hooks/useAuth'
import { useTheme } from '../../hooks/useTheme'

const Sidebar = () => {
	const location = useLocation()
	const navigate = useNavigate()
	const { isDark } = useTheme()
	const { logout } = useAuth()

	const menuItems = [
		{ path: '/home', icon: Home, label: 'Bosh sahifa' },
		{ path: '/olympics', icon: Trophy, label: 'Olimpiadalar' },
		{ path: '/profile', icon: User, label: 'Profil' },
	]

	const isActive = path => location.pathname === path

	const handleLogout = () => {
		logout()
		navigate('/login')
	}

	return (
		<aside className='bg-blue-600 dark:bg-gray-800 w-64 min-h-screen flex flex-col'>
			<div className='p-6 flex-1'>
				{/* Logo */}
				<div className='flex items-center space-x-3 mb-8'>
					<img
						src={isDark ? qayiqEduLogo : lightQayiqEduLogo}
						alt='QayiqEdu Logo'
						className='w-10 h-10 object-contain'
					/>
					<span className='text-white font-bold text-xl'>QayiqEDU</span>
				</div>

				{/* Navigation */}
				<nav className='space-y-2 flex-1'>
					{menuItems.map(item => {
						const Icon = item.icon
						return (
							<Link
								key={item.path}
								to={item.path}
								className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
									isActive(item.path)
										? 'bg-blue-700 text-white'
										: 'text-blue-100 hover:bg-blue-700/50 hover:text-white'
								}`}
							>
								<Icon className='h-5 w-5' />
								<span className='font-medium'>{item.label}</span>
							</Link>
						)
					})}
				</nav>
			</div>

			{/* Logout Button */}
			<div className='p-6 border-t border-blue-500'>
				<button
					onClick={handleLogout}
					className='flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors text-blue-100 hover:bg-blue-700/50 hover:text-white w-full'
				>
					<LogOut className='h-5 w-5' />
					<span className='font-medium'>Chiqish</span>
				</button>
			</div>
		</aside>
	)
}

export default Sidebar
