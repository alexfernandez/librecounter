import {getTop10} from '../core/format.js'
import {createHead, createFooter} from './common.js'


export function createStatsPage(site, stats) {
	return `
	${createHead(`LibreCounter Stats for ${site}`)}
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
				${createHorizontalChart(stats.byPage, 'pages', '#3300ff')}
			</div>
			<div class="graph">
				<h2>Stats per country</h2>
				${createHorizontalChart(stats.byCountry, 'countries', '#cc6666')}
			</div>
			<div class="graph">
				<h2>Stats per browser</h2>
				${createHorizontalChart(stats.byBrowser, 'browsers', '#66cc66')}
			</div>
			<div class="graph">
				<h2>Stats per OS</h2>
				${createHorizontalChart(stats.byOs, 'os', '#cccc66')}
			</div>
		</div>
	</article>
${createFooter()}
`
}

function createTimeSeries(stats) {
	if (!stats.length) {
		return 'No stats yet'
	}
	const canvasId = 'chart-time'
	stats.sort((a, b) => a.day.localeCompare(b.day))
	const labels = stats.map(site => site.day)
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
	const {labels, data} = massageMap(map)
	const barHeight = 30
	const height = (barHeight + 10) * (data.length + 1)
	const canvasId = 'chart-' + label
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

function massageMap(map) {
	const stats = Object.entries(map).map(([key, value]) => ({key, value}))
	return getTop10(stats)
}

