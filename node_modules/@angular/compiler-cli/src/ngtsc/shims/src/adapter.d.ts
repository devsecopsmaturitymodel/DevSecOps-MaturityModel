/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/// <amd-module name="@angular/compiler-cli/src/ngtsc/shims/src/adapter" />
import ts from 'typescript';
import { AbsoluteFsPath } from '../../file_system';
import { PerFileShimGenerator, TopLevelShimGenerator } from '../api';
/**
 * Generates and tracks shim files for each original `ts.SourceFile`.
 *
 * The `ShimAdapter` provides an API that's designed to be used by a `ts.CompilerHost`
 * implementation and allows it to include synthetic "shim" files in the program that's being
 * created. It works for both freshly created programs as well as with reuse of an older program
 * (which already may contain shim files and thus have a different creation flow).
 */
export declare class ShimAdapter {
    private delegate;
    /**
     * A map of shim file names to the `ts.SourceFile` generated for those shims.
     */
    private shims;
    /**
     * A map of shim file names to existing shims which were part of a previous iteration of this
     * program.
     *
     * Not all of these shims will be inherited into this program.
     */
    private priorShims;
    /**
     * File names which are already known to not be shims.
     *
     * This allows for short-circuit returns without the expense of running regular expressions
     * against the filename repeatedly.
     */
    private notShims;
    /**
     * The shim generators supported by this adapter as well as extra precalculated data facilitating
     * their use.
     */
    private generators;
    /**
     * A `Set` of shim `ts.SourceFile`s which should not be emitted.
     */
    readonly ignoreForEmit: Set<ts.SourceFile>;
    /**
     * A list of extra filenames which should be considered inputs to program creation.
     *
     * This includes any top-level shims generated for the program, as well as per-file shim names for
     * those files which are included in the root files of the program.
     */
    readonly extraInputFiles: ReadonlyArray<AbsoluteFsPath>;
    /**
     * Extension prefixes of all installed per-file shims.
     */
    readonly extensionPrefixes: string[];
    constructor(delegate: Pick<ts.CompilerHost, 'getSourceFile' | 'fileExists'>, tsRootFiles: AbsoluteFsPath[], topLevelGenerators: TopLevelShimGenerator[], perFileGenerators: PerFileShimGenerator[], oldProgram: ts.Program | null);
    /**
     * Produce a shim `ts.SourceFile` if `fileName` refers to a shim file which should exist in the
     * program.
     *
     * If `fileName` does not refer to a potential shim file, `null` is returned. If a corresponding
     * base file could not be determined, `undefined` is returned instead.
     */
    maybeGenerate(fileName: AbsoluteFsPath): ts.SourceFile | null | undefined;
    private generateSpecific;
}
