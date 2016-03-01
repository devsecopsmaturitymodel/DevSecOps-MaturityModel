<?php
$dimensions = array();

$files = scandir("data");
foreach ($files as $file) {
    include_once "data/$file";
}
ksort($dimensions);
foreach ($dimensions as $dimensionName => $subDimension) {
    ksort($subDimension);
   foreach($subDimension as $subDimensionName => $elements) {
       $newElements = $elements;
       ksort($newElements);
       $dimensions[$dimensionName][$subDimensionName] = $newElements;
   }
}

function getEaseOfImplementation($elementImplementation)
{
    $knowledge = $elementImplementation["knowledge"];
    if(is_array($elementImplementation["knowledge"])) {
        $sum = 0;
        // areas = operation, development, expertise, security
        $areaCount = 4;
        foreach($knowledge = $elementImplementation["knowledge"] as $knowledgeElement)  {
            $sum += $knowledgeElement;
        }
        $knowledge = $sum / $areaCount;
    }

    $value =  $knowledge + $elementImplementation["time"] * 2 + $elementImplementation["resources"];
    $value = $value / 4;
    return number_format((float)$value, 2, '.', '');
}