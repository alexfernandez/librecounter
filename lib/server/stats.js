import {DayQuery} from '../db/query.js'
import {readSiteStats} from '../db/stats.js'
import {createStatsPage} from '../page/stats.js'

const defaultDays = 30


export default async function setup(app) {
	app.get('/:site/siteStats', fetchStats)
	app.get('/:site/pageStats', fetchStats)
	app.get('/:site/show', show)
}

/**
 * Request params: site.
 * Query params:
 *	- days: show data only for the latest days, default 30.
 * Response: {ok}.
 * No auth required.
 */
async function fetchStats(request) {
	const days = request.query.days || defaultDays
	const query = new DayQuery(request.params.site, days)
	return await readSiteStats(query)
}

/**
 * Request params: site.
 * Response: complete web page.
 * No auth required.
 */
async function show(request, reply) {
	reply.type('text/html')
	const query = new DayQuery(request.params.site)
	const stats = await readSiteStats(query)
	return createStatsPage(request.params.site, stats)
}

