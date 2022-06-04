/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
export interface JsonArray extends Array<JsonValue> {
}
export interface JsonObject {
    [prop: string]: JsonValue;
}
export declare type JsonValue = boolean | string | number | JsonArray | JsonObject | null;
export declare function isJsonObject(value: JsonValue): value is JsonObject;
export declare function isJsonArray(value: JsonValue): value is JsonArray;
