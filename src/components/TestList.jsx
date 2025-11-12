import { AnimatePresence } from 'framer-motion'
import React from 'react'
import TestCard from './TestCard'

const TestList = ({ tests, onEdit, onDelete }) => {
	if (!tests?.length) {
		return (
			<div className='rounded-xl border border-dashed border-gray-300 p-6 text-center text-gray-500 dark:border-gray-700'>
				Hozircha testlar yo‘q. “Test qo‘shish” tugmasidan foydalaning.
			</div>
		)
	}
	return (
		<div className='grid grid-cols-1 gap-4'>
			<AnimatePresence initial={false}>
				{tests.map(t => (
					<TestCard key={t.id} test={t} onEdit={onEdit} onDelete={onDelete} />
				))}
			</AnimatePresence>
		</div>
	)
}

export default TestList
