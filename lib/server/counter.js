import {promises as fs} from 'fs'
import {storeCounter} from '../db/counter.js'
import {readVisitorToday} from '../db/stats.js'
import {Counter} from '../core/counter.js'

const logo = await fs.readFile('public/librecounter.svg')
const oldStyleLogo = String(await fs.readFile('public/old-style.svg'))
const maxCacheUnique = 1800


export default async function setup(app) {
	app.get('/counter.svg', counter)
	app.get('/unique.svg', uniqueCounter)
	app.get('/oldStyle.svg', oldStyleCounter)
	app.get('/librecounter.svg', noCounter)
	app.get('/count', count)
}

/**
 * Request: no parameters required.
 * Response: librecounter SVG.
 * No auth required.
 */
async function counter(request, reply) {
	const counter = new Counter(request.ip, request.headers)
	await storeCounter(counter)
	reply.type('image/svg+xml')
	reply.header('cache-control', 'no-store, private')
	return logo
}

/**
 * Same interface as counter()
 */
async function uniqueCounter(request, reply) {
	const counter = new Counter(request.ip, request.headers)
	await storeCounter(counter)
	reply.type('image/svg+xml')
	reply.header('cache-control', `max-age=${maxCacheUnique}, private`)
	return logo
}

/**
 * Same interface as counter()
 */
async function oldStyleCounter(request, reply) {
	const counter = new Counter(request.ip, request.headers)
	await storeCounter(counter)
	reply.type('image/svg+xml')
	reply.header('cache-control', 'no-store, private')
	const visitor = await readVisitorToday(counter.site)
	const count = padVisitor(visitor)
	return replaceCount(count)
}

/**
 * Request: query parameters:
 *	- url: URL to visit.
 *	- userAgent: the user agent that paid the visit.
 * Response: {ok}.
 * No auth required.
 */
async function count(request) {
	const counter = new Counter(request.ip, request.headers)
	counter.setReferer(request.query.url)
	counter.setUserAgent(request.query.userAgent)
	await storeCounter(counter)
	return {ok: true}
}

function padVisitor(count) {
	const string = String(count)
	if (string.length > 4) {
		return `+${string.substring(string.length - 3)}`
	}
	return '0'.repeat(4 - string.length) + string
}

function replaceCount(count) {
	let counted = oldStyleLogo
	for (const c of count) {
		counted = counted.replace('>X<', `>${c}<`)
	}
	return counted
}

/**
 * Request: no parameters required.
 * Response: librecounter SVG, will not increase count.
 * No auth required.
 */
async function noCounter(request, reply) {
	reply.type('image/svg+xml')
	reply.header('cache-control', `max-age=${maxCacheUnique}, public`)
	return logo
}

