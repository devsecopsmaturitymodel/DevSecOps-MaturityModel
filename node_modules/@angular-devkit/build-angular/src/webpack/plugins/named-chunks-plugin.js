"use strict";
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.NamedChunksPlugin = void 0;
const webpack_1 = require("webpack");
// `ImportDependency` is not part of Webpack's depenencies typings.
const ImportDependency = require('webpack/lib/dependencies/ImportDependency');
const PLUGIN_NAME = 'named-chunks-plugin';
/**
 * Webpack will not populate the chunk `name` property unless `webpackChunkName` magic comment is used.
 * This however will also effect the filename which is not desired when using `deterministic` chunkIds.
 * This plugin will populate the chunk `name` which is mainly used so that users can set bundle budgets on lazy chunks.
 */
class NamedChunksPlugin {
    apply(compiler) {
        compiler.hooks.compilation.tap(PLUGIN_NAME, (compilation) => {
            compilation.hooks.chunkAsset.tap(PLUGIN_NAME, (chunk) => {
                if (chunk.name) {
                    return;
                }
                if ([...chunk.files.values()].every((f) => f.endsWith('.css'))) {
                    // If all chunk files are CSS files skip.
                    // This happens when using `import('./styles.css')` in a lazy loaded module.
                    return undefined;
                }
                const name = this.generateName(chunk);
                if (name) {
                    chunk.name = name;
                }
            });
        });
    }
    generateName(chunk) {
        for (const group of chunk.groupsIterable) {
            const [block] = group.getBlocks();
            if (!(block instanceof webpack_1.AsyncDependenciesBlock)) {
                continue;
            }
            if (block.groupOptions.name) {
                // Ignore groups which have been named already.
                return undefined;
            }
            for (const dependency of block.dependencies) {
                if (dependency instanceof ImportDependency) {
                    return webpack_1.Template.toPath(dependency.request);
                }
            }
        }
        return undefined;
    }
}
exports.NamedChunksPlugin = NamedChunksPlugin;
