import {readSiteStats} from '../db/stats.js'


export default async function setup(app) {
	app.get('/:site/stats', stats)
	app.get('/:site/show', show)
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

	<!-- courtesy of https://codepo8.github.io/css-fork-on-github-ribbon/ -->
	<style>#forkongithub a{background:#000;color:#fff;text-decoration:none;font-family:arial,sans-serif;text-align:center;font-weight:bold;padding:5px 40px;font-size:1rem;line-height:2rem;position:relative;transition:0.5s;}#forkongithub a:hover{background:#c11;color:#fff;}#forkongithub a::before,#forkongithub a::after{content:"";width:100%;display:block;position:absolute;top:1px;left:0;height:1px;background:#fff;}#forkongithub a::after{bottom:1px;top:auto;}@media screen and (min-width:800px){#forkongithub{position:fixed;display:block;top:0;right:0;width:200px;overflow:hidden;height:200px;z-index:9999;}#forkongithub a{width:200px;position:absolute;top:60px;right:-60px;transform:rotate(45deg);-webkit-transform:rotate(45deg);-ms-transform:rotate(45deg);-moz-transform:rotate(45deg);-o-transform:rotate(45deg);box-shadow:4px 4px 10px rgba(0,0,0,0.8);}}</style><span id="forkongithub"><a target="_blank" href="https://github.com/alexfernandez/librecounter">Fork me on GitHub</a></span>
</body>
</html>
`
}

function formatStats(array) {
	const formatted = array.map(point => `${point.key}: ${point.value}`)
	return formatted.join('<br/>')
}

