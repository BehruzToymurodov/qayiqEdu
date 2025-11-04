import React from 'react'

const Form = ({
	fields = [],
	onSubmit,
	onCancel,
	submitText = 'Saqlash',
	cancelText = 'Bekor qilish',
	submitButtonColor = 'blue',
	cancelButtonColor = 'gray',
	loading = false,
	className = '',
}) => {
	const handleSubmit = e => {
		e.preventDefault()
		if (onSubmit) {
			onSubmit(e)
		}
	}

	const renderField = field => {
		const baseInputClass =
			'w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white'

		const inputClass = field.className || baseInputClass

		switch (field.type) {
			case 'text':
			case 'email':
			case 'password':
			case 'number':
				return (
					<input
						type={field.type}
						value={field.value || ''}
						onChange={field.onChange}
						placeholder={field.placeholder}
						className={inputClass}
						required={field.required}
						disabled={field.disabled}
						min={field.min}
						max={field.max}
					/>
				)

			case 'textarea':
				return (
					<textarea
						value={field.value || ''}
						onChange={field.onChange}
						placeholder={field.placeholder}
						rows={field.rows || 3}
						className={inputClass}
						required={field.required}
						disabled={field.disabled}
					/>
				)

			case 'select':
				return (
					<div className='relative'>
						<select
							value={field.value || ''}
							onChange={field.onChange}
							className={`${inputClass} appearance-none pr-8`}
							required={field.required}
							disabled={field.disabled}
						>
							{field.placeholder && (
								<option value=''>{field.placeholder}</option>
							)}
							{field.options?.map(option => (
								<option key={option.value} value={option.value}>
									{option.label}
								</option>
							))}
						</select>
						<div className='absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none'>
							<svg
								className='w-4 h-4 text-gray-400'
								fill='none'
								stroke='currentColor'
								viewBox='0 0 24 24'
							>
								<path
									strokeLinecap='round'
									strokeLinejoin='round'
									strokeWidth={2}
									d='M9 5l7 7-7 7'
								/>
							</svg>
						</div>
					</div>
				)

			case 'checkbox':
				return (
					<div className='flex items-center space-x-2'>
						<input
							type='checkbox'
							checked={field.value || false}
							onChange={field.onChange}
							className='w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600'
							required={field.required}
							disabled={field.disabled}
						/>
						{field.label && (
							<label className='text-sm text-gray-700 dark:text-gray-300'>
								{field.label}
							</label>
						)}
					</div>
				)

			case 'radio':
				return (
					<div className='space-y-2'>
						{field.options?.map(option => (
							<div key={option.value} className='flex items-center space-x-2'>
								<input
									type='radio'
									name={field.name}
									value={option.value}
									checked={field.value === option.value}
									onChange={field.onChange}
									className='w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600'
									required={field.required}
									disabled={field.disabled}
								/>
								<label className='text-sm text-gray-700 dark:text-gray-300'>
									{option.label}
								</label>
							</div>
						))}
					</div>
				)

			case 'variants':
				return (
					<div className='space-y-3'>
						{field.value?.map((variant, index) => (
							<div key={index} className='flex items-center space-x-3'>
								<input
									type='radio'
									name='correctAnswer'
									checked={field.correctAnswer === index}
									onChange={() => field.onCorrectAnswerChange(index)}
									className='w-4 h-4 text-green-600 bg-gray-100 border-gray-300 focus:ring-green-500 dark:focus:ring-green-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600'
								/>
								<input
									type='text'
									value={variant}
									onChange={e => field.onChange(index, e.target.value)}
									placeholder={`Variant ${index + 1}`}
									className='flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white'
									required={field.required}
								/>
							</div>
						))}
					</div>
				)

			default:
				return (
					<input
						type='text'
						value={field.value || ''}
						onChange={field.onChange}
						placeholder={field.placeholder}
						className={inputClass}
						required={field.required}
						disabled={field.disabled}
					/>
				)
		}
	}

	const getButtonColor = color => {
		switch (color) {
			case 'blue':
				return 'bg-blue-600 hover:bg-blue-700 text-white'
			case 'green':
				return 'bg-green-600 hover:bg-green-700 text-white'
			case 'red':
				return 'bg-red-600 hover:bg-red-700 text-white'
			case 'gray':
				return 'bg-gray-600 hover:bg-gray-700 text-white'
			case 'blue-outline':
				return 'border border-blue-600 text-blue-600 hover:bg-blue-50'
			case 'green-outline':
				return 'border border-green-600 text-green-600 hover:bg-green-50'
			case 'red-outline':
				return 'border border-red-600 text-red-600 hover:bg-red-50'
			default:
				return 'bg-gray-600 hover:bg-gray-700 text-white'
		}
	}

	// Group fields by row based on width property
	const groupFieldsByRow = () => {
		const rows = []
		let currentRow = []

		fields.forEach(field => {
			if (field.fullWidth) {
				if (currentRow.length > 0) {
					rows.push(currentRow)
					currentRow = []
				}
				rows.push([field])
			} else if (field.width === '1/3') {
				currentRow.push(field)
				if (currentRow.length === 3) {
					rows.push(currentRow)
					currentRow = []
				}
			} else {
				if (currentRow.length > 0) {
					rows.push(currentRow)
					currentRow = []
				}
				rows.push([field])
			}
		})

		if (currentRow.length > 0) {
			rows.push(currentRow)
		}

		return rows
	}

	const getFieldWidth = field => {
		if (field.fullWidth) return 'w-full'
		if (field.width === '1/3') return 'w-full md:w-1/3'
		return 'w-full'
	}

	return (
		<form onSubmit={handleSubmit} className={className}>
			<div className='space-y-4'>
				{groupFieldsByRow().map((row, rowIndex) => (
					<div
						key={rowIndex}
						className={row.length > 1 ? 'flex flex-col md:flex-row gap-4' : ''}
					>
						{row.map((field, fieldIndex) => (
							<div
								key={field.name || fieldIndex}
								className={getFieldWidth(field)}
							>
								{field.type !== 'checkbox' && field.label && (
									<label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>
										{field.label}
										{field.required && (
											<span className='text-red-500 ml-1'>*</span>
										)}
									</label>
								)}

								{renderField(field)}

								{field.helperText && (
									<div className='text-sm text-gray-500 mt-1'>
										{field.helperText}
									</div>
								)}

								{field.error && (
									<div className='text-sm text-red-500 mt-1'>{field.error}</div>
								)}
							</div>
						))}
					</div>
				))}
			</div>

			{(onSubmit || onCancel) && (
				<div className='flex justify-end space-x-3 mt-6'>
					{onCancel && (
						<button
							type='button'
							onClick={onCancel}
							className={`px-4 py-2 rounded-lg transition-colors ${getButtonColor(
								cancelButtonColor
							)}`}
						>
							{cancelText}
						</button>
					)}
					{onSubmit && (
						<button
							type='submit'
							disabled={loading}
							className={`px-4 py-2 rounded-lg transition-colors ${getButtonColor(
								submitButtonColor
							)} ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
						>
							{loading ? (
								<div className='flex items-center space-x-2'>
									<div className='animate-spin rounded-full h-4 w-4 border-b-2 border-white'></div>
									<span>Yuklanmoqda...</span>
								</div>
							) : (
								submitText
							)}
						</button>
					)}
				</div>
			)}
		</form>
	)
}

export default Form
