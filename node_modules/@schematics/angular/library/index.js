"use strict";
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@angular-devkit/core");
const schematics_1 = require("@angular-devkit/schematics");
const tasks_1 = require("@angular-devkit/schematics/tasks");
const dependencies_1 = require("../utility/dependencies");
const json_file_1 = require("../utility/json-file");
const latest_versions_1 = require("../utility/latest-versions");
const paths_1 = require("../utility/paths");
const workspace_1 = require("../utility/workspace");
const workspace_models_1 = require("../utility/workspace-models");
function updateTsConfig(packageName, ...paths) {
    return (host) => {
        if (!host.exists('tsconfig.json')) {
            return host;
        }
        const file = new json_file_1.JSONFile(host, 'tsconfig.json');
        const jsonPath = ['compilerOptions', 'paths', packageName];
        const value = file.get(jsonPath);
        file.modify(jsonPath, Array.isArray(value) ? [...value, ...paths] : paths);
    };
}
function addDependenciesToPackageJson() {
    return (host) => {
        [
            {
                type: dependencies_1.NodeDependencyType.Dev,
                name: '@angular/compiler-cli',
                version: latest_versions_1.latestVersions.Angular,
            },
            {
                type: dependencies_1.NodeDependencyType.Dev,
                name: '@angular-devkit/build-angular',
                version: latest_versions_1.latestVersions.DevkitBuildAngular,
            },
            {
                type: dependencies_1.NodeDependencyType.Dev,
                name: 'ng-packagr',
                version: latest_versions_1.latestVersions['ng-packagr'],
            },
            {
                type: dependencies_1.NodeDependencyType.Default,
                name: 'tslib',
                version: latest_versions_1.latestVersions['tslib'],
            },
            {
                type: dependencies_1.NodeDependencyType.Dev,
                name: 'typescript',
                version: latest_versions_1.latestVersions['typescript'],
            },
        ].forEach((dependency) => (0, dependencies_1.addPackageJsonDependency)(host, dependency));
        return host;
    };
}
function addLibToWorkspaceFile(options, projectRoot, projectName) {
    return (0, workspace_1.updateWorkspace)((workspace) => {
        if (workspace.projects.size === 0) {
            workspace.extensions.defaultProject = projectName;
        }
        workspace.projects.add({
            name: projectName,
            root: projectRoot,
            sourceRoot: `${projectRoot}/src`,
            projectType: workspace_models_1.ProjectType.Library,
            prefix: options.prefix,
            targets: {
                build: {
                    builder: workspace_models_1.Builders.NgPackagr,
                    defaultConfiguration: 'production',
                    options: {
                        project: `${projectRoot}/ng-package.json`,
                    },
                    configurations: {
                        production: {
                            tsConfig: `${projectRoot}/tsconfig.lib.prod.json`,
                        },
                        development: {
                            tsConfig: `${projectRoot}/tsconfig.lib.json`,
                        },
                    },
                },
                test: {
                    builder: workspace_models_1.Builders.Karma,
                    options: {
                        main: `${projectRoot}/src/test.ts`,
                        tsConfig: `${projectRoot}/tsconfig.spec.json`,
                        karmaConfig: `${projectRoot}/karma.conf.js`,
                    },
                },
            },
        });
    });
}
function default_1(options) {
    return async (host) => {
        const prefix = options.prefix;
        // If scoped project (i.e. "@foo/bar"), convert projectDir to "foo/bar".
        const packageName = options.name;
        if (/^@.*\/.*/.test(options.name)) {
            const [, name] = options.name.split('/');
            options.name = name;
        }
        const workspace = await (0, workspace_1.getWorkspace)(host);
        const newProjectRoot = workspace.extensions.newProjectRoot || '';
        let folderName = packageName.startsWith('@') ? packageName.substr(1) : packageName;
        if (/[A-Z]/.test(folderName)) {
            folderName = core_1.strings.dasherize(folderName);
        }
        const projectRoot = (0, core_1.join)((0, core_1.normalize)(newProjectRoot), folderName);
        const distRoot = `dist/${folderName}`;
        const pathImportLib = `${distRoot}/${folderName.replace('/', '-')}`;
        const sourceDir = `${projectRoot}/src/lib`;
        const templateSource = (0, schematics_1.apply)((0, schematics_1.url)('./files'), [
            (0, schematics_1.applyTemplates)({
                ...core_1.strings,
                ...options,
                packageName,
                projectRoot,
                distRoot,
                relativePathToWorkspaceRoot: (0, paths_1.relativePathToWorkspaceRoot)(projectRoot),
                prefix,
                angularLatestVersion: latest_versions_1.latestVersions.Angular.replace(/~|\^/, ''),
                tsLibLatestVersion: latest_versions_1.latestVersions['tslib'].replace(/~|\^/, ''),
                folderName,
            }),
            (0, schematics_1.move)(projectRoot),
        ]);
        return (0, schematics_1.chain)([
            (0, schematics_1.mergeWith)(templateSource),
            addLibToWorkspaceFile(options, projectRoot, packageName),
            options.skipPackageJson ? (0, schematics_1.noop)() : addDependenciesToPackageJson(),
            options.skipTsConfig ? (0, schematics_1.noop)() : updateTsConfig(packageName, pathImportLib, distRoot),
            (0, schematics_1.schematic)('module', {
                name: options.name,
                commonModule: false,
                flat: true,
                path: sourceDir,
                project: packageName,
            }),
            (0, schematics_1.schematic)('component', {
                name: options.name,
                selector: `${prefix}-${options.name}`,
                inlineStyle: true,
                inlineTemplate: true,
                flat: true,
                path: sourceDir,
                export: true,
                project: packageName,
            }),
            (0, schematics_1.schematic)('service', {
                name: options.name,
                flat: true,
                path: sourceDir,
                project: packageName,
            }),
            (_tree, context) => {
                if (!options.skipPackageJson && !options.skipInstall) {
                    context.addTask(new tasks_1.NodePackageInstallTask());
                }
            },
        ]);
    };
}
exports.default = default_1;
