define(['common/ServiceURL'], function (ServiceURL) {
    /**
     *
     * @constructor
     */
    var AboutPage = function () {
        this.page = $("#page-about");
        this.versionContainer = $("#page-about-version-container");
        this.emailContainer = $("#page-about-email-container");
    };

    AboutPage.INIT_PROP = 'page-initialized';

    AboutPage.prototype.onPageShow = function () {
        if (!this.page.data(AboutPage.INIT_PROP)) {
            this.loadVersionInfo();
            this.insertEmailAddress();
            this.page.data(AboutPage.INIT_PROP, true);
        }
    };

    AboutPage.prototype.loadVersionInfo = function () {
        jQuery.getJSON(ServiceURL.DB_INFO, jQuery.proxy(this.insertVersionInfo, this));
    };

    AboutPage.prototype.insertVersionInfo = function (databaseInfo) {
        this.versionContainer.append("<b>Last Updated: </b>" + databaseInfo.lastModifiedString);
    };

    AboutPage.prototype.insertEmailAddress = function (data) {
        this.emailContainer.html("<b>map" + "@superch" + "arge.info</b>");
    };


    return AboutPage;
});