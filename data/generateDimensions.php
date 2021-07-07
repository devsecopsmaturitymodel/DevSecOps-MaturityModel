<?php

require_once "functions.php";

if(ENFORCE_DATA_GENERATION_DURING_RUNTIME) {
    $files = glob("data/dimensions-subdimensions-activties/*/*.yaml");
    $dimensions=array();
    foreach ($files as $filename) {
        if(preg_match("/_meta.yaml/", $filename)) continue;
        $dimension = getDimensions($filename);
        if(array_key_exists("_yaml_references", $dimension)) {
            unset($dimension['_yaml_references']);
        }
        $dimensions = array_merge_recursive($dimensions, $dimension);
    }

    $files = glob("data/custom/*/*.yaml");
    $dimensionsCustom=array();
    foreach ($files as $file) {
        $dimensionCustom = getDimensions($file);
        $dimensionsCustom = array_merge_recursive($dimensionsCustom, $dimensionCustom);
    }
    if(sizeof($files) > 0) {
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
