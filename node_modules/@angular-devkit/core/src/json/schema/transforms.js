"use strict";
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.addUndefinedDefaults = void 0;
const utils_1 = require("../utils");
const utility_1 = require("./utility");
function addUndefinedDefaults(value, _pointer, schema) {
    if (typeof schema === 'boolean' || schema === undefined) {
        return value;
    }
    value !== null && value !== void 0 ? value : (value = schema.default);
    const types = (0, utility_1.getTypesOfSchema)(schema);
    if (types.size === 0) {
        return value;
    }
    let type;
    if (types.size === 1) {
        // only one potential type
        type = Array.from(types)[0];
    }
    else if (types.size === 2 && types.has('array') && types.has('object')) {
        // need to create one of them and array is simpler
        type = 'array';
    }
    else if (schema.properties && types.has('object')) {
        // assume object
        type = 'object';
    }
    else if (schema.items && types.has('array')) {
        // assume array
        type = 'array';
    }
    else {
        // anything else needs to be checked by the consumer anyway
        return value;
    }
    if (type === 'array') {
        return value == undefined ? [] : value;
    }
    if (type === 'object') {
        let newValue;
        if (value == undefined) {
            newValue = {};
        }
        else if ((0, utils_1.isJsonObject)(value)) {
            newValue = value;
        }
        else {
            return value;
        }
        if (!(0, utils_1.isJsonObject)(schema.properties)) {
            return newValue;
        }
        for (const [propName, schemaObject] of Object.entries(schema.properties)) {
            if (propName === '$schema' || !(0, utils_1.isJsonObject)(schemaObject)) {
                continue;
            }
            const value = newValue[propName];
            if (value === undefined) {
                newValue[propName] = schemaObject.default;
            }
            else if ((0, utils_1.isJsonObject)(value)) {
                // Basic support for oneOf and anyOf.
                const propertySchemas = schemaObject.oneOf || schemaObject.anyOf;
                const allProperties = Object.keys(value);
                // Locate a schema which declares all the properties that the object contains.
                const adjustedSchema = (0, utils_1.isJsonArray)(propertySchemas) &&
                    propertySchemas.find((s) => {
                        if (!(0, utils_1.isJsonObject)(s)) {
                            return false;
                        }
                        const schemaType = (0, utility_1.getTypesOfSchema)(s);
                        if (schemaType.size === 1 && schemaType.has('object') && (0, utils_1.isJsonObject)(s.properties)) {
                            const properties = Object.keys(s.properties);
                            return allProperties.every((key) => properties.includes(key));
                        }
                        return false;
                    });
                if (adjustedSchema && (0, utils_1.isJsonObject)(adjustedSchema)) {
                    newValue[propName] = addUndefinedDefaults(value, _pointer, adjustedSchema);
                }
            }
        }
        return newValue;
    }
    return value;
}
exports.addUndefinedDefaults = addUndefinedDefaults;
