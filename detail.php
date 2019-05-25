<?php

$title = "Details for '" . htmlspecialchars($_GET['element']) . "'";
include_once "head.php";
?>
    <body>
<?php
include_once "data.php";
include_once "navi.php";

$dimension = $_GET['dimension'];
$subdimension = $_GET['subdimension'];
$elementName = $_GET['element'];

function printDetail($dimension, $subdimension, $elementName, $dimensions, $report = false)
{
    $element = $dimensions[$dimension][$subdimension][$elementName];

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
        $pageH1 .= ": $elementName";
    } else {
        $pageH1 .= "$elementName";
    }

    echo "<h$headerWeight>$pageH1</h$headerWeight>";
    echo build_table_tooltip($element, $headerWeight + 1);
    echo "<hr/>";

    if (array_key_exists("dependsOn", $element) || array_key_exists("implementation", $element) || array_key_exists("comment", $element)) {
        echo "<h" . ($headerWeight + 1) . ">Additional Information</h" . ($headerWeight + 1) . ">";
        if (array_key_exists("dependsOn", $element)) {
            $dependsOn = $element['dependsOn'];
            $dependencies = "";
            $first = true;
            foreach ($dependsOn as $dimensionElement) {
                if (!$first) {
                    $dependencies .= ", ";
                }
                $dependencies .= $dimensionElement;
                $first = false;
            }

            echo "<div><b>Dependencies:</b> $dependencies</div>";
        }
    }

    
    
    if (array_key_exists("implementation", $element) && !empty($element['implementation'])) {
        $implementation = $element['implementation'];
        echo "<div><b>Implementation hints:</b> ";
        if(is_array($implementation)){
            echo "<ul>";
            foreach($implementation as $implementationElement) {
                echo "<li>$implementationElement</li>";
            }
            echo "</ul>";
        }else {
            echo $implementation;
        }
        echo "</div>";
    }

    if (array_key_exists("comment", $element) && !empty($element['comment'])) {
        $comment = $element['comment'];
        echo "<div><b>Comments:</b> $comment</div>";
    }
    if (array_key_exists("samm", $element) && !empty($element['samm'])) {
    	$samm = $element['samm'];
    	echo "<div><b>OWASP SAMM 1 Mapping:</b> $samm</div>";
    }
    if (array_key_exists("samm2", $element) && !empty($element['samm2'])) {
    	$samm = $element['samm2'];
    	echo "<div><b>OWASP SAMM 2 Mapping:</b> $samm</div>";
    }    
}

printDetail($dimension, $subdimension, $elementName, $dimensions);