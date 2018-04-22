<?php
$culture = array(
    gettext("Approval by reviewing any new version") => array(
        "risk" => gettext("An individual might forget to add security measures to source code or infrastructure components."), //"Eine Person hat wenig Wissen im Bereich Sicherheit und implementiert Schwachstelle oder vergisst Gegenmaßnahmen zu ergreifen."
        "measure" => gettext("On each new version (e.g. Pull Request) of source code or infrastructure components a review of the changes are performed by at least one additional person (two eyes principal). The focus of the review a security. After review, approval is given by the reviewer."), // "Bei jeder neuen Version eines Systems oder einer Anwendung (in der Entwicklung bei der Überführung einer Branch in den Master, in der System-Administration via Konfigurations-Änderung) wird ein Review aller Änderungen durch eine zweite Person durchgeführt."
        "hardnessOfImplementation" => array(
            "knowledge" => 2,
            "time" => 2,
            "resources" => 1
        ),
        "usefulness" => 3,
        "level" => 3,
        "samm" => "IR1-B" //DIfference
    ),
    gettext("Information security tragets are communicated") => array(
        "risk" => gettext("Employees don't known the security targets of the organication. Therefore security is not as much considered during development and administration as it should be."), // "Mitarbeiter kennen die Sicherheits-Ziele der Organisation nicht."
        "measure" => gettext("With transparent communication of the security targets through the top management security is enforced in teams."), // "Durch transparente Kommunikation der Sicherheitsziele durch das Management der Organisation wird der Wert von Sicherheit für das Unternehmen klargestellt."
        "hardnessOfImplementation" => array(
            "knowledge" => 1,
            "time" => 1,
            "resources" => 1
        ),
        "usefulness" => 4,
        "level" => 1,
        "samm" => "SM1-B"
    ),
    gettext("Creation of simple abuse stories") => array(
        "risk" => gettext("User stories mostly don't consider security considerations. Security flaws are discovered too late in the development and deployment process."), // "Bei der Erstellung von User Stories werden negative Stories aus Sicht eines Angreifers nicht eingenommen und entsprechend nicht beachtet."
        "measure" => gettext("During the creation of user stories abuse stories are created for a user story."), // "Es werden einfache AbUser Stories in agilen Phasen gepflegt.."
        "hardnessOfImplementation" => array(
            "knowledge" => 2,
            "time" => 2,
            "resources" => 1
        ),
        "usefulness" => 4,
        "level" => 2,
        "samm" => "TA2-A",
        "implementation" => "<a href='https://www.owasp.org/index.php/Agile_Software_Development:_Don%27t_Forget_EVIL_User_Stories'>Don't Forget EVIL User Stories</a> and <a href='http://safecode.org/publication/SAFECode_Agile_Dev_Security0712.pdf'>Practical Security Stories and Security Tasks for Agile Development Environments</a>"
    ),
    gettext("Creation of advanced abuse stories") => array(
        "risk" => gettext("Simple user stories are not going deep enough. Relevant security conciderations are performed. Security flaws are discovered too late in the development and deployment process"),
        "measure" => gettext("Advanced abuse stories are created with "), // "Es werden AbUser Stories beschrieben, bei welchem erweitertes Wissen eines Sicherheits-Experten notwendig ist."
        "hardnessOfImplementation" => array(
            "knowledge" => 4,
            "time" => 2,
            "resources" => 1
        ),
        "usefulness" => 4,
        "level" => 4,
        "dependsOn" => array(
            gettext("Creation of simple abuse stories")
        ),
        "samm" => "TA2-A",
        "implementation" => "<a href='https://www.owasp.org/index.php/Agile_Software_Development:_Don%27t_Forget_EVIL_User_Stories'>Don't Forget EVIL User Stories</a> and <a href='http://safecode.org/publication/SAFECode_Agile_Dev_Security0712.pdf'>Practical Security Stories and Security Tasks for Agile Development Environments</a>"
    ),
    gettext("Conduction of simple threat modelling on business level") => array(
        "risk" => gettext("Business related threats are discovered too late in the development and deployment process."),
        "measure" => gettext("Threat modelling on business level is performed during the product backlog creation"), // "Bedrohungen werden anhand einer einfachen Risikomatrix mit Schadenpotential und Wahrscheinlichkeit des Eintritts geplegt. Im Product Backlog wird eine Bedrohungsanalyse auf Geschäftsprozess-Ebene gepflegt. Beim Sprint Planning erfolgt eine technische Bedrohungsanalyse."
        "hardnessOfImplementation" => array(
            "knowledge" => 2,
            "time" => 3,
            "resources" => 1
        ),
        "usefulness" => 3,
        "level" => 3,
        "samm" => "TA1-A"
    ),
    gettext("Conduction of simple threat modelling on technical level") => array(
        "risk" => gettext("Technical related threats are discovered too late in the development and deployment process."),
        "measure" => gettext("Threat modelling on technical level is performed during the product sprint planning"), // "Bedrohungen werden anhand einer einfachen Risikomatrix mit Schadenpotential und Wahrscheinlichkeit des Eintritts geplegt. Im Product Backlog wird eine Bedrohungsanalyse auf Geschäftsprozess-Ebene gepflegt. Beim Sprint Planning erfolgt eine technische Bedrohungsanalyse."
        "hardnessOfImplementation" => array(
            "knowledge" => 2,
            "time" => 3,
            "resources" => 1
        ),
        "usefulness" => 3,
        "level" => 3,
        "samm" => "TA1-A"
    ),
    gettext("Conduction of advanced threat modelling") => array(
        "risk" => gettext("Inadequately identification of business and technical risks."),
        "measure" => gettext("Deep threat modelling, for example by using data flow diagramms, is performed."),
        "hardnessOfImplementation" => array(
            "knowledge" => 4,
            "time" => 3,
            "resources" => 2
        ),
        "usefulness" => 3,
        "level" => 4,
        "samm" => "TA2-B"
    ),
    gettext("Each team has a security champion") => array(
        "risk" => gettext("No one feels responsible for security and the 'security guy' has not enough time for each team."), // "Da kein Sicherheits-Verantwortlicher definiert ist, fühlt sich niemand im Team für Informations-Sicherheit verantwort."
        "measure" => gettext("Each team defines an individual to be responsible for security. Often they are referred as 'security champions'"),
        "hardnessOfImplementation" => array(
            "knowledge" => 3,
            "time" => 2,
            "resources" => 1
        ),
        "usefulness" => 3,
        "level" => 2,
        "samm" => "EG2-B" //IM1
    ),
    gettext("Conduction of collaborative security checks with develoeprs and system administrators") => array(
        "risk" => gettext("Security checks by external companies do not increase the understand of an application/system for internal employees."), //"Sicherheitsprüfungen des Quellcodes durch Externe schaffen kein Verständnis für Sicherheit bei Entwicklern und System-Administratoren.",
        "measure" => gettext("Periodically security reviews of the source code, in which the security experts and developers and system administrators are envolved, are increasing the security and the security knowledge in teams."), //"Periodische Sicherheitsprüfungen des Quellcodes, bei welchem ein Sicherheitsexperte zusammen mit Entwicklern und System-Adminstratoren Quellcode prüft, erhöhen die Sicherheit und verbreiten Wissen.",
        "hardnessOfImplementation" => array(
            "knowledge" => 3,
            "time" => 2,
            "resources" => 1
        ),
        "usefulness" => 3,
        "level" => 3,
        "samm" => "IR1-B"
    ),
    gettext("Security-Lessoned-Learned") => array(
        "risk" => gettext("After an incident, a simular incident might happen in the future."), //"Da Informations-Sicherheits-Vorfälle nicht diskutiert werden, kann aus diesn nicht gelernt werden. Entsprechend können diese öfter auftreten.",
        "measure" => gettext("A lessons learned after an incident helps in continuous improvement. Meetings with Security Champions are a good place for lessons learned."), //"Durch Sicherheits-Lessoned-Learned, bei welcher Informations-Sicherheits-Vorfälle erörtert werden, erhalten Mitarbeiter Einblick in Informations-Sicherheit und ein erhöhtes Bewusstsein für Sicherheit.",
        "hardnessOfImplementation" => array(
            "knowledge" => 3,
            "time" => 3,
            "resources" => 1
        ),
        "usefulness" => 3,
        "level" => 3,
        "samm" => "IM-3, ST-3, SR2-B"
    ),
    gettext("Reward of good communication") => array(
        "risk" => gettext("Employees are not getting excited about security."), //"Mitarbeiter nehmen das Thema Informations-Sicherheit nicht ernst.",
        "measure" => gettext("Rewarding good communication helps to encourage people in the area of security. Examples are T-Shirts, giftcards and 'High-Fives' on the floor."), //"Gute Kommunikation über das Thema Informations-Sicherheit wird belohnt. Beispielsweise mittels T-Shirts, girfcards und 'High-Fives'",
        "hardnessOfImplementation" => array(
            "knowledge" => 3,
            "time" => 2,
            "resources" => 1
        ),
        "usefulness" => 3,
        "level" => 2,
        "implementation" => "One example is the distributon of buttons as a reward, see <a href='https://www.owasp.org/index.php/OWASP_Security_Buttons_Project'>Don't Forget EVIL User Stories</a> and <a href='http://safecode.org/publication/SAFECode_Agile_Dev_Security0712.pdf'>OWASP Security Buttons Project</a>"
    ),
    gettext("Aligning security in teams") => array(
        "risk" => gettext("Everyone in a project team should feel responsible for security. The concept of Security Champions might suggest that only the security champion is repsonsible for security."), //"Security-Champions habe kein Experten-Wissen und können Sicherheit, z.B. via Stories, nicht auf hohem Niveau integrieren.",
        "measure" => gettext("By aligning security professionals with project teams, a higher security standard can be reached."), //"Durch einen Web-Sicherheitsexperten kann Sicherheit hinreichend, z.B. via Stories oder durch einen Penetrations-Tests, in Sprints integriert werden",
        "hardnessOfImplementation" => array(
            "knowledge" => 4,
            "time" => 5,
            "resources" => 1
        ),
        "implementation" => "In meetings for software design, sprint planning, etc. security professionals take part in order to give suggestions.",
        "usefulness" => 5,
        "level" => 4,
        "samm" => "EG2-B"
    ),
    gettext("Conduction of collaborative team security checks") => array(
        "risk" => gettext("Teams are not having enough inside in security."), //"Teams sind ungenügend auf für das Thema Sicherheit sensibilisiert.",
        "measure" => gettext("Team testing the security of projects of other teams. This enhances the security awareness and knowledge."), //"Teams prüfen die Webanwendung eines anderen Teams. Dadurch wird die Sicherheit der Webanwendung, das Sicherheits-Bewustsein und das Wissen im Bereich Sicherheit erhöht. Zusätzlich können neue soziale Kontakte in einer Organisation entstehen.",
        "hardnessOfImplementation" => array(
            "resources" => 2,
            "knowledge" => 4,
            "time" => 4  // Da Teams integriert
        ),
        "usefulness" => 2,
        "level" => 4,
        "samm" => "EG2-A"
    ),
    gettext("Conduction of war games") => array(
        "risk" => gettext("To understand incident response plans during an incident is hard."), //"Notfallpläne sind nicht eingeübt und Personen können im Fall einer Bedrohung überfordert mit der Situation sein.",
        "measure" => gettext("War Games train incidents. A security professional creates attack scenarios in a testing environment. The teams are going thorough the training and learn how to react in case of an incident."), //"War Games sind ein Ansatz der Gamifizierung, bei denen ein Sicherheitsexperte ein Angriffsszenario entwickelt und vorbereitet. Beispielsweise den Ausfall einer Netzwerkschnittstelle eines Datenbankservers oder ein Bruteforce-Angriff auf Benutzerkonten. Anschließend wird das Angriffsszenario auf einer produktionsnahen Umgebung ausgeführt. Das zugehörige Team, welches für die Betreuung des Systems und der Anwendung zuständig ist, hat die Aufgabe das System wieder zu reaktivieren oder den Angriff zu analysieren und Gegenmaßnahmen einzuleiten.",
        "hardnessOfImplementation" => array(
            "knowledge" => 4,
            "time" => 5,
            "resources" => 5
        ),
        "usefulness" => 2,
        "level" => 4
    )
);

ksort($culture);
$dimensions [gettext("Culture and Org.")] = array(
    gettext("Culture and Org.") => $culture
);
