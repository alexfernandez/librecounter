

export function createHead(title) {
	return `<!DOCTYPE html>
<html>
<head>
	<meta charset="utf-8" />
	<meta name="viewport" content="width=device-width, minimum-scale=1">
	<title>${title}</title>
	<link rel="shortcut icon" href="/favicon.png">
	<link rel="stylesheet" href="/main.css">
	<script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
	<script src="https://cdn.jsdelivr.net/npm/chartjs-plugin-datalabels@2"></script>
	<script>
	${configureChartJs()}
	</script>
</head>
<body>
`
}

export function createFooter() {
	return `
	<footer>
		© 2024 <a href="https://github.com/alexfernandez/librecounter/graphs/contributors">Alex "pinchito" Fernández and contributors</a>.
		<br />
		Visual identity and "eye of Horus" logo contributed by <a href="https://fullcircle.es/">Fullcircle</a>.
		<br />
		See <a href="https://github.com/alexfernandez/librecounter/">project details</a>.
	</footer>

</body>
</html>`
}

function configureChartJs() {
	return `Chart.register(ChartDataLabels)
	const plugin = {
		id: 'background',
		beforeDraw: (chart, args, opts) => {
			if (!opts.color) {
				return;
			}
			const {ctx, chartArea} = chart;
			ctx.fillStyle = opts.color;
			ctx.fillRect(chartArea.left, chartArea.top, chartArea.width, chartArea.height)
		}
	}
	Chart.register(plugin)`
}

