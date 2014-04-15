define(function () {

    /**
     * @constructor
     */
    var Unit = function () {
        this.name = Unit.MI;
    };

    Unit.KM = "kilometers";
    Unit.MI = "miles";

    Unit.prototype.isMiles = function () {
        return this.name === Unit.MI;
    };
    Unit.prototype.isKilometers = function () {
        return this.name === Unit.MI;
    };
    Unit.prototype.getName = function () {
        return this.name;
    };

    // - - - - - - - - - - - - - - -
    // static factory methods
    // - - - - - - - - - - - - - - -

    Unit.forMiles = function () {
        return new Unit();
    };
    Unit.forKilometers = function () {
        var unit = new Unit();
        unit.name = Unit.KM;
        return unit;
    };

    Unit.fromString = function (string) {
        if (string === "mi" || string === "miles") {
            return Unit.forMiles();
        }
        else if (string === "km" || string === "kilometers") {
            return Unit.forKilometers();
        }
        throw new Error("invalid unit string=" + string);
    };

    return Unit;
});