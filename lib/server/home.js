import {promises as fs} from 'fs'
import {readLatestSites} from '../db/stats.js'
import {createHome} from '../page/home.js'
import {createOldStyle} from '../page/oldStyle.js'


export default async function setup(app) {
	app.get('/', home)
	app.get('/old-style', oldStyle)
	app.get('/favicon.ico', await serveFile('public/favicon.png', 'image/png'))
	app.get('/favicon.png', await serveFile('public/favicon.png', 'image/png'))
	app.get('/main.css', await serveFile('public/main.css', 'text/css'))
}

async function serveFile(path, mime) {
	let file = await fs.readFile(path)
	let lastModified = (await fs.stat(path)).mtimeMs
	return async function(request, reply) {
		const since = (await fs.stat(path)).mtimeMs
		if (since > lastModified) {
			console.log(`Reloading ${path}`)
			file = await fs.readFile(path)
		}
		reply.type(mime)
		return file
	}
}

/**
 * Request: no parameters.
 * Response: home page.
 * No auth required.
 */
async function home(request, reply) {
	const latestSites = await readLatestSites()
	reply.type('text/html')
	return createHome(latestSites)
}

/**
 * Request: no parameters.
 * Response: page with old style counter.
 * No auth required.
 */
async function oldStyle(request, reply) {
	reply.type('text/html')
	return createOldStyle()
}

