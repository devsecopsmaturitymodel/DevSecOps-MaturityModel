<?php

$nav = array(
    "index.php" => "Tabelle",
    "spiderweb.php" => "Festellung des Implementierungs-Grades",
    "scutter.php" => "Nutzen und Implementierung-Diagramm",
    "graph.php" => "Abhängigkeiten",
    "report.php" => "Kompletter Bericht"
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
