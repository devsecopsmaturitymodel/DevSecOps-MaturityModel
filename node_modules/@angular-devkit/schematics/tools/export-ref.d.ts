/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
export declare class ExportStringRef<T> {
    private _ref?;
    private _module;
    private _path;
    constructor(ref: string, parentPath?: string, inner?: boolean);
    get ref(): T | undefined;
    get module(): string;
    get path(): string;
}
