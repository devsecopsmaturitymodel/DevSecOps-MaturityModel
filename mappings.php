<?php
include_once "head.php";
?>
    <body>
<?php
include_once "navi.php";
?>
<?php
include_once "data.php";
include_once "detail.php";

$mappingExists = array();
$noMappingExists = array();

if(array_key_exists("sort", $_GET)) {
    $sort = $_GET["sort"];
}else {
    $sort = "activity";
}

?>

<form method="get">
<div class="form-check">
<input class="form-check-input" type="radio" name="sort" id="exampleRadios1" value="activity" checked>
  <label class="form-check-label" for="exampleRadios1">
    Activity
  </label>
</div>
<div class="form-check">
  <input class="form-check-input" type="radio" name="sort" id="exampleRadios2" value="samm2">
  <label class="form-check-label" for="exampleRadios2">
    SAMM 2
  </label>
</div>
<div class="form-check">
  <input class="form-check-input" type="radio" name="sort" id="exampleRadios3" value="iso27001-2017">
  <label class="form-check-label" for="exampleRadios3">
    ISO27001:27001
  </label>
</div>
  <button type="submit" class="btn btn-primary">Submit</button>
</form>

<?php

if($sort == "activity") {
?>
    <table class="table">
    <thead>
        <tr>
            <th scope="col">Dimension</th>
            <th scope="col">Subdimension</th>
            <th scope="col">Actvity</th>
            <th scope="col">SAMM 2</th>
            <th scope="col">ISO 27001</th>
        </tr>
    </thead>
    <tbody>
<?php
    foreach ($dimensions as $dimension => $subdimensions) {
        foreach ($subdimensions as $subdimension => $activity) {
        foreach ($activity as $activityName => $content) {
            echo "<tr>";
            echo "<td>$dimension</td>";
            echo "<td>$subdimension</td>";
            $tooltip = "<div class='popoverdetails'>" . build_table_tooltip ( $content ) . "</div>";
            echo "<td><div data-toggle=\"popover\" data-title=\"$activityName\" data-content=\"$tooltip\" type=\"button\" data-html=\"true \">" . $activityName . "</div></td>";
            echo "<td>" . getFlattenedArray($content, "samm2") . "</td>";
            echo "<td>" . getFlattenedArray($content, "iso27001-2017") . "</td>";
            }
        }
    }
} else {
    ?>
    <table class="table">
    <thead>
        <tr>
            <th scope="col"><?php echo $sort;?></th> 
            <th scope="col">Dimension</th>
            <th scope="col">Subdimension</th>
            <th scope="col">Actvity</th>
            <th scope="col">SAMM 2</th>
            <th scope="col">ISO 27001</th>                  
        </tr>
    </thead>
    <tbody>
<?php    
    $mapping = array();
    foreach ($dimensions as $dimension => $subdimensions) {
        foreach ($subdimensions as $subdimension => $activity) {
            foreach ($activity as $activityName => $content) {
                $content["dimension"] = $dimension;
                $content["subdimension"] = $subdimension;
                if($sort != "samm2") {
                    foreach($content[$sort] as $mappingContent)
                        $mapping[$mappingContent][$activityName] = $content;
                }else {
                    $mappingValue = str_replace("|", "-", $content[$sort]);
                    $mapping[$mappingValue][$activityName] = $content;
                }
                
            }
        }
    }
    //var_dump($mapping);exit;
    ksort($mapping);

    foreach($mapping as $mappingName => $mappingElement) {
        foreach($mappingElement as $activityName => $activity) {
        echo "<tr>";
        echo "<td>" . $mappingName . "</td>";
        echo "<td>" . $activity['dimension'] . "</td>";
        echo "<td>" . $activity['subdimension'] . "</td>";
        $tooltip = "<div class='popoverdetails'>" . build_table_tooltip ( $activity ) . "</div>";
        echo "<td><div data-toggle=\"popover\" data-title=\"$activityName\" data-content=\"$tooltip\" type=\"button\" data-html=\"true \">" . $activityName . "</div></td>";
        echo "<td>" . getFlattenedArray($activity, "samm2") . "</td>";    
        echo "<td>" . getFlattenedArray($content, "iso27001-2017") . "</td>";        
        }
    }
}

echo "</table>";
//var_dump($noMappingExists);