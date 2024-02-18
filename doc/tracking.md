# LibreCounter.org Tracking

In-depth information about tracking for GDPR compliance.

## Server Information

The LibreCounter.org domain is served in a Linode Nanode 1GB instance,
managed by the author, [Alex "pinchito" Fernández](https://pinchito.es/).
This server routes all requests through an [nginx](https://nginx.com/) instance,
which stores IP addresses in its log files.
This information is legitimately used only for diagnosis purposes:
diagnose DoS or DDoS attacks and network issues.
It is only stored for 10 days and then deleted automatically.
User agents are not stored.

Linode infrastructure can of course see the traffic,
but it is not correlated with which sites are visited.

## Other Trackers

LibreCounter is tracker free:
neither [Privacy Badger](https://privacybadger.org/) nor
[uBlock Origin](https://chromewebstore.google.com/detail/ublock-origin/cjpalhdlnbpafiamejdnhcphjbkeiagm?pli=1)
nor Firefox's integrated protection report any trackers.

![image](https://github.com/alexfernandez/librecounter/assets/876570/4b0c296f-ab74-414a-bb9f-59f22d2c5f2b "Privacy Badger: no trackers found")
![image](https://github.com/alexfernandez/librecounter/assets/876570/ed3e2165-8037-4d65-88c9-b8e78a7fb1b9 "uBlock Origin: Blocked on this page: 0")
![image](https://github.com/alexfernandez/librecounter/assets/876570/8958f48e-bea2-4816-82ac-a3ae44977b23 "No trackers known to Firefox were found on this page")

On 2024-02-18 the author noticed that EFF's [Privacy Badger](https://privacybadger.org/) was reporting one tracker:

![image](https://github.com/alexfernandez/librecounter/assets/876570/a6e629a9-857c-46b2-b50a-ffb084b0320b "1 potential tracker blocked: cdn.jsdelivr.net")

Specifically these two lines in every page:

```
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/chartjs-plugin-datalabels@2"></script>
```

So they were removed in favor of locally served files from librecounter.org.

If you find any tracker is active on any page from the domain
[librecounter.org](https://librecounter.org/) please report it and it will be fixed ASAP.
We take your privacy seriously.

## Audit

Should you need an audit to use LibreCounter on your site
please let [the main author](https://github.com/alexfernandez) know
and if at all possible it will be arranged.
