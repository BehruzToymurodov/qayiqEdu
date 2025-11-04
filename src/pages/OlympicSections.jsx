import { Edit2, Info, Trash2 } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import DataTable from '../components/common/DataTable'
import Form from '../components/common/Form'
import Modal from '../components/common/Modal'

const OlympicSections = () => {
	const navigate = useNavigate()
	const { olympicId } = useParams()
	const [sections, setSections] = useState([])
	const [loading, setLoading] = useState(true)
	const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
	const [isEditModalOpen, setIsEditModalOpen] = useState(false)
	const [selectedSection, setSelectedSection] = useState(null)
	const [olympicName, setOlympicName] = useState('')
	const [formData, setFormData] = useState({
		name: '',
		testsCount: '',
		ballType: '',
		ball: '',
	})

	const ballTypes = ['Har xil', 'Bir xil']

	// Table column definitions
	const sectionsColumns = [
		{
			key: 'index',
			title: '№',
			width: '60px',
			render: (item, index) => index + 1,
		},
		{
			key: 'name',
			title: 'Fan/qism nomi',
		},
		{
			key: 'createdAt',
			title: 'Yaratilgan',
			render: item => item.createdAt || '06.10.25',
		},
		{
			key: 'ballType',
			title: 'Ball tipi',
			render: item => item.ballType || 'Bir xil',
		},
		{
			key: 'ball',
			title: 'Ball',
			render: item => {
				if (item.ballType === 'Har xil') {
					return 'Har xil'
				}
				return `${item.ball || 0} ball`
			},
		},
		{
			key: 'testsCount',
			title: 'Testlar soni',
			render: item => `${item.completedTests || 0}/${item.testsCount || 0}`,
		},
		{
			key: 'actions',
			title: 'Amallar',
			icon: true,
			render: (item, index) => (
				<div className='flex space-x-2'>
					<button
						onClick={e => {
							e.stopPropagation()
							handleFillTests(item)
						}}
						className='px-3 py-1 text-white text-xs rounded-lg bg-red-500 hover:bg-red-600 transition-colors'
						title="Testlarni to'ldirish"
					>
						to'ldirish
					</button>
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
	const getFormFields = () => [
		{
			name: 'name',
			type: 'text',
			label: 'Fan/qism nomi',
			value: formData.name,
			onChange: e => setFormData({ ...formData, name: e.target.value }),
			placeholder: 'Masalan: Matematika',
			required: true,
			fullWidth: true,
		},
		{
			name: 'testsCount',
			type: 'number',
			label: 'Testlar soni',
			value: formData.testsCount,
			onChange: e => setFormData({ ...formData, testsCount: e.target.value }),
			placeholder: '5',
			min: 5,
			required: true,
			width: '1/3',
		},
		{
			name: 'ballType',
			type: 'select',
			label: 'Ball tipi',
			value: formData.ballType,
			onChange: e => {
				const newBallType = e.target.value
				setFormData({
					...formData,
					ballType: newBallType,
					ball: newBallType === 'Har xil' ? '' : formData.ball,
				})
			},
			placeholder: 'Ball tipi tanlang',
			required: true,
			options: ballTypes.map(type => ({ value: type, label: type })),
			width: '1/3',
		},
		{
			name: 'ball',
			type: 'number',
			label: 'Ball',
			value: formData.ball,
			onChange: e => setFormData({ ...formData, ball: e.target.value }),
			placeholder:
				formData.ballType === 'Har xil' ? "Testlardan qo'shiladi" : '2',
			min: 0,
			required: formData.ballType === 'Bir xil',
			disabled: formData.ballType === 'Har xil',
			width: '1/3',
		},
	]

	useEffect(() => {
		loadSections()
	}, [olympicId])

	const loadSections = async () => {
		try {
			// Mock data - replace with actual API call
			setOlympicName('Matematika Olimpiadasi')
			setSections([])
		} catch (error) {
			console.error('Error loading sections:', error)
		} finally {
			setLoading(false)
		}
	}

	const handleCreate = async e => {
		e.preventDefault()
		try {
			const newSection = {
				id: Date.now(),
				name: formData.name,
				testsCount: parseInt(formData.testsCount) || 0,
				ballType: formData.ballType,
				ball:
					formData.ballType === 'Bir xil' ? parseInt(formData.ball) || 0 : 0,
				completedTests: 0,
				createdAt: new Date().toLocaleDateString('uz-UZ'),
			}
			setSections([...sections, newSection])
			setIsCreateModalOpen(false)
			resetForm()
		} catch (error) {
			console.error('Error creating section:', error)
		}
	}

	const handleUpdate = async e => {
		e.preventDefault()
		if (!selectedSection) return

		try {
			const updatedSection = {
				...selectedSection,
				name: formData.name,
				testsCount: parseInt(formData.testsCount) || 0,
				ballType: formData.ballType,
				ball:
					formData.ballType === 'Bir xil' ? parseInt(formData.ball) || 0 : 0,
			}
			setSections(
				sections.map(s => (s.id === selectedSection.id ? updatedSection : s))
			)
			setIsEditModalOpen(false)
			setSelectedSection(null)
			resetForm()
		} catch (error) {
			console.error('Error updating section:', error)
		}
	}

	const handleDelete = async id => {
		if (!confirm("Bu fan/qismni o'chirishni xohlaysizmi?")) return

		try {
			setSections(sections.filter(s => s.id !== id))
		} catch (error) {
			console.error('Error deleting section:', error)
		}
	}

	const handleFillTests = section => {
		// Navigate to tests page for this section
		navigate(`/olympics/${olympicId}/sections/${section.id}/tests`)
	}

	const openEditModal = section => {
		setSelectedSection(section)
		setFormData({
			name: section.name,
			testsCount: section.testsCount?.toString() || '',
			ballType: section.ballType || 'Bir xil',
			ball: section.ball?.toString() || '',
		})
		setIsEditModalOpen(true)
	}

	const resetForm = () => {
		setFormData({
			name: '',
			testsCount: '',
			ballType: '',
			ball: '',
		})
	}

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
				<div>
					<button
						onClick={() => navigate('/olympics')}
						className='text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 mb-2 flex items-center space-x-1'
					>
						<span>←</span>
						<span>Olimpiadalar</span>
					</button>
					<h1 className='text-3xl font-bold text-gray-900 dark:text-white'>
						{olympicName} - Fanlar/qismlar
					</h1>
				</div>
				<button
					onClick={() => setIsCreateModalOpen(true)}
					className='px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center space-x-2 transition-colors'
				>
					<span>+</span>
					<span>Fan/qism qo'shish</span>
				</button>
			</div>

			{/* Warning Banner - only show when no sections exist */}
			{sections.length === 0 && (
				<div className='bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 flex items-start space-x-3'>
					<div className='w-5 h-5 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5'>
						<Info className='w-3 h-3 text-white' />
					</div>
					<div>
						<p className='text-red-700 dark:text-red-300 font-medium'>
							Shartlar: kamida 1 fan/qism va kamida 5 ta test
						</p>
						<p className='text-red-600 dark:text-red-400 text-sm mt-1'>
							Olimpiadani to'liq yaratish uchun kamida bitta fan/qism yarating
							va har bir fan/qismga kamida 5 ta test qo'shing.
						</p>
					</div>
				</div>
			)}

			{/* Sections Table */}
			<DataTable columns={sectionsColumns} data={sections} loading={loading} />

			{/* Create Modal */}
			<Modal
				isOpen={isCreateModalOpen}
				onClose={() => setIsCreateModalOpen(false)}
				title="Fan/qism qo'shish"
				size='lg'
			>
				<Form
					fields={getFormFields()}
					onSubmit={handleCreate}
					onCancel={() => setIsCreateModalOpen(false)}
					submitText="Qo'shish"
					cancelText='Ortga'
					submitButtonColor='green'
					cancelButtonColor='blue-outline'
				/>
			</Modal>

			{/* Edit Modal */}
			<Modal
				isOpen={isEditModalOpen}
				onClose={() => setIsEditModalOpen(false)}
				title='Fan/qismni Tahrirlash'
				size='lg'
			>
				<Form
					fields={getFormFields()}
					onSubmit={handleUpdate}
					onCancel={() => setIsEditModalOpen(false)}
					submitText='Saqlash'
					cancelText='Bekor qilish'
					submitButtonColor='green'
					cancelButtonColor='gray'
				/>
			</Modal>
		</div>
	)
}

export default OlympicSections
