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
	const site = request.params.site
	return await readSiteStats(site)
}

async function show(request, reply) {
	reply.type('text/html')
	const site = request.params.site
	const stats = await readSiteStats(site)
	return createStatsPage(site, stats)
}

