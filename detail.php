<?php

$title = "Details für '" . htmlspecialchars($_GET['element']) . "'";
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
    echo build_table_tooltip($element, $headerWeight+1);
    echo "<hr/>";
    echo "<h" . ($headerWeight + 1). ">Gewährleistete Sicherheitseigenschaften</h" . ($headerWeight + 1). ">";
    foreach ($element["securityProperties"] as $securityPropertyName => $securityPropertyDescription) {
        if ($securityPropertyName == "availability") {
            $securityPropertyName = "Verfügbarkeit";
        } else if ($securityPropertyName == "integrity") {
            $securityPropertyName = "Integrität";
        } else if ($securityPropertyName == "confidentiality") {
            $securityPropertyName = "Vertraulichkeit";
        } else if ($securityPropertyName == "authorization") {
            $securityPropertyName = "Autorisierung";
        } else if ($securityPropertyName == "authentication") {
            $securityPropertyName = "Authentifizierung";
        } else if ($securityPropertyName == "non-repudiation") {
            $securityPropertyName = "Nicht Abstreitbarkeit";
        }

        echo "<div><b>" . ucfirst($securityPropertyName) . ":</b> $securityPropertyDescription</div>";
    }
    echo "<h" . ($headerWeight + 1). ">Sonstiges</h" . ($headerWeight + 1). ">";
    if (array_key_exists("dependsOn", $element)) {
        $dependsOn = $element['dependsOn'];
        $dependencies = "";
        $first = true;
        foreach ($dependsOn as $delement) {
            if (!$first) {
                $dependencies = ", ";
            }
            $dependencies .= $delement;
            $first = false;
        }

        echo "<div><b>Abhängigkeiten:</b> $dependencies</div>";
    }

    if (array_key_exists("implementation", $element)) {
        $implementation = $element['implementation'];
        echo "<div><b>Implementierung:</b> $implementation</div>";
    }

    if (array_key_exists("comment", $element)) {
        $comment = $element['comment'];
        echo "<div><b>Kommentar:</b> $comment</div>";
    }
}

printDetail($dimension, $subdimension, $elementName, $dimensions);