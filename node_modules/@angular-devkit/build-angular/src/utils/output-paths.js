"use strict";
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.ensureOutputPaths = void 0;
const fs_1 = require("fs");
const path_1 = require("path");
function ensureOutputPaths(baseOutputPath, i18n) {
    const outputPaths = i18n.shouldInline
        ? [...i18n.inlineLocales].map((l) => [
            l,
            i18n.flatOutput ? baseOutputPath : (0, path_1.join)(baseOutputPath, l),
        ])
        : [['', baseOutputPath]];
    for (const [, outputPath] of outputPaths) {
        if (!(0, fs_1.existsSync)(outputPath)) {
            (0, fs_1.mkdirSync)(outputPath, { recursive: true });
        }
    }
    return new Map(outputPaths);
}
exports.ensureOutputPaths = ensureOutputPaths;
