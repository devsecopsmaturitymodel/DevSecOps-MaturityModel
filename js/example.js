function loadDiagramm() {
    d3.select('#energychart').selectAll("*").remove();
    $.getJSON("spiderwebData.php", function (data) {
        var labels = [], values = [];
        $.each(data, function (leveli, subdimension) {
            $.each(subdimension, function (dimensionName, level) {
                $.each(level, function (subdimensionName, data) {
                    labels.push(subdimensionName);
                    if (data['selected'] == 0) {
                        values.push(0);
                    } else {
                        values.push(100 / data['count'] * data['selected']);
                    }
                });
            });
        });
        var countSubdimensions = 13;
        var chart = circularHeatChart()
            .segmentHeight(70)
            .innerRadius(40)
            .numSegments(countSubdimensions)
            .radialLabels(["Level 1", "Level 2", "Level 3", "Level 4"])
            .segmentLabels(labels)
            .range(["white", "green"])

        d3.select('#energychart')
            .selectAll('svg')
            .data([values])
            .enter()
            .append('svg')
            .call(chart);
    });
    $('html,body').scrollTop(0);
}