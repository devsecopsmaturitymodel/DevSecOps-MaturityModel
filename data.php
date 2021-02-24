<?php
require_once("functions.php");

$showPerformed = ($_GET['performed'] ?? false) == "true" ? "true" : false;
$showPlanned = ($_GET['planned'] ?? false) == "true" ? "true" : false;

$dimensions = array();
$files = scandir("data");
$dimensions = readYaml("data/dimensions.yaml");

// reorder in-place $dimensions. This should wrap readYaml(data/dimensions.yaml)
ksort($dimensions);
foreach ($dimensions as $dimensionName => $subDimension) {
    ksort($subDimension);
    foreach ($subDimension as $subDimensionName => $elements) {

        // Q: should I retain this?
        if (substr($subDimensionName, 0, 1) == "_")
            continue;

        // Upgrade old configuration to `references:`
        //   this code can be modified to other models.
        foreach ($elements as $activityName => $content) {
            
            if ($content["references"] ?? null) // ignore new lines
                continue;

            $content["references"]["samm2"] = $content["samm2"] ?? array();
            unset($content["samm2"]);
            $content["references"]["iso27001-2017"] = $content["iso27001-2017"] ?? array();
            unset($content["iso27001-2017"]);
            //echo var_dump($elements[$activityName]);
            //echo "<hr>";
            $elements[$activityName] = $content;
            
        }
        $newElements = $elements;
        ksort($newElements);
        $dimensions[$dimensionName][$subDimensionName] = $newElements;
    }
}


$filteredDimensions = array();
foreach ($dimensions as $dimensionName => $subDimension) {
    ksort($subDimension);
    foreach ($subDimension as $subDimensionName => $elements) {
        if (substr($subDimensionName, 0, 1) == "_")
            continue;
        $newElements = $elements;
        ksort($newElements);
        foreach ($newElements as $activityName => $activity) {
            if (elementIsSelected($activityName) && !$showPerformed) {
                continue;
            }

            if (!elementIsSelected($activityName) && !$showPlanned) {
                continue;
            }
            $filteredDimensions[$dimensionName][$subDimensionName][$activityName] = $activity;
        }

    }
}


function getDifficultyOfImplementationWithDependencies($dimensions, $elementImplementation, &$allElements)
{
    if ($elementImplementation == null) {
        return;
    }
    $knowledge = getKnowledge($elementImplementation);

    $allElements[] = $knowledge;
    $allElements[] = $elementImplementation['difficultyOfImplementation']["time"];
    $allElements[] = $elementImplementation['difficultyOfImplementation']["time"];
    $allElements[] = $elementImplementation['difficultyOfImplementation']["resources"];

    if (array_key_exists('dependsOn', $elementImplementation) && $_GET['aggregated'] == "true") {
        foreach ($elementImplementation['dependsOn'] as $dependency) {
            $dependencyElement = getElementByName($dimensions, $dependency);
            getDifficultyOfImplementationWithDependencies($dimensions, $dependencyElement, $allElements);


            $knowledge = getKnowledge($elementImplementation);

            $allElements[] = $knowledge;
            $allElements[] = $elementImplementation['difficultyOfImplementation']["time"];
            $allElements[] = $elementImplementation['difficultyOfImplementation']["time"];
            $allElements[] = $elementImplementation['difficultyOfImplementation']["resources"];
        }
    }
}

function getDifficultyOfImplementation($dimensions, $elementImplementation)
{
    if ($elementImplementation == null) {
        return;
    }
    $knowledge = getKnowledge($elementImplementation);


    $value = $knowledge + $elementImplementation['difficultyOfImplementation']["time"] * 2 + $elementImplementation['difficultyOfImplementation']["resources"];
    $value = $value / 4;

    if (array_key_exists('dependsOn', $elementImplementation) && $_GET['aggregated'] == "true") {
        foreach ($elementImplementation['dependsOn'] as $dependency) {
            $dependencyElement = getElementByName($dimensions, $dependency);
            $value += getDifficultyOfImplementation($dimensions, $dependencyElement);
        }
    }
    if ($value > 5) {
        $value = 5;
    }

    return number_format((float)$value, 2, '.', '');
}

