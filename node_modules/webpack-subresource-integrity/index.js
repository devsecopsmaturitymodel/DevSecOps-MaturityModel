"use strict";
/**
 * Copyright (c) 2015-present, Waysact Pty Ltd
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubresourceIntegrityPlugin = void 0;
const crypto_1 = require("crypto");
const webpack_1 = require("webpack");
const plugin_1 = require("./plugin");
const reporter_1 = require("./reporter");
const util_1 = require("./util");
const thisPluginName = "webpack-subresource-integrity";
// https://www.w3.org/TR/2016/REC-SRI-20160623/#cryptographic-hash-functions
const standardHashFuncNames = ["sha256", "sha384", "sha512"];
let getHtmlWebpackPluginHooks = null;
class AddLazySriRuntimeModule extends webpack_1.RuntimeModule {
    constructor(sriHashes, chunkName) {
        super(`webpack-subresource-integrity lazy hashes for direct children of chunk ${chunkName}`);
        this.sriHashes = sriHashes;
    }
    generate() {
        return webpack_1.Template.asString([
            `Object.assign(${util_1.sriHashVariableReference}, ${JSON.stringify(this.sriHashes)});`,
        ]);
    }
}
/**
 * The webpack-subresource-integrity plugin.
 *
 * @public
 */
