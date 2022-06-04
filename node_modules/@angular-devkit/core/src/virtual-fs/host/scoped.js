"use strict";
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScopedHost = void 0;
const path_1 = require("../path");
const resolver_1 = require("./resolver");
class ScopedHost extends resolver_1.ResolverHost {
    constructor(delegate, _root = path_1.NormalizedRoot) {
        super(delegate);
        this._root = _root;
    }
    _resolve(path) {
        return (0, path_1.join)(this._root, path);
    }
}
exports.ScopedHost = ScopedHost;
