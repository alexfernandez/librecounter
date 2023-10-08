import {SiteQuery, PageQuery} from '../db/query.js'
import {readSiteStats, readPageStats} from '../db/stats.js'
import {createStatsPage} from '../page/stats.js'

const defaultDays = 30


export default async function setup(app) {
	app.get('/:site/siteStats', fetchSiteStats)
	app.get('/:site/pageStats', fetchPageStats)
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
	const query = new SiteQuery(request.params.site, days)
	return await readSiteStats(query)
}

/**
 * Request params: site.
 * Query params:
 *	- page: the page to show.
 *	- days: show data only for the latest days, default 30.
 * Response: {ok}.
 * No auth required.
 */
async function fetchPageStats(request) {
	const days = request.query.days || defaultDays
	const query = new PageQuery(request.params.site, days)
	return await readPageStats(query)
}

/**
 * Request params: site.
 * Response: complete web page.
 * No auth required.
 */
async function show(request, reply) {
	const days = request.query.days || defaultDays
	const query = new SiteQuery(request.params.site, days)
	const stats = await readSiteStats(query)
	reply.type('text/html')
	return createStatsPage(query, stats)
}

/**
 * No parameters.
 * Response: redirect to stats of referer.
 * No auth required.
 */
async function showReferer(request, reply) {
	const referer = request.headers.referer
	const url = new URL(referer)
	const site = url.host
	reply.redirect(`/${site}/show`)
}

