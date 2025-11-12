import { AnimatePresence, motion } from 'framer-motion'
import 'katex/dist/katex.min.css'
import React, { useMemo, useState } from 'react'
import { useLocation } from 'react-router-dom'
import TestForm from '../components/TestForm'
import TestList from '../components/TestList'
import { TestProvider, useTests } from '../context/TestContext'

const Header = ({ subjectName, count }) => (
	<div className='flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between'>
		<h1 className='text-lg font-semibold'>
			Fan/qism nomi: {subjectName} || {count} test
		</h1>
	</div>
)

const ConfirmModal = ({ open, onClose, onConfirm }) => (
	<AnimatePresence>
		{open && (
			<motion.div
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				exit={{ opacity: 0 }}
				className='fixed inset-0 z-50 flex items-center justify-center bg-black/50'
				onClick={onClose}
			>
				<motion.div
					initial={{ scale: 0.95, opacity: 0 }}
					animate={{ scale: 1, opacity: 1 }}
					exit={{ scale: 0.95, opacity: 0 }}
					onClick={e => e.stopPropagation()}
					className='w-full max-w-sm rounded-xl bg-white p-5 shadow-lg dark:bg-gray-900'
				>
					<div className='text-base'>Ushbu testni o‘chirmoqchimisiz?</div>
					<div className='mt-4 flex justify-end gap-2'>
						<button
							onClick={onClose}
							className='rounded-md px-3 py-1.5 hover:bg-gray-100 dark:hover:bg-gray-800'
						>
							Bekor qilish
						</button>
						<button
							onClick={onConfirm}
							className='rounded-md bg-red-600 px-3 py-1.5 text-white hover:bg-red-700'
						>
							O‘chirish
						</button>
					</div>
				</motion.div>
			</motion.div>
		)}
	</AnimatePresence>
)

const TestPageInner = ({ subjectName, maxTests }) => {
	const { getSubjectId, getTests, addTest, updateTest, deleteTest, version } =
		useTests()
	const subjectId = useMemo(
		() => getSubjectId(subjectName),
		[getSubjectId, subjectName]
	)
	const tests = getTests(subjectId)
	const [editing, setEditing] = useState(null)
	const [confirm, setConfirm] = useState(null)

	const canAdd = tests.length < maxTests

	const onCreate = data => {
		addTest(subjectId, data)
		setEditing(null)
	}

	const onUpdate = data => {
		updateTest(subjectId, editing.id, data)
		setEditing(null)
	}

	const onDelete = () => {
		if (!confirm) return
		deleteTest(subjectId, confirm.id)
		setConfirm(null)
	}

	return (
		<div className='mx-auto max-w-5xl space-y-4 p-4'>
			<Header subjectName={subjectName} count={tests.length} />

			<div className='flex items-center justify-between'>
				<div />
				<button
					onClick={() => setEditing({ mode: 'create' })}
					disabled={!canAdd}
					className='rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60'
				>
					Test qo‘shish
				</button>
			</div>

			{!canAdd && (
				<div className='rounded-md border border-amber-300 bg-amber-50 p-3 text-amber-800'>
					Maximum number of tests reached
				</div>
			)}

			<TestList
				key={version}
				tests={tests}
				onEdit={t => setEditing({ mode: 'edit', ...t })}
				onDelete={t => setConfirm(t)}
			/>

			<AnimatePresence>
				{editing && (
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						className='fixed inset-0 z-50 flex items-center justify-center bg-black/50'
						onClick={() => setEditing(null)}
					>
						<motion.div
							initial={{ scale: 0.95, opacity: 0 }}
							animate={{ scale: 1, opacity: 1 }}
							exit={{ scale: 0.95, opacity: 0 }}
							onClick={e => e.stopPropagation()}
							className='w-full max-w-4xl rounded-2xl bg-white p-6 shadow-xl dark:bg-gray-900'
						>
							<div className='mb-4 text-lg font-semibold'>
								{editing.mode === 'create' ? 'Yangi test' : 'Testni tahrirlash'}
							</div>
							<TestForm
								initial={editing.mode === 'edit' ? editing : undefined}
								onCancel={() => setEditing(null)}
								onSave={editing.mode === 'create' ? onCreate : onUpdate}
								disabled={false}
							/>
						</motion.div>
					</motion.div>
				)}
			</AnimatePresence>

			<ConfirmModal
				open={Boolean(confirm)}
				onClose={() => setConfirm(null)}
				onConfirm={onDelete}
			/>
		</div>
	)
}

const TestPage = props => {
	const location = useLocation()
	const subjectName = props.subjectName || location.state?.subjectName || 'Fan'
	const maxTests = Number(props.maxTests ?? location.state?.maxTests ?? 20)
	return (
		<TestProvider>
			<TestPageInner subjectName={subjectName} maxTests={maxTests} />
		</TestProvider>
	)
}

export default TestPage
