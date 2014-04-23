define(['site/Sites', 'site/SiteIterator', 'site/SiteCount', 'util/Objects', 'lib/highcharts'], function (Sites, SiteIterator, SiteCount, Objects) {

    /**
     *
     * @constructor
     */
    var CountryBarChart = function () {

    };

    CountryBarChart.prototype.draw = function () {

        var stateSiteCountList = SiteCount.getCountListByState();

        var stateNameList = [];
        var stateOpenCountList = [];
        var stateConstructionCountList = [];
        var statePermitCountList = [];

        $.each(stateSiteCountList, function (index, value) {
            if (value.key !== 'Total') {
                stateNameList.push(value.key);
                stateOpenCountList.push(value.open);
                stateConstructionCountList.push(value.construction);
                statePermitCountList.push(value.permit);
            }
        });

        $("#chart-state-bar").highcharts({
            chart: {
                type: 'column'
            },
            credits: {
                enabled: false
            },
            title: {
                text: 'Superchargers Per US State'
            },
            subtitle: {
                text: null
            },
            legend: {
                enabled: true,
                align: 'right',
                verticalAlign: 'top',
                floating: true
            },
            xAxis: {
                categories: stateNameList
            },
            yAxis: {
                title: {
                    text: 'Supercharger Count'
                }
            },
            plotOptions: {
                column: {
                    stacking: 'normal',
                    dataLabels: {
                        enabled: false
                    }
                }
            },
            series: [
                {
                    name: "Permit",
                    data: statePermitCountList
                },
                {
                    name: "Construction",
                    data: stateConstructionCountList
                },
                {
                    name: "Open",
                    data: stateOpenCountList
                }

            ]
        });


    };

    return CountryBarChart;


});