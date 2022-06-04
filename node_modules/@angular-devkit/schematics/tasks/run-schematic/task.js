"use strict";
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.RunSchematicTask = void 0;
const options_1 = require("./options");
class RunSchematicTask {
    constructor(c, s, o) {
        if (arguments.length == 2 || typeof s !== 'string') {
            o = s;
            s = c;
            c = null;
        }
        this._collection = c;
        this._schematic = s;
        this._options = o;
    }
    toConfiguration() {
        return {
            name: options_1.RunSchematicName,
            options: {
                collection: this._collection,
                name: this._schematic,
                options: this._options,
            },
        };
    }
}
exports.RunSchematicTask = RunSchematicTask;
