import {createHead, createFooter} from './common.js'


export function createOldStyle() {
	return `${createHead('LibreCounter Old Style')}
	<header>
		<h1 class="title">
		<a href="/" class="imageLink"><img src="/librecounter.svg" /></a>
		LibreCounter, Old Style
		</h1>
	</header>
	<article>
		<p>
		This page is an homage to old style counters,
		courtesy of <a href="/">LibreCounter</a>.
		</p>
		<img src="/oldStyle.svg" referrerPolicy="unsafe-url" class="oldStyle" />
		<p>
		Watch the counter grow every time you reload the page!
		</p>
		<h2>How to Use</h2>
		<p>
		Add the following HTML snippet to your site, replacing <code>example.org</code> with your domain name:
		</p>
		<textarea disabled rows="3" cols="80">
<a href="https://librecounter.org/example.org/show">
<img src="https://librecounter.org/oldStyle.svg" referrerPolicy="unsafe-url" />
</a></textarea>
		<p>
		That's it!
		Your stats will start appearing at <a href="https://librecounter.org/example.org/show">librecounter.org/example.org/show</a>,
		again replacing <code>example.org</code> with your domain name.
		</p>
	</article>
${createFooter()}`
}

