# DSOMM - DevSecOps Maturity Model

## What is DSOMM?
DSOMM is a framework that helps organizations to assess, improve and prioritize security activities in their software development cycle. 

DSOMM is a project of the OWASP Foundation.

## DSOMM vs OWASP SAMM
[DSOMM](https://dsomm.owasp.org/) and [OWASP SAMM](https://owaspsamm.org/) are both frameworks that share a common goal of improving security. 

**OWASP SAMM** is more focused on the overall maturity of an organization's software assurance and security practices, with a broader scope that includes governance, compliance, risk management, and secure software development.

SAMM is written by security specialists for security specialists, focusing on security processes across the whole organizations.

**DSOMM** focuses on activities that integrate security directly into the DevOps workflows. DSOMM takes a more technical approach, going lower in the technology stack it provides a roadmap on how to systematically improve the security in the software development.

DSOMM is written for technical teams focused on implementing secure software.

DSOMM has currently has a OWASP Lab status, while SAMM has a Flagship status.

# How to use this DSOMM site
The DSOMM application is a frontend only application, storing all progress in your local storage in your browser. If you delete your local storage, your  progress will be gone, and you cannot share your saved progress with anyone else.

To do that, you need to install your own local DSOMM application.

You can export the progress of the different activities as a `generated.yaml` file, which you may import into your own site.


## How to setup your own DSOMM
The DSOMM application can be run as a Docker image, an Amazon EC2 instance, or as a standalone Angular application using NodeJS. Please see [README.md](./usage/README) for further instructions.

The DSOMM application is currently still a lightweight frontend only application, without a backend to store changes of progress. Any changes are stored in the browser. However, as above, you can export the `generated.yaml` and update your own site with this.


# The DSOMM framework
The DSOMM framework has a number of _activities_ grouped by _dimensions_ and _maturity levels_. E.g. the _Centralized system logging_ is a maturity level 1 activity in the _Logging_ dimension, while _Correlation of security events_ is considered level 5.



## Before you start
To prepare you for there are some activities that we recommend you do before you start using DSOMM. Getting the stakeholders onboard will ease your path.

See [Maturity level 0](./usage/maturity-level-0) to learn about the important first steps.


## Dimensions
The DSOMM framework categorizes its activities into dimensions, each representing a key area of the software development lifecycle where security can be integrated and matured.

Dimensions Overview:
 - **Build and Deployment**: Focuses on security practices in the CI/CD pipeline and deployment processes
 - **Culture and Organization**: Addresses organizational culture, education, and processes that support security initiatives.
 - **Implementation**: Covers secure coding and infrastructure hardening practices.
- **Information Gathering**: Involves gathering data for threat analysis, risk assessment, and metrics collection.
- **Test and Verification**: Focuses on testing practices to validate security measures and ensure continuous improvement.

For detailed information on each dimension, refer to [Dimensions](./usage/dimensions).





## Evidence
If your CISO requires you to document evidence that an activity is completed, you can edit your `generated.yaml` file as documented in the [README.md](./usage/README) _Teams and Groups_. It is currently not possible to provide evidence directly in the browser.
