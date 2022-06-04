"use strict";
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildRelativePath = exports.findModule = exports.findModuleFromOptions = exports.ROUTING_MODULE_EXT = exports.MODULE_EXT = void 0;
const core_1 = require("@angular-devkit/core");
exports.MODULE_EXT = '.module.ts';
exports.ROUTING_MODULE_EXT = '-routing.module.ts';
/**
 * Find the module referred by a set of options passed to the schematics.
 */
function findModuleFromOptions(host, options) {
    // eslint-disable-next-line no-prototype-builtins
    if (options.hasOwnProperty('skipImport') && options.skipImport) {
        return undefined;
    }
    const moduleExt = options.moduleExt || exports.MODULE_EXT;
    const routingModuleExt = options.routingModuleExt || exports.ROUTING_MODULE_EXT;
    if (!options.module) {
        const pathToCheck = (options.path || '') + '/' + options.name;
        return (0, core_1.normalize)(findModule(host, pathToCheck, moduleExt, routingModuleExt));
    }
    else {
        const modulePath = (0, core_1.normalize)(`/${options.path}/${options.module}`);
        const componentPath = (0, core_1.normalize)(`/${options.path}/${options.name}`);
        const moduleBaseName = (0, core_1.normalize)(modulePath).split('/').pop();
        const candidateSet = new Set([(0, core_1.normalize)(options.path || '/')]);
        for (let dir = modulePath; dir != core_1.NormalizedRoot; dir = (0, core_1.dirname)(dir)) {
            candidateSet.add(dir);
        }
        for (let dir = componentPath; dir != core_1.NormalizedRoot; dir = (0, core_1.dirname)(dir)) {
            candidateSet.add(dir);
        }
        const candidatesDirs = [...candidateSet].sort((a, b) => b.length - a.length);
        for (const c of candidatesDirs) {
            const candidateFiles = ['', `${moduleBaseName}.ts`, `${moduleBaseName}${moduleExt}`].map((x) => (0, core_1.join)(c, x));
            for (const sc of candidateFiles) {
                if (host.exists(sc)) {
                    return (0, core_1.normalize)(sc);
                }
            }
        }
        throw new Error(`Specified module '${options.module}' does not exist.\n` +
            `Looked in the following directories:\n    ${candidatesDirs.join('\n    ')}`);
    }
}
exports.findModuleFromOptions = findModuleFromOptions;
/**
 * Function to find the "closest" module to a generated file's path.
 */
function findModule(host, generateDir, moduleExt = exports.MODULE_EXT, routingModuleExt = exports.ROUTING_MODULE_EXT) {
    let dir = host.getDir('/' + generateDir);
    let foundRoutingModule = false;
    while (dir) {
        const allMatches = dir.subfiles.filter((p) => p.endsWith(moduleExt));
        const filteredMatches = allMatches.filter((p) => !p.endsWith(routingModuleExt));
        foundRoutingModule = foundRoutingModule || allMatches.length !== filteredMatches.length;
        if (filteredMatches.length == 1) {
            return (0, core_1.join)(dir.path, filteredMatches[0]);
        }
        else if (filteredMatches.length > 1) {
            throw new Error(`More than one module matches. Use the '--skip-import' option to skip importing ` +
                'the component into the closest module or use the module option to specify a module.');
        }
        dir = dir.parent;
    }
    const errorMsg = foundRoutingModule
        ? 'Could not find a non Routing NgModule.' +
            `\nModules with suffix '${routingModuleExt}' are strictly reserved for routing.` +
            `\nUse the '--skip-import' option to skip importing in NgModule.`
        : `Could not find an NgModule. Use the '--skip-import' option to skip importing in NgModule.`;
    throw new Error(errorMsg);
}
exports.findModule = findModule;
/**
 * Build a relative path from one file path to another file path.
 */
function buildRelativePath(from, to) {
    from = (0, core_1.normalize)(from);
    to = (0, core_1.normalize)(to);
    // Convert to arrays.
    const fromParts = from.split('/');
    const toParts = to.split('/');
    // Remove file names (preserving destination)
    fromParts.pop();
    const toFileName = toParts.pop();
    const relativePath = (0, core_1.relative)((0, core_1.normalize)(fromParts.join('/') || '/'), (0, core_1.normalize)(toParts.join('/') || '/'));
    let pathPrefix = '';
    // Set the path prefix for same dir or child dir, parent dir starts with `..`
    if (!relativePath) {
        pathPrefix = '.';
    }
    else if (!relativePath.startsWith('.')) {
        pathPrefix = `./`;
    }
    if (pathPrefix && !pathPrefix.endsWith('/')) {
        pathPrefix += '/';
    }
    return pathPrefix + (relativePath ? relativePath + '/' : '') + toFileName;
}
exports.buildRelativePath = buildRelativePath;
