import {promises as fs} from 'fs'
import {insertOne} from '../db/driver.js'
import geoip from 'geoip-lite'

const logo = await fs.readFile('doc/librecounter.svg')


export default async function setup(app) {
	app.get('/counter.svg', counter)
}

/**
 * Request: no parameters required.
 * Response: librecounter SVG.
 * No auth required.
 */
async function counter(request, reply) {
	await storeStats(request)
	reply.type('image/svg+xml')
	return logo
}

async function storeStats(request) {
	const userAgent = request.headers['user-agent']
	const {host, page} = getReferer(request)
	const timestamp = new Date()
	const {country} = geoip.lookup(request.ip) || {}
	await insertOne('stats', {host, page, timestamp, userAgent, country})
}

function getReferer(request) {
	const referer = request.headers['referer']
	if (!referer) {
		return {}
	}
	const url = new URL(referer)
	return {
		host: url.host,
		page: url.pathname,
	}
}

