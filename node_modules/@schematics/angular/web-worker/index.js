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
const parse_name_1 = require("../utility/parse-name");
const paths_1 = require("../utility/paths");
const workspace_1 = require("../utility/workspace");
function addSnippet(options) {
    return (host, context) => {
        context.logger.debug('Updating appmodule');
        if (options.path === undefined) {
            return;
        }
        const fileRegExp = new RegExp(`^${options.name}.*\\.ts`);
        const siblingModules = host
            .getDir(options.path)
            .subfiles // Find all files that start with the same name, are ts files,
            // and aren't spec or module files.
            .filter((f) => fileRegExp.test(f) && !/(module|spec)\.ts$/.test(f))
            // Sort alphabetically for consistency.
            .sort();
        if (siblingModules.length === 0) {
            // No module to add in.
            return;
        }
        const siblingModulePath = `${options.path}/${siblingModules[0]}`;
        const logMessage = 'console.log(`page got message: ${data}`);';
        const workerCreationSnippet = core_1.tags.stripIndent `
      if (typeof Worker !== 'undefined') {
        // Create a new
        const worker = new Worker(new URL('./${options.name}.worker', import.meta.url));
        worker.onmessage = ({ data }) => {
          ${logMessage}
        };
        worker.postMessage('hello');
      } else {
        // Web Workers are not supported in this environment.
        // You should add a fallback so that your program still executes correctly.
      }
    `;
        // Append the worker creation snippet.
        const originalContent = host.read(siblingModulePath);
        host.overwrite(siblingModulePath, originalContent + '\n' + workerCreationSnippet);
        return host;
    };
}
function default_1(options) {
    return async (host) => {
        const workspace = await (0, workspace_1.getWorkspace)(host);
        if (!options.project) {
            throw new schematics_1.SchematicsException('Option "project" is required.');
        }
        const project = workspace.projects.get(options.project);
        if (!project) {
            throw new schematics_1.SchematicsException(`Invalid project name (${options.project})`);
        }
        const projectType = project.extensions['projectType'];
        if (projectType !== 'application') {
            throw new schematics_1.SchematicsException(`Web Worker requires a project type of "application".`);
        }
        if (options.path === undefined) {
            options.path = (0, workspace_1.buildDefaultPath)(project);
        }
        const parsedPath = (0, parse_name_1.parseName)(options.path, options.name);
        options.name = parsedPath.name;
        options.path = parsedPath.path;
        const templateSourceWorkerCode = (0, schematics_1.apply)((0, schematics_1.url)('./files/worker'), [
            (0, schematics_1.applyTemplates)({ ...options, ...core_1.strings }),
            (0, schematics_1.move)(parsedPath.path),
        ]);
        const root = project.root || '';
        const templateSourceWorkerConfig = (0, schematics_1.apply)((0, schematics_1.url)('./files/worker-tsconfig'), [
            (0, schematics_1.applyTemplates)({
                ...options,
                relativePathToWorkspaceRoot: (0, paths_1.relativePathToWorkspaceRoot)(root),
            }),
            (0, schematics_1.move)(root),
        ]);
        return (0, schematics_1.chain)([
            // Add project configuration.
            (0, workspace_1.updateWorkspace)((workspace) => {
                var _a, _b, _c, _d;
                var _e, _f;
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                const project = workspace.projects.get(options.project);
                const buildTarget = project.targets.get('build');
                const testTarget = project.targets.get('test');
                if (!buildTarget) {
                    throw new Error(`Build target is not defined for this project.`);
                }
                const workerConfigPath = (0, core_1.join)((0, core_1.normalize)(root), 'tsconfig.worker.json');
                (_b = (_e = ((_a = buildTarget.options) !== null && _a !== void 0 ? _a : (buildTarget.options = {}))).webWorkerTsConfig) !== null && _b !== void 0 ? _b : (_e.webWorkerTsConfig = workerConfigPath);
                if (testTarget) {
                    (_d = (_f = ((_c = testTarget.options) !== null && _c !== void 0 ? _c : (testTarget.options = {}))).webWorkerTsConfig) !== null && _d !== void 0 ? _d : (_f.webWorkerTsConfig = workerConfigPath);
                }
            }),
            // Create the worker in a sibling module.
            options.snippet ? addSnippet(options) : (0, schematics_1.noop)(),
            // Add the worker.
            (0, schematics_1.mergeWith)(templateSourceWorkerCode),
            (0, schematics_1.mergeWith)(templateSourceWorkerConfig),
        ]);
    };
}
exports.default = default_1;
