![Logo for librecounter](public/librecounter.svg)

# librecounter

Free, libre and open website statistics.
GDPR compliant: no cookies, no tracking done in the browser,
no IP addresses stored, no marketing or advertising done (or even possible).

# Website Counter

LibreCounter provides website traffic analysis and statistics for free at 
[librecounter.org](https://librecounter.org/).

## How to Use

Simply add the following snippet to your website,
in all pages that you want analyzed:

```html
<a href="https://librecounter.org/example.org/show">
<img src="https://librecounter.org/counter.svg" referrerPolicy="unsafe-url">
</a></textarea>
```

Replacing `example.org` with your website domain.
After that, you can visit
[https://librecounter.org/example.org/show](https://librecounter.org/example.org/show)
to see your stats,
and they will be public for all your visitors to see.

That is it! No configuration needed on the server at all.
You can see an example on [the author's blog](https://pinchito.es/).

Technical details: the `referrerPolicy` is added to make sure that the browser sends the whole page URL to the server,
otherwise sometimes it only sends the website (as `https://example.org/`)
so LibreCounter cannot know which page the user is visiting.

If you don't want visitors to have direct access to your stats
you can hide the image and remove the link,
for instance with this snippet:

```html
<img src="https://librecounter.org/counter.svg" referrerPolicy="unsafe-url" style="display: none">
```

Keep in mind that stats are still open for anyone that knows that you are using it,
by following the link to https://librecounter.org/example.org/show.
There is currently no way to make the stats private.

## Unique Visitors

If you want to count unique visitors to your website instead of page views,
just add `unique.svg` to your site instead of `counter.svg`:

```html
<a href="https://librecounter.org/example.org/show">
<img src="https://librecounter.org/unique.svg" referrerPolicy="unsafe-url">
</a></textarea>
```

Again replacing `example.org` with your website domain.
This makes LibreCounter send the header `cache-control: max-age=1800, private`
so that the image is cached in your browser across multiple page views,
for half an hour.

## API

If you want to count a visit but don't want to add an image,
or just cannot,
you can use the endpoint `/count`. For instance:

    https://librecounter.org/count?url=http://example.org/mypage&userAgent=roboto/1.0

Invoking this endpoint will count as a visit to the site `example.org`, page `/mypage`,
with userAgent `roboto/1.0`.
You can in fact use whatever programming language to invoke the endpoint,
even a simple `wget` will do:

```shell
wget https://librecounter.org/count?url=http://example.org/mypage&userAgent=roboto/1.0
```

Be sure to URL-encode the URL and user agent parameters or they will be chopped up as part of the query string.

# The Project

It's a super-simple project with 238 lines of code at the time of writing, 2023-10-02.
It uses the free IP database from Maxmind via
[`geoip-lite`](https://npmjs.com/package/geoip-lite),
and the awesome package [`node-device-detector`](https://www.npmjs.com/package/node-device-detector).
No data is leaked outside as all lookups are done locally.

## Server Installation

To run your own instance simply download the repo and install all dependencies:

```shell
git clone https://github.com/alexfernandez/librecounter
npm install
npm start
```

That should do it!

## Analytics, Counter or Tracking?

LibreCounter is a small step beyond the old website counters
that kept track of how many people had visited to your website.
It stores analytics for those visitors:
by day, page, country of origin, browser and OS.

LibreCounter performs **no tracking**: it does not keep track of what visitors did on your site,
just counts independent visits to each page.
IP addresses or user agents are not correlated between page visits.
In particular, IP addresses and user agents are not stored at all.

## Data Stored

In case you want to audit what data is stored per page view,
all technical details are in
[the class `Counter`](https://github.com/alexfernandez/librecounter/blob/main/lib/core/counter.js):

* day of the view (as 2023-10-06),
* country of origin (as read from the IP address by [geoip-lite](https://www.npmjs.com/package/geoip-lite)),
* site and page visited,
* type of device (desktop, smartphone, tablet..),
* browser used (Chrome, Firefox, Safari...),
* operating system (Windows, GNU/Linux, Android...),
* and platform (x64, x32, amd...).

That is it!
The package [geoip-lite](https://www.npmjs.com/package/geoip-lite)
is used for reading the country locally: no data leaves the server.
For device identification the package
[node-device-detector](https://www.npmjs.com/package/node-device-detector)
is used, again locally so no data leaves the server.

## Help Wanted

The logo and the design are quite amateur;
if you feel like it please send a pull request improving it.

## Known Limitations

Some characters can be modified in pages when displayed:
the small dollar sign `﹩` is replaced by the regular dollar sign `$`,
and the leading dot `․` by the regular dot `.'.
This is done to sidestep
[limitations in MongoDB field names](https://stackoverflow.com/questions/12397118/mongodb-dot-in-key-name).

# Rationale

The idea of creating free and open stats came after the GDPR:
it became quite obnoxious to add something like Google Analytics to your webpage,
with the cookie warning.
Also Google Analytics became more and more obnoxious itself,
to the point where it looks like Google is not interested in having people use their free product.

Other tools are usually expensive,
and still have in-browser tracking.
Sadly neither [GitHub](https://github.com/orgs/community/discussions/31474)
nor [Gitlab](https://gitlab.com/gitlab-org/gitlab-pages/-/issues/189)
provide server-side analytics.

LibreCounter does server-side analytics,
no cookies, free software, open for everyone to use.

## ePrivacy Directive

The [ePrivacy directive](https://eur-lex.europa.eu/legal-content/EN/TXT/HTML/?uri=CELEX%3A32002L0058)
of 2002 is even more strict than the GDPR.
In article 6 it states that traffic data should be deleted or anonymized right away.
LibreCounter does not store traffic data (user agent, IP address),
just anonymized aggregates.

## Guarantees

The code is running on a private server using Linode (now Akamai).
There are no guarantees of any kind:
I intend to provide this service to the community as long as I am able to do it.
Since you are just adding an external image you should not have any GDPR obligations,
the operator of the private server does (i.e. myself).
Always a good idea to consult with your lawyers if you want to be sure though.

You can bring up your own instance since the code is completely free.

## Eye of Horus

The logo is a play on the [eye of Horus](https://en.wikipedia.org/wiki/Eye_of_Horus),
to give you special powers of observation
and at the same time bring protection to your website against the GDPR.
It also helps ward off from people trying to profit from your visitors.

## Copyright

(C) 2023 Alex Fernández.
Licensed under the [GPLv3](https://www.gnu.org/licenses/gpl-3.0.en.html),
which in a nutshell means that you should make the code public if you distribute it.
No need to do anything if you just run it on your own website.

