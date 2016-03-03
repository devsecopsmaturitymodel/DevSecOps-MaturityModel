<?php
$itle = "Tabellenübersicht";
include_once "head.php";
?>
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
                        $elementLink = "detail.php?dimension=".urlencode($dimension)."&subdimension=".urlencode($subdimension)."&element=".urlencode($elementName);
                        $tableContent .= "<a href='$elementLink'><li>" . $content . "</li></a>";
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
