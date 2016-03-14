<?php

$culture = array("Sicherheitsziele sind kommuniziert" => array(
    "risk" => "",
    "measure" => "",
    "easeOfImplementation" => array(
        "knowledge" => 3,
        "time" => 2,
        "resources" => 1
    ),
    "usefulness" => 3,
    "level" => 1
),
    "Sicherheits-Kollaboration" => array(
        "risk" => "",
        "measure" => "Sicherheits- und Datenschutzanforderungen werden in Standups diskutiert und in Stories definiert.",
        "easeOfImplementation" => array(
            "knowledge" => 3,
            "time" => 2,
            "resources" => 1
        ),
        "usefulness" => 3,
        "level" => 1
    ),
    "Sicherheitsvorfälle werden ernst genommen" => array(
        "risk" => "",
        "measure" => "Sicherheitsvorfälle werden ernst genommen.",
        "easeOfImplementation" => array(
            "knowledge" => 2,
            "time" => 2,
            "resources" => 1
        ),
        "usefulness" => 3,
        "level" => 1
    ),
    "Pro Team ist ein Sicherheitsverantwortlicher definiert" => array(
        "risk" => "",
        "measure" => "Pro Team ist ein Sicherheitsverantwortlicher (häufig 'Security-Champion genannt') definiert.",
        "easeOfImplementation" => array(
            "knowledge" => 3,
            "time" => 2,
            "resources" => 1
        ),
        "usefulness" => 3,
        "level" => 2
    ),
    "Kollaburations-Plattform" => array(
        "risk" => "",
        "measure" => "Sicherheit wird auf einer Kollaburations-Plattform diskutiert",
        "easeOfImplementation" => array(
            "knowledge" => 3,
            "time" => 2,
            "resources" => 1
        ),
        "usefulness" => 3,
        "level" => 2
    ),
    "Secure Test Driven Development" => array(
        "risk" => "",
        "measure" => "",
        "easeOfImplementation" => array(
            "knowledge" => 3,
            "time" => 2,
            "resources" => 1
        ),
        "usefulness" => 3,
        "level" => 2,
        "comment" => "Emperical studies conducted on the practise of TDD and the differences between Test-First and Test-Last have shown the differences between the two to be inconclusive in terms of productivity. http://www.diva-portal.org/smash/get/diva2:806620/FULLTEXT01.pdf S.22 "
    ),
    "Regelmäßige Awareness Trainings" => array(
        "risk" => "",
        "measure" => "",
        "easeOfImplementation" => array(
            "knowledge" => 3,
            "time" => 2,
            "resources" => 1
        ),
        "usefulness" => 3,
        "level" => 2
    ),
    "Secure Timeline game" => array(
        "risk" => "",
        "measure" => "Secure Timeline game",
        "easeOfImplementation" => array(
            "knowledge" => 3,
            "time" => 2,
            "resources" => 1
        ),
        "usefulness" => 3,
        "level" => 2
    ),
    "Validierung von Risiken bei jedem Check-In" => array(
        "risk" => "",
        "measure" => "",
        "easeOfImplementation" => array(
            "knowledge" => 3,
            "time" => 2,
            "resources" => 1
        ),
        "usefulness" => 3,
        "level" => 3
    ),
    "Security Code Reviews" => array(
        "risk" => "",
        "measure" => "Periodische Security Code Reviews, bei welchem ein Sicherheitsexperte zusammen mit Entwicklern und System-Adminstratoren Quellcode prüft, erhöhen die Sicherheit und verbreiten Wissen.",
        "easeOfImplementation" => array(
            "knowledge" => 3,
            "time" => 2,
            "resources" => 1
        ),
        "usefulness" => 3,
        "level" => 3
    ),
    "Sicherheits-Lessoned-Learned mit dem gesamten Team" => array(
        "risk" => "",
        "measure" => "",
        "easeOfImplementation" => array(
            "knowledge" => 3,
            "time" => 2,
            "resources" => 1
        ),
        "usefulness" => 3,
        "level" => 3
    ),
    "Gute Kommunikation wird belohnt" => array(
        "risk" => "",
        "measure" => "Gute Kommunikation über das Thema IT-Sicherheit wird belohnt. Beispielsweise mittels T-Shirts, girfcards und 'High-Fives' [#lackey2016]",
        "easeOfImplementation" => array(
            "knowledge" => 3,
            "time" => 2,
            "resources" => 1
        ),
        "usefulness" => 3,
        "level" => 3
    ),
    "Alarme gehen automatisch in Kollaburations-Plattform" => array(
        "risk" => "",
        "measure" => "",
        "easeOfImplementation" => array(
            "knowledge" => 3,
            "time" => 2,
            "resources" => 1
        ),
        "usefulness" => 3,
        "level" => 3,
        "dependsOn" => array("Kollaburations-Plattform")
    ),
    "Technische Risikoanalyse bei jedem Sprint" => array(
        "risk" => "",
        "measure" => "",
        "easeOfImplementation" => array(
            "knowledge" => array(
                "security" => 5,

            ),
            "time" => 2,
            "resources" => 1
        ),
        "usefulness" => 3,
        "level" => 4
    ),
    "Sicherheits-Richtlinien" => array(
        "risk" => "Quellcode kann unsicher entworfen werden, insbesondere unter Zeitdruck.",
        "measure" => "Jedes Team definiert Sicherheits-Richtlinien für die genutzten Technologien.",
        "easeOfImplementation" => array(
            "knowledge" => array(
                "security" => 5,
                "development" => 5
            ),
            "time" => 4,
            "resources" => 1
        ),
        "usefulness" => 3,
        "level" => 4,
        "comment" => "Da Teams unterschiedliche Technologien nutzen können, kann es sinnvoll sein eine generelle unternehmensweite Sicherheits-Richtlinie festzulegen und eine weitere pro Team für die genutzten Technologien."
    ),
    "Secure „Pair Programming/Analyses“" => array(
        "risk" => "",
        "measure" => "",
        "easeOfImplementation" => array(
            "knowledge" => array(
                "security" => 5,
                "development" => 5
            ),
            "time" => 4,
            "resources" => 1
        ),
        "usefulness" => 3,
        "level" => 4
    ),
    "Sicherheitsexperte pro Team" => array(
        "risk" => "Security-Champions habe kein Experten-Wissen und können Sicherheit, z.B. via Stories, nicht auf hohem Niveau integrieren.",
        "measure" => "Durch einen Web-Sicherheitsexperten kann Sicherheit hinreichend, z.B. via Stories oder durch einen Penetrations-Tests, in Sprints integriert werden [#DevOpsInPractice2014, S. 20]",
        "easeOfImplementation" => array(
            "knowledge" => array(
                "security" => 5,
                "expertise" => 3
            ),
            "time" => 5,
            "resources" => 1
        ),
        "usefulness" => 5,
        "level" => 4
    ),
    "Kunden-Rückmeldungs-Umgebung" => array(
        "risk" => "Es sind schwer durch Automatisierung zu findenen Schwachstellen in der Anwendung vorhanden.",
        "measure" => "Kunden haben Zugriff auf eine Vor-Produktions-Version und können das System prüfen.",
        "easeOfImplementation" => array(
            "knowledge" => array(
                "operation" => 3,
                "security" => 3
            ),
            "time" => 2,
            "resources" => 3
        ),
        "usefulness" => 2,
        "level" => 4
    ),
    "Security War Game" => array(
        "risk" => "TODO (auch implementation/time/resources/usefullness",
        "measure" => "https://soundcloud.com/owasp-podcast/security-war-games-with-sam-guckenheimer-at-rugged-devops-rsac-2016",
        "easeOfImplementation" => array(
            "knowledge" => array(
                "operation" => 3,
                "security" => 3
            ),
            "time" => 2,
            "resources" => 3
        ),
        "usefulness" => 2,
        "level" => 4
    ),
);

ksort($culture);
$dimensions["Kultur und Organisation"] = array(
    "Kultur und Organisation" => $culture
);