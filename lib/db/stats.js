import {findByDay, findByField} from './driver.js'


export async function readSiteStats(host) {
	const byDay = await findByDay('stats', {host})
	const byPage = await findByField('stats', {host}, 'page')
	const byCountry = await findByField('stats', {host}, 'country')
	return {byDay, byPage, byCountry}
}

