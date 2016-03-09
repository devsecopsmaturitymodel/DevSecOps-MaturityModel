<?php
$dimensions = array();

$files = scandir("data");
foreach ($files as $file) {
    include_once "data/$file";
}
ksort($dimensions);
foreach ($dimensions as $dimensionName => $subDimension) {
    ksort($subDimension);
    foreach ($subDimension as $subDimensionName => $elements) {
        $newElements = $elements;
        ksort($newElements);
        $dimensions[$dimensionName][$subDimensionName] = $newElements;
    }
}

function getEaseOfImplementation($dimensions, $elementImplementation)
{
    $knowledge = $elementImplementation['easeOfImplementation']["knowledge"];
    $knowledge = getKnowledge($dimensions, $elementImplementation);


    $value = $knowledge + $elementImplementation['easeOfImplementation']["time"] * 2 + $elementImplementation['easeOfImplementation']["resources"];
    $value = $value / 4;

    if (array_key_exists('dependsOn', $elementImplementation) && $_GET['aggregated'] == "true") {
        foreach ($elementImplementation['dependsOn'] as $dependency) {
            $dependencyElement = getElementByName($dimensions, $dependency);
            $value += getEaseOfImplementation($dimensions, $dependencyElement);
        }
    }
    if($value > 5) {
        $value = 5;
    }

    return number_format((float)$value, 2, '.', '');
}

function getKnowledge($dimensions, $elementImplementation){
    $knowledge = $elementImplementation['easeOfImplementation']["knowledge"];
    if (is_array($knowledge)) {
        $sum = 0;
        // areas = operation, development, expertise, security
        $areaCount = 4;
        foreach ($knowledge as $knowledgeAttribute) {
            $sum += $knowledgeAttribute;
        }
        $knowledge = $sum / $areaCount;
    }

    return $knowledge;
}



function build_table_tooltip($array)
{
    $mapKnowLedge = array("Sehr wenig (eine Disziplin)", "wenig (eine Disziplin)", "mittel (zwei Disziplinen)", "viel (zwei Disziplinen)", "sehr viel (drei oder mehr Disziplinen)");
    $mapTime = array("Sehr wenig (1-2 Tage)", "wenig (eine Woche)", "mittel (zwei Wochen)", "viel (drei Wochen)", "sehr viel (drei oder mehr Wochen)");
    $mapResources = array("Sehr wenig", "wenig", "mittel", "viel", "sehr viel");

    $html = "";
    $html .= "<h2>Risiken und Maßnahmen</h2>";
    $html .= "<div><b>Risiko:</b> " . $array['risk'] . "</div>";
    $html .= "<div><b>Maßnahme:</b> " . $array['measure'] . "</div>";
    $html .= "<hr />";
    $html .= "<h2>Schwere der Implementierung</h2>";
    $html .= "<div><b>Benötigtes Wissen:</b> " . $mapKnowLedge[$array['easeOfImplementation']['knowledge']] . "</div>";
    $html .= "<div><b>Benötigte Zeit:</b> " . $mapTime[$array['easeOfImplementation']['knowledge']] . "</div>";
    $html .= "<div><b>Benötigte Resourcen (Systeme):</b> " . $mapResources[$array['easeOfImplementation']['knowledge']] . "</div>";
    return $html;
}

function getElementByName($dimensions, $name)
{
    foreach ($dimensions as $dimensionName => $subDimension) {
        foreach ($subDimension as $subDimensionName => $elements) {
            foreach ($elements as $elementName => $element) {
                if ($elementName == $name) {
                    return $element;
                }
            }
        }
    }
}