"use strict";
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.Empty = void 0;
const rxjs_1 = require("rxjs");
const exception_1 = require("../../exception");
class Empty {
    constructor() {
        this.capabilities = {
            synchronous: true,
        };
    }
    read(path) {
        return (0, rxjs_1.throwError)(new exception_1.FileDoesNotExistException(path));
    }
    list(path) {
        return (0, rxjs_1.of)([]);
    }
    exists(path) {
        return (0, rxjs_1.of)(false);
    }
    isDirectory(path) {
        return (0, rxjs_1.of)(false);
    }
    isFile(path) {
        return (0, rxjs_1.of)(false);
    }
    stat(path) {
        // We support stat() but have no file.
        return (0, rxjs_1.of)(null);
    }
}
exports.Empty = Empty;
