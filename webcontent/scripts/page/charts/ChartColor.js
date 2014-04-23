define([], function () {

    var ChartColor = {};

    ChartColor.STATUS_PERMIT = {
        radialGradient: { cx: 0.5, cy: 0.5, r: 0.5 },
        stops: [
            [0, '#003399'],
            [1, '#3366AA']
        ]
    };

    ChartColor.STATUS_OPEN = {
        radialGradient: { cx: 0.5, cy: 0.5, r: 0.5 },
        stops: [
            [0, '#460000'],
            [1, '#970202']
        ]
    };

    ChartColor.STATUS_CONSTRUCTION = 'orange';

    return ChartColor;


});