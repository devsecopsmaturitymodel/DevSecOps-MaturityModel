<?php
$deployment = array(
    "Definierter Verteilungs-Prozess"                      => array(
        "risk"                 => "Verteilungen können unterschiedlich durchgeführt werden. Wird ein Fehler bei der Verteilung gemacht, welcher manuell korrigiert werden muss, kann die Verfügbarkeit beeinträchtigt werden. Mögliche Scenarien sind entsprechend: Es können Sicherheits-Tests, welche das Abbild validieren vergessen werden [#bass2015securing, S. 1]. Es wird ein Abbild erzeugt, allerdings ein anderes Abbild deployed [#bass2015securing, S. 1].",
        "measure"              => "Durch einen definierten Verteilungs-Prozess wird die Verfügbarkeit erhöht, da Fehler reduziert werden.",
        "easeOfImplementation" => array(
            "knowledge" => 2,
            "time"      => 2,
            "resources" => 1
        ),
        "usefulness"           => 4,
        "level"                => 1,
        "implementation"       => "Jenkins, Docker",
        "securityProperties"   => array(
            "availability" => "Es wird die Verfügbarkeit erhöht, da Fehler reduziert werden.",
            "integrity"    => "Es wird die Wahrscheinlichkeit reduziert versehentlich Daten zu löschen.",
        ),
    ),
    "Backup vor Verteilung"                               => array(
        "risk"                 => "Durch das Einspielen eines Updates in einer DBMS-Software kommt es zu Fehlern, welche zu Datenverlust führen [#bsiFreigabe].",
        "measure"              => "Automatische Backups werden vor der Verteilung neuer Software durchgeführt, sofern die Datenmenge dies in einer angemessenen Zeit zulässt. Wiederherstellung ist geprüft.",
        "easeOfImplementation" => array(
            "knowledge" => 1,
            "time"      => 2,
            "resources" => 1
        ),
        "usefulness"           => 4,
        "level"                => 2,
        "implementation"       => "",
        "dependsOn"            => array("Definierter Verteilungs-Prozess"),
        "securityProperties"   => array(
            "availability" => "Es wird die Verfügbarkeit erhöht, da bei Störungen eine Möglichkeit zur Wiederherstellung eines früheren Stands möglich ist.",
            "integrity"    => "Durch ein Backup kann die Integrität von Daten nach einem Angriff geprüft werden.",
        ),
    ),
    "Lückenlose Verteilung"                              => array(
        "risk"                 => "Durch eine Verteilung ist die Verfügbarkeit des Systems beeinträchtigt.",
        "measure"              => "Es ist ein lückenloser Verteilungs-Prozess definiert.",
        "easeOfImplementation" => array(
            "knowledge" => 2,
            "time"      => 2,
            "resources" => 2
        ),
        "usefulness"           => 2,
        "level"                => 3,
        "implementation"       => "Docker",
        "dependsOn"            => array("Definierter Verteilungs-Prozess"),
        "securityProperties"   => array(
            "availability" => "Es besteht weniger Beeinträchtigung der Verfügbarkeit bei Verteilungen.",
        ),
    ),
    "Selektierte Verteilung"                             => array(
        "risk"                 => "Durch eine Verteilung kann die Verfügbarkeit des Systems gefährdet sein.",
        "measure"              => "Es wird nur auf einen Server die Verteilung angewendet und anschließend eine Post-Verteilungs-Prüfung vorgenommen, nur wenn diese erfolgreich ist, wird auf weitere Server deployed.",
        "easeOfImplementation" => array(
            "knowledge" => 1,
            "time"      => 2,
            "resources" => 1
        ),
        "usefulness"           => 2,
        "level"                => 3,
        "implementation"       => "",
        "dependsOn"            => array("Post-Verteilungs-Prüfung",
                                        "Produktiv-Umgebung und Test-Umgebung"),
        "securityProperties"   => array(
            "availability" => "Es besteht weniger Beeinträchtigung der Verfügbarkeit bei Verteilungen.",
        ),
    ),
);
ksort($deployment);
$build = array(
    "Definierter Erzeugungs-Prozess"                      => array(
        "risk"                 => "Die Erzeugung kann bei jedem mal unterschiedlich durchgeführt werden. Wird ein Fehler dabei gemacht können sicherheitsrelevante Konfigurationen falsch gesetzt werden.",
        "measure"              => "Es existiert ein definierter automatisierter Prozess für die Erzeugung, welcher manuell angestoßen werden kann.",
        "easeOfImplementation" => array(
            "knowledge" => 2,
            "time"      => 3,
            "resources" => 2
        ),
        "usefulness"           => 4,
        "level"                => 1,
        "implementation"       => "Jenkins, Docker",
        "securityProperties"   => array(
            "availability" => "Es wird die Verfügbarkeit erhöht, da Fehler reduziert werden.",
            "integrity"    => "Es wird die Wahrscheinlichkeit reduziert versehentlich Daten zu verändern.",
        )
    ),
    "Erzeugung und Test bei Push"                         => array(
        "risk"                 => "Vom pushen von Quellcode in die Versionskontrolle bis zum Feedback, dass dieser Quellcode eine Schwachstelle enthält, kann Zeit vergehen. Dadurch ist es für den Entwickler schwieriger, seinen gepushten Quellcode nachzuvollziehen und die Schwachstelle zu beseitigen. ",
        "measure"              => "Bei jedem Push wird automatisch eine Verteilung auf eine Testumgebung durchgeführt und automatisch Tests- und Verifikationen durchgeführt, mindestens für die geänderten Quellcode-Bereiche.",
        "easeOfImplementation" => array(
            "knowledge" => 1,
            "time"      => 1,
            "resources" => 1
        ),
        "usefulness"           => 2,
        "level"                => 2,
        "implementation"       => "",
        "dependsOn"            => array("Definierter Erzeugungs-Prozess"),
        "securityProperties"   => array(
            "integrity" => "Für jede Änderung der Software erfolgt zeitnah eine Prüfung. Bei versehentlichem Einführen von Schwachstellen in den Quellcode wird eine Rückmeldung gegeben, so dass die ungewollte Schwachstelle entfernt werden kann.",
        ),
    ),
    "Erzeugung von Artefakten in virtuellen Umgebungen"   => array(
        "risk"                 => "Erlangt ein Angreifer Zugriff auf das Versionskontrollsystem eines Projekts oder auf die Konfiguration zur Erzeugung, kann dieser ggf. Zugriff auf das Erzeungs-System erlangen und dadurch andere Erzeugungsaufträge kompromittieren.",
        "measure"              => "Erzeugung von Artefakten findet in virtuellen Umgebungen statt.",
        "easeOfImplementation" => array(
            "knowledge" => 2,
            "time"      => 2,
            "resources" => 2
        ),
        "usefulness"           => 2,
        "level"                => 4,
        "implementation"       => "",
        "dependsOn"            => array("Definierter Erzeugungs-Prozess"),
        "securityProperties"   => array(
            "integrity" => "Da Erzeungsaufträge sich nicht gegenseitig beeinflussen können, ist die Integrität nicht durch andere Erzeugungsaufträge gefährdet.",
        ),
    ),
    "Austausch von Konfigurationsparmetern"               => array(
        "risk"                 => "Angreifer, welche Zugang zum Quellcode und damit zur Konfiguration erhalten, können schutzwürdige Informationen wie Datenbank-Zugänge einsehen.",
        "measure"              => "Bei Verteilungen werden schutzbedürftige Konfigurationsparameter je nach Umgebung gesetzt. So kann beispielsweise der Datenbank-Zugang über Umgebungsvariablen gesetzt werden.",
        "easeOfImplementation" => array(
            "knowledge" => 2,
            "time"      => 2,
            "resources" => 1
        ),
        "usefulness"           => 4,
        "level"                => 2,
        "implementation"       => "",
        "dependsOn"            => array("Definierter Erzeugungs-Prozess"),
        "securityProperties"   => array(
            "confidentiality" => "Nur autorisierte Personen/Systeme erhalten Zugriff auf vertrauliche Konfigurationsparameter.",
        ),
    ),
    "Gleiches Artefakt"                                   => array(
        "risk"                 => "Es wird ein unterschiedliches Artefakt der Anwendung für die Testumgebung und die Produktionsumgebung verwendet. Entsprechend können auf der Produktionsumgebung unerwartete Effekte auftreten.",
        "measure"              => "Das gleiche Artefakt der Anwendung von der Testumgebung wird auf der Produktionsumgebung verwendet. [#swartout2012continuous, INTERNAL 39]",
        "easeOfImplementation" => array(
            "knowledge" => 2,
            "time"      => 2,
            "resources" => 1
        ),
        "usefulness"           => 4,
        "level"                => 3,
        "implementation"       => "Docker",
        "securityProperties"   => array(
            "integrity"    => "Es ist sicher gestellt, dass das selbe Artefakt der Testumgebung auf die Produktionsumgebung deployed wird.",
            "availability" => "Es ist sicher gestellt, dass nur geprüfte Artefakte auf der Produktionsumgebung verwendet werden, so dass keine ungeprüften ggf. fehlerhaften Artefakte deployed werden.",
        ),
        "dependsOn"            => array("Definierter Erzeugungs-Prozess"),
    ),
    "Konfiguration für ein Artefakt"                      => array(
        "risk"                 => "Es werden unterschiedliche Aktionen in der Testumgebung und der Produktionsumgebung ausgeführt. Beispielsweise folgender Quellcode: if (host == 'production') {} else {}",
        "measure"              => "Es werden Umgebungsvariablen oder Parameter beim Starten des Artefakts verwendet. Verhalten wird nur über Konfiguration gesteuert und nicht über Hostnamen o.ä..",
        "easeOfImplementation" => array(
            "knowledge" => 2,
            "time"      => 1,
            "resources" => 1
        ),
        "usefulness"           => 2,
        "level"                => 3,
        "implementation"       => "Docker",
        "securityProperties"   => array(
            "availability" => "Durch vermeidung unterschiedlicher Aktionen in Test- und Produktionsumgebung ist gleiches Verhalten sicher gestellt und damit die Verfügbarkeit erhöht.",
        ),
        "dependsOn"            => array("Gleiches Artefakt"),
    ),
    "Versionierte Artefakte"                              => array(
        "risk"                 => "Ein Artefakt enthält eine Schwachstelle oder verursacht unerwartete Effekte, nachdem es auf Produktion ausgerollt wurde.",
        "measure"              => "Verteilungen werden versioniert. Es ist einfach auf eine vorherige Version zurück zu greifen.",
        "easeOfImplementation" => array(
            "knowledge" => 2,
            "time"      => 2,
            "resources" => 3
        ),
        "usefulness"           => 3,
        "level"                => 4,
        "implementation"       => "Docker",
        "securityProperties"   => array(
            "availability" => "Durch versionierte Artefakte kann bei Fehlern bei Verteilungen schnell auf eine vorherige Version umgeschaltet werden.",
            "integrity"    => "Durch versionierte Artefakte ist die Integrität von Software-Artefakten sicher gestellt.",
        ),
        "dependsOn"            => array("Gleiches Artefakt"),
    ),
    "Rollen basierte Authentifizierung und Autorisierung" => array(
        "risk"                 => "Jeder Entwickler kann für jeden Mikroservice eine Verteilung anstoßen oder die Konfiguration von einer Verteilung verändern. Es wird nicht protokolliert, welcher Entwickler welche Aktion durchgeführt hat.",
        "measure"              => "Nutzung von Rollen basierter Authentifizierung und Authorisierung, ggf. verbunden mit einem zentralem Authentifizierungs-Server.",
        "easeOfImplementation" => array(
            "knowledge" => 2,
            "time"      => 1,
            "resources" => 1
        ),
        "usefulness"           => 2,
        "level"                => 4,
        "implementation"       => "Verzeichnisdienst",
        "securityProperties"   => array(
            "confidentiality" => "Vertrauliche Informationen über interne Systeme sind geschützt.",
            "integrity"       => "Nur autorisierte Personen/Systeme können eine Verteilung anstoßen. Dadurch wird die versehentliche Verteilung eines Software-Artefakts mit Fehlern vermieden.",
        ),
        "dependsOn"            => array("Definierter Verteilungs-Prozess")
    ),
);
ksort($build);

$dimensions["Erzeugung und Verteilung"] = array(
    "Erzeugung"  => $build,
    "Verteilung" => $deployment,
);
