import {app, site, userAgent} from './setup.js'


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

export default async function test() {
	await testHomePage()
	await testStatsPage()
}

