<img src="public/img/isologo-brown.svg" alt="Logo for librecounter" width="280" />

# LibreCounter Stats

Free, libre and open website statistics.
GDPR compliant: no cookies, no tracking done in the browser,
no IP addresses stored, no marketing or advertising done (or even possible).

LibreCounter provides website traffic analysis and statistics for free at 
[librecounter.org](https://librecounter.org/).

## How to Use

Simply add the following snippet to your website,
in all pages that you want analyzed:

```html
<a href="https://librecounter.org/referer/show">
<img src="https://librecounter.org/counter.svg" referrerpolicy="unsafe-url" alt="Logo for librecounter/>
</a>
```

After that stats will be collected for every page view,
and users clicking on the logo will be taken to
[https://librecounter.org/[site]/show](https://librecounter.org/[site]/show)
replacing `[site]` with your domain name.
Stats will be public for all your visitors to see.

![Example stats using LibreCounter.](https://github.com/alexfernandez/librecounter/assets/876570/b32839b4-369a-4e86-801e-ce034f2920f1)

That is it! No configuration needed on the server at all.
You can see an example on [the author's blog](https://pinchito.es/).

Technical details: the `referrerPolicy` is added to make sure that the browser sends the whole page URL to the server,
otherwise sometimes it only sends the website (as `https://example.org/`)
so LibreCounter cannot know which page the user is visiting.

Keep in mind that stats are still open for anyone that knows that you are using it,
by following the link to https://librecounter.org/[example.org]/show.
There is currently no way to make the stats private.
If you want to hide stats for a sensitive domain
(like an integration domain you don't want to show),
please let [the author](https://github.com/alexfernandez/)
know to add it to the hide list so that stats are not stored at all.

There are a host of visualiation options on the [official website](https://librecounter.org/options).

## API

The API allows you to count visits and to get stats.

### `/count`

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

### `/[site]/siteStats`

Get stats for your site. Replace `[site]` with the domain for your site like `example.org`.
For instance:

    https://librecounter.org/example.org/siteStats

Parameters:

* `days`: number of last days to get, default 30.

### `/[site]/pageStats`

Deprecated and removed in v2.0: this API call was broken.

## The Project

It's a simple project with less than 1000 lines of code on 2024-01-14.
It uses the free IP database from Maxmind via
[`geoip-lite`](https://npmjs.com/package/geoip-lite),
and the awesome package [`node-device-detector`](https://www.npmjs.com/package/node-device-detector).
No data is leaked outside as all lookups are done locally.

### Server Installation

To run your own instance simply download the repo and install all dependencies:

```shell
git clone https://github.com/alexfernandez/librecounter
npm install
npm start
```

That should do it!
For no-hassle use please use the [official website](https://librecounter.org/).

### Server Configuration

You can create a file `.env` and add it at the root of the project,
with the following variables in the usual [dotenv format](https://www.npmjs.com/package/dotenv):

* `BACKEND_SQLITE_DB`: path to SQLite database to use, default value: `local.db`.
* `BACKEND_DOMAIN_HIDELIST`: comma-separated list of domains to hide:
not store or show stats at all. Default value: empty string.

## Analytics, Counter or Tracking?

LibreCounter is a small step beyond the old website counters
that kept track of how many people had visited to your website.
It stores analytics for those visitors:
by day, page, country of origin, browser and OS.

LibreCounter performs **no tracking**: it does not keep track of what visitors did on your site,
just counts independent visits to each page.
Personal information is not correlated between page visits.
In particular, user agents and IP addresses and user agents are not stored at all.
(But see [Tracking](doc/tracking.md) for more specific info.)

## Data Stored

In case you want to audit what data is stored per page view,
all technical details are in
[the class `Counter`](https://github.com/alexfernandez/librecounter/blob/main/core/counter.js):

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

If you want the package to support your favorite feature please open a merge request.

## Known Limitations

Some characters can be modified in pages when displayed:
the small dollar sign `﹩` is replaced by the regular dollar sign `$`,
and the leading dot `․` by the regular dot `.'.
This was done originally to sidestep
[limitations in MongoDB field names](https://stackoverflow.com/questions/12397118/mongodb-dot-in-key-name),
and has not been changed yet.

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
However, if your use case requires it I may provide a full code audit to verify the running code.

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

(C) 2023-2024 [Alex Fernández](https://pinchito.es/) and [contributors](https://github.com/alexfernandez/librecounter/graphs/contributors).
Visual identity contributed by [Fullcircle](https://fullcircle.es/).
Licensed under the [GPLv3](https://www.gnu.org/licenses/gpl-3.0.en.html),
which in a nutshell means that you should make the code public if you distribute it.
No need to do anything if you just run it on your own website.

