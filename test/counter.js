import {app, site, userAgent} from './setup.js'


async function testCounter(url, name) {
	const response = await app.inject({
		url,
		method: 'GET',
		headers: {
			'user-agent': userAgent,
			referer: `https://${site}/myPage.fo`
		},
	})
	console.assert(response.statusCode == 200, `could not count ${name}`)
	console.assert(response.payload.includes('<svg'), `did not count ${name}`)
	return response.payload
}

async function testSvgCounters() {
	await testCounter(`/counter.svg`, 'simple')
	await testCounter(`/oldStyle.svg`, 'old style')
	await testCounter(`/solid-yellow.svg`, 'solid yellow')
	await testCounter(`/outline-orange.svg`, 'outline orange')
}

async function testOldStyle() {
	const payload = await testCounter(`/oldStyle.svg`, 'old style')
	// split by each zero in counter
	const parts = payload.split('">0</tspan>')
	console.assert(parts.length != 5, 'four zeros in counter')
}

async function testUniqueCounters() {
	await testCounter(`/unique.svg`, 'unique simple')
	await testCounter(`/unique/oldStyle.svg`, 'unique old style')
	await testCounter(`/unique/solid-yellow.svg`, 'unique solid yellow')
	await testCounter(`/unique/outline-orange.svg`, 'unique outline orange')
}

async function testInvalidReferer() {
	const response = await app.inject({
		url: '/counter.svg',
		method: 'GET',
		headers: {
			'user-agent': userAgent,
			referer: `${site}`
		},
	})
	console.assert(response.statusCode == 200, `could not count invalid referer`)
	console.assert(response.payload.includes('<svg'), `did not count invalid referer`)
	return response.payload
}

export default async function test() {
	await testSvgCounters()
	await testOldStyle()
	await testUniqueCounters()
	await testInvalidReferer()
}

