<?php
/**
 * head.php
 *
 * @package default
 * @see detail.php
 * @see graph.php
 * @see index.php
 * @see mappings.php
 * @see md.php
 * @see report-samm.php
 * @see report.php
 * @see scutter.php
 * @see spiderweb.php
 * @see usefulnessHardness.php
 */


?>
<!DOCTYPE html >
<html moznomarginboxes mozdisallowselectionprint>
<head>
<script src="//code.jquery.com/jquery-1.12.0.min.js"></script>

<!-- Latest compiled and minified CSS -->
<link rel="stylesheet"
  href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/css/bootstrap.min.css"
  integrity="sha384-1q8mTJOASx8j1Au+a5WDVnPi2lkFfwwEAa8hDDdjZlpLegxhjVME1fgjWPGmkzs7"
  crossorigin="anonymous">

<!-- Optional theme -->
<link rel="stylesheet"
  href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/css/bootstrap-theme.min.css"
  integrity="sha384-fLW2N01lMqjakBkx3l/M9EahuwpSfeNvV63J5ezn3uZzapT0u7EYsXMjQV+0En5r"
  crossorigin="anonymous">

<!-- Latest compiled and minified JavaScript -->
<script
  src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/js/bootstrap.min.js"
  integrity="sha384-0mSbJDEHialfmuBBQP6A4Qrprq5OVfW37PRR3j5ELqxss1yVqOtnepnHVP9aJ7xS"
  crossorigin="anonymous"></script>

<link href="assets/css/common.css" rel="stylesheet">
<link href="assets/css/nv.d3.css" rel="stylesheet">

<script src="assets/js/bootstrap.min.js"></script>
<script src="assets/js/d3.v3.js"></script>
<script src="assets/js/nv.d3.js"></script>

    <!--https://yandex.st/highlightjs/7.3/styles/default.min.css-->
<link rel="stylesheet"
  href="assets/css/default.min.css">
<link rel="stylesheet" href="spiderweb.css">

<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<title>OWASP DevSecOps Maturity Model - <?php echo $title ?></title>

<meta property="og:image" content="https://dsomm.timo-pagel.de/assets/images/logo.png">
<meta property="og:title" content="OWASP DevSecOps Maturity Model">
<meta property="og:description" content="The OWASP DevSecOps Maturity Model provides opportunities to harden DevOps strategies and shows how these can be prioritized">

<!-- Latest compiled and minified CSS -->
<link rel="stylesheet"
  href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/css/bootstrap.min.css"
  integrity="sha384-1q8mTJOASx8j1Au+a5WDVnPi2lkFfwwEAa8hDDdjZlpLegxhjVME1fgjWPGmkzs7"
  crossorigin="anonymous" />


<link href="print.css" rel="spiderweb.css" />
<link href="print.css" rel="stylesheet" />

<meta name="keywords" content="DevSecOps, DevOps, security, hardening">
<meta name="author" content="Timo Pagel">
<?php
$url = "https://dsomm.timo-pagel.de{$_SERVER['SCRIPT_NAME']}";
echo "<link rel='canonical' href=$url>";
?>
<script>
    $(function () {
        $('[data-toggle="popover"]').popover({placement: "bottom", trigger: "hover"}).on('click', function () {
            $(this).popover('toggle');
        });
    })</script>
</head>

<?php
include_once "bib.php";


/**
 *
 * @return unknown
 */
function getTableHeader() {
  $levels_labels = array_map(
    function($item) {
      return "Level " . $item['level']. ": ". $item['label'];
    },
    readYaml("data/maturity-levels.yaml#/maturity-levels")
  );
  $headers = array_merge(
    array ("Dimension", "Sub-Dimension"),
    $levels_labels
  );

  return "<thead  class=\"thead-default\"><tr>"
    ."<th>" . implode("</th><th>", $headers) . "</th>"
    ."</tr></thead>";
}


/**
 *
 * @param unknown $dimensions
 * @return unknown
 */
function getInfos($dimensions) {
  $text = "Activity Count: " . getElementCount ( $dimensions );
  return $text;
}


/**
 *
 * @param unknown $dimensions
 * @return unknown
 */
function getElementCount($dimensions) {
  $count = 0;
  foreach ( getActions($dimensions) as list($dimension, $subdimension, $element) ) {
    $count = $count + count( $element );
    echo "$subdimension: " . count( $element ) . "<br>";
  }
  return $count;
}


/**
 *
 * @param unknown $dimensions
 * @return unknown
 */
function getTable($dimensions) {
  $tableContent = "";
  $tableContent .= getTableHeader ();

  foreach ( getActions($dimensions) as list($dimension, $subdimension, $element) ) {
    $dimension_icon = isset($dimensions[$dimension]["_meta"]["icon"]) ? $dimensions[$dimension]["_meta"]["icon"] : "$dimension.png";
    $dimension_label = isset($dimensions[$dimension]["_meta"]["label"]) ? $dimensions[$dimension]["_meta"]["label"] : "$dimension";

    $tableContent .= "<tr>";
    $tableContent .= "<td>";
    $tableContent .= "<img height='40px' src=\"assets/images/$dimension_icon\"> $dimension_label";
    $tableContent .= "</td>";

    $tableContent .= "<td>";
    $tableContent .= "$subdimension";
    $tableContent .= "</td>";

    for ($i = 1; $i <= NUMBER_LEVELS; $i ++) {
      $tableContent .= "<td><ul>";
      foreach ( $element as $activityName => $activityContent ) {
        $content = getContentForLevelFromSubdimensions ( $i, $activityContent, $activityName );
        if ($content != "") {
          $activityLink = "detail.php?dimension=" . urlencode( $dimension ) . "&subdimension=" . urlencode( $subdimension ) . "&element=" . urlencode( $activityName );
          $tableContent .= "<a href='$activityLink' data-dimension='$dimension' data-subdimension='$subdimension' data-element='$activityName'";
          if (elementIsSelected ( $activityName, $activityContent )) {
            $tableContent .= "class='selected'";
          }
          $tableContent .= "><li>" . $content . "</li></a>";
        }
      }
      $tableContent .= "</ul></td>";
    }

    $tableContent .= "</tr>";
  }
  $table = '<table class="table table-striped"><caption>OWASP DevSecOps Maturity Model</caption>';
  $table .= $tableContent;
  $table .= "</table>";
  return $table;
}


/**
 *
 * @param unknown $level
 * @param unknown $subdimension
 * @param unknown $activityName
 * @return unknown
 */
function getContentForLevelFromSubdimensions($level, $subdimension, $activityName) {
  if ($level != $subdimension ["level"]) {
    return "";
  }
  $tooltip = "<div class='popoverdetails'>" . build_table_tooltip ( $subdimension ) . "</div>";
  return "<div data-toggle=\"popover\" data-title=\"$activityName\" data-content=\"$tooltip\" type=\"button\" data-html=\"true \">" . $activityName . "</div>";
}
