import {createIndex, findAll, findOne} from './mongo.js'
import {getDay} from './query.js'
import {domainsToHide} from '../core/env.js'
import {decodePage} from '../core/format.js'
import {Stats} from '../core/stats.js'


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
		return new Stats()
	}
	const array = await findAll('sites', query.getQuery())
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

export async function readPageStats(query) {
	if (domainsToHide.includes(query.site)) {
		return new Stats()
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
	if (key != 'page') {
		return [key, value]
	}
	return [key, decodePage(value)]
}

export async function readVisitorToday(site) {
	const day = getDay()
	const {total} = await findOne('sites', {day, site}, {total: 1}) || {}
	return total || 0
}

