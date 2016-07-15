<?php
$itle = "Tabellenübersicht";
include_once "head.php";
?>
<body>
<?php
include_once "data.php";
include_once "navi.php";


echo getTable($dimensions);
//echo '<div class="extra">'.getInfos($dimensions) . '</div>';
?>
<script>
    $(function () {
        $('[data-toggle="popover"]').popover({placement: "bottom", trigger: "hover"}).on('click', function () {
            $(this).popover('toggle');
        });
    })</script>
