import {createIndex, findAll, findOne} from './sqlite.js'
import {isDomainHidden} from '../core/domain.js'
import {decodePage} from '../core/format.js'
import {Stats} from '../core/stats.js'


await init()

async function init() {
	await createIndex('sites', {site: 1, day: 1})
	await createIndex('pages', {site: 1, day: 1, page: 1})
}

export async function readLatestSites() {
	const day = getDay()
	const all = await findAll('sites', ['day = ?', `field = 'total'`], [day])
	const filtered = all.filter(stats => !isDomainHidden(stats.site))
	return filtered.map(stats => ({key: stats.site, value: stats.total}))
}

export async function readSiteStats(site, days) {
	if (isDomainHidden(site)) {
		return new Stats()
	}
	const startDay = getDay(-days)
	const endDay = getDay(1)
	const array = await findAll('sites', ['site = ?', 'day > ?', 'day < ?'], [site, startDay, endDay])
	return buildStats(array)
}

function buildStats(array) {
	const stats = new Stats()
	for (const element of array) {
		stats.addDay(element.day, element.total)
		for (const field in element) {
			const [section, key] = readSectionKey(field)
			stats.addBySection(section, key, element[field])
		}
	}
	return stats
}

function readSectionKey(field) {
	const parts = field.split(':')
	if (parts.length < 2) {
		return [field, null]
	}
	const key = parts[0]
	const value = parts.slice(1).join(':')
	if (key != 'page') {
		return [key, value]
	}
	return [key, decodePage(value)]
}

export async function readVisitorToday(site) {
	const day = getDay()
	const {total} = await findOne('sites', ['site = ?', 'day = ?', `field = 'total'`], [site, day]) || {}
	return total || 0
}

export function getDay(diff) {
	const date = new Date()
	if (diff) {
		date.setDate(date.getDate() + diff)
	}
	return date.toISOString().substring(0, 10)
}

