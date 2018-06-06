<?php
$title = gettext("Implementation Point Overview");
include_once "head.php";
?>
<body>
<?php
include_once "data.php";
include_once "navi.php";

echo "<h1>Matrix</h1>";
echo getTable($dimensions);

echo "<h1>Activtities per Dimension</h1>";
echo '<div class="extra">'.getInfos($dimensions) . '</div>';
?>
<script>
    $(function () {
        $('[data-toggle="popover"]').popover({placement: "bottom", trigger: "hover"}).on('click', function () {
            $(this).popover('toggle');
        });
    })</script>
