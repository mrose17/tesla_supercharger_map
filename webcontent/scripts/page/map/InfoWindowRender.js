define(['util/Objects', 'util/Units', 'util/UnitConversion', 'util/Events'], function (Objects, Units, UnitConversion, Events) {

    /**
     *
     * @constructor
     */
    var Renderer = function (markerP, superchargerP, controlStateP) {
        this.marker = markerP;
        this.supercharger = superchargerP;
        this.controlState = controlStateP;
        this.infoWindow = null;
        this.showDetails = false;

        var renderer = this;
        jQuery(document).on('click', '.details-trigger', function (event) {
            var eventDetail = Events.eventDetail(event);
            if (parseInt(eventDetail.actionName) === renderer.supercharger.id) {
                renderer.infoWindow.close();
                renderer.toggleDetails();
                renderer.showWindow(true);
            }
        });

    };

    Renderer.prototype.showWindow = function () {
        var windowOptions = { content: this.buildHtmlContent() };
        this.infoWindow = new google.maps.InfoWindow(windowOptions);
        this.infoWindow.open(this.marker.map, this.marker);
    };

    Renderer.prototype.toggleDetails = function () {
        this.showDetails = !this.showDetails;
    };

    Renderer.prototype.buildHtmlContent = function () {
        var popupContent = "<div class='info-window-content'>";
        //
        // Title/Supercharger-name
        //
        popupContent += "<div class='title'>" + this.supercharger.displayName + "</div>" + "";
        //
        // Status: Construction/Permit
        //
        if (this.supercharger.isConstruction()) {
            popupContent += "<div class='construction'>Status: Construction</div>";
        }
        else if (this.supercharger.isPermit()) {
            popupContent += "<div class='permit'>Status: Permit</div>";
        }
        //
        // Street Address
        //
        popupContent += this.supercharger.address.street + "<br/>";

        if (this.showDetails) {
            popupContent += "<div class='info-window-details'>";
            popupContent += "<table>";
            if (!Objects.isNullOrUndef(this.supercharger.elevation)) {
                var targetUnits = this.controlState.range.getDisplayUnit().isKilometers() ? Units.M : Units.FT;
                var conversion = new UnitConversion(Units.M, targetUnits);
                var elevationNumber = conversion.convert(this.supercharger.elevation);
                var elevationString = elevationNumber.toLocaleString();
                popupContent += "<tr><th>Elevation</th><td>" + elevationString + " " + targetUnits.abbrevation + "</td></tr>";
            }
            popupContent += "<tr><th>GPS</th><td>" + this.supercharger.formatLocation() + "</td></tr>";
            if (!Objects.isNullOrUndef(this.supercharger.dateOpened)) {
                popupContent += "<tr><th>Date Opened</th><td>" + this.supercharger.formatDateOpened() + "</td></tr>";
            }
            popupContent += "</table>";
            popupContent += "</div>";
        }

        popupContent += buildLinksDiv(this.supercharger);

        popupContent += "</div>";
        return popupContent;
    };

    function buildLinksDiv(supercharger) {
        var content = "<div class='links-container'>";

        var linkList = [
            buildLinkZoom(supercharger),
            buildLinkCircleToggle(supercharger),
            buildLinkAddToRoute(supercharger),
            buildLinkURL(supercharger),
            buildLinkDiscussURL(supercharger),
            buildLinkRemoveMarker(supercharger),
            buildLinkDetails(supercharger)
        ];

        var count = 1;
        $.each(linkList, function (index, value) {
            if (value !== null) {
                content += value + "";
                if (((count++) % 3 === 0) && (index !== linkList.length - 1)) {
                    content += "<br/>";
                }
            }
        });
        content += "</div>";
        return content;
    }

    function buildLinkZoom(supercharger) {
        return "<a class='zoom-to-site-trigger' href='" + supercharger.id + "'>zoom in</a>";
    }

    function buildLinkCircleToggle(supercharger) {
        var circleOnOffLabel = (Objects.isNotNullOrUndef(supercharger.circle) && supercharger.circle.getVisible()) ? "circle off" : "circle on";
        return "<a class='circle-toggle-trigger' href='" + supercharger.id + "'>" + circleOnOffLabel + "</a>";
    }

    function buildLinkAddToRoute(supercharger) {
        return "<a class='add-to-route-trigger' href='" + supercharger.id + "'>add to route</a>";
    }

    function buildLinkURL(supercharger) {
        if (Objects.isNotNullOrUndef(supercharger.url)) {
            return "<a target='_blank' href='" + supercharger.url + "'>web page</a>";
        }
        return null;
    }

    function buildLinkDiscussURL(supercharger) {
        if (Objects.isNotNullOrUndef(supercharger.urlDiscuss)) {
            return "<a target='_blank' href='" + supercharger.urlDiscuss + "'>discuss</a>";
        }
        return null;
    }

    function buildLinkRemoveMarker(supercharger) {
        if (supercharger.isUserAdded()) {
            return "<a class='marker-toggle-trigger' href='" + supercharger.id + "'>remove</a>";
        }
        return null;
    }

    function buildLinkDetails(supercharger) {
        return "<a class='details-trigger' href='#" + supercharger.id + "'>details</a>";
    }

    return Renderer;

});