<?php
$monitoring = array(
    "Einfache System-Metriken" => array(
        "risk" => "Systemadministratoren und Entwickler müssen, um einen Überblick über verschiedene virtuelle Systeme zu erlangen, sich auf diesen einloggen. Insbesondere Entwicklern ohne Linux-Kentnisse fällt die Auswertung von Protokollen auf Grundlage der Linux-Befehle cat, grep und awk schwer.",
        "measure" => "",
        "easeOfImplementation" => array(
            "knowledge" => 2,
            "time" => 2,
            "resources" => 2
        ),
        "usefulness" => 5,
        "level" => 1
    ),
    "Visuelle Anzeige von Metriken" => array(
        "risk" => "",
        "measure" => "Echtzeit",
        "easeOfImplementation" => array(
            "knowledge" => 1,
            "time" => 2,
            "resources" => 2
        ),
        "usefulness" => 3,
        "level" => 2
    ),
    "Erweiterte Anwendungs- und System-Metriken" => array(
        "risk" => "",
        "measure" => "",
        "easeOfImplementation" => array(
            "knowledge" => 3,
            "time" => 3,
            "resources" => 2
        ),
        "usefulness" => 4,
        "level" => 3
    ),
    "Einfache Anwendungs-Metriken" => array(
        "risk" => "Da keine Metriken über Anwendungen gesammelt werden, basieren Entscheidungen auf Basis von Schätzungen.",
        "measure" => "Sammeln von einfachen sicherheitsbezogenen Metriken innerhalb der Anwendung.",
        "easeOfImplementation" => array(
            "knowledge" => 2,
            "time" => 5,
            "resources" => 5
        ),
        "usefulness" => 5,
        "level" => 2
    ),
    "Alarmierung" => array(
        "risk" => "",
        "measure" => "",
        "easeOfImplementation" => array(
            "knowledge" => 2,
            "time" => 5,
            "resources" => 5
        ),
        "usefulness" => 5,
        "level" => 2
    ),
    "Deaktivierung ungenutzter Metriken" => array(
        "risk" => "",
        "measure" => "",
        "easeOfImplementation" => array(
            "knowledge" => 2,
            "time" => 5,
            "resources" => 5
        ),
        "usefulness" => 5,
        "level" => 3
    ),
    "Sinnvolle Gruppierung der Metriken" => array(
        "risk" => "",
        "measure" => "",
        "easeOfImplementation" => array(
            "knowledge" => 2,
            "time" => 5,
            "resources" => 5
        ),
        "usefulness" => 5,
        "level" => 3
    ),
    "Zielgerichtete Alarmierung" => array(
        "risk" => "",
        "measure" => "",
        "easeOfImplementation" => array(
            "knowledge" => 2,
            "time" => 5,
            "resources" => 5
        ),
        "usefulness" => 5,
        "level" => 3
    ),
    "Bildschirme zeigen sicherheitsbezogene Informationen" => array(
        "risk" => "",
        "measure" => "",
        "easeOfImplementation" => array(
            "knowledge" => 2,
            "time" => 5,
            "resources" => 5
        ),
        "usefulness" => 5,
        "level" => 4
    ),
    "Metriken sind kombiniert mit Tests" => array(
        "risk" => "",
        "measure" => "",
        "easeOfImplementation" => array(
            "knowledge" => 2,
            "time" => 5,
            "resources" => 5
        ),
        "usefulness" => 5,
        "level" => 4
    ),
    "Rollenbasierte Authentifizierung und Authorisierung" => array(
        "risk" => "Jeder kann für jedes System sicherheitsrelevante Informationen einsehen.",
        "measure" => "Nutzung von Rollenbasierter Authentifizierung und Authorisierung, ggf. verbunden mit einem zentralem Authentifizierungs-Server.",
        "easeOfImplementation" => array(
            "knowledge" => 2,
            "time" => 1,
            "resources" => 1
        ),
        "usefulness" => 2,
        "level" => 4,
        "implementation" => ""
    ),
);
ksort($monitoring);
$protocol = array(
    "Zentrale Protokollierung" => array(
        "risk" => "",
        "measure" => "",
        "easeOfImplementation" => array(
            "knowledge" => 2,
            "time" => 2,
            "resources" => 2
        ),
        "usefulness" => 4,
        "level" => 1
    ),
    "Grafische Auswertung" => array(
        "risk" => "",
        "measure" => "",
        "easeOfImplementation" => array(
            "knowledge" => 3,
            "time" => 3,
            "resources" => 4
        ),
        "usefulness" => 4,
        "level" => 2
    ),
    "Ausnahmen der Anwendung werden erfasst" => array(
        "risk" => "",
        "measure" => "",
        "easeOfImplementation" => array(
            "knowledge" => 3,
            "time" => 2,
            "resources" => 2
        ),
        "usefulness" => 5,
        "level" => 3,
        "dependsOn" => array("Grafische Auswertung")
    ),
    "Rollenbasierte Authentifizierung und Authorisierung" => array(
        "risk" => "Jeder kann für jedes System sicherheitsrelevante Informationen einsehen.",
        "measure" => "Nutzung von Rollenbasierter Authentifizierung und Authorisierung, ggf. verbunden mit einem zentralem Authentifizierungs-Server.",
        "easeOfImplementation" => array(
            "knowledge" => 2,
            "time" => 1,
            "resources" => 1
        ),
        "usefulness" => 2,
        "level" => 4,
        "implementation" => "",
        "dependsOn" => array("Grafische Auswertung")
    ),
);
ksort($protocol);
$dimensions["Information"] = array(
    "Überwachung" =>$monitoring,
    "Protokollierung" =>$protocol
);