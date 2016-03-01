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
include_once "navi.php"
?>
<h1>Abhängigkeiten</h1>
<h2>Navigation</h2>
<?php
include_once "data.php";
foreach ($dimensions as $dimension => $subdimensions) {
    foreach ($subdimensions as $subdimension => $element) {
        echo "<a href='#" . base64_encode($subdimension) . "'>$dimension - $subdimension</a><br />";
    }
}
?>
<style>
    .link {
        fill: none;
        stroke: #666;
        stroke-width: 1.5px;
    }

    #licensing {
        fill: green;
    }

    .link.licensing {
        stroke: green;
    }

    .link.resolved {
        stroke-dasharray: 0, 2 1;
    }

    circle {
        fill: #ccc;
        stroke: #333;
        stroke-width: 1.5px;
    }

    text {
        font: 10px sans-serif;
        pointer-events: none;
        text-shadow: 0 1px 0 #fff, 1px 0 0 #fff, 0 -1px 0 #fff, -1px 0 0 #fff;
    }
</style>
<?php
function getSourceAndParent($elementName, $subdimension, $parent = "")
{
    return "{source: \"$elementName\", target: \"$parent\", type: \"".base64_encode($subdimension)."\"}";
}

foreach ($dimensions as $dimension => $subdimensions) {
foreach ($subdimensions as $subdimension => $element) {
echo "<h2 id='" . base64_encode($subdimension) . "'>$dimension - $subdimension</h2>";
?>
<script>
    (function () {
        var links = [
            <?php
            $first = true;

            //if($subdimension != "Erzeugung") continue;
            foreach ($element as $elementName => $content) {
                if (!array_key_exists("dependsOn", $content)) {
                    continue;
                }

                $parent = "Ohne";
                if (array_key_exists("dependsOn", $content)) {
                    $parent = $content["dependsOn"][0];
                }
                if (array_key_exists("dependsOn", $content)) {
                    foreach ($content["dependsOn"] as $dependsOn) {
                        if (!$first) {
                            echo ",";
                        }
                        $first = false;
                        echo getSourceAndParent($elementName, $subdimension, $dependsOn);
                    }
                } else {
                    if (!$first) {
                        echo ",";
                    }
                    $first = false;
                    echo getSourceAndParent($elementName, $subdimension, $parent);
                }

            }
            ?>
        ]
        var nodes = {};

// Compute the distinct nodes from the links.
        links.forEach(function (link) {
            link.source = nodes[link.source] || (nodes[link.source] = {name: link.source});
            link.target = nodes[link.target] || (nodes[link.target] = {name: link.target});
        });

        var width = 960,
            height = 500;

        var force = d3.layout.force()
            .nodes(d3.values(nodes))
            .links(links)
            .size([width, height])
            .linkDistance(60)
            .charge(-300)
            .on("tick", tick)
            .start();

        var svg = d3.select("body").append("svg")
            .attr("width", width)
            .attr("height", height);

// Per-type markers, as they don't inherit styles.
        svg.append("defs").selectAll("marker")
            .data([
                <?php
                $isFirst = true;
                foreach ($dimensions as $dimension => $subdimensions) {
                    foreach ($subdimensions as $subdimension => $element) {
                        if (!$isFirst) {
                            echo ",";
                        }$isFirst = false;
                            echo "\"".base64_encode($subdimension)."\"";
                    }
                }
                ?>
            ])
            .enter().append("marker")
            .attr("id", function (d) {
                return d;
            })
            .attr("viewBox", "0 -5 10 10")
            .attr("refX", 15)
            .attr("refY", -1.5)
            .attr("markerWidth", 6)
            .attr("markerHeight", 6)
            .attr("orient", "auto")
            .append("path")
            .attr("d", "M0,-5L10,0L0,5");

        var path = svg.append("g").selectAll("path")
            .data(force.links())
            .enter().append("path")
            .attr("class", function (d) {
                return "link " + d.type;
            })
            .attr("marker-end", function (d) {
                return "url(#" + d.type + ")";
            });

        var circle = svg.append("g").selectAll("circle")
            .data(force.nodes())
            .enter().append("circle")
            .attr("r", 6)
            .call(force.drag);

        var text = svg.append("g").selectAll("text")
            .data(force.nodes())
            .enter().append("text")
            .attr("x", 8)
            .attr("y", ".31em")
            .text(function (d) {
                return d.name;
            });

// Use elliptical arc path segments to doubly-encode directionality.
        function tick() {
            path.attr("d", linkArc);
            circle.attr("transform", transform);
            text.attr("transform", transform);
        }

        function linkArc(d) {
            var dx = d.target.x - d.source.x,
                dy = d.target.y - d.source.y,
                dr = Math.sqrt(dx * dx + dy * dy);
            return "M" + d.source.x + "," + d.source.y + "A" + dr + "," + dr + " 0 0,1 " + d.target.x + "," + d.target.y;
        }

        function transform(d) {
            return "translate(" + d.x + "," + d.y + ")";
        }
    })();
</script>
<?php
}
}
?>