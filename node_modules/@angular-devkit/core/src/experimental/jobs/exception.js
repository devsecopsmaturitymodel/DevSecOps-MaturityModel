"use strict";
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.JobDoesNotExistException = exports.JobNameAlreadyRegisteredException = void 0;
const index_1 = require("../../exception/index");
class JobNameAlreadyRegisteredException extends index_1.BaseException {
    constructor(name) {
        super(`Job named ${JSON.stringify(name)} already exists.`);
    }
}
exports.JobNameAlreadyRegisteredException = JobNameAlreadyRegisteredException;
class JobDoesNotExistException extends index_1.BaseException {
    constructor(name) {
        super(`Job name ${JSON.stringify(name)} does not exist.`);
    }
}
exports.JobDoesNotExistException = JobDoesNotExistException;
