define(
    [
        'util/Events', 'util/QueryStrings', 'nav/NavBarDropdown',
        'page/map/MapPage', 'page/data/DataPage', "page/charts/ChartsPage", 'page/changes/ChangesPage', 'page/about/AboutPage'
    ],
    function (Events, QueryStrings, NavBarDropdown, MapPage, DataPage, ChartsPage, ChangesPage, AboutPage) {

        var PAGE_DEFAULT = "map";
        var PAGE_OPTIONS = ['map', 'data', 'charts', 'changes', 'about'];

        /**
         * Constructor
         */
        var NavBar = function () {
            this.navBarDropdown = new NavBarDropdown();
            this.currentPage = PAGE_DEFAULT;

            this.mapPage = new MapPage();
            this.dataPage = new DataPage();
            this.chartsPage = new ChartsPage();
            this.changesPage = new ChangesPage();
            this.aboutPage = new AboutPage();

            this.initListeners();
        };


        NavBar.prototype.setInitialPage = function () {
            var directNav = QueryStrings.getByName('Page').toLowerCase();
            if (PAGE_OPTIONS.indexOf(directNav) > -1) {
                this.changePage(directNav);
            } else {
                this.changePage(PAGE_DEFAULT);
            }
        };

        NavBar.prototype.initListeners = function () {
            $("#navbar-menu-item-list").find("a").click(jQuery.proxy(this.handlePageChangeClick, this));
            $("#navbar-dropdown-menu-item-list").find("a").click(jQuery.proxy(this.navBarDropdown.handleAction, this.navBarDropdown));
        };

        NavBar.prototype.handlePageChangeClick = function (event) {
            var eventDetail = Events.eventDetail(event);
            this.changePage(eventDetail.actionName);
        };

        NavBar.prototype.changePage = function (newPageName) {
            this.hideCurrentPage();
            this.currentPage = newPageName;
            this.showCurrentPage();

            if ("map" === this.currentPage) {
                this.mapPage.onPageShow();
            } else {
                this.mapPage.onPageHide();
            }
            if ("data" === this.currentPage) {
                this.dataPage.onPageShow();
            }
            if ("charts" === this.currentPage) {
                this.chartsPage.onPageShow();
            }
            if ("changes" === this.currentPage) {
                this.changesPage.onPageShow();
            }
            if ("about" === this.currentPage) {
                this.aboutPage.onPageShow();
            }
        };

        NavBar.prototype.hideCurrentPage = function () {
            $("#page-" + this.currentPage).hide();
            $("#page-link-" + this.currentPage).closest("li").removeClass("active");
        };

        NavBar.prototype.showCurrentPage = function () {
            $("#page-" + this.currentPage).show();
            $("#page-link-" + this.currentPage).closest("li").addClass("active");
        };

        return NavBar;

    });