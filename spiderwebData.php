<?php

include_once "bib.php";
include_once "data.php";
function getSpiderWebData($dimensions)
{
    $data = array();
    foreach ($dimensions as $dimension => $subdimensions) {
        foreach ($subdimensions as $subdimension => $element) {
            for ($level = 1; $level <= 4; $level++) {
                if (!array_key_exists($subdimension, $data[$level][$dimension])) {
                    $data[$level][$dimension][$subdimension]['count'] = 0;
                    $data[$level][$dimension][$subdimension]['selected'] = 0;
                }
                foreach ($element as $elementName => $content) {
                    if ($level == $content["level"]) {
                        $data[$level][$dimension][$subdimension]['count']++;
                        if (elementIsSelected($elementName)) {
                            $data[$level][$dimension][$subdimension]['selected']++;
                        }
                    }

                }
            }
        }
    }
    return $data;
}

function startsWith($haystack, $needle) {
    // search backwards starting from haystack length characters from the end
    return $needle === "" || strrpos($haystack, $needle, -strlen($haystack)) !== false;
}
function fwritecsv2($filePointer, $dataArray, $delimiter = ",", $enclosure = "\"")
{
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

function deleteElement(&$data, $elementName)
{
    $count = 0;
    foreach ($data as $element) {
        if ($elementName == $element["element"]) {
            unset($data[$count]);
        }
        $count++;
    }
}

function isElementExisting($dimensions, $givenElementName)
{
    foreach ($dimensions as $dimension => $subdimensions) {
        foreach ($subdimensions as $subdimension => $element) {
            foreach ($element as $elementName => $content) {
                if ($elementName == $givenElementName) {
                    return true;
                }
            }
        }
    }
    return false;
}

if ($_REQUEST['element'] == null) {
    echo json_encode(getSpiderWebData($dimensions));
} else {
    $csvFile = 'selectedData.csv';
    $csv = getCsv();
    $element = $_REQUEST['element'];

    if (elementIsSelected($element)) {
        deleteElement($csv, $element);
    } else {
        if (!isElementExisting($dimensions, $element)) {
            echo "Could not find element";
            exit;
        }
        $newEntry['element'] = $element;
        $csv[] = $newEntry;
    }

    $keys = array_keys($csv[0]);
    $csv = array_merge(array($keys), $csv);
    $fp = fopen($csvFile, 'w');
    fwritecsv2($fp, $csv, ",");
    fclose($fp);
}
