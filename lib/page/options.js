import {createHead, createFooter} from './common.js'


export function createOptions() {
	return `${createHead('LibreCounter Options')}
	<header>
		<h1 class="title">
		<a href="/" class="imageLink"><img src="/img/isologo-brown.svg" alt="LibreCounter isologo: logo + title" /></a>
		Options
		</h1>
		<p>
		There are a few visualization and accounting options.
		</p>
	</header>
	<article>

		<h2>Old Style Counter</h2>
		<p>
		This style is an homage to old-time counters,
		but with <a href="/">LibreCounter</a> stats.
		</p>
		<img src="/oldStyle.svg" referrerPolicy="unsafe-url" class="oldStyle" />
		<p>
		Watch the counter grow every time you reload the page!
		</p>
		<p>
		To use it, simply add the following HTML snippet to your site:
		</p>
		<textarea disabled rows="3" cols="80">
<a href="https://librecounter.org/referer/show" target="_blank">
<img src="https://librecounter.org/oldStyle.svg" referrerPolicy="unsafe-url" />
</a></textarea>

		<h2>Unique Visitors</h2>
		<p>
		If you want to count unique visitors to your website instead of page views,
		just add <code>unique.svg</code> to your site instead of <code>counter.svg</code>:
		</p>
		<textarea disabled rows="3" cols="80">
<a href="https://librecounter.org/referer/show" target="_blank">
<img src="https://librecounter.org/unique.svg" referrerPolicy="unsafe-url" />
</a></textarea>
		<p>
		This makes LibreCounter send the header <code>cache-control: max-age=1800, private</code>,
		so that the image is cached in your browser across multiple page views,
		for half an hour.
		</p>

		<h2>Hidden Counter</h2>
		<p>
		If you prefer your stats to be hidden the HTML snippet to add is even simpler:
		</p>
		<textarea disabled rows="2" cols="80">
<img src="https://librecounter.org/counter.svg" referrerPolicy="unsafe-url" width="0" /></textarea>
		<p>
		Keep in mind that your stats may still appear in the list of top sites on the home page.
		</p>

		<h2>Bring Your Own Style</h2>
		<p>
		If you would like to have a custom style for your site,
		why not <a href="https://github.com/alexfernandez/librecounter">create it yourself?</a>
		Pull requests are welcome!
		</p>
	</article>
${createFooter()}`
}

