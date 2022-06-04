"use strict";
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransformLogger = void 0;
const logger_1 = require("./logger");
class TransformLogger extends logger_1.Logger {
    constructor(name, transform, parent = null) {
        super(name, parent);
        this._observable = transform(this._observable);
    }
}
exports.TransformLogger = TransformLogger;
