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
exports.Plugin = void 0;
const path_1 = require("path");
const fs_1 = require("fs");
const assert = __importStar(require("typed-assert"));
const util_1 = require("./util");
const assetTypeIntegrityKeys = [
    ["js", "jsIntegrity"],
    ["css", "cssIntegrity"],
];
class Plugin {
    constructor(compilation, options, reporter) {
        /**
         * @internal
         */
        this.assetIntegrity = new Map();
        /**
         * @internal
         */
        this.inverseAssetIntegrity = new Map();
        /**
         * @internal
         */
        this.hwpPublicPath = null;
        /**
         * @internal
         */
        this.sortedSccChunks = [];
        /**
         * @internal
         */
        this.chunkManifest = new Map();
        /**
         * @internal
         */
        this.hashByChunkId = new Map();
        /**
         * @internal
         */
        this.addMissingIntegrityHashes = (assets) => {
            Object.keys(assets).forEach((assetKey) => {
                const asset = assets[assetKey];
                let source;
                try {
                    source = asset.source();
                }
                catch (_) {
                    return;
                }
                this.updateAssetIntegrity(assetKey, util_1.computeIntegrity(this.options.hashFuncNames, source));
            });
        };
        /**
         * @internal
         */
        this.replaceAsset = (compiler, assets, hashByChunkId, chunkFile) => {
            const oldSource = assets[chunkFile].source();
            const hashFuncNames = this.options.hashFuncNames;
            const newAsset = new compiler.webpack.sources.ReplaceSource(assets[chunkFile], chunkFile);
            Array.from(hashByChunkId.entries()).forEach((idAndHash) => {
                const magicMarker = util_1.makePlaceholder(hashFuncNames, idAndHash[0]);
                const magicMarkerPos = oldSource.indexOf(magicMarker);
                if (magicMarkerPos >= 0) {
                    newAsset.replace(magicMarkerPos, magicMarkerPos + magicMarker.length - 1, idAndHash[1], chunkFile);
                }
            });
            assets[chunkFile] = newAsset;
            return newAsset;
        };
        this.warnAboutLongTermCaching = (assetInfo) => {
            if ((assetInfo.fullhash ||
                assetInfo.chunkhash ||
                assetInfo.modulehash ||
                assetInfo.contenthash) &&
                !(assetInfo.contenthash &&
                    this.compilation.compiler.options.optimization.realContentHash)) {
                this.reporter.warnOnce("Using [hash], [fullhash], [modulehash], or [chunkhash] is dangerous \
with SRI. The same is true for [contenthash] when realContentHash is disabled. \
Use [contenthash] and ensure realContentHash is enabled. See the README for \
more information.");
            }
        };
        /**
         * @internal
         */
        this.processChunk = (chunk, assets) => {
            Array.from(util_1.findChunks(chunk))
                .reverse()
                .forEach((chunk) => this.processChunkAssets(chunk, assets));
        };
        this.processChunkAssets = (childChunk, assets) => {
            const files = Array.from(childChunk.files);
            files.forEach((sourcePath) => {
                if (assets[sourcePath]) {
                    this.warnIfHotUpdate(assets[sourcePath].source());
                    const newAsset = this.replaceAsset(this.compilation.compiler, assets, this.hashByChunkId, sourcePath);
                    const integrity = util_1.computeIntegrity(this.options.hashFuncNames, newAsset.source());
                    if (childChunk.id !== null) {
                        this.hashByChunkId.set(childChunk.id, integrity);
                    }
                    this.updateAssetIntegrity(sourcePath, integrity);
                    this.compilation.updateAsset(sourcePath, (x) => x, (assetInfo) => {
                        if (!assetInfo) {
                            return undefined;
                        }
                        this.warnAboutLongTermCaching(assetInfo);
                        return {
                            ...assetInfo,
                            contenthash: Array.isArray(assetInfo.contenthash)
                                ? [...new Set([...assetInfo.contenthash, integrity])]
                                : assetInfo.contenthash
                                    ? [assetInfo.contenthash, integrity]
                                    : integrity,
                        };
                    });
                }
                else {
                    this.reporter.warnOnce(`No asset found for source path '${sourcePath}', options are ${Object.keys(assets).join(", ")}`);
                }
            });
        };
        /**
         * @internal
         */
        this.addAttribute = (elName, source) => {
            if (!this.compilation.outputOptions.crossOriginLoading) {
                this.reporter.errorOnce("webpack option output.crossOriginLoading not set, code splitting will not work!");
            }
            return this.compilation.compiler.webpack.Template.asString([
                source,
                elName + `.integrity = ${util_1.sriHashVariableReference}[chunkId];`,
                elName +
                    ".crossOrigin = " +
                    JSON.stringify(this.compilation.outputOptions.crossOriginLoading) +
                    ";",
            ]);
        };
        /**
         * @internal
         */
        this.processAssets = (assets) => {
            if (this.options.hashLoading === "lazy") {
                for (const scc of this.sortedSccChunks) {
                    for (const chunk of scc.nodes) {
                        this.processChunkAssets(chunk, assets);
                    }
                }
            }
            else {
                Array.from(this.compilation.chunks)
                    .filter((chunk) => chunk.hasRuntime())
                    .forEach((chunk) => {
                    this.processChunk(chunk, assets);
                });
            }
            this.addMissingIntegrityHashes(assets);
        };
        /**
         * @internal
         */
        this.hwpAssetPath = (src) => {
            assert.isNotNull(this.hwpPublicPath);
            return path_1.relative(this.hwpPublicPath, src);
        };
        /**
         * @internal
         */
        this.getIntegrityChecksumForAsset = (assets, src) => {
            if (this.assetIntegrity.has(src)) {
                return this.assetIntegrity.get(src);
            }
            const normalizedSrc = util_1.normalizePath(src);
            const normalizedKey = Object.keys(assets).find((assetKey) => util_1.normalizePath(assetKey) === normalizedSrc);
            if (normalizedKey) {
                return this.assetIntegrity.get(normalizedKey);
            }
            return undefined;
        };
        /**
         * @internal
         */
        this.processTag = (tag) => {
            if (tag.attributes &&
                Object.prototype.hasOwnProperty.call(tag.attributes, "integrity")) {
                return;
            }
            const tagSrc = util_1.getTagSrc(tag);
            if (!tagSrc) {
                return;
            }
            const src = this.hwpAssetPath(tagSrc);
            tag.attributes.integrity =
                this.getIntegrityChecksumForAsset(this.compilation.assets, src) ||
                    util_1.computeIntegrity(this.options.hashFuncNames, fs_1.readFileSync(path_1.join(this.compilation.compiler.outputPath, src)));
            tag.attributes.crossorigin =
                this.compilation.compiler.options.output.crossOriginLoading ||
                    "anonymous";
        };
        /**
         * @internal
         */
        this.beforeRuntimeRequirements = () => {
            if (this.options.hashLoading === "lazy") {
                const [sortedSccChunks, chunkManifest] = util_1.getChunkToManifestMap(this.compilation.chunks);
                this.sortedSccChunks = sortedSccChunks;
                this.chunkManifest = chunkManifest;
            }
            this.hashByChunkId.clear();
        };
        this.handleHwpPluginArgs = ({ assets }) => {
            this.hwpPublicPath = assets.publicPath;
            assetTypeIntegrityKeys.forEach(([a, b]) => {
                if (b) {
                    assets[b] = assets[a]
                        .map((filePath) => this.getIntegrityChecksumForAsset(this.compilation.assets, this.hwpAssetPath(filePath)))
                        .filter(util_1.notNil);
                }
            });
        };
        this.updateHash = (input, oldHash) => {
            const assetKey = this.inverseAssetIntegrity.get(oldHash);
            if (assetKey && input.length === 1) {
                const newIntegrity = util_1.computeIntegrity(this.options.hashFuncNames, input[0]);
                this.inverseAssetIntegrity.delete(oldHash);
                this.assetIntegrity.delete(assetKey);
                this.updateAssetIntegrity(assetKey, newIntegrity);
                return newIntegrity;
            }
            return undefined;
        };
        this.handleHwpBodyTags = ({ headTags, bodyTags, }) => {
            this.addMissingIntegrityHashes(this.compilation.assets);
            headTags
                .concat(bodyTags)
                .forEach((tag) => this.processTag(tag));
        };
        this.compilation = compilation;
        this.options = options;
        this.reporter = reporter;
    }
    /**
     * @internal
     */
    warnIfHotUpdate(source) {
        if (source.indexOf("webpackHotUpdate") >= 0) {
            this.reporter.warnOnce("webpack-subresource-integrity may interfere with hot reloading. " +
                "Consider disabling this plugin in development mode.");
        }
    }
    /**
     * @internal
     */
    updateAssetIntegrity(assetKey, integrity) {
        if (!this.assetIntegrity.has(assetKey)) {
            this.assetIntegrity.set(assetKey, integrity);
            this.inverseAssetIntegrity.set(integrity, assetKey);
        }
    }
    getChildChunksToAddToChunkManifest(chunk) {
        var _a;
        return (_a = this.chunkManifest.get(chunk)) !== null && _a !== void 0 ? _a : new Set();
    }
}
exports.Plugin = Plugin;
//# sourceMappingURL=plugin.js.map