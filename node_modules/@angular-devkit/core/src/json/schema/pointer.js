"use strict";
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseJsonPointer = exports.joinJsonPointer = exports.buildJsonPointer = void 0;
function buildJsonPointer(fragments) {
    return ('/' +
        fragments
            .map((f) => {
            return f.replace(/~/g, '~0').replace(/\//g, '~1');
        })
            .join('/'));
}
exports.buildJsonPointer = buildJsonPointer;
function joinJsonPointer(root, ...others) {
    if (root == '/') {
        return buildJsonPointer(others);
    }
    return (root + buildJsonPointer(others));
}
exports.joinJsonPointer = joinJsonPointer;
function parseJsonPointer(pointer) {
    if (pointer === '') {
        return [];
    }
    if (pointer.charAt(0) !== '/') {
        throw new Error('Relative pointer: ' + pointer);
    }
    return pointer
        .substring(1)
        .split(/\//)
        .map((str) => str.replace(/~1/g, '/').replace(/~0/g, '~'));
}
exports.parseJsonPointer = parseJsonPointer;
