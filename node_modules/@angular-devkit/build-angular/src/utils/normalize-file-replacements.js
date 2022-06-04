"use strict";
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.normalizeFileReplacements = exports.MissingFileReplacementException = void 0;
const core_1 = require("@angular-devkit/core");
const fs_1 = require("fs");
class MissingFileReplacementException extends core_1.BaseException {
    constructor(path) {
        super(`The ${path} path in file replacements does not exist.`);
    }
}
exports.MissingFileReplacementException = MissingFileReplacementException;
function normalizeFileReplacements(fileReplacements, root) {
    if (fileReplacements.length === 0) {
        return [];
    }
    const normalizedReplacement = fileReplacements.map((replacement) => normalizeFileReplacement(replacement, root));
    for (const { replace, with: replacementWith } of normalizedReplacement) {
        if (!(0, fs_1.existsSync)((0, core_1.getSystemPath)(replacementWith))) {
            throw new MissingFileReplacementException((0, core_1.getSystemPath)(replacementWith));
        }
        if (!(0, fs_1.existsSync)((0, core_1.getSystemPath)(replace))) {
            throw new MissingFileReplacementException((0, core_1.getSystemPath)(replace));
        }
    }
    return normalizedReplacement;
}
exports.normalizeFileReplacements = normalizeFileReplacements;
function normalizeFileReplacement(fileReplacement, root) {
    let replacePath;
    let withPath;
    if (fileReplacement.src && fileReplacement.replaceWith) {
        replacePath = (0, core_1.normalize)(fileReplacement.src);
        withPath = (0, core_1.normalize)(fileReplacement.replaceWith);
    }
    else if (fileReplacement.replace && fileReplacement.with) {
        replacePath = (0, core_1.normalize)(fileReplacement.replace);
        withPath = (0, core_1.normalize)(fileReplacement.with);
    }
    else {
        throw new Error(`Invalid file replacement: ${JSON.stringify(fileReplacement)}`);
    }
    // TODO: For 7.x should this only happen if not absolute?
    if (root) {
        replacePath = (0, core_1.join)(root, replacePath);
    }
    if (root) {
        withPath = (0, core_1.join)(root, withPath);
    }
    return { replace: replacePath, with: withPath };
}
