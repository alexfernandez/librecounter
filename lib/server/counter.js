import {promises as fs} from 'fs'
import {serveStaticFile} from './file.js'
import {storeCounter} from '../db/counter.js'
import {readVisitorToday} from '../db/stats.js'
import {Counter} from '../core/counter.js'

const defaultPath = 'public/img/solid-brown.svg'
const svgType = 'image/svg+xml'
const oldStyleLogo = String(await fs.readFile('public/img/old-style.svg'))
const maxCacheUnique = 1800


export default async function setup(app) {
	app.get('/counter.svg', counter)
	app.get('/unique.svg', uniqueCounter)
	app.get('/unique/:file.svg', uniqueCounter)
	app.get('/oldStyle.svg', oldStyleCounter)
	app.get('/:file.svg', logoCounter)
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
	reply.header('cache-control', 'no-store, private')
	return await serveStaticFile(defaultPath, svgType, request, reply)
}

/**
 * Same interface as counter()
 */
async function uniqueCounter(request, reply) {
	const counter = new Counter(request.ip, request.headers)
	await storeCounter(counter)
	reply.header('cache-control', `max-age=${maxCacheUnique}, private`)
	const path = request.params.file ? `public/img/${request.params.file}.svg` : defaultPath;
	return await serveStaticFile(path, svgType, request, reply)
}

/**
 * Same interface as counter()
 */
async function oldStyleCounter(request, reply) {
	const counter = new Counter(request.ip, request.headers)
	await storeCounter(counter)
	reply.type(svgType)
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
 * Response: requested (styled) SVG.
 * No auth required.
 */
async function logoCounter(request, reply) {
	const counter = new Counter(request.ip, request.headers)
	await storeCounter(counter)
	reply.header('cache-control', 'no-store, private')
	const path = `public/img/${request.params.file}.svg`
	return await serveStaticFile(path, svgType, request, reply)
}

