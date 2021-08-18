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
  $evidenceContent = getElementContentAndCheckExistence($element, "evidence", true);
  if ($evidenceContent == "") {
    $evidenceContent = "TODO";
  }
  if (IS_SHOW_EVIDENCE_TODO || $evidenceContent != "TODO")
    echo "<h" .($headerWeight + 2) . ">" . "Evidence" . "</h" .($headerWeight + 2) . ">"  . $evidenceContent;

  echo "<hr/>";

  if (array_key_exists("assessment", $element)) {
    $Parsedown = new Parsedown();
    echo "<h" . $headerWeight + 1 . ">Assessment</h" . $headerWeight + 1 . ">";
    echo $Parsedown->text($element["assessment"]);
  }
  if (array_key_exists("dependsOn", $element) || array_key_exists("implementation", $element) || array_key_exists("comment", $element) || array_key_exists("meta", $element)) {
    echo "<h" . ($headerWeight + 1) . ">Additional Information</h" . ($headerWeight + 1) . ">";
    if (array_key_exists("dependsOn", $element)) {
      $dependsOn = $element['dependsOn'];
      $dependencies = implode(", ", $dependsOn);
      echo "<div><b>Dependencies:</b> $dependencies</div>";
    }
    echo getElementContentAndCheckExistence($element, "meta");
  }


  if (array_key_exists("md-description", $element) && !empty($element['md-description'])) {
    $Parsedown = new Parsedown();
    echo $Parsedown->text($element['md-description']);
  }
  if (array_key_exists("implementation", $element) && !empty($element['implementation'])) {
    $implementation = $element['implementation'];
    echo "<div><h" . ($headerWeight + 2) . ">Implementation hints</h" . ($headerWeight + 2) . ">";
    if (is_array($implementation)) {
      echo "<ul>";
      foreach ($implementation as $implementationElement) {
        echo "<li>";
        if (is_array($implementationElement)) {
          echo $implementationElement['name'] . ', ';
          if (!empty($implementationElement['url'])) {
            echo '<a href="' . $implementationElement['url'] . '\">Link</a>';
          }
          echo ", Tags: ";
          foreach ($implementationElement['tags'] as $tag) {
            echo $tag . " ";
          }
        } else {
          echo "$implementationElement";
        }
        echo "</li>";
      }
      echo "</ul>";
    } else {
      echo $implementation;
    }
    echo "</div>";
  }
  if (array_key_exists("comment", $element) && !empty($element['comment'])) {
    $comment = $element['comment'];
    echo "<div><b>Comments:</b> $comment</div>";
  }

  $mapKnowLedge = array("Very Low (one discipline)", "Low (one discipline)", "Medium (two disciplines)", "High (two disciplines)", "Very High (three or more disciplines)");
  $mapTime = array("Very Low", "Low", "Medium", "High", "Very High");
  $mapResources = $mapTime;
  $mapUsefulness = $mapTime;
  $html = "<h" . ($headerWeight + 2) . ">Usefulness and Requirements of this Activity</h" . ($headerWeight + 2) . ">";
  $html .= "<div><b>Usefullness:</b> " . ucfirst($mapUsefulness[$element['usefulness'] - 1]) . "</div>";
  $html .= "<div><b>Required knowledge:</b> " . ucfirst($mapKnowLedge[$element['difficultyOfImplementation']['knowledge'] - 1]) . "</div>";
  $html .= "<div><b>Required time:</b> " . ucfirst($mapTime[$element['difficultyOfImplementation']['time'] - 1]) . "</div>";
  $html .= "<div><b>Required resources (systems):</b> " . ucfirst($mapResources[$element['difficultyOfImplementation']['resources'] - 1]) . "</div>";
  echo $html;

  printReferences($element);
  if (array_key_exists("credits", $element) && !empty($element['credits'])) {
    echo "<h" . ($headerWeight + 2) . ">Credits</h" . ($headerWeight + 2) . ">";
    $Parsedown = new Parsedown();
    echo "This activity is inspired/copied by/from " . $Parsedown->text($element['credits']);
  }
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
    echo "<ul><li>" . implode("</li><li>", $values) . "</li></ul>";
  }


}


// echo var_dump($dimensions);
printDetail($dimension, $subdimension, $activityName, $dimensions);
