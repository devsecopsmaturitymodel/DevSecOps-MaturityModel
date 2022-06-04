"use strict";
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.normalizeBrowserSchema = void 0;
const core_1 = require("@angular-devkit/core");
const normalize_asset_patterns_1 = require("./normalize-asset-patterns");
const normalize_cache_1 = require("./normalize-cache");
const normalize_file_replacements_1 = require("./normalize-file-replacements");
const normalize_optimization_1 = require("./normalize-optimization");
const normalize_source_maps_1 = require("./normalize-source-maps");
const supported_browsers_1 = require("./supported-browsers");
function normalizeBrowserSchema(root, projectRoot, sourceRoot, options, metadata) {
    const normalizedSourceMapOptions = (0, normalize_source_maps_1.normalizeSourceMaps)(options.sourceMap || false);
    return {
        ...options,
        cache: (0, normalize_cache_1.normalizeCacheOptions)(metadata, (0, core_1.getSystemPath)(root)),
        assets: (0, normalize_asset_patterns_1.normalizeAssetPatterns)(options.assets || [], root, projectRoot, sourceRoot),
        fileReplacements: (0, normalize_file_replacements_1.normalizeFileReplacements)(options.fileReplacements || [], root),
        optimization: (0, normalize_optimization_1.normalizeOptimization)(options.optimization),
        sourceMap: normalizedSourceMapOptions,
        preserveSymlinks: options.preserveSymlinks === undefined
            ? process.execArgv.includes('--preserve-symlinks')
            : options.preserveSymlinks,
        statsJson: options.statsJson || false,
        budgets: options.budgets || [],
        scripts: options.scripts || [],
        styles: options.styles || [],
        stylePreprocessorOptions: {
            includePaths: (options.stylePreprocessorOptions && options.stylePreprocessorOptions.includePaths) || [],
        },
        // Using just `--poll` will result in a value of 0 which is very likely not the intention
        // A value of 0 is falsy and will disable polling rather then enable
        // 500 ms is a sensible default in this case
        poll: options.poll === 0 ? 500 : options.poll,
        supportedBrowsers: (0, supported_browsers_1.getSupportedBrowsers)((0, core_1.getSystemPath)(projectRoot)),
    };
}
exports.normalizeBrowserSchema = normalizeBrowserSchema;
