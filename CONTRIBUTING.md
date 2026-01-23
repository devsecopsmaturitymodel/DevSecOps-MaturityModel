# Contributing to DevSecOps Maturity Model (DSOMM)

[![GitHub contributors](https://img.shields.io/github/contributors/devsecopsmaturitymodel/DevSecOps-MaturityModel.svg)](https://github.com/devsecopsmaturitymodel/DevSecOps-MaturityModel/graphs/contributors)

DSOMM is an **open-source OWASP framework** that helps organizations assess and improve their **DevSecOps maturity** through structured activities, maturity levels, and recommendations.

---

## About the Project

The DSOMM consists of **two closely related repositories**:

1. **DevSecOps-MaturityModel**
   - Frontend visualization and UI
   - Built with **Angular**

2. **DevSecOps-MaturityModel-data**
   - Source of truth for all DSOMM activities
   - YAML-based structured data
   - generated `model.yaml` file consumed by the frontend

---

## Prerequisites

Before contributing, ensure you have the following installed:

1. **Node.js (LTS)**  
   - [Node.js Documentation](https://nodejs.org/)

2. **Angular CLI**  
   - [Angular Documentation](https://angular.dev/installation)
```bash
   npm install -g @angular/cli
```

---

## Setting Up the Project Locally

### 1. Fork the Repository

Fork the repository on GitHub:

[![GitHub forks](https://img.shields.io/github/forks/devsecopsmaturitymodel/DevSecOps-MaturityModel?style=social)](https://github.com/devsecopsmaturitymodel/DevSecOps-MaturityModel/fork)

### 2. Clone Your Fork

Clone your fork locally:
```bash
git clone https://github.com/<your-username>/DevSecOps-MaturityModel.git
```
### 3. Change directory to DSOMM
```bash
cd DevSecOps-MaturityModel
```
### 4. Install Dependencies

Install all required npm packages:
```bash
npm install
```
### 5.Running the Application
Start the local development server:
```bash
ng serve
```
Open your browser and navigate to:
```
http://localhost:4200/
```
The application will automatically reload if you change any source files.

## Coding Style and Conventions

### Frontend

* [ESLint](https://eslint.org/) is used for linting
* [Prettier](https://prettier.io/) is used for formatting

### YAML Files

To validate the schemas of the DSOMM yaml files in the IDE, it is recommended to use the VS Code extension  [YAML – Red Hat](https://marketplace.visualstudio.com/items?itemName=redhat.vscode-yaml) (`redhat.vscode-yaml`). The schemas are stored in `/src/assets/YAML/schemas`.


Run the linter:
```bash
ng lint
```
---

## Running Tests

### Unit Tests
```bash
ng test
```

### Build Verification

```bash
ng build
```

Ensure your changes do not break the build.

---

## Contribution Workflow

1. **Find or create an issue**

2. **Create a feature branch:**
```bash
   git checkout -b feature/short-description
```

3. **Make your changes**

4. **Run checks locally:**
```bash
   ng lint
   ng test
   ng build
```

5. **Commit your changes:**
```bash
   git commit -m "feat: short meaningful description"
```

6. **Push your branch and open a Pull Request:**
```bash
   git push origin feature/short-description
```

7. **Open the PR against the main branch**

   Clearly describe what you changed and why.

---

## Pull Request Guidelines

* Contributors are strongly encouraged to **sign all commits using GPG**  
  [Learn how to add a GPG key to your GitHub account](https://docs.github.com/en/authentication/managing-commit-signature-verification/adding-a-gpg-key-to-your-github-account)  
* Keep PRs focused and reasonably sized
* Do not mix unrelated changes
* Follow existing project structure and conventions
  
---

## Code of Conduct

Please follow the project [Code of Conduct](https://github.com/devsecopsmaturitymodel/DevSecOps-MaturityModel/blob/main/CODE_OF_CONDUCT.md) when interacting with maintainers and contributors.
