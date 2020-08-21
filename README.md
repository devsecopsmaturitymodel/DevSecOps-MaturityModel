# Introduction
From a startup to a multinational corporation the software development industry is currently dominated by agile frameworks and product teams and as part of it DevOps strategies. It has been observed that during the implementation, security aspects are usually neglected or are at least not sufficient taken account of. It is often the case that standard safety requirements of the production environment are not utilized or applied to the build pipeline in the continuous integration environment with containerization or concrete docker. Therefore, the docker registry is often not secured which might result in the theft of the entire company’s source code.

The OWASP DevSecOps Maturity Model provides opportunities to harden DevOps strategies and shows how these can be prioritized.

With the help of DevOps strategies security can also be enhanced. For example, each component such as application libraries and operating system libraries in docker images can be tested for known vulnerabilities. 

Attackers are intelligent and creative, equipped with new technologies and purpose. Under the guidance of the forward-looking DevSecOps Maturity Model, appropriate principles and measures are at hand implemented which counteract the attacks.

# Usage
Go to https://dsomm.timo-pagel.de or clone [this repository](https://github.com/wurstbrot/DevSecOps-MaturityModel/) and run `startDocker.bash`.
* _matrix_ shows the dimensions, subdimensions and activities are described.
* _Implementation Levels_ can be used to measure the current implementation level by clicking on the specific activities which have been performed.
* _Ease and Value of Implementation_ is used for the maturity model development to see the ease and value of each activity to be able to compare it with activities within the subdimension and activities from other subdimensions.
* _Dependenies_ shows the dependencies between activities
* _Full Report_ prints all activities to be able to print it

In this [video](https://www.youtube.com/watch?v=tX9RHZ_O5NU) Timo Pagel describes different strategic approaches for your secure DevOps strategy. The use OWASP DSOMM in combination with [OWASP SAMM](https//owaspsamm.org) is explained.

# Slides and talks
* [Online: OWASP DevSecOps Maturity Model - Culture (German)](https://www.meetup.com/de-DE/Breaking-Agile/) 2020-08-25
* [Video: Usage of the OWASP DevSecOps Maturity Model](https://www.youtube.com/watch?v=tX9RHZ_O5NU), [OWASP Ottawa Chapter](https://www.meetup.com/de-DE/OWASP-Ottawa/events/272355636/), 2020-08-17
* [Continuous Application Security Testing for Enterprise](https://docs.google.com/presentation/d/1dAewXIHgBEKHKwBPpM5N_G2eM6PRpduoGJrp6R6pNUI/edit?usp=sharing), DevOps Meetup Hamburg, 2019-09-26
* [DevSecOps Maturity Model](https://docs.google.com/presentation/d/1zF7c_0cPYBO7LHcLNtEApQBB_qJugXgRQUyiwBKKtKk/edit?usp=sharing), Open Security Summit, near London, 2018
* [Security in DevOps-Strategies](https://www.youtube.com/watch?v=gWjGWebWahE&t=448s), 28.09.2017, Hamburg, Germany
* [DevSecOps Maturity Model](https://docs.google.com/presentation/d/1rrbyXqxy3LXAJNPFrVH99mj_BNaJKymMsXZItYArWEM/edit?usp=sharing), 2017

# Credits
* The dimension _Test and Verifiacation_ is based on Christian Schneiders [Security DevOps Maturity Model (SDOMM)](https://www.christian-schneider.net/SecurityDevOpsMaturityModel.html). _Application tests_ and _Infrastructure tests_ are added by Timo Pagel. Also, the sub-dimension _Static depth_ has been evaluated by security experts at [OWASP Stammtisch Hamburg](https://www.owasp.org/index.php/OWASP_German_Chapter_Stammtisch_Initiative/Hamburg).
* The sub-dimension <i>Process</i> has been added after a discussion with [Francois Raynaud](https://www.linkedin.com/in/francoisraynaud/) that reactive activities are missing.
* Enhancement of my basic translation is performed by [Claud Camerino](https://github.com/clazba).

# Back link
- [OWASP DevSecOps maturity model page](https://dsomm.timo-pagel.de/)
- [OWASP DevSecOps project page](https://owasp.org/www-project-devsecops-maturity-model/)
- [OWASP](https://owasp.org)

# Your help is needed to perform
* Adding a manual on how to use DSOMM
* Integration of Incident Response
* DevSecOps Toolchain Categorization
* App Sec Maturity Models Mapping
* CAMS Categorization
* Addinng of evidence

# Sponsors
[![Timo Pagel IT-Consulting](https://raw.githubusercontent.com/DefectDojo/Documentation/master/doc/img/timo-pagel-logo.png)](https://pagel.pro) (Time, Logo, Icons)

# License
This program is free software: you can redistribute it and/or modify it under the terms of the [GPL 3](https://www.gnu.org/licenses/) license.
The OWASP DevSecOps Maturity Model and any contributions are Copyright © by Timo Pagel 2017-2020
