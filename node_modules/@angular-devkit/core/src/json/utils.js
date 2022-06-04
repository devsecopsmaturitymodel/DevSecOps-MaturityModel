"use strict";
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.isJsonArray = exports.isJsonObject = void 0;
function isJsonObject(value) {
    return value != null && typeof value === 'object' && !Array.isArray(value);
}
exports.isJsonObject = isJsonObject;
function isJsonArray(value) {
    return Array.isArray(value);
}
exports.isJsonArray = isJsonArray;
