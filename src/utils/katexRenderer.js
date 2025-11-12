import katex from 'katex'

export function renderLatexToHtml(latex) {
	try {
		return katex.renderToString(latex, {
			throwOnError: false,
			displayMode: false,
		})
	} catch (e) {
		return `<span class="text-red-500">Invalid formula</span>`
	}
}

export function insertFormulaIntoQuill(quill, latex) {
	if (!quill || !latex) return
	const selection = quill.getSelection(true)
	const index = selection ? selection.index : quill.getLength()
	// Use Quill's built-in formula embed so KaTeX renders correctly
	quill.insertEmbed(index, 'formula', latex, 'user')
	// add a trailing space for easier continued typing
	quill.insertText(index + 1, ' ', 'user')
	quill.setSelection(index + 2, 0)
}
