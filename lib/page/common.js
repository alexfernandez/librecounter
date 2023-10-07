

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
</head>
<body>
`
}

export function createFooter() {
	return `
	<footer>
		© 2023 <a href="https://github.com/alexfernandez/librecounter/graphs/contributors">Alex Fernández and contributors</a>.<br />
		See <a href="https://github.com/alexfernandez/librecounter/">project details</a>.
	</footer>

</body>
</html>`
}

