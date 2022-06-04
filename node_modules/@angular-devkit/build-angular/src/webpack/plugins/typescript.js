"use strict";
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.createIvyPlugin = void 0;
const core_1 = require("@angular-devkit/core");
const webpack_1 = require("@ngtools/webpack");
const typescript_1 = require("typescript");
function ensureIvy(wco) {
    if (wco.tsConfig.options.enableIvy !== false) {
        return;
    }
    wco.logger.warn('Project is attempting to disable the Ivy compiler. ' +
        'Angular versions 12 and higher do not support the deprecated View Engine compiler for applications. ' +
        'The Ivy compiler will be used to build this project. ' +
        '\nFor additional information or if the build fails, please see https://angular.io/guide/ivy');
    wco.tsConfig.options.enableIvy = true;
}
function createIvyPlugin(wco, aot, tsconfig) {
    if (aot) {
        ensureIvy(wco);
    }
    const { buildOptions } = wco;
    const optimize = buildOptions.optimization.scripts;
    const compilerOptions = {
        sourceMap: buildOptions.sourceMap.scripts,
        declaration: false,
        declarationMap: false,
    };
    if (buildOptions.preserveSymlinks !== undefined) {
        compilerOptions.preserveSymlinks = buildOptions.preserveSymlinks;
    }
    // Outputting ES2015 from TypeScript is the required minimum for the build optimizer passes.
    // Downleveling to ES5 will occur after the build optimizer passes via babel which is the same
    // as for third-party libraries. This greatly reduces the complexity of static analysis.
    if (wco.scriptTarget < typescript_1.ScriptTarget.ES2015) {
        compilerOptions.target = typescript_1.ScriptTarget.ES2015;
    }
    const fileReplacements = {};
    if (buildOptions.fileReplacements) {
        for (const replacement of buildOptions.fileReplacements) {
            fileReplacements[(0, core_1.getSystemPath)(replacement.replace)] = (0, core_1.getSystemPath)(replacement.with);
        }
    }
    let inlineStyleFileExtension;
    switch (buildOptions.inlineStyleLanguage) {
        case 'less':
            inlineStyleFileExtension = 'less';
            break;
        case 'sass':
            inlineStyleFileExtension = 'sass';
            break;
        case 'scss':
            inlineStyleFileExtension = 'scss';
            break;
        case 'css':
        default:
            inlineStyleFileExtension = 'css';
            break;
    }
    return new webpack_1.AngularWebpackPlugin({
        tsconfig,
        compilerOptions,
        fileReplacements,
        jitMode: !aot,
        emitNgModuleScope: !optimize,
        inlineStyleFileExtension,
    });
}
exports.createIvyPlugin = createIvyPlugin;
