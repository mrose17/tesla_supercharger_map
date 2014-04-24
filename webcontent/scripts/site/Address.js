define(function () {

        /**
         *
         * @constructor
         */
        var Address = function (street, city, state, zip, country) {
            this.street = street;
            this.city = city;
            this.state = state;
            this.zip = zip;
            this.country = country;
        };

        Address.prototype.isUSA = function () {
            return this.country === "USA";
        };
        Address.prototype.isNorthAmerica = function () {
            return this.country === "USA" || this.country === "Canada";
        };
        Address.prototype.isAsia = function () {
            return this.country === "China";
        };


        return Address;

    }
);