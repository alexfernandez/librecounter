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
	<link rel="shortcut icon" href="/favicon.png">
	<script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
</head>
<body>
	<a href="/">
	<img src="/counter.svg">
	</a>
	<h1>LibreCounter stats for ${site}</h1>
	<h2>Stats per day</h2>
	${createTimeSeries(stats.byDay)}
	<h2>Stats per page</h2>
	${createHorizontalChart(stats.page, 'pages', '#3300ff')}
	<h2>Stats per country</h2>
	${createHorizontalChart(stats.country, 'countries', '#cc6666')}
	<h2>Stats per browser</h2>
	${createHorizontalChart(stats.browser, 'browsers', '#66cc66')}
	<h2>Stats per OS</h2>
	${createHorizontalChart(stats.os, 'os', '#cccc66')}
</body>
</html>
`
}

function createTimeSeries(stats) {
	if (!stats.length) {
		return 'No stats yet'
	}
	const canvasId = 'chart-time'
	stats.sort((a, b) => a.key.localeCompare(b.key))
	const labels = stats.map(site => site.key)
	const data = stats.map(site => site.value)
	return `
	<div>
	<canvas id="${canvasId}"></canvas>
	</div>
	<script>
	const ctx = document.getElementById('${canvasId}')
	const data = {
		labels: ['${labels.join("','")}'],
		datasets: [{
			label: 'Daily stats',
			data: [${data.join(',')}],
			fill: false,
			borderColor: 'rgb(75, 192, 192)',
		}],
	}
	const config = {
		type: 'line',
		data: data,
		options: {
			responsive: true,
			scales: {y: {beginAtZero: true}},
			plugins: {legend: {display: false}},
		},
	}
	new Chart(ctx, config)
	</script>
`
}

function createHorizontalChart(map, label, color) {
	if (!map) {
		return 'No stats yet'
	}
	const stats = Object.entries(map).map(([key, value]) => ({key, value}))
	const canvasId = 'chart-' + label
	stats.sort((a, b) => b.value - a.value)
	const barHeight = 30
	const labels = stats.map(site => site.key)
	const data = stats.map(site => site.value)
	const height = barHeight * (data.length + 2)
	return `
	<div>
	<canvas id="${canvasId}" height="${height}"></canvas>
	</div>
	<script>
	const ctx${label} = document.getElementById('${canvasId}')
	const data${label} = {
		labels: ['${labels.join("','")}'],
		datasets: [{
			label: 'Top sites today',
			data: [${data.join(',')}],
			borderColor: '${color}',
			backgroundColor: '${color}33',
			barThickness: ${barHeight},
		}],
	}
	const config${label} = {
		type: 'bar',
		data: data${label},
		options: {
			indexAxis: 'y',
			elements: {
				bar: {borderWidth: 2},
			},
			responsive: true,
			plugins: {legend: {display: false}},
			scales: {y: {beginAtZero: true}},
			maintainAspectRatio: false,
		},
	}
	new Chart(ctx${label}, config${label})
	</script>
`
}

