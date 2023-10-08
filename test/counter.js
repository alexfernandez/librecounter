import {app, site, userAgent} from './setup.js'


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
	await testCounterSvg()
	await testOldStyleSvg()
}

