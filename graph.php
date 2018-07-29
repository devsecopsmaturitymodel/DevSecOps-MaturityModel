<?php
$title = "Dependencies";
include_once "head.php";
?>
    <body>
<?php
include_once "navi.php"
?>
    <h1>Dependencies</h1>
    <h2>Navigation</h2>
<?php
include_once "data.php";
function hasElementChildren($element) {
    $hasContent = false;
    foreach ($element as $elementName => $content) {
        if (!array_key_exists("dependsOn", $content)) {
            continue;
        }
        $hasContent = true;
    }
    return $hasContent;
}

foreach ($dimensions as $dimension => $subdimensions) {
    foreach ($subdimensions as $subdimension => $element) {

        if (hasElementChildren($element)) {
            echo "<a href='#" . base64_encode($subdimension) . "'>$dimension - $subdimension</a><br />";
        }
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
    return "{source: \"$elementName\", target: \"$parent\", type: \"" . base64_encode($subdimension) . "\"}";
}


foreach ($dimensions as $dimension => $subdimensions) {
    foreach ($subdimensions as $subdimension => $element) {
        if(!hasElementChildren($element)) {
            continue;
        }

        echo "<h2 id='" .urlencode( base64_encode($subdimension)) . "'>$dimension - $subdimension</h2>";
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
                                }
                                $isFirst = false;
                                echo "\"" .urlencode( base64_encode($subdimension) ). "\"";
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