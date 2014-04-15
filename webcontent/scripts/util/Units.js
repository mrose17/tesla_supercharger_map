define(['util/Unit'], function (Unit) {

    var Units = {};

    Units.M = new Unit(0, "meter", "m", 1.0);
    Units.KM = new Unit(1, "kilometer", "km", 1000.0);
    Units.MI = new Unit(2, "mile", "mi", 1609.34);
    Units.FT = new Unit(3, "feet", "ft", 0.3048);

    return Units;

});