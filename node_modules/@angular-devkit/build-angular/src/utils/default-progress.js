"use strict";
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.defaultProgress = void 0;
function defaultProgress(progress) {
    if (progress === undefined) {
        return process.stdout.isTTY === true;
    }
    return progress;
}
exports.defaultProgress = defaultProgress;
