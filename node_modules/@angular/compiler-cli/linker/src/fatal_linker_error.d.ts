/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/// <amd-module name="@angular/compiler-cli/linker/src/fatal_linker_error" />
/**
 * An unrecoverable error during linking.
 */
export declare class FatalLinkerError extends Error {
    node: unknown;
    readonly type = "FatalLinkerError";
    /**
     * Create a new FatalLinkerError.
     *
     * @param node The AST node where the error occurred.
     * @param message A description of the error.
     */
    constructor(node: unknown, message: string);
}
/**
 * Whether the given object `e` is a FatalLinkerError.
 */
export declare function isFatalLinkerError(e: any): e is FatalLinkerError;
