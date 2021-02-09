<?php
$dimensions = array();


function readYaml($file)
{
    return yaml_parse(
        file_get_contents($file)
    );
}

$dimensions = array(
    "Culture and Organization" => readYaml("data/CultureandOrg.yml"),
    "Build and Deployment" => readYaml("data/BuildandDeployment.yml"),
    "Information Gathering" => readYaml("data/Informationgathering.yml"),
    "Implementation" => readYaml("data/Implementation.yml"),
    "Test and Verification" => readYaml("data/TestandVerification.yml")
);

foreach ($dimensions as $dimensionName => $subDimension) {
    foreach ($subDimension as $subDimensionName => $elements) {

        $newElements = $elements;
        ksort($newElements);
        $dimensions[$dimensionName][$subDimensionName] = $newElements;
        foreach($elements as $elementName => $element) {
            $dimensionIdWithSpace = mb_convert_case($dimensionName, MB_CASE_TITLE);
            $dimensionId = str_replace(" ", "", $dimensionIdWithSpace);
            $subDimensionId = str_replace(" ", "",mb_convert_case($subDimensionName, MB_CASE_TITLE));
            $folder = "data-new/$dimensionId/$subDimensionId/" . $element['level'] . "/";
            //echo $folder;
            mkdir($folder, 755, true);
            unset($element['level']); // level from folder
            $idWithSpace=mb_convert_case($elementName, MB_CASE_TITLE);
            $idSanitized =  str_replace("/", "Or", $idWithSpace);
            $id =  str_replace(" ", "", $idSanitized);
            $filePath = $folder . $id . ".yaml";
            $element['id'] = $id;
            $yamlContent = yaml_emit ( $element );

            file_put_contents($filePath, $yamlContent);

        }

    }
}

