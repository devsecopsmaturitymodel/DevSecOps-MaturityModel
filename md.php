<?php
/**
 * md.php
 *
 * @package default
 */


$title = "About this project";

include_once "head.php";

?>
<body>
<?php
include_once "data.php";
include_once "navi.php";

if (!ctype_alnum($_GET['file'])) {
  exit; // make sure no path traversal or what ever happens
}
$markdownContent = file_get_contents($_GET['file'] . ".md"); // only allow .md in this directory

$Parsedown = new Parsedown();
echo $Parsedown->text($markdownContent);
