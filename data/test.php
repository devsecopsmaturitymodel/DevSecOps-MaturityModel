<?php
$dimensions [gettext("Test and Verification")] = array(
    gettext("Dynamic depth") => array(
        gettext("Simple Scan") => array(
            "risk" => gettext("Deficient security tests are performed. Simple vulnerabilities are not detected and missing security configurations (e.g. headers) are not set. Fast feedback is not given."), //" Mangelhafte Sicherheitsprüfungen. Nach einer Verteilung können einfache Schwachstellen lange Zeit unerkannt in der Produktionsumgebung vorhanden sein.",
            "measure" => gettext("A simple scan is performed to get a security baseline. In case the test is done in under 10 minutes, it should be part of the build and deployment process."), //" Ein Simple Scan wird mit einem Web-Security-Scanner regelmäßig durchgeführt. Sofern die Prüfung in angemessener Zeit erfolgt, während jeder Verteilung.",
            "hardnessOfImplementation" => array(
                "knowledge" => 2,
                "time" => 3,
                "resources" => 1
            ),
            "usefulness" => 2,
            "level" => 1,
            "dependsOn" => array(
                gettext("Defined build process")
            ),
            "samm" => "ST2",
            "implementation" => array(
                "OWASP Zap",
                "Arachni"
            )
        ),
        gettext("Usage of different roles") => array(
            "risk" => gettext("Parts of the service are not covered during the scan, because a login is not performed."), //" Teile der Anwendung, insbesondere welche mit Authentifizierung, sind beim Spidern mit einem Web-Security-Scanner nicht abgedeckt.",
            "measure" => gettext("Integration of authentication with all roles used in the service."), //" Integration von Authentifizierung mit verschiedenen Rollen und Session Management",
            "hardnessOfImplementation" => array(
                "knowledge" => 3,
                "time" => 3,
                "resources" => 1
            ),
            "usefulness" => 2,
            "level" => 2,
            "dependsOn" => array(
                "Simple Scan"
            ),
        ),
        gettext("Coverage of client side dynamic components") => array(
            "risk" => gettext("Parts of the service are not covered during the scan, because JavaScript is not getting executed. Therefore, the co"), //" Teile der Anwendung, insbesondere welche mit vom Browser interpretierten dynamischen Inhalten wie JavaScript, sind beim Spidern mit einem Web-Security-Scanner nicht abgedeckt.",
            "measure" => gettext("Usage of a spider which executes dynamic content like JavaScript, e.g. via Selenium."), //" Nutzung eines Spiders welcher dynamische Inhalte ausführt.",
            "hardnessOfImplementation" => array(
                "knowledge" => 3,
                "time" => 3,
                "resources" => 1
            ),
            "usefulness" => 4,
            "level" => 2,
            "dependsOn" => array(
                "Usage of different roles"
            ),
            "samm" => "ST-2",
            "implementation" => "Ajax Spider"
        ),

        gettext("Coverage of service to service communication") => array(
            "risk" => gettext("Service to service communication is not covered."), //" Serverseitige Kommunikation, wie bei der Nutzung von Microservices, ist ungeprüft.",
            "measure" => gettext("Service to service communication is dumped and checked."), //" Backend-Kommunikation ist aufgezeichnet und ist geprüft.",
            "hardnessOfImplementation" => array(
                "knowledge" => 4,
                "time" => 5,
                "resources" => 2
            ),
            "usefulness" => 3,
            "level" => 4,
            "dependsOn" => array(
                "Simple Scan"
            ),
        ),
        gettext("Coverage of sequential operations") => array(
            "risk" => gettext("Sequential operations like workflows (e.g. login -> put products in the basked"), //" Sequenziellen Aktionen wie Workflows sind beim Spidern mit einem Web-Security-Scanner nicht abgedeckt.",
            "measure" => gettext("Sequential operations are defined and checked by the vulnerability scanner in the defined order."), //" Seqenzielle Aktionen werden definiert, so dass der Scanner diese in der korrekten Reihenfolge prüft.",
            "hardnessOfImplementation" => array(
                "knowledge" => 3,
                "time" => 3,
                "resources" => 1
            ),
            "usefulness" => 5,
            "level" => 3,
            "implementation" => "cURL",
            "dependsOn" => array(
                "Usage of different roles"
            )
        ),
        gettext("Coverage of hidden endpoints") => array(
            "risk" => gettext("Hidden endpoints of the service are not getting tracked."), //" Versteckte Pfade, wie beispielsweise APIs werden nicht abgedeckt.",
            "measure" => gettext("Hidden endpoints are getting detected and included in the vulnerability scan."), //" Versteckte Pfade werden abgedeckt.",
            "hardnessOfImplementation" => array(
                "knowledge" => 3,
                "time" => 2,
                "resources" => 1
            ),
            "usefulness" => 5,
            "level" => 3,
            "implementation" => "cURL, OpenAPI",
            "dependsOn" => array(
                "Usage of different roles"
            )
        ),
        gettext("Usage of multiple scanners") => array(
            "risk" => gettext("Each vulnerability scanner has different opportunities. By using just one scanner, some vulnerabilities might not be found."), //" Ein Web-Security-Scanner ist ggf. nicht optimiert für alle genutzten Technologien. Entsprechend können Schwachstellen unerkannt bleiben.",
            "measure" => gettext("Usage of multiple spiders and scanner enhance the coverage and the vulnerabilities."), //" Es sind weitere spezielle Scanner eingesetzt.",
            "hardnessOfImplementation" => array(
                "knowledge" => 3,
                "time" => 3,
                "resources" => 5
            ),
            "usefulness" => 1,
            "level" => 3,
            "dependsOn" => array(
                "Usage of different roles"
            ),
            "implementation" => "SecureCodeBox"
        ),
        gettext("Coverage of more input vectors") => array(
            "risk" => gettext("Parts of the service are not covered. For example specially formatted or coded parameters are not getting detected as parameter (e.g. parameters in REST-like URLs, parameters in JSON-Format or base64-coded parameters)."), //" Teile der Anwendung, insbesondere welche mit speziell formatierten oder kodierten Parametern (z.B. Suchmaschinenoptimierte Parameter in der URL, Kommunikation via WebSockets, Parameter in JSON oder Base64-Kodierte Parameter), werden beim Erfassen bestehender Pfade mit einem Web-Security-Scanner nicht abgedeckt.",
            "measure" => gettext("Special parameter and special encodings are defined, so that they get fuzzed by the used vulnerability scanners."), //" Spezielle Parameter und Kodierungen sind in eingesetzten Web-Security-Scannern definiert.",
            "hardnessOfImplementation" => array(
                "knowledge" => 5,
                "time" => 5,
                "resources" => 1
            ),
            "usefulness" => 4,
            "level" => 3,
            "dependsOn" => array(
                "Usage of different roles"
            )
        ),
        gettext("Coverage analysis") => array(
            "risk" => gettext("Parts of the service are not still covered."), //" Teile der Anwendung sind beim Spidern mit einem Web-Security-Scanner nicht abgedeckt.",
            "measure" => gettext("Check that there are no missing paths in the application with coverage-tools."), //" Prüfung mittels Abdeckungsanalyse-Werkzeuge welche Teile beim Spidern beziehungsweise bei der Nutzung von eigenen Werkzeugen nicht angesprochen werden um Justierung vornehmen zu können.",
            "hardnessOfImplementation" => array(
                "knowledge" => 4,
                "time" => 5,
                "resources" => 3
            ),
            "usefulness" => 4,
            "level" => 4,
            "implementation" => "OWASP Code Pulse",
        )
    ),
    gettext("Static depth") => array(
        gettext("Test of middleware components with known vulnerabilities") => array(
            "risk" => gettext("Components of the middleware might have vulnerabilities."), //" Eingesetzte serverseitige Komponten können Fehler enthalten, so dass die Informationssicherheit beeinträchtigt wird. Diese können u.a. erst nach Verteilung der Webanwendung bekannt werden.",
            "measure" => gettext("Tests for known vulnerabilities in components of the middleware are performed."), //" Tests auf serverseitige Komponenten mit bekannten Schwachstellen werden regelmäßig durchgeführt, beispielsweise jede Nacht.",
            "hardnessOfImplementation" => array(
                "knowledge" => 1,
                "time" => 2,
                "resources" => 1
            ),
            "usefulness" => 5,
            "level" => 1,
            "dependsOn" => array(
                gettext("Defined build process")
            ),
            "implementation" => "OWASP Dependency Check",
            "samm" => "SA"
        ),
        gettext("Test of client side components with known vulnerabilities") => array(
            "risk" => gettext("Client side components might have vulnerabilities."), //" Eingesetzte klientenseitige Komponten können Fehler enthalten, so dass die Informationssicherheit beeinträchtigt wird. Diese können u.a. erst nach Verteilung der Webanwendung bekannt werden.",
            "measure" => gettext("Tests for known vulnerabilities in components of the frontend are performed."), //" Tests auf klientenseitige  Komponenten mit bekannten Schwachstellen werden regelmäßig durchgeführt, beispielsweise jede Nacht.",
            "hardnessOfImplementation" => array(
                "knowledge" => 1,
                "time" => 2,
                "resources" => 1
            ),
            "usefulness" => 2,
            "level" => 3,
            "dependsOn" => array(
                gettext("Defined build process")
            ),
            "implementation" => "retirejs"
        ),
        gettext("Exclusion of source code duplicates") => array(
            "risk" => gettext("Duplicates in source code might influence the stability of the application."), //" Quellcode-Dupliakte können die Stabilität beeinträchtigen.",
            "measure" => gettext("Automatic Detection and manual removal of duplicates in source code."), //" Erkennung und Meldung von Duplikaten in Quellcode.",
            "hardnessOfImplementation" => array(
                "knowledge" => 1,
                "time" => 1,
                "resources" => 1
            ),
            "usefulness" => 1,
            "level" => 4,
            "implementation" => "PMD",
            "dependsOn" => array(
                gettext("Defined build process")
            ),
        ),
        gettext("Static analysis for important server side components") => array(
            "risk" => gettext("Important parts in the source code of the middleware have vulnerabilities."), //" Wichtige Teile der serverseitigen Webanwendung enthalten Schwachstellen in der Implementierung.",
            "measure" => gettext("Usage of static analysis tools for important parts of the middleware are used. Static analysis uses for example string matching algorithms and/or dataflowanalysis."), //" Es wird eine statische Analyse, in Form von String Matching Algorithmen und/oder Datenflussanalysen, für wichtige Teile der serverseitigen Webanwendung durchgeführt. Die statische(n) Analyse(n) wird automatisiert durchgeführt und nach Möglichkeit in die Entwicklungsumgebung integriert.",
            "hardnessOfImplementation" => array(
                "knowledge" => 2,
                "time" => 2,
                "resources" => 1
            ),
            "usefulness" => 4,
            "level" => 2,
            "implementation" => "eslint, FindSecurityBugs, jsprime",
            "dependsOn" => array(
                gettext("Defined build process")
            ),
        ),
        gettext("Static analysis for important client side components") => array(
            "risk" => gettext("Important parts in the source code of the frontend have vulnerabilities."), //" Wichtige Teile der klientenseitigen Webanwendung enthalten Schwachstellen in der Implementierung.",
            "measure" => gettext("Usage of static analysis tools for important parts of the frontend are used. Static analysis uses for example string matching algorithms and/or dataflowanalysis."), //" Es wird eine statische Analyse, in Form von String Matching Algorithmen und/oder Datenflussanalysen, für wichtige Teile der klientenseitigen Webanwendung durchgeführt.",
            "hardnessOfImplementation" => array(
                "knowledge" => 2,
                "time" => 2,
                "resources" => 1
            ),
            "usefulness" => 3,
            "level" => 3,
            "implementation" => array("eslint", "FindSecurityBugs", "jsprime", "<a href='https://github.com/ing-bank/bdd-mobile-security-automation-framework'>bdd-mobile-security-automation-framework</a>"),
            "dependsOn" => array(
                gettext("Defined build process")
            ),
        ),
        gettext("Static analysis for all self written components") => array(
            "risk" => gettext("Parts in the source code of the frontend or middleware have vulnerabilities."), //" Teile der Webanwendung enthalten Schwachstellen in der Implementierung.",
            "measure" => gettext("Usage of static analysis tools for all parts of the middleware and frontend. Static analysis uses for example string matching algorithms and/or dataflowanalysis."), //" Es wird eine statische Analyse, in Form von String Matching Algorithmen und/oder Datenflussanalysen, für alle Bereiche der serverseitigen und klientenseitigen Webanwendung durchgeführt. Externe Bibliotheken werden nicht geprüft.",
            "hardnessOfImplementation" => array(
                "knowledge" => 2,
                "time" => 2,
                "resources" => 1
            ),
            "usefulness" => 4,
            "level" => 4,
            "implementation" => "eslint, FindSecurityBugs, jsprime",
            "dependsOn" => array(
                "Statische Analyse für wichtige klientenseitige Bereiche",
                "Statische Analyse für wichtige serverseitige Bereiche"
            ),
        ),
        gettext("Static analysis for all components/libraries") => array(
            "risk" => gettext("Used components like libraries and legacy applications might have vulnerabilities"), //" Von der Webanwendung genutzt Bibliotheken enthalten unbekannte Schwachstellen in der Implementierung.",
            "measure" => gettext("Usage of a static analysis for all used components."), //" Es wird eine statische Analyse, in Form von String Matching Algorithmen und/oder Datenflussanalysen, für serverseitige und klientenseitige Bibliotheken durchgeführt.",
            "hardnessOfImplementation" => array(
                "knowledge" => 2,
                "time" => 4,
                "resources" => 2
            ),
            "usefulness" => 3,
            "level" => 4,
            "dependsOn" => array(
                "Statische Analyse für wichtige klientenseitige Bereiche",
                "Statische Analyse für wichtige serverseitige Bereiche"
            ),
            "securityProperties" => array(
                "availability" => gettext(""), //" Durch Erkennung und Behebung von Schwachstellen bevor diese in Produktion gehen ist die Verfügbarkeit von Informationen im gesamten Systems erhöht.",
                "integrity" => gettext(""), //" Durch Erkennung und Behebung von Schwachstellen bevor diese in Produktion gehen ist die Integrität von Informationen im gesamten Systems erhöht.",
                "confidentiality" => gettext(""), //" Durch Erkennung und Behebung von Schwachstellen bevor diese in Produktion gehen ist die Vertraulichkeit von Informationen im gesamten Systems erhöht."
            )
        ),
        gettext("Stylistic analysis") => array(
            "risk" => gettext("False source code indenting might lead to vulnerabilites."), //" Durch falsche Einrückung werden Schwachstellen eingeführt.",
            "measure" => gettext("Analysis of compliance to style guides of the source code ensures that source code indenting rules are met."), //" Durch Überprüfung von Programmkonventionen (Style Guides) ist sichergestellt, dass diese eingehalten werden.",
            "hardnessOfImplementation" => array(
                "knowledge" => 1,
                "time" => 1,
                "resources" => 1
            ),
            "usefulness" => 1,
            "level" => 4,
            "implementation" => "PMD",
        )
    ),
    gettext("Test-Intensity") => array(
        gettext("Default settings for intensity") => array(
            "risk" => gettext("Time pressure and ignorance might lead to false predictions for the test intensity."), //" Durch Zeitdruck und Unwissenheit werden falsche Annahmen für die Intensität getroffen.",
            "measure" => gettext("The intensitiy of the used tools are not modified to safe time."), //" Es ist die Standardeinstellungen für die Intensität von Werkzeugen genutzt.",
            "hardnessOfImplementation" => array(
                "knowledge" => 1,
                "time" => 1,
                "resources" => 1
            ),
            "usefulness" => 1,
            "level" => 1
        ),
        gettext("Deactivating of unneeded tests") => array(
            "risk" => gettext("As tools cover a wide range of different vulnerability tests, they might not match the used compoents. Therefore, they need more time and resources as they need and the feedback loops takes too much time."), //" Prüfungen nehmen stark Ressourcen in Anspruch.",
            "measure" => gettext("Unneeded tests are deactivated. For example in case the service is using a mongo database and no mysql database, the dynamic scan doesn't need to test for sql injections."), //" Unnötige Prüfungen sind deaktiviert. Benutzt eine Webanwendung die Mongo-Datenbank, kann ggf. auf eine SQL-Injection-Prüfung verzichtet werden.",
            "hardnessOfImplementation" => array(
                "knowledge" => 2,
                "time" => 3,
                "resources" => 1
            ),
            "usefulness" => 1,
            "level" => 2
        ),
        gettext("Creation and application of a testing concept") => array(
            "risk" => gettext("Scans might use a too small or too high test intensity."), //" Scans führen zu viele oder zu wenig Scans für unterschiedliche Schwachstellen durch.",
            "measure" => gettext("A testing concept considering the amount of time per scan/intensity is created and applied. A dynamic analysis needs more time than a static analysis. The dynamic scan, depending on the test intensity might be performed on every commit, every night, every week or once in a month."), //" Die Test-Intensität ist angepasst.",
            "hardnessOfImplementation" => array(
                "knowledge" => 3,
                "time" => 3,
                "resources" => 3
            ),
            "usefulness" => 2,
            "level" => 3,
            "securityProperties" => array(
                "availability" => gettext(""), //" Durch Erkennung und Behebung von Schwachstellen bevor diese in Produktion gehen ist die Verfügbarkeit von Informationen im gesamten Systems erhöht.",
                "integrity" => gettext(""), //" Durch Erkennung und Behebung von Schwachstellen bevor diese in Produktion gehen ist die Integrität von Informationen im gesamten Systems erhöht.",
                "confidentiality" => gettext(""), //" Durch Erkennung und Behebung von Schwachstellen bevor diese in Produktion gehen ist die Vertraulichkeit von Informationen im gesamten Systems erhöht."
            )
        ),
        gettext("High test intensity") => array(
            "risk" => gettext("A too small intensity or a too high confidence might lead to not visible vulnerabilities."), //" Durch zu niedriger Scan-Intensität werden Schwachstellen nicht aufgedeckt.",
            "measure" => gettext("A deep scan with high test intensity and a low confidence threshold is performed."), //" Möglichst alle Schwachstellen-Tests werden periodisch mit hoher Test-Intensität durchgeführt.",
            "hardnessOfImplementation" => array(
                "knowledge" => 3,
                "time" => 3,
                "resources" => 5
            ),
            "usefulness" => 3,
            "level" => 4,
            "securityProperties" => array(
                "availability" => gettext(""), //" Durch Erkennung und Behebung von Schwachstellen bevor diese in Produktion gehen ist die Verfügbarkeit von Informationen im gesamten Systems erhöht.",
                "integrity" => gettext(""), //" Durch Erkennung und Behebung von Schwachstellen bevor diese in Produktion gehen ist die Integrität von Informationen im gesamten Systems erhöht.",
                "confidentiality" => gettext(""), //" Durch Erkennung und Behebung von Schwachstellen bevor diese in Produktion gehen ist die Vertraulichkeit von Informationen im gesamten Systems erhöht."
            )
        )
    ),
    gettext("Consolidation") => array(
        gettext("Definition of quality gates") => array(
            "risk" => gettext("Improper examination of vulnerabilities leads to no visibility at all."), //" Mangelhafte Auswertung der erfolgten Sicherheitsprüfungen.",
            "measure" => gettext("Quality gates for found vulnerabilities are defined. In the start it is important to not overload the security analyst, therefore the recommendation is to start with alerting of high cirital vulnerabilities."), //" Akzeptanzkretieren für gefundene Schwachstellen sind definiert. Empfehlung ist hier nur als kritisch eingestufte Schwachstellen/Alarme zu behandeln. Sofern die genutzten Werkzeuge es anbieten, kann auch das Vertrauen (Englisch Confidence) mit zur Einstufung herangezogen werden. Entsprechend wird die Erzeugung markiert oder gestoppt, wenn Schwachstellen mit einer Sicherheitseinstufung über der definierten Akzeptanz gefunden werden.",
            "hardnessOfImplementation" => array(
                "knowledge" => 1,
                "time" => 1,
                "resources" => 1
            ),
            "usefulness" => 4,
            "level" => 1,
            "securityProperties" => array(
                "availability" => gettext(""), //" Durch Erkennung und Behebung von Schwachstellen bevor diese in Produktion gehen ist die Verfügbarkeit von Informationen im gesamten Systems erhöht.",
                "integrity" => gettext(""), //" Durch Erkennung und Behebung von Schwachstellen bevor diese in Produktion gehen ist die Integrität von Informationen im gesamten Systems erhöht.",
                "confidentiality" => gettext(""), //" Durch Erkennung und Behebung von Schwachstellen bevor diese in Produktion gehen ist die Vertraulichkeit von Informationen im gesamten Systems erhöht."
            ),
            "samm" => "IR2-A"
        ),
        gettext("Simple false positive treatment") => array(
            "risk" => gettext("As false positive occure during each test, all vulnerabilities might be ignored."), //" Aufgrund von mehrfach falsch positiv gemeldeten Schwachstellen werden neue Warnungen ignoriert.",
            "measure" => gettext("False positives are suppressed so they will not show up on the next tests again."), //" Falsch positiv gemeldete Schwachstellen werden, auf Basis von Werkzeugen, markiert und bei der nächsten Prüfung nicht mehr gemeldet.",
            "hardnessOfImplementation" => array(
                "knowledge" => 1,
                "time" => 1,
                "resources" => 1
            ),
            "usefulness" => 4,
            "level" => 1,
            "implementation" => "Most security tools have the possibility to suppress false positives.",
            "samm" => "IR2-A"
        ),
        gettext("Usage of a vulnerability management system") => array(
            "risk" => gettext("Maintenance of false positives in each tool enforces a high workload. In addition a correlation of the same finding from different tools is not possible."), //" Die Wartung von Alarmen und falsch Positiven in unterschiedlichen Werkzeugen und Definitionen erhöht den Aufwand stark.",
            "measure" => gettext("Aggregation of vulnerabilities in one tool reduce the workload to mark false positives."), //" Aggregation von Alarmen, dabei werden auch doppelte Alarme nach Möglichkeit zusammengeführt.",
            "hardnessOfImplementation" => array(
                "knowledge" => 3,
                "time" => 3,
                "resources" => 2
            ),
            "usefulness" => 2,
            "level" => 4,
            "implementation" => array("OWASP Defect Dojo", "SecureCodeBox"),
        ),
        gettext("Treatment of defects with criticality middle") => array(
            "risk" => gettext("Vulnerabilities with criticality middle are not visible."), //" Mittelschwere Alarme werden nicht beachtet.",
            "measure" => gettext("Vulnerabilities with criticality middle are added to the quality gate."), //" Akzeptanzkretieren für gefundene Schwachstellen sind definiert. Empfehlung ist mittelschwere Meldungen ebenfalls zu behandeln.",
            "hardnessOfImplementation" => array(
                "knowledge" => 2,
                "time" => 2,
                "resources" => 1
            ),
            "usefulness" => 3,
            "level" => 3,
            "comment" => "False positive analysis, specially for static analysis, is time consuming.",
        ),
        gettext("Treatment of all defects") => array(
            "risk" => gettext("Vulnerabilities with criminality low are not visible."), //" Alarme mit Schwere 'Einfach' werden nicht beachtet.",
            "measure" => gettext("All vulnerabilities are added to the quality gate."), //" Akzeptanzkretieren für gefundene Schwachstellen sind definiert. Empfehlung ist Meldungen mit der Schwere 'Einfach' ebenfalls zu behandeln.",
            "hardnessOfImplementation" => array(
                "knowledge" => 3,
                "time" => 2,
                "resources" => 1
            ),
            "usefulness" => 2,
            "level" => 4,
            "securityProperties" => array(
                "availability" => gettext(""), //" Durch Erkennung und Behebung von Schwachstellen bevor diese in Produktion gehen ist die Verfügbarkeit von Informationen im gesamten Systems erhöht.",
                "integrity" => gettext(""), //" Durch Erkennung und Behebung von Schwachstellen bevor diese in Produktion gehen ist die Integrität von Informationen im gesamten Systems erhöht.",
                "confidentiality" => gettext(""), //" Durch Erkennung und Behebung von Schwachstellen bevor diese in Produktion gehen ist die Vertraulichkeit von Informationen im gesamten Systems erhöht."
            )
        ),
        gettext("Reproducible defects tickets") => array(
            "risk" => gettext("Vulnerability descriptions are hard to understand by staff from operations and development."), //" Alarme können von Entwicklern / System-Adminstratoren ggf. nur schwer nachvollzogen werden.",
            "measure" => gettext("Vulnerabilities include the test procedure to give the staff from operations and development the ability to reproduce vulnerabilities. This enhances the understanding of vulnerabilities and therefore the fix have a higher quality."), //" Alarme enthalten den Ablauf der Aktionen um die gemeldete Schwachstelle einfacher reproduzieren zu können.",
            "hardnessOfImplementation" => array(
                "knowledge" => 3,
                "time" => 2,
                "resources" => 2
            ),
            "usefulness" => 2,
            "level" => 4,
            "implementation" => "<a href='https://github.com/mozilla/zest'>Mozilla Zest</a>"
        ),
        "Integration of vulnerability issues into the development process" => array(
            "risk" => gettext("To read console output of the build server to search for vulnerabilities might be difficult. Also, to check a vulnerability management system might not be a daily task for a developer."), //" Jedes Team muss jeden Alarm prüfen, so kann Frust entstehen.",
            "measure" => gettext("Vulnerabilities are tracked in the teams issue system (e.g. jira)."), //" Alarme werden Teams zugewiesen, so dass keine Ressourcen verschwendet werden.",
            "hardnessOfImplementation" => array(
                "knowledge" => 2,
                "time" => 2,
                "resources" => 1
            ),
            "usefulness" => 2,
            "level" => 3,
            "securityProperties" => array(
                "availability" => gettext(""), //" Durch freie Ressourcen kann die Verfügbarkeit von Informationen im gesamten Systems erhöht werden.",
                "integrity" => gettext(""), //" Durch freie Ressourcen kann die Integrität von Informationen im gesamten Systems erhöht werden.",
                "confidentiality" => gettext(""), //" Durch freie Ressourcen kann die Vertraulichkeit von Informationen im gesamten Systems erhöht werden."
            ),
            "implementation" => "Bei SAST: Serverseitige/klientenseitige Teams können einfach erfasst werden. Bei Mikroservice-Architektur können einzelne Mikroservices i.d.R. Teams zugewiesen werden. Bei DAST: Schwachstellen sind klassifiziert und können serverseitigen und klientenseitigen Teams zugewiesen werden."
        ),
        gettext("Simple visualization of defects") => array(
            "risk" => gettext("The security level of a component is not visible. Therefore, the motivation to enhance the security is not give."), //" Es ist unklar, wie viele Alarme im Monat entstehen.",
            "measure" => gettext("Vulnerabilties are simple visualized."), //" Alarme werden einach visualisiert um einfache Trendanalyse durchführen zu können.",
            "hardnessOfImplementation" => array(
                "knowledge" => 2,
                "time" => 2,
                "resources" => 1
            ),
            "usefulness" => 3,
            "level" => 2,
            "implementation" => array("OWASP Dependency Check Jenkins Plugin", "LogParser Jenkins Plugins", "SecureCodeBox")
        ),
        gettext("Advanced visualization of defects") => array(
            "risk" => gettext("Correlation of the vulnerabilities of different tools to have an overview of the the overall security level per component/project/team is not given."), //" Aufgrund der einfachen Visualisierung von Alarmen sind zusammenhänge nicht auf den ersten Blick erkennbar.",
            "measure" => gettext("Findings are visualized per component/project/team."), //" Alarme werden als Metrik erfasst visualisiert.",
            "hardnessOfImplementation" => array(
                "knowledge" => 2,
                "time" => 4,
                "resources" => 1
            ),
            "usefulness" => 2,
            "level" => 4,
            "implementation" => array("OWASP Defect Dojo", "SecureCodeBox")
        )
    ),
    gettext("Application tests") => array(
        gettext("Small coverage Security related unit tests") => array(
            "risk" => gettext(""), //" Schwachstellen sind unbeachbsichtigt Implementiert.",
            "measure" => gettext(""), //" Integration von sicherheitsrelevanten Modultests für geschäftskritische Bereiche. Dadurch können Schwachstellen wie fehlende Authentifizierung erkannt werden.",
            "hardnessOfImplementation" => array(
                "knowledge" => 3,
                "time" => 4,
                "resources" => 2
            ),
            "usefulness" => 3,
            "level" => 1,
            "comment" => "Die Integration von Modultests findet schon während der Entwicklung statt, es wird auf Schwachstellen in Sub-Routinen, Funktionen, Module, Bibliotheken usw. geprüft.",
            "implementation" => "Unit-Tests",
            "securityProperties" => array(
                "availability" => gettext(""), //" Durch Erkennung und Behebung von Schwachstellen bevor diese in Produktion gehen ist die Verfügbarkeit von Informationen im gesamten Systems erhöht.",
                "integrity" => gettext(""), //" Durch Erkennung und Behebung von Schwachstellen bevor diese in Produktion gehen ist die Integrität von Informationen im gesamten Systems erhöht.",
                "confidentiality" => gettext(""), //" Durch Erkennung und Behebung von Schwachstellen bevor diese in Produktion gehen ist die Vertraulichkeit von Informationen im gesamten Systems erhöht."
            ),
            "implementation" => "JUnit",
            "samm" => "ST2-B"
        ),
        gettext("Security related integration tests") => array(
            "risk" => gettext(""), //" In der Anwendung sind grundlegende Fehler bei der Benutzung eines Frameworks möglich, ohne das diese erkannt werden.",
            "measure" => gettext(""), //" Implementierung grundlegender Sicherheitstests als und Integrationstests. Beispielsweise kann die Authentifizierung und Autorisierung (Zugriffskontrolle) geprüft werden.",
            "hardnessOfImplementation" => array(
                "knowledge" => 3,
                "time" => 4,
                "resources" => 2
            ),
            "usefulness" => 2,
            "level" => 2,
            "securityProperties" => array(
                "availability" => gettext(""), //" Durch Erkennung und Behebung von Schwachstellen bevor diese in Produktion gehen ist die Verfügbarkeit von Informationen im gesamten Systems erhöht.",
                "integrity" => gettext(""), //" Durch Erkennung und Behebung von Schwachstellen bevor diese in Produktion gehen ist die Integrität von Informationen im gesamten Systems erhöht.",
                "confidentiality" => gettext(""), //" Durch Erkennung und Behebung von Schwachstellen bevor diese in Produktion gehen ist die Vertraulichkeit von Informationen im gesamten Systems erhöht."
            ),
            "implementation" => "HttpUnit",
            "samm" => "ST2-B"
        ),
        gettext("High coverage of security related module and integration tests") => array(
            "risk" => gettext(""), //" Es sind nicht alle Teile der Anwendung mit Sicherheitsprüfungen versehen.",
            "measure" => gettext(""), //" Implementierung grundlegender Sicherheitstests als Integrations- und/oder Akzeptanztests für alle Teile (auch Bibliotheken) der Anwendung.",
            "hardnessOfImplementation" => array(
                "knowledge" => 5,
                "time" => 5,
                "resources" => 3
            ),
            "usefulness" => 3,
            "level" => 4,
            "securityProperties" => array(
                "availability" => gettext(""), //" Durch Erkennung und Behebung von Schwachstellen bevor diese in Produktion gehen ist die Verfügbarkeit von Informationen im gesamten Systems erhöht.",
                "integrity" => gettext(""), //" Durch Erkennung und Behebung von Schwachstellen bevor diese in Produktion gehen ist die Integrität von Informationen im gesamten Systems erhöht.",
                "confidentiality" => gettext(""), //" Durch Erkennung und Behebung von Schwachstellen bevor diese in Produktion gehen ist die Vertraulichkeit von Informationen im gesamten Systems erhöht."
            ),
            "samm" => "ST2-B"
        ),
        gettext("Smoke Test") => array(
            "risk" => gettext(""), //" Durch eine Verteilung auf die Produktionsumgebung können Mikroservices gestört sein, z.B. wenn die Datenbank nicht erreicht werden kann.",
            "measure" => gettext(""), //" Integrationstests prüfen die Produktionsumgebung um sicher zu stellen, dass Funktionen, z.B. bereitgestellt durch Mikroservices oder externe Dienste, erreichbar sind.",
            "hardnessOfImplementation" => array(
                "knowledge" => 2,
                "time" => 2,
                "resources" => 2
            ),
            "usefulness" => 2,
            "level" => 4,
            "implementation" => "",
            "dependsOn" => array(
                gettext("Defined deployment process")
            ),
            "securityProperties" => array(
                "availability" => gettext(""), //" Durch Erkennung und Behebung von Schwachstellen bevor diese in Produktion gehen ist die Verfügbarkeit von Informationen im gesamten Systems erhöht.",
                "integrity" => gettext(""), //" Durch Erkennung und Behebung von Schwachstellen bevor diese in Produktion gehen ist die Integrität von Informationen im gesamten Systems erhöht.",
                "confidentiality" => gettext(""), //" Durch Erkennung und Behebung von Schwachstellen bevor diese in Produktion gehen ist die Vertraulichkeit von Informationen im gesamten Systems erhöht."
            ),
            "samm" => "ST2-B"
        )
    ),
    gettext("Infrastructure tests") => array(
        gettext("Test of infrastructure components with known vulnerabilities") => array(
            "risk" => gettext(""), //" Das Betriebssystem oder seine Dienste enthalten bekannte Schwachstellen. Häufig laufen Docker-Container zu lange ohne System-Aktuallisierung zu erhalten.",
            "measure" => gettext(""), //" Prüfung auf Aktualisierungen und bei veralteter Software Meldung an einen Verantwortlichen, welcher die Patches einspielt.",
            "hardnessOfImplementation" => array(
                "knowledge" => 1,
                "time" => 1,
                "resources" => 1
            ),
            "usefulness" => 5,
            "level" => 1,
            "securityProperties" => array(
                "integrity" => gettext(""), //" Durch Prüfung und Einspielen von System-Aktualisierungen ist die Wahrscheinlichkeit, dass System-Komponenten die Integrität von Informationen beeinträchtigen verringert.",
                "availability" => gettext(""), //" Durch Prüfung und Einspielen von System-Aktualisierungen ist die Wahrscheinlichkeit, dass System-Komponenten die Verfügbarkeit beeinträchtigen verringert.",
                "confidentiality" => gettext(""), //" Durch Prüfung und Einspielen von System-Aktualisierungen ist die Wahrscheinlichkeit, dass System-Komponenten vertrauliche Informationen preisgeben verringert."
            ),
            "implementation" => "Anchore, Clair, OpenSCAP, Vuls"
        ),
        gettext("Test of the configuration of virtual envirnoments") => array(
            "risk" => gettext(""), //" Virtuelle Umgebungen birgen die Gefahr sicherheitskritisch Konfiguriert zu sein.",
            "measure" => gettext(""), //" Mit Hilfe von Werkzeugen wird die Konfiguration von virtuellen Umgebungen geprüft.",
            "hardnessOfImplementation" => array(
                "knowledge" => 2,
                "time" => 2,
                "resources" => 1
            ),
            "usefulness" => 4,
            "level" => 2,
            "securityProperties" => array(
                "availability" => gettext(""), //" Durch Erkennung und Behebung von Schwachstellen bevor diese in Produktion gehen ist die Verfügbarkeit von Informationen im gesamten Systems erhöht.",
                "integrity" => gettext(""), //" Durch Erkennung und Behebung von Schwachstellen bevor diese in Produktion gehen ist die Integrität von Informationen im gesamten Systems erhöht.",
                "confidentiality" => gettext(""), //" Durch Erkennung und Behebung von Schwachstellen bevor diese in Produktion gehen ist die Vertraulichkeit von Informationen im gesamten Systems erhöht."
            ),
            "implementation" => "Docker Bench for Security, Docker Security Scan, openVAS",
            "samm" => "EH2-B"
        ),
        gettext("Advanced infrastructure tests") => array(
            "risk" => gettext(""), //" Systeme wie Firewalls können nach einer Anpassung sicherheitskritisch konfiguriert sein.",
            "measure" => gettext(""), //" Automatische Prüfung von Infrastruktur-Systemen wie Firewalls.",
            "hardnessOfImplementation" => array(
                "knowledge" => 2,
                "time" => 2,
                "resources" => 1
            ),
            "usefulness" => 3,
            "level" => 4,
            "securityProperties" => array(
                "availability" => gettext(""), //" Durch Erkennung und Behebung von Schwachstellen bevor diese in Produktion gehen ist die Verfügbarkeit von Informationen im gesamten Systems erhöht.",
                "integrity" => gettext(""), //" Durch Erkennung und Behebung von Schwachstellen bevor diese in Produktion gehen ist die Integrität von Informationen im gesamten Systems erhöht.",
                "confidentiality" => gettext(""), //" Durch Erkennung und Behebung von Schwachstellen bevor diese in Produktion gehen ist die Vertraulichkeit von Informationen im gesamten Systems erhöht."
            )
        ),
        gettext("Load tests") => array(
            "risk" => gettext(""), //" Es ist unbekannt wie viele Anfragen das System bedienen kann und wie sich das System bei vielen Anfragen verhält.",
            "measure" => gettext(""), //" Last-Tests werden periodisch ausgeführt.",
            "hardnessOfImplementation" => array(
                "knowledge" => 3,
                "time" => 2,
                "resources" => 5
            ),
            "usefulness" => 3,
            "level" => 4,
            "securityProperties" => array(
                "availability" => gettext(""), //" Durch Erkennung und Behebung von Flaschenhälsen ist die Verfügbarkeit von Informationen im gesamten Systems erhöht."
            )
        ),
        gettext("Weak password test") => array(
            "risk" => gettext(""), //" Mitarbeiterkonten und priviligierte Benutzerkonten sind mit schwachen Passwörtern geschützt.",
            "measure" => gettext(""), //" Automatische BruteForce-Angriffe auf Benutzer-Konten von Mitarbeitern sowie Standard-Konten wie 'administrator'.",
            "hardnessOfImplementation" => array(
                "knowledge" => 2,
                "time" => 1,
                "resources" => 1
            ),
            "usefulness" => 1,
            "level" => 3,
            "securityProperties" => array(
                "availability" => gettext(""), //" Durch Erkennung und Ändern von schwachen Passwörtern kann die Verfügbarkeit von Informationen im gesamten Systems erhöht werden.",
                "integrity" => gettext(""), //" Durch Erkennung und Ändern von schwachen Passwörtern kann die Integrität von Informationen im gesamten Systems erhöht werden.",
                "confidentiality" => gettext(""), //" Durch Erkennung und Ändern von schwachen Passwörtern kann die Vertraulichkeit von Informationen im gesamten Systems erhöht werden."
            ),
            "implementation" => "HTC Hydra",
        )
    )
);


// TODO Copy multiple scanner to static
