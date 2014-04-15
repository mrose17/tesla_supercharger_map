define(['util/Unit', "util/Units"], function () {

    /**
     * Utility class for converting between units.
     *
     * @constructor
     */
    var UnitConversion = function (sourceUnit, targetUnit) {
        this.sourceUnit = sourceUnit;
        this.targetUnit = targetUnit;
    };

    UnitConversion.prototype.convert = function (value) {
        var valueInMeters = value * this.sourceUnit.meters;
        return Math.round(valueInMeters / this.targetUnit.meters);
    };

    return UnitConversion;

});