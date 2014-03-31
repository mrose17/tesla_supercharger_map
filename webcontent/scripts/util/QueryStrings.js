define([], function () {

    var Parameters = {};

    /**
     *	Get a Query (URL) parameter by name (this is case sensitive)
     */
    Parameters.getByName = function(iName) {
        return decodeURIComponent((new RegExp('[?|&]' + iName + '=' + '([^&;]+?)(&|#|;|$)').exec(location.search)||[,""])[1].replace(/\+/g, '%20'))||"";
    };


    return Parameters;

});