<?php
$dimensions["Test und Verifizierung"] = array(
    "Dynamische Tiefe" => array(
        "Dynamischer Spiderdurchlauf" => array(
            "risk" => "Teile der Anwendung, insbesondere welche mit vom Browser interpretierten dynamischen Inhalten wie JavaScript, sind beim Spidern mit einem Web-Security-Scanner nicht abgedeckt.",
            "measure" => "Nutzung eines Spiders welcher dynamische Inhalte ausführt.",
            "easeOfImplementation" => array(
                "knowledge" => 3,
                "time" => 3,
                "resources" => 1
            ),
            "usefulness" => 4,
            "level" => 1,
            "dependsOn" => array("Erweiterter Scan"),
            "securityProperties" => array(
                "availability" => "Durch Erkennung und Behebung von Schwachstellen bevor diese in Produktion gehen ist die Verfügbarkeit von Informationen im gesamten Systems erhöht.",
                "integrity" => "Durch Erkennung und Behebung von Schwachstellen bevor diese in Produktion gehen ist die Integrität von Informationen im gesamten Systems erhöht.",
                "confidentiality" => "Durch Erkennung und Behebung von Schwachstellen bevor diese in Produktion gehen ist die Vertraulichkeit von Informationen im gesamten Systems erhöht.",
            ),
        ),
        "Einfacher Scan" => array(
            "risk" => "Mangelhafte Sicherheitsprüfungen. Nach einer Verteilung können einfache Schwachstellen lange Zeit unerkannt in der Produktionsumgebung vorhanden sein.",
            "measure" => "Ein einfacher Scan wird mit einem Web-Security-Scanner regelmäßig durchgeführt. Sofern die Prüfung in angemessener Zeit erfolgt, während jeder Verteilung.",
            "easeOfImplementation" => array(
                "knowledge" => 2,
                "time" => 3,
                "resources" => 1
            ),
            "usefulness" => 2,
            "level" => 1,
            "dependsOn" => array("Definierter Erzeugungs-Prozess"),
            "securityProperties" => array(
                "availability" => "Durch Erkennung und Behebung von Schwachstellen bevor diese in Produktion gehen ist die Verfügbarkeit von Informationen im gesamten Systems erhöht.",
                "integrity" => "Durch Erkennung und Behebung von Schwachstellen bevor diese in Produktion gehen ist die Integrität von Informationen im gesamten Systems erhöht.",
                "confidentiality" => "Durch Erkennung und Behebung von Schwachstellen bevor diese in Produktion gehen ist die Vertraulichkeit von Informationen im gesamten Systems erhöht.",
            ),
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
            "dependsOn" => array("Einfacher Scan"),
            "securityProperties" => array(
                "availability" => "Durch Erkennung und Behebung von Schwachstellen bevor diese in Produktion gehen ist die Verfügbarkeit von Informationen im gesamten Systems erhöht.",
                "integrity" => "Durch Erkennung und Behebung von Schwachstellen bevor diese in Produktion gehen ist die Integrität von Informationen im gesamten Systems erhöht.",
                "confidentiality" => "Durch Erkennung und Behebung von Schwachstellen bevor diese in Produktion gehen ist die Vertraulichkeit von Informationen im gesamten Systems erhöht.",
            ),
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
            "dependsOn" => array("Einfacher Scan"),
            "securityProperties" => array(
                "availability" => "Durch Erkennung und Behebung von Schwachstellen bevor diese in Produktion gehen ist die Verfügbarkeit von Informationen im gesamten Systems erhöht.",
                "integrity" => "Durch Erkennung und Behebung von Schwachstellen bevor diese in Produktion gehen ist die Integrität von Informationen im gesamten Systems erhöht.",
                "confidentiality" => "Durch Erkennung und Behebung von Schwachstellen bevor diese in Produktion gehen ist die Vertraulichkeit von Informationen im gesamten Systems erhöht.",
            ),
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
            "dependsOn" => array("Erweiterter Scan"),
            "securityProperties" => array(
                "availability" => "Durch Erkennung und Behebung von Schwachstellen bevor diese in Produktion gehen ist die Verfügbarkeit von Informationen im gesamten Systems erhöht.",
                "integrity" => "Durch Erkennung und Behebung von Schwachstellen bevor diese in Produktion gehen ist die Integrität von Informationen im gesamten Systems erhöht.",
                "confidentiality" => "Durch Erkennung und Behebung von Schwachstellen bevor diese in Produktion gehen ist die Vertraulichkeit von Informationen im gesamten Systems erhöht.",
            ),
        ),
        "Definierte Eingabe-Vektoren" => array(
            "risk" => "Teile der Anwendung, insbesondere welche mit speziell formatierten oder kodierten Parametern (z.B. Suchmaschinenoptimierte Parameter in der URL oder Base64-Kodierte Parameter), werden beim Esrfassen bestehender Pfade mit einem Web-Security-Scanner nicht abgedeckt.",
            "measure" => "Spezielle Parameter und Kodierungen sind in eingesetzten Web-Security-Scannern definiert.",
            "easeOfImplementation" => array(
                "knowledge" => 5,
                "time" => 5,
                "resources" => 1
            ),
            "usefulness" => 4,
            "level" => 3,
            "securityProperties" => array(
                "availability" => "Durch Erkennung und Behebung von Schwachstellen bevor diese in Produktion gehen ist die Verfügbarkeit von Informationen im gesamten Systems erhöht.",
                "integrity" => "Durch Erkennung und Behebung von Schwachstellen bevor diese in Produktion gehen ist die Integrität von Informationen im gesamten Systems erhöht.",
                "confidentiality" => "Durch Erkennung und Behebung von Schwachstellen bevor diese in Produktion gehen ist die Vertraulichkeit von Informationen im gesamten Systems erhöht.",
            ),
            "dependsOn" => array("Erweiterter Scan"),
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
            "dependsOn" => array("Erweiterter Scan"),
            "securityProperties" => array(
                "availability" => "Durch Erkennung und Behebung von Schwachstellen bevor diese in Produktion gehen ist die Verfügbarkeit von Informationen im gesamten Systems erhöht.",
                "integrity" => "Durch Erkennung und Behebung von Schwachstellen bevor diese in Produktion gehen ist die Integrität von Informationen im gesamten Systems erhöht.",
                "confidentiality" => "Durch Erkennung und Behebung von Schwachstellen bevor diese in Produktion gehen ist die Vertraulichkeit von Informationen im gesamten Systems erhöht.",
            ),
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
            "dependsOn" => array("Definierter Erzeugungs-Prozess"),
            "securityProperties" => array(
                "confidentiality" => "Durch Erkennung von schwachen Hashalgorithmen bevor diese in Produktion gehen ist die Vertraulichkeit des gesamten Systems erhöht.",
            ),
        ),
    ),
    "Statische Tiefe" => array(
        "Auffinden von Komp. mit bekannten Schwachstellen" => array(
            "risk" => "Eingesetzte Bibliotheken können Fehler enthalten, so dass die Informationssicherheit beeinträchtigt wird. Die können auch erst nach Verteilung der Software bekannt werden [#bsiPatches].",
            "measure" => "Patchprüfungen für Frontend- und Backendkomponenten werden, wie vom BSI unter „Zeitnahes Einspielen von sicherheitsrelevanter Patches und Update“ [#bsiPatches] empfohlen, regelmäßig durchgeführt. Sofern die Prüfung in angemessener Zeit erfolgt, während jeder Verteilung.",
            "easeOfImplementation" => array(
                "knowledge" => 1,
                "time" => 1,
                "resources" => 1
            ),
            "usefulness" => 5,
            "level" => 1,
            "dependsOn" => array("Definierter Erzeugungs-Prozess"),
            "securityProperties" => array(
                "integrity" => "Durch Prüfung von Patches ist sichergestellt, dass Bibliotheken nur auf autorisierte Daten zugreifen.",
                "availability" => "Durch Prüfung von Patches ist sichergestellt, dass Bibliotheken nicht die Verfügbarkeit beeinträchtigen.",
                "confidentiality" => "Durch Prüfung von Patches ist sichergestellt, dass Bibliotheken nur auf autorisierte Daten zugreifen.",
            ),
        ),
        "Ausschluss von Quellcode-Dupliakten" => array(
            "risk" => "Quellcode-Dupliakte können die Stabilität beeinträchtigen.",
            "measure" => "Erkennung und Meldung von Duplikaten in Quellcode.",
            "easeOfImplementation" => array(
                "knowledge" => 1,
                "time" => 1,
                "resources" => 1
            ),
            "usefulness" => 1,
            "level" => 4,
            "implementation" => "scan.js, FindSecurityBugs",
            "dependsOn" => array("Definierter Erzeugungs-Prozess"),
            "securityProperties" => array(
                "availability" => "Durch Erkennung und Behebung von Schwachstellen bevor diese in Produktion gehen ist die Verfügbarkeit von Informationen im gesamten Systems erhöht.",
                "integrity" => "Durch Erkennung und Behebung von Schwachstellen bevor diese in Produktion gehen ist die Integrität von Informationen im gesamten Systems erhöht.",
                "confidentiality" => "Durch Erkennung und Behebung von Schwachstellen bevor diese in Produktion gehen ist die Vertraulichkeit von Informationen im gesamten Systems erhöht.",
            ),
        ),
        "Statische Analyse für wichtige serverseitige Bereiche" => array(
            "risk" => "Wichtige Teile der serverseitigen Webanwendung enthalten Schwachstellen in der Implementierung.",
            "measure" => "Es wird eine statische Analyse, in Form von String Matching Algorithmen und/oder Datenflussanalysen, für wichtige Teile der serverseitigen Webanwendung durchgeführt.",
            "easeOfImplementation" => array(
                "knowledge" => 2,
                "time" => 3,
                "resources" => 1
            ),
            "usefulness" => 4,
            "level" => 2,
            "implementation" => "eslint, FindSecurityBugs, jsprime",
            "dependsOn" => array("Definierter Erzeugungs-Prozess"),
            "securityProperties" => array(
                "availability" => "Durch Erkennung und Behebung von Schwachstellen bevor diese in Produktion gehen ist die Verfügbarkeit von Informationen im gesamten Systems erhöht.",
                "integrity" => "Durch Erkennung und Behebung von Schwachstellen bevor diese in Produktion gehen ist die Integrität von Informationen im gesamten Systems erhöht.",
                "confidentiality" => "Durch Erkennung und Behebung von Schwachstellen bevor diese in Produktion gehen ist die Vertraulichkeit von Informationen im gesamten Systems erhöht.",
            ),
        ),
        "Statische Analyse für wichtige klientenseitige Bereiche" => array(
            "risk" => "Wichtige Teile der klientenseitigen Webanwendung enthalten Schwachstellen in der Implementierung.",
            "measure" => "Es wird eine statische Analyse, in Form von String Matching Algorithmen und/oder Datenflussanalysen, für wichtige Teile der klientenseitigen Webanwendung durchgeführt.",
            "easeOfImplementation" => array(
                "knowledge" => 2,
                "time" => 3,
                "resources" => 1
            ),
            "usefulness" => 3,
            "level" => 3,
            "implementation" => "eslint, FindSecurityBugs, jsprime",
            "dependsOn" => array("Definierter Erzeugungs-Prozess"),
            "securityProperties" => array(
                "availability" => "Durch Erkennung und Behebung von Schwachstellen bevor diese in Produktion gehen ist die Verfügbarkeit von Informationen im gesamten Systems erhöht.",
                "integrity" => "Durch Erkennung und Behebung von Schwachstellen bevor diese in Produktion gehen ist die Integrität von Informationen im gesamten Systems erhöht.",
                "confidentiality" => "Durch Erkennung und Behebung von Schwachstellen bevor diese in Produktion gehen ist die Vertraulichkeit von Informationen im gesamten Systems erhöht.",
            ),
        ),
        "Statische Analyse für alle Bereiche" => array(
            "risk" => "Teile der Webanwendung enthalten Schwachstellen in der Implementierung.",
            "measure" => "Es wird eine statische Analyse, in Form von String Matching Algorithmen und/oder Datenflussanalysen, für alle Bereiche der serverseitigen und klientenseitigen Webanwendung durchgeführt. Externe Bibliotheken werden nicht geprüft.",
            "easeOfImplementation" => array(
                "knowledge" => 2,
                "time" => 3,
                "resources" => 2
            ),
            "usefulness" => 4,
            "level" => 4,
            "dependsOn" => array("Quellcode-Analyse für wichtige Teile der Anwendung"),
            "securityProperties" => array(
                "availability" => "Durch Erkennung und Behebung von Schwachstellen bevor diese in Produktion gehen ist die Verfügbarkeit von Informationen im gesamten Systems erhöht.",
                "integrity" => "Durch Erkennung und Behebung von Schwachstellen bevor diese in Produktion gehen ist die Integrität von Informationen im gesamten Systems erhöht.",
                "confidentiality" => "Durch Erkennung und Behebung von Schwachstellen bevor diese in Produktion gehen ist die Vertraulichkeit von Informationen im gesamten Systems erhöht.",
            ),
        ),
        "Statische Analyse für alle Bereiche" => array(
            "risk" => "Von der Webanwendung genutzt Bibliotheken enthalten unbekannte Schwachstellen in der Implementierung.",
            "measure" => "Es wird eine statische Analyse, in Form von String Matching Algorithmen und/oder Datenflussanalysen, für serverseitige und klientenseitige Bibliotheken durchgeführt.",
            "easeOfImplementation" => array(
                "knowledge" => 2,
                "time" => 4,
                "resources" => 2
            ),
            "usefulness" => 3,
            "level" => 4,
            "dependsOn" => array("Quellcode-Analyse für wichtige Teile der Anwendung"),
            "securityProperties" => array(
                "availability" => "Durch Erkennung und Behebung von Schwachstellen bevor diese in Produktion gehen ist die Verfügbarkeit von Informationen im gesamten Systems erhöht.",
                "integrity" => "Durch Erkennung und Behebung von Schwachstellen bevor diese in Produktion gehen ist die Integrität von Informationen im gesamten Systems erhöht.",
                "confidentiality" => "Durch Erkennung und Behebung von Schwachstellen bevor diese in Produktion gehen ist die Vertraulichkeit von Informationen im gesamten Systems erhöht.",
            ),
        ),
        "Stilanalyse" => array(
            "risk" => "Durch falsche Einrückung werden Schwachstellen eingeführt.",
            "measure" => "Durch Überprüfung von Programmkonventionen (Style Guides) ist sichergestellt, dass diese eingehalten werden",
            "easeOfImplementation" => array(
                "knowledge" => 1,
                "time" => 1,
                "resources" => 1
            ),
            "usefulness" => 1,
            "level" => 4,
            "dependsOn" => array("Quellcode-Analyse für wichtige Teile der Anwendung"),
            "securityProperties" => array(
                "availability" => "Durch Erkennung und Behebung von Schwachstellen bevor diese in Produktion gehen ist die Verfügbarkeit von Informationen im gesamten Systems erhöht.",
                "integrity" => "Durch Erkennung und Behebung von Schwachstellen bevor diese in Produktion gehen ist die Integrität von Informationen im gesamten Systems erhöht.",
                "confidentiality" => "Durch Erkennung und Behebung von Schwachstellen bevor diese in Produktion gehen ist die Vertraulichkeit von Informationen im gesamten Systems erhöht.",
            ),
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
            "level" => 3,
            "securityProperties" => array(
                "availability" => "Durch Erkennung und Behebung von Schwachstellen bevor diese in Produktion gehen ist die Verfügbarkeit von Informationen im gesamten Systems erhöht.",
                "integrity" => "Durch Erkennung und Behebung von Schwachstellen bevor diese in Produktion gehen ist die Integrität von Informationen im gesamten Systems erhöht.",
                "confidentiality" => "Durch Erkennung und Behebung von Schwachstellen bevor diese in Produktion gehen ist die Vertraulichkeit von Informationen im gesamten Systems erhöht.",
            ),
        ),
        "Prüfintensität ist hoch eingestellt" => array(
            "risk" => "Durch zu niedriger Scan-Intensität werden Schwachstellen nicht aufgedeckt.",
            "measure" => "Möglichst alle Schwachstellen werden periodisch mit hoher Prüf-Intensität geprüft (Risikoreich).",
            "easeOfImplementation" => array(
                "knowledge" => 3,
                "time" => 3,
                "resources" => 5
            ),
            "usefulness" => 3,
            "level" => 4,
            "securityProperties" => array(
                "availability" => "Durch Erkennung und Behebung von Schwachstellen bevor diese in Produktion gehen ist die Verfügbarkeit von Informationen im gesamten Systems erhöht.",
                "integrity" => "Durch Erkennung und Behebung von Schwachstellen bevor diese in Produktion gehen ist die Integrität von Informationen im gesamten Systems erhöht.",
                "confidentiality" => "Durch Erkennung und Behebung von Schwachstellen bevor diese in Produktion gehen ist die Vertraulichkeit von Informationen im gesamten Systems erhöht.",
            ),
        ),
    ),
    "Konsolidierung" => array(
        "Behandlung kritischer Alarme" => array(
            "risk" => "Mangelhafte Auswertung der erfolgten Sicherheitsprüfungen.",
            "measure" => "Akzeptanzkretieren für gefundene Schwachstellen sind definiert. Empfehlung ist hier nur als kritisch eingestufte Schwachstellen/Alarme zu behandeln. Entsprechend wird ein Build markiert oder gestoppt, wenn Schwachstellen mit einer Sicherheitseinstufung über der definierten Akzeptanz gefunden werden.",
            "easeOfImplementation" => array(
                "knowledge" => 1,
                "time" => 1,
                "resources" => 1
            ),
            "usefulness" => 4,
            "level" => 1,
            "securityProperties" => array(
                "availability" => "Durch Erkennung und Behebung von Schwachstellen bevor diese in Produktion gehen ist die Verfügbarkeit von Informationen im gesamten Systems erhöht.",
                "integrity" => "Durch Erkennung und Behebung von Schwachstellen bevor diese in Produktion gehen ist die Integrität von Informationen im gesamten Systems erhöht.",
                "confidentiality" => "Durch Erkennung und Behebung von Schwachstellen bevor diese in Produktion gehen ist die Vertraulichkeit von Informationen im gesamten Systems erhöht.",
            ),
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
            "implementation" => "",
        ),
        "Aggregation von Alarmen" => array(
            "risk" => "",
            "measure" => "Aggregation von Alarmen, dabei werden auch doppelte Alarme nach Möglichkeit zusammengeführt.",
            "easeOfImplementation" => array(
                "knowledge" => 3,
                "time" => 3,
                "resources" => 2
            ),
            "usefulness" => 2,
            "level" => 4,
        ),
        "Behandlung von mittelschweren Alarmen" => array(
            "risk" => "Mittelschwere Alarme werden nicht beachtet.",
            "measure" => "Akzeptanzkretieren für gefundene Schwachstellen sind definiert. Empfehlung ist mittelschwere Meldungen ebenfalls zu behandeln.",
            "easeOfImplementation" => array(
                "knowledge" => 2,
                "time" => 2,
                "resources" => 1
            ),
            "usefulness" => 3,
            "level" => 3,
            "comment" => "Falsch Positiv-Sortierung ist Zeitaufwendig.",
            "securityProperties" => array(
                "availability" => "Durch Erkennung und Behebung von Schwachstellen bevor diese in Produktion gehen ist die Verfügbarkeit von Informationen im gesamten Systems erhöht.",
                "integrity" => "Durch Erkennung und Behebung von Schwachstellen bevor diese in Produktion gehen ist die Integrität von Informationen im gesamten Systems erhöht.",
                "confidentiality" => "Durch Erkennung und Behebung von Schwachstellen bevor diese in Produktion gehen ist die Vertraulichkeit von Informationen im gesamten Systems erhöht.",
            ),
        ),
        "Behandlung von allen Alarmen" => array(
            "risk" => "Alarme mit Schwere 'Einfach' werden nicht beachtet.",
            "measure" => "Akzeptanzkretieren für gefundene Schwachstellen sind definiert. Empfehlung ist Meldungen mit der Schwere 'Einfach' ebenfalls zu behandeln.",
            "easeOfImplementation" => array(
                "knowledge" => 3,
                "time" => 2,
                "resources" => 1
            ),
            "usefulness" => 2,
            "level" => 4,
            "securityProperties" => array(
                "availability" => "Durch Erkennung und Behebung von Schwachstellen bevor diese in Produktion gehen ist die Verfügbarkeit von Informationen im gesamten Systems erhöht.",
                "integrity" => "Durch Erkennung und Behebung von Schwachstellen bevor diese in Produktion gehen ist die Integrität von Informationen im gesamten Systems erhöht.",
                "confidentiality" => "Durch Erkennung und Behebung von Schwachstellen bevor diese in Produktion gehen ist die Vertraulichkeit von Informationen im gesamten Systems erhöht.",
            ),
        ),
        "Reproduzierbare Alarme" => array(
            "risk" => "Alarme können von Entwicklern / System-Adminstratoren ggf. nur schwer nachvollzogen werden.",
            "measure" => "Alarme enthalten den Ablauf der Aktionen um die gemeldete Schwachstelle einfacher reproduzieren zu können.",
            "easeOfImplementation" => array(
                "knowledge" => 3,
                "time" => 2,
                "resources" => 2
            ),
            "usefulness" => 2,
            "level" => 4,
            "implementation" => "ZEST"
        ),
        "Kritikalität in Falsch-Positiv-Markierungen" => array(
            "risk" => "Nach Markierung einer Schwachstelle mit Schwere 'niedrig' in der Ignoranz-Liste beziehungsweise Falsch Positiv-Liste wird die Kritikalität, z.B. in der Common Vulnerabilities and Exposures List, auf 'hoch' gesetzt.",
            "measure" => "Die Schwere geht mit in die falsch positiv-Markierung mit ein. Insbesondere bei statischen Abhängigkeitstests.",
            "easeOfImplementation" => array(
                "knowledge" => 3,
                "time" => 2,
                "resources" => 2
            ),
            "usefulness" => 2,
            "level" => 4,
            "securityProperties" => array(
                "availability" => "Durch Erkennung und Behebung von Schwachstellen bevor diese in Produktion gehen ist die Verfügbarkeit von Informationen im gesamten Systems erhöht.",
                "integrity" => "Durch Erkennung und Behebung von Schwachstellen bevor diese in Produktion gehen ist die Integrität von Informationen im gesamten Systems erhöht.",
                "confidentiality" => "Durch Erkennung und Behebung von Schwachstellen bevor diese in Produktion gehen ist die Vertraulichkeit von Informationen im gesamten Systems erhöht.",
            ),
        ),
        "Alarme adressieren Teams" => array(
            "risk" => "Jedes Team muss jeden Alarm prüfen, so kann Frust entstehen.",
            "measure" => "Alarme werden Teams zugewiesen.",
            "easeOfImplementation" => array(
                "knowledge" => 2,
                "time" => 2,
                "resources" => 1
            ),
            "usefulness" => 2,
            "level" => 3,
            "implementation" => "Bei SAST: Frontend/Backend Teams können einfach erfasst werden. Bei Mikroservice-Architektur können einzelne Mikroservices i.d.R. Teams zugewiesen werden. Bei DAST: Schwahstellen sind klassifiziert und können Frontend/Backend/Server-Administration zugewiesen werden."
        ),
        "Alarme sind visualisiert" => array(
            "risk" => "Es ist unklar, wie viele Alarme im Monat entstehen.",
            "measure" => "Alarme werden als Metrik erfasst visualisiert.",
            "easeOfImplementation" => array(
                "knowledge" => 2,
                "time" => 2,
                "resources" => 1
            ),
            "usefulness" => 2,
            "level" => 4,
            "dependsOn" => array("Visualisierte Metriken")
        ),
    ),
    "Integrations- und Aktzeptanztests" => array(
        "Komponenten-Tests mit Sicherheitsprüfungen" => array(
            "risk" => "Schwachstellen sind in der Anwendung vorhanden.",
            "measure" => "Integration von sicherheitsrelevanten Komponenten-Tests für geschäftskritische Bereiche. Dadurch können Schwachstellen wie fehlende Authentifizierung erkannt werden.",
            "easeOfImplementation" => array(
                "knowledge" => 3,
                "time" => 2,
                "resources" => 2
            ),
            "usefulness" => 2,
            "level" => 1,
            "comment" => "Die Integration von Unit-Tests findet schon während der Entwicklung statt, es wird auf Schwachstellen in Sub-Routinen, Funktionen, Module, Bibliotheken usw. geprüft. Hier werden unterschiedliche Schwachstellen gefunden. Dabei muss beachtet werden, dass Negativ-Testen nicht trivial ist. Beispielsweise kann vergessen werden auf Schwachstellen, welche durch Metazeichen entstehen, zu prüfen. Es ist unwahrscheinlich dass der Tester hier zufällige Eingaben zum Prüfen erzeugt. [#bidgoli2006handbook, S. 894]",
            "implementation" => "Unit-Tests",
            "securityProperties" => array(
                "availability" => "Durch Erkennung und Behebung von Schwachstellen bevor diese in Produktion gehen ist die Verfügbarkeit von Informationen im gesamten Systems erhöht.",
                "integrity" => "Durch Erkennung und Behebung von Schwachstellen bevor diese in Produktion gehen ist die Integrität von Informationen im gesamten Systems erhöht.",
                "confidentiality" => "Durch Erkennung und Behebung von Schwachstellen bevor diese in Produktion gehen ist die Vertraulichkeit von Informationen im gesamten Systems erhöht.",
            ),
        ),
        "Akzeptanz- und Integrations-Tests mit Sicherheitsprüfungen" => array(
            "risk" => "In der Anwendung sind grundlegende Fehler bei der Benutzung eines Frameworks möglich, ohne das diese erkannt werden.",
            "measure" => "Implementierung grundlegender Sicherheitstests als Akzeptanz- und Integrations-Tests. Beispielsweise kann die Authentifizierung und Authorisierung (Zugriffskontrolle) geprüft werden.  [#bidgoli2006handbook, S. 894]",
            "easeOfImplementation" => array(
                "knowledge" => 3,
                "time" => 2,
                "resources" => 2
            ),
            "usefulness" => 2,
            "level" => 2,
            "securityProperties" => array(
                "availability" => "Durch Erkennung und Behebung von Schwachstellen bevor diese in Produktion gehen ist die Verfügbarkeit von Informationen im gesamten Systems erhöht.",
                "integrity" => "Durch Erkennung und Behebung von Schwachstellen bevor diese in Produktion gehen ist die Integrität von Informationen im gesamten Systems erhöht.",
                "confidentiality" => "Durch Erkennung und Behebung von Schwachstellen bevor diese in Produktion gehen ist die Vertraulichkeit von Informationen im gesamten Systems erhöht.",
            ),
        ),
        "Sehr hoch abdeckende Komponenten-, Integrations- und Akzeptanztests mit Sicherheitsprüfungen" => array(
            "risk" => "Es sind nicht alle Teile der Anwendung mit Sicherheitsprüfungen versehen.",
            "measure" => "Implementierung grundlegender Sicherheitstests als Integrations- und/oder Akzeptanztests für alle Teile (auch Bibliotheken) der Anwendung.",
            "easeOfImplementation" => array(
                "knowledge" => 5,
                "time" => 5,
                "resources" => 3
            ),
            "usefulness" => 5,
            "level" => 3,
            "securityProperties" => array(
                "availability" => "Durch Erkennung und Behebung von Schwachstellen bevor diese in Produktion gehen ist die Verfügbarkeit von Informationen im gesamten Systems erhöht.",
                "integrity" => "Durch Erkennung und Behebung von Schwachstellen bevor diese in Produktion gehen ist die Integrität von Informationen im gesamten Systems erhöht.",
                "confidentiality" => "Durch Erkennung und Behebung von Schwachstellen bevor diese in Produktion gehen ist die Vertraulichkeit von Informationen im gesamten Systems erhöht.",
            ),
        ),
        "Post-Verteilungs-Prüfung" => array(
            "risk" => "Durch eine Verteilung auf die Produktionsumgebung können Mikroservices gestört sein, z.B. wenn die Datenbank nicht erreicht werden kann.",
            "measure" => "Integrationstests prüfen die Produktionsumgebung um sicher zu stellen, dass Funktionen, z.B. bereitgestellt durch Mikroservices oder externe Dienste, erreichbar sind.",
            "easeOfImplementation" => array(
                "knowledge" => 2,
                "time" => 2,
                "resources" => 2
            ),
            "usefulness" => 2,
            "level" => 4,
            "implementation" => "",
            "dependsOn" => array("Definierter Verteilungs-Prozess"),
            "securityProperties" => array(
                "availability" => "Durch Erkennung und Behebung von Schwachstellen bevor diese in Produktion gehen ist die Verfügbarkeit von Informationen im gesamten Systems erhöht.",
                "integrity" => "Durch Erkennung und Behebung von Schwachstellen bevor diese in Produktion gehen ist die Integrität von Informationen im gesamten Systems erhöht.",
                "confidentiality" => "Durch Erkennung und Behebung von Schwachstellen bevor diese in Produktion gehen ist die Vertraulichkeit von Informationen im gesamten Systems erhöht.",
            ),
        ),
    ),
    "Infrastruktur" => array(
        "Prüfung von System-Updates" => array(
            "risk" => "Das Betriebssystem oder seine Dienste enthalten bekannte Schwachstellen.",
            "measure" => "Prüfung von Updates und bei veralteter Software Meldung an einen Verantwortlichen, welcher die Patches einspielt.",
            "easeOfImplementation" => array(
                "knowledge" => 1,
                "time" => 1,
                "resources" => 1
            ),
            "usefulness" => 5,
            "level" => 1,
            "securityProperties" => array(
                "integrity" => "Durch Prüfung und Einspielen von System-Updates ist die Wahrscheinlichkeit, dass System-Komponenten die Integrität von Informationen beeinträchtigen verringert.",
                "availability" => "Durch Prüfung und Einspielen von System-Updates ist die Wahrscheinlichkeit, dass System-Komponenten die Verfügbarkeit beeinträchtigen verringert.",
                "confidentiality" => "Durch Prüfung und Einspielen von System-Updates ist die Wahrscheinlichkeit, dass System-Komponenten vertrauliche Informationen preisgeben verringert.",
            ),
            "implementation" => "Nessus"
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
            "securityProperties" => array(
                "availability" => "Durch Erkennung und Behebung von Schwachstellen bevor diese in Produktion gehen ist die Verfügbarkeit von Informationen im gesamten Systems erhöht.",
                "integrity" => "Durch Erkennung und Behebung von Schwachstellen bevor diese in Produktion gehen ist die Integrität von Informationen im gesamten Systems erhöht.",
                "confidentiality" => "Durch Erkennung und Behebung von Schwachstellen bevor diese in Produktion gehen ist die Vertraulichkeit von Informationen im gesamten Systems erhöht.",
            ),
            "implementation" => "Docker Security Scan"
        ),
        "Erweiterte System-Prüfung" => array(
            "risk" => "Systeme wie Firewalls können nach einer Anpassung sicherheitskritisch konfiguriert sein.",
            "measure" => "Automatische Prüfung von Infrastruktur-Systemen wie Firewalls.",
            "easeOfImplementation" => array(
                "knowledge" => 2,
                "time" => 2,
                "resources" => 1
            ),
            "usefulness" => 5,
            "level" => 2,
            "securityProperties" => array(
                "availability" => "Durch Erkennung und Behebung von Schwachstellen bevor diese in Produktion gehen ist die Verfügbarkeit von Informationen im gesamten Systems erhöht.",
                "integrity" => "Durch Erkennung und Behebung von Schwachstellen bevor diese in Produktion gehen ist die Integrität von Informationen im gesamten Systems erhöht.",
                "confidentiality" => "Durch Erkennung und Behebung von Schwachstellen bevor diese in Produktion gehen ist die Vertraulichkeit von Informationen im gesamten Systems erhöht.",
            ),
            "implementation" => "Nessus"
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
            "securityProperties" => array(
                "availability" => "Durch Erkennung und Behebung von Flaschenhälsen ist die Verfügbarkeit von Informationen im gesamten Systems erhöht.",
            ),
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
            "securityProperties" => array(
                "availability" => "Durch Erkennung und Behebung von Flaschenhälsen ist die Verfügbarkeit von Informationen im gesamten Systems erhöht.",
            ),
        ),
        "Visualisierung von System-Updates" => array(
            "risk" => "Kritische System-Updates werden nach zu langer Zeit eingespielt.",
            "measure" => "Durch Visualisierung wird die Kritikalität von Systemupdates deutlich und deshalb schneller eingespielt.",
            "easeOfImplementation" => array(
                "knowledge" => 2,
                "time" => 1,
                "resources" => 1
            ),
            "usefulness" => 2,
            "level" => 5,
            "securityProperties" => array(
                "availability" => "Durch Erkennung und Behebung von Schwachstellen bevor diese in Produktion gehen ist die Verfügbarkeit von Informationen im gesamten Systems erhöht.",
                "integrity" => "Durch Erkennung und Behebung von Schwachstellen bevor diese in Produktion gehen ist die Integrität von Informationen im gesamten Systems erhöht.",
                "confidentiality" => "Durch Erkennung und Behebung von Schwachstellen bevor diese in Produktion gehen ist die Vertraulichkeit von Informationen im gesamten Systems erhöht.",
            ),
        ),
        "Prüfung auf schwache Passwörter" => array(
            "risk" => "Mitarbeiter oder Zugänge sind mit schwachen Passwörtern geschützt.",
            "measure" => "Automatische BruteForce-Angriffe auf Benutzer-Konten von Mitarbeitern sowie Standard-Konten wie 'administrator' [Automated Tools for Testing Computer System Vulnerability, Timothy Polk].",
            "easeOfImplementation" => array(
                "knowledge" => 2,
                "time" => 1,
                "resources" => 1
            ),
            "usefulness" => 1,
            "level" => 2,
            "securityProperties" => array(
                "availability" => "Durch Erkennung und Ändern von schwachen Passwörtern kann die Verfügbarkeit von Informationen im gesamten Systems erhöht werden.",
                "integrity" => "Durch Erkennung und Ändern von schwachen Passwörtern kann die Integrität von Informationen im gesamten Systems erhöht werden.",
                "confidentiality" => "Durch Erkennung und Ändern von schwachen Passwörtern kann die Vertraulichkeit von Informationen im gesamten Systems erhöht werden.",
            ),
        ),
    ),
);
