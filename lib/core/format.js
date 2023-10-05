
const maxLabelLength = 30
const maxStats = 10


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


export function getTop10(stats) {
	stats.sort((a, b) => b.value - a.value)
	return {
		labels: getLabels(stats),
		data: getData(stats),
	}
}

function getLabels(stats) {
	const labels = stats.map(site => site.key).map(shorten)
	if (labels.length <= maxStats) {
		return labels
	}
	return [... labels.slice(0, maxStats), '…rest']
}

function getData(stats) {
	const data = stats.map(site => site.value)
	if (data.length <= maxStats) {
		return data
	}
	const sum = data.slice(maxStats).reduce((a, b) => a + b)
	return [... data.slice(0, maxStats), sum]
}

