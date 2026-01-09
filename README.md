# About DSOMM

Modern software delivery is powered by agile teams, CI/CD pipelines, containerization, and cloud-native platforms. While these practices have dramatically increased delivery speed and scalability, security often fails to mature at the same pace.

In many organizations, security controls that are mandatory in production environments are inconsistently applied, or entirely missing, in build pipelines, container registries, and integration workflows. This gap introduces unnecessary risk, including exposed registries, vulnerable container images, weak pipeline controls, and, in severe cases, the loss of proprietary source code.

The **OWASP DevSecOps Maturity Model (DSOMM)** exists to close this gap.

---

## Why DSOMM Exists

DSOMM provides a structured, opinionated maturity model that helps organizations systematically integrate security into DevOps practices - without sacrificing delivery velocity. It enables teams to:

- Assess their current DevSecOps maturity
- Prioritize meaningful security improvements
- Incrementally strengthen security capabilities across the software lifecycle
- Align engineering, security, and leadership around a shared roadmap

Rather than treating security as a separate function or a final gate, DSOMM embeds security directly into how software is built, tested, and delivered.

---

## The DSOMM Application

The DSOMM Application operationalizes the maturity model by transforming abstract concepts into concrete, trackable activities. Teams can:

- Visualize maturity across dimensions and sub-dimensions
- Track implementation levels per activity
- Document progress using a GitOps-style workflow
- Attach evidence to activities for audit and executive reporting
- Map DSOMM activities to other standards and frameworks

This makes DSOMM equally valuable for engineers, security practitioners, auditors, and CISOs.

---

## Security as an Enabler

When implemented correctly, security strengthens DevOps rather than competing with it. Automated dependency scanning, container hardening, pipeline enforcement, and policy-driven controls are accelerators; not blockers.

DSOMM helps teams adopt these practices deliberately, measurably, and sustainably.

---

## Built for Continuous Change

Attackers evolve. Tooling advances. Threats adapt.

DSOMM provides a forward-looking framework that allows organizations to respond with clarity instead of reaction—grounded in shared language, shared priorities, and continuous improvement.

---

## Open and Community-Driven

DSOMM is an open, community-driven project under the umbrella of the OWASP Foundation. It is designed to be transparent, adaptable, and practical at any scale—from startups to multinational enterprises.

Contributions, feedback, and collaboration from the community are encouraged to ensure the model remains relevant and effective as DevSecOps practices evolve.


---

## Usage

For usage instructions, please see [Usage](/usage)

<details>
<summary>DSOMM - DevSecOps Maturity Model</summary>

# DSOMM – DevSecOps Maturity Model

The **DevSecOps Maturity Model (DSOMM)** is a framework designed to help organizations assess, prioritize, and continuously improve security practices within their software development and delivery lifecycle.

DSOMM is an open project of the **OWASP Foundation**, developed to provide practical, implementation-focused guidance for modern DevOps environments.

</details>

---

<details>
<summary>What is DSOMM</summary>

# What Is DSOMM?

DSOMM helps organizations answer three fundamental questions:

- Where are we today in our DevSecOps maturity?
- What security activities should we prioritize next?
- How do we systematically improve security without slowing delivery?

The model focuses on **concrete, technical activities** that integrate security directly into DevOps workflows such as CI/CD pipelines, containerization, infrastructure provisioning, and testing.

Rather than prescribing abstract processes, DSOMM provides a **clear roadmap of actionable improvements** that teams can implement incrementally and measure over time.

</details>

---

<details>
<summary>DSOMM vs OWASP SAMM</summary>

# DSOMM vs OWASP SAMM

DSOMM and **OWASP SAMM** share a common goal: improving software security maturity. However, they serve different audiences and use cases.

**OWASP SAMM**:
- Focuses on overall software assurance maturity
- Covers governance, compliance, risk management, and organizational processes
- Written primarily by security specialists for security programs
- Takes a broad, organization-wide perspective

**DSOMM**:
- Focuses on embedding security directly into DevOps workflows
- Operates lower in the technical stack (pipelines, containers, tooling)
- Provides concrete implementation guidance for engineering teams
- Is written for practitioners building and operating secure software systems

