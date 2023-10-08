import {createHead, createFooter} from './common.js'


export function createStyles() {
	return `${createHead('LibreCounter Old Style')}
	<header>
		<h1 class="title">
		<a href="/" class="imageLink"><img src="/librecounter.svg" /></a>
		LibreCounter Styles
		</h1>
	</header>
	<article>
		<h2>Hidden Counter</h2>
		<p>
		If you prefer your stats to be hidden the HTML snippet to add is even simpler:
		</p>
		<textarea disabled rows="2" cols="80">
<img src="https://librecounter.org/counter.svg" referrerPolicy="unsafe-url" width="0" /></textarea>
		<p>
		Keep in mind that your stats may still appear in the list of top sites on the home page.
		</p>

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
		To use it, simply add the following HTML snippet to your site, replacing <code>example.org</code> with your domain name:
		</p>
		<textarea disabled rows="3" cols="80">
<a href="https://librecounter.org/example.org/show">
<img src="https://librecounter.org/oldStyle.svg" referrerPolicy="unsafe-url" />
</a></textarea>
		<h2>Bring Your Own Style</h2>
		<p>
		If you would like to have a custom style for your site,
		why not <a href="https://github.com/alexfernandez/librecounter">create it yourself?</a>
		Pull requests are welcome!
		</p>
	</article>
${createFooter()}`
}

