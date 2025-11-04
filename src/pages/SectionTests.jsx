import { Edit2, PlusCircle, Trash2 } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import DataTable from '../components/common/DataTable'
import TestForm from '../components/forms/TestForm'

const SectionTests = () => {
	const navigate = useNavigate()
	const { olympicId, sectionId } = useParams()
	const [tests, setTests] = useState([])
	const [loading, setLoading] = useState(true)
	const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
	const [isEditModalOpen, setIsEditModalOpen] = useState(false)
	const [selectedTest, setSelectedTest] = useState(null)
	const [sectionName, setSectionName] = useState('')
	const [olympicName, setOlympicName] = useState('')

	// Storage key for this specific section
	const storageKey = `section_tests_${olympicId}_${sectionId}`

	// Table column definitions
	const testsColumns = [
		{
			key: 'index',
			title: '№',
			width: '60px',
			render: (item, index) => index + 1,
		},
		{
			key: 'question',
			title: 'Savol',
			render: item => (
				<div
					className='max-w-xs truncate'
					dangerouslySetInnerHTML={{ __html: item.question || 'Savol matni' }}
				/>
			),
		},
		{
			key: 'createdAt',
			title: 'Yaratilgan',
			render: item => item.createdAt || new Date().toLocaleDateString('uz-UZ'),
		},
		{
			key: 'ball',
			title: 'Ball',
			render: item => `${item.ball || 0} ball`,
		},
		{
			key: 'type',
			title: 'Tip',
			render: item => {
				const typeMap = {
					'test-4': 'Test 4 balli',
					'test-5': 'Test 5 balli',
					'test-open': 'Ochiq savol',
				}
				return typeMap[item.type] || item.type
			},
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

	useEffect(() => {
		loadTests()
	}, [sectionId])

	const loadTests = async () => {
		try {
			// Load from localStorage
			const savedTests = localStorage.getItem(storageKey)
			if (savedTests) {
				setTests(JSON.parse(savedTests))
			} else {
				// Mock data for demo
				setTests([])
			}

			// Mock section and olympic names - replace with actual API call
			setOlympicName('Matematika Olimpiadasi')
			setSectionName('Matematika')
		} catch (error) {
			console.error('Error loading tests:', error)
		} finally {
			setLoading(false)
		}
	}

	const saveTestsToStorage = updatedTests => {
		localStorage.setItem(storageKey, JSON.stringify(updatedTests))
	}

	const handleCreate = newTest => {
		const testWithId = {
			id: Date.now(),
			...newTest,
			createdAt: new Date().toLocaleDateString('uz-UZ'),
		}
		const updatedTests = [...tests, testWithId]
		setTests(updatedTests)
		saveTestsToStorage(updatedTests)
		setIsCreateModalOpen(false)
	}

	const handleUpdate = updatedTest => {
		const updatedTests = tests.map(t =>
			t.id === selectedTest.id ? { ...t, ...updatedTest } : t
		)
		setTests(updatedTests)
		saveTestsToStorage(updatedTests)
		setIsEditModalOpen(false)
		setSelectedTest(null)
	}

	const handleDelete = async id => {
		if (!confirm("Bu testni o'chirishni xohlaysizmi?")) return

		try {
			const updatedTests = tests.filter(t => t.id !== id)
			setTests(updatedTests)
			saveTestsToStorage(updatedTests)
		} catch (error) {
			console.error('Error deleting test:', error)
		}
	}

	const openEditModal = test => {
		setSelectedTest(test)
		setIsEditModalOpen(true)
	}

	const renderTestPreview = test => {
		return (
			<div className='space-y-3'>
				<div
					className='text-gray-900 dark:text-gray-100 font-medium'
					dangerouslySetInnerHTML={{ __html: test.question }}
				/>
				{test.answers && test.answers.length > 0 && (
					<div className='space-y-2'>
						{test.answers.map((answer, index) => (
							<div
								key={index}
								className={`text-sm p-2 rounded ${
									test.correctAnswer === index
										? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800'
										: 'bg-gray-50 dark:bg-gray-800'
								}`}
							>
								<span className='font-medium mr-2'>
									{String.fromCharCode(65 + index)}.
								</span>
								<span
									dangerouslySetInnerHTML={{ __html: answer || 'Javob matni' }}
								/>
								{test.correctAnswer === index && (
									<span className='ml-2 text-xs text-green-600 dark:text-green-400 font-medium'>
										✓ To'g'ri
									</span>
								)}
							</div>
						))}
					</div>
				)}
				<div className='flex justify-between text-xs text-gray-500 dark:text-gray-400'>
					<span>Ball: {test.ball}</span>
					<span>Yaratilgan: {test.createdAt}</span>
				</div>
			</div>
		)
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
						onClick={() => navigate(`/olympics/${olympicId}/sections`)}
						className='text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 mb-2 flex items-center space-x-1'
					>
						<span>←</span>
						<span>Fanlar/qismlar</span>
					</button>
					<h1 className='text-3xl font-bold text-gray-900 dark:text-white'>
						{olympicName} - {sectionName}
					</h1>
					<p className='text-gray-600 dark:text-gray-400 mt-1'>
						Fan/qism nomi: {sectionName} || {tests.length} test
					</p>
				</div>
				<button
					onClick={() => setIsCreateModalOpen(true)}
					className='px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center space-x-2 transition-colors'
				>
					<PlusCircle className='w-5 h-5' />
					<span>Test qo'shish</span>
				</button>
			</div>

			{/* Tests Table */}
			<DataTable columns={testsColumns} data={tests} loading={loading} />

			{/* Test Preview Section */}
			{tests.length > 0 && (
				<div className='mt-8'>
					<h3 className='text-lg font-semibold text-gray-900 dark:text-white mb-4'>
						Testlar ko'rinishi
					</h3>
					<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
						{tests.map((test, index) => (
							<div
								key={test.id}
								className='border rounded-lg p-4 bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition-shadow'
							>
								<div className='flex justify-between items-start mb-2'>
									<span className='text-sm font-medium text-blue-600 dark:text-blue-400'>
										Test {index + 1}
									</span>
									<div className='flex space-x-2'>
										<button
											onClick={() => openEditModal(test)}
											className='p-1 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300'
											title='Tahrirlash'
										>
											<Edit2 className='h-4 w-4' />
										</button>
										<button
											onClick={() => handleDelete(test.id)}
											className='p-1 text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300'
											title="O'chirish"
										>
											<Trash2 className='h-4 w-4' />
										</button>
									</div>
								</div>
								{renderTestPreview(test)}
							</div>
						))}
					</div>
				</div>
			)}

			{tests.length === 0 && (
				<div className='text-center py-12 bg-gray-50 dark:bg-gray-800 rounded-lg'>
					<p className='text-gray-500 dark:text-gray-400 text-lg'>
						Hozircha testlar yo'q
					</p>
					<p className='text-gray-400 dark:text-gray-500 text-sm mt-2'>
						Yangi test qo'shish uchun yuqoridagi tugmani bosing
					</p>
				</div>
			)}

			{/* Create Modal */}
			{isCreateModalOpen && (
				<div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4'>
					<div className='bg-white dark:bg-gray-900 w-full max-w-4xl rounded-xl shadow-2xl max-h-[90vh] overflow-hidden flex flex-col'>
						<div className='flex justify-between items-center border-b dark:border-gray-700 p-4'>
							<h2 className='text-xl font-semibold text-gray-900 dark:text-gray-100'>
								Yangi test qo'shish
							</h2>
							<button
								onClick={() => setIsCreateModalOpen(false)}
								className='text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 text-2xl w-8 h-8 flex items-center justify-center rounded hover:bg-gray-100 dark:hover:bg-gray-800'
							>
								×
							</button>
						</div>
						<div className='overflow-y-auto flex-1'>
							<TestForm
								onSave={handleCreate}
								onCancel={() => setIsCreateModalOpen(false)}
							/>
						</div>
					</div>
				</div>
			)}

			{/* Edit Modal */}
			{isEditModalOpen && selectedTest && (
				<div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4'>
					<div className='bg-white dark:bg-gray-900 w-full max-w-4xl rounded-xl shadow-2xl max-h-[90vh] overflow-hidden flex flex-col'>
						<div className='flex justify-between items-center border-b dark:border-gray-700 p-4'>
							<h2 className='text-xl font-semibold text-gray-900 dark:text-gray-100'>
								Testni tahrirlash
							</h2>
							<button
								onClick={() => {
									setIsEditModalOpen(false)
									setSelectedTest(null)
								}}
								className='text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 text-2xl w-8 h-8 flex items-center justify-center rounded hover:bg-gray-100 dark:hover:bg-gray-800'
							>
								×
							</button>
						</div>
						<div className='overflow-y-auto flex-1'>
							<TestForm
								onSave={handleUpdate}
								onCancel={() => {
									setIsEditModalOpen(false)
									setSelectedTest(null)
								}}
								initialData={selectedTest}
							/>
						</div>
					</div>
				</div>
			)}
		</div>
	)
}

export default SectionTests
