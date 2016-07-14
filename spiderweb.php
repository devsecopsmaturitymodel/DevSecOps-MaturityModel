<?php
$title = "Identifizierung des Implementierungs-Grades";
include_once "head.php";
?>
<body>
<?php
include_once "data.php";
include_once "navi.php";
?>
<div class="spiderweb">
    <div class="chart" id="energychart"></div>
    <?php
    echo getTable($dimensions);
    ?>
</div>
<script src="http://d3js.org/d3.v3.min.js"></script>
<script src="js/circularHeatChart.js"></script>
<script src="js/example.js"></script>
<script src="http://yandex.st/highlightjs/7.3/highlight.min.js"></script>
<script>hljs.initHighlightingOnLoad();</script>
<script>
    loadDiagramm();
    $("table a").click(function (e) {
        e.preventDefault();
        $(this).toggleClass("selected")
        var url = "spiderwebData.php?element=" + $(this).attr("data-element");
        $.ajax({
            url: url,
        }).done(function () {
            loadDiagramm()
        });
    });
</script>
</body>
</html>