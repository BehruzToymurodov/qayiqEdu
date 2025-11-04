import React, { useEffect, useRef, useState } from 'react'
import QuillEditor from '../test-form/editor/QuillEditor'
import FormulaModal from '../test-form/modals/FormulaModal'

const TestForm = ({ onSave, onCancel, initialData }) => {
	const [ball, setBall] = useState(initialData?.ball || '')
	const [editorType, setEditorType] = useState(
		initialData?.editorType || 'quill'
	)
	const [correctAnswer, setCorrectAnswer] = useState(
		initialData?.correctAnswer || 0
	)
	const [isFormulaModalOpen, setIsFormulaModalOpen] = useState(false)
	const [activeEditorId, setActiveEditorId] = useState(null)

	// Editor contents stored to prevent remounting resets
	const [editorContents, setEditorContents] = useState({
		question: '',
		answer0: '',
		answer1: '',
		answer2: '',
		answer3: '',
	})

	const quillRefs = useRef({})
	const isInitialized = useRef(false)

	// ✅ Initialize editors once with initial data
	useEffect(() => {
		if (initialData && !isInitialized.current) {
			isInitialized.current = true
			setEditorContents(prev => ({
				...prev,
				question: initialData.question || '',
				answer0: initialData.answers?.[0] || '',
				answer1: initialData.answers?.[1] || '',
				answer2: initialData.answers?.[2] || '',
				answer3: initialData.answers?.[3] || '',
			}))
		}
	}, [initialData])

	// ✅ Open modal safely (no re-render of editors)
	const openFormulaModal = editorId => {
		setActiveEditorId(editorId)
		setIsFormulaModalOpen(true)
	}

	const closeFormulaModal = () => {
		setIsFormulaModalOpen(false)
		setActiveEditorId(null)
	}

	// ✅ Insert LaTeX formula into current Quill editor
	const insertFormulaToEditor = formula => {
		const editorRef = quillRefs.current[activeEditorId]
		if (editorRef?.insertFormula) {
			editorRef.insertFormula(formula)

			// Update content in state after Quill updates DOM
			setTimeout(() => {
				const html = editorRef.getEditor()?.root?.innerHTML || ''
				setEditorContents(prev => ({ ...prev, [activeEditorId]: html }))
			}, 80)
		}
		closeFormulaModal()
	}

	const handleEditorChange = (editorId, content) => {
		setEditorContents(prev => ({ ...prev, [editorId]: content }))
	}

	const handleSave = () => {
		const question =
			quillRefs.current['question']?.getEditor()?.root?.innerHTML || ''
		const answers = Array.from(
			{ length: 4 },
			(_, i) =>
				quillRefs.current[`answer${i}`]?.getEditor()?.root?.innerHTML || ''
		)

		if (!question.trim() || question === '<p><br></p>') {
			alert('Iltimos, savol matnini kiriting!')
			return
		}

		if (answers.some(a => !a.trim() || a === '<p><br></p>')) {
			alert("Iltimos, barcha javob variantlarini to'ldiring!")
			return
		}

		if (!ball || parseInt(ball) <= 0) {
			alert("Iltimos, to'g'ri ball kiriting!")
			return
		}

		onSave({
			question,
			answers,
			ball: parseInt(ball),
			editorType,
			correctAnswer,
		})
	}

	return (
		<div className='space-y-6 p-6'>
			{/* Question */}
			<div>
				<label className='block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2'>
					Savol matni
				</label>
				<div className='border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900'>
					<QuillEditor
						id='question'
						ref={el => (quillRefs.current['question'] = el)}
						value={editorContents.question}
						onChange={content => handleEditorChange('question', content)}
						onFormulaClick={() => openFormulaModal('question')}
						minHeight='150px'
					/>
				</div>
			</div>

			{/* Answers */}
			<div>
				<label className='block text-sm font-medium text-gray-700 dark:text-gray-200 mb-3'>
					Javob variantlari
				</label>
				<div className='space-y-4'>
					{[0, 1, 2, 3].map(i => (
						<div key={i} className='flex items-start gap-3'>
							<div className='pt-3'>
								<input
									type='radio'
									name='correctAnswer'
									checked={correctAnswer === i}
									onChange={() => setCorrectAnswer(i)}
									className='w-5 h-5 text-green-600 cursor-pointer focus:ring-green-500'
									title="To'g'ri javob"
								/>
							</div>
							<div className='flex-1'>
								<label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
									Variant {String.fromCharCode(65 + i)}
								</label>
								<div className='border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900'>
									<QuillEditor
										id={`answer${i}`}
										ref={el => (quillRefs.current[`answer${i}`] = el)}
										value={editorContents[`answer${i}`]}
										onChange={content =>
											handleEditorChange(`answer${i}`, content)
										}
										onFormulaClick={() => openFormulaModal(`answer${i}`)}
										minHeight='120px'
									/>
								</div>
							</div>
						</div>
					))}
				</div>
			</div>

			{/* Ball + Type */}
			<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
				<div>
					<label className='block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2'>
						Ball
					</label>
					<input
						type='number'
						value={ball}
						onChange={e => setBall(e.target.value)}
						min='1'
						className='w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 dark:bg-gray-800 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none'
						placeholder='Masalan: 4'
					/>
				</div>

				<div>
					<label className='block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2'>
						Muharrir turi
					</label>
					<select
						value={editorType}
						onChange={e => setEditorType(e.target.value)}
						className='w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 dark:bg-gray-800 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none cursor-pointer'
					>
						<option value='quill'>QUILL</option>
						<option value='latex'>LATEX</option>
					</select>
				</div>
			</div>

			{/* Correct Answer */}
			<div className='flex items-center gap-2 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg'>
				<svg
					className='w-5 h-5 text-green-600 dark:text-green-400'
					fill='none'
					stroke='currentColor'
					viewBox='0 0 24 24'
				>
					<path
						strokeLinecap='round'
						strokeLinejoin='round'
						strokeWidth={2}
						d='M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z'
					/>
				</svg>
				<span className='text-sm text-green-700 dark:text-green-300'>
					To'g'ri javob:{' '}
					<strong>Variant {String.fromCharCode(65 + correctAnswer)}</strong>
				</span>
			</div>

			{/* Buttons */}
			<div className='flex justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700'>
				<button
					type='button'
					onClick={onCancel}
					className='px-6 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors font-medium'
				>
					Bekor qilish
				</button>
				<button
					type='button'
					onClick={handleSave}
					className='px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors font-medium shadow-sm'
				>
					Saqlash
				</button>
			</div>

			{/* Formula Modal */}
			{isFormulaModalOpen && (
				<FormulaModal
					isOpen={isFormulaModalOpen}
					onClose={closeFormulaModal}
					onSave={insertFormulaToEditor}
				/>
			)}
		</div>
	)
}

export default TestForm
