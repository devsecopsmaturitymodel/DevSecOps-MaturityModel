"use strict";
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.mergeSchemas = exports.isJsonSchema = void 0;
const utils_1 = require("../utils");
function isJsonSchema(value) {
    return (0, utils_1.isJsonObject)(value) || value === false || value === true;
}
exports.isJsonSchema = isJsonSchema;
/**
 * Return a schema that is the merge of all subschemas, ie. it should validate all the schemas
 * that were passed in. It is possible to make an invalid schema this way, e.g. by using
 * `mergeSchemas({ type: 'number' }, { type: 'string' })`, which will never validate.
 * @param schemas All schemas to be merged.
 */
function mergeSchemas(...schemas) {
    return schemas.reduce((prev, curr) => {
        if (curr === undefined) {
            return prev;
        }
        if (prev === false || curr === false) {
            return false;
        }
        else if (prev === true) {
            return curr;
        }
        else if (curr === true) {
            return prev;
        }
        else if (Array.isArray(prev.allOf)) {
            if (Array.isArray(curr.allOf)) {
                return { ...prev, allOf: [...prev.allOf, ...curr.allOf] };
            }
            else {
                return { ...prev, allOf: [...prev.allOf, curr] };
            }
        }
        else if (Array.isArray(curr.allOf)) {
            return { ...prev, allOf: [prev, ...curr.allOf] };
        }
        else {
            return { ...prev, allOf: [prev, curr] };
        }
    }, true);
}
exports.mergeSchemas = mergeSchemas;
