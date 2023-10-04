import {shorten} from '../core/format.js'


export function createStatsPage(site, stats) {
	return `
<!DOCTYPE html>
<html>
<head>
	<meta charset="utf-8" />
	<meta name="viewport" content="width=device-width, minimum-scale=1">
	<title>LibreCounter stats for ${site}</title>
	<link rel="shortcut icon" href="/favicon.png">
	<link rel="stylesheet" href="/main.css">
	<script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
</head>
<body>
	<header>
		<h1 class="title">
		<a href="/"><img src="/counter.svg" style="vertical-align:middle"></a>
		LibreCounter — ${site}
		</h1>
	</header>
	<article>
		<div class="graph">
			<h2>Stats per day</h2>
			${createTimeSeries(stats.byDay)}
		</div>
		<div class="graphs">
			<div class="graph">
				<h2>Stats per page</h2>
				${createHorizontalChart(stats.page, 'pages', '#3300ff')}
			</div>
			<div class="graph">
				<h2>Stats per country</h2>
				${createHorizontalChart(stats.country, 'countries', '#cc6666')}
			</div>
			<div class="graph">
				<h2>Stats per browser</h2>
				${createHorizontalChart(stats.browser, 'browsers', '#66cc66')}
			</div>
			<div class="graph">
				<h2>Stats per OS</h2>
				${createHorizontalChart(stats.os, 'os', '#cccc66')}
			</div>
		</div>
	</article>
	<footer>
		© 2023 Alex Fernández and contributors. <br />
		Licensed under the <a href="https://www.gnu.org/licenses/gpl-3.0.en.html">GPLv3</a>.
	</footer>
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
	const labels = stats.map(site => site.key).map(shorten)
	const data = stats.map(site => site.value)
	return `
	<div class="canvas">
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
	const labels = stats.map(site => site.key).map(shorten)
	const data = stats.map(site => site.value)
	const height = (barHeight + 10) * (data.length + 1)
	return `
	<div class="canvas">
	<canvas id="${canvasId}" height="${height}px"></canvas>
	</div>
	<script>
	const ctx${label} = document.getElementById('${canvasId}')
	const data${label} = {
		labels: ['${labels.join("','")}'],
		datasets: [{
			label: 'visits',
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

