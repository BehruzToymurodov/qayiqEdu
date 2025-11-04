export const quillModules = (quillRef, openFormulaModal) => ({
	toolbar: {
		container: [
			[{ header: [1, 2, false] }],
			['bold', 'italic', 'underline', 'strike'],
			[{ list: 'ordered' }, { list: 'bullet' }],
			['link', 'image', 'code-block'],
			['formula'], // formula button
		],
		handlers: {
			image: function () {
				const input = document.createElement('input')
				input.setAttribute('type', 'file')
				input.setAttribute('accept', 'image/*')
				input.click()
				input.onchange = () => {
					const file = input.files[0]
					if (/^image\//.test(file.type)) {
						const reader = new FileReader()
						reader.onload = () => {
							const quill = quillRef.current.getEditor()
							const range = quill.getSelection()
							quill.insertEmbed(range.index, 'image', reader.result)
						}
						reader.readAsDataURL(file)
					}
				}
			},
			formula: function () {
				openFormulaModal()
			},
		},
	},
})

export const quillFormats = [
	'header',
	'bold',
	'italic',
	'underline',
	'strike',
	'list',
	'bullet',
	'link',
	'image',
	'code-block',
	'formula',
]
