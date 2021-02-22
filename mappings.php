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
$sort = $_GET["sort"] ?? "activity";


$referenceLabels = readYaml("data/strings.yml#/strings/en/references");

function formCheck($reference_id) {
        if($_GET['sort'] == $reference_id) {
            $checked = "checked";
        }
        $reference_label = $referenceLabels[$reference_id]["label"] ?? $reference_id;
        echo '
        <div class="form-check">
        <input class="form-check-input" type="radio" name="sort" id="exampleRadios2" value="'.$reference_id.'"
         '. $checked. '
        <label class="form-check-label" for="exampleRadios2">'. $reference_label.'</label>
        </div>
        ';
}

?>
<form method="get">
    <div class="form-check">
        <input class="form-check-input" type="radio" name="sort" id="exampleRadios1" value="activity"
         <?php if($_GET['sort'] == "activity") echo "checked"; ?>>
        <label class="form-check-label" for="exampleRadios1"> Activity </label>
    </div>
    <?php
    foreach($referenceLabels as $r) {
        echo formCheck($r);
    }
    ?>

    </div>
    <div class="form-check">
        <input type="checkbox" class="form-check-input" name="performed" id="exampleCheck1" value="true" <?php if($showPerformed) {echo " checked=checked";}?>>
        <label class="form-check-label" for="exampleCheck1">Show performed activities</label>
  </div>
  <div class="form-check">
        <input type="checkbox" class="form-check-input" name="planned" id="exampleCheck2" value="true" <?php if($showPlanned) {echo " checked=checked";} ?>>
        <label class="form-check-label" for="exampleCheck2">Show planned activities</label>
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
            <th scope="col">ISO 27001 Controls</th>
        </tr>
    </thead>
    <tbody>
<?php
    foreach ($filteredDimensions as $dimension => $subdimensions) {
        foreach ($subdimensions as $subdimension => $activity) {
        foreach ($activity as $activityName => $content) {
            echo "<tr>";
            echo "<td>$dimension</td>";
            echo "<td>$subdimension</td>";
            $tooltip = "<div class='popoverdetails'>" . build_table_tooltip ( $content ) . "</div>";
            $activityLink = "detail.php?dimension=" . urlencode ( $dimension ) . "&subdimension=" . urlencode ( $subdimension ) . "&element=" . urlencode ( $activityName );
            echo "<td><a href='$activityLink'><div data-toggle=\"popover\" data-title=\"$activityName\" data-content=\"$tooltip\" type=\"button\" data-html=\"true \">" . $activityName . "</div></a></td>";
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
            <?php echo '<th scope="col">' . $sort . '</th>'; ?>
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
    foreach ($filteredDimensions as $dimension => $subdimensions) {
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
    ksort($mapping, SORT_NUMERIC);

    foreach($mapping as $mappingName => $mappingElement) {
        foreach($mappingElement as $activityName => $activity) {
        echo "<tr>";
        echo "<td>" . $mappingName . "</td>";
        echo "<td>" . $activity['dimension'] . "</td>";
        echo "<td>" . $activity['subdimension'] . "</td>";
        $tooltip = "<div class='popoverdetails'>" . build_table_tooltip ( $activity ) . "</div>";
        $activityLink = "detail.php?dimension=" . urlencode ( $activity['dimension'] ) . "&subdimension=" . urlencode ( $activity['subdimension'] ) . "&element=" . urlencode ( $activityName );
        echo "<td><a href='$activityLink'><div data-toggle=\"popover\" data-title=\"$activityName\" data-content=\"$tooltip\" type=\"button\" data-html=\"true \">" . $activityName . "</div></></td>";
        echo "<td>" . getFlattenedArray($activity, "samm2") . "</td>";    
        echo "<td>" . getFlattenedArray($content, "iso27001-2017") . "</td>";        
        }
    }
}

echo "</table>";
//var_dump($noMappingExists);