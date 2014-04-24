define(['site/Sites', 'site/SiteIterator', 'site/SiteSorting', 'site/SitePredicates', 'lib/highcharts'], function (Sites, SiteIterator, SiteSorting, SitePredicates) {

    /**
     *
     * @constructor
     */
    var TotalOpenChart = function () {

    };

    TotalOpenChart.prototype.draw = function () {

        var livePerDateNorthAmerica = [];
        var livePerDateAsia = [];
        var livePerDateEurope = [];

        var countNorthAmerica = 0;
        var countAsia = 0;
        var countEurope = 0;

        function removePreviousIfSameDate(array, dateUTC) {
            if (array.length > 0 && array[array.length - 1][0] === dateUTC) {
                array.pop();
            }
        }

        new SiteIterator()
            .withPredicate(SitePredicates.IS_OPEN)
            .withPredicate(SitePredicates.IS_COUNTED)
            .withSort(SiteSorting.BY_OPENED_DATE)
            .iterate(function (supercharger) {
                var date = supercharger.dateOpened;
                var dateUTC = Date.UTC(date.getFullYear(), date.getMonth(), date.getDate());

                if (supercharger.address.isNorthAmerica()) {
                    countNorthAmerica++;
                    removePreviousIfSameDate(livePerDateNorthAmerica, dateUTC);
                    livePerDateNorthAmerica.push([dateUTC, countNorthAmerica]);

                } else if (supercharger.address.isAsia()) {
                    countAsia++;
                    removePreviousIfSameDate(livePerDateAsia, dateUTC);
                    livePerDateAsia.push([dateUTC, countAsia]);
                }
                else {
                    countEurope++;
                    removePreviousIfSameDate(livePerDateEurope, dateUTC);
                    livePerDateEurope.push([dateUTC, countEurope]);
                }
            });

        var plotLinesArray = this.buildVerticalYearPlotLines();


        $("#chart-supercharger-over-time").highcharts({
            chart: {
                zoomType: 'x',
                type: 'spline'
            },
            credits: {
                enabled: false
            },
            title: {
                text: 'Open Superchargers Over Time'
            },
            subtitle: {
                text: null
            },
            legend: {
                borderWidth: 0,
                enabled: true
            },
            xAxis: {
                type: 'datetime',
                dateTimeLabelFormats: {
                    month: '%b %e',
                    year: '%b'
                },
                plotLines: plotLinesArray
            },
            yAxis: {
                title: {
                    text: 'Count'
                },
                min: 0
            },
            tooltip: {
                formatter: function () {
                    return '<b>' + this.series.name + '</b><br/>' +
                        Highcharts.dateFormat('%b %e %Y', this.x) + '<br/>' +
                        "superchargers: " + this.y;
                }
            },

            series: [
                {
                    name: "North America",
                    data: livePerDateNorthAmerica,
                    lineWidth: 1,
                    marker: {
                        radius: 3
                    }
                },
                {
                    name: "Europe",
                    data: livePerDateEurope,
                    lineWidth: 1,
                    marker: {
                        radius: 3
                    }
                },
                {
                    name: "Asia",
                    data: livePerDateAsia,
                    lineWidth: 1,
                    marker: {
                        radius: 3
                    }
                }

            ]
        });


    };

    TotalOpenChart.prototype.buildVerticalYearPlotLines = function () {
        var plotLinesArray = [];
        var currentYear = new Date().getFullYear();
        for (var year = 2013; year <= currentYear; year++) {
            plotLinesArray.push(
                {
                    value: Date.UTC(year, 0, 1),
                    color: 'black',
                    width: 1,
                    label: {
                        text: year,
                        align: 'left',
                        style: {
                            color: 'gray',
                            fontSize: '1.7em'

                        }
                    }
                }
            );
        }
        return plotLinesArray;
    };

    return TotalOpenChart;


});