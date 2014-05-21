define(['common/ServiceURL'], function (ServiceURL) {
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
            jQuery.getJSON(ServiceURL.CHANGES, jQuery.proxy(this.handleChangesJson, this));
        }
    };

    ChangesPage.prototype.handleChangesJson = function (changeArray) {
        var changesPage = this;
        jQuery.each(changeArray, function (index, change) {
            var cssClass = (change.changeType === 'LIVE') ? 'success' : '';
            changesPage.changesTable.append("" +
                    "<tr class='" + cssClass + "'>" +
                    "<td>" + change.dateFormatted + "</td>" +
                    "<td>" + ChangesPage.translateChangeType(change.changeType) + "</td>" +
                    "<td>" + change.description + "</td>" +
                    "</tr>"
            );
        });
        this.changesPage.data(ChangesPage.INIT_PROP, true);

    };

    ChangesPage.translateChangeType = function (changeType) {
        if (changeType === "ADD") {
            return "supercharger added";
        }
        else if (changeType === "UPDATE") {
            return "supercharger updated";
        }
        else if (changeType === "LIVE") {
            return "supercharger live";
        }
        return "";
    };


    return ChangesPage;
});