define([], function () {

    /**
     * @constructor
     */
    var Unit = function (code, name, abbrevation, meters) {
        this.code = code;
        this.name = name;
        this.abbrevation = abbrevation;
        this.meters = meters;
    };

    Unit.prototype.getName = function () {
        return this.name;
    };
    Unit.prototype.getAbbreviation = function () {
        return this.abbrevation;
    };


    Unit.prototype.isMiles = function () {
        return this.abbrevation === "mi";
    };
    Unit.prototype.isKilometers = function () {
        return this.abbrevation === "km";
    };


    return Unit;
});