import { AnimatePresence, motion } from 'framer-motion'
import katex from 'katex'
import 'katex/dist/katex.min.css'
import React, { useEffect, useRef, useState } from 'react'

const FormulaModal = ({ open, onClose, onSave }) => {
	const [latex, setLatex] = useState('')
	const [error, setError] = useState(null)
	const previewRef = useRef(null)

	useEffect(() => {
		if (!open) return
		if (!previewRef.current) return
		try {
			katex.render(latex || '', previewRef.current, {
				throwOnError: false,
				displayMode: true,
			})
			setError(null)
		} catch (e) {
			setError(e.message)
		}
	}, [latex, open])

	useEffect(() => {
		if (!open) return
		const onKey = e => {
			if (e.key === 'Escape') onClose?.()
		}
		document.addEventListener('keydown', onKey)
		return () => document.removeEventListener('keydown', onKey)
	}, [open, onClose])

	const handleSave = () => {
		if (!latex.trim()) return
		onSave?.(latex)
		setLatex('')
		onClose?.()
	}

	return (
		<AnimatePresence>
			{open && (
				<motion.div
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					exit={{ opacity: 0 }}
					className='fixed inset-0 z-50 flex items-center justify-center bg-black/50'
					aria-modal='true'
					role='dialog'
					onClick={onClose}
				>
					<motion.div
						initial={{ scale: 0.95, opacity: 0 }}
						animate={{ scale: 1, opacity: 1 }}
						exit={{ scale: 0.95, opacity: 0 }}
						onClick={e => e.stopPropagation()}
						className='w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl dark:bg-gray-900'
					>
						<h2 className='mb-4 text-lg font-semibold text-gray-800 dark:text-gray-100'>
							Add formula
						</h2>
						<textarea
							className='mb-3 w-full rounded-lg border border-gray-300 bg-gray-50 p-3 dark:border-gray-700 dark:bg-gray-800'
							rows={3}
							placeholder='e.g. \\frac{a}{b}'
							value={latex}
							onChange={e => setLatex(e.target.value)}
						/>
						<div className='mb-3 min-h-[80px] rounded-lg border border-gray-300 bg-gray-50 p-3 dark:border-gray-700 dark:bg-gray-800'>
							<div ref={previewRef} className='text-center text-lg' />
						</div>
						{error && (
							<p className='mb-2 text-center text-sm text-red-500'>
								Invalid formula
							</p>
						)}
						<div className='flex justify-end gap-2'>
							<button
								onClick={onClose}
								className='rounded-lg px-4 py-2 text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800'
							>
								Cancel
							</button>
							<button
								onClick={handleSave}
								className='rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700'
							>
								Insert
							</button>
						</div>
					</motion.div>
				</motion.div>
			)}
		</AnimatePresence>
	)
}

export default FormulaModal
