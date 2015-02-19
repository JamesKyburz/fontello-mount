# fontello-mount

mount fontello assets in a http route without files

# example

``` js
var mount = require('fontello-mount')
var stack = require('stack');
var config = require('./fontello-config');
var fontello = mount(config, start);

function start() {
  var server = http.createServer(stack(
    fontello,
    index,
    notFound
  ));
  server.listen(1600, console.log.bind(console, 'running http://localhost:1600'));
}
```

# methods

## mount(config, cb)

`config` json or string (fontello config.json contents)
`cb` ```function(err, router)```

# install

With [npm](https://npmjs.org) do:

```
npm install fontello-mount
```

# license

MIT
