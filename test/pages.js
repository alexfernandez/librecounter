import {app} from './setup.js'


const site = 'test.com'
const userAgent = 'testbot/1.0'

async function testHomePage() {
	const response = await app.inject({
		url: `/`,
		method: 'GET',
		headers: {'user-agent': userAgent},
	})
	console.assert(response.statusCode == 200, 'could not home')
	console.assert(response.payload.includes('LibreCounter Stats'), 'did not home')
}

async function testStatsPage() {
	const response = await app.inject({
		url: `/${site}/show`,
		method: 'GET',
		headers: {'user-agent': userAgent},
	})
	console.assert(response.statusCode == 200, 'could not stats')
	console.assert(response.payload.includes(site), 'did not stats')
}

async function testCounterSvg() {
	const response = await app.inject({
		url: `/counter.svg`,
		method: 'GET',
		headers: {
			'user-agent': userAgent,
			referer: `https://${site}/myPage.fo`
		},
	})
	console.assert(response.statusCode == 200, 'could not counter')
	console.assert(response.payload.includes('<svg'), 'did not counter')
}

export default async function test() {
	await testHomePage()
	await testStatsPage()
	await testCounterSvg()
}

