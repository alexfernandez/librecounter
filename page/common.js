

export function createHead(title) {
	return `<!DOCTYPE html>
<html>
<head>
	<meta charset="utf-8" />
	<meta name="viewport" content="width=device-width, minimum-scale=1">
	<title>${title}</title>
	<link rel="shortcut icon" href="/favicon.png">
	<link rel="stylesheet" href="/main.css">
	<script src="https://librecounter.org/js/chart.js"></script>
	<script src="https://librecounter.org/js/chartjs-plugin-datalabels@2.js"></script>
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
		© 2024-2026 <a href="https://pinchito.es/">Alex "pinchito" Fernández</a> and <a href="https://github.com/alexfernandez/librecounter/graphs/contributors">contributors</a>.
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

