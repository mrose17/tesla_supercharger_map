define(['page/map/Range', 'util/QueryStrings', 'util/Unit'], function (Range, QueryStrings, Unit) {

    /**
     *
     * @constructor
     */
    var ControlState = function () {

        this.initRange();

        this.fillOpacity = 0.15;
        this.fillColor = "#86c4ec";

        this.borderOpacity = 0.3;
        this.borderColor = "#181fe7";

        this.showOpen = true;
        this.showConstruction = true;
        this.showPermit = true;
    };

    ControlState.prototype.initRange = function () {
        var rangeMi = QueryStrings.getByName("RangeMi");
        var rangeKm = QueryStrings.getByName("RangeKm");

        if (rangeMi) {
            this.range = new Range(Range.milesToMeters(rangeMi), Unit.forMiles());
        } else if (rangeKm) {
            this.range = new Range(Range.kilometersToMeters(rangeKm), Unit.forKilometers());
        } else {
            this.range = new Range(0, Unit.forMiles());
        }
    };

    return ControlState;

});