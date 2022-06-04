"use strict";
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.isDirectory = exports.isFile = void 0;
const fs_1 = require("fs");
/** @deprecated Since v11.0, unused by the Angular tooling */
function isFile(filePath) {
    let stat;
    try {
        stat = (0, fs_1.statSync)(filePath);
    }
    catch (e) {
        if (e && (e.code === 'ENOENT' || e.code === 'ENOTDIR')) {
            return false;
        }
        throw e;
    }
    return stat.isFile() || stat.isFIFO();
}
exports.isFile = isFile;
/** @deprecated Since v11.0, unused by the Angular tooling */
function isDirectory(filePath) {
    let stat;
    try {
        stat = (0, fs_1.statSync)(filePath);
    }
    catch (e) {
        if (e && (e.code === 'ENOENT' || e.code === 'ENOTDIR')) {
            return false;
        }
        throw e;
    }
    return stat.isDirectory();
}
exports.isDirectory = isDirectory;
