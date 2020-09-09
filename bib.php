<?php
error_reporting(E_ERROR);
define(NUMBER_LEVELS, 4);
function readCSV($filename, $delimiter)
{
    if (!file_exists($filename) || !is_readable($filename))
        return FALSE;

    $header = NULL;
    $data = array();
    if (($handle = fopen($filename, 'r')) !== FALSE) {
        while (($row = fgetcsv($handle, 1000, $delimiter)) !== FALSE) {
            if (!$header)
                $header = $row;
            else
                $data[] = array_combine($header, $row);
        }
        fclose($handle);
    }
    return $data;
}

function elementIsSelected($activityName)
{
    foreach (getCsv() as $element) {
        if ($activityName == $element["element"]) {
            return true;
        }
    }
    return false;
}

$csvFile = 'selectedData.csv';
function getCsv() {
    $csvFile = 'selectedData.csv';
    $csv= readCSV($csvFile, ",");
    return $csv;
}

function getFlattenedArray($array, $index) {
    if(!array_key_exists($index, $array)) {
        return "TODO";   
    }

    $return = "";
    $potentialArray = $array[$index];
    if(is_array($potentialArray)) {
        $return .= "<ul>";
        foreach($potentialArray as $element => $content) {
            $return .= "<li>$content</li>";
        }
        $return .= "</ul>";
    }else {
        $return .= $potentialArray;
    }
    return $return;
}