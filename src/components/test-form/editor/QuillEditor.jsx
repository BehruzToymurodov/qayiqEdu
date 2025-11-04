import katex from 'katex'
import 'katex/dist/katex.min.css'
import React, {
	forwardRef,
	useEffect,
	useImperativeHandle,
	useRef,
	useState,
} from 'react'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'

// Ensure KaTeX is globally available for Quill
if (typeof window !== 'undefined') {
	window.katex = katex
}

const QuillEditor = forwardRef(
	({ value, onChange, onFormulaClick, id, minHeight = '150px' }, ref) => {
		const quillRef = useRef(null)
		const [savedRange, setSavedRange] = useState(null)

		// === Expose methods to parent (TestForm) ===
		useImperativeHandle(ref, () => ({
			getEditor: () => quillRef.current?.getEditor(),
			insertFormula: latex => {
				const editor = quillRef.current?.getEditor()
				if (!editor) return

				const range = savedRange || editor.getSelection(true)
				const insertIndex = range ? range.index : editor.getLength()

				// ✅ Insert KaTeX formula block
				editor.insertEmbed(insertIndex, 'formula', latex, 'user')
				editor.setSelection(insertIndex + 1, 0)
				editor.focus()

				// ✅ Let Quill handle KaTeX rendering itself
				// (No manual katex.render — Quill already calls it safely)
			},
		}))

		// === Maintain consistent editor height ===
		useEffect(() => {
			const editor = quillRef.current?.getEditor()
			if (editor?.root) {
				editor.root.style.minHeight = minHeight
			}
		}, [minHeight])

		// === Quill modules (toolbar + handlers) ===
		const modules = {
			toolbar: {
				container: [
					[{ header: [1, 2, 3, false] }],
					['bold', 'italic', 'underline'],
					[{ list: 'ordered' }, { list: 'bullet' }],
					['image', 'formula'],
					['clean'],
				],
				handlers: {
					formula: function () {
						const editor = quillRef.current?.getEditor()
						if (!editor) return

						// ✅ Save selection before opening formula modal
						const range = editor.getSelection(true)
						if (range) {
							setSavedRange(range)
						}

						editor.blur() // prevent Quill reset bug
						if (onFormulaClick) onFormulaClick()
					},
					image: function () {
						const input = document.createElement('input')
						input.type = 'file'
						input.accept = 'image/*'
						input.onchange = () => {
							const file = input.files?.[0]
							if (!file) return

							const reader = new FileReader()
							reader.onload = e => {
								const editor = quillRef.current?.getEditor()
								if (!editor) return

								const range = editor.getSelection(true)
								const insertIndex = range ? range.index : editor.getLength()
								editor.insertEmbed(insertIndex, 'image', e.target.result)
							}
							reader.readAsDataURL(file)
						}
						input.click()
					},
				},
			},
			clipboard: {
				matchVisual: false,
			},
		}

		const formats = [
			'header',
			'bold',
			'italic',
			'underline',
			'list',
			'bullet',
			'image',
			'formula',
		]

		// === Render ===
		return (
			<div className='relative'>
				<ReactQuill
					ref={quillRef}
					theme='snow'
					value={value}
					onChange={onChange}
					modules={modules}
					formats={formats}
					className='bg-white dark:bg-gray-900 rounded-lg'
					id={id}
					style={{ minHeight }}
				/>
			</div>
		)
	}
)

QuillEditor.displayName = 'QuillEditor'
export default QuillEditor
