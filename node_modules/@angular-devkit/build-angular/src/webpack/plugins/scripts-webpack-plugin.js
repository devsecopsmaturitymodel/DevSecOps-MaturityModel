"use strict";
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
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
exports.ScriptsWebpackPlugin = void 0;
const loader_utils_1 = require("loader-utils");
const path = __importStar(require("path"));
const webpack_1 = require("webpack");
const Entrypoint = require('webpack/lib/Entrypoint');
function addDependencies(compilation, scripts) {
    for (const script of scripts) {
        compilation.fileDependencies.add(script);
    }
}
class ScriptsWebpackPlugin {
    constructor(options) {
        this.options = options;
    }
    async shouldSkip(compilation, scripts) {
        if (this._lastBuildTime == undefined) {
            this._lastBuildTime = Date.now();
            return false;
        }
        for (const script of scripts) {
            const scriptTime = await new Promise((resolve, reject) => {
                compilation.fileSystemInfo.getFileTimestamp(script, (error, entry) => {
                    if (error) {
                        reject(error);
                        return;
                    }
                    resolve(entry && typeof entry !== 'string' ? entry.safeTime : undefined);
                });
            });
            if (!scriptTime || scriptTime > this._lastBuildTime) {
                this._lastBuildTime = Date.now();
                return false;
            }
        }
        return true;
    }
    _insertOutput(compilation, { filename, source }, cached = false) {
        const chunk = new webpack_1.Chunk(this.options.name);
        chunk.rendered = !cached;
        chunk.id = this.options.name;
        chunk.ids = [chunk.id];
        chunk.files.add(filename);
        const entrypoint = new Entrypoint(this.options.name);
        entrypoint.pushChunk(chunk);
        chunk.addGroup(entrypoint);
        compilation.entrypoints.set(this.options.name, entrypoint);
        compilation.chunks.add(chunk);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        compilation.assets[filename] = source;
        compilation.hooks.chunkAsset.call(chunk, filename);
    }
    apply(compiler) {
        if (!this.options.scripts || this.options.scripts.length === 0) {
            return;
        }
        const scripts = this.options.scripts
            .filter((script) => !!script)
            .map((script) => path.resolve(this.options.basePath || '', script));
        compiler.hooks.thisCompilation.tap('scripts-webpack-plugin', (compilation) => {
            compilation.hooks.additionalAssets.tapPromise('scripts-webpack-plugin', async () => {
                if (await this.shouldSkip(compilation, scripts)) {
                    if (this._cachedOutput) {
                        this._insertOutput(compilation, this._cachedOutput, true);
                    }
                    addDependencies(compilation, scripts);
                    return;
                }
                const sourceGetters = scripts.map((fullPath) => {
                    return new Promise((resolve, reject) => {
                        compilation.inputFileSystem.readFile(fullPath, (err, data) => {
                            var _a;
                            if (err) {
                                reject(err);
                                return;
                            }
                            const content = (_a = data === null || data === void 0 ? void 0 : data.toString()) !== null && _a !== void 0 ? _a : '';
                            let source;
                            if (this.options.sourceMap) {
                                // TODO: Look for source map file (for '.min' scripts, etc.)
                                let adjustedPath = fullPath;
                                if (this.options.basePath) {
                                    adjustedPath = path.relative(this.options.basePath, fullPath);
                                }
                                source = new webpack_1.sources.OriginalSource(content, adjustedPath);
                            }
                            else {
                                source = new webpack_1.sources.RawSource(content);
                            }
                            resolve(source);
                        });
                    });
                });
                const sources = await Promise.all(sourceGetters);
                const concatSource = new webpack_1.sources.ConcatSource();
                sources.forEach((source) => {
                    concatSource.add(source);
                    concatSource.add('\n;');
                });
                const combinedSource = new webpack_1.sources.CachedSource(concatSource);
                const filename = (0, loader_utils_1.interpolateName)({ resourcePath: 'scripts.js' }, this.options.filename, {
                    content: combinedSource.source(),
                });
                const output = { filename, source: combinedSource };
                this._insertOutput(compilation, output);
                this._cachedOutput = output;
                addDependencies(compilation, scripts);
            });
        });
    }
}
exports.ScriptsWebpackPlugin = ScriptsWebpackPlugin;
