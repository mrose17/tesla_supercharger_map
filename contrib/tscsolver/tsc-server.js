var geocoder  = require('geocoder')
  , http      = require('http')
  , tscsolver = require('./tsc-router')
  , url       = require('url')
  ;

http.createServer(function(request, response) {
  var content, range, u;

  var done = function(code, s, ct) {
    if (code === 405) {
      response.writeHead(405, { Allow: 'GET' });
      return response.end();
    }

    if (!s) return response.end();

    response.writeHead(code, { 'Content-Type': ct || 'text/plain' });
//    response.writeHead(code, { 'Content-Length': s.length });
    response.end(s);
  };

  if (request.method !== 'GET') return done(405);

  u = url.parse(request.url, true);
  if (!u.query.origin) return done(200, 'expecting an origin parameter');
  if (!u.query.destination) return done(200, 'expecting a destination parameter');
  range = (!!u.query.range) ? parseInt(u.query.range, 10) : 195.732;
  if ((isNaN(range)) || (range < 100)) return done(200, 'invalid range parameter');
  range *= 1.60934;

  content = '';
  request.on('data', function(data) {
    content += data.toString();
  }).on('close', function() {
    console.log('http request: premature close');
  }).on('end', function() {
    var twofer = {};

    var assign = function(name, err, result) {
      var location;

      if (!!err) return done(200, u.query[name] + ': ' + err.message);

      location = result.results[0].geometry.location;
      twofer[name] = { name    : name
                     , address : name
                     , gps     : location.lat + ',' + location.lng
                     };
      if ((!twofer.origin) || (!twofer.destination)) return;

      tscsolver.route(twofer.origin, twofer.destination, range, function(err, routes, partial) { /* jshint unused: false */
        var route;

        if (!!err) return done(200, err.message);

        if ((!routes) || (routes.length === 0)) return done(200, 'no direct route');

        route = routes[0];
        route.path[0] = u.query.origin;
        route.path[route.path.length - 1] = u.query.destination;
        done(200, JSON.stringify(route), 'application/json');
      });
    };

    geocoder.geocode(u.query.origin, function(err, result) {
      assign('origin', err, result);
    });
    geocoder.geocode(u.query.destination, function(err, result) {
      assign('destination', err, result);
    });
  });
}).on('listening', function() {
  console.log('listening on http://127.0.0.1:8896');
}).on('error', function(err) {
    console.log('http server: ' + err.message);
}).listen(8896);
