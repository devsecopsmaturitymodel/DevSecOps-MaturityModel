<?php
$deployment = array(
    gettext("Defined deployment process") => array(
        "risk" => gettext("Deployments without a defined process are highly prone to errors. For example an old artifact is getting deployed or an untested artifact is getting deployed."), //"Verteilungen können unterschiedlich durchgeführt werden. Wird ein Fehler bei der Verteilung gemacht, welcher manuell korrigiert werden muss, kann die Verfügbarkeit beeinträchtigt werden. Mögliche Scenarien sind entsprechend: Es können Sicherheits-Tests, welche das Abbild validieren vergessen werden. Es wird ein Abbild erzeugt, allerdings ein anderes Abbild deployed.",
        "measure" => gettext("A defined deployment process lowers the possibility of errors during the deployment a lot."), // "Durch einen definierten Verteilungs-Prozess wird die Verfügbarkeit erhöht, da Fehler reduziert werden.",
        "hardnessOfImplementation" => array(
            "knowledge" => 2,
            "time" => 2,
            "resources" => 1
        ),
        "usefulness" => 4,
        "level" => 1,
        "implementation" => "Jenkins, Docker",
        "securityProperties" => array(
            "availability" => gettext("Due to a less error prone deployment the availability is increased."), // "Es wird die Verfügbarkeit erhöht, da Fehler reduziert werden.",
            "integrity" => gettext("The possibility of unintentionally data loss during deployment is decreased."), //"Es wird die Wahrscheinlichkeit reduziert versehentlich Daten zu löschen."
        ),
    ),
    gettext("Same artifact for environments") => array(
        "risk" => gettext("Building of an artifact for different environments means that a not tested artifact might reach the production environment"), // "Es wird ein unterschiedliches Artefakt beziehugnsweise eine unterschiedliche Abbildung der Anwendung für die Testumgebung und die Produktionsumgebung verwendet. Entsprechend können auf der Produktionsumgebung unerwartete Effekte auftreten.",
        "measure" => gettext("Building an artifact once and deploy it to different environments means that only tested artifacts reach the production environment"), // "Das gleiche Artefakt der Anwendung von der Testumgebung wird auf der Produktionsumgebung verwendet.",
        "hardnessOfImplementation" => array(
            "knowledge" => 2,
            "time" => 2,
            "resources" => 1
        ),
        "usefulness" => 4,
        "level" => 3,
        "implementation" => "Docker",
        "securityProperties" => array(
            "integrity" => gettext("Only for vulnerability automated tested artifacts can reach the production environment. The possibility of security related defects which affect the intigrity is lowered."), //"Es ist sicher gestellt, dass das selbe Artefakt der Testumgebung auf die Produktionsumgebung deployed wird.",
            "availability" => gettext("Only automated tested artifacts can reach the production environment. The possibility of defects which affect the avilailbity is lowered."), //"Es ist sicher gestellt, dass nur geprüfte Artefakte auf der Produktionsumgebung verwendet werden, so dass keine ungeprüften ggf. fehlerhaften Artefakte deployed werden."
        ),
        "dependsOn" => array(
            gettext("Defined build process")
        ),
        "samm" => array("OE2-A")
    ),
    gettext("Backup before deployment") => array(//Established rollback/Change management
        "risk" => gettext("During a deployment process there might be errors, so that you want to deploy an old release. Due to changes in the database, this is often not possible."), // "Durch das Einspielen einer Aktualisierung in einer DBMS-Software können Fehler auftreten, welche zu Datenverlust führen.",
        "measure" => gettext("Automatic backups before deployment helps to reduce the fear to perform deployments. The restore processes is tested also."), //"Automatische Backups werden vor der Verteilung neuer Software durchgeführt, sofern die Datenmenge dies in einer angemessenen Zeit zulässt. Wiederherstellung ist geprüft.",
        "hardnessOfImplementation" => array(
            "knowledge" => 1,
            "time" => 2,
            "resources" => 1
        ),
        "usefulness" => 4,
        "level" => 2,
        "implementation" => "A complete backup of the database might be performed. For bigger environments, a Point in Time Recovery for databases should be implemented.",
        "dependsOn" => array(
            gettext("Defined deployment process")
        ),
        "securityProperties" => array(
            "availability" => gettext("Due to a fast restore processes, the availability is increased."), //"Es wird die Verfügbarkeit erhöht, da bei Störungen eine Möglichkeit zur Wiederherstellung eines früheren Stands möglich ist.",
            "integrity" => gettext("A backup can be compared with the actual data to identify unintended changes after an incident."), //"Durch ein Backup kann die Integrität von Daten nach einem Angriff geprüft werden."
        ),
        "samm" => "OE2-A"
    ),
    gettext("Rolling update on deployment") => array(
        "risk" => gettext("While a deployment is performed, the application can not be reached."), //"Durch eine Verteilung ist die Verfügbarkeit des Systems beeinträchtigt.",
        "measure" => gettext("A deployment without downtime is performed."), //"Es ist ein lückenloser Verteilungs-Prozess definiert.",
        "hardnessOfImplementation" => array(
            "knowledge" => 2,
            "time" => 2,
            "resources" => 2
        ),
        "usefulness" => 2,
        "level" => 3,
        "implementation" => "Docker, Webserver, rolling update",
        "dependsOn" => array(
            gettext("Defined deployment process")
        ),
        "securityProperties" => array(
            "availability" => gettext("No downtime during deployment"), //" During a deployment process is no downtime."
        )
    ),
    gettext("Blue/Green Deployment") => array(
        "risk" => gettext("A new version of an artifact can have unknown defects."), //"Durch eine Verteilung kann die Verfügbarkeit des Systems gefährdet sein.",
        "measure" => gettext("By having two or more production environments, a deployment can be performent on one first to see possible defects before it is deployment on the other production environment(s)"), //"Es wird nur auf einen Server die Verteilung angewendet und anschließend eine Post-Verteilungs-Prüfung vorgenommen, nur wenn diese erfolgreich ist, wird auf weitere Server deployed.",
        "hardnessOfImplementation" => array(
            "knowledge" => 1,
            "time" => 2,
            "resources" => 1
        ),
        "usefulness" => 2,
        "level" => 4,
        "implementation" => "<a href='https://martinfowler.com/bliki/BlueGreenDeployment.html'>Blue/Green Deployments</a>",
        "dependsOn" => array(
            gettext ( "Smoke Test" ),
        ),
        "securityProperties" => array(
            "availability" => gettext("Less downtime due to defects."), // "Es besteht weniger Beeinträchtigung der Verfügbarkeit bei Verteilungen."
        )
    ),
    gettext("Environment depending configuration parameters") => array(
        "risk" => gettext("Attackers who compromise source code can see confidential access information like database credentials."), //"Angreifer, welche Zugang zum Quellcode und damit zur Konfiguration erhalten, können schutzwürdige Informationen wie Datenbank-Zugänge einsehen.",
        "measure" => gettext("Configuration parameters are set for each environment not in the source code."), // "Bei Verteilungen werden schutzbedürftige Konfigurationsparameter je nach Umgebung gesetzt.",
        "hardnessOfImplementation" => array(
            "knowledge" => 2,
            "time" => 2,
            "resources" => 1
        ),
        "usefulness" => 4,
        "level" => 2,
        "implementation" => "",
        "securityProperties" => array(
            "confidentiality" => gettext("Only authorized persons get access to confidential credentials and therefore to confidential information."), //"Nur autorisierte Personen/Systeme erhalten Zugriff auf vertrauliche Konfigurationsparameter.",
            "integrity" => gettext("Only authorized persons get access to confidential credentials and therefore not the ability to modify information unauthorized."), //"Nur autorisierte Personen/Systeme können vertrauliche Konfigurationsparameter verändern."
        ),
        "samm" => "SA2-A"
    ),
    gettext("Handover of confidential parameters") => array(
        "risk" => gettext("Attackers who compromise a system can see confidential access information like database credentials. Parameters are often used to set credentials, for example by starting containers or applications. These parameters can often be seen by any one looking at the running processes on that system."), //"Angreifer, welche Zugang zum Quellcode und damit zur Konfiguration erhalten, können schutzwürdige Informationen wie Datenbank-Zugänge einsehen.",
        "measure" => gettext("By using encryption, it is not possible to read credentials easily, e.g. from the file system. Also the usage of a credential management system can help to protect credentials."),
        "hardnessOfImplementation" => array(
            "knowledge" => 2,
            "time" => 2,
            "resources" => 1
        ),
        "usefulness" => 4,
        "level" => 3,
        "implementation" => "",
        "dependsOn" => array(
            gettext("Environment depending configuration parameters"), //"Austausch von Konfigurationsparmetern"
        ),
        "securityProperties" => array(
            "confidentiality" => gettext("Only authorized persons get access to confidential credentials and therefore to confidential information."), // "Nur autorisierte Personen/Systeme erhalten Zugriff auf vertrauliche Konfigurationsparameter.",
            "integrity" =>gettext("Only authorized persons get access to confidential credentials and therefore not the ability to modify information unauthorized."), // "Nur autorisierte Personen/Systeme können vertrauliche Konfigurationsparameter verändern."
        ),
        "samm" => "SA2-A"
    ),
    gettext("Usage of feature toggles") => array( // Configuration driven parameters
        "risk" => gettext("By using environment dependent configuration, some parameters will not be tested correctly. An example for environment dependend configuration is <pre>if (host == 'production') {} else {}</pre>"), //"Es werden unterschiedliche Aktionen in der Testumgebung und der Produktionsumgebung ausgeführt. Beispielsweise folgender Quellcode: if (host == 'production') {} else {}",
        "measure" => gettext("Usage of enviornment independend configration parameter, called feature toggles, helps to enhance the test coverage."), //"Es werden Umgebungsvariablen oder Parameter beim Starten des Artefakts verwendet. Verhalten wird nur über Konfiguration gesteuert und nicht über Hostnamen o.ä..",
        "hardnessOfImplementation" => array(
            "knowledge" => 2,
            "time" => 1,
            "resources" => 1
        ),
        "usefulness" => 2,
        "level" => 3,
        "implementation" => "Docker",
        "securityProperties" => array(
            "availability" => gettext("Through the same actions in different enviroments the likelihood of unpredictable behaivor is reduced."), //"Durch vermeidung unterschiedlicher Aktionen in Test- und Produktionsumgebung ist gleiches Verhalten sicher gestellt und damit die Verfügbarkeit erhöht."
        ),
        "dependsOn" => array(
            gettext("Same artifact for environments")
        ),
        "samm" => "EG1-B"
    )
);
ksort($deployment);
$build = array(
    gettext("Defined build process") => array(
        gettext("Conduction of builds without a defined process are highly prone to errors. For example wrong setting of security related configuration."), //"Die Erzeugung kann bei jedem mal unterschiedlich durchgeführt werden. Wird ein Fehler dabei gemacht können sicherheitsrelevante Konfigurationen falsch gesetzt werden.",
        "measure" => gettext("A defined build process lowers the possibility of errors during the build a lot."), //"Es existiert ein definierter automatisierter Prozess für die Erzeugung, welcher manuell angestoßen werden kann.",
        "hardnessOfImplementation" => array(
            "knowledge" => 2,
            "time" => 3,
            "resources" => 2
        ),
        "usefulness" => 4,
        "level" => 1,
        "implementation" => "Jenkins, Docker",
        "securityProperties" => array(
            "availability" => gettext("Due to a less error prone build the availability is increased."),// "Es wird die Verfügbarkeit erhöht, da Fehler reduziert werden.",
            "integrity" => gettext("The possibility of unintentionally data loss is decreased.") //"Es wird die Wahrscheinlichkeit reduziert versehentlich Daten zu verändern."
        )
    ),
    gettext("Regular tests") => array(
        "risk" => gettext("A time cap between pushing source code to the version control system and feedback regarding defects makes it harder to correct the found defects. A developer or system administrator has to dick into the complex change again."), //"Vom pushen von Quellcode in die Versionskontrolle bis zur Rückmeldung, dass dieser Quellcode eine Schwachstelle enthält, kann Zeit vergehen. Dadurch ist es für den Entwickler schwieriger, gepushten Quellcode nachzuvollziehen und die Schwachstelle nachhaltig zu beseitigen. ",
        "measure" => gettext("On each push and/or periodically automatic tests are conducted."), //"Bei jedem Push oder periodisch wird eine Verteilung auf eine Testumgebung durchgeführt und automatisch Tests- und Verifikationen durchgeführt, mindestens für die geänderten Quellcode-Bereiche.",
        "hardnessOfImplementation" => array(
            "knowledge" => 1,
            "time" => 1,
            "resources" => 1
        ),
        "usefulness" => 2,
        "level" => 2,
        "implementation" => "",
        "dependsOn" => array(
            gettext("Defined build process")
        ),
        "securityProperties" => array(
            "integrity" => gettext("As feedback comes fast, defects can be addressed fast. Less defects will be deployed to production."), //"Für jede Änderung der Software erfolgt zeitnah eine Prüfung. Bei versehentlichem Einführen von Schwachstellen in den Quellcode wird eine Rückmeldung gegeben, so dass die ungewollte Schwachstelle entfernt werden kann."
        ),
    ),
    gettext("Building and testing of artifacts in virtual environments") => array(
        "risk" => gettext("While building artifacts and testing artifacts, third party systems,applications,frameworks and libaries are used. These might be malisouse because they include mailouse libaries or because they are changed during the delivery."), //"Erlangt ein Angreifer Zugriff auf das Versionskontrollsystem eines Projekts oder auf die Konfiguration zur Erzeugung, kann dieser ggf. Zugriff auf das Erzeungs-System erlangen und dadurch andere Erzeugungsaufträge kompromittieren.",
        "measure" => gettext("Each step during the build and testing is done in a separate virtual environments, which gets destroyed afterwards."), //"Jeder Schritt der Erzeugung findet in einer seperaten virtuellen Umgebung statt.",
        "hardnessOfImplementation" => array(
            "knowledge" => 2,
            "time" => 2,
            "resources" => 2
        ),
        "usefulness" => 2,
        "level" => 4,
        "implementation" => "Docker",
        "dependsOn" => array(
            gettext("Defined build process")
        ),
        "securityProperties" => array(
            "integrity" => gettext(""), //"Da Erzeungsaufträge sich nicht gegenseitig beeinflussen können, ist die Integrität nicht durch andere Erzeugungsaufträge gefährdet."
        )
    ),
    gettext("Signing of artifacts") => array(
        "risk" => gettext("Unauthorized manipulation of artifacts might not be recognized. For example pushing of an image with malicious code in the Docker registry."), //"Manipuliert ein Angreifer ein Artefakt oder ein Abbild, wird dies ggf. nicht bemerkt.",
        "measure" => gettext("Signing of artifacts helps to ensure that artifacts are not unauthorized manipulated."), //"Durch Signierung und Signatur-Prüfungen von Artefakten und Abbildern ist sichergestellt, dass eine Manipulation oder der Austausch eines Artefakts beziehugnsweise Abbilds bemerkt wird.",
        "hardnessOfImplementation" => array(
            "knowledge" => 2,
            "time" => 2,
            "resources" => 2
        ),
        "usefulness" => 2,
        "level" => 4,
        "implementation" => "",
        "dependsOn" => array(
            gettext("Defined build process")
        ),
        "securityProperties" => array(
            "integrity" => gettext("Through signing the integrity of artifacts is ensured."), //"Durch Signierung von Artefakten und Abbildern ist sichergestellt, dass eine Manipulation oder der Austausch eines Artefakts beziehugnsweise Abbilds bemerkt wird."
        ),
        "samm" => "OA3-B"
    )
);
ksort($build);

$dimensions [gettext("Build and Deployment")] = array(
    gettext("Build") => $build,
    gettext("Deployment") => $deployment
);
