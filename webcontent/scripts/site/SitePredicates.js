define(['util/Objects'], function (Objects) {


    var SitePredicates = {};

    SitePredicates.IS_OPEN = function (site) {
        return Objects.isNotNullOrUndef(site.dateOpened);
    };

    SitePredicates.IS_COUNTED = function (site) {
        return site.count;
    };

    /**
     * @return {boolean}
     */
    SitePredicates.NOT_USER_ADDED = function (site) {
        return !site.isUserAdded();
    };

    SitePredicates.IS_OPEN_AND_COUNTED = function (site) {
        return SitePredicates.open(site) && SitePredicates.counted(site);
    };

    SitePredicates.HAS_CIRCLE = function (site) {
        return Objects.isNotNullOrUndef(site.circle);
    };

    SitePredicates.IS_USA = function (site) {
        return site.address.isUSA();
    };

    return SitePredicates;

});