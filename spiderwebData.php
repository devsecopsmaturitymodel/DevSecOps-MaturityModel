<?php
/**
 * spiderwebData.php
 *
 * @package default
 */


$elementParam = $_REQUEST['element'] ?? null;

include_once "bib.php";
include_once "data.php";


/**
 *
 * @param unknown $dimensions
 * @return unknown
 */
function getSpiderWebData($dimensions) {
  $data = array();
  foreach (getActions($dimensions) as list($dimension, $subdimension, $activities)) {
    for ($level = 1; $level <= 4; $level++) {
      // initialize $data cells
      if (! ($data[$level][$dimension][$subdimension] ?? null)) {
        $data[$level][$dimension][$subdimension]['count'] = 0;
        $data[$level][$dimension][$subdimension]['selected'] = 0;
      }
      foreach ($activities as $activityName => $activity) {
        if ($level == $activity["level"]) {
          $data[$level][$dimension][$subdimension]['count']++;
          if (elementIsSelected($activityName, $activity)) {
            $data[$level][$dimension][$subdimension]['selected']++;
          }
        }

      }
    }
  }
  return $data;
}


/**
 *
 * @param unknown $haystack
 * @param unknown $needle
 * @return unknown
 */
function startsWith($haystack, $needle) {
  // search backwards starting from haystack length characters from the end
  return $needle === "" || strrpos($haystack, $needle, -strlen($haystack)) !== false;
}


/**
 *
 * @param unknown $filePointer
 * @param unknown $dataArray
 * @param unknown $delimiter   (optional)
 * @param unknown $enclosure   (optional)
 */
function fwritecsv2($filePointer, $dataArray, $delimiter = ",", $enclosure = "\"") {
  // Write a line to a file
  // $filePointer = the file resource to write to
  // $dataArray = the data to write out
  // $delimeter = the field separator

  // Build the string
  $string = "";

  // for each array element, which represents a line in the csv file...
  foreach ($dataArray as $line) {

    // No leading delimiter
    $writeDelimiter = FALSE;

    foreach ($line as $dataElement) {
      // Replaces a double quote with two double quotes
      $dataElement = str_replace("\"", "\"\"", $dataElement);

      // Adds a delimiter before each field (except the first)
      if ($writeDelimiter) $string .= $delimiter;

      // Encloses each field with $enclosure and adds it to the string
      $string .= $enclosure . $dataElement . $enclosure;

      // Delimiters are used every time except the first.
      $writeDelimiter = TRUE;
    }
    // Append new line
    $string .= "\n";

  } // end foreach($dataArray as $line)

  $string = str_replace('""', '"element"', $string);
  if (!startsWith($string, "element") && !startsWith($string, '"element"')) {
    $string = "element" . $string;
  }
  // Write the string to the file
  fwrite($filePointer, $string);
}


//var_dump( getSpiderWebData($dimensions));exit;


/**
 *
 * @param unknown $data         (reference)
 * @param unknown $activityName
 */
function deleteElement(&$data, $activityName) {
  $count = 0;
  foreach ($data as $element) {
    if ($activityName == $element["element"]) {
      unset($data[$count]);
    }
    $count++;
  }
}


/**
 *
 * @param unknown $dimensions
 * @param unknown $givenElementName
 * @return unknown
 */
function isElementExisting($dimensions, $givenElementName) {
  foreach ($dimensions as $dimension => $subdimensions) {
    foreach ($subdimensions as $subdimension => $element) {
      foreach ($element as $activityName => $content) {
        if ($activityName == $givenElementName) {
          return true;
        }
      }
    }
  }
  return false;
}


if ($elementParam == null) {
  echo json_encode(getSpiderWebData($dimensions));
  return;
}

{
  $csv = getCsv();
  $element = $elementParam;
  $csvFile = 'selectedData.csv';
  if (isElement( $csvFile, $element)) {
    echo "Deleted element";
    deleteElement($csv, $element);
  } else {
    if (!isElementExisting($dimensions, $element)) {
      echo "Could not find element";
      exit;
    }
    $newEntry['element'] = $element;
    $csv[] = $newEntry;
  }
  if (array_key_exists(0, $csv)) {
    $keys = array_keys($csv[0]);
  } else if (array_key_exists(1, $csv)) {
    $keys = array_keys($csv[1]);
  } else {
    $keys = array("element");
  }

  $csv = array_merge(array($keys), $csv);
  $fp = fopen($csvFile, 'w');
  fwritecsv2($fp, $csv, ",");
  fclose($fp);
}
