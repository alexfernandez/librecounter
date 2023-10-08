import {createIndex, findAll, findOne, domainsToHide} from './mongo.js'
import {getDay} from './query.js'
import {decodePage} from '../core/format.js'


await init()

async function init() {
	await createIndex('sites', {site: 1, day: 1})
	await createIndex('pages', {site: 1, day: 1, page: 1})
}

export async function readLatestSites() {
	const day = getDay()
	const all = await findAll('sites', {day}, {site: 1, total: 1})
	const filtered = all.filter(stats => !domainsToHide.includes(stats.site))
	return filtered.map(stats => ({key: stats.site, value: stats.total}))
}

export async function readSiteStats(query) {
	if (domainsToHide.includes(query.site)) {
		return {total: 0}
	}
	const array = await findAll('sites', query.getQuery())
	return buildStats(array)
}

function buildStats(array) {
	const result = {total: 0, byDay: []}
	for (const element of array) {
		const day = element.day
		result.byDay.push({day, value: element.total})
		result.total += element.total
		for (const field in element) {
			const [section, key] = readSectionKey(field)
			if (!key) {
				continue
			}
			if (!result[section]) {
				result[section] = {}
			}
			const group = result[section]
			if (typeof group != 'object') {
				// at one point it was stored as a number due to a bug
				continue
			}
			const value = element[field]
			if (typeof value == 'object') {
				// at one point it was stored as an object due to a bug
				continue
			}
			group[key] = (group[key] || 0) + value
		}
	}
	return result
}

export async function readPageStats(query) {
	if (domainsToHide.includes(query.site)) {
		return {total: 0}
	}
	const array = await findAll('pages', query.getQuery())
	return buildStats(array)
}

function readSectionKey(field) {
	const parts = field.split(':')
	if (parts.length < 2) {
		return [field, null]
	}
	const key = parts[0]
	const value = parts.slice(1).join(':')
	const name = 'by' + key.substring(0, 1).toUpperCase() + key.substring(1)
	if (key != 'page') {
		return [name, value]
	}
	return [name, decodePage(value)]
}

export async function readVisitorToday(site) {
	const day = getDay()
	const {total} = await findOne('sites', {day, site}, {total: 1}) || {}
	return (total || 0) + 1
}

