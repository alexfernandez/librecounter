import {isDomainHidden} from '../core/domain.js'


function testHidden(domain, hidden) {
	console.assert(isDomainHidden(domain) == hidden, `domain ${domain} should be ${hidden ? 'hidden' : 'shown'}`)
}

export default async function test() {
	testHidden('127.0.0.1:3424', true)
	testHidden('localhost:2847', true)
	testHidden('localhost.test.com', false)
	testHidden('librecounter.org', false)
	testHidden('movilocal.test.com', false)
	testHidden('pinchito.local', false)
}