function getKnowledge($elementImplementation)
{
    $knowledge = $elementImplementation['difficultyOfImplementation']["knowledge"];
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

function getElementContentAndCheckExistence($parent, $name)
{
    if (array_key_exists($name, $parent)) {
        return getElementContent($parent[$name]);
    }
    return "";
}

function getElementContent($element)
{
    $Extra = new ParsedownExtra();
    $contentString = "";
    if (is_array($element)) {
        if (isAssoc($element)) {
            foreach ($element as $title => $elementContent) {
                $titleWithSpace = preg_replace('/(?<=[a-z])[A-Z]|[A-Z](?=[a-z])/', ' $0', $title);
                $contentString .= "<b>" . ucfirst($titleWithSpace) . "</b>";
                $contentString .= "<ul>";
                if (is_array($elementContent)) {
                    $contentString .= getElementContent($elementContent);
                } else
                    $contentString .= "<li>" . $Extra->text($elementContent) . "</li>";
                $contentString .= "</ul>";
            }

        } else {
            $contentString .= "<ul>";
            foreach ($element as $content) {
                $contentString .= "<li>" . $Extra->text($content) . "</li>";
            }
            $contentString .= "</ul>";
        }

    } else {
        $contentString = str_replace("\"", "'", $element);
    }
    return $contentString;
}

function isAssoc(array $arr)
{
    if (array() === $arr) return false;
    return array_keys($arr) !== range(0, count($arr) - 1);
}


function render_risk($risk) {

    if (is_array($risk)) {
        return implode("\ ", $risk);
    }
    return $risk;
}
/**
 * Render an activity in a tooltip.
 */
function build_table_tooltip($array, $headerWeight = 2)
{
    $mapKnowLedge = array("Very Low (one discipline)", "Low (one discipline)", "Medium (two disciplines)", "High (two disciplines)", "Very High (three or more disciplines)");
    $mapTime = array("Very Low", "Low", "Medium", "High", "Very High");
    $mapResources = $mapTime;
    $mapUsefulness = $mapTime;

    getElementContentAndCheckExistence($array, "meta");
    $evidenceContent = getElementContentAndCheckExistence($array, "evidence");
    if ($evidenceContent == "") {
        $evidenceContent = "TODO";
    }

    $html = "";
    $html .= "<h" . $headerWeight . ">Risk and Opportunity</h$headerWeight>";
    $html .= "<div><b>" . "Risk" . ":</b> " . render_risk($array['risk']) . "</div>";
    $html .= "<div><b>" . "Opportunity" . ":</b> " . $array['measure'] . "</div>";
    if (IS_SHOW_EVIDENCE_TODO || $evidenceContent != "TODO")
        $html .= "<div><b>" . "Evidence" . ":</b> " . $evidenceContent . "</div>";
    $html .= "<hr />";
    $html .= "<h$headerWeight>Exploit details</h$headerWeight>";
    $html .= "<div><b>Usefullness:</b> " . ucfirst($mapUsefulness[$array['usefulness'] - 1]) . "</div>";
    $html .= "<div><b>Required knowledge:</b> " . ucfirst($mapKnowLedge[$array['difficultyOfImplementation']['knowledge'] - 1]) . "</div>";
    $html .= "<div><b>Required time:</b> " . ucfirst($mapTime[$array['difficultyOfImplementation']['time'] - 1]) . "</div>";
    $html .= "<div><b>Required resources (systems):</b> " . ucfirst($mapResources[$array['difficultyOfImplementation']['resources'] - 1]) . "</div>";
    return $html;
}


function getElementByName($dimensions, $name)
{
    foreach ($dimensions as $dimensionName => $subDimension) {
        foreach ($subDimension as $subDimensionName => $activities) {
            foreach ($activities as $activityName => $content) {
                if ($activityName == $name) {
                    return $content;
                }
            }
        }
    }
}
