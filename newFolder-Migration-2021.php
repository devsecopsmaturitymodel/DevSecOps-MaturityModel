<?php
/**
 * newFolder-Migration-2021.php
 *
 * @package default
 */


include "functions.php";

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

    foreach ($elements as $elementName => $element) {
      //unset($element['level']); // level from folder
      $idWithSpace=mb_convert_case($elementName, MB_CASE_TITLE);
      $idSanitized =  str_replace("/", "Or", $idWithSpace);

      $id =  str_replace(" ", "", $idSanitized);
      $element = array('id' => $id) + array('title' => $elementName) +  $element; // Add properties to the top
      $element['id'] = $id;
    }
    $dimensionIdWithSpace = mb_convert_case($dimensionName, MB_CASE_TITLE);
    $dimensionId = str_replace(" ", "", $dimensionIdWithSpace);
    $subDimensionId = str_replace(" ", "", mb_convert_case($subDimensionName, MB_CASE_TITLE));
    $folder = "data-new/$dimensionId/";
    //echo $folder;
    mkdir($folder, 755, true);

    $filePath = $folder . $subDimensionId . ".yaml";
    echo $filePath;
    $yamlContent = yaml_emit(array($subDimensionName => $elements));

    file_put_contents($filePath, $yamlContent);
  }
}
