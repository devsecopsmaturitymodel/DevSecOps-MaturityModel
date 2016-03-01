<html>
<head>
    <script src="//code.jquery.com/jquery-1.12.0.min.js"></script>

    <!-- Latest compiled and minified CSS -->
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/css/bootstrap.min.css"
          integrity="sha384-1q8mTJOASx8j1Au+a5WDVnPi2lkFfwwEAa8hDDdjZlpLegxhjVME1fgjWPGmkzs7" crossorigin="anonymous">

    <!-- Optional theme -->
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/css/bootstrap-theme.min.css"
          integrity="sha384-fLW2N01lMqjakBkx3l/M9EahuwpSfeNvV63J5ezn3uZzapT0u7EYsXMjQV+0En5r" crossorigin="anonymous">

    <!-- Latest compiled and minified JavaScript -->
    <script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/js/bootstrap.min.js"
            integrity="sha384-0mSbJDEHialfmuBBQP6A4Qrprq5OVfW37PRR3j5ELqxss1yVqOtnepnHVP9aJ7xS"
            crossorigin="anonymous"></script>

    <link href="http://nvd3.org/assets/css/common.css" rel="stylesheet">
    <link href="http://nvd3.org/assets/css/nv.d3.css" rel="stylesheet">

    <script src="http://nvd3.org/assets/js/lib/bootstrap.min.js"></script>
    <script src="http://nvd3.org/assets/lib/d3.v3.js"></script>
    <script src="http://nvd3.org/assets/js/nv.d3.js"></script>

</head>
<body>
<?php
include_once "data.php";
include_once "navi.php";


function getTableHeader()
{
    $headers = array("Dimension", "Unter-Dimension", "Ebene 0: Inital", "Ebene 1: Grundverständnis von Sicherheitspraktiken", "Ebene 2: Erweitertes Verständnis von Sicherheitspraktiken", "Ebene 3: Hohes Verständnis von Sicherheitspraktiken", "Ebene 4: Sehr hohes Verständnis von Sicherheitspraktiken bei Skalierung");
    $headerContent = "<thead  class=\"thead-default\"><tr>";
    foreach ($headers as $header) {
        $headerContent .= "<th>$header</th>";
    }
    return $headerContent . "</tr></thead>";
}

function getTable($dimensions)
{
    $tableContent = "";
    $tableContent .= getTableHeader();
    foreach ($dimensions as $dimension => $subdimensions) {
        foreach ($subdimensions as $subdimension => $element) {
            $tableContent .= "<tr>";
            $tableContent .= "<td>";
            $tableContent .= "$dimension";
            $tableContent .= "</td>";

            $tableContent .= "<td>";
            $tableContent .= "$subdimension";
            $tableContent .= "</td>";

            for ($i = 0; $i <= 4; $i++) {
                $tableContent .= "<td><ul>";
                foreach ($element as $elementName => $content) {
                    $content = getContentForLevelFromSubdimensions($i, $content, $elementName);
                    if ($content != "") {
                        $tableContent .= "<li>" . $content . "</li>";
                    }
                }
                $tableContent .= "</ul></td>";
            }

            $tableContent .= "</tr>";
        }

    }
    $table = '<table class="table table-striped"><caption>Generic DevOps-Security Maturity Model</caption>';
    $table .= $tableContent;
    $table .= "</table>";
    return $table;
}


function build_table_tooltip($array)
{
    $mapKnowLedge = array("Sehr wenig (eine Disziplin)", "wenig (eine Disziplin)", "mittel (zwei Disziplinen)", "viel (zwei Disziplinen)", "sehr viel (drei oder mehr Disziplinen)");
    $mapTime = array("Sehr wenig (1-2 Tage)", "wenig (eine Woche)", "mittel (zwei Wochen)", "viel (drei Wochen)", "sehr viel (drei oder mehr Wochen)");
    $mapResources = array("Sehr wenig", "wenig", "mittel", "viel", "sehr viel");

    $html = "<div><b>Risiko:</b> " . $array['risk'] . "</div>";
    $html .= "<div><b>Maßnahme:</b> " . $array['measure'] . "</div>";
    $html .= "<hr />";
    $html .= "<div><b>Benötigtes Wissen:</b> " . $mapKnowLedge[$array['easeOfImplementation']['knowledge']] . "</div>";
    $html .= "<div><b>Benötigte Zeit:</b> " . $mapTime[$array['easeOfImplementation']['knowledge']] . "</div>";
    $html .= "<div><b>Benötigte Resourcen (Systeme):</b> " . $mapResources[$array['easeOfImplementation']['knowledge']] . "</div>";
    return $html;
}


function getContentForLevelFromSubdimensions($level, $subdimension, $elementName)
{
    $levelContent = "";
    if ($level != $subdimension["level"]) {
        return "";
    }
    $tooltip = "<div>" . build_table_tooltip($subdimension) . "</div>";
    return "<div data-toggle=\"popover\" data-title=\"$elementName\" data-content=\"$tooltip\" type=\"button\" >" . $elementName . "</div>";
}

echo getTable($dimensions);
?>
<script>
    $(function () {
        $('[data-toggle="popover"]').popover({placement: "bottom", trigger: "hover"}).on('click', function () {
            $(this).popover('toggle');
        });
    })</script>

<?php