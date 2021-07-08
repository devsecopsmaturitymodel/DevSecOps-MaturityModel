<?php

require_once "functions.php";

if(ENFORCE_DATA_GENERATION_DURING_RUNTIME) {
    $files = glob("data/dimensions-subdimensions-activties/*/*.yaml");
    $dimensions=array();
    foreach ($files as $filename) {
        //echo "Found $filename";
        if(preg_match("/_meta.yaml/", $filename)) continue;
        $dimension = getDimensions($filename);
        if(array_key_exists("_yaml_references", $dimension)) {
            unset($dimension['_yaml_references']);
        }
        $dimensions = array_merge_recursive($dimensions, $dimension);
    }

    $files = glob("data/custom/*/*.yaml");
    $dimensionsCustom=array();
    foreach ($files as $filename) {
        //echo "Found $filename";
        $dimensionCustom = getDimensions($filename);
        $dimensionsCustom = array_merge_recursive($dimensionsCustom, $dimensionCustom);
    }
    if(sizeof($files) > 0) {
        $dimensions = array_merge_recursive_ex($dimensions, $dimensionsCustom);
        $dimensionsAggregated = array();
        foreach (getActions($dimensions) as list($dimension, $subdimension, $activities)) {
            foreach ($activities as $activityName => $activity) {
                if(isActivityExisting($dimensionsCustom, $activityName)) {
                    if(!array_key_exists($dimension, $dimensionsAggregated)) $dimensionsAggregated[$dimension] = array();
                    if(!array_key_exists($subdimension, $dimensionsAggregated[$dimension])) $dimensionsAggregated[$dimension][$subdimension] = array();
                    $dimensionsAggregated[$dimension][$subdimension][$activityName] = $activity;
                }
            }
        }
    } else {
        $dimensionsAggregated=$dimensions;
    }

    foreach ($dimensions as $dimension => $subdimensions) {
        ksort($subdimensions);

        foreach ($subdimensions as $subdimension => $elements) {
            if (substr($subdimension, 0, 1) == "_")
                continue;
            foreach($elements as $activityName => $activity)
            if (!array_key_exists("level", $activity)) {
                echo "'$activityName' is not complete!";
                echo "<pre>";
                var_dump($activity);
                echo "</pre>";
                exit;
            }
        }
    }



    $dimensionsString = yaml_emit($dimensionsAggregated);
    file_put_contents("data/generated/dimensions.yaml", $dimensionsString);
}
function isActivityExisting($dimensions, $activityName) {
    foreach (getActions($dimensions) as list($dimension, $subdimension, $activities)) {
        foreach($activities as $activity => $activityContent) {
            if($activity == $activityName) {
                return true;
            }
        }
    }
    return false;
}

function array_merge_recursive_ex(array $array1, array $array2)
{
    $merged = $array1;

    foreach ($array2 as $key => & $value) {
        if (is_array($value) && isset($merged[$key]) && is_array($merged[$key])) {
            $merged[$key] = array_merge_recursive_ex($merged[$key], $value);
        } else if (is_numeric($key)) {
            if (!in_array($value, $merged)) {
                $merged[] = $value;
            }
        } else {
            $merged[$key] = $value;
        }
    }

    return $merged;
}
