import { BookOpen, TrendingUp, Trophy, Users } from 'lucide-react'
import React from 'react'
import { useAuth } from '../hooks/useAuth'

const Dashboard = () => {
	const { user } = useAuth()

	const stats = [
		{
			title: 'Jami Olimpiadalar',
			value: '12',
			icon: Trophy,
			color: 'bg-blue-500',
			change: '+2.5%',
		},
		{
			title: 'Faol Ishtirokchilar',
			value: '1,234',
			icon: Users,
			color: 'bg-green-500',
			change: '+12.3%',
		},
		{
			title: 'Tugallangan Testlar',
			value: '856',
			icon: BookOpen,
			color: 'bg-purple-500',
			change: '+8.1%',
		},
		{
			title: "O'rtacha Ball",
			value: '87.5',
			icon: TrendingUp,
			color: 'bg-orange-500',
			change: '+3.2%',
		},
	]

	const recentOlympics = [
		{
			name: 'Matematika Olimpiadasi',
			date: '2024-12-15',
			participants: 45,
			status: 'Faol',
		},
		{
			name: 'Fizika Musobaqasi',
			date: '2024-12-10',
			participants: 32,
			status: 'Tugagan',
		},
		{
			name: 'Kimyo Testi',
			date: '2024-12-08',
			participants: 28,
			status: 'Tugagan',
		},
	]

	return (
		<div className='space-y-6'>
			<div className='flex items-center justify-between'>
				<div>
					<h1 className='text-2xl font-bold text-gray-900 dark:text-white'>
						Xush kelibsiz, {user?.firstName}!
					</h1>
					<p className='text-gray-600 dark:text-gray-400'>
						Bu yerda platformangiz statistikasini ko'rishingiz mumkin
					</p>
				</div>
			</div>

			{/* Stats Grid */}
			<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
				{stats.map((stat, index) => {
					const Icon = stat.icon
					return (
						<div
							key={index}
							className='bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700'
						>
							<div className='flex items-center justify-between'>
								<div>
									<p className='text-sm font-medium text-gray-600 dark:text-gray-400'>
										{stat.title}
									</p>
									<p className='text-2xl font-bold text-gray-900 dark:text-white mt-1'>
										{stat.value}
									</p>
									<div className='flex items-center mt-2'>
										<span className='text-sm text-green-600 dark:text-green-400'>
											{stat.change}
										</span>
										<span className='text-sm text-gray-500 dark:text-gray-400 ml-1'>
											o'tgan oydan
										</span>
									</div>
								</div>
								<div className={`${stat.color} rounded-lg p-3`}>
									<Icon className='h-6 w-6 text-white' />
								</div>
							</div>
						</div>
					)
				})}
			</div>

			{/* Recent Olympics */}
			<div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
				<div className='bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700'>
					<h3 className='text-lg font-semibold text-gray-900 dark:text-white mb-4'>
						So'nggi Olimpiadalar
					</h3>
					<div className='space-y-4'>
						{recentOlympics.map((olympic, index) => (
							<div
								key={index}
								className='flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg'
							>
								<div>
									<p className='font-medium text-gray-900 dark:text-white'>
										{olympic.name}
									</p>
									<p className='text-sm text-gray-600 dark:text-gray-400'>
										{olympic.date} • {olympic.participants} ishtirokchi
									</p>
								</div>
								<span
									className={`px-2 py-1 rounded-full text-xs font-medium ${
										olympic.status === 'Faol'
											? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
											: 'bg-gray-100 text-gray-800 dark:bg-gray-600 dark:text-gray-200'
									}`}
								>
									{olympic.status}
								</span>
							</div>
						))}
					</div>
				</div>

				{/* Quick Actions */}
				<div className='bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700'>
					<h3 className='text-lg font-semibold text-gray-900 dark:text-white mb-4'>
						Tezkor Harakatlar
					</h3>
					<div className='space-y-3'>
						<button className='w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors text-left'>
							Yangi Olimpiada Yaratish
						</button>
						<button className='w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg transition-colors text-left'>
							Test Qo'shish
						</button>
						<button className='w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-4 rounded-lg transition-colors text-left'>
							Hisobot Ko'rish
						</button>
						<button className='w-full bg-orange-600 hover:bg-orange-700 text-white font-medium py-2 px-4 rounded-lg transition-colors text-left'>
							Foydalanuvchilarni Boshqarish
						</button>
					</div>
				</div>
			</div>

			{/* Activity Chart */}
			<div className='bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700'>
				<h3 className='text-lg font-semibold text-gray-900 dark:text-white mb-4'>
					Haftalik Faollik
				</h3>
				<div className='h-64 flex items-end justify-between space-x-2'>
					{['Dush', 'Sesh', 'Chor', 'Pay', 'Jum', 'Shan', 'Yak'].map(
						(day, index) => {
							const height = Math.random() * 200 + 20
							return (
								<div key={day} className='flex-1 flex flex-col items-center'>
									<div
										className='w-full bg-blue-500 rounded-t-lg transition-all duration-300 hover:bg-blue-600'
										style={{ height: `${height}px` }}
									></div>
									<span className='text-sm text-gray-600 dark:text-gray-400 mt-2'>
										{day}
									</span>
								</div>
							)
						}
					)}
				</div>
			</div>
		</div>
	)
}

export default Dashboard
