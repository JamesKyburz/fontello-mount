var crypto = require('crypto')
var stringify = require('json-stable-stringify')
var fs = require('fs')

module.exports = cacheStore

function cacheStore (config, cachePath) {
  var hash = md5(config)

  return { get: get, put: put }

  function get (cb) {
    fs.stat(cachePath, loadCache)
    function loadCache (err) {
      if (!err) {
        var cache = require(cachePath)
        if (cache.hash !== hash) {
          err = new Error('fontello cache hash has changed')
        } else {
          return cb(null, cache.assets)
        }
      }
      if (err) return cb(err)
    }
  }

  function put (assets, cb) {
    assets = {assets: assets, hash: hash}
    fs.writeFile(cachePath, stringify(assets), cb)
  }
}

function md5 (config) {
  var hash = crypto.createHash('md5')
  var value = typeof config === 'string'
    ? config
    : stringify(config)

  return hash.update(value).digest('hex')
}
