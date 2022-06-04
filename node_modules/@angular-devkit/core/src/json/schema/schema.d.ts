/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { JsonObject } from '../utils';
/**
 * A specialized interface for JsonSchema (to come). JsonSchemas are also JsonObject.
 *
 * @public
 */
export declare type JsonSchema = JsonObject | boolean;
export declare function isJsonSchema(value: unknown): value is JsonSchema;
/**
 * Return a schema that is the merge of all subschemas, ie. it should validate all the schemas
 * that were passed in. It is possible to make an invalid schema this way, e.g. by using
 * `mergeSchemas({ type: 'number' }, { type: 'string' })`, which will never validate.
 * @param schemas All schemas to be merged.
 */
export declare function mergeSchemas(...schemas: (JsonSchema | undefined)[]): JsonSchema;
