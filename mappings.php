<?php
include_once "head.php";
?>
    <body>
<?php
include_once "navi.php";
?>
<?php
include_once "data.php";
include_once "detail.php";

$mappingExists = array();
$noMappingExists = array();
?>
<table class="table">
<thead>
    <tr>
        <th scope="col">Dimension</th>
        <th scope="col">Subdimension</th>
        <th scope="col">Actvity</th>
        <th scope="col">SAMM 2</th>
        <th scope="col">ISO 27001</th>
    </tr>
</thead>
<tbody>
<?php

foreach ($dimensions as $dimension => $subdimensions) {
    foreach ($subdimensions as $subdimension => $activity) {
       foreach ($activity as $activityName => $content) {
        echo "<tr>";
        echo "<td>$dimension</td>";
        echo "<td>$subdimension</td>";
        $tooltip = "<div class='popoverdetails'>" . build_table_tooltip ( $content ) . "</div>";
	    echo "<td><div data-toggle=\"popover\" data-title=\"$activityName\" data-content=\"$tooltip\" type=\"button\" data-html=\"true \">" . $activityName . "</div></td>";
           echo "<td>" . getFlattenedArray($content, "samm2") . "</td>";
           echo "<td>" . getFlattenedArray($content, "iso27001-2017") . "</td>";
        }
    }
}

echo "</table>";
//var_dump($noMappingExists);