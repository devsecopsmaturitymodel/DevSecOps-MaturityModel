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
* _Useage_ describes the dimensions
* _Full Report_ prints all activities to be able to print it

In this [video](https://www.youtube.com/watch?v=tX9RHZ_O5NU) Timo Pagel describes different strategic approaches for your secure DevOps strategy. The use OWASP DSOMM in combination with [OWASP SAMM](https//owaspsamm.org) is explained.

In case you have evidence or review questions to gather evidence, you can add the attribute "evidence" to an activity which will be attached to an activity to provide it to your CISO or your customer's CISO.
You can switch on to show open TODO's for evidence by changing IS_SHOW_EVIDENCE_TODO to true 'bib.php' `define(IS_SHOW_EVIDENCE_TODO, true);`

# Community

Code Freeze: Currently, with the Google Summer student Aryan Prasad we develop a new Angular frontend version, therefore, we do not accept any code changes right now.

Join #dsomm in [OWASP Slack](https://owasp.slack.com/join/shared_invite/zt-g398htpy-AZ40HOM1WUOZguJKbblqkw#/).
Create issues or even better Pull Requests in [github](https://github.com/wurstbrot/DevSecOps-MaturityModel/).

# Slides and talks
* [Video: OWASP (DevSecOps) Projects, 2021-04-28, OWASP Stammtisch Frankfurt](https://www.youtube.com/watch?v=8webiYnF56A)
* [Video: DSOMM Enhancement Workshop at Open Security Summit, 2021-04-16](https://youtu.be/H2BA6gaeKBE)
* [Video: Strategic Usage of the OWASP Software Assurance Maturity Model and the OWASP DevSecOps Maturity Model, OWASP Jakarta](https://m.youtube.com/watch?v=lLMLGIzl56M)
* [Slides: DSOMM Overview](https://docs.google.com/presentation/d/1eQcE_AsR1g6uOVf3B2Ehh1g0cHvPknkdLY4BzMYatSw/edit?usp=sharing)
* [Video: GitHub practical DSOMM snippet on twitch](https://www.twitch.tv/githubenterprise/clip/EsteemedTriumphantMinkFailFish)
* [Blog: GitHub on DSOMM](https://github.blog/2020-08-06-achieving-devsecops-maturity-with-a-developer-first-community-driven-approach/) 2020
* [Video: Benutzung vom OWASP DevSecOps Maturity Model (German)](https://vimeo.com/456523229)
* [Online: OWASP DevSecOps Maturity Model - Culture (German)](https://www.meetup.com/de-DE/Breaking-Agile/) 2020-08-25
* [Video: Usage of the OWASP DevSecOps Maturity Model](https://www.youtube.com/watch?v=tX9RHZ_O5NU), [OWASP Ottawa Chapter](https://www.meetup.com/de-DE/OWASP-Ottawa/events/272355636/), 2020-08-17
* [Continuous Application Security Testing for Enterprise](https://docs.google.com/presentation/d/1dAewXIHgBEKHKwBPpM5N_G2eM6PRpduoGJrp6R6pNUI/edit?usp=sharing), DevOps Meetup Hamburg, 2019-09-26
* [DevSecOps Maturity Model](https://docs.google.com/presentation/d/1zF7c_0cPYBO7LHcLNtEApQBB_qJugXgRQUyiwBKKtKk/edit?usp=sharing), Open Security Summit, near London, 2018
* [Security in DevOps-Strategies](https://www.youtube.com/watch?v=gWjGWebWahE&t=448s), 28.09.2017, Hamburg, Germany
* [DevSecOps Maturity Model](https://docs.google.com/presentation/d/1rrbyXqxy3LXAJNPFrVH99mj_BNaJKymMsXZItYArWEM/edit?usp=sharing), 2017

# Assessment

In case you would like to perform a DevSecOps assessment, the following tools are available:

* Usage of the applicaton in a `container`.
* Development of an export to [OWASP Maturity Models](https://github.com/OWASP/Maturity-Models) (recommended for assessments with a lot of teams)
* Creation of your excel sheet (not recommended, you want to use DevOps, don't even try!)

## Container

1. Install [Docker](https://www.docker.com)
2. Run `docker run --rm -p 8080:8080 wurstbrot/dsomm:latest`
3. Browse to <http://localhost:8080> (on macOS and Windows browse to <http://192.168.99.100:8080> if you are using docker-machine instead
   of the native docker installation)

In case you would like to have perform an assessment for multiple teams, iterate from port 8080 to 8XXX, depending of the size of your team.
In case the application should be visible, but the "Implementation Level" shouldn't be changeable, consider the following code:

```bash
#!/bin/bash
set -xe

IMAGE_NAME="<YOUR ORGANIZATION>/dsomm:latest"

rm -Rf DevSecOps-MaturityModel || true
git clone git@github.com:wurstbrot/DevSecOps-MaturityModel.git
cp  data/* DevSecOps-MaturityModel/data
cp -a selectedData.csv DevSecOps-MaturityModel/selectedData.csv

cd DevSecOps-MaturityModel
docker build -t $IMAGE_NAME .
docker push $IMAGE_NAME
```

This approach also allows teams to perform self assessment with changes tracked in a repository.


## Amazon EC2 Instance

1. In the _EC2_ sidenav select _Instances_ and click _Launch Instance_
2. In _Step 1: Choose an Amazon Machine Image (AMI)_ choose an _Amazon
   Linux AMI_ or _Amazon Linux 2 AMI_
3. In _Step 3: Configure Instance Details_ unfold _Advanced Details_ and
   copy the script below into _User Data_
4. In _Step 6: Configure Security Group_ add a _Rule_ that opens port 80
   for HTTP
5. Launch your instance
6. Browse to your instance's public DNS

```bash
#!/bin/bash
yum update -y
yum install -y docker
service docker start
docker run -d -p 80:80 wurstbrot/dsomm:latest
```

## Tests

To run basic tests just

```bash
docker-compose -f docker-compose.dev.yaml up test-php
```

# Credits

* The dimension _Test and Verification_ is based on Christian Schneiders [Security DevOps Maturity Model (SDOMM)](https://www.christian-schneider.net/SecurityDevOpsMaturityModel.html). _Application tests_ and _Infrastructure tests_ are added by Timo Pagel. Also, the sub-dimension _Static depth_ has been evaluated by security experts at [OWASP Stammtisch Hamburg](https://www.owasp.org/index.php/OWASP_German_Chapter_Stammtisch_Initiative/Hamburg).
* The sub-dimension <i>Process</i> has been added after a discussion with [Francois Raynaud](https://www.linkedin.com/in/francoisraynaud/) that reactive activities are missing.
* Enhancement of my basic translation is performed by [Claud Camerino](https://github.com/clazba).
* Adding ISO 27001:2017 mapping, [Andre Baumeier](https://github.com/AndreBaumeier).
* Providing a documentation of how to use `docker` in the Juice Shop for simple copy&paste, [Björn Kimminich](https://github.com/bkimminich/).
* [OWASP Project Integration Project Writeup](https://github.com/OWASP/www-project-integration-standards/blob/master/writeups/owasp_in_sdlc/index.md) for providing documentation on different DevSecOps practices which are copied&pasted/ (and adopted) (https://github.com/northdpole, https://github.com/ThunderSon)
* The requirements from [level 0](https://github.com/AppSecure-nrw/security-belts/blob/master/white/) are based on/copied from [AppSecure NRW](https://appsecure.nrw/)

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
* Adding assessment questions

# Multilanguage support
Multilanguage support is not given currently and not planned.

# Sponsors

[![Timo Pagel IT-Consulting](https://raw.githubusercontent.com/DefectDojo/Documentation/master/doc/img/timo-pagel-logo.png)](https://pagel.pro)

[![Apprio Inc](https://github.com/wurstbrot/DevSecOps-MaturityModel/raw/master-old/assets/images/Apiiro_black_logo.png)](https://apiiro.com/)

# Donations

If you are using the model or you are inspired by it, want to help but don't want to create pull requests? You can donate at the [OWASP Project Wiki Page](https://owasp.org/donate/?reponame=www-project-devsecops-maturity-model&title=OWASP+Devsecops+Maturity+Model). Donations might be used for the design of logos/images/design or travels.

# License

This program is free software: you can redistribute it and/or modify it under the terms of the [GPL 3](https://www.gnu.org/licenses/) license.

The intellectual property (content in the _data_ folder) is licensed under Attribution-ShareAlike.
An example attribution by changing the content:
> This work is based on the [OWASP DevSecOps Maturity Model](https://dsomm.timo-pagel.de).

The OWASP DevSecOps Maturity Model and any contributions are Copyright © by Timo Pagel 2017-2022.
