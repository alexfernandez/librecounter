import {getTop10} from '../core/format.js'
import {createHead, createFooter} from './common.js'


export function createStatsPage(query, stats) {
	const days = query.days == 1 ? 'day' : `${query.days} days`
	return `${createHead(`LibreCounter Stats for ${query.site}`)}
	<header>
		<h1 class="title">
		<a href="/" class="imageLink"><img src="/img/isologo-brown.svg" alt="LibreCounter isologo: logo + title" /></a>
		— ${query.site}
		</h1>
	</header>
	<article>
		<p>
		Showing data for the last ${days}.
		</p>
		<div class="graph">
			<h2>Stats per day</h2>
			${createTimeSeries(stats.byDay)}
		</div>
		<div class="graphs">
			<div class="graph">
				<h2>Stats per page</h2>
				${createHorizontalChart(stats.byPage, 'pages', '#934147')}
			</div>
			<div class="graph">
				<h2>Stats per country</h2>
				${createHorizontalChart(stats.byCountry, 'countries', '#cc7658')}
			</div>
			<div class="graph">
				<h2>Stats per browser</h2>
				${createHorizontalChart(stats.byBrowser, 'browsers', '#dbaf61')}
			</div>
			<div class="graph">
				<h2>Stats per OS</h2>
				${createHorizontalChart(stats.byOs, 'os', '#507589')}
			</div>
		</div>
	</article>
${createFooter()}`
}

function createTimeSeries(stats) {
	if (!stats?.length) {
		return 'No stats yet'
	}
	const canvasId = 'chart-time'
	stats.sort((a, b) => a.day.localeCompare(b.day))
	const labels = stats.map(dayStats => dayStats.day)
	const data = stats.map(dayStats => dayStats.value)
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
			borderColor: '#934147',
			borderWidth: 1,
			datalabels: {
				align: 'top',
			},
		}],
	}
	const config = {
		type: 'line',
		data: data,
		options: {
			responsive: true,
			elements: {point: {pointStyle: false}},
			layout: {padding: {top: 30}},
			scales: {
				x: {
					grid: {display: false},
					ticks: {major: {enabled: false}},
				},
				y: {
					grid: {display: false},
					ticks: {major: {enabled: false}},
					beginAtZero: true,
				},
			},
			plugins: {
				legend: {display: false},
			},
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
	const barHeight = 25
	const height = (barHeight + 15) * (data.length + 1)
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
			backgroundColor: '${color}ff',
			barThickness: ${barHeight},
			borderWidth: 0,
			datalabels: {
				anchor: 'end',
				align: 'right',
			},
		}],
	}
	const config${label} = {
		type: 'bar',
		data: data${label},
		options: {
			indexAxis: 'y',
			responsive: true,
			maintainAspectRatio: false,
			layout: {padding: {right: 30}},
			plugins: {
				legend: {display: false},
			},
			scales: {
				x: {
					grid: {display: false},
					ticks: {major: {enabled: false}},
				},
				y: {
					grid: {display: false},
					ticks: {major: {enabled: false}},
					beginAtZero: true,
				},
			},
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

