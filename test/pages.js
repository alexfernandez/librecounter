import {app, site, userAgent} from './setup.js'


async function testHomePage() {
	await testPage(`/`, 'LibreCounter Stats')
	await testPage(`/main.css`, 'body {')
	await testPage(`/options`, 'LibreCounter Options')
	await testPage(`/img/isologo-brown.svg`, '<svg')
	await testPage(`/img/isologo-fake.svg`, 'File not found', 404)
}

async function testStatsPage() {
	await testPage(`/${site}/show`, [`Analytics for `, site])
}

async function testFakeDomainPage() {
	const fakeDomain = 'test.fake'
	await testPage(`/${fakeDomain}/show`, `No stats for ${fakeDomain}`)
}

async function testXssProtection() {
	const scriptTag = '<script>alert(1)</script>'
	const response = await app.inject({
		url: `/${site}/show?days=${encodeURIComponent(scriptTag)}`,
		method: 'GET',
		headers: {'user-agent': userAgent},
	})
	console.assert(!response.payload.includes(scriptTag), 'script tag should not appear raw in output')
	console.assert(response.payload.includes('14 days'), 'invalid days should default to 14')

	const imgTag = '<img src=x onerror=alert(1)>'
	const response2 = await app.inject({
		url: `/${site}/show?days=${encodeURIComponent(imgTag)}`,
		method: 'GET',
		headers: {'user-agent': userAgent},
	})
	console.assert(!response2.payload.includes(imgTag), 'img tag should not appear raw in output')

	const siteScript = `%3Cscript%3Ealert(1)%3C/script%3E`
	const response3 = await app.inject({
		url: `/${siteScript}/show`,
		method: 'GET',
		headers: {'user-agent': userAgent},
	})
	console.assert(!response3.payload.includes('<script>alert(1)</script>'), 'site param with script should be escaped')
}

async function testDaysValidation() {
	const response = await app.inject({
		url: `/${site}/show?days=abc`,
		method: 'GET',
		headers: {'user-agent': userAgent},
	})
	console.assert(response.payload.includes('14 days'), 'invalid days should default to 14')

	const response2 = await app.inject({
		url: `/${site}/show?days=-5`,
		method: 'GET',
		headers: {'user-agent': userAgent},
	})
	console.assert(response2.payload.includes('14 days'), 'negative days should default to 14')

	const response3 = await app.inject({
		url: `/${site}/show?days=3.5`,
		method: 'GET',
		headers: {'user-agent': userAgent},
	})
	console.assert(response3.payload.includes('14 days'), 'non-integer days should default to 14')

	const response4 = await app.inject({
		url: `/${site}/show?days=7`,
		method: 'GET',
		headers: {'user-agent': userAgent},
	})
	console.assert(response4.payload.includes('7 days'), 'valid days=7 should work')
}

async function testPage(url, checks, expectedStatus = 200) {
	const response = await app.inject({
		url,
		method: 'GET',
		headers: {'user-agent': userAgent},
	})
	console.assert(response.statusCode == expectedStatus, `could not page ${url}`)
	const checkArray = checks.length ? checks : [checks]
	for (const check of checkArray) {
		console.assert(response.payload.includes(check), `did not page ${url}`)
	}
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
	await testFakeDomainPage()
	await testRedirect()
	await testXssProtection()
	await testDaysValidation()
}

