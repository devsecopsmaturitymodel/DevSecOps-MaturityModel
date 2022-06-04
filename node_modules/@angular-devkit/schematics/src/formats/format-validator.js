"use strict";
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatValidator = void 0;
const core_1 = require("@angular-devkit/core");
const operators_1 = require("rxjs/operators");
function formatValidator(data, dataSchema, formats) {
    const registry = new core_1.schema.CoreSchemaRegistry();
    for (const format of formats) {
        registry.addFormat(format);
    }
    return registry.compile(dataSchema).pipe((0, operators_1.mergeMap)((validator) => validator(data)));
}
exports.formatValidator = formatValidator;
