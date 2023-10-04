
const maxLabelLength = 30


export function encodePage(page) {
	return page.replaceAll('.', '․').replaceAll('$', '﹩')
}

export function decodePage(page) {
	return page.replaceAll('﹩', '$').replaceAll('․', '.')
}

export function shorten(label) {
	if (label.length <= maxLabelLength) {
		return label
	}
	return label.substring(0, maxLabelLength) + '…'
}


