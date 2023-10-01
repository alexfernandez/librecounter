import {readSiteStats} from '../db/stats.js'


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
	return `
<html>
<head>
  <title>LibreCounter stats for ${site}</title>
</head>
<body>
	<img src="/counter.svg">
	<h1>LibreCounter stats for ${site}</h1>
	<h2>Stats per day</h2>
	${formatStats(stats.byDay)}
	<h2>Stats per page</h2>
	${formatStats(stats.byPage)}
	<h2>Stats per country</h2>
	${formatStats(stats.byCountry)}
</body>
</html>
`
}

function formatStats(array) {
	const formatted = array.map(point => `${point.key}: ${point.value}`)
	return formatted.join('<br/>')
}

