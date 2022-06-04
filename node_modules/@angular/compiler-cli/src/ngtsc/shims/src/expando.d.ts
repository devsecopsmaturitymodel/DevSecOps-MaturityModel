/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/// <amd-module name="@angular/compiler-cli/src/ngtsc/shims/src/expando" />
import ts from 'typescript';
import { AbsoluteFsPath } from '../../file_system';
/**
 * A `Symbol` which is used to patch extension data onto `ts.SourceFile`s.
 */
export declare const NgExtension: unique symbol;
/**
 * Contents of the `NgExtension` property of a `ts.SourceFile`.
 */
export interface NgExtensionData {
    isTopLevelShim: boolean;
    fileShim: NgFileShimData | null;
    /**
     * The contents of the `referencedFiles` array, before modification by a `ShimReferenceTagger`.
     */
    originalReferencedFiles: ReadonlyArray<ts.FileReference> | null;
    /**
     * The contents of the `referencedFiles` array, after modification by a `ShimReferenceTagger`.
     */
    taggedReferenceFiles: ReadonlyArray<ts.FileReference> | null;
}
/**
 * A `ts.SourceFile` which has `NgExtension` data.
 */
export interface NgExtendedSourceFile extends ts.SourceFile {
    /**
     * Overrides the type of `referencedFiles` to be writeable.
     */
    referencedFiles: ts.FileReference[];
    [NgExtension]: NgExtensionData;
}
/**
 * Narrows a `ts.SourceFile` if it has an `NgExtension` property.
 */
export declare function isExtended(sf: ts.SourceFile): sf is NgExtendedSourceFile;
/**
 * Returns the `NgExtensionData` for a given `ts.SourceFile`, adding it if none exists.
 */
export declare function sfExtensionData(sf: ts.SourceFile): NgExtensionData;
/**
 * Data associated with a per-shim instance `ts.SourceFile`.
 */
export interface NgFileShimData {
    generatedFrom: AbsoluteFsPath;
    extension: string;
}
/**
 * An `NgExtendedSourceFile` that is a per-file shim and has `NgFileShimData`.
 */
export interface NgFileShimSourceFile extends NgExtendedSourceFile {
    [NgExtension]: NgExtensionData & {
        fileShim: NgFileShimData;
    };
}
/**
 * Check whether `sf` is a per-file shim `ts.SourceFile`.
 */
export declare function isFileShimSourceFile(sf: ts.SourceFile): sf is NgFileShimSourceFile;
/**
 * Check whether `sf` is a shim `ts.SourceFile` (either a per-file shim or a top-level shim).
 */
export declare function isShim(sf: ts.SourceFile): boolean;
/**
 * Copy any shim data from one `ts.SourceFile` to another.
 */
export declare function copyFileShimData(from: ts.SourceFile, to: ts.SourceFile): void;
/**
 * For those `ts.SourceFile`s in the `program` which have previously been tagged by a
 * `ShimReferenceTagger`, restore the original `referencedFiles` array that does not have shim tags.
 */
export declare function untagAllTsFiles(program: ts.Program): void;
/**
 * For those `ts.SourceFile`s in the `program` which have previously been tagged by a
 * `ShimReferenceTagger`, re-apply the effects of tagging by updating the `referencedFiles` array to
 * the tagged version produced previously.
 */
export declare function retagAllTsFiles(program: ts.Program): void;
/**
 * Restore the original `referencedFiles` for the given `ts.SourceFile`.
 */
export declare function untagTsFile(sf: ts.SourceFile): void;
/**
 * Apply the previously tagged `referencedFiles` to the given `ts.SourceFile`, if it was previously
 * tagged.
 */
export declare function retagTsFile(sf: ts.SourceFile): void;
