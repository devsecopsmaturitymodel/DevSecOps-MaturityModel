<?php
include_once "head.php";
?>
    <body>
<?php
include_once "navi.php";
?>
<?php
include_once "data.php";
include_once "detail.php";


foreach ($dimensions as $dimension => $subdimensions) {
    echo "<h1>Dimension $dimension</h1>";
    foreach ($subdimensions as $subdimension => $element) {
        echo "<h2>Sub-Dimension $subdimension</h2>";

        echo "<h3 style='color:green;'>With SAMM2 Mapping</h3>";
        for ($i = 1; $i <= 4; $i++) {
            $tableContent .= "<td><ul>";
            foreach ($element as $elementName => $content) {
                if(array_key_exists("samm2", $content)) {
                    $content = getContentForLevelFromSubdimensions($i, $content, $elementName);

                    if ($content != "") {
                        printDetail($dimension, $subdimension, $elementName, $dimensions, true);
                    }
                }
            }
        }

        echo "<h3 style='color:red;'>Without SAMM2 Mapping</h3>";
        for ($i = 1; $i <= 4; $i++) {
            $tableContent .= "<td><ul>";
            foreach ($element as $elementName => $content) {
                if(!array_key_exists("samm2", $content)) {
                    $content = getContentForLevelFromSubdimensions($i, $content, $elementName);

                    if ($content != "") {
                        printDetail($dimension, $subdimension, $elementName, $dimensions, true);
                    }
                }
            }
        }
    }
}