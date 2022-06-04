/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/// <amd-module name="@angular/compiler-cli/src/ngtsc/program" />
import ts from 'typescript';
import * as api from '../transformers/api';
import { NgCompiler } from './core';
import { NgCompilerOptions } from './core/api';
import { IndexedComponent } from './indexer';
import { DeclarationNode } from './reflection';
/**
 * Entrypoint to the Angular Compiler (Ivy+) which sits behind the `api.Program` interface, allowing
 * it to be a drop-in replacement for the legacy View Engine compiler to tooling such as the
 * command-line main() function or the Angular CLI.
 */
export declare class NgtscProgram implements api.Program {
    private options;
    readonly compiler: NgCompiler;
    /**
     * The primary TypeScript program, which is used for analysis and emit.
     */
    private tsProgram;
    private host;
    private incrementalStrategy;
    constructor(rootNames: ReadonlyArray<string>, options: NgCompilerOptions, delegateHost: api.CompilerHost, oldProgram?: NgtscProgram);
    getTsProgram(): ts.Program;
    getReuseTsProgram(): ts.Program;
    getTsOptionDiagnostics(cancellationToken?: ts.CancellationToken | undefined): readonly ts.Diagnostic[];
    getTsSyntacticDiagnostics(sourceFile?: ts.SourceFile | undefined, cancellationToken?: ts.CancellationToken | undefined): readonly ts.Diagnostic[];
    getTsSemanticDiagnostics(sourceFile?: ts.SourceFile | undefined, cancellationToken?: ts.CancellationToken | undefined): readonly ts.Diagnostic[];
    getNgOptionDiagnostics(cancellationToken?: ts.CancellationToken | undefined): readonly ts.Diagnostic[];
    getNgStructuralDiagnostics(cancellationToken?: ts.CancellationToken | undefined): readonly ts.Diagnostic[];
    getNgSemanticDiagnostics(fileName?: string | undefined, cancellationToken?: ts.CancellationToken | undefined): readonly ts.Diagnostic[];
    /**
     * Ensure that the `NgCompiler` has properly analyzed the program, and allow for the asynchronous
     * loading of any resources during the process.
     *
     * This is used by the Angular CLI to allow for spawning (async) child compilations for things
     * like SASS files used in `styleUrls`.
     */
    loadNgStructureAsync(): Promise<void>;
    listLazyRoutes(entryRoute?: string | undefined): api.LazyRoute[];
    private emitXi18n;
    emit(opts?: {
        emitFlags?: api.EmitFlags | undefined;
        cancellationToken?: ts.CancellationToken | undefined;
        customTransformers?: api.CustomTransformers | undefined;
        emitCallback?: api.TsEmitCallback | undefined;
        mergeEmitResultsCallback?: api.TsMergeEmitResultsCallback | undefined;
    } | undefined): ts.EmitResult;
    getIndexedComponents(): Map<DeclarationNode, IndexedComponent>;
    getEmittedSourceFiles(): Map<string, ts.SourceFile>;
}
