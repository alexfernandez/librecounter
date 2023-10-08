import {app} from './setup.js'


const site = 'test.com'
const userAgent = 'testbot/1.0'

async function testHomePage() {
	await testPage(`/`, 'LibreCounter Stats')
	await testPage(`/styles`, 'LibreCounter Styles')
}

async function testStatsPage() {
	await testPage(`/${site}/show`, site)
}

async function testPage(url, check) {
	const response = await app.inject({
		url,
		method: 'GET',
		headers: {'user-agent': userAgent},
	})
	console.assert(response.statusCode == 200, `could not page ${url}`)
	console.assert(response.payload.includes(check), `did not page ${url}`)
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

async function testOldStyleSvg() {
	const response = await app.inject({
		url: `/oldStyle.svg`,
		method: 'GET',
		headers: {
			'user-agent': userAgent,
			referer: `https://${site}/myPage.fo`
		},
	})
	console.assert(response.statusCode == 200, 'could not old-style')
	console.assert(response.payload.includes('<svg'), 'did not old-style')
}

export default async function test() {
	await testHomePage()
	await testStatsPage()
	await testCounterSvg()
	await testOldStyleSvg()
}

