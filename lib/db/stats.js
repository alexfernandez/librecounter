import {createIndex, findByDay, findByField, upsertOne} from './mongo.js'


await init()

async function init() {
	await createIndex('days', {site: 1, day: 1})
	await createIndex('pages', {site: 1, day: 1, page: 1})
}

export async function readSiteStats(host) {
	const byDay = await findByDay('stats', {host})
	const byPage = await findByField('stats', {host}, 'page')
	const byCountry = await findByField('stats', {host}, 'country')
	const byBrowser = await findByField('stats', {host}, 'browser')
	const byOs = await findByField('stats', {host}, 'os')
	return {byDay, byPage, byCountry, byBrowser, byOs}
}

export async function storeCounter(counter) {
	const update = {}
	for (const field in counter.stats) {
		const value = counter.stats[field]
		const key = `${field}:${value}`
		update[key] = 1
	}
	await upsertOne('days', {site: counter.site, day: counter.day}, {$inc: update})
	await upsertOne('pages', {site: counter.site, day: counter.day, page: counter.page}, {$inc: update})
}

