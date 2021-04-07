<?php
/**
 * report-samm.php
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
include_once "data.php";
include_once "detail.php";

$mappingExists = array();
$noMappingExists = array();
$old_dimension = null;


foreach (getActions($dimensions) as list($dimension, $subdimensions, $element)) {
  if ($dimension != $old_dimension) {
    echo "<h1>Dimension $dimension</h1>";
    $old_dimension = $dimension;
  }

  $mappingExists[$subdimension] = array();
  $noMappingExists[$subdimension] = array();
  echo "<h2>Sub-Dimension $subdimension</h2>";

  echo "<h3 style='color:green;'>With SAMM2 Mapping</h3>";
  for ($i = 1; $i <= 4; $i++) {
    $tableContent .= "<td><ul>";
    foreach ($element as $activityName => $content) {
      if (array_key_exists("samm2", $content) && !preg_match("/TODO/i", $content["samm2"])) {
        $content2 = getContentForLevelFromSubdimensions($i, $content, $activityName);

        if ($content2 != "") {
          printDetail($dimension, $subdimension, $activityName, $dimensions, true);
          $mappingExists[$subdimension][$content["samm2"]][$activityName] = $content;
        }
      }
    }
  }

  echo "<h3 style='color:red;'>Without SAMM2 Mapping</h3>";
  for ($i = 1; $i <= 4; $i++) {
    $tableContent .= "<td><ul>";
    foreach ($element as $activityName => $content) {
      if (!array_key_exists("samm2", $content) || preg_match("/TODO/i", $content["samm2"])) {
        $content2 = getContentForLevelFromSubdimensions($i, $content, $activityName);

        if ($content2 != "") {
          printDetail($dimension, $subdimension, $activityName, $dimensions, true);
          $content["name"] = $activityName;
          $noMappingExists[$subdimension][$content["samm2"]][$activityName] = $content;
        }
      }
    }
  }
}
foreach ($mappingExists as $dimension => $category) {
  //var_dump($mappingExists);
  echo "<h1>".$dimension ."</h1>";
  foreach ($category as $category => $content) {
    //var_dump($content);exit;
    echo $category . " ".count($content) . " ";
    foreach ($content as $activityName => $content2) {
      echo "$activityName" . " /";   }
    echo   "<br>";
  }
}

//var_dump($noMappingExists);
