import {readSiteStats} from '../db/stats.js'
import {createStatsPage} from '../page/stats.js'

const defaultDays = 14


export default async function setup(app) {
	app.get('/:site/siteStats', fetchSiteStats)
	app.get('/referer/show', showReferer)
	app.get('/:site/show', show)
}

/**
 * Request params: site.
 * Query params:
 *	- days: show data only for the latest days, default 30.
 * Response: {ok}.
 * No auth required.
 */
async function fetchSiteStats(request) {
	const days = request.query.days || defaultDays
	return await readSiteStats(request.params.site, days)
}

/**
 * Request params: site.
 * Response: complete web page.
 * No auth required.
 */
async function show(request, reply) {
	const days = request.query.days || defaultDays
	const site = request.params.site || ''
	const stats = await readSiteStats(site, days)
	reply.type('text/html')
	return createStatsPage(site, days, stats)
}

/**
 * No parameters.
 * Response: redirect to stats of referer.
 * No auth required.
 */
async function showReferer(request, reply) {
	const referer = request.headers.referer
	if (!referer) {
		reply.status(400)
		return {error: 'Missing referer'}
	}
	const url = new URL(referer)
	const site = url.host
	reply.redirect(`/${site}/show`)
}

