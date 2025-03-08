import {createCounter, findAll, findOne} from './sqlite.js'
import {isDomainHidden} from '../core/domain.js'
import {decodePage} from '../core/format.js'
import {Stats} from '../core/stats.js'


init()

function init() {
	createCounter('sites', ['site', 'day'])
	createCounter('pages', ['site', 'day', 'page'])
}

export function readLatestSites() {
	const day = getDay()
	const all = findAll('sites', ['day = ?', `field = 'total'`], [day])
	const filtered = all.filter(stats => !isDomainHidden(stats.site))
	return filtered.map(stats => ({key: stats.site, value: stats.total}))
}

export function readSiteStats(site, days) {
	if (isDomainHidden(site)) {
		return new Stats()
	}
	const startDay = getDay(-days)
	const endDay = getDay(1)
	const array = findAll('sites', ['site = ?', 'day > ?', 'day < ?'], [site, startDay, endDay])
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

export function readVisitorToday(site) {
	const day = getDay()
	const {count} = findOne('sites', ['site = ?', 'day = ?', `field = 'total'`], [site, day]) || {}
	return count || 0
}

export function getDay(diff) {
	const date = new Date()
	if (diff) {
		date.setDate(date.getDate() + diff)
	}
	return date.toISOString().substring(0, 10)
}

