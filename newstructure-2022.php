<?php
/**
 * newstructure-2022.php
 *
 * @package default
 */


require_once "functions.php";
$Parsedown = new Parsedown();
$files = glob("data/dimensions-subdimensions-activities/*/*.yaml");
$dimensions = array();
foreach ($files as $filename) {
  if (preg_match("/_meta.yaml/", $filename)) continue;
  $dimension = getDimensions($filename);
  //ksort($dimensions);
  foreach ($dimension as &$subdimensions) {
    foreach ($subdimensions as $subdimension => &$elements) {
      if (substr($subdimension, 0, 1) == "_")
        continue;
      foreach ($elements as $activityName => &$activity) {
        if (array_key_exists("risk", $activity)) {
          if (is_array($activity["risk"])) {
            //echo "$activityName has array<br>";
            $risk = "";
            $newline="";
            $minus="-";
            if (sizeof($activity["risk"]) == 1) {
              $minus="";
            }
            foreach ($activity["risk"] as $riskItem) {
              $risk = "$newline$minus " . $riskItem;
              $newline="\n";
            }
            $activity["risk"] = trim($risk);
          }
        }
        if (array_key_exists("risk-md", $activity)) {
          echo "$activityName has risk-md";
          if (array_key_exists("risk", $activity)) {
            echo "$activityName has risk-md and risk";
            exit;
          }
          $activity['risk'] = trim($Parsedown->text($activity["risk-md"]));
          unset($activity['risk-md']);
        }
        if (array_key_exists("samm2", $activity['references'])) {
          if (!is_array($activity['references']["samm2"])) {
            $activity['references']["samm2"] = array($activity['references']["samm2"]);
          }
        }
        if (!array_key_exists("level", $activity)) {
          echo "'$activityName' is not complete!";
          echo "<pre>";
          var_dump($activity);
          echo "</pre>";
          exit;
        }
      }
    }
  }

  //resolve_json_ref($dimension);
  $dimensionsString = yaml_emit($dimension);
  file_put_contents($filename, $dimensionsString);
  //file_put_contents("/var/www/html/data/new/" . basename($filename), $dimensionsString);
}


exit;
