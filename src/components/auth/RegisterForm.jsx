import { ChevronDown, Eye, EyeOff, UserPlus } from 'lucide-react'
import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'

const RegisterForm = () => {
	const [formData, setFormData] = useState({
		firstName: '',
		lastName: '',
		username: '',
		password: '',
		confirmPassword: '',
		role: 'QB User',
	})
	const [showPassword, setShowPassword] = useState(false)
	const [showConfirmPassword, setShowConfirmPassword] = useState(false)
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState('')

	const { register } = useAuth()

	const roles = ['QB User', 'Creator', 'Pro Creator', 'Reviwer', 'Moderator']

	const handleSubmit = async e => {
		e.preventDefault()
		setError('')

		if (formData.password !== formData.confirmPassword) {
			setError('Parollar mos kelmaydi')
			return
		}

		if (formData.password.length < 6) {
			setError("Parol kamida 6 ta belgidan iborat bo'lishi kerak")
			return
		}

		setLoading(true)

		const result = await register(formData)

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
				Ro'yhatdan o'tish
			</h2>

			{error && (
				<div className='bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3 mb-4'>
					<p className='text-red-600 dark:text-red-400 text-sm'>{error}</p>
				</div>
			)}

			<form onSubmit={handleSubmit} className='space-y-4'>
				<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
					<div>
						<label
							htmlFor='firstName'
							className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'
						>
							Ism
						</label>
						<input
							type='text'
							id='firstName'
							name='firstName'
							value={formData.firstName}
							onChange={handleChange}
							className='w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white'
							placeholder='Ism'
							required
						/>
					</div>

					<div>
						<label
							htmlFor='lastName'
							className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'
						>
							Familiya
						</label>
						<input
							type='text'
							id='lastName'
							name='lastName'
							value={formData.lastName}
							onChange={handleChange}
							className='w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white'
							placeholder='Familiya'
							required
						/>
					</div>
				</div>

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
						placeholder='Username'
						required
					/>
				</div>

				<div>
					<label
						htmlFor='role'
						className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'
					>
						Rol
					</label>
					<div className='relative'>
						<select
							id='role'
							name='role'
							value={formData.role}
							onChange={handleChange}
							className='w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white appearance-none'
						>
							{roles.map(role => (
								<option key={role} value={role}>
									{role}
								</option>
							))}
						</select>
						<ChevronDown className='absolute right-3 top-2.5 h-4 w-4 text-gray-400 pointer-events-none' />
					</div>
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
							placeholder='Parol'
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

				<div>
					<label
						htmlFor='confirmPassword'
						className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'
					>
						Parol takroran
					</label>
					<div className='relative'>
						<input
							type={showConfirmPassword ? 'text' : 'password'}
							id='confirmPassword'
							name='confirmPassword'
							value={formData.confirmPassword}
							onChange={handleChange}
							className='w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white pr-10'
							placeholder='Parolni takrorlang'
							required
						/>
						<button
							type='button'
							onClick={() => setShowConfirmPassword(!showConfirmPassword)}
							className='absolute inset-y-0 right-0 pr-3 flex items-center'
						>
							{showConfirmPassword ? (
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
							<UserPlus className='h-4 w-4' />
							<span>Ro'yhatdan o'tish</span>
						</>
					)}
				</button>
			</form>

			<div className='mt-6 text-center'>
				<p className='text-gray-600 dark:text-gray-400'>
					Allaqachon akkountingiz bormi?{' '}
					<Link
						to='/login'
						className='text-blue-600 hover:text-blue-500 font-medium'
					>
						Kirish
					</Link>
				</p>
			</div>
		</div>
	)
}

export default RegisterForm
