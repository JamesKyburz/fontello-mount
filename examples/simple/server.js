var http = require('http')
var mount = require('../../')
var config = require('./fontello-config')
var fs = require('fs')
var path = require('path')

mount(config, start)

function start (err, fontello) {
  customExample(err, fontello)
  var server = http.createServer()
  server.on('request', function (q, r) {
    log(q, r)
    if (index(q, r)) return
    if (fontello(q, r)) return
    notFound(q, r)
  })
  server.listen(1600, console.log.bind(console, 'running http://localhost:1600'))
}

function customExample (err, fontello) {
  if (err) return console.error(err)
  // fontello.files fontello assets
  // fontello.types mime types
  // fontello is also the default router
  var server = http.createServer()
  server.on('request', function (q, r) {
    log(q, r)
    if (index(q, r)) return
    if (fontelloCustomRouter(q, r)) return
    notFound(q, r)
  })
  server.listen(1601, console.log.bind(console, 'running http://localhost:1601'))
  function fontelloCustomRouter (q, r) {
    console.log('custom fontello router for %s', q.url)
    var key = q.url.split('?')[0]
    var file = fontello.files[key]
    if (!file) return
    r.setHeader('content-type', fontello.types[key])
    r.end(file)
    return true
  }
}

function log (q, r) {
  console.log(q.url)
}

function index (q, r) {
  if (q.url === '/') {
    r.setHeader('content-type', 'text/html')
    fs.createReadStream(path.join(__dirname, '/index.html')).pipe(r)
    return true
  }
  return false
}

function notFound (q, r) {
  console.log('not found %s', q.url)
  r.writeHead(404)
  r.end()
}
