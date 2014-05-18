requirejs.config(
    {
        paths: {
            json: 'lib/json'
        }
    }
);


// Start the main app logic.
requirejs([ 'nav/NavBar'  ], function (NavBar) {

    /**
     * ON DOCUMENT READY
     */
    $(document).ready(function () {
        var navBar = new NavBar();
        navBar.setInitialPage();
    });

});