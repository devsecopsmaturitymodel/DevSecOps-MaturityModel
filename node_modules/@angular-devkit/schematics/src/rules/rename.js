"use strict";
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.rename = void 0;
const core_1 = require("@angular-devkit/core");
const base_1 = require("./base");
function rename(match, to) {
    return (0, base_1.forEach)((entry) => {
        if (match(entry.path, entry)) {
            return {
                content: entry.content,
                path: (0, core_1.normalize)(to(entry.path, entry)),
            };
        }
        else {
            return entry;
        }
    });
}
exports.rename = rename;
