var underscore = require('underscore')
  ;


exports.address = function(site)  {
  if ((!!site.street) && (!!site.zip)) return (site.street + ', ' + site.zip);

  return underscore.map(site.gps.split(','), function(part) { return part.trim(); }).join(',');
};


exports.distanceInKm = function(distance) {
  var result;

  result = distance.split(' ');
  result[0] = parseInt(result[0].split(',').join(''), 10);
  if ((!isNaN(result[0])) && (result[1] === 'm')) result[0] /= 1000;

  return result[0];
};



/* from http://www.movable-type.co.uk/scripts/latlong.html

Haversine formula:       a = sin²(Δφ/2) + cos(φ1).cos(φ2).sin²(Δλ/2)
                         c = 2.atan2(√a, √(1−a))
                         d = R.c
where   φ is latitude, λ is longitude, R is earth’s radius (mean radius = 6,371km)
*/



// from http://stackoverflow.com/questions/27928/how-do-i-calculate-distance-between-two-latitude-longitude-points
exports.distanceFromLatLonInKm = function (lat1, lon1, lat2, lon2) {
  var R    = 6371
    , dLat = deg2rad(lat2 - lat1)
    , dLon = deg2rad(lon2 - lon1)
    , a    =   (Math.sin(dLat/2) * Math.sin(dLat/2))
             + (Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2))
    , c    = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    ;

  return (R * c);
};

/* from http://www.movable-type.co.uk/scripts/latlong.html


Formula: Bx = cos(φ2).cos(Δλ)
         By = cos(φ2).sin(Δλ)
         φm = atan2(sin(φ1) + sin(φ2), √((cos(φ1)+Bx)² + By²))
         λm = λ1 + atan2(By, cos(φ1)+Bx)
*/

exports.midpointFromLatLon = function(lat1, lon1, lat2, lon2) {
  var dLon = deg2rad(lon2 - lon1)
    , Bx   = Math.cos(lat2) * Math.cos(dLon)
    , By   = Math.cos(lat2) * Math.sin(dLon)
    , lat3 = Math.atan2(Math.sin(lat1) + Math.sin(lat2), Math.sqrt((Math.cos(lat1) + Bx) * (Math.cos(lat1) + Bx) + By*By))
    , lon3 = lon1 + Math.atan2(By, Math.cos(lat1) + Bx)
    ;

  return [ lat3, lon3 ];
};

var deg2rad = function(deg) {
  return (deg * (Math.PI/180));
};
