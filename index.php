<?php
/**
 * index.php
 *
 * @package default
 */


$title = "Activities Overview";
include_once "head.php";
?>
<body>
<?php
include_once "data.php";
include_once "navi.php";

echo "<h1>Matrix</h1>";
echo getTable($dimensions);

echo "<h1>Activities per Dimension</h1>";
echo '<div class="extra">'.getInfos($dimensions) . '</div>';
?>
