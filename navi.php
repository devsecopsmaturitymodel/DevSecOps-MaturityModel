<a href="https://github.com/wurstbrot/generic-DevOps-Security-MaturityModel"><img style="position: absolute; top: 0; right: 0; border: 0;" src="https://s3.amazonaws.com/github/ribbons/forkme_right_darkblue_121621.png" alt="Fork me on GitHub"></a>
<?php

$nav = array(
    "index.php" => "Matrix",
    "spiderweb.php" => "Implementation Levels",
    "scutter.php" => "Ease and Value of Implementation",
    "graph.php" => "Dependencies",
    "report.php" => "Full Report",
    //"usefulnessHardness.php" => "Heatmap",
    "md.php?file=README" => "About this project",
);

echo "<ul class=\"nav nav-tabs\">";
foreach ($nav as $item => $value) {
    echo "<li ";
    //$item = preg_replace("/\?.*/", "", $item);
    
    if(strpos($_SERVER['REQUEST_URI'], $item)) {
        echo "class=\"active\"";
    }
    echo "role=\"\"><a href=\"$item\">$value</a></li>";
}
echo "</ul>";
?>
