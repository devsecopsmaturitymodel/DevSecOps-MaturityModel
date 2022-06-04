/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/// <amd-module name="@angular/compiler-cli/src/ngtsc/perf/src/api" />
/**
 * A phase of compilation for which time is tracked in a distinct bucket.
 */
export declare enum PerfPhase {
    /**
     * The "default" phase which tracks time not spent in any other phase.
     */
    Unaccounted = 0,
    /**
     * Time spent setting up the compiler, before a TypeScript program is created.
     *
     * This includes operations like configuring the `ts.CompilerHost` and any wrappers.
     */
    Setup = 1,
    /**
     * Time spent in `ts.createProgram`, including reading and parsing `ts.SourceFile`s in the
     * `ts.CompilerHost`.
     *
     * This might be an incremental program creation operation.
     */
    TypeScriptProgramCreate = 2,
    /**
     * Time spent reconciling the contents of an old `ts.Program` with the new incremental one.
     *
     * Only present in incremental compilations.
     */
    Reconciliation = 3,
    /**
     * Time spent updating an `NgCompiler` instance with a resource-only change.
     *
     * Only present in incremental compilations where the change was resource-only.
     */
    ResourceUpdate = 4,
    /**
     * Time spent calculating the plain TypeScript diagnostics (structural and semantic).
     */
    TypeScriptDiagnostics = 5,
    /**
     * Time spent in Angular analysis of individual classes in the program.
     */
    Analysis = 6,
    /**
     * Time spent in Angular global analysis (synthesis of analysis information into a complete
     * understanding of the program).
     */
    Resolve = 7,
    /**
     * Time spent building the import graph of the program in order to perform cycle detection.
     */
    CycleDetection = 8,
    /**
     * Time spent generating the text of Type Check Blocks in order to perform template type checking.
     */
    TcbGeneration = 9,
    /**
     * Time spent updating the `ts.Program` with new Type Check Block code.
     */
    TcbUpdateProgram = 10,
    /**
     * Time spent by TypeScript performing its emit operations, including downleveling and writing
     * output files.
     */
    TypeScriptEmit = 11,
    /**
     * Time spent by Angular performing code transformations of ASTs as they're about to be emitted.
     *
     * This includes the actual code generation step for templates, and occurs during the emit phase
     * (but is tracked separately from `TypeScriptEmit` time).
     */
    Compile = 12,
    /**
     * Time spent performing a `TemplateTypeChecker` autocompletion operation.
     */
    TtcAutocompletion = 13,
    /**
     * Time spent computing template type-checking diagnostics.
     */
    TtcDiagnostics = 14,
    /**
     * Time spent getting a `Symbol` from the `TemplateTypeChecker`.
     */
    TtcSymbol = 15,
    /**
     * Time spent by the Angular Language Service calculating a "get references" or a renaming
     * operation.
     */
    LsReferencesAndRenames = 16,
    /**
     * Time spent by the Angular Language Service calculating a "quick info" operation.
     */
    LsQuickInfo = 17,
    /**
     * Time spent by the Angular Language Service calculating a "get type definition" or "get
     * definition" operation.
     */
    LsDefinition = 18,
    /**
     * Time spent by the Angular Language Service calculating a "get completions" (AKA autocomplete)
     * operation.
     */
    LsCompletions = 19,
    /**
     * Time spent by the Angular Language Service calculating a "view template typecheck block"
     * operation.
     */
    LsTcb = 20,
    /**
     * Time spent by the Angular Language Service calculating diagnostics.
     */
    LsDiagnostics = 21,
    /**
     * Time spent by the Angular Language Service calculating a "get component locations for template"
     * operation.
     */
    LsComponentLocations = 22,
    /**
     * Time spent by the Angular Language Service calculating signature help.
     */
    LsSignatureHelp = 23,
    /**
     * Tracks the number of `PerfPhase`s, and must appear at the end of the list.
     */
    LAST = 24
}
/**
 * Represents some occurrence during compilation, and is tracked with a counter.
 */
