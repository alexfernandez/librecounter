import {readSiteStats} from '../db/stats.js'
import {insertOne} from '../db/driver.js'


export default async function setup(app) {
	app.get('/stats/:site/api', stats)
	app.get('/stats/:site/show.html', show)
}

/**
 * Request: site.
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
	return getPage(site, stats)
}

function getPage(site, stats) {
	const dayStats = stats.byDay.map(point => `${point.key}: ${point.value}`)
	const pageStats = stats.byPage.map(point => `${point.key}: ${point.value}`)
	return `
<html>
<head>
  <title>LibreCounter stats for ${site}</title>
</head>
<body>
	<img src="/counter.svg">
	<h1>LibreCounter stats for ${site}</h1>
	<h2>Stats per day</h2>
	${dayStats.join('<br/>')}
	<h2>Stats per page</h2>
	${pageStats.join('<br/>')}
</body>
</html>
`
}

