<?php
/**
 * functions.php
 *
 * @package default
 * @param unknown $file
 * @return unknown
 */


function readYaml($file) {
  $fragment = null;
  if (strpos($file, "#") != false) {
    list($file, $fragment) = explode("#", $file,  2);
    $fragment = trim($fragment, "/ ");
  }
  $ret = yaml_parse(
    file_get_contents($file)
  );
  if ($fragment) {
    foreach (explode("/", $fragment) as $key) {
      $ret = $ret[$key];
    }

  }
  return $ret;
}


/**
 * Get dimensions from yaml file.
 *
 * @return unknown
 */
function getDimensions() {
  $dimensions = readYaml("data/dimensions.yaml");

  // reorder in-place $dimensions. This should wrap readYaml(data/dimensions.yaml)
  ksort($dimensions);
  foreach ($dimensions as $dimensionName => $subDimension) {
    ksort($subDimension);
    foreach ($subDimension as $subDimensionName => $elements) {

      // Q: should I retain this?
      if (substr($subDimensionName, 0, 1) == "_")
        continue;

      // Upgrade old configuration to `references:`
      //   this code can be modified to other models.
      foreach ($elements as $activityName => $content) {

        if ($content["references"] ?? null) // ignore new lines
          continue;

        $content["references"]["samm2"] = $content["samm2"] ?? array();
        unset($content["samm2"]);
        $content["references"]["iso27001-2017"] = $content["iso27001-2017"] ?? array();
        unset($content["iso27001-2017"]);
        //echo var_dump($elements[$activityName]);
        //echo "<hr>";
        $elements[$activityName] = $content;

      }
      $newElements = $elements;
      ksort($newElements);
      $dimensions[$dimensionName][$subDimensionName] = $newElements;
    }
  }
  return $dimensions;
}


/**
 * This function should be a sort of db wrapper.
 *
 * @param unknown $dimensions
 */
function getActions($dimensions) {
  ksort($dimensions);
  foreach ($dimensions as $dimension => $subdimensions) {
    ksort($subdimensions);

    foreach ($subdimensions as $subdimension => $element) {
      if (substr($subdimension, 0, 1) == "_")
        continue;
      yield array($dimension, $subdimension, $element);
    }
  }
}


/**
 *
 * @return unknown
 */
function getReferenceLabels() {
  return readYaml("data/strings.yml#/strings/en/references");
}


/**
 *
 * @param unknown $reference_id
 * @return unknown
 */
function getReferenceLabel($reference_id) {
  $referenceLabels = readYaml("data/strings.yml#/strings/en/references");

  return $referenceLabels[$reference_id]["label"] ?? $reference_id;
}


/**
 *
 * @param unknown $headings
 */
function thead($headings) {
  echo '<thead><tr><th scope="col">'
    .implode('</th><th scope="col">', $headings)
    .'</th></tr></thead>';
}


/**
 *
 * @param unknown $title
 * @param unknown $html_content
 * @param unknown $html_tooltip
 * @return unknown
 */
function div_tooltip($title, $html_content, $html_tooltip) {
  $tooltip =  "<div class='popoverdetails'>" .$html_tooltip . "</div>";
  return "<div data-toggle=\"popover\"
        data-title=\"$title\"
        data-activity=\".$html_tooltip\"
        type=\"button\" data-html=\"true \">" . $html_content . "</div>";
}


/**
 *
 * @param unknown $samm_reference
 * @return unknown
 */
function renderSamm($samm_reference) {
  return "$samm_reference";
}


/**
 *
 * @param unknown $items
 */
function as_list($items) {
  if (is_array($items)) {
    yield from $items;
  } else {
    yield $items;
  }
}


/**
 *
 * @param unknown $samm_references
 * @param unknown $callback        (optional)
 * @return unknown
 */
function ul($samm_references, $callback='renderSamm') {
  if ( ! is_array($samm_references) ) {
    return ($callback)($samm_references);
  }

  $ret = "<ul><li>"
    . implode("</li><li>", array_map($callback, $samm_references))
    ."</li></ul>";
  return $ret;
}


/**
 *
 * @param unknown $references
 */
function getReferences($references) {
  foreach ($references as $r_name => $rlist) {

  }

}


// TODO create testcases


/**
 *
 */
function test_getActions() {
  $dimensions = readYaml("data/dimensions.yaml");
  echo var_dump(getActions($dimensions));
}


/**
 *
 */
function test_readYaml() {
  $ret = readYaml("data/strings.yml");
  echo var_dump($ret);
  echo "<hr>";
  $ret = readYaml("data/strings.yml#/strings/en");
  echo var_dump($ret);
  echo "<hr>";
}


?>
