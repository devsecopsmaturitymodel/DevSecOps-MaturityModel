<?php
/**
 * scutter.php
 *
 * @package default
 */


include_once "head.php";
?>
<body>
<?php
include_once "navi.php";
?>
<script src="assets/js/scutter.js"></script>

<?php
include_once "data.php";
include_once "functions.php";

$aggregated = ($_GET['aggregated'] ?? false) == "true" ? "true" : false;


/**
 *
 * @param unknown $dimensions
 * @return unknown
 */
function getJson($dimensions) {
  $json = array();
  $shapes = array('circle', 'cross', 'triangle-up', 'triangle-down', 'diamond', 'square');
  $shape = 0;
  foreach (getActions($dimensions) as list($dimension, $subdimension, $element)) {
    $values = array();
    foreach ($element as $activityName => $content) {
      $values[] = array(
        "series" => 0,
        "shape" => $shapes[$shape] ?? "square",
        "size" => 3000,
        "x" => 5-getDifficultyOfImplementation($dimensions, $content),
        "y" => $content["usefulness"],
        "key" => $activityName
      );
    }
    $json[] = array(
      "key" => "$dimension - " . $subdimension,
      "values" => $values
    );
    $shape++;
  }
  return json_encode($json);
}


?>
<script>
    /**************************************
     * Simple test data generator
     */
    function getData() { //# groups,# points per group
        var data = [],
            shapes = ['circle', 'cross', 'triangle-up', 'triangle-down', 'diamond', 'square'],
            data = <?php echo getJson($dimensions); ?>;
        return data;
    }
</script>
<button id="toggleChartLabel">Toggle Label</button>

<form action="?" method="get">
<?php
$aggregated = $_GET['aggregated'] ?? null;
?>
<button id="">
<?php
echo ($aggregated == "true") ?  "Show specific values" : "Show total values";
?>
    </button>
</form>
<div id='chart'>
    <svg style='height:500px'></svg>
</div>
