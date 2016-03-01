<?php
$dimensions["Infrastruktur"] = array(
    "Infrastruktur" => array(
        "Anwendungen laufen in virtuellen Umgebungen" => array(
            "risk" => "",
            "measure" => "",
            "easeOfImplementation" => array(
                "knowledge" => 3,
                "time" => 3,
                "resources" => 3
            ),
            "usefulness" => 3,
            "level" => 1,
        ),
        "Es existiert eine Produktiv-Umgebung und mindestens eine Test-Umgebung" => array(
            "risk" => "",
            "measure" => "",
            "easeOfImplementation" => array(
                "knowledge" => 3,
                "time" => 3,
                "resources" => 3
            ),
            "usefulness" => 5,
            "level" => 1,
            "dependsOn" => array("Definierter Deployment-Prozess")
        ),
        "Systeme sind einfach geschützt" => array(
            "risk" => "",
            "measure" => "",
            "easeOfImplementation" => array(
                "knowledge" => 3,
                "time" => 3,
                "resources" => 3
            ),
            "usefulness" => 5,
            "level" => 1,
            "dependsOn" => array("Definierter Deployment-Prozess")
        ),
        "Alle virtuellen Umgebungen besitzen Limitierungen" => array(
            "risk" => "",
            "measure" => "",
            "easeOfImplementation" => array(
                "knowledge" => 3,
                "time" => 3,
                "resources" => 3
            ),
            "usefulness" => 5,
            "level" => 2,
            "dependsOn" => array("Anwendungen laufen in virtuellen Umgebungen")
        ),
        "Provisionierung" => array(
            "risk" => "",
            "measure" => "Infrastructure as Code",
            "easeOfImplementation" => array(
                "knowledge" => 3,
                "time" => 4,
                "resources" => 4
            ),
            "usefulness" => 5,
            "level" => 2,
            "dependsOn" => array("Definierter Deployment-Prozess")
        ),
        "Entwickler sind in der Lage die Live-Umgebung zu erweitern" => array(
            "risk" => "",
            "measure" => "",
            "easeOfImplementation" => array(
                "knowledge" => 3,
                "time" => 3,
                "resources" => 3
            ),
            "usefulness" => 5,
            "level" => 2,
            "dependsOn" => array("Definierter Deployment-Prozess")
        ),
        "Produktionsnahe Umgebung steht Entwicklern zur Verfügung" => array(
            "risk" => "",
            "measure" => "",
            "easeOfImplementation" => array(
                "knowledge" => 3,
                "time" => 3,
                "resources" => 3
            ),
            "usefulness" => 5,
            "level" => 2,
            "dependsOn" => array("Definierter Deployment-Prozess")
        ),
        "Firewall für virtuelle Maschinen" => array(
            "risk" => "",
            "measure" => "Eine erweiterte Firewall zur Begrenzung der Kommunikation zwischen den virtuellen Umgebungen ist installiert",
            "easeOfImplementation" => array(
                "knowledge" => 3,
                "time" => 3,
                "resources" => 3
            ),
            "usefulness" => 5,
            "level" => 3,
            "dependsOn" => array("Definierter Deployment-Prozess")
        ),
        "Alle Produktions-Artifakte sind Versioniert" => array(
            "risk" => "",
            "measure" => "",
            "easeOfImplementation" => array(
                "knowledge" => 3,
                "time" => 3,
                "resources" => 3
            ),
            "usefulness" => 5,
            "level" => 3,
            "dependsOn" => array("Definierter Deployment-Prozess")
        ),
        "Betriebssystem-Aufrufe von Anwendungen sind limitiert" => array(
            "risk" => "",
            "measure" => "Betriebssystem-Aufrufe von Anwendungen in virtuellen Umgebungen sind limitiert und auf einer Positivliste eingetragen",
            "easeOfImplementation" => array(
                "knowledge" => 3,
                "time" => 3,
                "resources" => 3
            ),
            "usefulness" => 5,
            "level" => 4,
            "dependsOn" => array("Anwendungen laufen in virtuellen Umgebungen")
        ),
        "Erweiterte Prüfung von Paket-Quellen" => array(
            "risk" => "",
            "measure" => "Jede Paket-Quelle, beispielsweise für Abbilder für virtuelle Maschinen, ist manuell geprüft.",
            "easeOfImplementation" => array(
                "knowledge" => 3,
                "time" => 2,
                "resources" => 1
            ),
            "usefulness" => 3,
            "level" => 4
        ), "Mikroservice-Architektur" => array(
            "risk" => "",
            "measure" => "Es ist eine Mikroservice-Architektur genutzt",
            "easeOfImplementation" => array(
                "knowledge" => 4,
                "time" => 5,
                "resources" => 5
            ),
            "usefulness" => 3,
            "level" => 4
        ), "Retrospective Security" => array(
            "risk" => "",
            "measure" => "Infizierte Systeme werden automatisch erkannt und herunter gefahren",
            "easeOfImplementation" => array(
                "knowledge" => 4,
                "time" => 5,
                "resources" => 5
            ),
            "usefulness" => 3,
            "level" => 4
        )
    )
);