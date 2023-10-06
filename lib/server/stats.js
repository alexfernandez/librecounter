import {DayQuery} from '../db/query.js'
import {readSiteStats} from '../db/stats.js'
import {createStatsPage} from '../page/stats.js'

export default async function setup(app) {
	app.get('/:site/stats', stats)
	app.get('/:site/show', show)
}

/**
 * Request params: site.
 * Response: {ok}.
 * No auth required.
 */
async function stats(request) {
	const query = new DayQuery(request.params.site)
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

