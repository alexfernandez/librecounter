
const maxLabelLength = 30


export function encodePage(page) {
	if (!page) {
		return null
	}
	return page.replaceAll('.', '․').replaceAll('$', '﹩')
}

export function decodePage(page) {
	if (!page) {
		return null
	}
	return page.replaceAll('﹩', '$').replaceAll('․', '.')
}

export function shorten(label) {
	if (!label) {
		return ''
	}
	if (label.length <= maxLabelLength) {
		return label
	}
	return label.substring(0, maxLabelLength) + '…'
}


