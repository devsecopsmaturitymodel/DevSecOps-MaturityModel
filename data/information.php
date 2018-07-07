<?php
$monitoring = array(
    gettext("Simple system metrics") => array(
        "risk" => gettext("Without simple metrics analysis of incidents are hard. In case an application uses a lot of CPU from time to time, it is hard for a developer to find out the source with linux commands."), //" Systemadministratoren und Entwickler müssen, um einen Überblick über verschiedene virtuelle Systeme zu erlangen, sich auf diesen einloggen. Insbesondere Entwicklern ohne Linux-Kentnisse fällt die Auswertung von Protokollen auf Grundlage der Linux-Befehle cat, grep und awk schwer.",
        "measure" => gettext("Gathering of system metrics helps to identify incidents and specially bottlenecks."), //" Einfache Anwendungs- und System-Metriken sind erfasst.",
        "hardnessOfImplementation" => array(
            "knowledge" => 2,
            "time" => 2,
            "resources" => 2
        ),
        "usefulness" => 5,
        "level" => 1,
        "securityProperties" => array(
            "integrity" => gettext(""), //" Durch Metriken während eines Angriffs können Informationen gewonnen werden, durch welche ein Angriff auf die Integrität von Daten abgewehrt werden kann.",
            "availability" => gettext(""), //" Durch Trendanalysen können ungewollte Systemausfälle verhindert werden.",
            "confidentiality" => gettext(""), //" Durch Metriken während eines Angriffs können Informationen gewonnen werden, durch welche ein Angriff abgewehrt werden kann."
        ),
        "implementation" => "collectd"
    ),
    gettext("Simple application metrics") => array(
        "risk" => gettext("Attacks on an application are not recognized."), //" Systemadministratoren und Entwickler müssen, um einen Überblick über verschiedene virtuelle Systeme zu erlangen, sich auf diesen einloggen. Insbesondere Entwicklern ohne Linux-Kentnisse fällt die Auswertung von Protokollen auf Grundlage der Linux-Befehle cat, grep und awk schwer.",
        "measure" => gettext("Gathering of application metrics helps to identify incidents like brute force attacks."), //" Einfache Anwendungs- und System-Metriken sind erfasst.",
        "hardnessOfImplementation" => array(
            "knowledge" => 2,
            "time" => 2,
            "resources" => 2
        ),
        "usefulness" => 5,
        "level" => 1,
        "securityProperties" => array(
            "integrity" => gettext(""), //" Durch Metriken während eines Angriffs können Informationen gewonnen werden, durch welche ein Angriff auf die Integrität von Daten abgewehrt werden kann.",
            "availability" => gettext(""), //" Durch Trendanalysen können ungewollte Systemausfälle verhindert werden.",
            "confidentiality" => gettext(""), //" Durch Metriken während eines Angriffs können Informationen gewonnen werden, durch welche ein Angriff abgewehrt werden kann."
        ),
        "implementation" => "Prometheus"
    ),
    gettext("Visualized metrics") => array(
        "risk" => gettext("Not vizualized metrics lead to restricted usage of metrics."), //" Metriken werden mangelhaft dargestellt und können deshalb nur begrenzt ausgewertet werden.",
        "measure" => gettext("Metrics are vizualized in real time in a user friendly way."), //" Metriken sind visuell in Echtzeit dargestellt. Dabei unterstützt eine benutzerfreundliche Bedienoberfläche.",
        "hardnessOfImplementation" => array(
            "knowledge" => 1,
            "time" => 2,
            "resources" => 2
        ),
        "usefulness" => 3,
        "level" => 2,
        "dependsOn" => array(
            gettext("Simple application metrics"),
            gettext("Simple system metrics"),
        )
    ),
    gettext("Advanced webapplication metrics") => array(
        "risk" => gettext("People are not looking into tests results. Vulnerabilities not recolonized, even they are detected by tools."), //" Das Sicherheitsniveau der Webanwendung ist unbekant.",
        "measure" => gettext("All defects from the dimension Test- and Verification are instrumented."), //" Alle Ergebnisse aus der Dimension Test- und Verifizierung werden instrumentiert.",
        "hardnessOfImplementation" => array(
            "knowledge" => 3,
            "time" => 3,
            "resources" => 2
        ),
        "usefulness" => 4,
        "level" => 3,
        "securityProperties" => array(
            "integrity" => gettext(""), //" Durch Instrumentierung der durchgeführten Metriken wird das Sicherheitsniveau kommuniziert und die Sicherheit der Webanwendung langfristig erhöht.",
            "availability" => gettext(""), //" Durch Instrumentierung der durchgeführten Metriken wird das Sicherheitsniveau kommuniziert und die Sicherheit der Webanwendung langfristig erhöht.",
            "confidentiality" => gettext(""), //" Durch Instrumentierung der durchgeführten Metriken wird das Sicherheitsniveau kommuniziert und die Sicherheit der Webanwendung langfristig erhöht."
        ),
        "dependsOn" => array(
            gettext("Simple application metrics"),
            gettext("Visualized metrics")
        )
    ),
    gettext("Advanced availablity and stability metrics") => array(
        "risk" => gettext("Trends and advanced attacks are not detected."), //" Es sind nicht ausreichend Metriken erfasst um alle Trends zu erfassen oder bei einem Angriff ausreichend Informationen zu erhalten.",
        "measure" => gettext("Advanced metrics are gathered in relation to availability and stability. For example unplanned downtimes per year."), //" Erweiterte Metriken um die Verfügbarkeit und Stabilität zu erfassen. Insbesondere ungeplante Ausfallzeiten sollten erfasst werden, da diese zu Vertragsstrafen führen können. Typischerweise werden diese über eine Periode, beispielsweise ein Jahr, erfasst.",
        "hardnessOfImplementation" => array(
            "knowledge" => 3,
            "time" => 3,
            "resources" => 2
        ),
        "usefulness" => 4,
        "level" => 3,
        "securityProperties" => array(
            "availability" => gettext(""), //" Durch Trendanalysen aufgrund erweiterter Metriken können ungewollte Systemausfälle verhindert werden."
        ),
        "dependsOn" => array(
            gettext("Simple application metrics"),
            gettext("Visualized metrics")
        )
    ),
    gettext("Coverage and control metrics") => array(
        "risk" => gettext("The effectiveness of configuration, patch and vulnerablity management is unknown."),
        "measure" => gettext("Usage of Coverage- and control-metrics to show the effectivness of the security programm. Coverage is the degree in 
        which a specific security control for a specifc target group is applied with all resoucres.
        The control degree shows the actual application of security standards and security-guidelines. Examples are gathering information on anti-virus, anti-rootkits, patch management, server configuration and vulnerability management."), //" Einführung von Abdeckungs- und Kontroll-Metriken.
        // Durch Abdeckungs- und Kontroll-Metriken wird aufgezeigt wie effektiv das Sicherheits-Programm einer Organisation ist.
        //Sicherheits-Programme sind u.a. durch unternehmensweite Richtlinien gestützt, allerdings werden diese nicht immer eingehalten.
        //Abdeckung ist der Grad zu welcher eine bestimmte Sicherheitskontrolle für eine bestimmte Zielgruppe mit allen Ressourcen angewendet wird.
        // Der Kontroll-Grad zeigt die tatsächliche Anwendung von vorgegLeveln Sicherheits-Standards und -Richtlinien.
        // Entsprechend werden durch Abdeckungs- und Kontroll-Metriken Lücken bei der Umsetzung von Richtlinien und Standards aufgezeigt.
        // Umfassende Abdeckungs- und Kontroll-Metriken beinhalten das Sammeln von Informationen zu Anti-Virus Software sowie Anti-Rootkits, Patch Management, Server-Konfiguration und Schwachstellen-Management.",
        "hardnessOfImplementation" => array(
            "knowledge" => 3,
            "time" => 5,
            "resources" => 2
        ),
        "usefulness" => 4,
        "level" => 4,
        "securityProperties" => array(
            "integrity" => gettext(""), //" Durch Kenntnis der Effektivität von Kontrollmanahmen können Bedrohungen, welche die Integrität gefährden abgewehrt werden.",
            "availability" => gettext(""), //" Durch Kenntnis der Effektivität von Kontrollmanahmen können Bedrohungen, welche die Verfügbarkeit gefährden abgewehrt werden.",
            "confidentiality" => gettext(""), //" Durch Kenntnis der Effektivität von Kontrollmanahmen können Bedrohungen, welche die Vertraulichkeit gefährden abgewehrt werden."
        ),
        "dependsOn" => array(
            gettext("Visualized metrics")
        ),
        "implementation" => "https://ht.transparencytoolkit.org/FileServer/FileServer/OLD%20Fileserver/books/SICUREZZA/Addison.Wesley.Security.Metrics.Mar.2007.pdf"
    ),
    gettext("Defence metrics") => array(
        "risk" => gettext("IDS/IPS systems like packet- or application-firewalls detect and prevent attacks. It is not known how many attacks has been detected and blocked."), //" Angriffserkennungssysteme wie eine Paketfilter-Firewalls oder Web-Application-Firewall erkennen und blockieren Angriffe, jedoch ist unbekannt wie viele Angriffe abgewehrt werden und es wird ggf. nicht erkannt, wenn ein Angriff stattfindet.",
        "measure" => gettext("Gathering of defence metrics like TCP/UDP sources enables to assume the geographic location of the requeist."), //" Einführung von Verteidigungs-Metriken. Verteidigungs-Metriken beinhalten das Sammeln von Informationen
        //zu Anti-Virus- und Anti-Rootkit-Lösungen, Firewalls, Netzwerken und Angriffen.
        // Beispielsweise kann die Anzahl der eingehenden Verbindung nach TCP/UDP-Port gemessen werden und beinhaltet implizit die Anzahl der eingehenden Verbindung nach TCP/UDP-Protokoll.
        // Durch Sammeln der Internetprotokoll-Adressen von eingehenden Verbindungen kann der geografische Quell-Standort ermittelt werden.",
        "hardnessOfImplementation" => array(
            "knowledge" => 3,
            "time" => 5,
            "resources" => 2
        ),
        "usefulness" => 4,
        "level" => 4,
        "securityProperties" => array(
            "integrity" => gettext(""), //" Während eines Angriffs können Informationen gewonnen werden, durch welche ein Angriff auf die Integrität von Daten abgewehrt werden kann.",
            "availability" => gettext(""), //" Es können ungewollte Systemausfälle verhindert werden.",
            "confidentiality" => gettext(""), //" Während eines Angriffs können Informationen gewonnen werden, durch welche ein Angriff abgewehrt werden kann."
        ),
        "dependsOn" => array(
            gettext("Visualized metrics")
        )
    ),

    gettext("Alerting") => array(
        "risk" => gettext("Incidents are discovered after they happend."), //" Es wird zu spät gemerkt, wenn Systeme ungewöhnliches verhalten aufweisen.",
        "measure" => gettext("Thresholds for metrics are set. In case the thresholds are reached, alarms are send out. Which should get attention due to the critically."), //" Grenzen für Metriken sind definiert und das System alarmiert.",
        "hardnessOfImplementation" => array(
            "knowledge" => 2,
            "time" => 5,
            "resources" => 5
        ),
        "usefulness" => 5,
        "level" => 2,
        "securityProperties" => array(
            "availability" => gettext(""), //" Durch frühzeitig Alarmierung können Systemausfälle verhindert werden."
        ),
        "dependsOn" => array(
            gettext("Visualized metrics")
        ),
        "samm" => "OE1-B"
    ),
    gettext("Deactivation of unused metrics") => array(
        "risk" => gettext("High resources are used while gathering unused metrics."), //" Durch sammeln ungenutzter Metriken werden Ressourcen verschwendet, welche für sicherheitsrelevante Dienste genutzt werden könnten.",
        "measure" => gettext("Deactivation of unused metrics helps to free resources."), //" Durch Deaktivierung ungenutzter Metriken stehen mehr Ressourcen zur Verfügung.",
        "hardnessOfImplementation" => array(
            "knowledge" => 2,
            "time" => 5,
            "resources" => 5
        ),
        "usefulness" => 5,
        "level" => 3,
        "dependsOn" => array(
            gettext("Visualized metrics")
        )
    ),
    gettext("Grouping of metrics") => array(
        "risk" => gettext("The analysis of metrics takes long."), //" Da sicherheitsrelevante Metriken nicht gruppiert sind, kann es zu Verzögerungen bei der Analyse von Vorfällen kommen.",
        "measure" => gettext("Meaningful grouping of metrics helps to speed up analysis."), //" Metriken sind sinnvoll gruppiert.",
        "hardnessOfImplementation" => array(
            "knowledge" => 2,
            "time" => 4,
            "resources" => 2
        ),
        "usefulness" => 2,
        "level" => 3,
        "securityProperties" => array(
            "availability" => gettext(""), //" Durch erhöhte Reaktionszeit können Systemausfälle verhindert werden."
        )
    ),
    gettext("Targeted alerting") => array(
        "risk" => gettext("People are bored (irodiert) of incident alarm messages, as they are not responsbile to react."), //" Es werden falsche Personen über einen Vorfall informiert.",
        "measure" => gettext("By the defintion of target groups for incidents people are only getting alarms for incidents they are in charge for."), //" Durch zielgerichtete Information über Vorfälle kann besser auf Vorfälle reagiert werden.",
        "hardnessOfImplementation" => array(
            "knowledge" => 2,
            "time" => 5,
            "resources" => 5
        ),
        "usefulness" => 5,
        "level" => 3,
        "securityProperties" => array(
            "availability" => gettext(""), //" Durch erhöhte Reaktionszeit können Systemausfälle verhindert werden."
        ),
        "dependsOn" => array(
            "Alerting"
        ),
        "samm" => "OE1-B"
    ),
    gettext("Screens with metric visualization") => array(
        "risk" => gettext("Security related information is discovered too late during an incident."), //" Sicherheitsrelevante Informationen, z.B. bei einem Angriff, werden verspätet erkannt.",
        "measure" => gettext("By having an internal accessable screen with a security related dashboards helps to visualize incidents."), //" Ein intern zugänglicher Bildschirm zeigt sicherheitsrelevante Metriken.",
        "hardnessOfImplementation" => array(
            "knowledge" => 2,
            "time" => 1,
            "resources" => 1
        ),
        "usefulness" => 5,
        "level" => 4,
        "dependsOn" => array(
            gettext("Grouping of metrics")
        ),
        "securityProperties" => array(
            "availability" => gettext(""), //" Durch erhöhte Reaktionszeit können Systemausfälle verhindert werden."
        )
    ),
    gettext("Metrics are combined with tests") => array(
        "risk" => gettext("Changes might cause high load due to programming errors."), //" Änderungen führen zu erhöhter Last aufgrund Programmierfehler.",
        "measure" => gettext("Metrics during tests helps to identify programming errors."), //" Erweiterte Metriken werden bei Tests aufgezeichnet und ausgewertet.",
        "hardnessOfImplementation" => array(
            "knowledge" => 2,
            "time" => 3,
            "resources" => 2
        ),
        "usefulness" => 5,
        "level" => 4,
        "securityProperties" => array(
            "availability" => gettext(""), //" Durch erhöhte Sichtbarkeit von Metriken bei Tests wird die Verfügbarkeit erhöht."
        ),
        "dependsOn" => array(
            gettext("Grouping of metrics")
        )
    )
);
ksort($monitoring);
$logging = array(
    gettext("Centralized system logging") => array(
        "risk" => gettext("Local stored system logs can be unauthorized manipulated by attackers or might be corrupt after an incident. In addition, it is hard to perform a aggregation of logs."), //" Protokolle sind nicht sichtbar und können bei Einbruch in ein System manipuliert werden.",
        "measure" => gettext("By using centralized logging logs are protected against unauthorized modification."), //" Protokolle werden zentral erfasst.",
        "hardnessOfImplementation" => array(
            "knowledge" => 1,
            "time" => 1,
            "resources" => 1
        ),
        "usefulness" => 2,
        "level" => 1,
        "securityProperties" => array(
            "availability" => gettext(""), //" Durch erhöhte Sichtbarkeit von Protokollen auf einem zentralen System wird die Verfügbarkeit erhöht.",
            "integrity" => gettext(""), //" Durch sammeln von Protokollen auf einem zentralen Protokoll-System können Protokolle schwerer manipuliert werden. Durch erhöhte Sichtbarkeit können Angriffe erkannt und Maßnahmen ergriffen werden."
        ),
        "implementation" => "rsyslog, Logstash"
    ),
    gettext("Visualized logging") => array(
        "risk" => gettext("System and application protocols are not visualized properly which leads to no or very limited logging assessment. Specally developers might have difficulty to read applications logs with unusually tools like the Linux tool 'cat'"), //" Protokolle werden mangelhaft dargestellt und können deshalb nur begrenzt ausgewertet werden. Insbesondere Entwickler können die in Dateien erfassten Protokolle mittels ungewohnten Werkzeugen wie 'cat', 'grep' und 'less' schwer auswerten.",
        "measure" => gettext("Protocols are visualized in a simple to use real time monitoring system. The GUI gives the ability to search for specal attributes in the protocol."), //" Protokolle sind in einer Oberfläche in Echtzeit dargestellt. Dabei unterstützt eine benutzerfreundliche Bedienoberfläche inklusive Visualisierung von einfachen Protokoll-Metriken.",
        "hardnessOfImplementation" => array(
            "knowledge" => 1,
            "time" => 3,
            "resources" => 3
        ),
        "usefulness" => 4,
        "level" => 2,
        "dependsOn" => array(
            "Centralized system logging",
            "Centralized application logging"
        ),
        "implementation" => "ELK-Stack"
    ),
    gettext("Centralized application logging") => array(
        "risk" => gettext("Local stored logs can be unauthorized manipulated by attackers with system access or might be corrupt after an incident. In addition, it is hard to perform an correlation of logs. This leads attacks, which can be performed silently."), //" Treten Ausnahmen in Anwendungen auf, werden diese verzögert oder gar nicht manuell geprüft.",
        "measure" => gettext("A centralized logging system is used and applications logs (including application exceptions) are shipped to it."),
        "hardnessOfImplementation" => array(
            "knowledge" => 1,
            "time" => 1,
            "resources" => 1
        ),
        "usefulness" => 5,
        "level" => 3,
        "dependsOn" => array(
            gettext("Visualized logging"),
            gettext("Alerting")
        ),
        "securityProperties" => array(
            "availability" => gettext(""), //" Durch erhöhte Sichtbarkeit von Ausnahmen wird die Verfügbarkeit erhöht."
        ),
        "samm" => "SA2-B"
    ),
    gettext("Correlation of security events") => array(
        "risk" => gettext("Detection of security related events with hints on different systems/tools/metrics is not possible."), //" Sicherheits-Ereignisse werden nicht korreliert, so dass Zusammennhänge zwischen Ereignissen nicht erkannt werden.",
        "measure" => gettext("Events are correlated on one system. For example the correlation and visualisationof enhance login tries combined with successfull logins."), //" Sicherheits-Ereignisse werden korreliert. Beispielsweise erhöhte Anmeldeverusuche mit erfolgreichen Anmeldungen.",
        "hardnessOfImplementation" => array(
            "knowledge" => 4,
            "time" => 4,
            "resources" => 4
        ),
        "usefulness" => 3,
        "level" => 4,
        "dependsOn" => array(
            gettext("Visualized logging"),
            gettext("Alerting")
        ),
        "securityProperties" => array(
            "availability" => gettext(""), //" Durch erhöhte Sichtbarkeit von Ausnahmen die Verfügbarkeit erhöht.",
            "integrity" => gettext(""), //" Durch Korrelation von Ereignissen können Angriffe schneller erkannt und Maßnahmen ergriffen werden."
        )
    ),


);
ksort($logging);
$dimensions [gettext("Information gathering")] = array(
    gettext("Monitoring") => $monitoring,
    gettext("Logging") => $logging
);
