import {promises as fs} from 'fs'
import {readLatestSites} from '../db/stats.js'
import {createHome} from '../page/home.js'
import {createOptions} from '../page/options.js'

const filesByPath = new Map()


class File {
	constructor(path, mime) {
		this.path = path
		this.mime = mime
		this.contents = null
		this.lastModified = 0
	}

	async readContents() {
		if (!this.contents) {
			this.contents = await fs.readFile(this.path)
			this.lastModified = (await fs.stat(this.path)).mtimeMs
		}
		const since = (await fs.stat(this.path)).mtimeMs
		if (since > this.lastModified) {
			console.log(`Reloading ${this.path}`)
			this.contents = await fs.readFile(this.path)
			this.lastModified = since
		}
		return this.contents
	}
}

export default async function setup(app) {
	app.get('/', serveHome)
	app.get('/options', serveOptions)
	app.get('/favicon.ico', await serveFile('public/favicon.png', 'image/png'))
	app.get('/favicon.png', await serveFile('public/favicon.png', 'image/png'))
	app.get('/main.css', await serveFile('public/main.css', 'text/css'))
	app.get('/logo/:file.svg', serveSvgLogo)
}

async function serveFile(path, mime) {
	const file = new File(path, mime)
	return async function(request, reply) {
		return serveStaticFile(file, request, reply)
	}
}

async function serveStaticFile(file, request, reply) {
	const contents = await file.readContents()
	reply.type(file.mime)
	return contents
}

async function serveSvgLogo(request, reply) {
	const path = `public/logo/${request.params.file}.svg`
	const mime = 'image/svg+xml'
	if (!filesByPath.has(path)) {
		filesByPath.set(path, new File(path, mime))
	}
	const file = filesByPath.get(path)
	return serveStaticFile(file, request, reply)
}

/**
 * Request: no parameters.
 * Response: home page.
 * No auth required.
 */
async function serveHome(request, reply) {
	const latestSites = await readLatestSites()
	reply.type('text/html')
	return createHome(latestSites)
}

/**
 * Request: no parameters.
 * Response: page with old style counter.
 * No auth required.
 */
async function serveOptions(request, reply) {
	reply.type('text/html')
	return createOptions()
}

