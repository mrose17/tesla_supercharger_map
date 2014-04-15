define([], function () {

    var QueryStrings = {};

    /**
     * Get a Query (URL) parameter by name (this is case insensitive)
     */
    QueryStrings.getByName = function (parameterName) {
        var paramRegex = new RegExp('[?|&]' + parameterName + '=' + '([^&;]+?)(&|#|;|$)', 'i');
        var paramValueArray = (paramRegex.exec(location.search) || [, ""]);
        var encodedParamValue = paramValueArray[1].replace(/\+/g, '%20');
        return decodeURIComponent(encodedParamValue) || "";
    };

    return QueryStrings;
});