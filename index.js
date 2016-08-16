var download = require('fontello-download')
var mime = require('mime')
var cacheStore = require('./cache-store')
var once = require('once')
var debug = require('debug')('fontello-mount')

module.exports = mount
mount.router = router

function mount (config, opt, cb) {
  opt = opt || {}
  if (typeof opt === 'function') {
    cb = opt
    opt = {}
  }

  cb = once(cb)

  var store
  if (opt.cachePath || opt.cache) {
    store = opt.cache || cacheStore(config, opt.cachePath)
    store.get(load)
  } else {
    load(null)
  }

  function load (err, cache) {
    if (err) debug(err)
    if (cache) {
      cb(null, router(cache), cache)
    } else {
      download(config, buildCache)
    }
  }

  function buildCache (err, zip, contents) {
    if (err) return cb(err)
    var files = {}
    var types = {}
    addFiles(function (err) {
      if (err) return cb(err)
      var cache = {files: files, types: types}
      var pending = files.length
      if (store) {
        store.put(cache, function (err) {
          if (err) {
            debug('failed to cache fontello fonts', err)
            return cb(err)
          }
          pending--
          if (!pending) done(cache)
        })
      } else {
        done(cache)
      }
    })

    function done (cache) {
      cb(null, router(cache), cache)
    }

    function addFiles (cb) {
      var files = Object.keys(zip.files)
      next()
      function next (err) {
        if (err) return cb(err)
        var file = files.shift()
        if (file) {
          addFile(file, next)
        } else {
          cb()
        }
      }
    }

    function addFile (key, cb) {
      if (key.indexOf('.') === -1) return cb(null)
      var name = '/' + key.replace(/(fontello)-[^/]*/, '$1')
      zip.file(key).async('nodebuffer')
      .then(function (data) {
        debug('cached %s with mime %s', name, contentType)
        files[name] = data
        cb()
      })
      .catch(cb)
      var contentType = mime.lookup(key)
      var charset = mime.charsets.lookup(contentType)
      if (charset) contentType += '; charset=' + charset
      types[name] = contentType
      debug('caching %s with mime %s', name, contentType)
    }
  }
}

function router (cache) {
  return function router (q, r, next) {
    var key = q.url.split('?')[0]
    var file = cache.files[key]
    if (!file) {
      if (typeof next === 'function') return next()
      return
    }
    r.setHeader('content-type', cache.types[key])
    r.end(new Buffer(file))
    return true
  }
}
