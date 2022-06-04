/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/// <amd-module name="@angular/compiler-cli/src/ngtsc/typecheck/src/checker" />
import { AST, LiteralPrimitive, ParseSourceSpan, PropertyRead, SafePropertyRead, TmplAstElement, TmplAstNode, TmplAstTemplate, TmplAstTextAttribute } from '@angular/compiler';
import ts from 'typescript';
import { ErrorCode } from '../../diagnostics';
import { AbsoluteFsPath } from '../../file_system';
import { ReferenceEmitter } from '../../imports';
import { IncrementalBuild } from '../../incremental/api';
import { PerfRecorder } from '../../perf';
import { ProgramDriver } from '../../program_driver';
import { ReflectionHost } from '../../reflection';
import { ComponentScopeReader, TypeCheckScopeRegistry } from '../../scope';
import { DirectiveInScope, ElementSymbol, FullTemplateMapping, GlobalCompletion, NgTemplateDiagnostic, OptimizeFor, PipeInScope, ProgramTypeCheckAdapter, TcbLocation, TemplateSymbol, TemplateTypeChecker, TypeCheckableDirectiveMeta, TypeCheckingConfig } from '../api';
import { ShimTypeCheckingData } from './context';
import { TemplateSourceManager } from './source';
/**
 * Primary template type-checking engine, which performs type-checking using a
 * `TypeCheckingProgramStrategy` for type-checking program maintenance, and the
 * `ProgramTypeCheckAdapter` for generation of template type-checking code.
 */
