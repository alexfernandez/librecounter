import {findByDay, findByField} from './mongo.js'


export async function readSiteStats(host) {
	const byDay = await findByDay('stats', {host})
	const byPage = await findByField('stats', {host}, 'page')
	const byCountry = await findByField('stats', {host}, 'country')
	const byBrowser = await findByField('stats', {host}, 'browser')
	const byOs = await findByField('stats', {host}, 'os')
	return {byDay, byPage, byCountry, byBrowser, byOs}
}

