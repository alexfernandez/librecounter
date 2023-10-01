


export default async function setup(app) {
	app.get('/stats/:site', stats)
	app.get('/stats/:site/show.html', show)
}

/**
 * Request: site.
 * Response: {ok}.
 * No auth required.
 */
async function stats() {
	return {ok: true}
}

async function show(request, reply) {
	reply.type('text/html')
	const site = request.params.site
	return getPage(site)
}

function getPage(site) {
	return `
<html>
<head>
  <title>LibreCounter stats for ${site}</title>
</head>
<body>
	<img src="/counter.svg">
	<h1>LibreCounter stats for ${site}</h1>
	<p>Stats</p>
</body>
</html>
`
}

