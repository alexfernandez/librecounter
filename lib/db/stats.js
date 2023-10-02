import {createIndex, findAll, upsertOne} from './mongo.js'


await init()

async function init() {
	await createIndex('days', {site: 1, day: 1})
	await createIndex('pages', {site: 1, day: 1, page: 1})
}

export async function storeCounter(counter) {
	const update = {total: 1}
	for (const field in counter.stats) {
		const value = counter.stats[field]
		if (value) {
			const key = `${field}:${value}`
			update[key] = 1
		}
	}
	const pageKey = `page:${counter.page}`
	const updateWithPage = {...update, [pageKey]: 1}
	await upsertOne('days', {site: counter.site, day: counter.day}, {$inc: updateWithPage})
	await upsertOne('pages', {site: counter.site, day: counter.day, page: counter.page}, {$inc: update})
}

export async function readSiteStats(site) {
	const array = await findAll('days', {site})
	const result = {total: 0, byDay: []}
	console.log(array)
	for (const element of array) {
		const day = element.day
		result.byDay.push({key: day, value: element.total})
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
				continue
			}
			const value = element[field]
			group[key] = (group[key] || 0) + value
		}
	}
	console.log(result)
	return result
}

function readSectionKey(field) {
	const parts = field.split(':')
	if (parts.length < 2) {
		return [field, null]
	}
	return [parts[0], parts.slice(1).join(':')]
}

