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

Recently I noticed that EFF's [Privacy Badger](https://privacybadger.org/) was reporting one tracker:

![image](https://github.com/alexfernandez/librecounter/assets/876570/a6e629a9-857c-46b2-b50a-ffb084b0320b "1 potential tracker blocked: cdn.jsdelivr.net")

Specifically these two lines in every page:

```
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/chartjs-plugin-datalabels@2"></script>
```

So I 

