"use strict";
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JavaScriptOptimizerPlugin = void 0;
const piscina_1 = __importDefault(require("piscina"));
const typescript_1 = require("typescript");
const environment_options_1 = require("../../utils/environment-options");
const esbuild_executor_1 = require("./esbuild-executor");
/**
 * The maximum number of Workers that will be created to execute optimize tasks.
 */
const MAX_OPTIMIZE_WORKERS = environment_options_1.maxWorkers;
/**
 * The name of the plugin provided to Webpack when tapping Webpack compiler hooks.
 */
const PLUGIN_NAME = 'angular-javascript-optimizer';
/**
 * A Webpack plugin that provides JavaScript optimization capabilities.
 *
 * The plugin uses both `esbuild` and `terser` to provide both fast and highly-optimized
 * code output. `esbuild` is used as an initial pass to remove the majority of unused code
 * as well as shorten identifiers. `terser` is then used as a secondary pass to apply
 * optimizations not yet implemented by `esbuild`.
 */
class JavaScriptOptimizerPlugin {
    constructor(options) {
        this.options = options;
    }
    apply(compiler) {
        const { OriginalSource, SourceMapSource } = compiler.webpack.sources;
        compiler.hooks.compilation.tap(PLUGIN_NAME, (compilation) => {
            const logger = compilation.getLogger('build-angular.JavaScriptOptimizerPlugin');
            compilation.hooks.processAssets.tapPromise({
                name: PLUGIN_NAME,
                stage: compiler.webpack.Compilation.PROCESS_ASSETS_STAGE_OPTIMIZE_SIZE,
            }, async (compilationAssets) => {
                logger.time('optimize js assets');
                const scriptsToOptimize = [];
                const cache = compilation.options.cache && compilation.getCache('JavaScriptOptimizerPlugin');
                // Analyze the compilation assets for scripts that require optimization
                for (const assetName of Object.keys(compilationAssets)) {
                    if (!assetName.endsWith('.js')) {
                        continue;
                    }
                    const scriptAsset = compilation.getAsset(assetName);
                    // Skip assets that have already been optimized or are verbatim copies (project assets)
                    if (!scriptAsset || scriptAsset.info.minimized || scriptAsset.info.copied) {
                        continue;
                    }
                    const { source: scriptAssetSource, name } = scriptAsset;
                    let cacheItem;
                    if (cache) {
                        const eTag = cache.getLazyHashedEtag(scriptAssetSource);
                        cacheItem = cache.getItemCache(name, eTag);
                        const cachedOutput = await cacheItem.getPromise();
                        if (cachedOutput) {
                            logger.debug(`${name} restored from cache`);
                            compilation.updateAsset(name, cachedOutput.source, (assetInfo) => ({
                                ...assetInfo,
                                minimized: true,
                            }));
                            continue;
                        }
                    }
                    const { source, map } = scriptAssetSource.sourceAndMap();
                    scriptsToOptimize.push({
                        name: scriptAsset.name,
                        code: typeof source === 'string' ? source : source.toString(),
                        map,
                        cacheItem,
                    });
                }
                if (scriptsToOptimize.length === 0) {
                    return;
                }
                // Ensure all replacement values are strings which is the expected type for esbuild
                let define;
                if (this.options.define) {
                    define = {};
                    for (const [key, value] of Object.entries(this.options.define)) {
                        define[key] = String(value);
                    }
                }
                let target = 2017;
                if (this.options.target) {
                    if (this.options.target <= typescript_1.ScriptTarget.ES5) {
                        target = 5;
                    }
                    else if (this.options.target === typescript_1.ScriptTarget.ESNext) {
                        target = 'next';
                    }
                    else {
                        target = Number(typescript_1.ScriptTarget[this.options.target].slice(2));
                    }
                }
                // Setup the options used by all worker tasks
                const optimizeOptions = {
                    sourcemap: this.options.sourcemap,
                    define,
                    keepNames: this.options.keepNames,
                    keepIdentifierNames: this.options.keepIdentifierNames,
                    target,
                    removeLicenses: this.options.removeLicenses,
                    advanced: this.options.advanced,
                    // Perform a single native esbuild support check.
                    // This removes the need for each worker to perform the check which would
                    // otherwise require spawning a separate process per worker.
                    alwaysUseWasm: !esbuild_executor_1.EsbuildExecutor.hasNativeSupport(),
                };
                // Sort scripts so larger scripts start first - worker pool uses a FIFO queue
                scriptsToOptimize.sort((a, b) => a.code.length - b.code.length);
                // Initialize the task worker pool
                const workerPath = require.resolve('./javascript-optimizer-worker');
                const workerPool = new piscina_1.default({
                    filename: workerPath,
                    maxThreads: MAX_OPTIMIZE_WORKERS,
                });
                // Enqueue script optimization tasks and update compilation assets as the tasks complete
                try {
                    const tasks = [];
                    for (const { name, code, map, cacheItem } of scriptsToOptimize) {
                        logger.time(`optimize asset: ${name}`);
                        tasks.push(workerPool
                            .run({
                            asset: {
                                name,
                                code,
                                map,
                            },
                            options: optimizeOptions,
                        })
                            .then(({ code, name, map }) => {
                            const optimizedAsset = map
                                ? new SourceMapSource(code, name, map)
                                : new OriginalSource(code, name);
                            compilation.updateAsset(name, optimizedAsset, (assetInfo) => ({
                                ...assetInfo,
                                minimized: true,
                            }));
                            logger.timeEnd(`optimize asset: ${name}`);
                            return cacheItem === null || cacheItem === void 0 ? void 0 : cacheItem.storePromise({
                                source: optimizedAsset,
                            });
                        }, (error) => {
                            const optimizationError = new compiler.webpack.WebpackError(`Optimization error [${name}]: ${error.stack || error.message}`);
                            compilation.errors.push(optimizationError);
                        }));
                    }
                    await Promise.all(tasks);
                }
                finally {
                    void workerPool.destroy();
                }
                logger.timeEnd('optimize js assets');
            });
        });
    }
}
exports.JavaScriptOptimizerPlugin = JavaScriptOptimizerPlugin;
