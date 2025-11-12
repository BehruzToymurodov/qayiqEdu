import React, {
	createContext,
	useCallback,
	useContext,
	useMemo,
	useRef,
	useState,
} from 'react'

// Test data shape
// {
//   id: string,
//   subjectId: string,
//   questionHtml: string, // Quill HTML
//   answers: Array<{ id: string; label: 'A'|'B'|'C'|'D'; html: string; points: number }>,
//   createdAt: number
// }

const TestContext = createContext(null)

export const TestProvider = ({ children }) => {
	// Simple in-memory store keyed by subjectId
	const storeRef = useRef(new Map())
	const [version, setVersion] = useState(0) // trigger re-render on updates

	const getSubjectId = useCallback(subjectName => {
		if (!subjectName) return 'default'
		return String(subjectName).trim().toLowerCase().replace(/\s+/g, '-')
	}, [])

	const getTests = useCallback(subjectId => {
		const key = subjectId || 'default'
		return storeRef.current.get(key) || []
	}, [])

	const addTest = useCallback((subjectId, test) => {
		const key = subjectId || 'default'
		const current = storeRef.current.get(key) || []
		const newTest = {
			...test,
			id: crypto.randomUUID(),
			subjectId: key,
			createdAt: Date.now(),
		}
		storeRef.current.set(key, [...current, newTest])
		setVersion(v => v + 1)
		return newTest
	}, [])

	const updateTest = useCallback((subjectId, id, next) => {
		const key = subjectId || 'default'
		const current = storeRef.current.get(key) || []
		const updated = current.map(t => (t.id === id ? { ...t, ...next } : t))
		storeRef.current.set(key, updated)
		setVersion(v => v + 1)
	}, [])

	const deleteTest = useCallback((subjectId, id) => {
		const key = subjectId || 'default'
		const current = storeRef.current.get(key) || []
		const filtered = current.filter(t => t.id !== id)
		storeRef.current.set(key, filtered)
		setVersion(v => v + 1)
	}, [])

	const value = useMemo(
		() => ({
			getSubjectId,
			getTests,
			addTest,
			updateTest,
			deleteTest,
			version,
		}),
		[addTest, deleteTest, getSubjectId, getTests, updateTest, version]
	)

	return <TestContext.Provider value={value}>{children}</TestContext.Provider>
}

export const useTests = () => {
	const ctx = useContext(TestContext)
	if (!ctx) throw new Error('useTests must be used within TestProvider')
	return ctx
}

// TODO: Replace in-memory Map with real API calls.
// addTest/updateTest/deleteTest/getTests should call backend services and handle errors.
