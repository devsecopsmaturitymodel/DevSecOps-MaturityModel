"use strict";
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.deepCopy = exports.mapObject = void 0;
/** @deprecated Since v12.0, unused by the Angular tooling */
function mapObject(obj, mapper) {
    return Object.keys(obj).reduce((acc, k) => {
        acc[k] = mapper(k, obj[k]);
        return acc;
    }, {});
}
exports.mapObject = mapObject;
const copySymbol = Symbol();
function deepCopy(value) {
    if (Array.isArray(value)) {
        return value.map((o) => deepCopy(o));
    }
    else if (value && typeof value === 'object') {
        const valueCasted = value;
        if (valueCasted[copySymbol]) {
            // This is a circular dependency. Just return the cloned value.
            return valueCasted[copySymbol];
        }
        if (valueCasted['toJSON']) {
            return JSON.parse(valueCasted['toJSON']());
        }
        const copy = Object.create(Object.getPrototypeOf(valueCasted));
        valueCasted[copySymbol] = copy;
        for (const key of Object.getOwnPropertyNames(valueCasted)) {
            copy[key] = deepCopy(valueCasted[key]);
        }
        valueCasted[copySymbol] = undefined;
        return copy;
    }
    else {
        return value;
    }
}
exports.deepCopy = deepCopy;
