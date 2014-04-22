var distance   = require('google-distance')
  , fs         = require('fs')
  , sqlite3    = require('sqlite3').verbose()
  , underscore = require('underscore')
  , utilities  = require('./tsc-utilities')
  ;


var record     = null
  , sites      = {}
  ;

var ready = function(site) { return ((!!site) && (!site.count) && (!site.status) && (site.country === 'USA')); };

underscore.each(fs.readFileSync('../../webcontent/scripts/siteload/superchargers.txt',
                                { options: 'utf8' }).toString().split('\n'), function(line) {
  var k, v, x;

  line = line.trim();
  if ((line.length === 0) || (line.charAt(0) === '#')) return;

  x = line.indexOf(':');
  if (x.length <= 2) throw new Error('invalid key in line: ' + line);

  k = line.substr(0, x).trim();
  v = line.substr(x + 1).trim();
  if (k === 'name') {
    if (ready(record)) sites[record.name] = record;
    record = {};
  }
  record[k] = v;
});
if (ready(record)) sites[record.name] = record;


var db = new sqlite3.Database('sites.db')
  ;

db.serialize(function() {
  db.run('CREATE TABLE IF NOT EXISTS sites('
         + 'address TEXT PRIMARY KEY ASC, '
         + 'name TEXT, gps TEXT, props TEXT, '
         + 'created CURRENT_TIMESTAMP, updated CURRENT_TIMESTAMP'
         + ')');
  db.run('CREATE TRIGGER IF NOT EXISTS s01 AFTER UPDATE ON sites BEGIN '
         + 'UPDATE sites SET updated=datetime("now") WHERE address=NEW.address; '
         + 'END');

  db.run('CREATE TABLE IF NOT EXISTS distances('
         + 'origin TEXT NOT NULL, destination TEXT NOT NULL, '
         + 'distance REAL, '
         + 'created CURRENT_TIMESTAMP, updated CURRENT_TIMESTAMP, '
         + 'PRIMARY KEY(origin, destination))');
  db.run('CREATE TRIGGER IF NOT EXISTS d01 AFTER UPDATE ON distances BEGIN '
         + 'UPDATE distances SET updated=datetime("now") WHERE origin=NEW.origin AND destination=NEW.destination; '
         + 'END', function(err) {
    if (!!err) {
      console.log('sites.db: ' + err.message);
      process.exit(0);
    }
  });
});


var errP = false
  ;

underscore.each(sites, function(origin) {
  var ao   = utilities.address(origin)
    , gps1 = origin.gps.split(',')
    ;

  db.get('SELECT * FROM sites WHERE address=$address', { $address: ao }, function(err, row) {
    var site;

    if (!!err) return console.log('SELECT sites.address=' + ao + ': ' + err.message);

    if (!!row) return;

    site = underscore.clone(origin);
    delete(site.distances);
    site.gps = underscore.map(site.gps.split(','), function(part) { return part.trim(); }).join(',');

    db.run('INSERT INTO sites(address, name, gps, props, created) VALUES($address, $name, $gps, $props, datetime("now"))',
           { $address: ao, $name: origin.name, $gps: origin.gps, $props: JSON.stringify(site) }, function(err) {
      if (!!err) return console.log('INSERT sites.address=' + ao + ': ' + err.message);

      console.log('>>> ' + origin.name + ': address=' + ao + ' gps=' + origin.gps);
    });
  });

  origin.distances = {};
  underscore.each(sites, function(destination) {
    var ad   = utilities.address(destination)
      , gps2 = destination.gps.split(',')
      ;

    if ((ao === ad) || (utilities.distanceFromLatLonInKm(gps1[0], gps1[1], gps2[0], gps2[1]) > 750)) return;

    db.get('SELECT * FROM distances WHERE origin=$origin AND destination=$destination', { $origin: ao, $destination: ad },
           function(err, row) {
      if (!!err) return console.log('SELECT distances.origin=' + ao + ', .destination=' + ad + ': ' + err.message);

      if (!!row) {
        origin.distances[ad] = row.distance;
        return;
      }

      if (errP) return;

      distance.get({ origin      : ao
                   , destination : utilities.address(destination)
                   , units       : 'metric'
                   }, function(err, data) {
        var result;

        if (!!err) {
          if (errP) return;
          errP = true;

          setTimeout(function() { process.exit(0); }, 180 * 1000);
          return console.log(origin.name + ' to ' + destination.name + ': ' + err.message);
        }

        result = utilities.distanceInKm(data.distance);
        if (isNaN(result)) return console.log(origin.name + ' to ' + destination.name + ': ' + data);
        origin.distances[ad] = result;
console.log('>>> ' + origin.name + ' to ' + destination.name + ': ' + result);

        db.run('INSERT INTO distances(origin, destination, distance, created) '
               + 'VALUES($origin, $destination, $distance, datetime("now"))',
               { $origin: ao, $destination: ad, $distance: result }, function(err) {
          if (!!err) return console.log('INSERT distances.origin=' + ao + ', destination=' + ad + ': ' + err.message);
        });
      });
    });
  });
});
