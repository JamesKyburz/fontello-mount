var download = require('fontello-download');
var mime = require('mime');
module.exports = mount;

function mount(config, cb) {
  var files = {};
  var types = {};
  cb = cb || function() {};
  download(config, createRouter);
  return router;
  function createRouter(err, zip) {
    if (err) return cb(err);
    buildCache(zip);
  }
  function buildCache(zip) {
    Object.keys(zip.files).forEach(add);
    cb(null, router);
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
  function router(q, r, next) {
    var key = q.url.split('?')[0];
    var file = files[key];
    if (!file) return next();
    r.setHeader('content-type', types[key]);
    r.end(file);
  }
}
