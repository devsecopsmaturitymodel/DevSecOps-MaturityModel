/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/// <amd-module name="@angular/compiler-cli/src/ngtsc/cycles/src/imports" />
import ts from 'typescript';
import { PerfRecorder } from '../../perf';
/**
 * A cached graph of imports in the `ts.Program`.
 *
 * The `ImportGraph` keeps track of dependencies (imports) of individual `ts.SourceFile`s. Only
 * dependencies within the same program are tracked; imports into packages on NPM are not.
 */
export declare class ImportGraph {
    private checker;
    private perf;
    private imports;
    constructor(checker: ts.TypeChecker, perf: PerfRecorder);
    /**
     * List the direct (not transitive) imports of a given `ts.SourceFile`.
     *
     * This operation is cached.
     */
    importsOf(sf: ts.SourceFile): Set<ts.SourceFile>;
    /**
     * Find an import path from the `start` SourceFile to the `end` SourceFile.
     *
     * This function implements a breadth first search that results in finding the
     * shortest path between the `start` and `end` points.
     *
     * @param start the starting point of the path.
     * @param end the ending point of the path.
     * @returns an array of source files that connect the `start` and `end` source files, or `null` if
     *     no path could be found.
     */
    findPath(start: ts.SourceFile, end: ts.SourceFile): ts.SourceFile[] | null;
    /**
     * Add a record of an import from `sf` to `imported`, that's not present in the original
     * `ts.Program` but will be remembered by the `ImportGraph`.
     */
    addSyntheticImport(sf: ts.SourceFile, imported: ts.SourceFile): void;
    private scanImports;
}
