<?php
$dimensions["Test und Verifizierung"] = array(
    "Dynamische Tiefe" => array(
        "Dynamischer Spiderdurchlauf" => array(
            "risk" => "Teile der Anwendung, insbesondere welche mit vom Browser interpretierten dynamischen Inhalten wie JavaScript, sind beim Spidern mit einem Web-Security-Scanner nicht abgedeckt.",
            "measure" => "Nutzung eines Spiders welcher im Browser ausgeführt wird.",
            "easeOfImplementation" => array(
                "knowledge" => 3,
                "time" => 3,
                "resources" => 1
            ),
            "usefulness" => 4,
            "level" => 1,
            "dependsOn" => array("Erweiterter Scan")
        ),
        "Einfacher Scan" => array(
            "risk" => "Mangelhafte Sicherheitsprüfungen. Nach einem Deployment können einfache Schwachstellen lange Zeit unerkannt in der Produktionsumgebung vorhanden sein.",
            "measure" => "Ein einfacher Scan wird mit einem Web-Security-Scanner regelmäßig durchgeführt. Sofern die Prüfung in angemessener Zeit erfolgt, während jedem Deployment.",
            "easeOfImplementation" => array(
                "knowledge" => 2,
                "time" => 3,
                "resources" => 1
            ),
            "usefulness" => 2,
            "level" => 1,
            "dependsOn" => array("Definierter Erzeugungs-Prozess")
        ),
        "Erweiterter Scan" => array(
            "risk" => "Teile der Anwendung, insbesondere welche mit Authentifizierung, sind beim Spidern mit einem Web-Security-Scanner nicht abgedeckt.",
            "measure" => "Integration von Authentifizierung mit verschiedenen Rollen und Session Management",
            "easeOfImplementation" => array(
                "knowledge" => 3,
                "time" => 3,
                "resources" => 1
            ),
            "usefulness" => 2,
            "level" => 2,
            "dependsOn" => array("Einfacher Scan")
        ),
        "Backend-Komponenten via Proxy" => array(
            "risk" => "Backend-Kommunikation, wie bei der Nutzung von Mikroservices, ist ungeprüft.",
            "measure" => "Backend-Kommunikation ist aufgezeichnet und ist geprüft.",
            "easeOfImplementation" => array(
                "knowledge" => 4,
                "time" => 5,
                "resources" => 2
            ),
            "usefulness" => 3,
            "level" => 5,
            "dependsOn" => array("Einfacher Scan")
        ),
        "Sequenzieller Spiderdurchlauf" => array(
            "risk" => "Teile der Anwendung, insbesondere welche mit sequenzieller Aktionen wie Workflows, sind beim Spidern mit einem Web-Security-Scanner nicht abgedeckt.",
            "measure" => "Seqenzielle Aktionen werden durchgeführt, so dass der Scanner diese in der korrekten Reihenfolge prüft.",
            "easeOfImplementation" => array(
                "knowledge" => 3,
                "time" => 3,
                "resources" => 1
            ),
            "usefulness" => 5,
            "level" => 3,
            "dependsOn" => array("Erweiterter Scan")
        ),
        "Nutzung zusätzlicher Web-Security-Scanner" => array(
            "risk" => "Ein Web-Security-Scanner ist ggf. nicht optimiert für alle genutzten Technologien. Entsprechend können Schwachstellen unerkannt bleiben.",
            "measure" => "Es sind weitere spezielle Scanner eingesetzt.",
            "easeOfImplementation" => array(
                "knowledge" => 5,
                "time" => 3,
                "resources" => 5
            ),
            "usefulness" => 1,
            "level" => 4,
            "dependsOn" => array("Erweiterter Scan")
        ),
        "Eigenerstellte Skripte" => array(
            "risk" => "Web-Security-Scanner sind generisch und finden ggf. nicht alle Parameter, wie z.B. in Headern.",
            "measure" => "Spezielle Parameter und Kodierungen werden z.B. durch einen Proxy eingeschleust.",
            "easeOfImplementation" => array(
                "knowledge" => 5,
                "time" => 5,
                "resources" => 1
            ),
            "usefulness" => 4,
            "level" => 3,
            "dependsOn" => array("Erweiterter Scan")
        ),
        "Abdeckungsanalyse" => array(
            "risk" => "Teile der Anwendung sind beim Spidern mit einem Web-Security-Scanner nicht abgedeckt.",
            "measure" => "Prüfung mittels Abdeckungsanalyse-Werkzeuge welche Teile beim Spidern beziehungsweise bei der Nutzung von eigenen Werkzeugen nicht angesprochen werden um Justierung vornehmen zu können.",
            "easeOfImplementation" => array(
                "knowledge" => 4,
                "time" => 5,
                "resources" => 3
            ),
            "usefulness" => 4,
            "level" => 5,
            "implementation" => "OWASP Code Pulse",
            "dependsOn" => array("Erweiterter Scan")
        ),
    ),
    "Statische Tiefe" => array(
        "Abhängigkeitsprüfungen für Frontend und Backend" => array(
            "risk" => "Eingesetzte Bibliotheken können Fehler enthalten, so dass die Informationssicherheit beeinträchtigt wird. Die können auch erst nach Deployment der Software bekannt werden [#bsiPatches].",
            "measure" => "Abhängigkeitsprüfungen für Frontend- und Backendkomponenten werden, wie vom BSI unter „Zeitnahes Einspielen von sicherheitsrelevanter Patches und Update“ [#bsiPatches] empfohlen, regelmäßig durchgeführt. Sofern die Prüfung in angemessener Zeit erfolgt, während jedem Deployment.",
            "easeOfImplementation" => array(
                "knowledge" => 1,
                "time" => 1,
                "resources" => 1
            ),
            "usefulness" => 5,
            "level" => 1,
            "dependsOn" => array("Definierter Erzeugungs-Prozess")
        ),
        "Quellcode-Analyse für wichtige Teile der Anwendung" => array(
            "risk" => "Wichtige Teile der Software enthalten Schwachstellen in der Implementierung.",
            "measure" => "Es wird eine Quellcode-Analyse für wichtige Teile der Anwendung durchgeführt.",
            "easeOfImplementation" => array(
                "knowledge" => 2,
                "time" => 1,
                "resources" => 1
            ),
            "usefulness" => 3,
            "level" => 2,
            "implementation" => "scan.js, FindSecurityBugs",
            "dependsOn" => array("Definierter Erzeugungs-Prozess")
        ),
        "Datenbank-Hashprüfung" => array(
            "risk" => "Schwache Hashalgorithmen werden für Passwörter verwendet.",
            "measure" => "Schwache Hashalgorithmen für Spalten mit Namen wie 'passwort' in Datenbank-Feldern werden erkannt und gemeldet.",
            "easeOfImplementation" => array(
                "knowledge" => 1,
                "time" => 1,
                "resources" => 1
            ),
            "usefulness" => 1,
            "level" => 4,
            "implementation" => "",
            "dependsOn" => array("Definierter Erzeugungs-Prozess")
        ),
        "Quellcode-Analyse für alle Teile" => array(
            "risk" => "(Unwichtige) Teile der Software enthalten Schwachstellen in der Implementierung.",
            "measure" => "Es wird eine Quellcode-Analyse für alle Teile der Anwendung inklusive Bibliotheken durchgeführt.",
            "easeOfImplementation" => array(
                "knowledge" => 2,
                "time" => 3,
                "resources" => 2
            ),
            "usefulness" => 4,
            "level" => 3,
            "implementation" => "",
            "dependsOn" => array("Definierter Erzeugungs-Prozess")
        ),
    ),
    "Prüf-Intensität" => array(
        "Standardeinstellugen für Intensität" => array(
            "risk" => "Durch Zeitdruck und Wissensdefizite werden falsche Annahmen für die Intensität getroffen",
            "measure" => "Es ist die Standardeinstellugen für die Intensität von Werkzeugen genutzt.",
            "easeOfImplementation" => array(
                "knowledge" => 1,
                "time" => 1,
                "resources" => 1
            ),
            "usefulness" => 1,
            "level" => 1,
            "implementation" => ""
        ),
        "Deaktivierung unnötiger Prüfungen" => array(
            "risk" => "Prüfungen nehmen stark Resourcen in Anspruch.",
            "measure" => "Unnötige Prüfungen sind deaktiviert. Benutzt eine Webanwendung die Mongo-Datenbank, kann ggf. auf eine SQL-Injection-Prüfung verzichtet werden.",
            "easeOfImplementation" => array(
                "knowledge" => 2,
                "time" => 3,
                "resources" => 1
            ),
            "usefulness" => 1,
            "level" => 2
        ),
        "Angepasste Prüfintensität" => array(
            "risk" => "Scans führen zu viele oder zu wenig Scans für unterschiedliche Schwachstellen durch.",
            "measure" => "Die Prüfintensität ist angepasst.",
            "easeOfImplementation" => array(
                "knowledge" => 5,
                "time" => 5,
                "resources" => 1
            ),
            "usefulness" => 2,
            "level" => 3
        ),
        "Prüfintensität ist auf HOCH eingestellt" => array(
            "risk" => "Durch zu niedriger Scan-Intensität werden Schwachstellen nicht aufgedeckt.",
            "measure" => "Möglichst alle Schwachstellen werden periodisch mit hoher Prüf-Intensität geprüft (Risikoreich).",
            "easeOfImplementation" => array(
                "knowledge" => 3,
                "time" => 3,
                "resources" => 5
            ),
            "usefulness" => 3,
            "level" => 4,
            "implementation" => ""
        ),
        "Eingabe-Vektoren" => array(
            "risk" => "Teile der Anwendung, insbesondere welche mit speziell formatierten oder kodierten Parametern (z.B. Suchmaschinenoptimierte Parameter in der URL oder Base64-Kodierte Parameter), werden beim Spidern mit einem Web-Security-Scanner nicht abgedeckt.",
            "measure" => "Spezielle Parameter und Kodierungen sind in eingesetzten Web-Security-Scannern definiert.",
            "easeOfImplementation" => array(
                "knowledge" => 5,
                "time" => 5,
                "resources" => 1
            ),
            "usefulness" => 4,
            "level" => 3
        ),
    ),
    "Konsolidierung" => array(
        "Behandlung kritischer Meldungen" => array(
            "risk" => "Mangelhafte Auswertung der erfolgten Sicherheitsprüfungen.",
            "measure" => "Akzeptanzkretieren für gefundene Schwachstellen sind definiert. Empfehlung ist hier nur als kritisch eingestufte Schwachstellen/Meldungen zu behandeln. Entsprechend wird ein Build markiert oder gestoppt, wenn Schwachstellen mit einer Sicherheitseinstufung über der definierten Akzeptanz gefunden werden.",
            "easeOfImplementation" => array(
                "knowledge" => 1,
                "time" => 1,
                "resources" => 1
            ),
            "usefulness" => 4,
            "level" => 1,
            "implementation" => ""
        ),
        "Einfache Falsch-Positiv-Behandlung" => array(
            "risk" => "Aufgrund von mehrfach falsch positiv gemeldeten Schwachstellen werden neue Warnungen ignoriert.",
            "measure" => "Falsch positiv gemeldete Schwachstellen werden, auf Basis von Werkzeugen, markiert und bei der nächsten Prüfung nicht mehr gemeldet.",
            "easeOfImplementation" => array(
                "knowledge" => 1,
                "time" => 1,
                "resources" => 1
            ),
            "usefulness" => 4,
            "level" => 1,
            "implementation" => ""
        ),
        "Behandlung von mittelschwerern Meldungen" => array(
            "risk" => "Mittelschwere Meldungen werden nicht beachtet.",
            "measure" => "Akzeptanzkretieren für gefundene Schwachstellen sind definiert. Empfehlung ist mittelschwer Meldungen ebenfalls zu behandeln.",
            "easeOfImplementation" => array(
                "knowledge" => 2,
                "time" => 2,
                "resources" => 1
            ),
            "usefulness" => 3,
            "level" => 2,
            "comment" => "Falsch Positiv-Sortierung ist Zeitaufwendig."
        ),
        "Aggregation von Meldungen" => array(
            "risk" => "",
            "measure" => ".",
            "easeOfImplementation" => array(
                "knowledge" => 3,
                "time" => 3,
                "resources" => 2
            ),
            "usefulness" => 2,
            "level" => 2,
            "implementation" => ""
        ),
        "De-Duplikation von Meldungen" => array(
            "risk" => "",
            "measure" => ".",
            "easeOfImplementation" => array(
                "knowledge" => 1,
                "time" => 1,
                "resources" => 1
            ),
            "usefulness" => 4,
            "level" => 2,
            "implementation" => ""
        ),
        "Erweiterte Schwachstellen-Beschreibung" => array(
            "risk" => "Schwachstellen sind ggf. ungenügend beschrieben, so dass ein Entwickler nicht in der Lage ist, diese zu beseitigen.",
            "measure" => "Falsch positiv gemeldet Schwachstellen werden markiert und bei der nächsten Prüfung nicht mehr gemeldet.",
            "easeOfImplementation" => array(
                "knowledge" => 3,
                "time" => 2,
                "resources" => 1
            ),
            "usefulness" => 3,
            "level" => 3,
            "implementation" => ""
        ),
        "Erweiterte falsch Positiv-Behandlung" => array(
            "risk" => "Durch Werkzeugbasierte ",
            "measure" => "",
            "easeOfImplementation" => array(
                "knowledge" => 3,
                "time" => 2,
                "resources" => 2
            ),
            "usefulness" => 3,
            "level" => 4,
            "implementation" => ""
        ),
        "Behandlung von mittelschweren Meldungen" => array(
            "risk" => "Mittelschwere Meldungen werden nicht beachtet.",
            "measure" => "Akzeptanzkretieren für gefundene Schwachstellen sind definiert. Empfehlung ist mittelschwer Meldungen ebenfalls zu behandeln.",
            "easeOfImplementation" => array(
                "knowledge" => 2,
                "time" => 2,
                "resources" => 1
            ),
            "usefulness" => 3,
            "level" => 2,
            "comment" => "Falsch Positiv-Sortierung ist Zeitaufwendig."
        ),
        "Behandlung von allen Meldungen" => array(
            "risk" => "Meldungen mit Schwere 'Einfach' werden nicht beachtet.",
            "measure" => "Akzeptanzkretieren für gefundene Schwachstellen sind definiert. Empfehlung ist Meldungen mit der Schwere 'Einfach' ebenfalls zu behandeln.",
            "easeOfImplementation" => array(
                "knowledge" => 3,
                "time" => 2,
                "resources" => 1
            ),
            "usefulness" => 2,
            "level" => 4,
        ),
        "Reproduzierbare Meldungen" => array(
            "risk" => "Meldungen können von Entwicklern / System-Adminstratoren ggf. nur schwer nachvollzogen werden.",
            "measure" => "Meldungen enthalten den Ablauf der Aktionen um die gemeldete Schwachstelle einfacher erreichen zu können",
            "easeOfImplementation" => array(
                "knowledge" => 3,
                "time" => 2,
                "resources" => 2
            ),
            "usefulness" => 2,
            "level" => 4,
            "implementation" => "ZEST"
        ),
        "Einstufung in Falsch-Positiv-Markierungen" => array(
            "risk" => "Nach Markierung einer Schwachstelle mit Schwere 'niedrig' in der Ignoranz-Liste beziehungsweise Falsch Positiv-Liste wird die Kritikalität, z.B. in der Common Vulnerabilities and Exposures List, auf 'hoch' gesetzt.",
            "measure" => "Die Schwere geht mit in die falsch positiv-Markierung mit ein. Insbesondere bei statischen Abhängigkeitstests.",
            "easeOfImplementation" => array(
                "knowledge" => 3,
                "time" => 2,
                "resources" => 2
            ),
            "usefulness" => 2,
            "level" => 4,
            "implementation" => ""
        ),
    ),
    "Integrations- und Aktzeptanztests" => array(
        "Unit-Testing mit Sicherheitsprüfungen" => array(
            "risk" => "Schwachstellen sind in der Anwendung vorhanden.",
            "measure" => "Integration von manuellen sicherheitsrelevantem Unit-Testing für geschäftskritische Bereiche. Dadurch können Schwachstellen wie SQL-Injection, Buffer Overflows oder fehlende Authentifizierung erkannt werden.",
            "easeOfImplementation" => array(
                "knowledge" => 3,
                "time" => 2,
                "resources" => 2
            ),
            "usefulness" => 2,
            "level" => 1,
            "comment" => "Die Integration von Unit-Tests findet schon während der Entwicklung statt, es wird auf Schwachstellen in Sub-Routinen, Funktionen, Module, Bibliotheken usw. geprüft. Hier werden unterschiedliche Schwachstellen gefunden. Dabei muss beachtet werden, dass Negativ-Testen nicht trivial ist. Beispielsweise kann vergessen werden auf Schwachstellen, welche durch Metazeichen entstehen, zu prüfen. Es ist unwahrscheinlich dass der Tester hier zufällige Eingaben zum prüfen erzeugt. [#bidgoli2006handbook, S. 894]",
            "implementation" => ""
        ),
        "Integrations-Tests Sicherheitsprüfungen" => array(
            "risk" => "In der Anwendung sind grundlegende Fehler bei der Benutzung eines Frameworks möglich, ohne das diese erkannt werden.",
            "measure" => "Implementierung grundlegender Sicherheitstests als Integrations-Tests, welche manuell ausgeführt werden. Beispielsweise kann die Authentifizierung und Authorisierung (Zugriffskontrolle) geprüft werden.  [#bidgoli2006handbook, S. 894]",
            "easeOfImplementation" => array(
                "knowledge" => 3,
                "time" => 2,
                "resources" => 2
            ),
            "usefulness" => 2,
            "level" => 1,
            "implementation" => "",
        ),
        "Automation von Integrations- und Akzeptanztests mit Sicherheitsprüfungen" => array(
            "risk" => "Manuelle Ausführung von Sicherheitstest wird nicht häufig genug durchgeführt.",
            "measure" => "Integrations- und Akzeptanztests mit Sicherheitsprüfungen werden bei jedem Deployment ausgeführt.[#bidgoli2006handbook, S. 894]",
            "easeOfImplementation" => array(
                "knowledge" => 3,
                "time" => 3,
                "resources" => 3
            ),
            "usefulness" => 3,
            "level" => 2,
            "implementation" => ""
        ),

        "Sehr hoch abdeckende Integrations- und Akzeptanztests mit Sicherheitsprüfungen" => array(
            "risk" => "Es sind nicht alle Teile der Anwendung mit Sicherheitsprüfungen versehen.",
            "measure" => "Implementierung grundlegender Sicherheitstests als Integrations- und/oder Akzeptanztests für alle Teile (auch Bibliotheken), welche manuell ausgeführt werden.",
            "easeOfImplementation" => array(
                "knowledge" => 5,
                "time" => 5,
                "resources" => 3
            ),
            "usefulness" => 5,
            "level" => 4,
            "implementation" => ""
        ),
        "Post-Deployment-Prüfung" => array(
            "risk" => "Durch ein Deployment auf die Produktionsumgebung können Mikroservices gestört sein, z.B. wenn die Datenbank nicht erreicht werden kann.",
            "measure" => "Integrationstests prüfen die Produktionsumgebung um sicher zu stellen, dass Funktionen, z.B. bereitgestellt durch Mikroservices oder externe Dienste, erreichbar sind.",
            "easeOfImplementation" => array(
                "knowledge" => 2,
                "time" => 2,
                "resources" => 2
            ),
            "usefulness" => 2,
            "level" => 4,
            "implementation" => "",
            "dependsOn" => array("Definierter Deployment-Prozess")
        ),
    ),
    "Infrastruktur" => array(
        "Prüfung von System-Updates" => array(
            "risk" => "Das Betriebssystem oder seine Dienste enthalten bekannte Schwachstellen.",
            "measure" => "Prüfung von Updates und bei veralteter Software Meldung an einen Verantwortlichen.",
            "easeOfImplementation" => array(
                "knowledge" => 1,
                "time" => 1,
                "resources" => 1
            ),
            "usefulness" => 5,
            "level" => 1,
            "implementation" => ""
        ),
        "Prüfung der Konfiguration von virtuellen Umgebungen" => array(
            "risk" => "Virtuellen Umgebungen birgen die Gefahr sicherheitskritisch Konfiguriert zu sein.",
            "measure" => "Mit Hilfe von Werkzeugen wird die Konfiguration von virtuellen Umgebungen geprüft.",
            "easeOfImplementation" => array(
                "knowledge" => 2,
                "time" => 2,
                "resources" => 1
            ),
            "usefulness" => 4,
            "level" => 2,
            "implementation" => ""
        ),
        "Erweiterte System-Prüfung" => array(
            "risk" => "Systeme wie Firewalls können nach einer Anpassung sicherheitskritisch konfiguriert sein.",
            "measure" => "Prüfung von Systemen wie Firewalls.",
            "easeOfImplementation" => array(
                "knowledge" => 2,
                "time" => 2,
                "resources" => 1
            ),
            "usefulness" => 5,
            "level" => 2,
            "implementation" => ""
        ),
        "Infrastruktur-Last-Tests" => array(
            "risk" => "Es ist unbekannt wie viele Anfragen das System bedienen kann und wie sich das System bei vielen Anfragen verhält.",
            "measure" => "Last-Tests werden periodisch ausgeführt.",
            "easeOfImplementation" => array(
                "knowledge" => 3,
                "time" => 2,
                "resources" => 5
            ),
            "usefulness" => 3,
            "level" => 5,
            "implementation" => ""
        ),
        "Anwendungs-Last-Tests" => array(
            "risk" => "Es ist unbekannt wie viele Benutzer das System bedienen kann und wie sich das System bei vielen Benutzer verhält.",
            "measure" => "Benutzer-Last-Tests werden periodisch ausgeführt.",
            "easeOfImplementation" => array(
                "knowledge" => 4,
                "time" => 3,
                "resources" => 5
            ),
            "usefulness" => 3,
            "level" => 5,
            "implementation" => ""
        ),
        "Visualisierung von System-Updates" => array(
            "risk" => "Kritische System-Updates werden nach zu langer Zeit eingespielt.",
            "measure" => "Durch Visualisierung wird die Kritikalität von Systemupdates deudlich.",
            "easeOfImplementation" => array(
                "knowledge" => 2,
                "time" => 1,
                "resources" => 1
            ),
            "usefulness" => 2,
            "level" => 5,
            "implementation" => ""
        )
    ),
);


