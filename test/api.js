import {app} from './setup.js'
import {getDay} from '../lib/db/query.js'


const site = 'test.com'
const path = '/mypage.fi'
const userAgent = 'testbot/1.0'

async function testCounter() {
	const response = await app.inject({
		url: `/count?url=http://${site}${path}&userAgent=${userAgent}`,
		method: 'GET',
	})
	console.assert(response.statusCode == 200, 'could not count')
	const result = response.json()
	console.assert(result.ok, 'did not count')
}

async function testStats() {
	const response = await app.inject({
		url: `/${site}/stats`,
		method: 'GET',
		headers: {'user-agent': 'testbot/1.0'},
	})
	console.assert(response.statusCode == 200, 'could not stats')
	const result = response.json()
	console.assert(result.byDay, 'has no days')
	console.assert(Array.isArray(result.byDay), 'byDay is not an array')
	const day = getDay()
	const found = result.byDay.filter(dayStats => dayStats.day == day)
	console.assert(found.length == 1, 'no data today')
	console.assert(found[0].value > 0, 'no value today')
	console.assert(result.byPage, 'has no pages')
	console.assert(result.byPage[path], 'has no path')
}

export default async function test() {
	await testCounter()
	await testStats()
}

