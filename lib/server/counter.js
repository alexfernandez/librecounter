import {promises as fs} from 'fs'
import {storeCounter} from '../db/stats.js'
import {Counter} from '../core/counter.js'

const logo = await fs.readFile('public/librecounter.svg')


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
	reply.header('cache-control', 'no-store;private')
	return logo
}

async function storeStats(request) {
	const counter = new Counter(request.ip, request.headers)
	await storeCounter(counter)
}

