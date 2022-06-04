"use strict";
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.relativePathToWorkspaceRoot = void 0;
const core_1 = require("@angular-devkit/core");
function relativePathToWorkspaceRoot(projectRoot) {
    const normalizedPath = (0, core_1.split)((0, core_1.normalize)(projectRoot || ''));
    if (normalizedPath.length === 0 || !normalizedPath[0]) {
        return '.';
    }
    else {
        return normalizedPath.map(() => '..').join('/');
    }
}
exports.relativePathToWorkspaceRoot = relativePathToWorkspaceRoot;
