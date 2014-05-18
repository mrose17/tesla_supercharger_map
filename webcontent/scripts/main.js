requirejs.config(
    {
        inlineJSON: false,
        paths: {
            text: 'lib/text', //text is required
            json: 'lib/json' //alias to plugin
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