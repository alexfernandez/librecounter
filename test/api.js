import {app} from './setup.js'


const site = 'test.com'
const path = '/mypage.fi'
const userAgent = 'testbot/1.0'

async function testCounter() {
	const response = await app.inject({
		url: `/count?url=http://${site}${path}&userAgent=${userAgent}`,
		method: 'GET',
	})
	console.log(response)
	console.assert(response.statusCode == 200, 'could not count')
}

async function testStats() {
	const response = await app.inject({
		url: `/${site}/stats`,
		method: 'GET',
		headers: {'user-agent': 'testbot/1.0'},
	})
	console.log(response)
	console.assert(response.statusCode == 200, 'could not stats')
}

export default async function test() {
	await testCounter()
	await testStats()
}

