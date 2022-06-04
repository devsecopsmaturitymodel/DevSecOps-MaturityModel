"use strict";
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.move = void 0;
const core_1 = require("@angular-devkit/core");
const base_1 = require("./base");
function move(from, to) {
    if (to === undefined) {
        to = from;
        from = '/';
    }
    const fromPath = (0, core_1.normalize)('/' + from);
    const toPath = (0, core_1.normalize)('/' + to);
    if (fromPath === toPath) {
        return base_1.noop;
    }
    return (tree) => {
        if (tree.exists(fromPath)) {
            // fromPath is a file
            tree.rename(fromPath, toPath);
        }
        else {
            // fromPath is a directory
            tree.getDir(fromPath).visit((path) => {
                tree.rename(path, (0, core_1.join)(toPath, path.substr(fromPath.length)));
            });
        }
        return tree;
    };
}
exports.move = move;
