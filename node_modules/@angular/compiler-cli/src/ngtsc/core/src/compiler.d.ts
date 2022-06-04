/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/// <amd-module name="@angular/compiler-cli/src/ngtsc/core/src/compiler" />
import ts from 'typescript';
import { AbsoluteFsPath } from '../../file_system';
import { IncrementalBuildStrategy, IncrementalCompilation, IncrementalState } from '../../incremental';
import { IndexedComponent } from '../../indexer';
import { ComponentResources, DirectiveMeta, PipeMeta } from '../../metadata';
import { ActivePerfRecorder } from '../../perf';
import { ProgramDriver } from '../../program_driver';
import { DeclarationNode } from '../../reflection';
import { OptimizeFor, TemplateTypeChecker } from '../../typecheck/api';
import { Xi18nContext } from '../../xi18n';
import { NgCompilerAdapter, NgCompilerOptions } from '../api';
/**
 * Discriminant type for a `CompilationTicket`.
 */
export declare enum CompilationTicketKind {
    Fresh = 0,
    IncrementalTypeScript = 1,
    IncrementalResource = 2
}
/**
 * Begin an Angular compilation operation from scratch.
 */
export interface FreshCompilationTicket {
    kind: CompilationTicketKind.Fresh;
    options: NgCompilerOptions;
    incrementalBuildStrategy: IncrementalBuildStrategy;
    programDriver: ProgramDriver;
    enableTemplateTypeChecker: boolean;
    usePoisonedData: boolean;
    tsProgram: ts.Program;
    perfRecorder: ActivePerfRecorder;
}
/**
 * Begin an Angular compilation operation that incorporates changes to TypeScript code.
 */
export interface IncrementalTypeScriptCompilationTicket {
    kind: CompilationTicketKind.IncrementalTypeScript;
    options: NgCompilerOptions;
    newProgram: ts.Program;
    incrementalBuildStrategy: IncrementalBuildStrategy;
    incrementalCompilation: IncrementalCompilation;
    programDriver: ProgramDriver;
    enableTemplateTypeChecker: boolean;
    usePoisonedData: boolean;
    perfRecorder: ActivePerfRecorder;
}
export interface IncrementalResourceCompilationTicket {
    kind: CompilationTicketKind.IncrementalResource;
    compiler: NgCompiler;
    modifiedResourceFiles: Set<string>;
    perfRecorder: ActivePerfRecorder;
}
/**
 * A request to begin Angular compilation, either starting from scratch or from a known prior state.
 *
 * `CompilationTicket`s are used to initialize (or update) an `NgCompiler` instance, the core of the
 * Angular compiler. They abstract the starting state of compilation and allow `NgCompiler` to be
 * managed independently of any incremental compilation lifecycle.
 */
export declare type CompilationTicket = FreshCompilationTicket | IncrementalTypeScriptCompilationTicket | IncrementalResourceCompilationTicket;
/**
 * Create a `CompilationTicket` for a brand new compilation, using no prior state.
 */
export declare function freshCompilationTicket(tsProgram: ts.Program, options: NgCompilerOptions, incrementalBuildStrategy: IncrementalBuildStrategy, programDriver: ProgramDriver, perfRecorder: ActivePerfRecorder | null, enableTemplateTypeChecker: boolean, usePoisonedData: boolean): CompilationTicket;
/**
 * Create a `CompilationTicket` as efficiently as possible, based on a previous `NgCompiler`
 * instance and a new `ts.Program`.
 */
export declare function incrementalFromCompilerTicket(oldCompiler: NgCompiler, newProgram: ts.Program, incrementalBuildStrategy: IncrementalBuildStrategy, programDriver: ProgramDriver, modifiedResourceFiles: Set<AbsoluteFsPath>, perfRecorder: ActivePerfRecorder | null): CompilationTicket;
/**
 * Create a `CompilationTicket` directly from an old `ts.Program` and associated Angular compilation
 * state, along with a new `ts.Program`.
 */
