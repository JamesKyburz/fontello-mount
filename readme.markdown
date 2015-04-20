# fontello-mount

mount fontello assets in a http route without files

# example

``` js
var http = require('http');
var mount = require('fontello-mount');
var config = require('./fontello-config');

mount(config, start);

function start(err, fontello) {
  var server = http.createServer();
  server.on('request', function(q, r) {
    log(q, r);
    if (index(q, r)) return;
    if (fontello(q, r)) return;
    notFound(q, r);
  });
  server.listen(1600, console.log.bind(console, 'running http://localhost:1600'));
}
```

# methods

## mount(config, [opt], cb)

`config` json or string (fontello config.json contents)

`opt` optional options `cachePath` or `cache` for custom cache

if `opt.cachePath` is specified cache to disk will be attempted using a
hash of the fontello config as key

`cb` ```function(err, router, assets)```

`assets` contains files and types from fontello assets

# install

With [npm](https://npmjs.org) do:

```
npm install fontello-mount
```

# license

MIT
