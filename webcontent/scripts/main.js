requirejs.config({});


// Start the main app logic.
requirejs([ 'nav/NavBar', 'util/QueryStrings' ], function (NavBar, QueryStrings) {

    /**
     * ON DOCUMENT READY
     */
    $(document).ready(function () {
        var navBar = new NavBar();
        // Check for passed page navigation
        var directNav = QueryStrings.getByName('Page').toLowerCase();
        if ( ['map', 'data', 'charts', 'changes', 'about'].indexOf(directNav) > -1) {
            navBar.changePage(directNav);
        } else {
            navBar.changePage("map");
        }
    });

});