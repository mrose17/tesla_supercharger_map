define(['site/Sites', 'site/SiteIterator', 'site/SiteCount', 'page/charts/ChartColor', 'lib/highcharts'], function (Sites, SiteIterator, SiteCount, ChartColor) {

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
                borderWidth: 0,
                reversed: true
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
                    data: statePermitCountList,
                    color: ChartColor.STATUS_PERMIT
                },
                {
                    name: "Construction",
                    data: stateConstructionCountList,
                    color: ChartColor.STATUS_CONSTRUCTION
                },
                {
                    name: "Open",
                    data: stateOpenCountList,
                    color: ChartColor.STATUS_OPEN
                }
            ]
        });


    };

    return CountryBarChart;


});