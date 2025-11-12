import { motion } from 'framer-motion'
import katex from 'katex'
import 'katex/dist/katex.min.css'
import React, { useEffect, useRef } from 'react'

const SafeHtml = ({ html }) => {
	const ref = useRef(null)
	useEffect(() => {
		if (!ref.current) return
		ref.current.innerHTML = html || ''
		// Render any Quill formula spans using KaTeX
		const nodes = ref.current.querySelectorAll('span.ql-formula')
		nodes.forEach(node => {
			const tex = node.getAttribute('data-value') || node.textContent || ''
			try {
				node.innerHTML = katex.renderToString(tex, { throwOnError: false })
			} catch {}
		})
	}, [html])
	return <div ref={ref} className='prose max-w-none' />
}

const TestCard = ({ test, onEdit, onDelete }) => {
	return (
		<motion.div
			layout
			initial={{ opacity: 0, y: 8 }}
			animate={{ opacity: 1, y: 0 }}
			exit={{ opacity: 0, y: -8 }}
			className='rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-900'
		>
			<div className='mb-3 text-sm font-semibold text-gray-700 dark:text-gray-200'>
				Savol
			</div>
			<SafeHtml html={test.questionHtml} />
			<div className='mt-4 grid grid-cols-1 gap-3 md:grid-cols-2'>
				{test.answers.map(ans => (
					<div
						key={ans.id}
						className='rounded-lg border border-gray-200 p-3 dark:border-gray-700'
					>
						<div className='mb-1 flex items-center justify-between'>
							<span className='text-sm font-medium'>Javob {ans.label}</span>
							<span className='rounded bg-gray-100 px-2 py-0.5 text-xs dark:bg-gray-800'>
								{ans.points} ball
							</span>
						</div>
						<SafeHtml html={ans.html} />
					</div>
				))}
			</div>
			<div className='mt-4 flex justify-end gap-2'>
				<button
					onClick={() => onEdit?.(test)}
					className='rounded-md px-3 py-1.5 text-sm hover:bg-gray-100 dark:hover:bg-gray-800'
				>
					Tahrirlash
				</button>
				<button
					onClick={() => onDelete?.(test)}
					className='rounded-md bg-red-600 px-3 py-1.5 text-sm text-white hover:bg-red-700'
				>
					O‘chirish
				</button>
			</div>
		</motion.div>
	)
}

export default TestCard
