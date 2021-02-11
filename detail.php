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
$activityName = $_GET['element'];

function printDetail($dimension, $subdimension, $activityName, $dimensions, $report = false)
{
    $element = $dimensions[$dimension][$subdimension][$activityName];

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
    echo "<hr/>";

    if (array_key_exists("dependsOn", $element) || array_key_exists("implementation", $element) || array_key_exists("comment", $element) || array_key_exists("meta", $element)) {
        echo "<h" . ($headerWeight + 1) . ">Additional Information</h" . ($headerWeight + 1) . ">";
        if (array_key_exists("dependsOn", $element)) {
            $dependsOn = $element['dependsOn'];
            $dependencies =  implode(", ", $dependsOn);
            echo "<div><b>Dependencies:</b> $dependencies</div>";
        }
        echo getElementContentAndCheckExistence($element, "meta");
    }


    if (array_key_exists("md-description", $element) && !empty($element['md-description'])) {
        echo "<div style=\"background: #F5F5F5\"";
        $parsedown = new Parsedown();
        echo $parsedown->text($element['md-description']);
        echo "</div>";
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
    if (array_key_exists("iso27001-2017", $element) && !empty($element['iso27001-2017'])) {
        echo "<div><b>ISO27001:2017 Controls Mapping:</b></div>";

        echo "<ul>";
        foreach ($element['iso27001-2017'] as $isocontrol) {
            echo "<li>$isocontrol</li>";
        }
        echo "</ul>";
    }
}

printDetail($dimension, $subdimension, $activityName, $dimensions);