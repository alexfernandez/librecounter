import {createHead, createFooter} from './common.js'


export function createOptions() {
	return `${createHead('LibreCounter Options')}
	<header>
		<div class="logo">
		<a href="/" class="imageLink"><img src="/img/isologo-brown.svg" alt="LibreCounter isologo: logo + title" /></a>
		</div>
		<h1 class="title">
		Analytics Options
		</h1>
		<p>
		There are a few visualization and accounting options that you can control.
		</p>
	</header>

	<article>
		<h2>Default</h2>
		The default style is to show a logotype
		(technically an <a href="https://en.wikipedia.org/wiki/Isotype_(picture_language)">isotype</a>),
		with brown background and white symbols.
		To use it, simply add the following HTML snippet to your site:
		<textarea disabled rows="3" cols="80">
<a href="https://librecounter.org/referer/show" target="_blank">
<img src="https://librecounter.org/counter.svg" referrerPolicy="unsafe-url" />
</a></textarea>

		<h2>Color and Style</h2>
		<p>
		To match your site better you can choose from a variety of colors,
		all within the Egyptian theme:
		<tt>brown</tt>, <tt>orange</tt>, <tt>yellow</tt> and sometimes <tt>white</tt>.
		You can also pick your favorite style.
		</p>
		<p>
		<tt>solid</tt> (default):
		<img src="/img/solid-brown.svg">
		<img src="/img/solid-orange.svg">
		<img src="/img/solid-yellow.svg">
		</p>

		<p>
		<tt>white</tt>:
		<img src="/img/white-brown.svg">
		<img src="/img/white-orange.svg">
		<img src="/img/white-yellow.svg">
		</p>

		<p>
		<tt>outline</tt>:
		<img src="/img/outline-brown.svg">
		<img src="/img/outline-orange.svg">
		<img src="/img/outline-yellow.svg">
		<img src="/img/outline-white.svg">
		</p>

		<p><tt>isologo</tt>:
		<img class="isologo" src="/img/isologo-brown.svg">
		<img class="isologo" src="/img/isologo-orange.svg">
		<img class="isologo" src="/img/isologo-yellow.svg">
		</p>

		<p>
		To add to your site just pick style and color and join them with a dash:
		<tt>[style]-[color].svg</tt>,
		and use this instead of <tt>counter.svg</tt>.
		E.g. <tt>outline-orange.svg</tt> will give you an outline in orange:
		</p>
		<textarea disabled rows="3" cols="80">
<a href="https://librecounter.org/referer/show" target="_blank">
<img src="https://librecounter.org/outline-orange.svg" referrerPolicy="unsafe-url" />
</a></textarea>

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