class SubresourceIntegrityPlugin {
    /**
     * Create a new instance.
     *
     * @public
     */
    constructor(options = {}) {
        /**
         * @internal
         */
        this.setup = (compilation) => {
            const reporter = new reporter_1.Reporter(compilation, thisPluginName);
            if (!this.validateOptions(compilation, reporter) ||
                !this.isEnabled(compilation)) {
                return;
            }
            const plugin = new plugin_1.Plugin(compilation, this.options, reporter);
            if (typeof compilation.outputOptions.chunkLoading === "string" &&
                ["require", "async-node"].includes(compilation.outputOptions.chunkLoading)) {
                reporter.warnOnce("This plugin is not useful for non-web targets.");
                return;
            }
            compilation.hooks.beforeRuntimeRequirements.tap(thisPluginName, () => {
                plugin.beforeRuntimeRequirements();
            });
            compilation.hooks.processAssets.tap({
                name: thisPluginName,
                stage: compilation.compiler.webpack.Compilation
                    .PROCESS_ASSETS_STAGE_OPTIMIZE_INLINE,
            }, (records) => {
                return plugin.processAssets(records);
            });
            compilation.hooks.afterProcessAssets.tap(thisPluginName, (records) => {
                for (const chunk of compilation.chunks.values()) {
                    for (const chunkFile of chunk.files) {
                        if (chunkFile in records &&
                            records[chunkFile].source().includes(util_1.placeholderPrefix)) {
                            reporter.errorOnce(`Asset ${chunkFile} contains unresolved integrity placeholders`);
                        }
                    }
                }
            });
            compilation.compiler.webpack.optimize.RealContentHashPlugin.getCompilationHooks(compilation).updateHash.tap(thisPluginName, (input, oldHash) => {
                // FIXME: remove type hack pending https://github.com/webpack/webpack/pull/12642#issuecomment-784744910
                return plugin.updateHash(input, oldHash);
            });
            if (getHtmlWebpackPluginHooks) {
                getHtmlWebpackPluginHooks(compilation).beforeAssetTagGeneration.tapPromise(thisPluginName, async (pluginArgs) => {
                    plugin.handleHwpPluginArgs(pluginArgs);
                    return pluginArgs;
                });
                getHtmlWebpackPluginHooks(compilation).alterAssetTagGroups.tapPromise({
                    name: thisPluginName,
                    stage: 10000,
                }, async (data) => {
                    plugin.handleHwpBodyTags(data);
                    return data;
                });
            }
            const { mainTemplate } = compilation;
            mainTemplate.hooks.jsonpScript.tap(thisPluginName, (source) => plugin.addAttribute("script", source));
            mainTemplate.hooks.linkPreload.tap(thisPluginName, (source) => plugin.addAttribute("link", source));
            mainTemplate.hooks.localVars.tap(thisPluginName, (source, chunk) => {
                const allChunks = this.options.hashLoading === "lazy"
                    ? plugin.getChildChunksToAddToChunkManifest(chunk)
                    : util_1.findChunks(chunk);
                const includedChunks = chunk.getChunkMaps(false).hash;
                if (Object.keys(includedChunks).length > 0) {
                    return compilation.compiler.webpack.Template.asString([
                        source,
                        `${util_1.sriHashVariableReference} = ` +
                            JSON.stringify(util_1.generateSriHashPlaceholders(Array.from(allChunks).filter((depChunk) => depChunk.id !== null &&
                                includedChunks[depChunk.id.toString()]), this.options.hashFuncNames)) +
                            ";",
                    ]);
                }
                return source;
            });
            if (this.options.hashLoading === "lazy") {
                compilation.hooks.additionalChunkRuntimeRequirements.tap(thisPluginName, (chunk) => {
                    var _a;
                    const childChunks = plugin.getChildChunksToAddToChunkManifest(chunk);
                    if (childChunks.size > 0 && !chunk.hasRuntime()) {
                        compilation.addRuntimeModule(chunk, new AddLazySriRuntimeModule(util_1.generateSriHashPlaceholders(childChunks, this.options.hashFuncNames), (_a = chunk.name) !== null && _a !== void 0 ? _a : chunk.id));
                    }
                });
            }
        };
        /**
         * @internal
         */
        this.validateOptions = (compilation, reporter) => {
            if (this.isEnabled(compilation) &&
                !compilation.compiler.options.output.crossOriginLoading) {
                reporter.warnOnce('SRI requires a cross-origin policy, defaulting to "anonymous". ' +
                    "Set webpack option output.crossOriginLoading to a value other than false " +
                    "to make this warning go away. " +
                    "See https://w3c.github.io/webappsec-subresource-integrity/#cross-origin-data-leakage");
            }
            return (this.validateHashFuncNames(reporter) && this.validateHashLoading(reporter));
        };
        /**
         * @internal
         */
        this.validateHashFuncNames = (reporter) => {
            if (!Array.isArray(this.options.hashFuncNames)) {
                reporter.error("options.hashFuncNames must be an array of hash function names, " +
                    "instead got '" +
                    this.options.hashFuncNames +
                    "'.");
                return false;
            }
            else if (this.options.hashFuncNames.length === 0) {
                reporter.error("Must specify at least one hash function name.");
                return false;
            }
            else if (!this.options.hashFuncNames.every(this.validateHashFuncName.bind(this, reporter))) {
                return false;
            }
            else {
                this.warnStandardHashFunc(reporter);
                return true;
            }
        };
        /**
         * @internal
         */
        this.validateHashLoading = (reporter) => {
            const supportedHashLoadingOptions = Object.freeze(["eager", "lazy"]);
            if (supportedHashLoadingOptions.includes(this.options.hashLoading)) {
                return true;
            }
            const optionsStr = supportedHashLoadingOptions
                .map((opt) => `'${opt}'`)
                .join(", ");
            reporter.error(`options.hashLoading must be one of ${optionsStr}, instead got '${this.options.hashLoading}'`);
            return false;
        };
        /**
         * @internal
         */
        this.warnStandardHashFunc = (reporter) => {
            let foundStandardHashFunc = false;
            for (let i = 0; i < this.options.hashFuncNames.length; i += 1) {
                if (standardHashFuncNames.indexOf(this.options.hashFuncNames[i]) >= 0) {
                    foundStandardHashFunc = true;
                }
            }
            if (!foundStandardHashFunc) {
                reporter.warnOnce("It is recommended that at least one hash function is part of the set " +
                    "for which support is mandated by the specification. " +
                    "These are: " +
                    standardHashFuncNames.join(", ") +
                    ". " +
                    "See http://www.w3.org/TR/SRI/#cryptographic-hash-functions for more information.");
            }
        };
        /**
         * @internal
         */
        this.validateHashFuncName = (reporter, hashFuncName) => {
            if (typeof hashFuncName !== "string" &&
                !(hashFuncName instanceof String)) {
                reporter.error("options.hashFuncNames must be an array of hash function names, " +
                    "but contained " +
                    hashFuncName +
                    ".");
                return false;
            }
            try {
                crypto_1.createHash(hashFuncName);
            }
            catch (error) {
                reporter.error("Cannot use hash function '" + hashFuncName + "': " + error.message);
                return false;
            }
            return true;
        };
        if (typeof options !== "object") {
            throw new Error("webpack-subresource-integrity: argument must be an object");
        }
        this.options = {
            hashFuncNames: ["sha384"],
            enabled: "auto",
            hashLoading: "eager",
            ...options,
        };
    }
    /**
     * @internal
     */
    isEnabled(compilation) {
        if (this.options.enabled === "auto") {
            return compilation.options.mode !== "development";
        }
        return this.options.enabled;
    }
    apply(compiler) {
        compiler.hooks.beforeCompile.tapPromise(thisPluginName, async () => {
            try {
                getHtmlWebpackPluginHooks = (await Promise.resolve().then(() => __importStar(require("html-webpack-plugin"))))
                    .default.getHooks;
            }
            catch (e) {
                if (e.code !== "MODULE_NOT_FOUND") {
                    throw e;
                }
            }
        });
        compiler.hooks.afterPlugins.tap(thisPluginName, (compiler) => {
            compiler.hooks.thisCompilation.tap({
                name: thisPluginName,
                stage: -10000,
            }, (compilation) => {
                this.setup(compilation);
            });
            compiler.hooks.compilation.tap(thisPluginName, (compilation) => {
                compilation.hooks.statsFactory.tap(thisPluginName, (statsFactory) => {
                    statsFactory.hooks.extract
                        .for("asset")
                        .tap(thisPluginName, (object, asset) => {
                        var _a;
                        const contenthash = (_a = asset.info) === null || _a === void 0 ? void 0 : _a.contenthash;
                        if (contenthash) {
                            const shaHashes = (Array.isArray(contenthash) ? contenthash : [contenthash]).filter((hash) => String(hash).match(/^sha[0-9]+-/));
                            if (shaHashes.length > 0) {
                                object.integrity =
                                    shaHashes.join(" ");
                            }
                        }
                    });
                });
            });
        });
    }
}
exports.SubresourceIntegrityPlugin = SubresourceIntegrityPlugin;
//# sourceMappingURL=index.js.map