<?php
function readYaml($file) {
    $fragment = null;
    if (strpos($file, "#") != false) {
        list($file, $fragment) = explode("#", $file,  2);
        $fragment = trim($fragment, "/ ");
    }
    $ret = yaml_parse(
        file_get_contents($file)
    );
    if ($fragment) {
        foreach (explode("/", $fragment) as $key) {
          $ret = $ret[$key];
        }

    }
    return $ret;
}

function getActions($dimensions) {
    ksort($dimensions);
    foreach ($dimensions as $dimension => $subdimensions) {
        ksort($subdimensions);

        foreach ($subdimensions as $subdimension => $element) {
            if (substr($subdimension, 0, 1) == "_")
                continue;
            yield array($dimension, $subdimension, $element);
        }
    }
}

function getReferenceLabel($reference_id) {
    $referenceLabels = readYaml("data/strings.yml#/strings/en/references");
    return $referenceLabels[$reference_id]["label"] ?? $reference_id;
}

// TODO create testcases

function test_getActions(){
    $dimensions = readYaml("data/dimensions.yaml");
    echo var_dump(getActions($dimensions));
}
function test_readYaml() {
    $ret = readYaml("data/strings.yml");
    echo var_dump($ret);
    echo "<hr>";
    $ret = readYaml("data/strings.yml#/strings/en");
    echo var_dump($ret);
    echo "<hr>";
}
?>