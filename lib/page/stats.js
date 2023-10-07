import {getTop10} from '../core/format.js'
import {createHead, createFooter} from './common.js'


export function createStatsPage(query, stats) {
	const days = query.days == 1 ? 'day' : `${query.days} days`
	return `${createHead(`LibreCounter Stats for ${query.site}`)}
	<header>
		<h1 class="title">
		<a href="/" class="imageLink"><img src="/counter.svg" style="vertical-align:middle"></a>
		LibreCounter — ${query.site}
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
				${createHorizontalChart(stats.byPage, 'pages', '#cc7722')}
			</div>
			<div class="graph">
				<h2>Stats per country</h2>
				${createHorizontalChart(stats.byCountry, 'countries', '#913831')}
			</div>
			<div class="graph">
				<h2>Stats per browser</h2>
				${createHorizontalChart(stats.byBrowser, 'browsers', '#edb525')}
			</div>
			<div class="graph">
				<h2>Stats per OS</h2>
				${createHorizontalChart(stats.byOs, 'os', '#0060ae')}
			</div>
		</div>
	</article>
${createFooter()}`
}

function createTimeSeries(stats) {
	if (!stats.length) {
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
			borderColor: '#6c3b00ff',
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
			backgroundColor: '${color}85',
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
			elements: {
			},
			responsive: true,
			maintainAspectRatio: false,
			plugins: {legend: {display: false}},
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

