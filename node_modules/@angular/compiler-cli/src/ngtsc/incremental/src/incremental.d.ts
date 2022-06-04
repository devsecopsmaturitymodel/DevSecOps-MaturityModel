/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/// <amd-module name="@angular/compiler-cli/src/ngtsc/incremental/src/incremental" />
import ts from 'typescript';
import { AbsoluteFsPath } from '../../file_system';
import { PerfRecorder } from '../../perf';
import { ClassRecord, TraitCompiler } from '../../transform';
import { FileTypeCheckingData } from '../../typecheck';
import { IncrementalBuild } from '../api';
import { SemanticDepGraphUpdater } from '../semantic_graph';
import { FileDependencyGraph } from './dependency_tracking';
import { IncrementalState } from './state';
/**
 * Manages the incremental portion of an Angular compilation, allowing for reuse of a prior
 * compilation if available, and producing an output state for reuse of the current compilation in a
 * future one.
 */
export declare class IncrementalCompilation implements IncrementalBuild<ClassRecord, FileTypeCheckingData> {
    readonly depGraph: FileDependencyGraph;
    private versions;
    private step;
    private phase;
    /**
     * `IncrementalState` of this compilation if it were to be reused in a subsequent incremental
     * compilation at the current moment.
     *
     * Exposed via the `state` read-only getter.
     */
    private _state;
    private constructor();
    /**
     * Begin a fresh `IncrementalCompilation`.
     */
    static fresh(program: ts.Program, versions: Map<AbsoluteFsPath, string> | null): IncrementalCompilation;
    static incremental(program: ts.Program, newVersions: Map<AbsoluteFsPath, string> | null, oldProgram: ts.Program, oldState: IncrementalState, modifiedResourceFiles: Set<AbsoluteFsPath> | null, perf: PerfRecorder): IncrementalCompilation;
    get state(): IncrementalState;
    get semanticDepGraphUpdater(): SemanticDepGraphUpdater;
    recordSuccessfulAnalysis(traitCompiler: TraitCompiler): void;
    recordSuccessfulTypeCheck(results: Map<AbsoluteFsPath, FileTypeCheckingData>): void;
    recordSuccessfulEmit(sf: ts.SourceFile): void;
    priorAnalysisFor(sf: ts.SourceFile): ClassRecord[] | null;
    priorTypeCheckingResultsFor(sf: ts.SourceFile): FileTypeCheckingData | null;
    safeToSkipEmit(sf: ts.SourceFile): boolean;
}
