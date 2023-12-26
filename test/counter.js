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
}

async function testSvgCounters() {
	await testCounter(`/counter.svg`, 'simple')
	await testCounter(`/oldStyle.svg`, 'old style')
	await testCounter(`/solid-yellow.svg`, 'solid yellow')
	await testCounter(`/outline-orange.svg`, 'outline orange')
}

export default async function test() {
	await testSvgCounters()
}

