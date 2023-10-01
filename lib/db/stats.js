import {findByDay, findByPage} from './driver.js'


export async function readSiteStats(host) {
	const byDay = await findByDay('stats', {host})
	const byPage = await findByPage('stats', {host})
	return {byDay, byPage}
}