SAMM currently holds **OWASP Flagship** status, while DSOMM is an **OWASP Lab** project. The two models are complementary and are often used together.

</details>

---

<details>
<summary>How the DSOMM Application Works</summary>

# How the DSOMM Application Works

The DSOMM application is a **frontend-only web application**.

## Community Instance (Quick Start)

You can immediately explore DSOMM using the public community instance:

https://dsomm.owasp.org

Important notes:
- All progress is stored in your browser’s localStorage
- Clearing browser data will erase your progress
- Progress cannot be shared directly with other users

This mode is ideal for:
- Learning DSOMM
- Individual exploration
- Lightweight, ad-hoc assessments

</details>

---

<details>
<summary>Running Your Own DSOMM Instance</summary>

# Running Your Own DSOMM Instance

To enable collaboration, persistence, or GitOps-style workflows, you should run your own DSOMM instance.

DSOMM can be deployed in three primary ways:

- Docker container
- Amazon EC2
- Local Angular application

---


## Running DSOMM as a Docker Container (Recommended)

### Prerequisites
- Docker installed

### Steps
```bash
docker pull wurstbrot/dsomm:latest
docker run --rm -p 8080:8080 wurstbrot/dsomm:latest &
```

### Access
```text
http://localhost:8080
```

On macOS or Windows using docker-machine:
```text
http://192.168.99.100:8080
```

---

## Running DSOMM on Amazon EC2

1. Open the EC2 console and click **Launch Instance**
2. Choose an **Amazon Linux AMI** or **Amazon Linux 2 AMI**
3. In **Configure Instance Details**, expand **Advanced Details** and add the following to **User Data**:

```bash
#!/bin/bash
service docker start
docker run -d -p 80:8080 wurstbrot/dsomm:latest
```

4. In **Security Groups**, allow inbound HTTP traffic on port 80
5. Launch the instance
6. Access DSOMM via the instance’s public DNS

---

## Running DSOMM from GitHub (Local Development)

### Prerequisites
- Node.js
- Angular CLI

### Steps
```bash
git clone https://github.com/wurstbrot/DevSecOps-MaturityModel
cd DevSecOps-MaturityModel
npm install
ng serve
```

### Access
```text
http://localhost:4200
```

---

## DSOMM Customization

DSOMM is designed to be flexible and adaptable to different organizational structures, assessment contexts, and maturity models. Customization is achieved through YAML configuration files that are mounted into the DSOMM container at runtime.

---

### Teams and Groups

To customize teams and groups, you can create your own `default/teams.yaml` file with unique team definitions. You can also download the teams file from the Teams page and selecting "Download Team Setup".

Assessments within DSOMM can be based on either:
- A **team**, or
- A **specific application**

These are collectively referred to as the **assessment context**. Depending on how you define contexts, you may want to group them hierarchically.

#### Common use cases for custom teams and groups

- Multiple applications (teams) belonging to a single overarching application
- Multiple teams grouped under a larger department or business unit

#### Load a custom teams and groups file

```bash
docker run --rm \
  -v /local/path/teams.yaml:/srv/assets/YAML/default/teams.yaml \
  -p 8080:8080 \
  wurstbrot/dsomm &
```

---

### DSOMM Application Settings

Application-level configuration is stored in the `meta.yaml` file. This file allows you to customize:

- Browser behavior
- Data file names
- Progress definitions
- Language and localization options
- Other application settings

#### Load custom application settings

```bash
docker run --rm \
  -v /local/path/meta.yaml:/srv/assets/YAML/meta.yaml \
  -p 8080:8080 \
  wurstbrot/dsomm &
```

---

### Custom DSOMM Model

By default, DSOMM loads the standard maturity model. You can override this by supplying a custom `model.yaml` file.

This allows you to:
- Add, remove, or modify dimensions
- Customize sub-dimensions
- Define or remove activities

#### Load a custom DSOMM model

