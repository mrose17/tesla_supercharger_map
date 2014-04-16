define(['util/Dates', 'site/SiteStatus'], function (Dates, SiteStatus) {

    var FieldParsing = {};

    FieldParsing.I = function (supercharger, key, value) {
        supercharger[key] = value;
    };

    FieldParsing.DISPLAY_NAME = function (supercharger, key, value) {
        supercharger.displayName = value;
    };

    FieldParsing.ADDRESS = function (supercharger, key, value) {
        supercharger.address[key] = value;
    };

    FieldParsing.GPS = function (supercharger, key, value) {
        var commonPos = value.indexOf(',');
        var lat = value.substr(0, commonPos).trim();
        var lon = value.substr(commonPos + 1).trim();
        supercharger.location = new google.maps.LatLng(lat, lon);
    };

    FieldParsing.BOOLEAN = function (supercharger, key, value) {
        var upperValue = value.toUpperCase();
        if (upperValue !== 'TRUE' && upperValue !== 'FALSE') {
            throw new Error("bad boolean value '" + value + "' in supercharger=" + JSON.stringify(supercharger));
        }
        supercharger[key] = (upperValue === 'TRUE');
    };

    FieldParsing.DATE = function (supercharger, key, value) {
        try {
            supercharger[key] = Dates.fromString(value);
        } catch (error) {
            throw new Error("bad date value '" + value + "' in supercharger=" + JSON.stringify(supercharger));
        }
    };

    FieldParsing.STATUS = function (supercharger, key, value) {
        supercharger[key] = SiteStatus.fromString(value);
    };


    return FieldParsing;

});