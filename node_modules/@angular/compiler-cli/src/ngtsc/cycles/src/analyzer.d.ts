/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/// <amd-module name="@angular/compiler-cli/src/ngtsc/cycles/src/analyzer" />
import ts from 'typescript';
import { ImportGraph } from './imports';
/**
 * Analyzes a `ts.Program` for cycles.
 */
export declare class CycleAnalyzer {
    private importGraph;
    /**
     * Cycle detection is requested with the same `from` source file for all used directives and pipes
     * within a component, which makes it beneficial to cache the results as long as the `from` source
     * file has not changed. This avoids visiting the import graph that is reachable from multiple
     * directives/pipes more than once.
     */
    private cachedResults;
    constructor(importGraph: ImportGraph);
    /**
     * Check for a cycle to be created in the `ts.Program` by adding an import between `from` and
     * `to`.
     *
     * @returns a `Cycle` object if an import between `from` and `to` would create a cycle; `null`
     *     otherwise.
     */
    wouldCreateCycle(from: ts.SourceFile, to: ts.SourceFile): Cycle | null;
    /**
     * Record a synthetic import from `from` to `to`.
     *
     * This is an import that doesn't exist in the `ts.Program` but will be considered as part of the
     * import graph for cycle creation.
     */
    recordSyntheticImport(from: ts.SourceFile, to: ts.SourceFile): void;
}
/**
 * Represents an import cycle between `from` and `to` in the program.
 *
 * This class allows us to do the work to compute the cyclic path between `from` and `to` only if
 * needed.
 */
export declare class Cycle {
    private importGraph;
    readonly from: ts.SourceFile;
    readonly to: ts.SourceFile;
    constructor(importGraph: ImportGraph, from: ts.SourceFile, to: ts.SourceFile);
    /**
     * Compute an array of source-files that illustrates the cyclic path between `from` and `to`.
     *
     * Note that a `Cycle` will not be created unless a path is available between `to` and `from`,
     * so `findPath()` will never return `null`.
     */
    getPath(): ts.SourceFile[];
}
/**
 * What to do if a cycle is detected.
 */
export declare const enum CycleHandlingStrategy {
    /** Add "remote scoping" code to avoid creating a cycle. */
    UseRemoteScoping = 0,
    /** Fail the compilation with an error. */
    Error = 1
}
