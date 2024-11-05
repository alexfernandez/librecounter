import {serveStaticFile} from './file.js'
import {readLatestSites} from '../db/stats.js'
import {createHome} from '../page/home.js'
import {createOptions} from '../page/options.js'


export default async function setup(app) {
	app.get('/', serveHome)
	app.get('/options', serveOptions)
	app.get('/favicon.ico', await serveFile('public/favicon.png', 'image/png'))
	app.get('/favicon.png', await serveFile('public/favicon.png', 'image/png'))
	app.get('/main.css', await serveFile('public/main.css', 'text/css'))
	app.get('/img/:file.svg', serveSvgLogo)
	app.get('/js/:file.js', serveJsLib)
}

async function serveFile(path, mime) {
	return async function(request, reply) {
		return serveStaticFile(path, mime, request, reply)
	}
}

async function serveSvgLogo(request, reply) {
	const path = `public/img/${request.params.file}.svg`
	const mime = 'image/svg+xml'
	return serveStaticFile(path, mime, request, reply)
}

async function serveJsLib(request, reply) {
	const path = `public/js/${request.params.file}.js`
	const mime = 'text/javascript'
	return serveStaticFile(path, mime, request, reply)
}

/**
 * Request: no parameters.
 * Response: home page.
 * No auth required.
 */
async function serveHome(request, reply) {
	const latestSites = readLatestSites()
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

