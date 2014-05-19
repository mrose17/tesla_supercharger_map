var distance   = require('google-distance')
  , sqlite3    = require('sqlite3').verbose()
  , underscore = require('underscore')
  , utilities  = require('./tsc-utilities')
  ;


var db    = new sqlite3.Database('sites.db')
  , sites = {}
  ;

db.each('SELECT * FROM sites', {}, function(err, row) {
  var as, name, site;

  if (!!err) return console.log('SELECT sites: ' + err.message);

  if (!row) return;

  site = JSON.parse(row.props);
  site.address = row.address;
  site.distances = {};
  as = site.address;
  name = site.name;
  sites[as] = site;

  db.each('SELECT * FROM distances WHERE origin=$origin', { $origin: as }, function(err, row) {
    if (!!err) return console.log('SELECT distances.origin=' + as + ' : ' + err.message);

    if (!row) return;

    sites[as].distances[row.destination] = row.distance;
  }, function(err, count) {     /* jshint unused: false */
    if (!!err) return console.log('SELECT distances.origin=' + as + ' : ' + err.message);
  });
}, function(err, count) {       /* jshint unused: false */
    if (!!err) return console.log('SELECT sites: ' + err.message);

//  setTimeout(test, 3 * 1000);
});


exports.route = function(origin, destination, range, callback) {
  var gps1, gps2;

  origin.distances = {};
  sites.origin = origin;
  destination.distances = {};
  sites.destination = destination;

  gps1 = origin.gps.split(',');
  gps2 = destination.gps.split(',');
  if (utilities.distanceFromLatLonInKm(gps1[0], gps1[1], gps2[0], gps2[1]) > range) {
    return prep(range, callback);
  }

  distance.get({ origin      : origin.gps
               , destination : destination.gps
               , units       : 'metric'
               }, function(err, data) {
    var result;

    if (!!err) return callback(err);

    result = utilities.distanceInKm(data.distance);
    if (isNaN(result)) return callback(new Error('origin/destination distance: ' + data));
    if (result > range) return callback(null, []);

    prep(range, callback);
  });
};


var prep = function(range, callback) {
  var count = 0
    , errP  = false
    ;

  var done = function(oops) {
    if ((errP) || (--count > 0)) return;

    if (!!oops) {
      errP = true;
      return callback(new Error(oops));
    }

    return look(range, callback);
  };

  var work = function(start, stop) {
    var gps1, gps2, prefix;

    if (errP) return;

    gps1 = start.gps.split(',');
    gps2 = stop.gps.split(',');
    if (utilities.distanceFromLatLonInKm(gps1[0], gps1[1], gps2[0], gps2[1]) > range) return;

    prefix = JSON.stringify(start) + '/' + JSON.stringify(stop) + ' distance: ';
    distance.get({ origin      : start.gps
                 , destination : stop.gps
                 , units       : 'metric'
                 }, function(err, data) {
      var result;

      if (!!err) return done(prefix + err.message);

      result = utilities.distanceInKm(data.distance);
      if (isNaN(result)) return done(prefix + data);
      if (result <= range) sites[start.address].distances[stop.address] = result;

      done();
    });
    count++;
  };

  underscore.each(sites, function(site) {
    if ((site.name === 'origin') || (site.name === 'destination')) return;

    work(sites.origin, site);
    work(site,         sites.destination);
  });
};


var look = function(range, callback) {
  var partial = []
    , paths   = expand([ 'origin' ], range)
    , routes  = []
    ;

  underscore.each(paths, function(path) {
    routes.push({ distance : underscore.reduce(path, function(memo, point, index) {
                               if (point !== 'destination') memo += sites[point].distances[path[index + 1]];
                               return memo;
                             }, 0)
                , path     : path
                });
  });
  routes = underscore.sortBy(routes, function(route) { return route.distance; });
  if (routes.length > 3) routes = routes.slice(0, 3);
  underscore.each(routes, function(route) {
    var path = [];
    underscore.each(route.path, function(point) {
      var site = sites[point];

      if (!!site) point += ' (' + site.name + ')';
      path.push(point);
    });
    route.path = path;
  });

  underscore.each(underscore.keys(tails), function(point) {
    var gps1, gps2;

    gps1 = sites[point].gps.split(',');
    gps2 = sites.destination.gps.split(',');
    partial.push({ point    : point
                 , distance : Math.round(utilities.distanceFromLatLonInKm(gps1[0], gps1[1], gps2[0], gps2[1]))
                 });
  });

  callback(null, routes, partial);
};

var tails = {};
var depths = {};
var expand = function(path, range) {
  var paths = []
    , seen  = {}
    , tail  = sites[path[path.length - 1]]
    ;

  if (tail.name === 'destination') return [ path ];

  underscore.each(path, function(point) { seen[point] = true; });
  underscore.each(underscore.keys(tail.distances), function(point) {
    var choices;

    if ((seen[point]) || (!tail.distances[point]) || (tail.distances[point] > range)) return;

    if ((!!depths[point]) && (depths[point] < (path.length - 0))) return;
    if ((!depths[point]) || (depths[point] > path.length)) depths[point] = path.length;

    choices = expand(path.concat([ point ]), range);
    if (choices.length > 0) paths = paths.concat(choices);
  });
  if (paths.length === 0) tails[path[path.length - 1]] = true;

  return paths;
};
