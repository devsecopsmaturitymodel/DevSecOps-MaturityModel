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
include_once "functions.php";

$mappingExists = array();
$noMappingExists = array();
$sort = $_GET["sort"] ?? "activity";
$headings = array("Dimension", "Subdimension", "Activity");
$referenceLabels = getReferenceLabels();



function formCheck($reference_id, $sort) {
        $checked = ($sort == $reference_id) ? "checked": "";
        $reference_label = getReferenceLabel($reference_id);
        return '
        <div class="form-check">
        <input class="form-check-input" type="radio" name="sort"
            id="radio'.$reference_id.'" 
            value="'.$reference_id.'"
                '. $checked. '
        <label class="form-check-label" for="exampleRadios2">'. ucwords($reference_label).'</label>
        </div>
        ';
}
function thead($headings){
    echo '<thead><tr><th scope="col">'
        .implode('</th><th scope="col">', $headings)
        .'</th></tr></thead>';
}


?>
<form method="get">
    <?php

    // Print form headers
    echo formCheck("activity", $sort);
    foreach ($referenceLabels as $r => $metadata) {
        echo formCheck($r, $sort);
    }
    ?>

    </div>
    <div class="form-check">
        <input type="checkbox" class="form-check-input" name="performed" id="exampleCheck1" value="true"
         <?php if($showPerformed) {echo " checked=checked";}?>>
        <label class="form-check-label" for="exampleCheck1">Show performed activities</label>
  </div>
  <div class="form-check">
        <input type="checkbox" class="form-check-input" name="planned" id="exampleCheck2" value="true"
         <?php if($showPlanned) {echo " checked=checked";} ?>>
        <label class="form-check-label" for="exampleCheck2">Show planned activities</label>
  </div>  
  <button type="submit" class="btn btn-primary">Submit</button>
</form>

<?php

if($sort == "activity") {

    echo '<table class="table">';
    $headings = array_merge($headings, array_keys(getReferenceLabels()));
    thead($headings);

    echo '<tbody>';
    
    foreach ($filteredDimensions as $dimension => $subdimensions) {
        foreach ($subdimensions as $subdimension => $activity) {
            foreach ($activity as $activityName => $content) {
                echo "<tr>";
                echo "<td>$dimension</td>";
                echo "<td>$subdimension</td>";
                $tooltip = "<div class='popoverdetails'>" . build_table_tooltip ( $content ) . "</div>";
                $activityLink = "detail.php?dimension=" . urlencode ( $dimension ) . "&subdimension=" . urlencode ( $subdimension ) . "&element=" . urlencode ( $activityName );
                echo "<td><a href='$activityLink'><div data-toggle=\"popover\" data-title=\"$activityName\" data-content=\"$tooltip\" type=\"button\" data-html=\"true \">" . $activityName . "</div></a></td>";

                // uniform old content.                
                if (!($content["references"] ?? NULL)){
                    $content["references"]["samm2"] = $content["samm2"] ?? array();
                    $content["references"]["iso27001-2017"] = $content["iso27001-2017"] ?? array();
                }

                foreach($referenceLabels as $r => $rLabel){
                    $rlist = $content["references"][$r] ?? array();
                    echo "<td>". renderSamms($rlist) ."</td>";
                }
            }
        }
    }
} else {
    echo '<table class="table">';
    $headings = array_merge(array("$sort"), $headings, array_keys(getReferenceLabels()));
    thead($headings);

    echo '<tbody>';
    $mapping = array();


    // populate mapping:
    // mapping = value, activity, content
    foreach ($filteredDimensions as $dimension => $subdimensions) {
        foreach ($subdimensions as $subdimension => $activity) {
            foreach ($activity as $activityName => $content) {
                $content["dimension"] = $dimension;
                $content["subdimension"] = $subdimension;

                if (! ($content["references"] ?? null)) {
                    // default.
                    if (!($content[$sort] ?? null)){
                        error_log("No $sort mapping for $activityName");
                        continue;
                    }

                    foreach(as_list($content[$sort]) as $mappingContent) {
                        $mapping[$mappingContent][$activityName] = $content;
                    }
                    continue;
                }

                foreach($content["references"] as $mappingContent => $rlist) {
                    echo var_dump("$mappingContent");
                    $mapping[$mappingContent][$activityName] = $content;
                }
            }
        }
    }

    // render
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
            
                            // uniform old content.                
            if (!($activity["references"] ?? NULL)){
                $activity["references"]["samm2"] = $activity["samm2"] ?? array();
                $activity["references"]["iso27001-2017"] = $activity["iso27001-2017"] ?? array();
            }

            foreach($referenceLabels as $r => $rLabel){
                $rlist = $activity["references"][$r] ?? array();
                echo "<td>". renderSamms($rlist) ."</td>";
            }
        }
    }
}

echo "</table>";
//var_dump($noMappingExists);