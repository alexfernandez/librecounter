import {app, site, userAgent} from './setup.js'


async function testHomePage() {
	await testPage(`/`, 'LibreCounter Stats')
	await testPage(`/options`, 'LibreCounter Options')
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

