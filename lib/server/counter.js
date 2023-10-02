import {promises as fs} from 'fs'
import {insertOne} from '../db/driver.js'
import geoip from 'geoip-lite'
import DeviceDetector from 'node-device-detector'

const logo = await fs.readFile('doc/librecounter.svg')
const detector = new DeviceDetector({
	clientIndexes: true,
	deviceIndexes: true,
	deviceAliasCode: false,
})


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
	const device = getDevice(userAgent)
	const referer = getReferer(request)
	const timestamp = new Date()
	const {country} = lookupGeoip(request)
	const stats = {timestamp, userAgent, country, ...referer, ...device}
	await insertOne('stats', stats)
}

function getDevice(userAgent) {
	const device = detector.detect(userAgent)
	return {
		type: device.device.type,
		os: device.os.name,
		platform: device.os.platform,
		browser: device.client.name,
	}
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

