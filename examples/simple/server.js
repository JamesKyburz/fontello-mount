var http = require('http');
var stack = require('stack');
var mount = require('../../');
var config = require('./fontello-config');
var fs = require('fs');
var fontello = mount(config, start);

function start() {
  var server = http.createServer(stack(
    log,
    fontello,
    index,
    notFound
  ));
  server.listen(1600, console.log.bind(console, 'running http://localhost:1600'));
}

function log(q, r, next) {
  console.log(q.url);
  next();
}

function index(q, r, next) {
  if (q.url === '/') {
    r.setHeader('content-type', 'text/html');
    fs.createReadStream(__dirname + '/index.html').pipe(r);
    return;
  }
  next();
}

function notFound(q, r) {
  console.log('not found %s', q.url);
  r.writeHead(404);
  r.end();
}
