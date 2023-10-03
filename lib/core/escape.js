

export function encodePage(page) {
	return page.replaceAll('.', '․').replaceAll('$', '﹩')
}

export function decodePage(page) {
	return page.replaceAll('﹩', '$').replaceAll('․', '.')
}

