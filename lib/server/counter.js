import {promises as fs} from 'fs'
import {insertOne} from '../db/driver.js'

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
	const userAgent = request.headers['user-agent']
	const timestamp = new Date()
	await insertOne('stats', {timestamp, userAgent})
	reply.type('image/svg+xml')
	return logo
}

