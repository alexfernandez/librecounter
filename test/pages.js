import {app, site, userAgent} from './setup.js'


async function testHomePage() {
	await testPage(`/`, 'LibreCounter Stats')
	await testPage(`/main.css`, 'body {')
	await testPage(`/options`, 'LibreCounter Options')
	await testPage(`/img/isologo-brown.svg`, '<svg')
	await testPage(`/img/isologo-fake.svg`, 'File not found', 404)
}

async function testStatsPage() {
	await testPage(`/${site}/show`, site)
}

async function testPage(url, check, expectedStatus = 200) {
	const response = await app.inject({
		url,
		method: 'GET',
		headers: {'user-agent': userAgent},
	})
	console.assert(response.statusCode == expectedStatus, `could not page ${url}`)
	console.assert(response.payload.includes(check), `did not page ${url}`)
}

async function testRedirect() {
	const response = await app.inject({
		url: `/referer/show`,
		method: 'GET',
		headers: {
			'user-agent': userAgent,
			referer: `https://${site}/whatever.page`,
		},
	})
	console.assert(response.statusCode == 302, `could not redirect to referer`)
	const location = response.headers.location || ''
	console.assert(location.includes(site), `did not redirect to ${site}`)
}

export default async function test() {
	await testHomePage()
	await testStatsPage()
	await testRedirect()
}

