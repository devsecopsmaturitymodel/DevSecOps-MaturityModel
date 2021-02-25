<?php
/**
 * navi.php
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
<a href="https://github.com/wurstbrot/generic-DevOps-Security-MaturityModel"><img style="position: absolute; top: 0; right: 0; border: 0;" src="https://s3.amazonaws.com/github/ribbons/forkme_right_darkblue_121621.png" alt="Fork me on GitHub"></a>
<?php

$nav = array(
  "index.php" => "Matrix",
  "spiderweb.php" => "Implementation Levels",
  "scutter.php" => "Ease and Value",
  "mappings.php?performed=true&planned=true" => "Mappings",
  "graph.php" => "Dependencies",
  "report.php?performed=true&planned=true" => "Full Report",
  //"usefulnessHardness.php" => "Heatmap",
  "md.php?file=USAGE" => "Usage",
  "md.php?file=README" => "About this project",

);
?>
<ul class="nav nav-tabs">

<a class="navbar-brand" href="#">
    <img height="100%" src="/assets/images/logo.png" alt="OWASP DevSecOps Maturity Model">
</a>
<?php
foreach ($nav as $item => $value) {
  echo "<li ";
  //$item = preg_replace("/\?.*/", "", $item);

  if (strpos($_SERVER['REQUEST_URI'], $item)) {
    echo "class=\"active\"";
  }
  echo "role=\"\"><a href=\"$item\">$value</a></li>";
}
echo "</ul>";
?>
