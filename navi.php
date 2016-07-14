<?php

$nav = array(
    "index.php" => "Tabelle",
    "spiderweb.php" => "Identifizierung des Implementierungs-Grades",
    "scutter.php" => "Nutzen und Implementierungs-Diagramm",
    "graph.php" => "Abhängigkeiten",
    "report.php" => "Kompletter Bericht",
    "usefulnessHardness.php" => "Übersicht über die Schwere der Implementierung pro Ebene und Dimension"
);

echo "<ul class=\"nav nav-tabs\">";
foreach ($nav as $item => $value) {
    echo "<li ";
    if(strpos($_SERVER['PHP_SELF'], $item)) {
        echo "class=\"active\"";
    }
    echo "role=\"\"><a href=\"$item\">$value</a></li>";
}
echo "</ul>";
?>
