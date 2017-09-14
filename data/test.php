<?php
$dimensions [gettext ( "Test and Verification" )] = array (
		gettext ( "Dynamic depth" ) => array (
				gettext ( "Simple Scan" ) => array (
						"risk" => gettext(""), //" Mangelhafte Sicherheitsprüfungen. Nach einer Verteilung können einfache Schwachstellen lange Zeit unerkannt in der Produktionsumgebung vorhanden sein.",
						"measure" => gettext(""), //" Ein einfacher Scan wird mit einem Web-Security-Scanner regelmäßig durchgeführt. Sofern die Prüfung in angemessener Zeit erfolgt, während jeder Verteilung.",
						"hardnessOfImplementation" => array (
								"knowledge" => 2,
								"time" => 3,
								"resources" => 1 
						),
						"usefulness" => 2,
						"level" => 1,
						"dependsOn" => array (
								gettext ( "Defined build process" ) 
						),
						"securityProperties" => array (
								"availability" => gettext(""), //" Durch Erkennung und Behebung von Schwachstellen bevor diese in Produktion gehen ist die Verfügbarkeit von Informationen im gesamten Systems erhöht.",
								"integrity" => gettext(""), //" Durch Erkennung und Behebung von Schwachstellen bevor diese in Produktion gehen ist die Integrität von Informationen im gesamten Systems erhöht.",
								"confidentiality" => gettext(""), //" Durch Erkennung und Behebung von Schwachstellen bevor diese in Produktion gehen ist die Vertraulichkeit von Informationen im gesamten Systems erhöht."
						),
						"samm" => "ST2" 
				),
				gettext ( "Usage of different roles" ) => array (
						"risk" => gettext(""), //" Teile der Anwendung, insbesondere welche mit Authentifizierung, sind beim Spidern mit einem Web-Security-Scanner nicht abgedeckt.",
						"measure" => gettext(""), //" Integration von Authentifizierung mit verschiedenen Rollen und Session Management",
						"hardnessOfImplementation" => array (
								"knowledge" => 3,
								"time" => 3,
								"resources" => 1 
						),
						"usefulness" => 2,
						"level" => 2,
						"dependsOn" => array (
								"Einfacher Scan" 
						),
						"securityProperties" => array (
								"availability" => gettext(""), //" Durch Erkennung und Behebung von Schwachstellen bevor diese in Produktion gehen ist die Verfügbarkeit von Informationen im gesamten Systems erhöht.",
								"integrity" => gettext(""), //" Durch Erkennung und Behebung von Schwachstellen bevor diese in Produktion gehen ist die Integrität von Informationen im gesamten Systems erhöht.",
								"confidentiality" => gettext(""), //" Durch Erkennung und Behebung von Schwachstellen bevor diese in Produktion gehen ist die Vertraulichkeit von Informationen im gesamten Systems erhöht."
						) 
				),
				gettext ( "Coverage of client side dynamic components" ) => array (
						"risk" => gettext(""), //" Teile der Anwendung, insbesondere welche mit vom Browser interpretierten dynamischen Inhalten wie JavaScript, sind beim Spidern mit einem Web-Security-Scanner nicht abgedeckt.",
						"measure" => gettext(""), //" Nutzung eines Spiders welcher dynamische Inhalte ausführt.",
						"hardnessOfImplementation" => array (
								"knowledge" => 3,
								"time" => 3,
								"resources" => 1 
						),
						"usefulness" => 4,
						"level" => 2,
						"dependsOn" => array (
								"Abdeckung von Rollen" 
						),
						"securityProperties" => array (
								"availability" => gettext(""), //" Durch Erkennung und Behebung von Schwachstellen bevor diese in Produktion gehen ist die Verfügbarkeit von Informationen im gesamten Systems erhöht.",
								"integrity" => gettext(""), //" Durch Erkennung und Behebung von Schwachstellen bevor diese in Produktion gehen ist die Integrität von Informationen im gesamten Systems erhöht.",
								"confidentiality" => gettext(""), //" Durch Erkennung und Behebung von Schwachstellen bevor diese in Produktion gehen ist die Vertraulichkeit von Informationen im gesamten Systems erhöht."
						),
						"samm" => "ST-2" 
				),
				
				gettext ( "Coverage of server side components" ) => array (
						"risk" => gettext(""), //" Serverseitige Kommunikation, wie bei der Nutzung von Microservices, ist ungeprüft.",
						"measure" => gettext(""), //" Backend-Kommunikation ist aufgezeichnet und ist geprüft.",
						"hardnessOfImplementation" => array (
								"knowledge" => 4,
								"time" => 5,
								"resources" => 2 
						),
						"usefulness" => 3,
						"level" => 4,
						"dependsOn" => array (
								"Einfacher Scan" 
						),
						"securityProperties" => array (
								"availability" => gettext(""), //" Durch Erkennung und Behebung von Schwachstellen bevor diese in Produktion gehen ist die Verfügbarkeit von Informationen im gesamten Systems erhöht.",
								"integrity" => gettext(""), //" Durch Erkennung und Behebung von Schwachstellen bevor diese in Produktion gehen ist die Integrität von Informationen im gesamten Systems erhöht.",
								"confidentiality" => gettext(""), //" Durch Erkennung und Behebung von Schwachstellen bevor diese in Produktion gehen ist die Vertraulichkeit von Informationen im gesamten Systems erhöht."
						) 
				),
				gettext ( "Coverage of sequential operations" ) => array (
						"risk" => gettext(""), //" Sequenziellen Aktionen wie Workflows sind beim Spidern mit einem Web-Security-Scanner nicht abgedeckt.",
						"measure" => gettext(""), //" Seqenzielle Aktionen werden definiert, so dass der Scanner diese in der korrekten Reihenfolge prüft.",
						"hardnessOfImplementation" => array (
								"knowledge" => 3,
								"time" => 3,
								"resources" => 1 
						),
						"usefulness" => 5,
						"level" => 3,
						"implementation" => "cURL",
						"dependsOn" => array (
								"Abdeckung von Rollen" 
						) 
				),
				gettext ( "Coverage of hidden paths" ) => array (
						"risk" => gettext(""), //" Versteckte Pfade, wie beispielsweise APIs werden nicht abgedeckt.",
						"measure" => gettext(""), //" Versteckte Pfade werden abgedeckt.",
						"hardnessOfImplementation" => array (
								"knowledge" => 3,
								"time" => 2,
								"resources" => 1 
						),
						"usefulness" => 5,
						"level" => 3,
						"implementation" => "cURL",
						"dependsOn" => array (
								"Abdeckung von Rollen" 
						) 
				),
				gettext ( "Usage of multiple scanners" ) => array (
						"risk" => gettext(""), //" Ein Web-Security-Scanner ist ggf. nicht optimiert für alle genutzten Technologien. Entsprechend können Schwachstellen unerkannt bleiben.",
						"measure" => gettext(""), //" Es sind weitere spezielle Scanner eingesetzt.",
						"hardnessOfImplementation" => array (
								"knowledge" => 5,
								"time" => 3,
								"resources" => 5 
						),
						"usefulness" => 1,
						"level" => 4,
						"dependsOn" => array (
								"Abdeckung von Rollen" 
						),
						"securityProperties" => array (
								"availability" => gettext(""), //" Durch Erkennung und Behebung von Schwachstellen bevor diese in Produktion gehen ist die Verfügbarkeit von Informationen im gesamten Systems erhöht.",
								"integrity" => gettext(""), //" Durch Erkennung und Behebung von Schwachstellen bevor diese in Produktion gehen ist die Integrität von Informationen im gesamten Systems erhöht.",
								"confidentiality" => gettext(""), //" Durch Erkennung und Behebung von Schwachstellen bevor diese in Produktion gehen ist die Vertraulichkeit von Informationen im gesamten Systems erhöht."
						) 
				),
				gettext ( "Coverage of more input vectors" ) => array (
						"risk" => gettext(""), //" Teile der Anwendung, insbesondere welche mit speziell formatierten oder kodierten Parametern (z.B. Suchmaschinenoptimierte Parameter in der URL, Kommunikation via WebSockets, Parameter in JSON oder Base64-Kodierte Parameter), werden beim Erfassen bestehender Pfade mit einem Web-Security-Scanner nicht abgedeckt.",
						"measure" => gettext(""), //" Spezielle Parameter und Kodierungen sind in eingesetzten Web-Security-Scannern definiert.",
						"hardnessOfImplementation" => array (
								"knowledge" => 5,
								"time" => 5,
								"resources" => 1 
						),
						"usefulness" => 4,
						"level" => 3,
						"securityProperties" => array (
								"availability" => gettext(""), //" Durch Erkennung und Behebung von Schwachstellen bevor diese in Produktion gehen ist die Verfügbarkeit von Informationen im gesamten Systems erhöht.",
								"integrity" => gettext(""), //" Durch Erkennung und Behebung von Schwachstellen bevor diese in Produktion gehen ist die Integrität von Informationen im gesamten Systems erhöht.",
								"confidentiality" => gettext(""), //" Durch Erkennung und Behebung von Schwachstellen bevor diese in Produktion gehen ist die Vertraulichkeit von Informationen im gesamten Systems erhöht."
						),
						"dependsOn" => array (
								"Abdeckung von Rollen" 
						) 
				),
				gettext ( "Coverage analysis" ) => array (
						"risk" => gettext(""), //" Teile der Anwendung sind beim Spidern mit einem Web-Security-Scanner nicht abgedeckt.",
						"measure" => gettext(""), //" Prüfung mittels Abdeckungsanalyse-Werkzeuge welche Teile beim Spidern beziehungsweise bei der Nutzung von eigenen Werkzeugen nicht angesprochen werden um Justierung vornehmen zu können.",
						"hardnessOfImplementation" => array (
								"knowledge" => 4,
								"time" => 5,
								"resources" => 3 
						),
						"usefulness" => 4,
						"level" => 4,
						"implementation" => "OWASP Code Pulse",
						"securityProperties" => array (
								"availability" => gettext(""), //" Durch Erkennung und Behebung von Schwachstellen bevor diese in Produktion gehen ist die Verfügbarkeit von Informationen im gesamten Systems erhöht.",
								"integrity" => gettext(""), //" Durch Erkennung und Behebung von Schwachstellen bevor diese in Produktion gehen ist die Integrität von Informationen im gesamten Systems erhöht.",
								"confidentiality" => gettext(""), //" Durch Erkennung und Behebung von Schwachstellen bevor diese in Produktion gehen ist die Vertraulichkeit von Informationen im gesamten Systems erhöht."
						) 
				) 
		),
		gettext ( "Static depth" ) => array (
				gettext ( "Test of server side application components with known vulnerabilities" ) => array (
						"risk" => gettext(""), //" Eingesetzte serverseitige Komponten können Fehler enthalten, so dass die Informationssicherheit beeinträchtigt wird. Diese können u.a. erst nach Verteilung der Webanwendung bekannt werden.",
						"measure" => gettext(""), //" Tests auf serverseitige Komponenten mit bekannten Schwachstellen werden regelmäßig durchgeführt, beispielsweise jede Nacht.",
						"hardnessOfImplementation" => array (
								"knowledge" => 1,
								"time" => 2,
								"resources" => 1 
						),
						"usefulness" => 5,
						"level" => 1,
						"dependsOn" => array (
								gettext ( "Defined build process" ) 
						),
						"implementation" => "OWASP Dependency Check",
						"securityProperties" => array (
								"integrity" => gettext(""), //" Durch Tests auf Komponenten mit bekannten Schwachstellen ist die Wahrscheinlichkeit geringer, dass durch Schwachstellen in Komponenten Daten von nicht autorisierten Personen oder Systemen verändert werden können.",
								"availability" => gettext(""), //" Durch Tests auf Komponenten mit bekannten Schwachstellen ist die Wahrscheinlichkeit geringer, dass Schwachstellen in Komponten ausgenutzt werden, um die Verfügbarkeit des Systems zu beeinträchtigen.",
								"confidentiality" => gettext(""), //" Durch Tests auf Komponenten mit bekannten Schwachstellen ist die Wahrscheinlichkeit geringer, dass durch Schwachstellen in Komponten Daten von nicht autorisierten Personen oder Systemen eingesehen werden können."
						) 
					// will be "samm" => "SA"
				),
				gettext ( "Test of client side components with known vulnerabilities" ) => array (
						"risk" => gettext(""), //" Eingesetzte klientenseitige Komponten können Fehler enthalten, so dass die Informationssicherheit beeinträchtigt wird. Diese können u.a. erst nach Verteilung der Webanwendung bekannt werden.",
						"measure" => gettext(""), //" Tests auf klientenseitige  Komponenten mit bekannten Schwachstellen werden regelmäßig durchgeführt, beispielsweise jede Nacht.",
						"hardnessOfImplementation" => array (
								"knowledge" => 1,
								"time" => 2,
								"resources" => 1 
						),
						"usefulness" => 2,
						"level" => 3,
						"dependsOn" => array (
								gettext ( "Defined build process" ) 
						),
						"implementation" => "retirejs",
						"securityProperties" => array (
								"integrity" => gettext(""), //" Durch Tests auf Komponenten mit bekannten Schwachstellen ist die Wahrscheinlichkeit geringer, dass durch Schwachstellen in Komponenten Daten von nicht autorisierten Personen oder Systemen verändert werden können.",
								"availability" => gettext(""), //" Durch Tests auf Komponenten mit bekannten Schwachstellen ist die Wahrscheinlichkeit geringer, dass Schwachstellen in Komponten ausgenutzt werden, um die Verfügbarkeit des Systems zu beeinträchtigen.",
								"confidentiality" => gettext(""), //" Durch Tests auf Komponenten mit bekannten Schwachstellen ist die Wahrscheinlichkeit geringer, dass durch Schwachstellen in Komponten Daten von nicht autorisierten Personen oder Systemen eingesehen werden können."
						) 
				),
				gettext ( "Exclusion of source code duplicates" ) => array (
						"risk" => gettext(""), //" Quellcode-Dupliakte können die Stabilität beeinträchtigen.",
						"measure" => gettext(""), //" Erkennung und Meldung von Duplikaten in Quellcode.",
						"hardnessOfImplementation" => array (
								"knowledge" => 1,
								"time" => 1,
								"resources" => 1 
						),
						"usefulness" => 1,
						"level" => 4,
						"implementation" => "PMD",
						"dependsOn" => array (
								gettext ( "Defined build process" ) 
						),
						"securityProperties" => array (
								"availability" => gettext(""), //" Durch Erkennung und Behebung von Schwachstellen bevor diese in Produktion gehen ist die Verfügbarkeit von Informationen im gesamten Systems erhöht.",
								"integrity" => gettext(""), //" Durch Erkennung und Behebung von Schwachstellen bevor diese in Produktion gehen ist die Integrität von Informationen im gesamten Systems erhöht.",
								"confidentiality" => gettext(""), //" Durch Erkennung und Behebung von Schwachstellen bevor diese in Produktion gehen ist die Vertraulichkeit von Informationen im gesamten Systems erhöht."
						) 
				),
				gettext ( "Static analysis for important server side components" ) => array (
						"risk" => gettext(""), //" Wichtige Teile der serverseitigen Webanwendung enthalten Schwachstellen in der Implementierung.",
						"measure" => gettext(""), //" Es wird eine statische Analyse, in Form von String Matching Algorithmen und/oder Datenflussanalysen, für wichtige Teile der serverseitigen Webanwendung durchgeführt. Die statische(n) Analyse(n) wird automatisiert durchgeführt und nach Möglichkeit in die Entwicklungsumgebung integriert.",
						"hardnessOfImplementation" => array (
								"knowledge" => 2,
								"time" => 2,
								"resources" => 1 
						),
						"usefulness" => 4,
						"level" => 2,
						"implementation" => "eslint, FindSecurityBugs, jsprime",
						"dependsOn" => array (
								gettext ( "Defined build process" ) 
						),
						"securityProperties" => array (
								"availability" => gettext(""), //" Durch Erkennung und Behebung von Schwachstellen bevor diese in Produktion gehen ist die Verfügbarkeit von Informationen im gesamten Systems erhöht.",
								"integrity" => gettext(""), //" Durch Erkennung und Behebung von Schwachstellen bevor diese in Produktion gehen ist die Integrität von Informationen im gesamten Systems erhöht.",
								"confidentiality" => gettext(""), //" Durch Erkennung und Behebung von Schwachstellen bevor diese in Produktion gehen ist die Vertraulichkeit von Informationen im gesamten Systems erhöht."
						) 
				),
				gettext ( "Static analysis for important client side components" ) => array (
						"risk" => gettext(""), //" Wichtige Teile der klientenseitigen Webanwendung enthalten Schwachstellen in der Implementierung.",
						"measure" => gettext(""), //" Es wird eine statische Analyse, in Form von String Matching Algorithmen und/oder Datenflussanalysen, für wichtige Teile der klientenseitigen Webanwendung durchgeführt.",
						"hardnessOfImplementation" => array (
								"knowledge" => 2,
								"time" => 2,
								"resources" => 1 
						),
						"usefulness" => 3,
						"level" => 3,
						"implementation" => "eslint, FindSecurityBugs, jsprime",
						"dependsOn" => array (
								gettext ( "Defined build process" ) 
						),
						"securityProperties" => array (
								"availability" => gettext(""), //" Durch Erkennung und Behebung von Schwachstellen bevor diese in Produktion gehen ist die Verfügbarkeit von Informationen im gesamten Systems erhöht.",
								"integrity" => gettext(""), //" Durch Erkennung und Behebung von Schwachstellen bevor diese in Produktion gehen ist die Integrität von Informationen im gesamten Systems erhöht.",
								"confidentiality" => gettext(""), //" Durch Erkennung und Behebung von Schwachstellen bevor diese in Produktion gehen ist die Vertraulichkeit von Informationen im gesamten Systems erhöht."
						) 
				),
				gettext ( "Static analysis for all self written components" ) => array (
						"risk" => gettext(""), //" Teile der Webanwendung enthalten Schwachstellen in der Implementierung.",
						"measure" => gettext(""), //" Es wird eine statische Analyse, in Form von String Matching Algorithmen und/oder Datenflussanalysen, für alle Bereiche der serverseitigen und klientenseitigen Webanwendung durchgeführt. Externe Bibliotheken werden nicht geprüft.",
						"hardnessOfImplementation" => array (
								"knowledge" => 2,
								"time" => 2,
								"resources" => 1 
						),
						"usefulness" => 4,
						"level" => 4,
						"implementation" => "eslint, FindSecurityBugs, jsprime",
						"dependsOn" => array (
								"Statische Analyse für wichtige klientenseitige Bereiche",
								"Statische Analyse für wichtige serverseitige Bereiche" 
						),
						"securityProperties" => array (
								"availability" => gettext(""), //" Durch Erkennung und Behebung von Schwachstellen bevor diese in Produktion gehen ist die Verfügbarkeit von Informationen im gesamten Systems erhöht.",
								"integrity" => gettext(""), //" Durch Erkennung und Behebung von Schwachstellen bevor diese in Produktion gehen ist die Integrität von Informationen im gesamten Systems erhöht.",
								"confidentiality" => gettext(""), //" Durch Erkennung und Behebung von Schwachstellen bevor diese in Produktion gehen ist die Vertraulichkeit von Informationen im gesamten Systems erhöht."
						) 
				),
				gettext ( "Static analysis for all libraries" ) => array (
						"risk" => gettext(""), //" Von der Webanwendung genutzt Bibliotheken enthalten unbekannte Schwachstellen in der Implementierung.",
						"measure" => gettext(""), //" Es wird eine statische Analyse, in Form von String Matching Algorithmen und/oder Datenflussanalysen, für serverseitige und klientenseitige Bibliotheken durchgeführt.",
						"hardnessOfImplementation" => array (
								"knowledge" => 2,
								"time" => 4,
								"resources" => 2 
						),
						"usefulness" => 3,
						"level" => 4,
						"dependsOn" => array (
								"Statische Analyse für wichtige klientenseitige Bereiche",
								"Statische Analyse für wichtige serverseitige Bereiche" 
						),
						"securityProperties" => array (
								"availability" => gettext(""), //" Durch Erkennung und Behebung von Schwachstellen bevor diese in Produktion gehen ist die Verfügbarkeit von Informationen im gesamten Systems erhöht.",
								"integrity" => gettext(""), //" Durch Erkennung und Behebung von Schwachstellen bevor diese in Produktion gehen ist die Integrität von Informationen im gesamten Systems erhöht.",
								"confidentiality" => gettext(""), //" Durch Erkennung und Behebung von Schwachstellen bevor diese in Produktion gehen ist die Vertraulichkeit von Informationen im gesamten Systems erhöht."
						) 
				),
				gettext ( "Stylistic analysis" ) => array (
						"risk" => gettext(""), //" Durch falsche Einrückung werden Schwachstellen eingeführt.",
						"measure" => gettext(""), //" Durch Überprüfung von Programmkonventionen (Style Guides) ist sichergestellt, dass diese eingehalten werden.",
						"hardnessOfImplementation" => array (
								"knowledge" => 1,
								"time" => 1,
								"resources" => 1 
						),
						"usefulness" => 1,
						"level" => 4,
						"implementation" => "PMD",
						"securityProperties" => array (
								"availability" => gettext(""), //" Durch Erkennung und Behebung von Schwachstellen bevor diese in Produktion gehen ist die Verfügbarkeit von Informationen im gesamten Systems erhöht.",
								"integrity" => gettext(""), //" Durch Erkennung und Behebung von Schwachstellen bevor diese in Produktion gehen ist die Integrität von Informationen im gesamten Systems erhöht.",
								"confidentiality" => gettext(""), //" Durch Erkennung und Behebung von Schwachstellen bevor diese in Produktion gehen ist die Vertraulichkeit von Informationen im gesamten Systems erhöht."
						) 
				) 
		),
		gettext ( "Test-Intensity" ) => array (
				gettext ( "Default settings for intensity" ) => array (
						"risk" => gettext(""), //" Durch Zeitdruck und Unwissenheit werden falsche Annahmen für die Intensität getroffen.",
						"measure" => gettext(""), //" Es ist die Standardeinstellungen für die Intensität von Werkzeugen genutzt.",
						"hardnessOfImplementation" => array (
								"knowledge" => 1,
								"time" => 1,
								"resources" => 1 
						),
						"usefulness" => 1,
						"level" => 1 
				),
				gettext ( "Deactivating of unused tests" ) => array (
						"risk" => gettext(""), //" Prüfungen nehmen stark Ressourcen in Anspruch.",
						"measure" => gettext(""), //" Unnötige Prüfungen sind deaktiviert. Benutzt eine Webanwendung die Mongo-Datenbank, kann ggf. auf eine SQL-Injection-Prüfung verzichtet werden.",
						"hardnessOfImplementation" => array (
								"knowledge" => 2,
								"time" => 3,
								"resources" => 1 
						),
						"usefulness" => 1,
						"level" => 2 
				),
				gettext ( "Adjusted test intensity" ) => array (
						"risk" => gettext(""), //" Scans führen zu viele oder zu wenig Scans für unterschiedliche Schwachstellen durch.",
						"measure" => gettext(""), //" Die Test-Intensität ist angepasst.",
						"hardnessOfImplementation" => array (
								"knowledge" => 3,
								"time" => 3,
								"resources" => 3 
						),
						"usefulness" => 2,
						"level" => 3,
						"securityProperties" => array (
								"availability" => gettext(""), //" Durch Erkennung und Behebung von Schwachstellen bevor diese in Produktion gehen ist die Verfügbarkeit von Informationen im gesamten Systems erhöht.",
								"integrity" => gettext(""), //" Durch Erkennung und Behebung von Schwachstellen bevor diese in Produktion gehen ist die Integrität von Informationen im gesamten Systems erhöht.",
								"confidentiality" => gettext(""), //" Durch Erkennung und Behebung von Schwachstellen bevor diese in Produktion gehen ist die Vertraulichkeit von Informationen im gesamten Systems erhöht."
						) 
				),
				gettext ( "Hight test intensity" ) => array (
						"risk" => gettext(""), //" Durch zu niedriger Scan-Intensität werden Schwachstellen nicht aufgedeckt.",
						"measure" => gettext(""), //" Möglichst alle Schwachstellen-Tests werden periodisch mit hoher Test-Intensität durchgeführt.",
						"hardnessOfImplementation" => array (
								"knowledge" => 3,
								"time" => 3,
								"resources" => 5 
						),
						"usefulness" => 3,
						"level" => 4,
						"securityProperties" => array (
								"availability" => gettext(""), //" Durch Erkennung und Behebung von Schwachstellen bevor diese in Produktion gehen ist die Verfügbarkeit von Informationen im gesamten Systems erhöht.",
								"integrity" => gettext(""), //" Durch Erkennung und Behebung von Schwachstellen bevor diese in Produktion gehen ist die Integrität von Informationen im gesamten Systems erhöht.",
								"confidentiality" => gettext(""), //" Durch Erkennung und Behebung von Schwachstellen bevor diese in Produktion gehen ist die Vertraulichkeit von Informationen im gesamten Systems erhöht."
						) 
				) 
		),
		gettext ( "Consolidation" ) => array (
				gettext ( "Treatment of defects with classification critical" ) => array (
						"risk" => gettext(""), //" Mangelhafte Auswertung der erfolgten Sicherheitsprüfungen.",
						"measure" => gettext(""), //" Akzeptanzkretieren für gefundene Schwachstellen sind definiert. Empfehlung ist hier nur als kritisch eingestufte Schwachstellen/Alarme zu behandeln. Sofern die genutzten Werkzeuge es anbieten, kann auch das Vertrauen (Englisch Confidence) mit zur Einstufung herangezogen werden. Entsprechend wird die Erzeugung markiert oder gestoppt, wenn Schwachstellen mit einer Sicherheitseinstufung über der definierten Akzeptanz gefunden werden.",
						"hardnessOfImplementation" => array (
								"knowledge" => 1,
								"time" => 1,
								"resources" => 1 
						),
						"usefulness" => 4,
						"level" => 1,
						"securityProperties" => array (
								"availability" => gettext(""), //" Durch Erkennung und Behebung von Schwachstellen bevor diese in Produktion gehen ist die Verfügbarkeit von Informationen im gesamten Systems erhöht.",
								"integrity" => gettext(""), //" Durch Erkennung und Behebung von Schwachstellen bevor diese in Produktion gehen ist die Integrität von Informationen im gesamten Systems erhöht.",
								"confidentiality" => gettext(""), //" Durch Erkennung und Behebung von Schwachstellen bevor diese in Produktion gehen ist die Vertraulichkeit von Informationen im gesamten Systems erhöht."
						),
						"samm" => "IR2-A" 
				),
				gettext ( "Simple false positive treatment" ) => array (
						"risk" => gettext(""), //" Aufgrund von mehrfach falsch positiv gemeldeten Schwachstellen werden neue Warnungen ignoriert.",
						"measure" => gettext(""), //" Falsch positiv gemeldete Schwachstellen werden, auf Basis von Werkzeugen, markiert und bei der nächsten Prüfung nicht mehr gemeldet.",
						"hardnessOfImplementation" => array (
								"knowledge" => 1,
								"time" => 1,
								"resources" => 1 
						),
						"usefulness" => 4,
						"level" => 1,
						"implementation" => "Defect Dojo",
						"samm" => "IR2-A" 
				),
				gettext ( "Aggregation of findings" ) => array (
						"risk" => gettext(""), //" Die Wartung von Alarmen und falsch Positiven in unterschiedlichen Werkzeugen und Definitionen erhöht den Aufwand stark.",
						"measure" => gettext(""), //" Aggregation von Alarmen, dabei werden auch doppelte Alarme nach Möglichkeit zusammengeführt.",
						"hardnessOfImplementation" => array (
								"knowledge" => 3,
								"time" => 3,
								"resources" => 2 
						),
						"usefulness" => 2,
						"level" => 4 
				),
				gettext ( "Treatment of defects with classification middle" ) => array (
						"risk" => gettext(""), //" Mittelschwere Alarme werden nicht beachtet.",
						"measure" => gettext(""), //" Akzeptanzkretieren für gefundene Schwachstellen sind definiert. Empfehlung ist mittelschwere Meldungen ebenfalls zu behandeln.",
						"hardnessOfImplementation" => array (
								"knowledge" => 2,
								"time" => 2,
								"resources" => 1 
						),
						"usefulness" => 3,
						"level" => 3,
						"comment" => "Falsch Positiv-Sortierung ist Zeitaufwendig.",
						"securityProperties" => array (
								"availability" => gettext(""), //" Durch Erkennung und Behebung von Schwachstellen bevor diese in Produktion gehen ist die Verfügbarkeit von Informationen im gesamten Systems erhöht.",
								"integrity" => gettext(""), //" Durch Erkennung und Behebung von Schwachstellen bevor diese in Produktion gehen ist die Integrität von Informationen im gesamten Systems erhöht.",
								"confidentiality" => gettext(""), //" Durch Erkennung und Behebung von Schwachstellen bevor diese in Produktion gehen ist die Vertraulichkeit von Informationen im gesamten Systems erhöht."
						) 
				),
				gettext ( "Treatment of all defects" ) => array (
						"risk" => gettext(""), //" Alarme mit Schwere 'Einfach' werden nicht beachtet.",
						"measure" => gettext(""), //" Akzeptanzkretieren für gefundene Schwachstellen sind definiert. Empfehlung ist Meldungen mit der Schwere 'Einfach' ebenfalls zu behandeln.",
						"hardnessOfImplementation" => array (
								"knowledge" => 3,
								"time" => 2,
								"resources" => 1 
						),
						"usefulness" => 2,
						"level" => 4,
						"securityProperties" => array (
								"availability" => gettext(""), //" Durch Erkennung und Behebung von Schwachstellen bevor diese in Produktion gehen ist die Verfügbarkeit von Informationen im gesamten Systems erhöht.",
								"integrity" => gettext(""), //" Durch Erkennung und Behebung von Schwachstellen bevor diese in Produktion gehen ist die Integrität von Informationen im gesamten Systems erhöht.",
								"confidentiality" => gettext(""), //" Durch Erkennung und Behebung von Schwachstellen bevor diese in Produktion gehen ist die Vertraulichkeit von Informationen im gesamten Systems erhöht."
						) 
				),
				gettext ( "Reproductable defects tickets" ) => array (
						"risk" => gettext(""), //" Alarme können von Entwicklern / System-Adminstratoren ggf. nur schwer nachvollzogen werden.",
						"measure" => gettext(""), //" Alarme enthalten den Ablauf der Aktionen um die gemeldete Schwachstelle einfacher reproduzieren zu können.",
						"hardnessOfImplementation" => array (
								"knowledge" => 3,
								"time" => 2,
								"resources" => 2 
						),
						"usefulness" => 2,
						"level" => 4,
						"securityProperties" => array (
								"availability" => gettext(""), //" Durch nachhaltige Behebung von Schwachstellen kann die Verfügbarkeit von Informationen im gesamten Systems erhöht werden.",
								"integrity" => gettext(""), //" Durch nachhaltige Behebung von Schwachstellen kann die Integrität von Informationen im gesamten Systems erhöht werden.",
								"confidentiality" => gettext(""), //" Durch nachhaltige Behebung von Schwachstellen kann die Vertraulichkeit von Informationen im gesamten Systems erhöht werden."
						),
						"implementation" => "ZEST" 
				),
				"Defect-alarms address teams" => array (
						"risk" => gettext(""), //" Jedes Team muss jeden Alarm prüfen, so kann Frust entstehen.",
						"measure" => gettext(""), //" Alarme werden Teams zugewiesen, so dass keine Ressourcen verschwendet werden.",
						"hardnessOfImplementation" => array (
								"knowledge" => 2,
								"time" => 2,
								"resources" => 1 
						),
						"usefulness" => 2,
						"level" => 3,
						"securityProperties" => array (
								"availability" => gettext(""), //" Durch freie Ressourcen kann die Verfügbarkeit von Informationen im gesamten Systems erhöht werden.",
								"integrity" => gettext(""), //" Durch freie Ressourcen kann die Integrität von Informationen im gesamten Systems erhöht werden.",
								"confidentiality" => gettext(""), //" Durch freie Ressourcen kann die Vertraulichkeit von Informationen im gesamten Systems erhöht werden."
						),
						"implementation" => "Bei SAST: Serverseitige/klientenseitige Teams können einfach erfasst werden. Bei Mikroservice-Architektur können einzelne Mikroservices i.d.R. Teams zugewiesen werden. Bei DAST: Schwachstellen sind klassifiziert und können serverseitigen und klientenseitigen Teams zugewiesen werden." 
				),
				gettext ( "Simple visualization of defects" ) => array (
						"risk" => gettext(""), //" Es ist unklar, wie viele Alarme im Monat entstehen.",
						"measure" => gettext(""), //" Alarme werden einach visualisiert um einfache Trendanalyse durchführen zu können.",
						"hardnessOfImplementation" => array (
								"knowledge" => 2,
								"time" => 2,
								"resources" => 1 
						),
						"usefulness" => 3,
						"level" => 2,
						"dependsOn" => array (
								"Visualisierte Metriken" 
						) 
				),
				gettext ( "Advanced visualization of defects" ) => array (
						"risk" => gettext(""), //" Aufgrund der einfachen Visualisierung von Alarmen sind zusammenhänge nicht auf den ersten Blick erkennbar.",
						"measure" => gettext(""), //" Alarme werden als Metrik erfasst visualisiert.",
						"hardnessOfImplementation" => array (
								"knowledge" => 2,
								"time" => 4,
								"resources" => 1 
						),
						"usefulness" => 2,
						"level" => 4,
						"dependsOn" => array (
								"Visualisierte Metriken" 
						) 
				) 
		),
		gettext ( "Application tests" ) => array (
				gettext ( "Small coverage Security related unit tests" ) => array (
						"risk" => gettext(""), //" Schwachstellen sind unbeachbsichtigt Implementiert.",
						"measure" => gettext(""), //" Integration von sicherheitsrelevanten Modultests für geschäftskritische Bereiche. Dadurch können Schwachstellen wie fehlende Authentifizierung erkannt werden.",
						"hardnessOfImplementation" => array (
								"knowledge" => 3,
								"time" => 4,
								"resources" => 2 
						),
						"usefulness" => 3,
						"level" => 1,
						"comment" => "Die Integration von Modultests findet schon während der Entwicklung statt, es wird auf Schwachstellen in Sub-Routinen, Funktionen, Module, Bibliotheken usw. geprüft.",
						"implementation" => "Unit-Tests",
						"securityProperties" => array (
								"availability" => gettext(""), //" Durch Erkennung und Behebung von Schwachstellen bevor diese in Produktion gehen ist die Verfügbarkeit von Informationen im gesamten Systems erhöht.",
								"integrity" => gettext(""), //" Durch Erkennung und Behebung von Schwachstellen bevor diese in Produktion gehen ist die Integrität von Informationen im gesamten Systems erhöht.",
								"confidentiality" => gettext(""), //" Durch Erkennung und Behebung von Schwachstellen bevor diese in Produktion gehen ist die Vertraulichkeit von Informationen im gesamten Systems erhöht."
						),
						"implementation" => "JUnit",
						"samm" => "ST2-B"
				),
				gettext ( "Security related integration tests" ) => array (
						"risk" => gettext(""), //" In der Anwendung sind grundlegende Fehler bei der Benutzung eines Frameworks möglich, ohne das diese erkannt werden.",
						"measure" => gettext(""), //" Implementierung grundlegender Sicherheitstests als und Integrationstests. Beispielsweise kann die Authentifizierung und Autorisierung (Zugriffskontrolle) geprüft werden.",
						"hardnessOfImplementation" => array (
								"knowledge" => 3,
								"time" => 4,
								"resources" => 2 
						),
						"usefulness" => 2,
						"level" => 2,
						"securityProperties" => array (
								"availability" => gettext(""), //" Durch Erkennung und Behebung von Schwachstellen bevor diese in Produktion gehen ist die Verfügbarkeit von Informationen im gesamten Systems erhöht.",
								"integrity" => gettext(""), //" Durch Erkennung und Behebung von Schwachstellen bevor diese in Produktion gehen ist die Integrität von Informationen im gesamten Systems erhöht.",
								"confidentiality" => gettext(""), //" Durch Erkennung und Behebung von Schwachstellen bevor diese in Produktion gehen ist die Vertraulichkeit von Informationen im gesamten Systems erhöht."
						),
						"implementation" => "HttpUnit",
						"samm" => "ST2-B"
				),
				gettext ( "High coverage of security related module and integration tests" ) => array (
						"risk" => gettext(""), //" Es sind nicht alle Teile der Anwendung mit Sicherheitsprüfungen versehen.",
						"measure" => gettext(""), //" Implementierung grundlegender Sicherheitstests als Integrations- und/oder Akzeptanztests für alle Teile (auch Bibliotheken) der Anwendung.",
						"hardnessOfImplementation" => array (
								"knowledge" => 5,
								"time" => 5,
								"resources" => 3 
						),
						"usefulness" => 3,
						"level" => 4,
						"securityProperties" => array (
								"availability" => gettext(""), //" Durch Erkennung und Behebung von Schwachstellen bevor diese in Produktion gehen ist die Verfügbarkeit von Informationen im gesamten Systems erhöht.",
								"integrity" => gettext(""), //" Durch Erkennung und Behebung von Schwachstellen bevor diese in Produktion gehen ist die Integrität von Informationen im gesamten Systems erhöht.",
								"confidentiality" => gettext(""), //" Durch Erkennung und Behebung von Schwachstellen bevor diese in Produktion gehen ist die Vertraulichkeit von Informationen im gesamten Systems erhöht."
						) ,
						"samm" => "ST2-B"
				),
				gettext ( "Smoke Test" ) => array (
						"risk" => gettext(""), //" Durch eine Verteilung auf die Produktionsumgebung können Mikroservices gestört sein, z.B. wenn die Datenbank nicht erreicht werden kann.",
						"measure" => gettext(""), //" Integrationstests prüfen die Produktionsumgebung um sicher zu stellen, dass Funktionen, z.B. bereitgestellt durch Mikroservices oder externe Dienste, erreichbar sind.",
						"hardnessOfImplementation" => array (
								"knowledge" => 2,
								"time" => 2,
								"resources" => 2 
						),
						"usefulness" => 2,
						"level" => 4,
						"implementation" => "",
						"dependsOn" => array (
								gettext ( "Defined deployment process" ) 
						),
						"securityProperties" => array (
								"availability" => gettext(""), //" Durch Erkennung und Behebung von Schwachstellen bevor diese in Produktion gehen ist die Verfügbarkeit von Informationen im gesamten Systems erhöht.",
								"integrity" => gettext(""), //" Durch Erkennung und Behebung von Schwachstellen bevor diese in Produktion gehen ist die Integrität von Informationen im gesamten Systems erhöht.",
								"confidentiality" => gettext(""), //" Durch Erkennung und Behebung von Schwachstellen bevor diese in Produktion gehen ist die Vertraulichkeit von Informationen im gesamten Systems erhöht."
						) ,
						"samm"=>"ST2-B"
				) 
		),
		gettext ( "Infrastructure tests" ) => array (
				gettext ( "Test of infrastructure components with known vulnerabilities" ) => array (
						"risk" => gettext(""), //" Das Betriebssystem oder seine Dienste enthalten bekannte Schwachstellen. Häufig laufen Docker-Container zu lange ohne System-Aktuallisierung zu erhalten.",
						"measure" => gettext(""), //" Prüfung auf Aktualisierungen und bei veralteter Software Meldung an einen Verantwortlichen, welcher die Patches einspielt.",
						"hardnessOfImplementation" => array (
								"knowledge" => 1,
								"time" => 1,
								"resources" => 1 
						),
						"usefulness" => 5,
						"level" => 1,
						"securityProperties" => array (
								"integrity" => gettext(""), //" Durch Prüfung und Einspielen von System-Aktualisierungen ist die Wahrscheinlichkeit, dass System-Komponenten die Integrität von Informationen beeinträchtigen verringert.",
								"availability" => gettext(""), //" Durch Prüfung und Einspielen von System-Aktualisierungen ist die Wahrscheinlichkeit, dass System-Komponenten die Verfügbarkeit beeinträchtigen verringert.",
								"confidentiality" => gettext(""), //" Durch Prüfung und Einspielen von System-Aktualisierungen ist die Wahrscheinlichkeit, dass System-Komponenten vertrauliche Informationen preisgeben verringert."
							),
						       "implementation"=>"Anchore, Clair, OpenSCAP, Vuls"	
				),
				gettext ( "Test of the configuration of virtual envirnoments" ) => array (
						"risk" => gettext(""), //" Virtuelle Umgebungen birgen die Gefahr sicherheitskritisch Konfiguriert zu sein.",
						"measure" => gettext(""), //" Mit Hilfe von Werkzeugen wird die Konfiguration von virtuellen Umgebungen geprüft.",
						"hardnessOfImplementation" => array (
								"knowledge" => 2,
								"time" => 2,
								"resources" => 1 
						),
						"usefulness" => 4,
						"level" => 2,
						"securityProperties" => array (
								"availability" => gettext(""), //" Durch Erkennung und Behebung von Schwachstellen bevor diese in Produktion gehen ist die Verfügbarkeit von Informationen im gesamten Systems erhöht.",
								"integrity" => gettext(""), //" Durch Erkennung und Behebung von Schwachstellen bevor diese in Produktion gehen ist die Integrität von Informationen im gesamten Systems erhöht.",
								"confidentiality" => gettext(""), //" Durch Erkennung und Behebung von Schwachstellen bevor diese in Produktion gehen ist die Vertraulichkeit von Informationen im gesamten Systems erhöht."
						),
						"implementation" => "Docker Bench for Security, Docker Security Scan, openVAS", 
						"samm" => "EH2-B"				
				),
				gettext ( "Advanced infrastructure tests" ) => array (
						"risk" => gettext(""), //" Systeme wie Firewalls können nach einer Anpassung sicherheitskritisch konfiguriert sein.",
						"measure" => gettext(""), //" Automatische Prüfung von Infrastruktur-Systemen wie Firewalls.",
						"hardnessOfImplementation" => array (
								"knowledge" => 2,
								"time" => 2,
								"resources" => 1 
						),
						"usefulness" => 3,
						"level" => 4,
						"securityProperties" => array (
								"availability" => gettext(""), //" Durch Erkennung und Behebung von Schwachstellen bevor diese in Produktion gehen ist die Verfügbarkeit von Informationen im gesamten Systems erhöht.",
								"integrity" => gettext(""), //" Durch Erkennung und Behebung von Schwachstellen bevor diese in Produktion gehen ist die Integrität von Informationen im gesamten Systems erhöht.",
								"confidentiality" => gettext(""), //" Durch Erkennung und Behebung von Schwachstellen bevor diese in Produktion gehen ist die Vertraulichkeit von Informationen im gesamten Systems erhöht."
						) 
				),
				gettext ( "Load tests" ) => array (
						"risk" => gettext(""), //" Es ist unbekannt wie viele Anfragen das System bedienen kann und wie sich das System bei vielen Anfragen verhält.",
						"measure" => gettext(""), //" Last-Tests werden periodisch ausgeführt.",
						"hardnessOfImplementation" => array (
								"knowledge" => 3,
								"time" => 2,
								"resources" => 5 
						),
						"usefulness" => 3,
						"level" => 4,
						"securityProperties" => array (
								"availability" => gettext(""), //" Durch Erkennung und Behebung von Flaschenhälsen ist die Verfügbarkeit von Informationen im gesamten Systems erhöht."
						) 
				),
				gettext ( "Weak password test" ) => array (
						"risk" => gettext(""), //" Mitarbeiterkonten und priviligierte Benutzerkonten sind mit schwachen Passwörtern geschützt.",
						"measure" => gettext(""), //" Automatische BruteForce-Angriffe auf Benutzer-Konten von Mitarbeitern sowie Standard-Konten wie 'administrator'.",
						"hardnessOfImplementation" => array (
								"knowledge" => 2,
								"time" => 1,
								"resources" => 1 
						),
						"usefulness" => 1,
						"level" => 3,
						"securityProperties" => array (
								"availability" => gettext(""), //" Durch Erkennung und Ändern von schwachen Passwörtern kann die Verfügbarkeit von Informationen im gesamten Systems erhöht werden.",
								"integrity" => gettext(""), //" Durch Erkennung und Ändern von schwachen Passwörtern kann die Integrität von Informationen im gesamten Systems erhöht werden.",
								"confidentiality" => gettext(""), //" Durch Erkennung und Ändern von schwachen Passwörtern kann die Vertraulichkeit von Informationen im gesamten Systems erhöht werden."
						),
						"implementation" => "HTC Hydra" ,
				) 
		) 
);


// TODO Copy multiple scanner to static
