define(['site/Address', 'site/SiteStatus', 'util/Objects', 'util/Dates', 'util/Units', 'util/UnitConversion'],
    function (Address, Status, Objects, Dates, Units, UnitConversion) {


        /**
         * Properties:
         *
         * Other properties that are later added to the supercharger data structure:
         *
         * id           -- [Integer] uniquely identifies each record.
         * circle       -- [google.maps.Circle] a reference to the google-maps Circle object indicating range for this supercharger.
         * marker       -- [google.maps.Marker] a reference to the google-maps Marker object associated with this supercharger.
         *
         * @constructor
         */
        var Supercharger = function () {
            this.address = new Address();
            this.count = true;
            this.status = Status.OPEN;
        };

        Supercharger.fromJSON = function (jsonObject) {
            var supercharger = new Supercharger();
            supercharger.id = jsonObject.id;
            supercharger.displayName = jsonObject.name;
            supercharger.status = Status.fromString(jsonObject.status);
            supercharger.address = Address.fromJSON(jsonObject.address);
            supercharger.location = new google.maps.LatLng(jsonObject.gps.latitude, jsonObject.gps.longitude);
            supercharger.elevation = jsonObject.elevationMeters;
            supercharger.url = jsonObject.url;
            supercharger.urlDiscuss = jsonObject.urlDiscuss;
            supercharger.count = jsonObject.counted;
            supercharger.dateOpened = Objects.isNullOrUndef(jsonObject.dateOpened) ? null : Dates.fromString(jsonObject.dateOpened);
            supercharger.numStalls = jsonObject.stallCount;
            return supercharger;
        };

        Supercharger.buildNewCustom = function (id, displayName, location) {
            var supercharger = new Supercharger();
            supercharger.id = id;
            supercharger.displayName = displayName;
            supercharger.address = new Address("", "", "", "", "");
            supercharger.location = location;
            supercharger.count = false;
            supercharger.status = Status.USER_ADDED;
            return supercharger;
        };

        Supercharger.prototype.isPermit = function () {
            return this.status === Status.PERMIT;
        };
        Supercharger.prototype.isConstruction = function () {
            return this.status === Status.CONSTRUCTION;
        };
        Supercharger.prototype.isOpen = function () {
            return this.status === Status.OPEN;
        };
        Supercharger.prototype.isUserAdded = function () {
            return this.status === Status.USER_ADDED;
        };

        Supercharger.prototype.hasOpenDate = function () {
            return Objects.isNotNullOrUndef(this.dateOpened);
        };

        Supercharger.prototype.toString = function () {
            return JSON.stringify(this);
        };

        Supercharger.prototype.formatStalls = function () {
            return Objects.isNullOrUndef(this.numStalls) ? "" : this.numStalls;
        };
        Supercharger.prototype.formatLocation = function () {
            return Objects.isNullOrUndef(this.location) ? "" : this.location.toUrlValue().replace(",", ", ");
        };
        Supercharger.prototype.formatDateOpened = function () {
            return Objects.isNullOrUndef(this.dateOpened) ? "" : Dates.toString(this.dateOpened);
        };
        Supercharger.prototype.formatElevation = function (targetUnits) {
            if (Objects.isNullOrUndef(this.elevation)) {
                return "";
            }
            return this.formatElevationNoUnits(targetUnits) + " " + targetUnits.abbrevation;
        };
        Supercharger.prototype.formatElevationNoUnits = function (targetUnits) {
            if (Objects.isNullOrUndef(this.elevation)) {
                return "";
            }
            var conversion = new UnitConversion(Units.M, targetUnits);
            var elevationNumber = conversion.convert(this.elevation);
            return elevationNumber.toLocaleString();
        };


        return Supercharger;
    }
);