import { Camera } from 'lucide-react'
import React, { useState } from 'react'
import Form from '../components/common/Form'
import { useAuth } from '../hooks/useAuth'
import { profileService } from '../services/profileService'

const Profile = () => {
	const { user, updateUser } = useAuth()
	const [isEditing, setIsEditing] = useState(false)
	const [loading, setLoading] = useState(false)
	const [formData, setFormData] = useState({
		firstName: user?.firstName || '',
		lastName: user?.lastName || '',
		username: user?.username || '',
		email: user?.email || '',
		role: user?.role || '',
	})

	const handleSubmit = async e => {
		setLoading(true)

		try {
			const updatedProfile = await profileService.updateProfile(formData)
			updateUser({ ...user, ...updatedProfile })
			setIsEditing(false)
		} catch (error) {
			console.error('Profile update error:', error)
		} finally {
			setLoading(false)
		}
	}

	const handleImageUpload = async e => {
		const file = e.target.files[0]
		if (!file) return

		try {
			const result = await profileService.uploadAvatar(file)
			updateUser({ ...user, avatar: result.url })
		} catch (error) {
			console.error('Avatar upload error:', error)
		}
	}

	const handleChange = e => {
		setFormData({
			...formData,
			[e.target.name]: e.target.value,
		})
	}

	// Form field definitions
	const profileFormFields = [
		{
			name: 'firstName',
			type: 'text',
			label: 'First name',
			value: formData.firstName,
			onChange: e => setFormData({ ...formData, firstName: e.target.value }),
			required: true,
		},
		{
			name: 'lastName',
			type: 'text',
			label: 'Lastname',
			value: formData.lastName,
			onChange: e => setFormData({ ...formData, lastName: e.target.value }),
			required: true,
		},
		{
			name: 'username',
			type: 'text',
			label: 'Username',
			value: formData.username,
			onChange: e => setFormData({ ...formData, username: e.target.value }),
			required: true,
		},
		{
			name: 'password',
			type: 'password',
			label: 'Password',
			value: formData.password || '',
			onChange: e => setFormData({ ...formData, password: e.target.value }),
			placeholder: '••••••••',
		},
		{
			name: 'role',
			type: 'text',
			label: 'Role',
			value: formData.role,
			onChange: e => setFormData({ ...formData, role: e.target.value }),
			required: true,
		},
	]

	return (
		<div className='max-w-4xl mx-auto'>
			<div className='bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden'>
				{/* Profile Header */}
				<div className='bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-8'>
					<div className='flex items-center space-x-6'>
						<div className='relative'>
							<img
								src={user?.avatar || '/api/placeholder/100/100'}
								alt='Profile'
								className='h-24 w-24 rounded-full object-cover border-4 border-white'
							/>
							<label className='absolute bottom-0 right-0 bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-full cursor-pointer transition-colors'>
								<Camera className='h-4 w-4' />
								<input
									type='file'
									className='hidden'
									accept='image/*'
									onChange={handleImageUpload}
								/>
							</label>
						</div>
						<div className='text-white'>
							<h1 className='text-2xl font-bold'>
								{user?.firstName} {user?.lastName}
							</h1>
							<p className='text-blue-100'>@{user?.username}</p>
							<p className='text-blue-100'>{user?.role}</p>
						</div>
					</div>
				</div>

				{/* Profile Content */}
				<div className='p-6'>
					<div className='flex items-center justify-between mb-6'>
						<h2 className='text-xl font-semibold text-gray-900 dark:text-white'>
							Profile
						</h2>
					</div>

					<Form
						fields={profileFormFields}
						onSubmit={handleSubmit}
						submitText='Saqlash'
						submitButtonColor='green'
						loading={loading}
					/>
				</div>
			</div>

			{/* Pagination Footer */}
			<div className='flex items-center justify-between mt-6'>
				<div className='flex items-center space-x-4'>
					<div className='w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold'>
						20
					</div>
					<span className='text-sm text-gray-600 dark:text-gray-400'>
						364 ta yozuvdan 1 dan 20 gacha ko'rsatilmoqda
					</span>
				</div>

				{/* Pagination controls */}
				<div className='flex items-center space-x-2'>
					{[1, 2, 3, 4, '...', 5].map((page, index) => (
						<button
							key={index}
							disabled={page === '...'}
							className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
								page === 1
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

			{/* Statistics
			<div className='mt-6 grid grid-cols-1 md:grid-cols-3 gap-6'>
				<div className='bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700'>
					<div className='text-center'>
						<div className='text-2xl font-bold text-blue-600 dark:text-blue-400'>
							15
						</div>
						<div className='text-sm text-gray-600 dark:text-gray-400'>
							Yaratilgan Olimpiadalar
						</div>
					</div>
				</div>
				<div className='bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700'>
					<div className='text-center'>
						<div className='text-2xl font-bold text-green-600 dark:text-green-400'>
							1,234
						</div>
						<div className='text-sm text-gray-600 dark:text-gray-400'>
							Jami Ishtirokchilar
						</div>
					</div>
				</div>
				<div className='bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700'>
					<div className='text-center'>
						<div className='text-2xl font-bold text-purple-600 dark:text-purple-400'>
							89%
						</div>
						<div className='text-sm text-gray-600 dark:text-gray-400'>
							Muvaffaqiyat Darajasi
						</div>
					</div>
				</div>
			</div> */}
		</div>
	)
}

export default Profile
