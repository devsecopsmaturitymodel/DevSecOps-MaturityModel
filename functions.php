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

/** This function should be a sort of db wrapper. */
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

function getReferenceLabels(){
    return readYaml("data/strings.yml#/strings/en/references");
}
function getReferenceLabel($reference_id) {
    $referenceLabels = readYaml("data/strings.yml#/strings/en/references");

    return $referenceLabels[$reference_id]["label"] ?? $reference_id;
}

function thead($headings){
    echo '<thead><tr><th scope="col">'
        .implode('</th><th scope="col">', $headings)
        .'</th></tr></thead>';
}


function renderSamm($samm_reference){
    return "$samm_reference";
}
function as_list($items){
    if(is_array($items)){
        yield from $items;
    } else {
        yield $items;
    }
}
function renderSamms($samm_references) {
    if( ! is_array($samm_references) ){
        return renderSamm($samm_references);
    }

        $ret = "<ul><li>"
            . implode("</li><li>", array_map('renderSamm', $samm_references)) 
            ."</li></ul>";
    return $ret;
}
function getReferences($references) {
    foreach ($references as $r_name => $rlist) {

    }

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