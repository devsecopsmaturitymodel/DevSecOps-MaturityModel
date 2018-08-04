<?php
include_once "head.php";
?>
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
                    "x" => getDifficultyOfImplementation($dimensions, $content),
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
            .axisLabel("Ease of Implementation");
        chart.yAxis
            .tickFormat(function (d) {
                return getLabelForAxis(d);
            })
            .axisLabel("Value");

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

<form action="?" method="get">
<input name="aggregated" type="hidden"
<?php
if($_GET['aggregated'] == "true") {
    echo "value='false'";
}else {
    echo "value='true'";
}
?>">

</input>
    <button id="">
        <?php
        if($_GET['aggregated'] == "true") {
            echo "Show specific values";
        }else {
            echo "Show total values";
        }
        ?>
    </button>
</form>
<div id='chart'>
    <svg style='height:500px'></svg>
</div>