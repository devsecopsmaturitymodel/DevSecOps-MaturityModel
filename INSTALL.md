# Install DSOMM
The DSOMM application is frontend only. Data is only stored in server side YAML files, and in the localStorage im the user's browser. 

The application can be deployed in many ways.  using a number of  Docker, Amazon AWS and a standalone Angular service.

## Configuration

The DSOMM activities as maintained in a separate GitHub repository. For the latest version, check out 


# Docker
1. Install [Docker](https://www.docker.com)
1. Download and run DSOMM: \
  `docker pull wurstbrot/dsomm:latest` \
  `docker run --rm -p 8080:8080 wurstbrot/dsomm:latest`
1. Open DSOMM on http://localhost:8080

If you want to override the default `generated.yaml` you can mount this file when starting the docker command. 

`docker run  --rm --volume $PWD/generated.yaml:/srv/assets/YAML/generated/generated.yaml -p 8080:8080 wurstbrot/dsomm`

**NB!** Note that the docker command requires an absolute path to the local file. (Hence, the use of the `$PWD` variable. On Windows, substitute `$PWD` with `%CD%`.)



# Amazon








# Angular build - Any web server
Since this is a frontend application any web server 
- Clone the DSOMM repo

- **NB!** The DSOMM activities are maintained separately. Download the `generated.yaml` and put it in the required folder
``` 
git clone https://github.com/devsecopsmaturitymodel/DevSecOps-MaturityModel.git
cd DevSecOps-MaturityModel
npm install
curl https://raw.githubusercontent.com/devsecopsmaturitymodel/DevSecOps-MaturityModel-data/main/src/assets/YAML/generated/generated.yaml -o src/assets/YAML/generated/generated.yaml
ng build
```
The files that were created in the subfolder `dist` 
















# Assessment

In case you would like to perform a DevSecOps assessment, the following tools are available:

* Usage of the applicaton in a `container`.
* Development of an export to [OWASP Maturity Models](https://github.com/OWASP/Maturity-Models) (recommended for assessments with a lot of teams)
* Creation of your excel sheet (not recommended, you want to use DevOps, don't even try!)

## Container

1. Install [Docker](https://www.docker.com)
2. Run `docker pull wurstbrot/dsomm:latest && docker run --rm -p 8080:8080 wurstbrot/dsomm:latest`
3. Browse to <http://localhost:8080> (on macOS and Windows browse to <http://192.168.99.100:8080> if you are using docker-machine instead
   of the native docker installation)

For customized DSOMM, take a look at https://github.com/wurstbrot/DevSecOps-MaturityModel-custom. 

You can download your current state from the circular heatmap and mount it again via 

```bash
wget https://raw.githubusercontent.com/devsecopsmaturitymodel/DevSecOps-MaturityModel-data/main/src/assets/YAML/generated/generated.yaml # or go to /circular-heatmap and download edited yaml (bottom right)
docker run -p 8080:8080 -v /tmp/generated.yaml:/srv/assets/YAML/generated/generated.yaml wurstbrot/dsomm:latest
```

.

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
service docker start
docker run -d -p 80:8080 wurstbrot/dsomm:latest
```

## Activity Definitions
The definition of the activities are in the [data-repository](https://github.com/devsecopsmaturitymodel/DevSecOps-MaturityModel-data). 

## Teams and Groups
To customize these teams, you can create your own [meta.yaml](src/assets/meta.yaml)  file with your unique team definitions.

Assessments within the framework can be based on either a team or a specific application, which can be referred to as the context. Depending on how you define the context or teams, you may want to group them together.

Here are a couple of examples to illustrate this, in breakers the DSOMM word:
- Multiple applications (teams) can belong to a single overarching team (application).
- Multiple teams (teams) can belong to a larger department (group).

Feel free to create your own [meta.yaml](src/assets/meta.yaml) file to tailor the framework to your specific needs and mount it in your environment (e.g. kubernetes or docker).
Here is an example to start docker with customized meta.yaml:
```
# Customized meta.yaml
cp src/assets/YAML/meta.yaml .
docker run -v $(pwd)/meta.yaml:/srv/assets/YAML/meta.yaml -p 8080:8080 wurstbrot/dsomm

# Customized meta.yaml and generated.yaml
cp src/assets/YAML/meta.yaml .
cp $(pwd)/src/assets/YAML/generated/generated.yaml .
docker run -v  $(pwd)/meta.yaml:/srv/assets/YAML/meta.yaml -v $(pwd)/generated.yaml:/srv/assets/YAML/generated/generated.yaml -p 8080:8080 wurstbrot/dsomm
```

In the corresponding [dimension YAMLs](https://github.com/devsecopsmaturitymodel/DevSecOps-MaturityModel-data/tree/main/src/assets/YAML/default), use:
```
[...]
      teamsImplemented:
        Default: false
        B: true
        C: true
      teamsEvidence:
        B: All team members completed OWASP Secure Coding Dojo training on 2025-01-11. 
        C: |
          The pentest report from 2025 has been split into Jira tasks under
          [TODO-123](https://jira.example.com/issues/TODO-123).
          
          _2025-04-01:_ All fixes of **critical** findings are deployed to production.
```
The `|` is yaml syntax to indicate that the evidence spans multiple lines. Markdown 
syntax can be used. The evidence is currently visible on the activity from the Matrix page.

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

[![Heroku (hosting)](https://github.com/wurstbrot/DevSecOps-MaturityModel/raw/master/src/assets/images/sponsors/heroku.png)](https://www.heroku.com/open-source-credit-program)

# Donations

If you are using the model or you are inspired by it, want to help but don't want to create pull requests? You can donate at the [OWASP Project Wiki Page](https://owasp.org/donate/?reponame=www-project-devsecops-maturity-model&title=OWASP+Devsecops+Maturity+Model). Donations might be used for the design of logos/images/design or travels.

# License

This program is free software: you can redistribute it and/or modify it under the terms of the [GPL 3](https://www.gnu.org/licenses/) license.

The intellectual property (content in the _data_ folder) is licensed under Attribution-ShareAlike.
An example attribution by changing the content:
> This work is based on the [OWASP DevSecOps Maturity Model](https://dsomm.timo-pagel.de).

The OWASP DevSecOps Maturity Model and any contributions are Copyright © by Timo Pagel 2017-2022.






For customized DSOMM, take a look at https://github.com/wurstbrot/DevSecOps-MaturityModel-custom. 

You can download your current state from the circular heatmap and mount it again via 

```bash
wget https://raw.githubusercontent.com/devsecopsmaturitymodel/DevSecOps-MaturityModel-data/main/src/assets/YAML/generated/generated.yaml # or go to /circular-heatmap and download edited yaml (bottom right)
docker run -p 8080:8080 -v /tmp/generated.yaml:/srv/assets/YAML/generated/generated.yaml wurstbrot/dsomm:latest
```

