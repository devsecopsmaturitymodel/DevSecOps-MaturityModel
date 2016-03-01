<html>
<head>
    <script src="//code.jquery.com/jquery-1.12.0.min.js"></script>

    <!-- Latest compiled and minified CSS -->
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/css/bootstrap.min.css"
          integrity="sha384-1q8mTJOASx8j1Au+a5WDVnPi2lkFfwwEAa8hDDdjZlpLegxhjVME1fgjWPGmkzs7" crossorigin="anonymous">

    <!-- Optional theme -->
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/css/bootstrap-theme.min.css"
          integrity="sha384-fLW2N01lMqjakBkx3l/M9EahuwpSfeNvV63J5ezn3uZzapT0u7EYsXMjQV+0En5r" crossorigin="anonymous">

    <!-- Latest compiled and minified JavaScript -->
    <script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/js/bootstrap.min.js"
            integrity="sha384-0mSbJDEHialfmuBBQP6A4Qrprq5OVfW37PRR3j5ELqxss1yVqOtnepnHVP9aJ7xS"
            crossorigin="anonymous"></script>

    <link href="http://nvd3.org/assets/css/common.css" rel="stylesheet">
    <link href="http://nvd3.org/assets/css/nv.d3.css" rel="stylesheet">

    <script src="http://nvd3.org/assets/js/lib/bootstrap.min.js"></script>
    <script src="http://nvd3.org/assets/lib/d3.v3.js"></script>
    <script src="http://nvd3.org/assets/js/nv.d3.js"></script>

</head>
<body>
<?php
include_once "navi.php";
?>
<?php
include_once "data.php";
function getJson($dimensions)
{
    $json = array();
    $shapes = array('circle', 'cross', 'triangle-up', 'triangle-down', 'diamond', 'square');
    $shape = 0;
    foreach ($dimensions as $dimension => $subdimensions) {
        foreach ($subdimensions as $subdimension => $element) {
            $values = array();
            foreach ($element as $elementName => $content) {
                $values[] = array(
                    "series" => 0,
                    "shape" => $shapes[$shape],
                    "size" => 3000,
                    "x" => getEaseOfImplementation($content["easeOfImplementation"]),
                    "y" => $content["usefulness"],
                    "key" => $elementName
                );
            }
            $json[] = array(
                "key" => "$dimension - " . $subdimension,
                "values" => $values
            );
            $shape++;
        }
    }
    return json_encode($json);
}
?>
<script>
    var _d3;
    nv.addGraph(function () {
        var init = true;

        var chart = nv.models.scatterChart()
            .showDistX(true)    //showDist, when true, will display those little distribution lines on the axis.
            .showDistY(true)
            .transitionDuration(350)
            .color(d3.scale.category10().range());

        var getGraph = false;
        function getGraphtPt(graph, x1, y1) {
            var a = graph.series.values;
            var i = a.length;

            while (i--) {
                console.log("ax,ay,x1,y1", a[i].x,a[i].y, x1,y1);
                if (a[i].x == x1 & a[i].y == y1) {
                    return a[i];
                }
            }
            return null;
        }

        chart.tooltipContent(function (key, x, y, graph) {
            var s = "unknown";
            var pt = getGraphtPt(graph, x, y);
            if (pt != null) {
                s = pt.key;
            }
            return '<h3>' + key + ": " + s + '</h3>';
        });

        function getLabelForAxis(d) {
            if(!init) {
                return d;
            }
            if (d <= 1.5) {
                return "Sehr gering";
            }
            if (d <= 2.5) {
                return "Gering";
            }
            if (d <= 3.5) {
                return "Mittel";
            }
            if (d <= 4.5) {
                return "Hoch"
            }
            if (d <= 5) {
                return "Sehr Hoch";
            }
            return "";
        }

        //Axis settings
        chart.xAxis
            .tickFormat(function (d) {
                return getLabelForAxis(d);
            })
            .axisLabel("Schwere der Implementierung");
        chart.yAxis
            .tickFormat(function (d) {
                return getLabelForAxis(d);
            })
            .axisLabel("Nutzen");

        chart.scatter.forceX([1, 6]);
        chart.scatter.forceY([1, 6]);

        //We want to show shapes other than circles.
        chart.scatter.onlyCircles(false);

        var myData = getData();
        var svg = d3.select('#chart svg')
        svg.datum(myData)
        svg.call(chart);
        //svg. call(chart);
        nv.utils.windowResize(chart.update);
        toggle();
        $("#toggleChartLabel").click(function () {
            toggle();
        });
        init = false;
        return chart;
    });

    /**************************************
     * Simple test data generator
     */
    function getData() { //# groups,# points per group
        var data = [],
            shapes = ['circle', 'cross', 'triangle-up', 'triangle-down', 'diamond', 'square'],
            data = <?php echo getJson($dimensions); ?>;
        return data;
    }

    function toggle() {
        if ($("text.labels").size() > 0) {
            $("text.labels").remove();
        } else {
            d3.selectAll(".nv-group path")[0].forEach(function (d) {
                var tf = d3.select(d).attr("transform")
                t = d3.transform(tf).translate;

                t[0] = t[0] + 10;//moving the translate x by 5 pixel.
                //console.log(d3.select(d).style("visibility"))//data associated with the point
                var point = d3.select(d).data()[0];
                d3.select(d.parentNode)
                    .append("text")
                    .attr("class", "labels")
                    .text(point.key)//putting data
                    .attr("transform", "translate(" + t[0] + "," + t[1] + ")");//setting the changed translate for label
            });
        }
    }

</script>
<button id="toggleChartLabel">Toggle Label</button>
<div id='chart'>
    <svg style='height:500px'></svg>
</div>