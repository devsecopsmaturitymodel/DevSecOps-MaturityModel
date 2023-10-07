<?php
/**
 * bib.php
 *
 * @package default
 * @see functions.php
 * @see head.php
 * @see spiderwebData.php
 */


require __DIR__ . '/vendor/autoload.php';
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);
define('NUMBER_LEVELS', 4);
if (isset($_ENV["IS_IMPLEMENTED_WHEN_EVIDENCE"])) {
    $enforce=boolval($_ENV["IS_IMPLEMENTED_WHEN_EVIDENCE"]);
    define('IS_IMPLEMENTED_WHEN_EVIDENCE', $enforce);
}else {
    define('IS_IMPLEMENTED_WHEN_EVIDENCE', false);
}

/**
 *
 * @param unknown $filename
 * @param unknown $delimiter
 * @return unknown
 */
function readCSV($filename, $delimiter) {
    static $csvContent = [];
    if (!file_exists($filename) || !is_readable($filename))
        return FALSE;
    if (!array_key_exists($filename, $csvContent)) {
        $header = NULL;
        $csvContent[$filename] = array();
        if (($handle = fopen($filename, 'r')) !== FALSE) {
            while (($row = fgetcsv($handle, 1000, $delimiter)) !== FALSE) {
                if (!$header)
                    $header = $row;
                else
                    $csvContent[$filename][] = array_combine($header, $row);
            }
            fclose($handle);
        }
    }

    return $csvContent[$filename];
}


/**
 *
 * @param unknown $csvFile
 * @param unknown $givenActivityName
 * @return unknown
 */
function isElement($csvFile, $givenActivityName) {
    $csv = readCSV($csvFile, ",");
    foreach ($csv as $activityName) {
        if ($activityName["element"] == $givenActivityName) {
            return true;
        }
    }
    return false;
}


/**
 *
 * @param unknown $activityName
 * @param unknown $activity
 * @return unknown
 */
function elementIsSelected($activityName, $activity) {
    $csvFile = 'selectedData.csv';
    $isElement = isElement( $csvFile, $activityName);
    if ($isElement) return true;
    return array_key_exists("evidence", $activity);
}


/**
 *
 * @param unknown $activityName
 * @return unknown
 */
function elementIsShown($activityName) {
    $csvFile = 'shownData.csv';
    return isElement( $csvFile, $activityName);
}

/**
 *
 * @param unknown $array
 * @param unknown $index
 * @return unknown
 */
function getFlattenedArray($array, $index) {
    if (!array_key_exists($index, $array)) {
        return "TODO";
    }

    $return = "";
    $potentialArray = $array[$index];
    if (is_array($potentialArray)) {
        $return .= "<ul>";
        foreach ($potentialArray as $element => $content) {
            $return .= "<li>$content</li>";
        }
        $return .= "</ul>";
    } else {
        $return .= $potentialArray;
    }
    return $return;
}