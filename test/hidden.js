import {isDomainHidden} from '../lib/core/domain.js'
import {app, userAgent} from './setup.js'

const hiddenSite = 'hidden.test.com'


function testHiddenDomain(domain, hidden) {
	console.assert(isDomainHidden(domain) == hidden, `domain ${domain} should be ${hidden ? 'hidden' : 'shown'}`)
}

async function testHiddenCounter() {
	const response = await app.inject({
		url: `hidden.svg`,
		method: 'GET',
		headers: {
			'user-agent': userAgent,
			referer: `https://${hiddenSite}/myPage.fo`
		},
	})
	console.assert(response.statusCode == 200, `could not hide ${hiddenSite}`)
	console.assert(response.payload.includes('<svg'), `did not hide ${hiddenSite}`)
	const response2 = await app.inject({
		url: `/`,
		method: 'GET',
		headers: {
			'user-agent': userAgent,
		},
	})
	console.assert(response2.statusCode == 200, `could not show home`)
	console.assert(!response2.payload.includes(hiddenSite), `did home ${hiddenSite}`)
	const response3 = await app.inject({
		url: `/${hiddenSite}/show`,
		method: 'GET',
		headers: {
			'user-agent': userAgent,
		},
	})
	console.assert(response3.statusCode == 200, `could not show hidden stats`)
	console.assert(response3.payload.includes(hiddenSite), `did show ${hiddenSite}`)
	console.assert(response3.payload.includes('-hidden'), `did include hidden day`)
}

export default async function test() {
	testHiddenDomain('127.0.0.1:3424', true)
	testHiddenDomain('localhost:2847', true)
	testHiddenDomain('localhost.test.com', false)
	testHiddenDomain('librecounter.org', false)
	testHiddenDomain('movilocal.test.com', false)
	testHiddenDomain('pinchito.local', false)
	await testHiddenCounter()
}

