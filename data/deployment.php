<?php
$deployment = array("Definierter Deployment-Prozess" =>
    array(
        "risk" => "Deployments können unterschiedlich durchgeführt werden. Wird ein Fehler beim Deployment gemacht, welcher manuell korrigiert werden muss, kann die Verfügbarkeit beeinträchtigt werden. Mögliche Scenarien sind entsprechend: Es können Sicherheits-Tests, welche das Abbild validieren vergessen werden [#bass2015securing, S. 1]. Es wird ein Abbild erzeugt, allerdings ein anderes Abbild deployed [#bass2015securing, S. 1].",
        "measure" => ".",
        "easeOfImplementation" => array(
            "knowledge" => 2,
            "time" => 1,
            "resources" => 1
        ),
        "usefulness" => 4,
        "level" => 1,
        "implementation" => ""
    ),
    "Backup" => array(
        "risk" => "Durch das Einspielen eines Updates in einer DBMS-Software kommt es zu Fehlern, welche zu Datenverlust führen [#bsiFreigabe].",
        "measure" => "Automatische Backups werden vor dem Ausrollen neuer Software durchgeführt, sofern die Datenmenge dies in einer angemessenen Zeit zulässt. Wiederherstellung ist geprüft.",
        "easeOfImplementation" => array(
            "knowledge" => 1,
            "time" => 2,
            "resources" => 1
        ),
        "usefulness" => 4,
        "level" => 2,
        "implementation" => "",
        "dependsOn" => array("Definierter Deployment-Prozess")
    ),
    "Lückenloses Deployment" => array(
        "risk" => "Durch ein Deployment ist die Verfügbarkeit des Systems beeinträchtigt.",
        "measure" => "Es ist ein lückenloser Deployment-Prozess definiert.",
        "easeOfImplementation" => array(
            "knowledge" => 2,
            "time" => 2,
            "resources" => 3
        ),
        "usefulness" => 2,
        "level" => 3,
        "implementation" => "",
        "dependsOn" => array("Definierter Deployment-Prozess")
    ),
    "Selektiertes Deployment"=> array(
        "risk" => "Durch ein Deployment kann die Verfügbarkeit des Systems gefährdet sein.",
        "measure" => "Es wird nur auf einen Server das Deployment angewendet und anschließend eine Post-Deployment-Prüfung vorgenommen, nur wenn diese erfolgreich ist, wird auf weitere Server deployed.",
        "easeOfImplementation" => array(
            "knowledge" => 2,
            "time" => 2,
            "resources" => 3
        ),
        "usefulness" => 2,
        "level" => 3,
        "implementation" => "",
        "dependsOn" => array("Post-Deployment-Prüfung", "Mikroservice-Architektur")
    ),
    "Rollenbasierte Authentifizierung und Authorisierung" => array(
        "risk" => "Jeder Entwickler kann für jeden Mikroservice ein Deployment anstoßen oder die Konfiguration von einem Deployment verändern. Es wird nicht protokolliert, welcher Entwickler welche Aktion durchgeführt hat.",
        "measure" => "Nutzung von Rollenbasierter Authentifizierung und Authorisierung, ggf. verbunden mit einem zentralem Authentifizierungs-Server.",
        "easeOfImplementation" => array(
            "knowledge" => 2,
            "time" => 1,
            "resources" => 1
        ),
        "usefulness" => 2,
        "level" => 4,
        "implementation" => "",
        "dependsOn" => array("Definierter Deployment-Prozess")
    ));
ksort($deployment);
$build = array("Definierter Erzeugungs-Prozess" => array(
    "risk" => "Die Erzeugung kann bei jedem mal unterschiedlich durchgeführt werden. Wird ein Fehler dabei gemacht können Sicherheitsrelevante Konfigurationen falsch gesetzt werden.",
    "measure" => "Es existiert ein definierter automatisierter Prozess für die Erzeugung, welcher manuell angestoßen werden kann.",
    "easeOfImplementation" => array(
        "knowledge" => 2,
        "time" => 4,
        "resources" => 2
    ),
    "usefulness" => 4,
    "level" => 1,
    "implementation" => "Jenkins"
),
    "Erzeugung und Prüfung bei Push" => array(
        "risk" => "Vom pushen von Quellcode in die Versionskontrolle bis zum Feedback, dass dieser Quellcode eine Schwachstelle enthält, kann Zeit vergehen. Dadurch ist es für den Entwickler schwieriger, seinen gepushten Quellcode nachzuvollziehen und die Schwachstelle zu beseitigen. ",
        "measure" => "Bei jedem Push wird automatisch ein Deployment auf eine Testumgebung durchgeführt und automatisch Tests- und Verfikationen durchgeführt, mindestens für die geänderten Quellcode-Bereiche.",
        "easeOfImplementation" => array(
            "knowledge" => 1,
            "time" => 1,
            "resources" => 1
        ),
        "usefulness" => 2,
        "level" => 2,
        "implementation" => ""
    ),
    "Austausch von Konfigurationsparmetern" => array(
        "risk" => "Angreifer, welche Zugang zum Quellcode und damit zur Konfiguration erhalten, können schutzwürdige Informationen wie Datenbank-Zugänge einsehen.",
        "measure" => "Bei Deployment werden schutzbedürftige Konfigurationsparameter je nach Umgebung gesetzt. So kann beispielsweise der Datenbank-Zugang über Umgebungsvariablen gesetzt werden.",
        "easeOfImplementation" => array(
            "knowledge" => 2,
            "time" => 1,
            "resources" => 1
        ),
        "usefulness" => 4,
        "level" => 2,
        "implementation" => ""
    ),
    "Ein Artifakt" => array(
        "risk" => "Es wird ein unterschiedliches Artifakt für die Testumgebung und die Produktionsumgebung verwendet. Entsprechend können auf der Prodktionsumgebung unerwartete Effekte auftreten.",
        "measure" => "Das gleiche Artifakte von der Testumgebung wird auf der Prodktionsumgebung verwendet. [#swartout2012continuous, INTERNAL 39]",
        "easeOfImplementation" => array(
            "knowledge" => 2,
            "time" => 2,
            "resources" => 1
        ),
        "usefulness" => 4,
        "level" => 3,
        "implementation" => "Docker"
    ),
    "Ein Artifakt - Konfiguration" => array(
        "risk" => "Es werden unterschiedliche Aktionen in der Testumgebung und der Produktionsumgebung ausgeführt. Beispielsweise folgender Quellcode: if (host == 'production') {} else {}",
        "measure" => "Es werden Umgebungsvariablen oder Parameter beim Starten des Artifakts verwendet. Verhalten wird nur über Konfiguration gesteuert und nicht über Hostnamen o.ä..",
        "easeOfImplementation" => array(
            "knowledge" => 2,
            "time" => 2,
            "resources" => 1
        ),
        "usefulness" => 4,
        "level" => 3,
        "implementation" => "Docker"
    ),
    "Versionierte Artifakte" => array(
        "risk" => "Ein Artifact enthält eine Schwachstelle oder verursacht unerwartete Effekte, nachdem es auf Produktion ausgerollt wurde.",
        "measure" => "Deployments werden versioniert. Es ist einfach auf eine vorherige Version zurück zu greifen.",
        "easeOfImplementation" => array(
            "knowledge" => 2,
            "time" => 2,
            "resources" => 3
        ),
        "usefulness" => 3,
        "level" => 4,
        "implementation" => "Docker"
    ));
ksort($build);

$dimensions["Erzeugung und Deployment"] = array(
    "Erzeugung" => $build,
    "Deployment" => $deployment,
);