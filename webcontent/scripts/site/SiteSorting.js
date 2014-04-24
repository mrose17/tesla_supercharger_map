define(['util/Objects'], function (Objects) {


    var SiteSorting = {};

    /**
     * @return {number}
     */
    SiteSorting.BY_OPENED_DATE = function (siteOne, siteTwo) {
        var oneNull = Objects.isNullOrUndef(siteOne.dateOpened);
        var twoNull = Objects.isNullOrUndef(siteTwo.dateOpened);
        if (oneNull && twoNull) {
            return 0;
        }
        if (oneNull) {
            return -1;
        }
        if (twoNull) {
            return 1;
        }
        if (siteOne.dateOpened < siteTwo.dateOpened) {
            return -1;
        }
        if (siteOne.dateOpened > siteTwo.dateOpened) {
            return 1;
        }
        return 0;
    };

    /**
     * @return {number}
     */
    SiteSorting.BY_OPENED_DATE_DESC = function (siteOne, siteTwo) {
        return -1 * SiteSorting.BY_OPENED_DATE(siteOne, siteTwo);
    };

    return SiteSorting;

});