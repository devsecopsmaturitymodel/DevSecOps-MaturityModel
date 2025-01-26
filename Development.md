# DSOMM

## Development server
The DSOMM is based [Angular](https://angular.dev/) and uses npm for package management.
- If you have not yet installed npm or the Angular command line tools, install them now. First [NodeJS](https://nodejs.org/en/download) (which provides npm), then Angular:
``` 
npm install -g @angular/cli
``` 
- Clone the DSOMM repo
```
git clone https://github.com/devsecopsmaturitymodel/DevSecOps-MaturityModel.git
```
- Change directory to DSOMM
```
cd DevSecOps-MaturityModel
```
- Install Dependencies
```
npm install
```
- **NB!** The DSOMM activities are maintained separately. Download the `generated.yaml` and put it in the required folder
```
curl https://raw.githubusercontent.com/devsecopsmaturitymodel/DevSecOps-MaturityModel-data/main/src/assets/YAML/generated/generated.yaml -o src/assets/YAML/generated/generated.yaml
```
  
- Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.


## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Coding Style Conventions

- We follow the coding style defined by [ESLint](https://eslint.org/). 
- We also use [Prettier](https://prettier.io/docs/en/index.html) as our opinionated code formatter.
- To validate the schemas of the DSOMM yaml files in the IDE, it is recommended to use the VS Code extension [redhat.vscode-yaml](https://marketplace.visualstudio.com/items?itemName=redhat.vscode-yaml). The schemas are stored in /src/assets/YAML/schemas