export declare function incrementalFromStateTicket(oldProgram: ts.Program, oldState: IncrementalState, newProgram: ts.Program, options: NgCompilerOptions, incrementalBuildStrategy: IncrementalBuildStrategy, programDriver: ProgramDriver, modifiedResourceFiles: Set<AbsoluteFsPath>, perfRecorder: ActivePerfRecorder | null, enableTemplateTypeChecker: boolean, usePoisonedData: boolean): CompilationTicket;
export declare function resourceChangeTicket(compiler: NgCompiler, modifiedResourceFiles: Set<string>): IncrementalResourceCompilationTicket;
/**
 * The heart of the Angular Ivy compiler.
 *
 * The `NgCompiler` provides an API for performing Angular compilation within a custom TypeScript
 * compiler. Each instance of `NgCompiler` supports a single compilation, which might be
 * incremental.
 *
 * `NgCompiler` is lazy, and does not perform any of the work of the compilation until one of its
 * output methods (e.g. `getDiagnostics`) is called.
 *
 * See the README.md for more information.
 */
export declare class NgCompiler {
    private adapter;
    readonly options: NgCompilerOptions;
    private inputProgram;
    readonly programDriver: ProgramDriver;
    readonly incrementalStrategy: IncrementalBuildStrategy;
    readonly incrementalCompilation: IncrementalCompilation;
    readonly enableTemplateTypeChecker: boolean;
    readonly usePoisonedData: boolean;
    private livePerfRecorder;
    /**
     * Lazily evaluated state of the compilation.
     *
     * This is created on demand by calling `ensureAnalyzed`.
     */
    private compilation;
    /**
     * Any diagnostics related to the construction of the compilation.
     *
     * These are diagnostics which arose during setup of the host and/or program.
     */
    private constructionDiagnostics;
    /**
     * Non-template diagnostics related to the program itself. Does not include template
     * diagnostics because the template type checker memoizes them itself.
     *
     * This is set by (and memoizes) `getNonTemplateDiagnostics`.
     */
    private nonTemplateDiagnostics;
    private closureCompilerEnabled;
    private currentProgram;
    private entryPoint;
    private moduleResolver;
    private resourceManager;
    private cycleAnalyzer;
    readonly ignoreForDiagnostics: Set<ts.SourceFile>;
    readonly ignoreForEmit: Set<ts.SourceFile>;
    /**
     * `NgCompiler` can be reused for multiple compilations (for resource-only changes), and each
     * new compilation uses a fresh `PerfRecorder`. Thus, classes created with a lifespan of the
     * `NgCompiler` use a `DelegatingPerfRecorder` so the `PerfRecorder` they write to can be updated
     * with each fresh compilation.
     */
    private delegatingPerfRecorder;
    /**
     * Convert a `CompilationTicket` into an `NgCompiler` instance for the requested compilation.
     *
     * Depending on the nature of the compilation request, the `NgCompiler` instance may be reused
     * from a previous compilation and updated with any changes, it may be a new instance which
     * incrementally reuses state from a previous compilation, or it may represent a fresh
     * compilation entirely.
     */
    static fromTicket(ticket: CompilationTicket, adapter: NgCompilerAdapter): NgCompiler;
    private constructor();
    get perfRecorder(): ActivePerfRecorder;
    /**
     * Exposes the `IncrementalCompilation` under an old property name that the CLI uses, avoiding a
     * chicken-and-egg problem with the rename to `incrementalCompilation`.
     *
     * TODO(alxhub): remove when the CLI uses the new name.
     */
    get incrementalDriver(): IncrementalCompilation;
    private updateWithChangedResources;
    /**
     * Get the resource dependencies of a file.
     *
     * If the file is not part of the compilation, an empty array will be returned.
     */
    getResourceDependencies(file: ts.SourceFile): string[];
    /**
     * Get all Angular-related diagnostics for this compilation.
     */
    getDiagnostics(): ts.Diagnostic[];
    /**
     * Get all Angular-related diagnostics for this compilation.
     *
     * If a `ts.SourceFile` is passed, only diagnostics related to that file are returned.
     */
    getDiagnosticsForFile(file: ts.SourceFile, optimizeFor: OptimizeFor): ts.Diagnostic[];
    /**
     * Get all `ts.Diagnostic`s currently available that pertain to the given component.
     */
    getDiagnosticsForComponent(component: ts.ClassDeclaration): ts.Diagnostic[];
    /**
     * Add Angular.io error guide links to diagnostics for this compilation.
     */
    private addMessageTextDetails;
    /**
     * Get all setup-related diagnostics for this compilation.
     */
    getOptionDiagnostics(): ts.Diagnostic[];
    /**
     * Get the current `ts.Program` known to this `NgCompiler`.
     *
     * Compilation begins with an input `ts.Program`, and during template type-checking operations new
     * `ts.Program`s may be produced using the `ProgramDriver`. The most recent such `ts.Program` to
     * be produced is available here.
     *
     * This `ts.Program` serves two key purposes:
     *
     * * As an incremental starting point for creating the next `ts.Program` based on files that the
     *   user has changed (for clients using the TS compiler program APIs).
     *
     * * As the "before" point for an incremental compilation invocation, to determine what's changed
     *   between the old and new programs (for all compilations).
     */
    getCurrentProgram(): ts.Program;
    getTemplateTypeChecker(): TemplateTypeChecker;
    /**
     * Retrieves the `ts.Declaration`s for any component(s) which use the given template file.
     */
    getComponentsWithTemplateFile(templateFilePath: string): ReadonlySet<DeclarationNode>;
    /**
     * Retrieves the `ts.Declaration`s for any component(s) which use the given template file.
     */
    getComponentsWithStyleFile(styleFilePath: string): ReadonlySet<DeclarationNode>;
    /**
     * Retrieves external resources for the given component.
     */
    getComponentResources(classDecl: DeclarationNode): ComponentResources | null;
    getMeta(classDecl: DeclarationNode): PipeMeta | DirectiveMeta | null;
    /**
     * Perform Angular's analysis step (as a precursor to `getDiagnostics` or `prepareEmit`)
     * asynchronously.
     *
     * Normally, this operation happens lazily whenever `getDiagnostics` or `prepareEmit` are called.
     * However, certain consumers may wish to allow for an asynchronous phase of analysis, where
     * resources such as `styleUrls` are resolved asynchonously. In these cases `analyzeAsync` must be
     * called first, and its `Promise` awaited prior to calling any other APIs of `NgCompiler`.
     */
    analyzeAsync(): Promise<void>;
    /**
     * Fetch transformers and other information which is necessary for a consumer to `emit` the
     * program with Angular-added definitions.
     */
    prepareEmit(): {
        transformers: ts.CustomTransformers;
    };
    /**
     * Run the indexing process and return a `Map` of all indexed components.
     *
     * See the `indexing` package for more details.
     */
    getIndexedComponents(): Map<DeclarationNode, IndexedComponent>;
    /**
     * Collect i18n messages into the `Xi18nContext`.
     */
    xi18n(ctx: Xi18nContext): void;
    private ensureAnalyzed;
    private analyzeSync;
    private resolveCompilation;
    private get fullTemplateTypeCheck();
    private getTypeCheckingConfig;
    private getTemplateDiagnostics;
    private getTemplateDiagnosticsForFile;
    private getNonTemplateDiagnostics;
    /**
     * Calls the `extendedTemplateCheck` phase of the trait compiler
     * @param sf optional parameter to get diagnostics for a certain file
     *     or all files in the program if `sf` is undefined
     * @returns generated extended template diagnostics
     */
    private getExtendedTemplateDiagnostics;
    private makeCompilation;
}
/**
 * Determine if the given `Program` is @angular/core.
 */
export declare function isAngularCorePackage(program: ts.Program): boolean;
