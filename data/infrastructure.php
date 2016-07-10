<?php
$dimensions["Infrastruktur"] = array(
    "Infrastruktur" => array(
        "Anwendungen laufen in virtuellen Umgebungen" => array(
            "risk" => "Durch einen Einbruch erlangt ein Angreifer Zugriff auf alle auf einem Server laufenden Anwendungen.",
            "measure" => "Anwendungen laufen in virtuellen Umgebungen.",
            "easeOfImplementation" => array(
                "knowledge" => 3,
                "time" => 3,
                "resources" => 5
            ),
            "usefulness" => 3,
            "level" => 2,
            "securityProperties" => array("availability"),
        ),
        "Produktiv-Umgebung und Test-Umgebung" => array(
            "risk" => "Sicherheits-Tests werden aufgrund mangelnder Test-Umgebungen nicht durchgeführt.",
            "measure" => "Es existiert eine Produktiv-Umgebung und mindestens eine Test-Umgebung",
            "easeOfImplementation" => array(
                "knowledge" => 3,
                "time" => 3,
                "resources" => 5
            ),
            "usefulness" => 4,
            "level" => 1,
            "dependsOn" => array("Definierter Verteilungs-Prozess"),
            "securityProperties" => array("availability" => "Durch ausreichende Tests ist das System stabil", "integrity" => "Durch ausreichende Tests ist sichergestellt, dass Daten nicht versehentlich bei einer Verteilung gelöscht werden."),
        ),
        "Interne Systeme sind einfach geschützt" => array(
            "risk" => "Angreifer erhalten Zugriff auf interne Systeme ohne Authentifizierung und können Daten mitschneiden.",
            "measure" => "Alle internen Systeme sind mit einfacher Authentifizierung und Verschlüsselung geschützt.",
            "easeOfImplementation" => array(
                "knowledge" => 3,
                "time" => 3,
                "resources" => 3
            ),
            "usefulness" => 5,
            "level" => 1,
            "dependsOn" => array("Definierter Verteilungs-Prozess"),
            "securityProperties" => array("authentication" => "Durch Zugriffsschutz ist sichergestellt, dass nur Autorisierte schutzwerte Informationen einsehen können.", "confidentiality" => "Durch eine verschlüsstelte Verbindung ist sichergestellt, dass nur Autorisierte schutzwerte Informationen einsehen können."),
            "implementation" => "HTTP-Authentifizierung, TLS, VPN"
        ),
        "Virtuelle Umgebungen sind limitiert" => array(
            "risk" => "Wird eine Anwendung in einer virtuellen Umgebung angegriffen oder hat einen Defekt, kann dies zu erhöhter Ressourcen-Nutzung führen, wodurch auch andere Anwendung auf dem gleichem Server stark beeinträchtigt werden können.",
            "measure" => "Alle virtuellen Umgebungen besitzen Limitierungen für Arbeitsspeicher, Festplattendurchsatz, Festplattenplatz und Prozessoren.",
            "easeOfImplementation" => array(
                "knowledge" => 2,
                "time" => 2,
                "resources" => 3
            ),
            "usefulness" => 3,
            "level" => 3,
            "dependsOn" => array("Anwendungen laufen in virtuellen Umgebungen"),
            "securityProperties" => array("availability" => "Da alle Anwendungen/Prozesse limitiert sind, können sich diese nicht beziehungsweise nur gering gegenseitig beeinflussen.")
        ),
        "Provisionierung von Systemen" => array(
            "risk" => "Manuelles Aufsetzen von System-Umgebungen kann zu fehlerhaften Konfigurationen sowie zu diskrepanzen bei redundanten Systemen führen.",
            "measure" => "Mittels automatisierter Provisionierung werden System-Umgebungen aufgesetzt (Stichwort: Infrastructure as Code).",
            "easeOfImplementation" => array(
                "knowledge" => 3,
                "time" => 5,
                "resources" => 5
            ),
            "usefulness" => 4,
            "level" => 3,
            "securityProperties" => array("integrity" => "Da ein System 'versioniert' ist, können ungewollte Änderungen identifiziert werden.", "availability" => "Durch automatische Provisionierung kann ein System jeder Zeit in der selben Konfiguration auf einer Hardware erzeug werden."),
        ),
        "Produktionsnahe Umgebung steht Entwicklern zur Verfügung" => array(
            "risk" => "Erstellung produktionsnaher Umgebungen ist schwer. Tritt eine Schwachstelle nur in der Produktionsumgebung auf, ist es schwierig diese auf einer lokalen Entwicklungsumgebung nachzuvollziehen.",
            "measure" => "Durch Nutzung von einer virtuellen Umgebung und Ablage der Konfiguration im Quellcode, lässt sich eine Produktionsumgebung nachstellen.",
            "easeOfImplementation" => array(
                "knowledge" => 3,
                "time" => 3,
                "resources" => 3
            ),
            "usefulness" => 5,
            "level" => 2,
            "dependsOn" => array("Definierter Verteilungs-Prozess"),
            "securityProperties" => array("availability" => "Durch eine produktionsnahen Umgebung können Entwickler bereits während der Entwicklung Fehler erkennen und diese korrigieren, so reduziert das Risko durch eine Verteilung die Verfügbarkeit des System zu gefährden."),
        ),
        "Kontrollierte Netzwerke für virtuelle Umgebungen" => array(
            "risk" => "Virtuelle Umgebungen können auf Sockets anderer virtueller Umgebungen zugreifen, auch wenn dies nicht notwendig ist.",
            "measure" => "Die Kommunikation zwischen virtuellen Umgebungen ist reguliert.",
            "easeOfImplementation" => array(
                "knowledge" => 3,
                "time" => 3,
                "resources" => 3
            ),
            "usefulness" => 5,
            "level" => 3,
            "dependsOn" => array("Definierter Verteilungs-Prozess"),
            "securityProperties" => array(
                "availability" => "Regulierung verhindert die Beeinträchtigung der Verfügbarkeit von Diensten.",
                "confidentiality" => "Regulierung zwischen virtuellen Umgebungen verhindert nach einem erfolgreichen Angriff auf eine virtuelle Umgebung den Zugriff auf weitere nicht autorisierte Dienste in anderen virtuellen Umgebungen."
            ),
            "implementation" => "Eigene Netzwerke, Firewalls"
        ),
        "Produktions-Artifakte sind versioniert" => array(
            "risk" => "Ein vorheriges Produktionsartefakt lässt sich nicht wieder starten, wenn die Verteilung einer neuen Version nicht klappt.",
            "measure" => "Alle Produktions-Artifakte sind versioniert.",
            "easeOfImplementation" => array(
                "knowledge" => 3,
                "time" => 3,
                "resources" => 3
            ),
            "usefulness" => 5,
            "level" => 3,
            "dependsOn" => array("Definierter Verteilungs-Prozess"),
            "securityProperties" => array("integrity" => "Da ein System 'versioniert' ist, können ungewollte Änderungen identifiziert werden.", "availability" => "Durch Versionierung können alle Artifakte jeder Zeit in der selben Konfiguration auf einer Hardware erzeug werden."),
        ),
        "Betriebssystem-Aufrufe von Containern sind limitiert" => array(
            "risk" => "Eine Schwachstelle von Containern sind System-Aufrufe, welche nicht den Namespace beachten",
            "measure" => "Betriebssystem-Aufrufe von Anwendungen in virtuellen Umgebungen sind limitiert und auf einer Positivliste eingetragen",
            "easeOfImplementation" => array(
                "knowledge" => 3,
                "time" => 3,
                "resources" => 3
            ),
            "usefulness" => 5,
            "level" => 4,
            "dependsOn" => array("Anwendungen laufen in virtuellen Umgebungen"),
            "securityProperties" => array(
                "integrity" => "Durch eine Positiv-Liste kann die Modifizierung von Daten nach einem erfolgreichem Angriff eingeschränkt werden.",
                "authorization" => "Prozesse können nur definierte System-Aufrufe benutzen.",
                "confidentiality" => "Prozesse können nur definierte System-Aufrufe benutzen und entsprechend nur auf autorisierte Daten zugreifen."
            ),
            "implementation" => "seccomp, strace"
        ),
        "Prüfung von Quellen eingesetzter Software" => array(
            "risk" => "Genutzte Software wird ohne Prüfung der Quelle geladen und verwendet. Software kann dabei ein Paket des Betriebssystems, ein Abbild eines Betriebssystems, ein geladenes Plugin für einen Continuous Integration-Server oder eine Bibliothek in einer Anwendung sein.",
            "measure" => "Jede Software-Quelle ist manuell auf Vertraulichkeit geprüft.",
            "easeOfImplementation" => array(
                "knowledge" => 3,
                "time" => 3,
                "resources" => 1
            ),
            "usefulness" => 3,
            "level" => 2,
            "securityProperties" => array(
                "integrity" => "Durch Prüfung von Paket-Quellen ist sichergestellt, dass System-Pakete nur auf autorisierte Daten zugreifen.",
                "availability" => "Durch Prüfung von Paket-Quellen ist sichergestellt, dass System-Pakete nicht die Verfügbarkeit beeinträchtigen.",
                "confidentiality" => "Durch Prüfung von Paket-Quellen ist sichergestellt, dass System-Pakete nur auf autorisierte Daten zugreifen.",
            ),
        ),
        "Microservice-Architektur" => array(
            "risk" => "Komponenten sind komplex und schwer testbar.",
            "measure" => "Es ist eine Mikroservice-Architektur genutzt.",
            "easeOfImplementation" => array(
                "knowledge" => 4,
                "time" => 5,
                "resources" => 5
            ),
            "usefulness" => 3,
            "level" => 4,
            "securityProperties" => array(
                "integrity" => "Durch Reduktion der Komplexität und Erhöhung der Testbarkeit wird die Wahrscheinlichkeit von Schwachstellen reduziert.",
                "availability" => "Durch Reduktion der Komplexität und Erhöhung der Testbarkeit wird die Wahrscheinlichkeit von Schwachstellen reduziert.",
                "confidentiality" => "Durch Reduktion der Komplexität und Erhöhung der Testbarkeit wird die Wahrscheinlichkeit von Schwachstellen reduziert.",
            ),
        ),
        "Zufälliges herunterfahren von Systemen" => array(
            "risk" => "Durch manuelle Änderungen an Systemen sind diese nicht auswechselbar. Die Verfügbarkeit eines redundanten Systems kann beeinträchtigt werden.",
            "measure" => "Durch zufälliges Runterfahren von redundandten Systemen wird sichergestellt, dass alle Änderungen versioniert sind und die Systeme tatsächlich hochverfügbar sind.",
            "easeOfImplementation" => array(
                "knowledge" => 3,
                "time" => 5,
                "resources" => 5
            ),
            "usefulness" => 3,
            "level" => 4,
            "securityProperties" => array(
                "availability" => "Durch zufälliges Runterfahren von redundandten Systemen wird sichergestellt, dass alle Änderungen versioniert sind und die Systeme tatsächlich hochverfügbar sind.",
            ),
        ),
        "Rollen basierte Authentifizierung und Autorisierung" => array(
            "risk"                 => "Da jeder auf einem System jede Aktion ausführen darf, ist nicht prüfbar wer eine Aktion, wie die Änderung einer Konfiguration auf dem Erzeugungs- und Verteilungsserver, ausgeführt hat.",
            "measure"              => "Nutzung von Rollen-basierter Authentifizierung und Autorisierung, ggf. verbunden mit einem zentralem Authentifizierungs-Server.",
            "easeOfImplementation" => array(
                "knowledge" => 2,
                "time"      => 3,
                "resources" => 1
            ),
            "usefulness"           => 3,
            "level"                => 3,
            "implementation"       => "Verzeichnisdienst, Plugins",
            "securityProperties"   => array(
                "confidentiality" => "Vertrauliche Informationen über interne Systeme sind geschützt.",
                "integrity"       => "Nur autorisierte Personen/Systeme können z.B. eine Verteilung anstoßen. Dadurch wird eine versehentliche Verteilung eines Software-Artefakts mit Fehlern vermieden.",
            ),
            "dependsOn"            => array("Definierter Verteilungs-Prozess", "Definierter Erzeugungs-Prozess")
        ),
    )
);
