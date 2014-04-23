define(['site/Sites', 'site/SiteIterator', 'site/SiteCount', 'page/charts/ChartColor', 'lib/highcharts'], function (Sites, SiteIterator, SiteCount, ChartColor) {

    /**
     *
     * @constructor
     */
    var CountryBarChart = function () {

    };

    CountryBarChart.prototype.draw = function () {

        var stateSiteCountList = SiteCount.getCountListByCountry();

        var countryNameList = [];
        var countryOpenCountList = [];
        var countryConstructionCountList = [];
        var countryPermitCountList = [];

        $.each(stateSiteCountList, function (index, value) {
            if (value.key !== 'Total' && value.key !== 'USA') {
                countryNameList.push(value.key);
                countryOpenCountList.push(value.open);
                countryConstructionCountList.push(value.construction);
                countryPermitCountList.push(value.permit);
            }
        });

        $("#chart-country-bar").highcharts({
            chart: {
                type: 'column'
            },
            credits: {
                enabled: false
            },
            title: {
                text: 'Superchargers Per Country'
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
                categories: countryNameList
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
                    data: countryPermitCountList,
                    color: ChartColor.STATUS_PERMIT
                },
                {
                    name: "Construction",
                    data: countryConstructionCountList,
                    color: ChartColor.STATUS_CONSTRUCTION
                },
                {
                    name: "Open",
                    data: countryOpenCountList,
                    color: ChartColor.STATUS_OPEN
                }
            ]
        });


    };

    return CountryBarChart;


});