import { Edit2, Grid3X3, Trash2 } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import DataTable from '../components/common/DataTable'
import Form from '../components/common/Form'
import Modal from '../components/common/Modal'
import OlympicsSearch from '../components/olympic/OlympicsSearch'
import Pagination from '../components/olympic/Pagination'
import { olympicsService } from '../services/olympicsService'

const Olympics = () => {
	const navigate = useNavigate()
	const [olympics, setOlympics] = useState([])
	const [loading, setLoading] = useState(true)
	const [searchTerm, setSearchTerm] = useState('')
	const [currentPage, setCurrentPage] = useState(1)
	const [itemsPerPage] = useState(20)
	const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
	const [isEditModalOpen, setIsEditModalOpen] = useState(false)
	const [isSectionModalOpen, setIsSectionModalOpen] = useState(false)
	const [selectedOlympic, setSelectedOlympic] = useState(null)
	const [currentView, setCurrentView] = useState('olympics') // 'olympics' or 'sections'
	const [formData, setFormData] = useState({
		contextName: '',
		date: '',
		sectionsCount: '',
		testsCount: '',
		subject: '',
		status: 'Faol',
		xpPoints: '',
		duration: '',
	})
	const [sectionFormData, setSectionFormData] = useState({
		name: '',
		quantity: '',
		ballType: '',
		ball: '',
	})

	const subjects = [
		'Matematika',
		'Fizika',
		'Kimyo',
		'Biologiya',
		'Tarix',
		'Geografiya',
	]
	const statuses = ['Faol', 'Tugagan', 'Kutilmoqda']
	const ballTypes = ['Har xil', 'Bir xil', "Qo'shimcha"]

	// Table column definitions
	const olympicsColumns = [
		{
			key: 'index',
			title: '№',
			width: '60px',
			render: (item, index) => index + 1,
		},
		{
			key: 'contextName',
			title: 'Olimpiada nomlari',
		},
		{
			key: 'date',
			title: 'Yaratilgan',
			render: item => item.date || '06.10.25',
		},
		{
			key: 'sectionsCount',
			title: 'Qismlar',
			icon: true,
			render: item => `${item.sectionsCount || 0} ta`,
		},
		{
			key: 'testsCount',
			title: 'Testlar',
			render: item => `${item.testsCount || 0} ta`,
		},
		{
			key: 'actions',
			title: 'Amallar',
			icon: true,
			render: (item, index) => (
				<div className='flex space-x-2'>
					{item.sectionsCount > 0 ? (
						<button
							onClick={e => {
								e.stopPropagation()
								onViewSections(item)
							}}
							className='p-1 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300'
							title="Qismlarni ko'rish"
						>
							<Grid3X3 className='h-4 w-4' />
						</button>
					) : (
						<button
							onClick={e => {
								e.stopPropagation()
								handleFillOlympic(item)
							}}
							disabled={item.testsCount === 0}
							className={`px-3 py-1 text-white text-xs rounded-lg transition-colors ${
								item.testsCount === 0
									? 'bg-gray-400 cursor-not-allowed'
									: 'bg-red-500 hover:bg-red-600'
							}`}
							title={
								item.testsCount === 0
									? 'Testlar soni kiritilmagan'
									: "Olimpiadani to'ldirish"
							}
						>
							to'ldirish
						</button>
					)}
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

	const sectionsColumns = [
		{
			key: 'index',
			title: 'No',
			width: '60px',
			render: (item, index) => index + 1,
		},
		{
			key: 'name',
			title: 'Olimpiada nomlari',
		},
		{
			key: 'created',
			title: 'Yaratilgan',
		},
		{
			key: 'sections',
			title: 'Qismlar',
			icon: true,
			render: item => `${item.sections || 0} ta`,
		},
		{
			key: 'tests',
			title: 'Testlar',
			render: item => `${item.tests || 0} ta`,
		},
		{
			key: 'actions',
			title: 'Amallar',
			icon: true,
			render: item => (
				<div className='flex space-x-2'>
					<button className='p-1 text-blue-600 hover:text-blue-800'>
						<Edit2 className='h-4 w-4' />
					</button>
					<button className='p-1 text-red-600 hover:text-red-800'>
						<Trash2 className='h-4 w-4' />
					</button>
				</div>
			),
		},
	]

	// Form field definitions
	const olympicFormFields = [
		{
			name: 'contextName',
			type: 'text',
			label: 'Olimpiada nomi',
			value: formData.contextName,
			onChange: e => setFormData({ ...formData, contextName: e.target.value }),
			placeholder: "Bo'linish belgilari",
			required: true,
		},
		{
			name: 'date',
			type: 'date',
			label: 'Yaratilgan vaqti',
			value: formData.date,
			onChange: e => setFormData({ ...formData, date: e.target.value }),
			required: true,
		},
		{
			name: 'sectionsCount',
			type: 'number',
			label: 'Qismlar soni',
			value: formData.sectionsCount,
			onChange: e =>
				setFormData({ ...formData, sectionsCount: e.target.value }),
			placeholder: '0',
			min: 0,
			required: true,
		},
		{
			name: 'testsCount',
			type: 'number',
			label: 'Testlar soni',
			value: formData.testsCount,
			onChange: e => setFormData({ ...formData, testsCount: e.target.value }),
			placeholder: '0',
			min: 0,
			required: true,
		},
	]

	const sectionFormFields = [
		{
			name: 'name',
			type: 'text',
			label: 'Nomi',
			value: sectionFormData.name,
			onChange: e =>
				setSectionFormData({ ...sectionFormData, name: e.target.value }),
			placeholder: "Bo'linish belgi",
			required: true,
			helperText: '15/18 belgi',
		},
		{
			name: 'quantity',
			type: 'text',
			label: 'Soni',
			value: sectionFormData.quantity,
			onChange: e =>
				setSectionFormData({ ...sectionFormData, quantity: e.target.value }),
			placeholder: '5 ta',
			required: true,
		},
		{
			name: 'ballType',
			type: 'select',
			label: 'Ball tipi',
			value: sectionFormData.ballType,
			onChange: e =>
				setSectionFormData({ ...sectionFormData, ballType: e.target.value }),
			placeholder: 'Ball tipi tanlang',
			required: true,
			options: ballTypes.map(type => ({ value: type, label: type })),
		},
		{
			name: 'ball',
			type: 'text',
			label: 'Ball',
			value: sectionFormData.ball,
			onChange: e =>
				setSectionFormData({ ...sectionFormData, ball: e.target.value }),
			placeholder: '2 ball',
			required: true,
		},
	]

	useEffect(() => {
		loadOlympics()
	}, [])

	const loadOlympics = async () => {
		try {
			const data = await olympicsService.getOlympics()
			setOlympics(data)
		} catch (error) {
			console.error('Error loading olympics:', error)
		} finally {
			setLoading(false)
		}
	}

	const handleCreate = async e => {
		e.preventDefault()
		try {
			const newOlympic = await olympicsService.createOlympic({
				...formData,
				xpPoints: parseInt(formData.xpPoints) || 0,
				sectionsCount: parseInt(formData.sectionsCount) || 0,
				testsCount: parseInt(formData.testsCount) || 0,
				solvedCount: 0,
				date: formData.date || new Date().toISOString().split('T')[0],
			})
			setOlympics([newOlympic, ...olympics])
			setIsCreateModalOpen(false)
			resetForm()
		} catch (error) {
			console.error('Error creating olympic:', error)
		}
	}

	const handleUpdate = async e => {
		e.preventDefault()
		if (!selectedOlympic) return

		try {
			const updatedOlympic = await olympicsService.updateOlympic(
				selectedOlympic.id,
				{
					...formData,
					xpPoints: parseInt(formData.xpPoints) || 0,
					sectionsCount: parseInt(formData.sectionsCount) || 0,
					testsCount: parseInt(formData.testsCount) || 0,
				}
			)
			setOlympics(
				olympics.map(o => (o.id === selectedOlympic.id ? updatedOlympic : o))
			)
			setIsEditModalOpen(false)
			setSelectedOlympic(null)
			resetForm()
		} catch (error) {
			console.error('Error updating olympic:', error)
		}
	}

	const handleDelete = async id => {
		if (!confirm("Bu olimpiadani o'chirishni xohlaysizmi?")) return

		try {
			await olympicsService.deleteOlympic(id)
			setOlympics(olympics.filter(o => o.id !== id))
		} catch (error) {
			console.error('Error deleting olympic:', error)
		}
	}

	const openEditModal = olympic => {
		setSelectedOlympic(olympic)
		setFormData({
			contextName: olympic.contextName,
			date: olympic.date,
			sectionsCount: olympic.sectionsCount?.toString() || '0',
			testsCount: olympic.testsCount?.toString() || '0',
			subject: olympic.subject,
			status: olympic.status,
			xpPoints: olympic.xpPoints?.toString() || '0',
			duration: olympic.duration,
		})
		setIsEditModalOpen(true)
	}

	const resetForm = () => {
		setFormData({
			contextName: '',
			date: '',
			sectionsCount: '',
			testsCount: '',
			subject: '',
			status: 'Faol',
			xpPoints: '',
			duration: '',
		})
	}

	const resetSectionForm = () => {
		setSectionFormData({
			name: '',
			quantity: '',
			ballType: '',
			ball: '',
		})
	}

	const handleSectionCreate = async e => {
		e.preventDefault()
		try {
			// Handle section creation logic here
			console.log('Creating section:', sectionFormData)
			setIsSectionModalOpen(false)
			resetSectionForm()
		} catch (error) {
			console.error('Error creating section:', error)
		}
	}

	const onViewSections = olympic => {
		setSelectedOlympic(olympic)
		setCurrentView('sections')
	}

	const handleFillOlympic = olympic => {
		navigate(`/exercise/${olympic.id}`)
	}

	const filteredOlympics = olympics.filter(
		olympic =>
			olympic.contextName.toLowerCase().includes(searchTerm.toLowerCase()) ||
			olympic.subject.toLowerCase().includes(searchTerm.toLowerCase())
	)

	// Calculate pagination
	const totalPages = Math.ceil(filteredOlympics.length / itemsPerPage)
	const startIndex = (currentPage - 1) * itemsPerPage
	const endIndex = startIndex + itemsPerPage
	const currentOlympics = filteredOlympics.slice(startIndex, endIndex)

	const handlePageChange = page => {
		setCurrentPage(page)
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
				<h1 className='text-3xl font-bold text-gray-900 dark:text-white'>
					{currentView === 'olympics' ? 'Olimpiadalar' : "Bo'linish belgilari"}
				</h1>
				<div className='flex items-center space-x-4'>
					{currentView === 'sections' && (
						<button
							onClick={() => setCurrentView('olympics')}
							className='px-4 py-2 text-blue-600 hover:text-blue-800 font-medium'
						>
							← Olimpiadalar
						</button>
					)}
				</div>
			</div>

			{/* Alert Banner for Sections */}
			{currentView === 'sections' && (
				<div className='bg-red-50 border border-red-200 rounded-lg p-4 flex items-center space-x-3'>
					<div className='w-5 h-5 bg-red-500 rounded-full flex items-center justify-center'>
						<span className='text-white text-xs font-bold'>i</span>
					</div>
					<p className='text-red-700 font-medium'>
						Shartlar: kamida 1 ta fan/mavzu/qism va kamida 5 ta test
					</p>
				</div>
			)}

			{/* Search and Filter */}
			{currentView === 'olympics' && (
				<OlympicsSearch
					searchTerm={searchTerm}
					setSearchTerm={setSearchTerm}
					onCreateNew={() => setIsCreateModalOpen(true)}
				/>
			)}

			{/* Add Section Button */}
			{currentView === 'sections' && (
				<div className='flex justify-end'>
					<button
						onClick={() => setIsSectionModalOpen(true)}
						className='px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center space-x-2'
					>
						<span>+</span>
						<span>fan/mavzu/qism</span>
					</button>
				</div>
			)}

			{/* Olympics Table */}
			{currentView === 'olympics' && (
				<DataTable
					columns={olympicsColumns}
					data={currentOlympics}
					loading={loading}
				/>
			)}

			{/* Sections Table */}
			{currentView === 'sections' && (
				<DataTable
					columns={sectionsColumns}
					data={[]} // Empty for now, can be populated later
					loading={false}
				/>
			)}

			{/* Pagination */}
			<Pagination
				currentPage={currentPage}
				totalPages={totalPages}
				totalItems={filteredOlympics.length}
				itemsPerPage={itemsPerPage}
				onPageChange={handlePageChange}
			/>

			{/* Section Modal */}
			<Modal
				isOpen={isSectionModalOpen}
				onClose={() => setIsSectionModalOpen(false)}
				title="Fan/mavzu/qism qo'shish"
				size='md'
			>
				<Form
					fields={sectionFormFields}
					onSubmit={handleSectionCreate}
					onCancel={() => setIsSectionModalOpen(false)}
					submitText="Qo'shish"
					cancelText='Ortga'
					submitButtonColor='green'
					cancelButtonColor='blue-outline'
				/>
			</Modal>

			{/* Create Modal */}
			<Modal
				isOpen={isCreateModalOpen}
				onClose={() => setIsCreateModalOpen(false)}
				title='Olimpiada yaratish'
				size='md'
			>
				<Form
					fields={olympicFormFields}
					onSubmit={handleCreate}
					onCancel={() => setIsCreateModalOpen(false)}
					submitText='Yaratish'
					cancelText='Ortga'
					submitButtonColor='green'
					cancelButtonColor='blue-outline'
				/>
			</Modal>

			{/* Edit Modal */}
			<Modal
				isOpen={isEditModalOpen}
				onClose={() => setIsEditModalOpen(false)}
				title='Olimpiadani Tahrirlash'
				size='lg'
			>
				<Form
					fields={[
						{
							name: 'contextName',
							type: 'text',
							label: 'Olimpiada Nomi',
							value: formData.contextName,
							onChange: e =>
								setFormData({ ...formData, contextName: e.target.value }),
							required: true,
						},
						{
							name: 'date',
							type: 'date',
							label: 'Yaratilgan vaqti',
							value: formData.date,
							onChange: e => setFormData({ ...formData, date: e.target.value }),
							required: true,
						},
						{
							name: 'sectionsCount',
							type: 'number',
							label: 'Qismlar soni',
							value: formData.sectionsCount,
							onChange: e =>
								setFormData({ ...formData, sectionsCount: e.target.value }),
							placeholder: '0',
							min: 0,
							required: true,
						},
						{
							name: 'testsCount',
							type: 'number',
							label: 'Testlar soni',
							value: formData.testsCount,
							onChange: e =>
								setFormData({ ...formData, testsCount: e.target.value }),
							placeholder: '0',
							min: 0,
							required: true,
						},
					]}
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

export default Olympics
