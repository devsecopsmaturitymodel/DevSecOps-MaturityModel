<?php
/**
 * data.php
 *
 * @package default
 * @see detail.php
 * @see graph.php
 * @see index.php
 * @see mappings.php
 * @see md.php
 * @see report-samm.php
 * @see report.php
 * @see scutter.php
 * @see spiderweb.php
 * @see spiderwebData.php
 * @see usefulnessHardness.php
 */


require_once "functions.php";

// get form data
$showPerformed = ($_GET['performed'] ?? false) == "true" ? "true" : false;
$showPlanned = ($_GET['planned'] ?? false) == "true" ? "true" : false;

$dimensions = getDimensions();

// Create filteredDimensions
$filteredDimensions = array();
foreach (getActions($dimensions) as list($dimension, $subdimension, $activities)) {
  foreach ($activities as $activityName => $activity) {
    if (elementIsSelected($activityName, $activity) && !$showPerformed) {
      continue;
    }

    if (!elementIsSelected($activityName, $activity) && !$showPlanned) {
      continue;
    }
    $filteredDimensions[$dimension][$subdimension][$activityName] = $activity;
  }
}


/**
 *
 * @param unknown $dimensions
 * @param unknown $elementImplementation
 * @param unknown $allElements           (reference)
 */
function getDifficultyOfImplementationWithDependencies($dimensions, $elementImplementation, &$allElements) {
  $aggregated = ($_GET['aggregated'] ?? false) == "true" ? "true" : false;
  if ($elementImplementation == null) {
    return;
  }
  $knowledge = getKnowledge($elementImplementation);

  $allElements[] = $knowledge;
  $allElements[] = $elementImplementation['difficultyOfImplementation']["time"];
  $allElements[] = $elementImplementation['difficultyOfImplementation']["time"];
  $allElements[] = $elementImplementation['difficultyOfImplementation']["resources"];

  if (array_key_exists('dependsOn', $elementImplementation) && $aggregated == "true") {
    foreach ($elementImplementation['dependsOn'] as $dependency) {
      $dependencyElement = getActivity($dimensions, $dependency);
      getDifficultyOfImplementationWithDependencies($dimensions, $dependencyElement, $allElements);


      $knowledge = getKnowledge($elementImplementation);

      $allElements[] = $knowledge;
      $allElements[] = $elementImplementation['difficultyOfImplementation']["time"];
      $allElements[] = $elementImplementation['difficultyOfImplementation']["time"];
      $allElements[] = $elementImplementation['difficultyOfImplementation']["resources"];
    }
  }
}


/**
 *
 * @param unknown $dimensions
 * @param unknown $elementImplementation
 * @return unknown
 */
function getDifficultyOfImplementation($dimensions, $elementImplementation) {
  $aggregated = ($_GET['aggregated'] ?? false) == "true" ? "true" : false;
  if ($elementImplementation == null) {
    return;
  }
  $knowledge = getKnowledge($elementImplementation);


  $value = $knowledge + $elementImplementation['difficultyOfImplementation']["time"] * 2 + $elementImplementation['difficultyOfImplementation']["resources"];
  $value = $value / 4;

  if (array_key_exists('dependsOn', $elementImplementation) && $aggregated == "true") {
    foreach ($elementImplementation['dependsOn'] as $dependency) {
      $dependencyElement = getActivity($dimensions, $dependency);
      $value += getDifficultyOfImplementation($dimensions, $dependencyElement);
    }
  }
  if ($value > 5) {
    $value = 5;
  }

  return number_format((float)$value, 2, '.', '');
}


/**
 *
 * @param unknown $elementImplementation
 * @return unknown
 */
function getKnowledge($elementImplementation) {
  $knowledge = $elementImplementation['difficultyOfImplementation']["knowledge"];
  if (is_array($knowledge)) {
    $sum = 0;
    // areas = operation, development, expertise, security
    $areaCount = 4;
    foreach ($knowledge as $knowledgeAttribute) {
      $sum += $knowledgeAttribute;
    }
    $knowledge = $sum / $areaCount;
  }
  return $knowledge;
}


/**
 *
 * @param unknown $parent
 * @param unknown $name
 * @param unknown $isMarkdown (optional)
 * @return unknown
 */
function getElementContentAndCheckExistence($parent, $name, $isMarkdown=false) {
  if (array_key_exists($name, $parent)) {
    return getElementContent($parent[$name], $isMarkdown);
  }
  return "";
}


/**
 *
 * @param unknown $element
 * @param unknown $isMarkdown (optional)
 * @return unknown
 */
function getElementContent($element, $isMarkdown=false) {
  $Extra = new ParsedownExtra();
  $Parsedown = new Parsedown();
  if (!is_array($element)) {
    if ($isMarkdown) {
      return "<div>" . $Parsedown->text($element) . "</div>";
    }else {
      return str_replace("\"", "'", $element);
    }
  }
  if (isAssoc($element)) {
    $contentString = "";
    foreach ($element as $title => $elementContent) {
      $titleWithSpace = preg_replace('/(?<=[a-z])[A-Z]|[A-Z](?=[a-z])/', ' $0', $title);
      $contentString .= "<b>" . ucfirst($titleWithSpace) . "</b>";
      $contentString .= "<ul>";
      if (is_array($elementContent)) {
        $contentString .= getElementContent($elementContent);
      } else
        $contentString .= "<li>" . $Extra->text($elementContent) . "</li>";
      $contentString .= "</ul>";
    }
    return $contentString;

  }

  // default
  $contentString = "<ul>";
  foreach ($element as $content) {
    $contentString .= "<li>" . $content . "</li>";
  }
  $contentString .= "</ul>";

  return $contentString;
}


/**
 *
 * @param array   $arr
 * @return unknown
 */
function isAssoc(array $arr) {
  if (array() === $arr) return false;
  return array_keys($arr) !== range(0, count($arr) - 1);
}


/**
 *
 * @param unknown $risk
 * @return unknown
 */
function render_risk($risk) {

  if (is_array($risk)) {
    return implode("\ ", $risk);
  }
  return $risk;
}


/**
 * Render an activity in a tooltip.
 *
 * @param unknown $array
 * @param unknown $headerWeight (optional)
 * @return unknown
 */
function build_table_tooltip($array, $headerWeight = 2) {
  $Parsedown = new Parsedown();


  getElementContentAndCheckExistence($array, "meta");

  $html = "";
  $html .= "<h" . $headerWeight . ">Risk and Opportunity</h$headerWeight>";
  if (array_key_exists("risk", $array)) {
    $risk = render_risk($array['risk']);
  }elseif (array_key_exists("risk-md", $array)) {
    $risk = $Parsedown->text($array['risk-md']);
  }else {
    echo "Error, no risk";
    exit;
  }
  $html .= "<div><b>" . "Risk" . ":</b> " . $risk . "</div>";
  $html .= "<div><b>" . "Opportunity" . ":</b> " . $array['measure'] . "</div>";
  return $html;
}


/**
 *
 * @param unknown $dimensions
 * @param unknown $name
 * @return unknown
 */
function getActivity($dimensions, $name) {
  foreach ($dimensions as $dimensionName => $subDimension) {
    foreach ($subDimension as $subDimensionName => $activities) {
      foreach ($activities as $activityName => $activity) {
        if ($activityName == $name) {
          return $activity;
        }
      }
    }
  }
}
