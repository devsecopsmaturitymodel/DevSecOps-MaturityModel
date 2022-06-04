"use strict";
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.normalizeCacheOptions = void 0;
const core_1 = require("@angular-devkit/core");
const path_1 = require("path");
const environment_options_1 = require("./environment-options");
const package_version_1 = require("./package-version");
function normalizeCacheOptions(metadata, worspaceRoot) {
    var _a;
    const cacheMetadata = core_1.json.isJsonObject(metadata.cli) && core_1.json.isJsonObject(metadata.cli.cache)
        ? metadata.cli.cache
        : {};
    const { enabled = true, environment = 'local', path = '.angular/cache' } = cacheMetadata;
    const isCI = process.env['CI'] === '1' || ((_a = process.env['CI']) === null || _a === void 0 ? void 0 : _a.toLowerCase()) === 'true';
    let cacheEnabled = enabled;
    if (environment_options_1.cachingDisabled !== null) {
        cacheEnabled = !environment_options_1.cachingDisabled;
    }
    if (cacheEnabled) {
        switch (environment) {
            case 'ci':
                cacheEnabled = isCI;
                break;
            case 'local':
                cacheEnabled = !isCI;
                break;
        }
    }
    const cacheBasePath = (0, path_1.resolve)(worspaceRoot, path);
    return {
        enabled: cacheEnabled,
        basePath: cacheBasePath,
        path: (0, path_1.join)(cacheBasePath, package_version_1.VERSION),
    };
}
exports.normalizeCacheOptions = normalizeCacheOptions;
