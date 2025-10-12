import { ArrowLeft, Edit2, Plus, Trash2 } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import DataTable from '../components/common/DataTable'
import Form from '../components/common/Form'
import Modal from '../components/common/Modal'

const Exercise = () => {
	const { olympicId } = useParams()
	const navigate = useNavigate()
	const [olympic, setOlympic] = useState(null)
	const [exercises, setExercises] = useState([])
	const [loading, setLoading] = useState(true)
	const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
	const [isEditModalOpen, setIsEditModalOpen] = useState(false)
	const [selectedExercise, setSelectedExercise] = useState(null)
	const [formData, setFormData] = useState({
		topicName: '',
		testCount: '',
		ballType: '',
		ball: '2',
	})

	const ballTypes = ['Har xil', 'Bir xil']

	// Load olympic data (mock data for now)
	useEffect(() => {
		const loadOlympicData = async () => {
			setLoading(true)
			try {
				// Mock data - replace with actual API call
				const mockOlympic = {
					id: olympicId,
					contextName: "Bo'linish belgilari",
					date: '2024-10-06',
					sectionsCount: 0,
					testsCount: 10,
				}
				setOlympic(mockOlympic)

				// Mock exercises data
				const mockExercises = [
					{
						id: 1,
						topicName: 'Matematik amallar',
						testCount: 5,
						ballType: 'Har xil',
						ball: 2,
						createdAt: '2024-10-06',
					},
				]
				setExercises(mockExercises)
			} catch (error) {
				console.error('Error loading olympic data:', error)
			} finally {
				setLoading(false)
			}
		}

		loadOlympicData()
	}, [olympicId])

	// Table column definitions
	const exerciseColumns = [
		{
			key: 'index',
			title: '№',
			width: '60px',
			render: (item, index) => index + 1,
		},
		{
			key: 'topicName',
			title: 'Mavzu nomi',
		},
		{
			key: 'testCount',
			title: 'Testlar soni',
			render: item => `${item.testCount} ta`,
		},
		{
			key: 'ballType',
			title: 'Ball tipi',
		},
		{
			key: 'ball',
			title: 'Ball',
			render: item => `${item.ball} ball`,
		},
		{
			key: 'actions',
			title: 'Amallar',
			render: item => (
				<div className='flex space-x-2'>
					<button
						onClick={e => {
							e.stopPropagation()
							openEditModal(item)
						}}
						className='p-1 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300'
						title='Tahrirlash'
					>
						<Edit2 className='h-4 w-4' />
					</button>
					<button
						onClick={e => {
							e.stopPropagation()
							handleDelete(item.id)
						}}
						className='p-1 text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300'
						title="O'chirish"
					>
						<Trash2 className='h-4 w-4' />
					</button>
				</div>
			),
		},
	]

	// Form field definitions
	const exerciseFormFields = [
		{
			name: 'topicName',
			type: 'text',
			label: 'Mavzu nomi',
			value: formData.topicName,
			onChange: e => setFormData({ ...formData, topicName: e.target.value }),
			placeholder: 'Mavzu nomini kiriting',
			required: true,
		},
		{
			name: 'testCount',
			type: 'number',
			label: 'Testlar soni',
			value: formData.testCount,
			onChange: e => setFormData({ ...formData, testCount: e.target.value }),
			placeholder: '0',
			min: 1,
			required: true,
		},
		{
			name: 'ballType',
			type: 'select',
			label: 'Ball tipi',
			value: formData.ballType,
			onChange: e => setFormData({ ...formData, ballType: e.target.value }),
			placeholder: 'Ball tipi tanlang',
			required: true,
			options: ballTypes.map(type => ({ value: type, label: type })),
		},
		{
			name: 'ball',
			type: 'number',
			label: 'Ball',
			value: formData.ball,
			onChange: e => setFormData({ ...formData, ball: e.target.value }),
			placeholder: '2',
			disabled: true,
			required: true,
		},
	]

	const handleCreate = async e => {
		e.preventDefault()
		try {
			const newExercise = {
				id: Date.now(),
				...formData,
				testCount: parseInt(formData.testCount),
				ball: parseInt(formData.ball),
				createdAt: new Date().toISOString().split('T')[0],
			}
			setExercises([...exercises, newExercise])
			setIsCreateModalOpen(false)
			resetForm()
		} catch (error) {
			console.error('Error creating exercise:', error)
		}
	}

	const handleUpdate = async e => {
		e.preventDefault()
		if (!selectedExercise) return

		try {
			const updatedExercise = {
				...selectedExercise,
				...formData,
				testCount: parseInt(formData.testCount),
				ball: parseInt(formData.ball),
			}
			setExercises(
				exercises.map(ex =>
					ex.id === selectedExercise.id ? updatedExercise : ex
				)
			)
			setIsEditModalOpen(false)
			setSelectedExercise(null)
			resetForm()
		} catch (error) {
			console.error('Error updating exercise:', error)
		}
	}

	const handleDelete = async id => {
		if (!confirm("Bu mavzuni o'chirishni xohlaysizmi?")) return

		try {
			setExercises(exercises.filter(ex => ex.id !== id))
		} catch (error) {
			console.error('Error deleting exercise:', error)
		}
	}

	const openEditModal = exercise => {
		setSelectedExercise(exercise)
		setFormData({
			topicName: exercise.topicName,
			testCount: exercise.testCount.toString(),
			ballType: exercise.ballType,
			ball: exercise.ball.toString(),
		})
		setIsEditModalOpen(true)
	}

	const resetForm = () => {
		setFormData({
			topicName: '',
			testCount: '',
			ballType: '',
			ball: '2',
		})
	}

	// Calculate total tests created
	const totalTestsCreated = exercises.reduce(
		(sum, exercise) => sum + exercise.testCount,
		0
	)
	const isComplete = totalTestsCreated >= (olympic?.testsCount || 0)

	if (loading) {
		return (
			<div className='flex items-center justify-center h-64'>
				<div className='animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600'></div>
			</div>
		)
	}

	return (
		<div className='space-y-6'>
			{/* Header */}
			<div className='flex items-center justify-between'>
				<div className='flex items-center space-x-4'>
					<button
						onClick={() => navigate('/olympics')}
						className='flex items-center space-x-2 text-blue-600 hover:text-blue-800 font-medium'
					>
						<ArrowLeft className='h-4 w-4' />
						<span>Olimpiadalar</span>
					</button>
					<h1 className='text-3xl font-bold text-gray-900 dark:text-white'>
						{olympic?.contextName || 'Olimpiada'}
					</h1>
				</div>
				<button
					onClick={() => setIsCreateModalOpen(true)}
					disabled={isComplete}
					className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
						isComplete
							? 'bg-gray-400 text-gray-600 cursor-not-allowed'
							: 'bg-blue-600 hover:bg-blue-700 text-white'
					}`}
				>
					<Plus className='h-4 w-4' />
					<span>Mavzu qo'shish</span>
				</button>
			</div>

			{/* Progress Info */}
			<div className='bg-blue-50 border border-blue-200 rounded-lg p-4'>
				<div className='flex items-center justify-between'>
					<div>
						<p className='text-blue-700 font-medium'>
							Yaratilgan testlar: {totalTestsCreated} /{' '}
							{olympic?.testsCount || 0}
						</p>
						<p className='text-blue-600 text-sm'>
							{isComplete
								? "Olimpiada to'ldirilgan!"
								: "Olimpiadani to'ldirish uchun qo'shimcha mavzular qo'shing"}
						</p>
					</div>
					{isComplete && (
						<div className='bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium'>
							To'ldirilgan
						</div>
					)}
				</div>
			</div>

			{/* Exercises Table */}
			<DataTable columns={exerciseColumns} data={exercises} loading={loading} />

			{/* Create Modal */}
			<Modal
				isOpen={isCreateModalOpen}
				onClose={() => setIsCreateModalOpen(false)}
				title="Yangi mavzu qo'shish"
				size='md'
			>
				<Form
					fields={exerciseFormFields}
					onSubmit={handleCreate}
					onCancel={() => setIsCreateModalOpen(false)}
					submitText="Qo'shish"
					cancelText='Bekor qilish'
					submitButtonColor='green'
					cancelButtonColor='blue-outline'
				/>
			</Modal>

			{/* Edit Modal */}
			<Modal
				isOpen={isEditModalOpen}
				onClose={() => setIsEditModalOpen(false)}
				title='Mavzuni tahrirlash'
				size='md'
			>
				<Form
					fields={exerciseFormFields}
					onSubmit={handleUpdate}
					onCancel={() => setIsEditModalOpen(false)}
					submitText='Saqlash'
					cancelText='Bekor qilish'
					submitButtonColor='green'
					cancelButtonColor='blue-outline'
				/>
			</Modal>
		</div>
	)
}

export default Exercise
