import {getTop10} from '../core/format.js'
import {createHead, createFooter} from './common.js'


export function createHome(latestSites) {
	const {sites, labels, data} = getTop10(latestSites)
	const barHeight = 25
	const height = (barHeight + 15) * (data.length + 1)
	return `${createHead('LibreCounter Stats')}
	<header>
		<div class="logo">
		<a href="/" class="imageLink"><img src="/isologo-brown.svg" alt="LibreCounter isologo: logo + title" referrerPolicy="unsafe-url" /></a>
		</div>
		<h1 class="title">
		GDPR Compliant Analytics for your Site
		</h1>
		<p>
		Free, <a href="https://github.com/alexfernandez/librecounter/">libre, open source</a>
		analytics for your site.
		No installation or configuration required.
		</p>
	</header>
	<article>
		<h2>Top Sites Today</h2>
		<div class="graphs">
			<div class="graph">
				<div class="canvas">
					<canvas id="top-sites" height="${height}px"></canvas>
				</div>
			</div>
		</div>
		<script>
		Chart.register(ChartDataLabels)
		const ctx = document.getElementById('top-sites')
		const data = {
			labels: ['${labels.join("','")}'],
			datasets: [{
				label: 'Page views today',
				data: [${data.join(',')}],
				borderColor: '#934147',
				backgroundColor: '#934147',
				barThickness: ${barHeight},
				borderWidth: 0,
				datalabels: {
					anchor: 'end',
					align: 'right',
				},
			}],
		}
		const config = {
			type: 'bar',
			data,
			options: {
				indexAxis: 'y',
				responsive: true,
				maintainAspectRatio: false,
				layout: {padding: {right: 30}},
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
		<table>
			<thead>
				<tr>
				<th>Site</th>
				<th>Page views</th>
				</tr>
			</thead>
			<tbody>
				${createRows(sites, data)}
			</tbody>
		</table>
		<h2>How to Use</h2>
		<p>
		Add the following HTML snippet to your site:
		</p>
		<textarea disabled rows="3" cols="80">
<a href="https://librecounter.org/referer/show" target="_blank">
<img src="https://librecounter.org/counter.svg" referrerPolicy="unsafe-url" />
</a></textarea>
		<p>
		That's it!
		Your stats will start to be collected with every page view.
		When a user clicks on the LibreCounter logo they will be taken to the stats collected
		at <code>https://librecounter.org/[site]/show</code>,
		where <code>[site]</code> is your domain name (e.g. <code>example.org</code>).
		</p>
		<p>
		There are <a href="/options">more options available</a>.
		</p>

		<h2>Compliance</h2>
		<p>
		LibreCounter is GDPR compliant by default:
		<a href="https://github.com/alexfernandez/librecounter/blob/main/doc/tracking.md">no browser tracking is done</a>,
		no personal information such as user agents or IP addresses stored.
		Also the <a href="https://eur-lex.europa.eu/legal-content/EN/TXT/HTML/?uri=CELEX%3A32002L0058">ePrivacy directive of 2002</a>
		should be covered:
		since no cookies are used you don't need to add a disclaimer to your site.
		But I probably do, so there it goes.
		</p>
		<h3>Disclaimer</h3>
		<p>
		Keep in mind that there are conflicting interpretations of these EU laws.
		Proceed at your own risk;
		and if in doubt just ask for consent anyway.
		Always a good idea to consult with your lawyers if you want to be in the clear.
		Let me know if you have any legal issues.
		</p>
	</article>
${createFooter()}`
}

function createRows(sites, data) {
	const rows = []
	for (let index = 0; index < sites.length; index++) {
		const label = sites[index]
		const row = `		<tr>
			<td>
				${label == '…rest' ? label : `<a href="/${sites[index]}/show">${sites[index]}</a>`}
			</td>
			<td>${data[index]}</td>
		</tr>`
		rows.push(row)
	}
	return rows.join('\n')
}

