import katex from 'katex'
import 'katex/dist/katex.min.css'
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'
import { insertFormulaIntoQuill } from '../utils/katexRenderer'
import FormulaModal from './FormulaModal'

const toolbarOptions = [
	[{ header: [1, 2, 3, false] }],
	['bold', 'italic', 'underline'],
	[{ color: [] }, { background: [] }],
	[{ align: [] }],
	['link', 'image'],
]

const makeModules = (onOpenFormula, imageHandler) => ({
	toolbar: {
		container: [...toolbarOptions, [{ formula: 'formula' }]],
		handlers: {
			image: imageHandler,
			formula: onOpenFormula,
		},
	},
})

const labels = ['A', 'B', 'C', 'D']

const TestForm = ({ initial, onCancel, onSave, disabled }) => {
	// Ensure Quill formula module finds KaTeX on window
	if (typeof window !== 'undefined' && !window.katex) {
		window.katex = katex
	}
	const [question, setQuestion] = useState(initial?.questionHtml || '')
	const [answers, setAnswers] = useState(() =>
		labels.map((l, i) => ({
			id: l,
			label: l,
			html: initial?.answers?.[i]?.html || '',
			points: initial?.answers?.[i]?.points || 0,
		}))
	)
	const [openFormulaFor, setOpenFormulaFor] = useState(null) // 'question' | 'A'|'B'|'C'|'D'

	const questionRef = useRef(null)
	const answerRefs = useRef({})

	const handleImageUpload = useCallback(() => {
		const input = document.createElement('input')
		input.type = 'file'
		input.accept = 'image/*'
		input.onchange = () => {
			const file = input.files?.[0]
			if (!file) return
			const url = URL.createObjectURL(file) // mock uploader
			const quill = window.__active_quill
			if (quill) {
				const range = quill.getSelection(true)
				quill.insertEmbed(range.index, 'image', url, 'user')
			}
		}
		input.click()
	}, [])

	const modulesQuestion = useMemo(
		() => makeModules(() => setOpenFormulaFor('question'), handleImageUpload),
		[handleImageUpload]
	)
	const modulesAnswer = useMemo(
		() => makeModules(() => {}, handleImageUpload),
		[handleImageUpload]
	)

	const bindActive = quill => {
		window.__active_quill = quill
	}

	const handleInsertFormula = useCallback(
		latex => {
			if (openFormulaFor === 'question') {
				const quill = questionRef.current
				if (quill) insertFormulaIntoQuill(quill.getEditor(), latex)
			} else if (openFormulaFor) {
				const q = answerRefs.current[openFormulaFor]
				if (q) insertFormulaIntoQuill(q.getEditor(), latex)
			}
			setOpenFormulaFor(null)
		},
		[openFormulaFor]
	)

	const validate = () => {
		const hasPoints = answers.some(a => Number(a.points) > 0)
		return hasPoints && question.trim().length > 0
	}

	const submit = e => {
		e.preventDefault()
		if (!validate()) return
		onSave({ questionHtml: question, answers })
	}

	useEffect(
		() => () => {
			if (window.__active_quill) delete window.__active_quill
		},
		[]
	)

	return (
		<form onSubmit={submit} className='space-y-4'>
			<div>
				<label className='mb-1 block text-sm font-medium'>Savol</label>
				<ReactQuill
					ref={questionRef}
					value={question}
					onChange={setQuestion}
					modules={modulesQuestion}
					onFocus={bindActive}
					theme='snow'
				/>
				<div className='mt-2'>
					<button
						type='button'
						onClick={() => setOpenFormulaFor('question')}
						className='rounded-md bg-emerald-600 px-3 py-1.5 text-sm text-white hover:bg-emerald-700'
					>
						Formula
					</button>
				</div>
			</div>

			<div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
				{answers.map(a => (
					<div
						key={a.id}
						className='rounded-lg border border-gray-200 p-3 shadow-sm'
					>
						<div className='mb-1 flex items-center justify-between'>
							<span className='text-sm font-semibold'>Javob {a.label}</span>
							<div className='flex items-center gap-2'>
								<span className='text-xs text-gray-500'>Points</span>
								<input
									type='number'
									className='w-20 rounded-md border border-gray-300 px-2 py-1 text-sm'
									value={a.points}
									onChange={e =>
										setAnswers(prev =>
											prev.map(it =>
												it.id === a.id
													? { ...it, points: Number(e.target.value) }
													: it
											)
										)
									}
									min={0}
								/>
							</div>
						</div>
						<ReactQuill
							ref={el => (answerRefs.current[a.id] = el)}
							value={a.html}
							onChange={val =>
								setAnswers(prev =>
									prev.map(it => (it.id === a.id ? { ...it, html: val } : it))
								)
							}
							modules={modulesAnswer}
							onFocus={bindActive}
							theme='snow'
						/>
						<div className='mt-2'>
							<button
								type='button'
								onClick={() => setOpenFormulaFor(a.id)}
								className='rounded-md bg-emerald-600 px-3 py-1.5 text-sm text-white hover:bg-emerald-700'
							>
								Formula
							</button>
						</div>
					</div>
				))}
			</div>

			<div className='flex justify-end gap-2'>
				<button
					type='button'
					onClick={onCancel}
					className='rounded-md px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-800'
				>
					Bekor qilish
				</button>
				<button
					disabled={disabled}
					type='submit'
					className='rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60'
				>
					Saqlash
				</button>
			</div>

			<FormulaModal
				open={Boolean(openFormulaFor)}
				onClose={() => setOpenFormulaFor(null)}
				onSave={handleInsertFormula}
			/>
		</form>
	)
}

export default TestForm
