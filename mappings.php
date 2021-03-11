<?php
/**
 * mappings.php
 *
 * @package default
 */


include_once "head.php";
?>
    <body>
<?php
include_once "navi.php";
?>

<?php
include_once "data.php";  // set showPlanned, showPerformed, filteredDimensions
include_once "detail.php";
include_once "functions.php";

$mappingExists = array();
$noMappingExists = array();
$sort = $_GET["sort"] ?? "activity";
$headings = array("Dimension", "Subdimension", "Activity");
$referenceLabels = getReferenceLabels();



/**
 *
 * @param unknown $reference_id
 * @param unknown $sort
 * @return unknown
 */
function formCheck($reference_id, $sort) {
  $checked = ($sort == $reference_id) ? "checked": "";
  $reference_label = getReferenceLabel($reference_id);
  return '
        <div class="form-radio">
        <input class="form-check-input" type="radio" name="sort"
            id="radio'.$reference_id.'"
            value="'.$reference_id.'"
                '. $checked. '
        <label class="form-check-label" for="exampleRadios2">'. ucwords($reference_label).'</label>
        </div>
        ';
}


?>
<form method="get">
    <div class="sort-by">
        Sort by:
        <?php
// Print form headers
echo formCheck("activity", $sort);
foreach ($referenceLabels as $r => $metadata) {
  echo formCheck($r, $sort);
}
?>
    </div>
    <div class="form-check">
        <input type="checkbox" class="form-check-input" name="performed" id="exampleCheck1" value="true"
         <?php if ($showPerformed) {echo " checked=checked";}?>>
        <label class="form-check-label" for="exampleCheck1">Show performed activities</label>
  </div>
  <div class="form-check">
        <input type="checkbox" class="form-check-input" name="planned" id="exampleCheck2" value="true"
         <?php if ($showPlanned) {echo " checked=checked";} ?>>
        <label class="form-check-label" for="exampleCheck2">Show planned activities</label>
  </div>
  <button type="submit" class="btn btn-primary">Submit</button>
</form>

<?php

if ($sort == "activity") {

  echo '<table class="table">';
  $headings = array_merge($headings, array_keys(getReferenceLabels()));
  thead($headings);

  echo '<tbody>';

  foreach (getActions($filteredDimensions) as list($dimension, $subdimension, $activities)) {
    foreach ($activities as $activityName => $activity) {
      echo "<tr>";
      echo "<td>$dimension</td>";
      echo "<td>$subdimension</td>";
      $activityLink = "detail.php?".
        http_build_query(array(
          "dimension" => $dimension,
          "subdimension"=> $subdimension,
          "element"=> $activityName
        ));
      echo "<td><a href='$activityLink'>"
        .div_tooltip($activityName, $activityName, build_table_tooltip ( $activity ))
        ."</a></td>";

      foreach ($referenceLabels as $r => $rLabel) {
        $rlist = $activity["references"][$r] ?? array();
        echo "<td>". ul($rlist) ."</td>";
      }
    }
  }
} else { // sort by samm2, iso, samm
  // populate mapping:
  // mapping = value, activity, content
  $mapping = array();
  foreach (getActions($filteredDimensions) as list($dimension, $subdimension, $activities)) {
    foreach ($activities as $activityName => $activity) {
      $activity["dimension"] = $dimension;
      $activity["subdimension"] = $subdimension;

      $references = $activity["references"][$sort] ?? array();
      foreach (as_list($references) as $mappingContent) {
        $mapping[$mappingContent][$activityName] = $activity;
      }
    }
  }


  // render table
  echo '<table class="table">';
  $headings = array_merge(array("$sort"), $headings, array_keys(getReferenceLabels()));
  thead($headings);

  echo '<tbody>';

  // render mappings.
  ksort($mapping, SORT_NUMERIC);
  foreach ($mapping as $mappingName => $mappingElement) {
    foreach ($mappingElement as $activityName => $activity) {
      echo "<tr>";
      echo "<td>" . $mappingName . "</td>";
      echo "<td>" . $activity['dimension'] . "</td>";
      echo "<td>" . $activity['subdimension'] . "</td>";
      $activityLink = "detail.php?".
        http_build_query(array(
          "dimension" => $dimension,
          "subdimension"=> $subdimension,
          "element"=> $activityName
        ));
      echo "<td><a href='$activityLink'>"
        .div_tooltip($activityName, $activityName, build_table_tooltip ( $activity ))
        ."</a></td>";

      foreach ($referenceLabels as $r => $rLabel) {
        $rlist = $activity["references"][$r] ?? array();
        echo "<td>". ul($rlist) ."</td>";
      }
    }
  }
}

echo "</table>";
//var_dump($noMappingExists);
