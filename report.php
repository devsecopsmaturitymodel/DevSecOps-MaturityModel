<?php
/**
 * report.php
 *
 * @package default
 */


include_once "head.php";
?>
    <body>
<?php
include_once "navi.php";

if (array_key_exists("performed", $_GET)) {
  $showPerformed = $_GET['performed'];

  if ($showPerformed != "true") $showPerformed = false;
}else {
  $showPerformed = false;
}

if (array_key_exists("planned", $_GET)) {
  $showPlanned = $_GET['planned'];

  if ($showPlanned != "true") $showPlanned = false;
}else {
  $showPlanned = false;
}

?>

<form method="get">
    <div class="form-check">
        <input type="checkbox" class="form-check-input" name="performed" id="exampleCheck1" value="true" <?php if ($showPerformed) {echo " checked=checked";}?>>
        <label class="form-check-label" for="exampleCheck1">Show performed activities</label>
  </div>
  <div class="form-check">
        <input type="checkbox" class="form-check-input" name="planned" id="exampleCheck2" value="true" <?php if ($showPlanned) {echo " checked=checked";} ?>>
        <label class="form-check-label" for="exampleCheck2">Show planned activities</label>
  </div>
  <button type="submit" class="btn btn-primary">Submit</button>
</form>

<?php
include_once "data.php";
include_once "detail.php";



foreach ($dimensions as $dimension => $subdimensions) {
  echo "<h1>Dimension $dimension</h1>";
  foreach ($subdimensions as $subdimension => $activity) {
    echo "<h2>Sub-Dimension $subdimension</h2>";

    for ($i = 1; $i <= 4; $i++) {
      foreach ($activity as $activityName => $content) {
        if (elementIsSelected($activityName, $activity) && !$showPerformed) {
          continue;
        }

        if (!elementIsSelected($activityName, $activity) && !$showPlanned) {
          continue;
        }
        $content = getContentForLevelFromSubdimensions($i, $content, $activityName);

        if ($content != "") {
          printDetail($dimension, $subdimension, $activityName, $dimensions, true);
        }
      }
    }

  }
}
