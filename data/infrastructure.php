<?php
$dimensions [gettext("Infrastructure")] = array(
    gettext("Infrastructure") => array(
        gettext("Applications are running in virtualized environments") => array(
            "risk" => gettext(""), //" Durch einen Einbruch erlangt ein Angreifer Zugriff auf alle auf einem Server laufenden Anwendungen.",
            "measure" => gettext(""), //" Anwendungen laufen in virtuellen Umgebungen.",
            "hardnessOfImplementation" => array(
                "knowledge" => 3,
                "time" => 3,
                "resources" => 5
            ),
            "usefulness" => 3,
            "level" => 2,
            "securityProperties" => array(
                "availability"
            )
        ),
        gettext("Usage of test and production environments") => array(
            "risk" => gettext(""), //" Sicherheits-Tests werden aufgrund mangelnder Test-Umgebungen nicht durchgeführt.",
            "measure" => gettext(""), //" Es existiert eine Produktiv-Umgebung und mindestens eine Test-Umgebung",
            "hardnessOfImplementation" => array(
                "knowledge" => 3,
                "time" => 3,
                "resources" => 5
            ),
            "usefulness" => 4,
            "level" => 1,
            "dependsOn" => array(
                gettext("Defined deployment process")
            ),
            "securityProperties" => array(
                "availability" => gettext(""), //" Durch ausreichende Tests ist das System stabil",
                "integrity" => gettext(""), //" Durch ausreichende Tests ist sichergestellt, dass Daten nicht versehentlich bei einer Verteilung gelöscht werden."
            )
        ),
        gettext("Simple access control for systems") => array(
            "risk" => gettext(""), //" Angreifer erhalten Zugriff auf interne Systeme ohne Authentifizierung und können Daten mitschneiden.",
            "measure" => gettext(""), //" Alle internen Systeme sind mit einfacher Authentifizierung und Verschlüsselung geschützt.",
            "hardnessOfImplementation" => array(
                "knowledge" => 3,
                "time" => 3,
                "resources" => 3
            ),
            "usefulness" => 5,
            "level" => 1,
            "dependsOn" => array(
                gettext("Defined deployment process")
            ),
            "securityProperties" => array(
                "authentication" => "Durch Zugriffsschutz ist sichergestellt, dass nur Autorisierte schutzwerte Informationen einsehen können.",
                "confidentiality" => gettext(""), //" Durch eine verschlüsstelte Verbindung ist sichergestellt, dass nur Autorisierte schutzwerte Informationen einsehen können."
            ),
            "implementation" => "HTTP-Authentifizierung, TLS, VPN",
            "samm" => "EH1-B"
        ),
        gettext("Virtuell environments are limited") => array(
            "risk" => gettext(""), //" Wird eine Anwendung in einer virtuellen Umgebung angegriffen oder hat einen Defekt, kann dies zu erhöhter Ressourcen-Nutzung führen, wodurch auch andere Anwendung auf dem gleichem Server stark beeinträchtigt werden können.",
            "measure" => gettext(""), //" Alle virtuellen Umgebungen besitzen Limitierungen für Arbeitsspeicher, Festplattendurchsatz, Festplattenplatz und Prozessoren.",
            "hardnessOfImplementation" => array(
                "knowledge" => 2,
                "time" => 2,
                "resources" => 3
            ),
            "usefulness" => 3,
            "level" => 3,
            "dependsOn" => array(
                "Anwendungen laufen in virtuellen Umgebungen"
            ),
            "securityProperties" => array(
                "availability" => gettext(""), //" Da alle Anwendungen/Prozesse limitiert sind, können sich diese nicht beziehungsweise nur gering gegenseitig beeinflussen."
            )
        ),
        gettext("Infrastructure as Code") => array(
            "risk" => gettext("No tracking of changes in systems might lead to errors in the configuration. In additions, it might lead to unauthorized changes. An examples is jenkins."), //" Manuelles Aufsetzen von System-Umgebungen kann zu fehlerhaften Konfigurationen sowie zu diskrepanzen bei redundanten Systemen führen.",
            "measure" => gettext("Systems are setup by code. A full enviorement can be provisioned. In addition, software like Jenkins 2 can be setup and configured in in code too. The code should be stored in a version control system."), //" Mittels automatisierter Provisionierung werden System-Umgebungen aufgesetzt (Stichwort: Infrastructure as Code).",
            "hardnessOfImplementation" => array(
                "knowledge" => 3,
                "time" => 5,
                "resources" => 4
            ),
            "usefulness" => 4,
            "level" => 3,
            "implementation" => "Ansible, Chef, Puppet, Jenkinsfile",
            "securityProperties" => array(
                "integrity" => gettext(""), //" Da ein System 'versioniert' ist, können ungewollte Änderungen identifiziert werden.",
                "availability" => gettext(""), //" Durch automatische Provisionierung kann ein System jeder Zeit in der selben Konfiguration auf einer Hardware erzeug werden."
            )
        ),
        gettext("Production near environments are used by developers") => array(
            "risk" => gettext("In case an errors occurs in production, the developer need to be able to create a production near environment on a local development environment."), //" Erstellung produktionsnaher Umgebungen ist schwer. Tritt eine Schwachstelle nur in der Produktionsumgebung auf, ist es schwierig diese auf einer lokalen Entwicklungsumgebung nachzuvollziehen.",
            "measure" => gettext("Usage of infrastructure as code helps to create a production near environment. The developer needs to be trained in order to setup a local develipment environment. In addition, it should be possible to create production like test data. Often peronal identifiable information is anonymised in order to comply with data protection laws."), //" Durch Nutzung von einer virtuellen Umgebung und Ablage der Konfiguration im Quellcode, lässt sich eine Produktionsumgebung nachstellen.",
            "hardnessOfImplementation" => array(
                "knowledge" => 3,
                "time" => 3,
                "resources" => 3
            ),
            "usefulness" => 4,
            "level" => 4,
            "dependsOn" => array(
                gettext("Defined deployment process"),
                gettext("Infrastructure as Code")
            ),
            "securityProperties" => array(
                "availability" => gettext(""), //" Durch eine produktionsnahen Umgebung können Entwickler bereits während der Entwicklung Fehler erkennen und diese korrigieren, so reduziert das Risko durch eine Verteilung die Verfügbarkeit des System zu gefährden."
            ),
            "samm" => "SA1"
        ),
        gettext("Controlled networks for virtual environments") => array(
            "risk" => gettext("Virtual environments in default settings are able to access other virtual environments on the network stack. By using virtual machines, it is often possible to connect to other virtual machines. By using docker, one bridge is used by default so that all containers on one host can communicate with each other."), //" Virtuelle Umgebungen können auf Sockets anderer virtueller Umgebungen zugreifen, auch wenn dies nicht notwendig ist.",
            "measure" => gettext("The communication between virtual environments is regulated."), //" Die Kommunikation zwischen virtuellen Umgebungen ist reguliert.",
            "hardnessOfImplementation" => array(
                "knowledge" => 3,
                "time" => 3,
                "resources" => 3
            ),
            "usefulness" => 5,
            "level" => 3,
            "dependsOn" => array(
            ),
            "securityProperties" => array(
                "availability" => gettext(""), //" Regulierung verhindert die Beeinträchtigung der Verfügbarkeit von Diensten.",
                "confidentiality" => gettext(""), //" Regulierung zwischen virtuellen Umgebungen verhindert nach einem erfolgreichen Angriff auf eine virtuelle Umgebung den Zugriff auf weitere nicht autorisierte Dienste in anderen virtuellen Umgebungen."
            ),
            "implementation" => gettext("Separation of networks, e.g. bridges or firewalls)"
            )
        ),
        gettext("Versioning") => array( //TODO: Remove it from deployment
            "risk" => gettext("Changes to production systems can not be undone."), //" Ein vorheriges Produktionsartefakt lässt sich nicht wieder starten, wenn die Verteilung einer neuen Version nicht klappt.",
            "measure" => gettext("Versioning of artifacts related to production environments. For example Jenkins configuration, docker images, system provisioning code."), //" Alle Produktions-Artifakte sind versioniert.",
            "hardnessOfImplementation" => array(
                "knowledge" => 3,
                "time" => 3,
                "resources" => 3
            ),
            "usefulness" => 5,
            "level" => 3,
            "dependsOn" => array(
                gettext("Defined deployment process")
            ),
            "securityProperties" => array(
                "integrity" => gettext(""), //" Da ein System 'versioniert' ist, können ungewollte Änderungen identifiziert werden.",
                "availability" => gettext(""), //" Durch Versionierung können alle Artifakte jeder Zeit in der selben Konfiguration auf einer Hardware erzeug werden."
            )
        ),
        gettext("Limitation of system calls in virtual environments") => array(
            "risk" => gettext("System calls in virtual environments like docker can lead to privilege escalation."), //" Eine Schwachstelle von Containern sind System-Aufrufe, welche nicht den Namespace beachten",
            "measure" => gettext("System calls in virtual environments like docker are audited and limited."), //" Betriebssystem-Aufrufe von Anwendungen in virtuellen Umgebungen sind limitiert und auf einer Positivliste eingetragen",
            "hardnessOfImplementation" => array(
                "knowledge" => 3,
                "time" => 3,
                "resources" => 3
            ),
            "usefulness" => 5,
            "level" => 4,
            "dependsOn" => array(
                "Anwendungen laufen in virtuellen Umgebungen"
            ),
            "securityProperties" => array(
                "integrity" => gettext(""), //" Durch eine Positiv-Liste kann die Modifizierung von Daten nach einem erfolgreichem Angriff eingeschränkt werden.",
                "authorization" => "Prozesse können nur definierte System-Aufrufe benutzen.",
                "confidentiality" => gettext(""), //" Prozesse können nur definierte System-Aufrufe benutzen und entsprechend nur auf autorisierte Daten zugreifen."
            ),
            "implementation" => "seccomp, strace"
        ),
            gettext("Checking the sources of used libraries") => array(
            "risk" => gettext("Application and system libraries can have implementation flaws or deployment flaws."), //" Genutzte Software wird ohne Prüfung der Quelle geladen und verwendet. Software kann dabei ein Paket des Betriebssystems, ein Abbild eines Betriebssystems, ein geladenes Plugin für einen Continuous Integration-Server oder eine Bibliothek in einer Anwendung sein.",
            "measure" => gettext("Each libraries source is checked to have a trusted source."), //" Jede Software-Quelle ist manuell auf Vertraulichkeit geprüft.",
            "hardnessOfImplementation" => array(
                "knowledge" => 3,
                "time" => 3,
                "resources" => 1
            ),
            "usefulness" => 3,
            "level" => 2,
            "securityProperties" => array(
                "integrity" => gettext(""), //" Durch Prüfung von Paket-Quellen ist sichergestellt, dass System-Pakete nur auf autorisierte Daten zugreifen.",
                "availability" => gettext(""), //" Durch Prüfung von Paket-Quellen ist sichergestellt, dass System-Pakete nicht die Verfügbarkeit beeinträchtigen.",
                "confidentiality" => gettext(""), //" Durch Prüfung von Paket-Quellen ist sichergestellt, dass System-Pakete nur auf autorisierte Daten zugreifen."
            ),
            "samm" => "SA1-A"
        ),
        gettext("Microservice-Architecture") => array(//MAybe remove
            "risk" => gettext("Monolithic applications are hard to test."), //" Komponenten sind komplex und schwer testbar.",
            "measure" => gettext("A microservice-architecture helps to have small components, which are easy to test."), //" Es ist eine Mikroservice-Architektur genutzt.",
            "hardnessOfImplementation" => array(
                "knowledge" => 4,
                "time" => 5,
                "resources" => 5
            ),
            "usefulness" => 3,
            "level" => 4,
            "securityProperties" => array(
                "integrity" => gettext(""), //" Durch Reduktion der Komplexität und Erhöhung der Testbarkeit wird die Wahrscheinlichkeit von Schwachstellen reduziert.",
                "availability" => gettext(""), //" Durch Reduktion der Komplexität und Erhöhung der Testbarkeit wird die Wahrscheinlichkeit von Schwachstellen reduziert.",
                "confidentiality" => gettext(""), //" Durch Reduktion der Komplexität und Erhöhung der Testbarkeit wird die Wahrscheinlichkeit von Schwachstellen reduziert."
            ),
            "samm" => "SA2"
        ),
        gettext("Usage of a chaos monkey") => array(//Bussiness continuted Disaster recovery testing
            "risk" => gettext("Due to manuel changes on a system, they are not replaceable anymore. In case of a crash it might happen that a planned redudant system is unavailable. In addation, it is hard to replay manual changes."), //" Durch manuelle Änderungen an Systemen sind diese nicht auswechselbar. Die Verfügbarkeit eines redundanten Systems kann beeinträchtigt werden.",
            "measure" => gettext("A randomized peridically shutdown of systems makes sure, that nobody will perform manuall changes to a system."), //" Durch zufälliges Runterfahren von redundandten Systemen wird sichergestellt, dass alle Änderungen versioniert sind und die Systeme tatsächlich hochverfügbar sind.",
            "hardnessOfImplementation" => array(
                "knowledge" => 3,
                "time" => 5,
                "resources" => 5
            ),
            "usefulness" => 3,
            "level" => 4,
            "securityProperties" => array(
                "availability" => gettext(""), //" Durch zufälliges Runterfahren von redundandten Systemen wird sichergestellt, dass alle Änderungen versioniert sind und die Systeme tatsächlich hochverfügbar sind."
            ),
        ),
        gettext("Role based authentication and authorization") => array(
            "risk" => gettext("Everyone is able to get unauthorized access to information on systems or to modify information unauthorized on systems."), //" Da jeder auf einem System jede Aktion ausführen darf, ist nicht prüfbar wer eine Aktion, wie die Änderung einer Konfiguration auf dem Erzeugungs- und Verteilungsserver, ausgeführt hat.",
            "measure" => gettext("The usage of a (role based) access control helps to restrict system access to authorized users."), //" Nutzung von Rollen-basierter Authentifizierung und Autorisierung, ggf. verbunden mit einem zentralem Authentifizierungs-Server.",
            "hardnessOfImplementation" => array(
                "knowledge" => 2,
                "time" => 3,
                "resources" => 1
            ),
            "usefulness" => 3,
            "level" => 3,
            "implementation" => "Verzeichnisdienst, Plugins",
            "securityProperties" => array(
                "confidentiality" => gettext(""), //" Vertrauliche Informationen über interne Systeme sind geschützt.",
                "integrity" => gettext(""), //" Nur autorisierte Personen/Systeme können z.B. eine Verteilung anstoßen. Dadurch wird eine versehentliche Verteilung eines Software-Artefakts mit Fehlern vermieden."
            ),
            "dependsOn" => array(
                gettext("Defined deployment process"),
                gettext("Defined build process")
            )
        )
    )
);
