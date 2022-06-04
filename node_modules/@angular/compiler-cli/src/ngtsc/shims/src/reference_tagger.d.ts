/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/// <amd-module name="@angular/compiler-cli/src/ngtsc/shims/src/reference_tagger" />
import ts from 'typescript';
/**
 * Manipulates the `referencedFiles` property of `ts.SourceFile`s to add references to shim files
 * for each original source file, causing the shims to be loaded into the program as well.
 *
 * `ShimReferenceTagger`s are intended to operate during program creation only.
 */
export declare class ShimReferenceTagger {
    private suffixes;
    /**
     * Tracks which original files have been processed and had shims generated if necessary.
     *
     * This is used to avoid generating shims twice for the same file.
     */
    private tagged;
    /**
     * Whether shim tagging is currently being performed.
     */
    private enabled;
    constructor(shimExtensions: string[]);
    /**
     * Tag `sf` with any needed references if it's not a shim itself.
     */
    tag(sf: ts.SourceFile): void;
    /**
     * Disable the `ShimReferenceTagger` and free memory associated with tracking tagged files.
     */
    finalize(): void;
}
