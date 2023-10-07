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
	Chart.register(ChartDataLabels)
	const plugin = {
  id: 'background',
  beforeDraw: (chart, args, opts) => {
	if (!opts.color) {
	  return;
	}

	const {
	  ctx,
	  chartArea
	} = chart;

	ctx.fillStyle = opts.color;
	ctx.fillRect(chartArea.left, chartArea.top, chartArea.width, chartArea.height)
  }
}
Chart.register(plugin)
	const ctx = document.getElementById('${canvasId}')
	const data = {
		labels: ['${labels.join("','")}'],
		datasets: [{
			label: 'Daily stats',
			data: [${data.join(',')}],
			fill: false,
			borderColor: '#6c3b00ff',
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
				background: {color: '#f5f5f5'},
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

