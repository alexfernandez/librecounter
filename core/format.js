
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
		sites: getSites(stats),
		labels: getLabels(stats),
		data: getData(stats),
	}
}

function limitTop10(array) {
	return array.slice(0, maxStats)
}

function getSites(stats) {
	const sites = stats.map(site => site.key)
	if (sites.length <= maxStats) {
		return sites
	}
	return [... limitTop10(sites), '…rest']
}

function getLabels(stats) {
	return getSites(stats).map(shorten)
}

function getData(stats) {
	const data = stats.map(site => site.value)
	if (data.length <= maxStats) {
		return data
	}
	const sum = data.slice(maxStats).reduce((a, b) => a + b)
	return [... limitTop10(data), sum]
}

