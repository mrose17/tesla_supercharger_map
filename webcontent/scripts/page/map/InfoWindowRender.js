define(['util/Objects', 'util/Units', 'util/UnitConversion'], function (Objects, Units, UnitConversion) {

    var marker;
    var supercharger;
    var controlState;

    /**
     *
     * @constructor
     */
    var Renderer = function (markerP, superchargerP, controlStateP) {
        marker = markerP;
        supercharger = superchargerP;
        controlState = controlStateP;
    };

    Renderer.prototype.showWindow = function () {
        var popupContent = buildHtmlContent(supercharger, controlState);
        var windowOptions = { content: popupContent };
        var infoWindow = new google.maps.InfoWindow(windowOptions);
        infoWindow.open(marker.map, marker);
    };

    function buildHtmlContent() {
        var popupContent = "<div class='info-window-content'>";
        //
        // Title/Supercharger-name
        //
        popupContent += "<div class='title'>" + supercharger.displayName + "</div>" + "";
        //
        // Status: Construction/Permit
        //
        if (supercharger.isConstruction()) {
            popupContent += "<div class='construction'>Status: Construction</div>";
        }
        else if (supercharger.isPermit()) {
            popupContent += "<div class='permit'>Status: Permit</div>";
        }
        //
        // Street Address
        //
        popupContent += supercharger.address.street + "<br/>";
        //
        // Elevation
        //
        if (!Objects.isNullOrUndef(supercharger.elevation)) {
            var targetUnits = controlState.range.getDisplayUnit().isKilometers() ? Units.M : Units.FT;
            var conversion = new UnitConversion(Units.M, targetUnits);
            var elevationNumber = conversion.convert(supercharger.elevation);
            var elevationString = elevationNumber.toLocaleString();
            popupContent += "Elevation: " + elevationString + " " + targetUnits.abbrevation + "<br/>";
        }

        popupContent += buildLinksDiv(supercharger);

        popupContent += "</div>";
        return popupContent;
    }

    function buildLinksDiv() {
        var content = "<div class='links-container'>";

        var linkList = [
            buildLinkZoom(),
            buildLinkCircleToggle(),
            buildLinkAddToRoute(),
            buildLinkURL(),
            buildLinkDiscussURL(),
            buildLinkRemoveMarker()
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

    function buildLinkZoom() {
        return "<a class='zoom-to-site-trigger' href='" + supercharger.id + "'>zoom in</a>";
    }

    function buildLinkCircleToggle() {
        var circleOnOffLabel = (Objects.isNotNullOrUndef(supercharger.circle) && supercharger.circle.getVisible()) ? "circle off" : "circle on";
        return "<a class='circle-toggle-trigger' href='" + supercharger.id + "'>" + circleOnOffLabel + "</a>";
    }

    function buildLinkAddToRoute() {
        return "<a class='add-to-route-trigger' href='" + supercharger.id + "'>add to route</a>";
    }

    function buildLinkURL() {
        if (Objects.isNotNullOrUndef(supercharger.url)) {
            return "<a target='_blank' href='" + supercharger.url + "'>web page</a>";
        }
        return null;
    }

    function buildLinkDiscussURL() {
        if (Objects.isNotNullOrUndef(supercharger.urlDiscuss)) {
            return "<a target='_blank' href='" + supercharger.urlDiscuss + "'>discuss</a>";
        }
        return null;
    }

    function buildLinkRemoveMarker() {
        if (supercharger.isUserAdded()) {
            return "<a class='marker-toggle-trigger' href='" + supercharger.id + "'>remove</a>";
        }
        return null;
    }

    return Renderer;

});