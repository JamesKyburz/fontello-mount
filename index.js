var download = require('fontello-download');
var mime = require('mime');

module.exports = mount;
mount.router = router;

function mount(config, cb) {
  download(config, buildCache);

  function buildCache(err, zip, contents) {
    if (err) return cb(err);
    var files = {};
    var types = {};
    Object.keys(zip.files).forEach(add);
    var cache = {files: files, types: types};
    cb(null, router(cache), cache);
    function add(key) {
      if (-1 === key.indexOf('.')) return;
      var name = '/' + key.replace(/(fontello)-[^/]*/, '$1');
      files[name] = zip.files[key].asNodeBuffer();
      var contentType = mime.lookup(key);
      var charset = mime.charsets.lookup(contentType);
      if (charset) contentType += '; charset=' + charset;
      types[name] = contentType;
      console.log('caching %s with mime %s', name, contentType);
    }
  }
}

function router(cache) {
  return function router(q, r, next) {
    var key = q.url.split('?')[0];
    var file = cache.files[key];
    if (!file) {
      if (typeof next === 'function') return next();
      return;
    }
    r.setHeader('content-type', cache.types[key]);
    r.end(new Buffer(file));
    return true;
  }
}

function cache(files, types) {
  return {files: files, types: types};
}
