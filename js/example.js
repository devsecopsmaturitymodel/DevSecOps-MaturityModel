function loadDiagramm() {
    d3.select('#energychart').selectAll("*").remove();
    $.getJSON("spiderwebData.php", function (data) {
        var labels = [], values = [];
        $.each(data, function (leveli, subdimension) {
            $.each(subdimension, function (dimensionName, level) {
                $.each(level, function (subdimensionName, data) {
                    labels.push(replaceSubdimensionName(subdimensionName));
                    if (data['selected'] == 0) {
                        values.push(0);
                    } else {
                        values.push(100 / data['count'] * data['selected']);
                    }
                });
            });
        });
        var countSubdimensions = 18;
        var chart = circularHeatChart()
            .segmentHeight(40)
            .innerRadius(190)
            .numSegments(countSubdimensions)
            .radialLabels(["Maturity 1", "Maturity 2", "Maturity 3", "Maturity 4"])
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
function replaceSubdimensionName(name) {
    return name
        .replace("for applications", "app")
        .replace("Hardening", "Hard.")
        .replace("Implementation", "Impl.")
        .replace("Guidance", "Guid.")
        .replace("for infrastructure", "infra")
        .replace("Dynamic", "Dyn.")
        .replace("Infrastructure", "Infra.")
        .replace("Application", "App.")
        .replace("Education", "Edu.")
        .replace("Management", "Mgmt.")
        ;
}
