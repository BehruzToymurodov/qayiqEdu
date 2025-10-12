import { Eye, EyeOff, LogIn } from 'lucide-react'
import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'

const LoginForm = () => {
	const [formData, setFormData] = useState({
		username: '',
		password: '',
	})
	const [showPassword, setShowPassword] = useState(false)
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState('')

	const { login } = useAuth()

	const handleSubmit = async e => {
		e.preventDefault()
		setLoading(true)
		setError('')

		const result = await login(formData)

		if (!result.success) {
			setError(result.error)
		}

		setLoading(false)
	}

	const handleChange = e => {
		setFormData({
			...formData,
			[e.target.name]: e.target.value,
		})
	}

	return (
		<div>
			<h2 className='text-2xl font-bold text-gray-900 dark:text-white mb-6'>
				Kirish
			</h2>

			{error && (
				<div className='bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3 mb-4'>
					<p className='text-red-600 dark:text-red-400 text-sm'>{error}</p>
				</div>
			)}

			<form onSubmit={handleSubmit} className='space-y-4'>
				<div>
					<label
						htmlFor='username'
						className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'
					>
						Username
					</label>
					<input
						type='text'
						id='username'
						name='username'
						value={formData.username}
						onChange={handleChange}
						className='w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white'
						placeholder='Username kiriting'
						required
					/>
				</div>

				<div>
					<label
						htmlFor='password'
						className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'
					>
						Parol
					</label>
					<div className='relative'>
						<input
							type={showPassword ? 'text' : 'password'}
							id='password'
							name='password'
							value={formData.password}
							onChange={handleChange}
							className='w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white pr-10'
							placeholder='Parol kiriting'
							required
						/>
						<button
							type='button'
							onClick={() => setShowPassword(!showPassword)}
							className='absolute inset-y-0 right-0 pr-3 flex items-center'
						>
							{showPassword ? (
								<EyeOff className='h-4 w-4 text-gray-400' />
							) : (
								<Eye className='h-4 w-4 text-gray-400' />
							)}
						</button>
					</div>
				</div>

				<button
					type='submit'
					disabled={loading}
					className='w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2'
				>
					{loading ? (
						<div className='animate-spin rounded-full h-4 w-4 border-b-2 border-white'></div>
					) : (
						<>
							<LogIn className='h-4 w-4' />
							<span>Kirish</span>
						</>
					)}
				</button>
			</form>

			<div className='mt-6 text-center'>
				<p className='text-gray-600 dark:text-gray-400'>
					Akkountingiz yo'qmi?{' '}
					<Link
						to='/register'
						className='text-blue-600 hover:text-blue-500 font-medium'
					>
						Akkount yaratish
					</Link>
				</p>
			</div>

			<div className='mt-4 text-xs text-gray-500 dark:text-gray-400'>
				<p>
					Demo uchun: username: <strong>admin</strong>, parol:{' '}
					<strong>admin</strong>
				</p>
			</div>
		</div>
	)
}

export default LoginForm
