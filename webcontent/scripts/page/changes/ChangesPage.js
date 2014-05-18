define([], function () {
    /**
     *
     * @constructor
     */
    var ChangesPage = function () {
        this.changesPage = $("#page-changes");
        this.changesTable = $("#changes-table");
    };

    ChangesPage.INIT_PROP = "page-initialized";

    ChangesPage.prototype.onPageShow = function () {
        if (!this.changesPage.data(ChangesPage.INIT_PROP)) {
            jQuery.getJSON("http://localhost:8080/supercharge/allChanges", "", jQuery.proxy(this.handleChangesJson, this), "html");
        }
    };

    ChangesPage.prototype.handleChangesJson = function (changeArray) {
        var v = this;
        jQuery.each(changeArray, function (index, change) {
            var cssClass = (change.changeType === 'LIVE') ? 'success' : '';
            v.changesTable.append("<tr class='" + cssClass + "'><td>" + change.dateFormatted + "</td><td>" + change.description + "</td></tr>");
        });
        this.changesPage.data(ChangesPage.INIT_PROP, true);

    };


    return ChangesPage;
});