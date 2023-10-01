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
	const {country} = lookupGeoip(request)
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

function lookupGeoip(request) {
	if (request.ip != '127.0.0.1') {
		return geoip.lookup(request.ip)
	}
	const ip = request.headers['x-real-ip']
	if (!ip) {
		return {}
	}
	return geoip.lookup(ip)
}

