"use strict";
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.NgBuildAnalyticsPlugin = exports.countOccurrences = void 0;
const core_1 = require("@angular-devkit/core");
const webpack_1 = require("webpack");
const webpackAllErrorMessageRe = /^([^(]+)\(\d+,\d\): (.*)$/gm;
const webpackTsErrorMessageRe = /^[^(]+\(\d+,\d\): error (TS\d+):/;
/**
 * Faster than using a RegExp, so we use this to count occurences in source code.
 * @param source The source to look into.
 * @param match The match string to look for.
 * @param wordBreak Whether to check for word break before and after a match was found.
 * @return The number of matches found.
 * @private
 */
function countOccurrences(source, match, wordBreak = false) {
    if (match.length == 0) {
        return source.length + 1;
    }
    let count = 0;
    // We condition here so branch prediction happens out of the loop, not in it.
    if (wordBreak) {
        const re = /\w/;
        for (let pos = source.lastIndexOf(match); pos >= 0; pos = source.lastIndexOf(match, pos)) {
            if (!(re.test(source[pos - 1] || '') || re.test(source[pos + match.length] || ''))) {
                count++; // 1 match, AH! AH! AH! 2 matches, AH! AH! AH!
            }
            pos -= match.length;
            if (pos < 0) {
                break;
            }
        }
    }
    else {
        for (let pos = source.lastIndexOf(match); pos >= 0; pos = source.lastIndexOf(match, pos)) {
            count++; // 1 match, AH! AH! AH! 2 matches, AH! AH! AH!
            pos -= match.length;
            if (pos < 0) {
                break;
            }
        }
    }
    return count;
}
exports.countOccurrences = countOccurrences;
/**
 * Holder of statistics related to the build.
 */
class AnalyticsBuildStats {
    constructor() {
        this.errors = [];
        this.numberOfNgOnInit = 0;
        this.numberOfComponents = 0;
        this.initialChunkSize = 0;
        this.totalChunkCount = 0;
        this.totalChunkSize = 0;
        this.lazyChunkCount = 0;
        this.lazyChunkSize = 0;
        this.assetCount = 0;
        this.assetSize = 0;
        this.polyfillSize = 0;
        this.cssSize = 0;
    }
}
/**
 * Analytics plugin that reports the analytics we want from the CLI.
 */
class NgBuildAnalyticsPlugin {
    constructor(_projectRoot, _analytics, _category) {
        this._projectRoot = _projectRoot;
        this._analytics = _analytics;
        this._category = _category;
        this._built = false;
        this._stats = new AnalyticsBuildStats();
    }
    _reset() {
        this._stats = new AnalyticsBuildStats();
    }
    _getMetrics(stats) {
        const startTime = +(stats.startTime || 0);
        const endTime = +(stats.endTime || 0);
        const metrics = [];
        metrics[core_1.analytics.NgCliAnalyticsMetrics.BuildTime] = endTime - startTime;
        metrics[core_1.analytics.NgCliAnalyticsMetrics.NgOnInitCount] = this._stats.numberOfNgOnInit;
        metrics[core_1.analytics.NgCliAnalyticsMetrics.NgComponentCount] = this._stats.numberOfComponents;
        metrics[core_1.analytics.NgCliAnalyticsMetrics.InitialChunkSize] = this._stats.initialChunkSize;
        metrics[core_1.analytics.NgCliAnalyticsMetrics.TotalChunkCount] = this._stats.totalChunkCount;
        metrics[core_1.analytics.NgCliAnalyticsMetrics.TotalChunkSize] = this._stats.totalChunkSize;
        metrics[core_1.analytics.NgCliAnalyticsMetrics.LazyChunkCount] = this._stats.lazyChunkCount;
        metrics[core_1.analytics.NgCliAnalyticsMetrics.LazyChunkSize] = this._stats.lazyChunkSize;
        metrics[core_1.analytics.NgCliAnalyticsMetrics.AssetCount] = this._stats.assetCount;
        metrics[core_1.analytics.NgCliAnalyticsMetrics.AssetSize] = this._stats.assetSize;
        metrics[core_1.analytics.NgCliAnalyticsMetrics.PolyfillSize] = this._stats.polyfillSize;
        metrics[core_1.analytics.NgCliAnalyticsMetrics.CssSize] = this._stats.cssSize;
        return metrics;
    }
    _getDimensions() {
        const dimensions = [];
        if (this._stats.errors.length) {
            // Adding commas before and after so the regex are easier to define filters.
            dimensions[core_1.analytics.NgCliAnalyticsDimensions.BuildErrors] = `,${this._stats.errors.join()},`;
        }
        return dimensions;
    }
    _reportBuildMetrics(stats) {
        const dimensions = this._getDimensions();
        const metrics = this._getMetrics(stats);
        this._analytics.event(this._category, 'build', { dimensions, metrics });
    }
    _reportRebuildMetrics(stats) {
        const dimensions = this._getDimensions();
        const metrics = this._getMetrics(stats);
        this._analytics.event(this._category, 'rebuild', { dimensions, metrics });
    }
    _checkTsNormalModule(module) {
        const originalSource = module.originalSource();
        if (!originalSource) {
            return;
        }
        const originalContent = originalSource.source().toString();
        // PLEASE REMEMBER:
        // We're dealing with ES5 _or_ ES2015 JavaScript at this point (we don't know for sure).
        // Just count the ngOnInit occurences. Comments/Strings/calls occurences should be sparse
        // so we just consider them within the margin of error. We do break on word break though.
        this._stats.numberOfNgOnInit += countOccurrences(originalContent, 'ngOnInit', true);
        // Count the number of `Component({` strings (case sensitive), which happens in __decorate().
        this._stats.numberOfComponents += countOccurrences(originalContent, 'Component({');
        // For Ivy we just count ɵcmp.
        this._stats.numberOfComponents += countOccurrences(originalContent, '.ɵcmp', true);
        // for ascii_only true
        this._stats.numberOfComponents += countOccurrences(originalContent, '.\u0275cmp', true);
    }
    _collectErrors(stats) {
        if (stats.hasErrors()) {
            for (const errObject of stats.compilation.errors) {
                if (errObject instanceof Error) {
                    const allErrors = errObject.message.match(webpackAllErrorMessageRe);
                    for (const err of [...(allErrors || [])].slice(1)) {
                        const message = (err.match(webpackTsErrorMessageRe) || [])[1];
                        if (message) {
                            // At this point this should be a TS1234.
                            this._stats.errors.push(message);
                        }
                    }
                }
            }
        }
    }
    _collectBundleStats(compilation) {
        var _a, _b;
        const chunkAssets = new Set();
        for (const chunk of compilation.chunks) {
            if (!chunk.rendered) {
                continue;
            }
            const firstFile = Array.from(chunk.files)[0];
            const size = (_b = (_a = compilation.getAsset(firstFile)) === null || _a === void 0 ? void 0 : _a.source.size()) !== null && _b !== void 0 ? _b : 0;
            chunkAssets.add(firstFile);
            if (chunk.canBeInitial()) {
                this._stats.initialChunkSize += size;
            }
            else {
                this._stats.lazyChunkCount++;
                this._stats.lazyChunkSize += size;
            }
            this._stats.totalChunkCount++;
            this._stats.totalChunkSize += size;
            if (firstFile.endsWith('.css')) {
                this._stats.cssSize += size;
            }
        }
        for (const asset of compilation.getAssets()) {
            // Only count non-JavaScript related files
            if (chunkAssets.has(asset.name)) {
                continue;
            }
            this._stats.assetSize += asset.source.size();
            this._stats.assetCount++;
            if (asset.name == 'polyfill') {
                this._stats.polyfillSize += asset.source.size();
            }
        }
    }
    /** **********************************************************************************************
     * The next section is all the different Webpack hooks for this plugin.
     */
    /**
     * Reports a succeed module.
     * @private
     */
    _succeedModule(module) {
        // Only report NormalModule instances.
        if (!(module instanceof webpack_1.NormalModule)) {
            return;
        }
        // Only reports modules that are part of the user's project. We also don't do node_modules.
        // There is a chance that someone name a file path `hello_node_modules` or something and we
        // will ignore that file for the purpose of gathering, but we're willing to take the risk.
        if (!module.resource ||
            !module.resource.startsWith(this._projectRoot) ||
            module.resource.indexOf('node_modules') >= 0) {
            return;
        }
        // Check that it's a source file from the project.
        if (module.resource.endsWith('.ts')) {
            this._checkTsNormalModule(module);
        }
    }
    _compilation(compiler, compilation) {
        this._reset();
        compilation.hooks.succeedModule.tap('NgBuildAnalyticsPlugin', this._succeedModule.bind(this));
    }
    _done(stats) {
        this._collectErrors(stats);
        this._collectBundleStats(stats.compilation);
        if (this._built) {
            this._reportRebuildMetrics(stats);
        }
        else {
            this._reportBuildMetrics(stats);
            this._built = true;
        }
    }
    apply(compiler) {
        compiler.hooks.compilation.tap('NgBuildAnalyticsPlugin', this._compilation.bind(this, compiler));
        compiler.hooks.done.tap('NgBuildAnalyticsPlugin', this._done.bind(this));
    }
}
exports.NgBuildAnalyticsPlugin = NgBuildAnalyticsPlugin;
