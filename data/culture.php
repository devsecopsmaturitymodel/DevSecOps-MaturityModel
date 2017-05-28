<?php
$culture = array (
		gettext ( "Review by any new version" ) => array (
				"risk" => "Eine Person hat wenig Wissen im Bereich Sicherheit und implementiert Schwachstelle oder vergisst Gegenmaßnahmen zu ergreifen.",
				"measure" => "Bei jeder neuen Version eines Systems oder einer Anwendung (in der Entwicklung bei der Überführung einer Branch in den Master, in der System-Administration via Konfigurations-Änderung) wird ein Review aller Änderungen durch eine zweite Person durchgeführt.",
				"hardnessOfImplementation" => array (
						"knowledge" => 2,
						"time" => 2,
						"resources" => 1 
				),
				"usefulness" => 3,
				"level" => 3 
		),
		gettext ( "Information security tragets are communicated" ) => array (
				"risk" => "Mitarbeiter kennen die Sicherheits-Ziele der Organisation nicht.",
				"measure" => "Durch transparente Kommunikation der Sicherheitsziele durch das Management der Organisation wird der Wert von Sicherheit für das Unternehmen klargestellt.",
				"hardnessOfImplementation" => array (
						"knowledge" => 1,
						"time" => 1,
						"resources" => 1 
				),
				"usefulness" => 4,
				"level" => 1 
		),
		gettext ( "Creation of easy abuse stories" ) => array (
				"risk" => "Bei der Erstellung von User Stories werden negative Stories aus Sicht eines Angreifers nicht eingenommen und entsprechend nicht beachtet.",
				"measure" => "Es werden einfache AbUser Stories in agilen Phasen gepflegt. Beispielsweise im Product Backlog und Sprint Backlog.",
				"hardnessOfImplementation" => array (
						"knowledge" => 2,
						"time" => 2,
						"resources" => 1 
				),
				"usefulness" => 4,
				"level" => 2 
		),
		gettext ( "Creation of advanced abuse stories" ) => array (
				"risk" => "Sicherheitsrelevante Betrachtungen werden zu Oberflächlich durchgeführt.",
				"measure" => "Es werden AbUser Stories beschrieben, bei welchem erweitertes Wissen eines Sicherheits-Experten notwendig ist.",
				"hardnessOfImplementation" => array (
						"knowledge" => 4,
						"time" => 2,
						"resources" => 1 
				),
				"usefulness" => 4,
				"level" => 4,
				"dependsOn" => array (
						"Erstellung einfacher AbUser Stories" 
				) 
		),
		gettext ( "Conduction of simple threat modelling" ) => array (
				"risk" => "Bedrohungen werden nicht identifiziert.",
				"measure" => "Bedrohungen werden anhand einer einfachen Risikomatrix mit Schadenpotential und Wahrscheinlichkeit des Eintritts geplegt. Im Product Backlog wird eine Bedrohungsanalyse auf Geschäftsprozess-Ebene gepflegt. Beim Sprint Planning erfolgt eine technische Bedrohungsanalyse.",
				"hardnessOfImplementation" => array (
						"knowledge" => 2,
						"time" => 3,
						"resources" => 1 
				),
				"usefulness" => 3,
				"level" => 3 
		),
		gettext ( "Conduction of advanced threat modelling" ) => array (
				"risk" => "Bedrohungen werden ungenügend identifiziert.",
				"measure" => "Bedrohungen werden modelliert.",
				"hardnessOfImplementation" => array (
						"knowledge" => 4,
						"time" => 3,
						"resources" => 2 
				),
				"usefulness" => 3,
				"level" => 4 
		),
		gettext ( "Each team has a security champion" ) => array (
				"risk" => "Da kein Sicherheits-Verantwortlicher definiert ist, fühlt sich niemand im Team für Informations-Sicherheit verantwort.",
				"measure" => "Pro Team ist ein Sicherheitsverantwortlicher (häufig 'Security-Champion genannt') definiert.",
				"hardnessOfImplementation" => array (
						"knowledge" => 3,
						"time" => 2,
						"resources" => 1 
				),
				"usefulness" => 3,
				"level" => 2 
		),
		gettext ( "Conduction of collaborative security checks with develoeprs and system administrators" ) => array (
				"risk" => "Sicherheitsprüfungen des Quellcodes durch Externe schaffen kein Verständnis für Sicherheit bei Entwicklern und System-Administratoren.",
				"measure" => "Periodische Sicherheitsprüfungen des Quellcodes, bei welchem ein Sicherheitsexperte zusammen mit Entwicklern und System-Adminstratoren Quellcode prüft, erhöhen die Sicherheit und verbreiten Wissen.",
				"hardnessOfImplementation" => array (
						"knowledge" => 3,
						"time" => 2,
						"resources" => 1 
				),
				"usefulness" => 3,
				"level" => 3 
		),
		gettext ( "Security-Lessoned-Learned" ) => array (
				"risk" => "Da Informations-Sicherheits-Vorfälle nicht diskutiert werden, kann aus diesn nicht gelernt werden. Entsprechend können diese öfter auftreten.",
				"measure" => "Durch Sicherheits-Lessoned-Learned, bei welcher Informations-Sicherheits-Vorfälle erörtert werden, erhalten Mitarbeiter Einblick in Informations-Sicherheit und ein erhöhtes Bewusstsein für Sicherheit.",
				"hardnessOfImplementation" => array (
						"knowledge" => 3,
						"time" => 3,
						"resources" => 1 
				),
				"usefulness" => 3,
				"level" => 3 
		),
		gettext ( "Reward of good communication" ) => array (
				"risk" => "Mitarbeiter nehmen das Thema Informations-Sicherheit nicht ernst.",
				"measure" => "Gute Kommunikation über das Thema Informations-Sicherheit wird belohnt. Beispielsweise mittels T-Shirts, girfcards und 'High-Fives'",
				"hardnessOfImplementation" => array (
						"knowledge" => 3,
						"time" => 2,
						"resources" => 1 
				),
				"usefulness" => 3,
				"level" => 2 
		),
		gettext ( "One security expert for each team" ) => array (
				"risk" => "Security-Champions habe kein Experten-Wissen und können Sicherheit, z.B. via Stories, nicht auf hohem Niveau integrieren.",
				"measure" => "Durch einen Web-Sicherheitsexperten kann Sicherheit hinreichend, z.B. via Stories oder durch einen Penetrations-Tests, in Sprints integriert werden",
				"hardnessOfImplementation" => array (
						"knowledge" => 4,
						"time" => 5,
						"resources" => 1 
				),
				"usefulness" => 5,
				"level" => 4 
		),
		gettext ( "Conduction of collaborate team security checks" ) => array (
				"risk" => "Teams sind ungenügend auf für das Thema Sicherheit sensibilisiert.",
				"measure" => "Teams prüfen die Webanwendung eines anderen Teams. Dadurch wird die Sicherheit der Webanwendung, das Sicherheits-Bewustsein und das Wissen im Bereich Sicherheit erhöht. Zusätzlich können neue soziale Kontakte in einer Organisation entstehen.",
				"hardnessOfImplementation" => array (
						"resources" => 2,
						"knowledge" => 4,
						"time" => 4  // Da Teams integriert
				),
				"usefulness" => 2,
				"level" => 4 
		),
		gettext ( "Conduction of war games" ) => array (
				"risk" => "Notfallpläne sind nicht eingeübt und Personen können im Fall einer Bedrohung überfordert mit der Situation sein.",
				"measure" => "War Games sind ein Ansatz der Gamifizierung, bei denen ein Sicherheitsexperte ein Angriffsszenario entwickelt und vorbereitet. Beispielsweise den Ausfall einer Netzwerkschnittstelle eines Datenbankservers oder ein Bruteforce-Angriff auf Benutzerkonten. Anschließend wird das Angriffsszenario auf einer produktionsnahen Umgebung ausgeführt. Das zugehörige Team, welches für die Betreuung des Systems und der Anwendung zuständig ist, hat die Aufgabe das System wieder zu reaktivieren oder den Angriff zu analysieren und Gegenmaßnahmen einzuleiten.",
				"hardnessOfImplementation" => array (
						"knowledge" => 4,
						"time" => 5,
						"resources" => 5 
				),
				"usefulness" => 2,
				"level" => 4 
		) 
);

ksort ( $culture );
$dimensions [gettext ( "Culture and Organisation" )] = array (
		gettext ( "Culture and Organisation" ) => $culture 
);
