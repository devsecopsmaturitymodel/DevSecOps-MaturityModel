/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { JsonValue } from '@angular-devkit/core';
export declare type InsertionIndex = (properties: string[]) => number;
export declare type JSONPath = (string | number)[];
/** @internal */
export declare class JSONFile {
    private readonly path;
    content: string;
    constructor(path: string);
    private _jsonAst;
    private get JsonAst();
    get(jsonPath: JSONPath): unknown;
    modify(jsonPath: JSONPath, value: JsonValue | undefined, insertInOrder?: InsertionIndex | false): boolean;
    save(): void;
}
export declare function readAndParseJson(path: string): any;
export declare function parseJson(content: string): any;