```bash
docker run --rm \
  -v /local/path/custom-model.yaml:/srv/assets/YAML/default/model.yaml \
  -p 8080:8080 \
  wurstbrot/dsomm &
```

---

### Team Progress Import and Restore

The DSOMM application allows exporting the current assessment state via:

**Overview → Download Team Progress**

This produces a `team-progress.yaml` file, which can be used to restore progress when:
- Switching between organizational assessments
- Recovering from accidental browser resets
- Rehydrating assessments in new environments

> Progress can only be restored if it was previously exported.

#### Load a saved team progress export

```bash
docker run --rm \
  -v /local/path/team-progress.yaml:/srv/assets/YAML/team-progress.yaml \
  -p 8080:8080 \
  wurstbrot/dsomm &
```

---

### Evidence and Team-Specific Implementation

Within the dimension YAML files, activities can track implementation status and evidence per team.

Example:

```yaml
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

Notes:
- The `|` character indicates a multi-line YAML block
- Markdown syntax is supported within evidence fields
- Evidence is displayed directly on the activity within the **Matrix** view

---

### Loading Multiple Custom Files at Once

```bash
docker run --rm \
  -v /local/path/meta.yaml:/srv/assets/YAML/meta.yaml \
  -v /local/path/teams.yaml:/srv/assets/YAML/default/teams.yaml \
  -v /local/path/team-progress.yaml:/srv/assets/YAML/team-progress.yaml \
  -v /local/path/custom-model.yaml:/srv/assets/YAML/default/model.yaml \
  -p 8080:8080 \
  wurstbrot/dsomm:latest &
```

This approach enables:
- Fully reproducible assessments
- GitOps-style configuration management
- Multi-team and multi-context maturity tracking

</details>

---

<details>
<summary>Understanding the DSOMM Framework</summary>

# Understanding the DSOMM Framework

DSOMM organizes security activities by **dimensions** and **maturity levels**.

Each activity:
- Represents a concrete security capability
- Is assigned a maturity level
- Can be marked as implemented per team
- Can include documented evidence

Example:
- Centralized system logging → Maturity Level 1
- Correlation of security events → Maturity Level 5

Before starting, it is strongly recommended to review **Maturity Level 0**, which focuses on stakeholder alignment and foundational prerequisites.

</details>

---

<details>
<summary>DSOMM Dimensions</summary>

# DSOMM Dimensions

DSOMM groups activities into the following dimensions:

- **Build and Deployment**  
  Security practices in CI/CD pipelines and deployment workflows

- **Culture and Organization**  
  Organizational culture, training, and processes that support security

- **Implementation**  
  Secure coding, infrastructure hardening, and configuration management

- **Information Gathering**  
  Metrics, telemetry, threat intelligence, and risk data collection

- **Test and Verification**  
  Security testing and validation to ensure continuous improvement

</details>

---

<details>
<summary>Evidence and Auditing</summary>

# Evidence and Auditing

For organizations that require evidence (e.g., for CISOs or auditors), DSOMM supports attaching evidence directly in YAML files.

Evidence is defined in `generated.yaml` or `team-progress.yaml` files using the `teamsEvidence` attribute. Markdown is supported, and multi-line evidence can be provided using YAML block syntax.

Evidence is displayed directly on the activity within the Matrix view.

> Note: Evidence cannot currently be entered directly in the browser UI.

</details>

---

<details>
<summary>Local Storage Behavior</summary>

# Local Storage Behavior

By default:
- DSOMM stores progress in browser localStorage
- Clearing browser data will reset progress
- Self-hosted deployments are recommended for persistence

</details>

---

<details>
<summary>Community and Contribution</summary>

# Community and Contribution

DSOMM is a community-driven project.

- Join `#dsomm` on OWASP Slack
- Submit issues or pull requests on GitHub
- Participate in workshops, talks, and working groups

</details>

---

<details>
<summary>License</summary>

# License

The DSOMM application is released under **GPL v3**.

The maturity model content is licensed under **Creative Commons Attribution-ShareAlike**.

Attribution example:

> This work is based on the OWASP DevSecOps Maturity Model.

</details>