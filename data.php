<?php
$dimensions = array();

$files = scandir("data");

function readYaml($file) {
    return yaml_parse(
        file_get_contents($file)
    );
}

$dimensions = array(
    "Culture and Org." => readYaml("data/CultureandOrg.yml"),
    "Build and Deployment" => readYaml("data/BuildandDeployment.yml"),
    "Information Gathering" => readYaml("data/Informationgathering.yml"),
    "Infrastructure" => readYaml("data/Infrastructure.yml"),
    "Test and Verification" => readYaml("data/TestandVerification.yml"),
);

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
    $mapKnowLedge = array("Very little (one discipline)", "little (one discipline)", "Medium (two disciplines)", "Much (two disciplines)", "Very much (three or more disciplines)");
    $mapTime = array("Very little", "Little", "Medium", "Much", "Very much");
    $mapResources = $mapTime;
    $mapUsefulness = $mapTime;

    $html = "";
    $html .= "<h" . $headerWeight . ">Risk and Opportunity</h$headerWeight>";
    $html .= "<div><b>" . gettext("Risk") . ":</b> " . $array['risk'] . "</div>";
    $html .= "<div><b>" . gettext("Opportunity") . ":</b> " . $array['measure'] . "</div>";
    $html .= "<hr />";
    $html .= "<h$headerWeight>Exploit details</h$headerWeight>";
    $html .= "<div><b>Usefullness:</b> " . ucfirst($mapUsefulness[$array['usefulness']-1]) . "</div>";
    $html .= "<div><b>Required knowledge:</b> " . ucfirst($mapKnowLedge[$array['hardnessOfImplementation']['knowledge']-1]) . "</div>";
    $html .= "<div><b>Required time:</b> " . ucfirst($mapTime[$array['hardnessOfImplementation']['time']-1]) . "</div>";
    $html .= "<div><b>Required resources (systems):</b> " . ucfirst($mapResources[$array['hardnessOfImplementation']['resources']-1]) . "</div>";
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
