"use strict";
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.RemoveHashPlugin = void 0;
class RemoveHashPlugin {
    constructor(options) {
        this.options = options;
    }
    apply(compiler) {
        compiler.hooks.compilation.tap('remove-hash-plugin', (compilation) => {
            const assetPath = (path, data) => {
                var _a;
                const chunkName = (_a = data.chunk) === null || _a === void 0 ? void 0 : _a.name;
                const { chunkNames, hashFormat } = this.options;
                if (chunkName && (chunkNames === null || chunkNames === void 0 ? void 0 : chunkNames.includes(chunkName))) {
                    // Replace hash formats with empty strings.
                    return path.replace(hashFormat.chunk, '').replace(hashFormat.extract, '');
                }
                return path;
            };
            compilation.hooks.assetPath.tap('remove-hash-plugin', assetPath);
        });
    }
}
exports.RemoveHashPlugin = RemoveHashPlugin;
