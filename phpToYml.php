<?php

$files = scandir("data");
foreach ($files as $file) {
    if (strlen($file) > 2) {
        include_once "data/$file";
    }
}

ksort($dimensions);
foreach ($dimensions as $dimensionName => $subDimension) {
    ksort($subDimension);
    foreach ($subDimension as $subDimensionName => $elements) {
        $newElements = $elements;
        ksort($newElements);
        $dimensions[$dimensionName][$subDimensionName] = $newElements;
        foreach($newElements as $element) {
            if(array_key_exists("securityProperties", $element)){
                unset($element['securityProperties']);// might work
            }
        }
    }
    $yml = yaml_emit($dimensions[$dimensionName]);
    file_put_contents("data/" .str_replace(" ","", $dimensionName).".yml", $yml);
}
