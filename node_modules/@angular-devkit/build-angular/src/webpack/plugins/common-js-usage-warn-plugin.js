"use strict";
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommonJsUsageWarnPlugin = void 0;
const path_1 = require("path");
const webpack_diagnostics_1 = require("../../utils/webpack-diagnostics");
// Webpack doesn't export these so the deep imports can potentially break.
const AMDDefineDependency = require('webpack/lib/dependencies/AMDDefineDependency');
const CommonJsRequireDependency = require('webpack/lib/dependencies/CommonJsRequireDependency');
class CommonJsUsageWarnPlugin {
    constructor(options = {}) {
        this.options = options;
        this.shownWarnings = new Set();
        this.allowedDependencies = new Set(this.options.allowedDependencies);
    }
    apply(compiler) {
        compiler.hooks.compilation.tap('CommonJsUsageWarnPlugin', (compilation) => {
            compilation.hooks.finishModules.tap('CommonJsUsageWarnPlugin', (modules) => {
                var _a;
                const mainEntry = compilation.entries.get('main');
                if (!mainEntry) {
                    return;
                }
                const mainModules = new Set(mainEntry.dependencies.map((dep) => compilation.moduleGraph.getModule(dep)));
                for (const module of modules) {
                    const { dependencies, rawRequest } = module;
                    if (!rawRequest ||
                        rawRequest.startsWith('.') ||
                        (0, path_1.isAbsolute)(rawRequest) ||
                        this.allowedDependencies.has(rawRequest) ||
                        this.allowedDependencies.has(this.rawRequestToPackageName(rawRequest)) ||
                        rawRequest.startsWith('@angular/common/locales/')) {
                        /**
                         * Skip when:
                         * - module is absolute or relative.
                         * - module is allowed even if it's a CommonJS.
                         * - module is a locale imported from '@angular/common'.
                         */
                        continue;
                    }
                    if (this.hasCommonJsDependencies(compilation, dependencies)) {
                        // Dependency is CommonsJS or AMD.
                        const issuer = getIssuer(compilation, module);
                        // Check if it's parent issuer is also a CommonJS dependency.
                        // In case it is skip as an warning will be show for the parent CommonJS dependency.
                        const parentDependencies = (_a = getIssuer(compilation, issuer)) === null || _a === void 0 ? void 0 : _a.dependencies;
                        if (parentDependencies &&
                            this.hasCommonJsDependencies(compilation, parentDependencies, true)) {
                            continue;
                        }
                        // Find the main issuer (entry-point).
                        let mainIssuer = issuer;
                        let nextIssuer = getIssuer(compilation, mainIssuer);
                        while (nextIssuer) {
                            mainIssuer = nextIssuer;
                            nextIssuer = getIssuer(compilation, mainIssuer);
                        }
                        // Only show warnings for modules from main entrypoint.
                        // And if the issuer request is not from 'webpack-dev-server', as 'webpack-dev-server'
                        // will require CommonJS libraries for live reloading such as 'sockjs-node'.
                        if (mainIssuer && mainModules.has(mainIssuer)) {
                            const warning = `${issuer === null || issuer === void 0 ? void 0 : issuer.userRequest} depends on '${rawRequest}'. ` +
                                'CommonJS or AMD dependencies can cause optimization bailouts.\n' +
                                'For more info see: https://angular.io/guide/build#configuring-commonjs-dependencies';
                            // Avoid showing the same warning multiple times when in 'watch' mode.
                            if (!this.shownWarnings.has(warning)) {
                                (0, webpack_diagnostics_1.addWarning)(compilation, warning);
                                this.shownWarnings.add(warning);
                            }
                        }
                    }
                }
            });
        });
    }
    hasCommonJsDependencies(compilation, dependencies, checkParentModules = false) {
        for (const dep of dependencies) {
            if (dep instanceof CommonJsRequireDependency || dep instanceof AMDDefineDependency) {
                return true;
            }
            if (checkParentModules) {
                const module = getWebpackModule(compilation, dep);
                if (module && this.hasCommonJsDependencies(compilation, module.dependencies)) {
                    return true;
                }
            }
        }
        return false;
    }
    rawRequestToPackageName(rawRequest) {
        return rawRequest.startsWith('@')
            ? // Scoped request ex: @angular/common/locale/en -> @angular/common
                rawRequest.split('/', 2).join('/')
            : // Non-scoped request ex: lodash/isEmpty -> lodash
                rawRequest.split('/', 1)[0];
    }
}
exports.CommonJsUsageWarnPlugin = CommonJsUsageWarnPlugin;
function getIssuer(compilation, module) {
    if (!module) {
        return null;
    }
    return compilation.moduleGraph.getIssuer(module);
}
function getWebpackModule(compilation, dependency) {
    if (!dependency) {
        return null;
    }
    return compilation.moduleGraph.getModule(dependency);
}
