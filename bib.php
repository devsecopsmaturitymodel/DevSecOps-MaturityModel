<?php
error_reporting(E_ERROR);

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

function elementIsSelected($elementName)
{
    foreach (getCsv() as $element) {
        if ($elementName == $element["element"]) {
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