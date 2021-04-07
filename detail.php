<?php
/**
 * detail.php
 *
 * @package default
 * @see mappings.php
 * @see report-samm.php
 * @see report.php
 */


if (array_key_exists("element", $_GET)) {
  $title = "Details for '" . htmlspecialchars($_GET['element']) . "'";
}
include_once "head.php";
?>
    <body>
<?php
include_once "data.php";
include_once "navi.php";

$dimension = $_GET['dimension'] ?? null;
$subdimension = $_GET['subdimension'] ?? null;
$activityName = $_GET['element'] ?? null;


/**
 *
 * @param unknown $dimension
 * @param unknown $subdimension
 * @param unknown $activityName
 * @param unknown $dimensions
 * @param unknown $report       (optional)
 */
function printDetail($dimension, $subdimension, $activityName, $dimensions, $report = false) {
  $element = $dimensions[$dimension][$subdimension][$activityName] ?? null;

  if ($element == null) { //Whitelist approach for security reasons (deny XSS)
    //echo "Sorry, we could not found the element";
    return;
  }
  if ($report) {
    $headerWeight = 3;
  } else {
    $headerWeight = 1;
  }

  $pageH1 = "";
  if (!$report) {
    $pageH1 .= $dimension;

    if ($dimension != $subdimension) {

      $pageH1 .= " -> $subdimension";
    }
    $pageH1 .= ": $activityName";
  } else {
    $pageH1 .= "$activityName";
  }

  echo "<h$headerWeight>$pageH1</h$headerWeight>";
  echo build_table_tooltip($element, $headerWeight + 1);
  echo "<hr/>";

  if (array_key_exists("dependsOn", $element) || array_key_exists("implementation", $element) || array_key_exists("comment", $element) || array_key_exists("meta", $element)) {
    echo "<h" . ($headerWeight + 1) . ">Additional Information</h" . ($headerWeight + 1) . ">";
    if (array_key_exists("dependsOn", $element)) {
      $dependsOn = $element['dependsOn'];
      $dependencies =  implode(", ", $dependsOn);
      echo "<div><b>Dependencies:</b> $dependencies</div>";
    }
    echo getElementContentAndCheckExistence($element, "meta");
  }


  if (array_key_exists("md-description", $element) && !empty($element['md-description'])) {
    echo "<div style=\"background: #F5F5F5\"";
    echo $element['md-description'];
    echo "</div>";
  }

  echo get_implementation($element);

  if (array_key_exists("comment", $element) && !empty($element['comment'])) {
    $comment = $element['comment'];
    echo "<div><b>Comments:</b> $comment</div>";
  }

  printReferences($element);
}

function get_implementation($activity){
  $implementation = $activity['implementation'] ?? [];
  $items = as_list($implementation);
  $ret = ul($items, callback=function($str){
    return $str;
  });

  echo "<div><b>Implementation hints:</b>$ret</div>";
}
/**
 *
 * @param unknown $element
 */
function printReferences($element) {
  if (!array_key_exists("references", $element)) {
    return;
  }
  $actionLabels = readYaml("data/strings.yml#/actionLabels");

  $references = $element['references'];
  foreach ($references as $r => $values) {
    // if it's not an array, array-ze it. Remove after fixing all yamls.
    $values = is_array($values) ? $values : array($values);

    $label = getReferenceLabel($r);
    echo "<div><h3>$label</h3></div>";
    echo "<ul><li>".  implode("</li><li>", $values) ."</li></ul>";
  }


}


// echo var_dump($dimensions);
printDetail($dimension, $subdimension, $activityName, $dimensions);
