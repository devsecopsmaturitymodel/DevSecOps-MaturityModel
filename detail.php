<?php

$title = "Details für '" . htmlspecialchars($_GET['element'])."'";
include_once "head.php";
?>
    <body>
<?php
include_once "data.php";
include_once "navi.php";

$dimension = $_GET['dimension'];
$subdimension = $_GET['subdimension'];
$elementName = $_GET['element'];
$element = $dimensions[$dimension][$subdimension][$elementName];


if ($element == null) { //Whitelist approach for security reasons (deny XSS)
    echo "Sorry, we could not found the element";
    exit;
}

$pageH1 = $dimension;
if($dimension != $subdimension) {
    $pageH1 .= " -> $subdimension";
}
$pageH1 .= ": $elementName";

echo "<h1>$pageH1</h1>";
echo build_table_tooltip($element);

echo "<hr/>";
echo "<h2>Gewährleistete Sicherheitseigenschaften</h2>";
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

echo "<h2>Sonstiges</h2>";
if (array_key_exists("dependsOn", $element)) {
    $dependsOn = $element['dependsOn'];
    $dependencies = "";
    $first = true;
    foreach($dependsOn as $element) {
        if(!$first) {
            $dependencies = ", ";
        }
        $dependencies .=  $element;
        $first = false;
    }

    echo "<div><b>Abhänigkeiten:</b> $dependencies</div>";
}
if (array_key_exists("implementation", $element)) {
    $implementation = $element['implementation'];
    echo "<div><b>Implementierung:</b> $implementation</div>";
}

if (array_key_exists("comment", $element)) {
    $comment = $element['comment'];
    echo "<div><b>Kommentar:</b> $comment</div>";
}