import {promises as fs} from 'fs'
import {readLatestSites} from '../db/stats.js'


export default async function setup(app) {
	app.get('/', home)
	app.get('/favicon.ico', await serveFile('public/favicon.png', 'image/png'))
	app.get('/favicon.png', await serveFile('public/favicon.png', 'image/png'))
	app.get('/main.css', await serveFile('public/main.css', 'text/css'))
}

async function serveFile(path, mime) {
	let file = await fs.readFile(path)
	let lastModified = (await fs.stat(path)).mtimeMs
	return async function(request, reply) {
		const since = (await fs.stat(path)).mtimeMs
		if (since > lastModified) {
			console.log(`Reloading ${path}`)
			file = await fs.readFile(path)
		}
		reply.type(mime)
		return file
	}
}

/**
 * Request: no parameters.
 * Response: home page.
 * No auth required.
 */
async function home(request, reply) {
	const latestSites = await readLatestSites()
	latestSites.sort((a, b) => b.value - a.value)
	const barHeight = 30
	const labels = latestSites.map(site => site.key)
	const data = latestSites.map(site => site.value)
	const height = barHeight * (data.length + 2)
	reply.type('text/html')
	return `
<!DOCTYPE html>
<html>
<head>
	<meta charset="utf-8" />
	<title>LibreCounter: free, libre counter stats</title>
	<link rel="shortcut icon" href="/favicon.png">
	<link rel="stylesheet" href="/main.css">
	<script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
</head>
<body>
	<header>
		<h1>
		<img src="/counter.svg" style="vertical-align:middle"/>
		LibreCounter package
		</h1>
		<p>
		Free, <a href="https://github.com/alexfernandez/librecounter/">libre, open source software</a> to show analytics for your site.
		No configuration required.
		</p>
	</header>
	<article>
		<h2>Top Sites Today</h2>
		<div>
		<canvas id="top-sites" height="${height}px"></canvas>
		</div>
		<script>
		const ctx = document.getElementById('top-sites')
		const data = {
			labels: ['${labels.join("','")}'],
			datasets: [{
				label: 'Top sites today',
				data: [${data.join(',')}],
				borderColor: '#3366ff',
				backgroundColor: '#3366ff33',
				barThickness: ${barHeight},
			}],
		}
		const config = {
			type: 'bar',
			data,
			options: {
				indexAxis: 'y',
				elements: {bar: {borderWidth: 2}},
				responsive: true,
				plugins: {legend: {display: false}},
				scales: {y: {beginAtZero: true}},
				maintainAspectRatio: false,
			},
		}
		new Chart(ctx, config)
		</script>
		<table>
			<thead>
				<tr>
				<th>Site</th>
				<th>Clicks</th>
				</tr>
			</thead>
			<tbody>
				${createRows(latestSites)}
			</tbody>
		<table>
		<h2>How to Use</h2>
		<p>
		Add the following HTML snippet to your site:
		</p>
		<textarea disabled rows="4" cols="80">
<a href="https://librecounter.org/example.org/show">
<img src="https://librecounter.org/counter.svg" referrerPolicy="unsafe-url">
</a></textarea>
		<p>
		Replacing <code>example.org</code> with your domain.
		That's it!
		GDPR compliant by default: no browser tracking done,
		no IPs stored anywhere.
		</p>
	</article>

	<footer>
	© 2023 Alex Fernández and contributors. Licensed under the <a href="https://www.gnu.org/licenses/gpl-3.0.en.html">GPLv3</a>.
	</footer>

</body>
</html>
`
}

function createRows(latestSites) {
	return latestSites.map(site => `		<tr>
			<td>
				<a href="/${site.key}/show">${site.key}</a>
			</td>
			<td>${site.value}</td>
		</tr>`).join('\n')
}

