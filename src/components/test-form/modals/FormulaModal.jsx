import { AnimatePresence, motion } from 'framer-motion'
import katex from 'katex'
import 'katex/dist/katex.min.css'
import { Check, X } from 'lucide-react'
import React, { useEffect, useRef, useState } from 'react'

const FormulaModal = ({ isOpen, onClose, onInsert }) => {
	const [input, setInput] = useState('')
	const previewRef = useRef(null)
	const [error, setError] = useState(null)

	// === Render KaTeX preview live ===
	useEffect(() => {
		if (!isOpen) return
		if (!previewRef.current) return

		try {
			katex.render(input || '', previewRef.current, {
				throwOnError: false,
				displayMode: true,
			})
			setError(null)
		} catch (err) {
			setError(err.message)
		}
	}, [input, isOpen])

	// === Insert formula into editor ===
	const handleInsert = () => {
		if (!input.trim()) return
		onInsert(input)
		setInput('')
		onClose()
	}

	return (
		<AnimatePresence>
			{isOpen && (
				<motion.div
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					exit={{ opacity: 0 }}
					className='fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50'
					onClick={onClose}
				>
					<motion.div
						initial={{ scale: 0.9, opacity: 0 }}
						animate={{ scale: 1, opacity: 1 }}
						exit={{ scale: 0.9, opacity: 0 }}
						onClick={e => e.stopPropagation()}
						className='bg-white dark:bg-gray-900 rounded-2xl p-6 w-full max-w-md shadow-2xl'
					>
						<div className='flex justify-between items-center mb-4'>
							<h2 className='text-lg font-semibold text-gray-800 dark:text-gray-100'>
								Insert Formula
							</h2>
							<button
								onClick={onClose}
								className='text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'
							>
								<X size={20} />
							</button>
						</div>

						{/* Input */}
						<textarea
							className='w-full border border-gray-300 dark:border-gray-700 rounded-lg p-3 mb-3 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500'
							rows='3'
							placeholder='Write LaTeX here, e.g. \frac{a}{b}'
							value={input}
							onChange={e => setInput(e.target.value)}
						/>

						{/* Preview */}
						<div className='border border-gray-300 dark:border-gray-700 rounded-lg p-3 bg-gray-50 dark:bg-gray-800 min-h-[80px] flex items-center justify-center mb-3'>
							<div ref={previewRef} className='text-center text-lg' />
						</div>
						{error && (
							<p className='text-red-500 text-sm text-center mb-2'>
								Invalid formula
							</p>
						)}

						{/* Buttons */}
						<div className='flex justify-end gap-2'>
							<button
								onClick={onClose}
								className='px-4 py-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-800 transition'
							>
								Cancel
							</button>
							<button
								onClick={handleInsert}
								className='flex items-center gap-1 px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition'
							>
								<Check size={16} /> Insert
							</button>
						</div>
					</motion.div>
				</motion.div>
			)}
		</AnimatePresence>
	)
}

export default FormulaModal
