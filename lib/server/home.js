import {promises as fs} from 'fs'
import {readLatestSites} from '../db/stats.js'

const favicon = await fs.readFile('doc/favicon.png')


export default async function setup(app) {
	app.get('/', home)
	app.get('/favicon.ico', serveFavicon)
	app.get('/favicon.png', serveFavicon)
}

async function serveFavicon(request, reply) {
	reply.type('image/png')
	return favicon
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
<html>
<head>
	<title>LibreCounter: free, libre counter stats</title>
	<link rel="shortcut icon" href="/favicon.png">
	<script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
</head>
<body>
	<img src="/counter.svg">
	<h1>LibreCounter package</h1>
	<p>
	Free, libre, open source software to show analytics for your site.
	No configuration required.
	<h2>Top Sites Today</h2>
	<div>
	<canvas id="top-sites" height="${height}"></canvas>
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
	<h2>How to Use</h2>
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

	<!-- courtesy of https://codepo8.github.io/css-fork-on-github-ribbon/ -->
	<style>#forkongithub a{background:#000;color:#fff;text-decoration:none;font-family:arial,sans-serif;text-align:center;font-weight:bold;padding:5px 40px;font-size:1rem;line-height:2rem;position:relative;transition:0.5s;}#forkongithub a:hover{background:#c11;color:#fff;}#forkongithub a::before,#forkongithub a::after{content:"";width:100%;display:block;position:absolute;top:1px;left:0;height:1px;background:#fff;}#forkongithub a::after{bottom:1px;top:auto;}@media screen and (min-width:800px){#forkongithub{position:fixed;display:block;top:0;right:0;width:200px;overflow:hidden;height:200px;z-index:9999;}#forkongithub a{width:200px;position:absolute;top:60px;right:-60px;transform:rotate(45deg);-webkit-transform:rotate(45deg);-ms-transform:rotate(45deg);-moz-transform:rotate(45deg);-o-transform:rotate(45deg);box-shadow:4px 4px 10px rgba(0,0,0,0.8);}}</style><span id="forkongithub"><a target="_blank" href="https://github.com/alexfernandez/librecounter">Fork me on GitHub</a></span>
</body>
</html>
`
}

