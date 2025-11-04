import katex from 'katex'
import 'katex/dist/katex.min.css'

// ✅ Make KaTeX globally available (for Quill formula embeds)
if (typeof window !== 'undefined') {
	window.katex = katex
}

/**
 * Render a single LaTeX string into HTML
 * Safe for modal previews and Quill formula output
 */
export function renderLatex(latex = '') {
	if (!latex || typeof latex !== 'string') return ''

	try {
		return katex.renderToString(latex, {
			throwOnError: false,
			displayMode: true, // block style by default for clarity
			output: 'html',
		})
	} catch (err) {
		console.error('LaTeX render error:', err)
		return "<span style='color:red;'>Xato formula</span>"
	}
}

/**
 * Render all KaTeX formulas inside a given container element
 * (Useful when loading saved questions or previews)
 */
export function renderAllLatexInElement(element) {
	if (!element || !katex) return

	// Find all elements with a data-latex attribute or raw formula text
	const formulaNodes = element.querySelectorAll('.ql-formula, [data-latex]')

	formulaNodes.forEach(node => {
		const latex = node.dataset.latex || node.textContent
		if (latex?.trim()) {
			try {
				katex.render(latex, node, {
					throwOnError: false,
					displayMode: true,
				})
			} catch (err) {
				console.warn('Error rendering KaTeX element:', err)
			}
		}
	})
}