export declare enum PerfEvent {
    /**
     * Counts the number of `.d.ts` files in the program.
     */
    InputDtsFile = 0,
    /**
     * Counts the number of non-`.d.ts` files in the program.
     */
    InputTsFile = 1,
    /**
     * An `@Component` class was analyzed.
     */
    AnalyzeComponent = 2,
    /**
     * An `@Directive` class was analyzed.
     */
    AnalyzeDirective = 3,
    /**
     * An `@Injectable` class was analyzed.
     */
    AnalyzeInjectable = 4,
    /**
     * An `@NgModule` class was analyzed.
     */
    AnalyzeNgModule = 5,
    /**
     * An `@Pipe` class was analyzed.
     */
    AnalyzePipe = 6,
    /**
     * A trait was analyzed.
     *
     * In theory, this should be the sum of the `Analyze` counters for each decorator type.
     */
    TraitAnalyze = 7,
    /**
     * A trait had a prior analysis available from an incremental program, and did not need to be
     * re-analyzed.
     */
    TraitReuseAnalysis = 8,
    /**
     * A `ts.SourceFile` directly changed between the prior program and a new incremental compilation.
     */
    SourceFilePhysicalChange = 9,
    /**
     * A `ts.SourceFile` did not physically changed, but according to the file dependency graph, has
     * logically changed between the prior program and a new incremental compilation.
     */
    SourceFileLogicalChange = 10,
    /**
     * A `ts.SourceFile` has not logically changed and all of its analysis results were thus available
     * for reuse.
     */
    SourceFileReuseAnalysis = 11,
    /**
     * A Type Check Block (TCB) was generated.
     */
    GenerateTcb = 12,
    /**
     * A Type Check Block (TCB) could not be generated because inlining was disabled, and the block
     * would've required inlining.
     */
    SkipGenerateTcbNoInline = 13,
    /**
     * A `.ngtypecheck.ts` file could be reused from the previous program and did not need to be
     * regenerated.
     */
    ReuseTypeCheckFile = 14,
    /**
     * The template type-checking program required changes and had to be updated in an incremental
     * step.
     */
    UpdateTypeCheckProgram = 15,
    /**
     * The compiler was able to prove that a `ts.SourceFile` did not need to be re-emitted.
     */
    EmitSkipSourceFile = 16,
    /**
     * A `ts.SourceFile` was emitted.
     */
    EmitSourceFile = 17,
    /**
     * Tracks the number of `PrefEvent`s, and must appear at the end of the list.
     */
    LAST = 18
}
/**
 * Represents a checkpoint during compilation at which the memory usage of the compiler should be
 * recorded.
 */
export declare enum PerfCheckpoint {
    /**
     * The point at which the `PerfRecorder` was created, and ideally tracks memory used before any
     * compilation structures are created.
     */
    Initial = 0,
    /**
     * The point just after the `ts.Program` has been created.
     */
    TypeScriptProgramCreate = 1,
    /**
     * The point just before Angular analysis starts.
     *
     * In the main usage pattern for the compiler, TypeScript diagnostics have been calculated at this
     * point, so the `ts.TypeChecker` has fully ingested the current program, all `ts.Type` structures
     * and `ts.Symbol`s have been created.
     */
    PreAnalysis = 2,
    /**
     * The point just after Angular analysis completes.
     */
    Analysis = 3,
    /**
     * The point just after Angular resolution is complete.
     */
    Resolve = 4,
    /**
     * The point just after Type Check Blocks (TCBs) have been generated.
     */
    TtcGeneration = 5,
    /**
     * The point just after the template type-checking program has been updated with any new TCBs.
     */
    TtcUpdateProgram = 6,
    /**
     * The point just before emit begins.
     *
     * In the main usage pattern for the compiler, all template type-checking diagnostics have been
     * requested at this point.
     */
    PreEmit = 7,
    /**
     * The point just after the program has been fully emitted.
     */
    Emit = 8,
    /**
     * Tracks the number of `PerfCheckpoint`s, and must appear at the end of the list.
     */
    LAST = 9
}
/**
 * Records timing, memory, or counts at specific points in the compiler's operation.
 */
export interface PerfRecorder {
    /**
     * Set the current phase of compilation.
     *
     * Time spent in the previous phase will be accounted to that phase. The caller is responsible for
     * exiting the phase when work that should be tracked within it is completed, and either returning
     * to the previous phase or transitioning to the next one directly.
     *
     * In general, prefer using `inPhase()` to instrument a section of code, as it automatically
     * handles entering and exiting the phase. `phase()` should only be used when the former API
     * cannot be cleanly applied to a particular operation.
     *
     * @returns the previous phase
     */
    phase(phase: PerfPhase): PerfPhase;
    /**
     * Run `fn` in the given `PerfPhase` and return the result.
     *
     * Enters `phase` before executing the given `fn`, then exits the phase and returns the result.
     * Prefer this API to `phase()` where possible.
     */
    inPhase<T>(phase: PerfPhase, fn: () => T): T;
    /**
     * Record the memory usage of the compiler at the given checkpoint.
     */
    memory(after: PerfCheckpoint): void;
    /**
     * Record that a specific event has occurred, possibly more than once.
     */
    eventCount(event: PerfEvent, incrementBy?: number): void;
    /**
     * Return the `PerfRecorder` to an empty state (clear all tracked statistics) and reset the zero
     * point to the current time.
     */
    reset(): void;
}
