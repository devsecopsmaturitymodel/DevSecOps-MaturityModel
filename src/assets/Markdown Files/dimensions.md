# Dimensions

This section describes the various dimensions
and the corresponding sub dimension.

The descriptions are highly based (mostly copied)
on the [OWASP Project Integration Project Writeup](https://github.com/OWASP/www-project-integration-standards/blob/master/writeups/owasp_in_sdlc/index.md).

# Build and Deployment

Secure configuration standards can be enforced during the deployment using the [Open Policy Agent](https://www.openpolicyagent.org/).

![SAMM Release](https://github.com/OWASP/www-project-integration-standards/raw/master/writeups/owasp_in_sdlc/images/samm_release.png "SAMM Release")

**Example Low Maturity scenario:**

The team manually deploys software to production without standardized or automated processes. Secrets, such as passwords and API keys, may have been hardcoded or left in configuration files that are committed to version control, leading to potential exposure and security risks.


**Example High Maturity scenario:**

The CI/CD system, when migrating successful QA environments to production, applies appropriate configuration to all components.
Configuration is tested periodically for drift.

Secrets live in-memory only and are persisted in a dedicated Secrets Storage solution such as Hashicorp Vault.

# Culture and Organization

This section covers topics related to culture and organization like
processes, education and the design phase.

Once requirements are gathered and analysis is performed,
implementation specifics need to be defined.
The outcome of this stage is usually a diagram outlining data flows
and a general system architecture.
This presents an opportunity for both threat modeling
and attaching security considerations
to every ticket and epic that is the outcome of this stage.

## Design

There is some great advice on threat modeling out there
*e.g.* [this](https://arstechnica.com/information-technology/2017/07/how-i-learned-to-stop-worrying-mostly-and-love-my-threat-model/)
article or [this](https://www.microsoft.com/en-us/securityengineering/sdl/threatmodeling) one.

A bite sized primer by Adam Shostack himself can be found
[here](https://adam.shostack.org/blog/2018/03/threat-modeling-panel-at-appsec-cali-2018/).

OWASP includes a short [article](https://wiki.owasp.org/index.php/Category:Threat_Modeling)
on Threat Modeling along with a relevant [Cheatsheet](https://cheatsheetseries.owasp.org/cheatsheets/Threat_Modeling_Cheat_Sheet.html).
Moreover, if you're following OWASP SAMM, it has a short section on [Threat Assessment](https://owaspsamm.org/model/design/threat-assessment/).

There's a few projects that can help with creating Threat Models
at this stage, [PyTM](https://github.com/izar/pytm) is one,
[ThreatSpec](https://github.com/threatspec/threatspec) is another.

> Note: _A threat model can be as simple as a data flow diagram with attack vectors on every flow and asset and equivalent remediations.
An example can be found below._

![Threat Model](https://github.com/OWASP/www-project-integration-standards/raw/master/writeups/owasp_in_sdlc/images/threat_model.png "Threat Model")

Last, if the organization maps Features to Epics, the Security Knowledge Framework (SKF) can be used to facilitate this process by leveraging it's questionnaire function.

![SKF](https://github.com/OWASP/www-project-integration-standards/raw/master/writeups/owasp_in_sdlc/images/skf_qs.png "SKF")

This practice has the side effect that it trains non-security specialists to think like attackers.

The outcomes of this stage should help lay the foundation of secure design and considerations.

**Example Low Maturity Scenario:**

Following vague feature requirements the design includes caching data to a local unencrypted database with a hardcoded password.

Remote data store access secrets are hardcoded in the configuration files.
All communication between backend systems is plaintext.

Frontend serves data over GraphQL as a thin layer between caching system and end user.

GraphQL queries are dynamically translated to SQL, Elasticsearch and NoSQL queries.
Access to data is protected with basic auth set to _1234:1234_ for development purposes.

**Example High Maturity Scenario:**

Based on a detailed threat model defined and updated through code, the team decides the following:

* Local encrypted caches need to expire and auto-purged.
* Communication channels encrypted and authenticated.
* All secrets persisted in shared secrets store.
* Frontend designed with permissions model integration.
* Permissions matrix defined.
* Input is escaped output is encoded appropriately using well established libraries.

## Education and Guidence

Metrics won't necessarily improve without training engineering teams and somehow building a security-minded culture.
Security training is a long and complicated discussion.
There is a variety of approaches out there, on the testing-only end of the spectrum there is fully black box virtual machines such as [DVWA](http://www.dvwa.co.uk/), [Metasploitable series](https://metasploit.help.rapid7.com/docs/metasploitable-2) and the [VulnHub](https://www.vulnhub.com/) project.

The code & remediation end of the spectrum isn't as well-developed,
mainly due to the complexity involved in building and distributing such material.
However, there are some respectable solutions, [Remediate The Flag](https://www.remediatetheflag.com/)
can be used to setup a code based challenge.

![Remediate the Flag](https://github.com/OWASP/www-project-integration-standards/raw/master/writeups/owasp_in_sdlc/images/rtf.png "Remediate the Flag")

However, if questionnaires are the preferred medium, or if the organization
 is looking for self-service testing, [Secure Coding Dojo](https://github.com/trendmicro/SecureCodingDojo) is an interesting solution.

More on the self-service side, the Security Knowledge Framework has released
several [Labs](https://owasp-skf.gitbook.io/asvs-write-ups/) that each
showcase one vulnerability and provides information on how to exploit it.

However, to our knowledge, the most flexible project out there is probably
the [Juice Shop](https://github.com/bkimminich/juice-shop), deployed
on Heroku with one click, it offers both CTF functionality and a self-service
 standalone application that comes with solution detection
 and a comprehensive progress-board.

![Juice Shop](https://github.com/OWASP/www-project-integration-standards/raw/master/writeups/owasp_in_sdlc/images/juiceshop.png "Juice Shop")

## Process

**Example High Maturity Scenario:**

Business continuity and Security teams run incident management drills
 periodically to refresh incident playbook knowledge.



# Implementation

This dimension covers topic of "traditional"
hardening of software and infrastructure components.

There is an abundance of libraries and frameworks implementing
secure defaults.
For frontend development, [ReactJS](https://reactjs.org/) seems to be
the latest favorite in the Javascript world.

On the database side, there are [ORM](https://sequelize.org/) libraries
and [Query Builders](https://github.com/kayak/pypika) for most languages.

If you write in Java,
the [ESAPI project](https://www.javadoc.io/doc/org.owasp.esapi/esapi/latest/index.html)
offers several methods to securely implement features,
ranging from Cryptography to input escaping and output encoding.

**Example low maturity scenario:**

The API was queryable by anyone and GraphQL introspection was enabled since
all components were left in debug configuration.

Sensitive API paths were not whitelisted.
The team found that the application was attacked when the server showed very
high CPU load.
The response was to bring the system down, very little information about
the attack was found apart from the fact that someone
was mining cryptocurrencies on the server.

**Example Low Maturity Scenario:**

The team attempted to build the requested features using vanilla NodeJS,
connectivity to backend systems is validated by firing an internal request
to `/healthcheck?remoteHost=<xx.xx.xx>` which attempts to run a ping
command against the IP specified.
All secrets are hard coded.
The team uses off the shelf GraphQL libraries but versions
are not checked using [NPM Audit](https://docs.npmjs.com/cli/audit).
Development is performed by pushing to master which triggers a webhook that
uses FTP to copy latest master to the development server which will become production once development is finished.

**Example High Maturity Scenario:**

Team members have access to comprehensive documentation
and a library of code snippets they can use to accelerate development.

Linters are bundled with pre-commit hooks
and no code reaches master without peer review.

Pre-merge tests are executed before merging code into master.
Tests run a comprehensive suite of tests covering unit tests,
service acceptance tests,
unit tests as well as regression tests.

Once a day a pipeline of specially configured
static code analysis tools runs against
the features merged that day, the results are
triaged by a trained security team and fed to engineering.

There is a cronjob executing Dynamic Analysis tools against Staging
with a similar process.

Pentests are conducted against features released on every release
and also periodically against the whole software stack.


# Information Gathering

Concerning metrics, the community has been quite vocal on what to measure
and how important it is.
The OWASP CISO guide offers 3 broad categories of SDLC metrics[1] which can
 be used to measure effectiveness of security practices.
Moreover, there is a number of presentations on what could be leveraged
to improve a security programme, starting from Marcus' Ranum's [keynote](https://www.youtube.com/watch?v=yW7kSVwucSk)
at Appsec California[1],
Caroline Wong's similar [presentation](https://www.youtube.com/watch?v=dY8IuQ8rUd4)
and [this presentation](https://www.youtube.com/watch?v=-XI2DL2Uulo) by J. Rose and R. Sulatycki.
These among several writeups by private companies all offering their own version of what could be measured.

Projects such as the [ELK stack](https://www.elastic.co/elastic-stack), [Grafana](https://grafana.com/)
and [Prometheus](https://prometheus.io/docs/introduction/overview/) can be used to aggregate
 logging and provide observability.

However, no matter the WAFs, Logging, and secure configuration enforced
at this stage, incidents will occur eventually.
Incident management is a complicated and high stress process.
To prepare organizations for this, SAMM includes a section on [incident management](https://owaspsamm.org/model/operations/incident-management/) involving simple questions for stakeholders to answer so you can determine incident preparedness accurately.

**Example High Maturity scenario:**

Logging from all components gets aggregated in dashboards and alerts
are raised based on several Thresholds and events.
There are canary values and events fired against monitoring
from time to time to validate it works.


# Test and Verification

At any maturity level, linters can be introduced to ensure that consistent
 code is being added.
For most linters, there are IDE integrations providing software engineers
 with the ability to validate code correctness during development time.
Several linters also include security specific rules.
This allows for basic security checks before the code is even committed.
For example, if you write in Typescript, you can use
[tslint](https://github.com/palantir/tslint) along
with [tslint-config-security](https://www.npmjs.com/package/tslint-config-security)
to easily and quickly perform basic checks.

However, linters cannot detect vulnerabilities in third party libraries,
and as software supply chain attacks spread, this consideration becomes more important.
To track third party library usage and audit their security you can use [Dependency Check/Track](https://dependencytrack.org/).

![SKF Code](https://github.com/OWASP/www-project-integration-standards/raw/master/writeups/owasp_in_sdlc/images/skf_code.png "SKF Code")

This stage can be used to validate software correctness and it's results as a
 metric for the security related decisions of the previous stages.
At this stage both automated and manual testing can be performed.
SAMM again offers 3 maturity levels across Architecture Reviews, Requirements testing, and Security Testing.
Instructions can be found [here](https://owaspsamm.org/model/verification/) and a screenshot is listed below.

![SAMM Testing](https://github.com/OWASP/www-project-integration-standards/raw/master/writeups/owasp_in_sdlc/images/samm_testing.png "SAMM Testing")

Testing can be performed several ways and it highly depends on the nature
of the software, the organization's cadence, and the regulatory requirements among other things.

If available, automation is a good idea as it allows detection of easy to find vulnerabilities without much human interaction.

If the application communicates using a web-based protocol, the [ZAP](https://github.com/zaproxy/zaproxy) project can be used to automate a great number of web related attacks and detection.
ZAP can be orchestrated using its REST API and it can even automate multi-stage attacks by leveraging its Zest scripting support.

Vulnerabilities from ZAP and a wide variety of other tools can be imported and managed using a dedicated defect management platform such as [Defect Dojo](https://github.com/DefectDojo/django-DefectDojo)(screenshot below).

![Defect Dojo](https://github.com/OWASP/www-project-integration-standards/raw/master/writeups/owasp_in_sdlc/images/defectdojo.png "Defect Dojo")

For manual testing the [Web](https://github.com/OWASP/wstg) and [Mobile](https://github.com/OWASP/owasp-mstg) Security Testing Guides can be used to achieve a base level of quality for human driven testing.

**Example Low Maturity Scenario:**

The business deployed the system to production without testing.
Soon after, the client's routine pentests uncovered deep flaws with access to backend data and services.
The remediation effort was significant.

**Example High Maturity Scenario:**

The application features received Dynamic Automated testing when each reached staging, a trained QA team validated business requirements that involved security checks.
A security team performed an adequate pentest and gave a sign-off.

