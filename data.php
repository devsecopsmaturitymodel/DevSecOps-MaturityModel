<?php
$dimensions = array();

$files = scandir("data");
foreach ($files as $file) {
    if(strlen($file) > 2)
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

function gethardnessOfImplementationWithDependencies($dimensions, $elementImplementation, &$allElements)
{
    if($elementImplementation == null) {
        return ;
    }
    $knowledge = getKnowledge($elementImplementation);

    $allElements[] = $knowledge;
    $allElements[] = $elementImplementation['hardnessOfImplementation']["time"];
    $allElements[] = $elementImplementation['hardnessOfImplementation']["time"];
    $allElements[] = $elementImplementation['hardnessOfImplementation']["resources"];

    if (array_key_exists('dependsOn', $elementImplementation) && $_GET['aggregated'] == "true") {
        foreach ($elementImplementation['dependsOn'] as $dependency) {
            $dependencyElement = getElementByName($dimensions, $dependency);
            gethardnessOfImplementationWithDependencies($dimensions, $dependencyElement, $allElements);


            $knowledge = getKnowledge($elementImplementation);

            $allElements[] = $knowledge;
            $allElements[] = $elementImplementation['hardnessOfImplementation']["time"];
            $allElements[] = $elementImplementation['hardnessOfImplementation']["time"];
            $allElements[] = $elementImplementation['hardnessOfImplementation']["resources"];
        }
    }
}

function gethardnessOfImplementation($dimensions, $elementImplementation)
{
    if($elementImplementation == null) {
        return ;
    }
    $knowledge = getKnowledge($elementImplementation);


    $value = $knowledge + $elementImplementation['hardnessOfImplementation']["time"] * 2 + $elementImplementation['hardnessOfImplementation']["resources"];
    $value = $value / 4;

    if (array_key_exists('dependsOn', $elementImplementation) && $_GET['aggregated'] == "true") {
        foreach ($elementImplementation['dependsOn'] as $dependency) {
            $dependencyElement = getElementByName($dimensions, $dependency);
            $value += gethardnessOfImplementation($dimensions, $dependencyElement);
        }
    }
    if ($value > 5) {
        $value = 5;
    }

    return number_format((float)$value, 2, '.', '');
}

function getKnowledge($elementImplementation)
{
    $knowledge = $elementImplementation['hardnessOfImplementation']["knowledge"];
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


function build_table_tooltip($array, $headerWeight = 2)
{
    $mapKnowLedge = array("Sehr wenig (eine Disziplin)", "Wenig (eine Disziplin)", "Mittel (zwei Disziplinen)", "Viel (zwei Disziplinen)", "Sehr viel (drei oder mehr Disziplinen)");
    $mapTime = array("Sehr wenig (1-2 Tage)", "Wenig (eine Woche)", "Mittel (zwei Wochen)", "Viel (drei Wochen)", "Sehr viel (drei oder mehr Wochen)");
    $mapResources = array("Sehr wenig", "Wenig", "Mittel", "Viel", "Sehr viele");
    $mapUsefulness = array("Sehr wenig", "Wenig", "Mittel", "Hoch", "Sehr hoch");

    $html = "";
    $html .= "<h" . $headerWeight . ">Risiken und Maßnahmen</h$headerWeight>";
    $html .= "<div><b>Risiko:</b> " . $array['risk'] . "</div>";
    $html .= "<div><b>Gegenmaßnahme:</b> " . $array['measure'] . "</div>";
    $html .= "<hr />";
    $html .= "<h$headerWeight>Nutzen und Schwere der Implementierung</h$headerWeight>";
    $html .= "<div><b>Nutzen:</b> " . ucfirst($mapUsefulness[$array['usefulness']-1]) . "</div>";
    $html .= "<div><b>Benötigtes Wissen:</b> " . ucfirst($mapKnowLedge[$array['hardnessOfImplementation']['knowledge']-1]) . "</div>";
    $html .= "<div><b>Benötigte Zeit:</b> " . ucfirst($mapTime[$array['hardnessOfImplementation']['time']-1]) . "</div>";
    $html .= "<div><b>Benötigte Ressourcen (Systeme):</b> " . ucfirst($mapResources[$array['hardnessOfImplementation']['resources']-1]) . "</div>";
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