export declare class TemplateTypeCheckerImpl implements TemplateTypeChecker {
    private originalProgram;
    readonly programDriver: ProgramDriver;
    private typeCheckAdapter;
    private config;
    private refEmitter;
    private reflector;
    private compilerHost;
    private priorBuild;
    private readonly componentScopeReader;
    private readonly typeCheckScopeRegistry;
    private readonly perf;
    private state;
    /**
     * Stores the `CompletionEngine` which powers autocompletion for each component class.
     *
     * Must be invalidated whenever the component's template or the `ts.Program` changes. Invalidation
     * on template changes is performed within this `TemplateTypeCheckerImpl` instance. When the
     * `ts.Program` changes, the `TemplateTypeCheckerImpl` as a whole is destroyed and replaced.
     */
    private completionCache;
    /**
     * Stores the `SymbolBuilder` which creates symbols for each component class.
     *
     * Must be invalidated whenever the component's template or the `ts.Program` changes. Invalidation
     * on template changes is performed within this `TemplateTypeCheckerImpl` instance. When the
     * `ts.Program` changes, the `TemplateTypeCheckerImpl` as a whole is destroyed and replaced.
     */
    private symbolBuilderCache;
    /**
     * Stores directives and pipes that are in scope for each component.
     *
     * Unlike other caches, the scope of a component is not affected by its template. It will be
     * destroyed when the `ts.Program` changes and the `TemplateTypeCheckerImpl` as a whole is
     * destroyed and replaced.
     */
    private scopeCache;
    /**
     * Stores potential element tags for each component (a union of DOM tags as well as directive
     * tags).
     *
     * Unlike other caches, the scope of a component is not affected by its template. It will be
     * destroyed when the `ts.Program` changes and the `TemplateTypeCheckerImpl` as a whole is
     * destroyed and replaced.
     */
    private elementTagCache;
    private isComplete;
    constructor(originalProgram: ts.Program, programDriver: ProgramDriver, typeCheckAdapter: ProgramTypeCheckAdapter, config: TypeCheckingConfig, refEmitter: ReferenceEmitter, reflector: ReflectionHost, compilerHost: Pick<ts.CompilerHost, 'getCanonicalFileName'>, priorBuild: IncrementalBuild<unknown, FileTypeCheckingData>, componentScopeReader: ComponentScopeReader, typeCheckScopeRegistry: TypeCheckScopeRegistry, perf: PerfRecorder);
    getTemplate(component: ts.ClassDeclaration): TmplAstNode[] | null;
    private getLatestComponentState;
    isTrackedTypeCheckFile(filePath: AbsoluteFsPath): boolean;
    private getFileRecordForTcbLocation;
    private getFileAndShimRecordsForPath;
    getTemplateMappingAtTcbLocation(tcbLocation: TcbLocation): FullTemplateMapping | null;
    generateAllTypeCheckBlocks(): void;
    /**
     * Retrieve type-checking and template parse diagnostics from the given `ts.SourceFile` using the
     * most recent type-checking program.
     */
    getDiagnosticsForFile(sf: ts.SourceFile, optimizeFor: OptimizeFor): ts.Diagnostic[];
    getDiagnosticsForComponent(component: ts.ClassDeclaration): ts.Diagnostic[];
    getTypeCheckBlock(component: ts.ClassDeclaration): ts.Node | null;
    getGlobalCompletions(context: TmplAstTemplate | null, component: ts.ClassDeclaration, node: AST | TmplAstNode): GlobalCompletion | null;
    getExpressionCompletionLocation(ast: PropertyRead | SafePropertyRead, component: ts.ClassDeclaration): TcbLocation | null;
    getLiteralCompletionLocation(node: LiteralPrimitive | TmplAstTextAttribute, component: ts.ClassDeclaration): TcbLocation | null;
    invalidateClass(clazz: ts.ClassDeclaration): void;
    makeTemplateDiagnostic<T extends ErrorCode>(clazz: ts.ClassDeclaration, sourceSpan: ParseSourceSpan, category: ts.DiagnosticCategory, errorCode: T, message: string, relatedInformation?: {
        text: string;
        start: number;
        end: number;
        sourceFile: ts.SourceFile;
    }[]): NgTemplateDiagnostic<T>;
    private getOrCreateCompletionEngine;
    private maybeAdoptPriorResultsForFile;
    private ensureAllShimsForAllFiles;
    private ensureAllShimsForOneFile;
    private ensureShimForComponent;
    private newContext;
    /**
     * Remove any shim data that depends on inline operations applied to the type-checking program.
     *
     * This can be useful if new inlines need to be applied, and it's not possible to guarantee that
     * they won't overwrite or corrupt existing inlines that are used by such shims.
     */
    clearAllShimDataUsingInlines(): void;
    private updateFromContext;
    getFileData(path: AbsoluteFsPath): FileTypeCheckingData;
    getSymbolOfNode(node: TmplAstTemplate, component: ts.ClassDeclaration): TemplateSymbol | null;
    getSymbolOfNode(node: TmplAstElement, component: ts.ClassDeclaration): ElementSymbol | null;
    private getOrCreateSymbolBuilder;
    getDirectivesInScope(component: ts.ClassDeclaration): DirectiveInScope[] | null;
    getPipesInScope(component: ts.ClassDeclaration): PipeInScope[] | null;
    getDirectiveMetadata(dir: ts.ClassDeclaration): TypeCheckableDirectiveMeta | null;
    getPotentialElementTags(component: ts.ClassDeclaration): Map<string, DirectiveInScope | null>;
    getPotentialDomBindings(tagName: string): {
        attribute: string;
        property: string;
    }[];
    getPotentialDomEvents(tagName: string): string[];
    private getScopeData;
}
/**
 * Data for template type-checking related to a specific input file in the user's program (which
 * contains components to be checked).
 */
export interface FileTypeCheckingData {
    /**
     * Whether the type-checking shim required any inline changes to the original file, which affects
     * whether the shim can be reused.
     */
    hasInlines: boolean;
    /**
     * Source mapping information for mapping diagnostics from inlined type check blocks back to the
     * original template.
     */
    sourceManager: TemplateSourceManager;
    /**
     * Data for each shim generated from this input file.
     *
     * A single input file will generate one or more shim files that actually contain template
     * type-checking code.
     */
    shimData: Map<AbsoluteFsPath, ShimTypeCheckingData>;
    /**
     * Whether the template type-checker is certain that all components from this input file have had
     * type-checking code generated into shims.
     */
    isComplete: boolean;
}
