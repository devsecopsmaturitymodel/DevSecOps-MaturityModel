/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/// <amd-module name="@angular/compiler-cli/src/ngtsc/annotations/src/directive" />
import { ConstantPool, ParsedHostBindings, R3ClassMetadata, R3DirectiveMetadata, R3QueryMetadata } from '@angular/compiler';
import ts from 'typescript';
import { Reference } from '../../imports';
import { SemanticDepGraphUpdater, SemanticSymbol, SemanticTypeParameter } from '../../incremental/semantic_graph';
import { ClassPropertyMapping, DirectiveTypeCheckMeta, InjectableClassRegistry, MetadataReader, MetadataRegistry } from '../../metadata';
import { PartialEvaluator } from '../../partial_evaluator';
import { PerfRecorder } from '../../perf';
import { ClassDeclaration, ClassMember, Decorator, ReflectionHost } from '../../reflection';
import { LocalModuleScopeRegistry } from '../../scope';
import { AnalysisOutput, CompileResult, DecoratorHandler, DetectResult, HandlerFlags, HandlerPrecedence, ResolveResult } from '../../transform';
export interface DirectiveHandlerData {
    baseClass: Reference<ClassDeclaration> | 'dynamic' | null;
    typeCheckMeta: DirectiveTypeCheckMeta;
    meta: R3DirectiveMetadata;
    classMetadata: R3ClassMetadata | null;
    providersRequiringFactory: Set<Reference<ClassDeclaration>> | null;
    inputs: ClassPropertyMapping;
    outputs: ClassPropertyMapping;
    isPoisoned: boolean;
    isStructural: boolean;
}
/**
 * Represents an Angular directive. Components are represented by `ComponentSymbol`, which inherits
 * from this symbol.
 */
export declare class DirectiveSymbol extends SemanticSymbol {
    readonly selector: string | null;
    readonly inputs: ClassPropertyMapping;
    readonly outputs: ClassPropertyMapping;
    readonly exportAs: string[] | null;
    readonly typeCheckMeta: DirectiveTypeCheckMeta;
    readonly typeParameters: SemanticTypeParameter[] | null;
    baseClass: SemanticSymbol | null;
    constructor(decl: ClassDeclaration, selector: string | null, inputs: ClassPropertyMapping, outputs: ClassPropertyMapping, exportAs: string[] | null, typeCheckMeta: DirectiveTypeCheckMeta, typeParameters: SemanticTypeParameter[] | null);
    isPublicApiAffected(previousSymbol: SemanticSymbol): boolean;
    isTypeCheckApiAffected(previousSymbol: SemanticSymbol): boolean;
}
export declare class DirectiveDecoratorHandler implements DecoratorHandler<Decorator | null, DirectiveHandlerData, DirectiveSymbol, unknown> {
    private reflector;
    private evaluator;
    private metaRegistry;
    private scopeRegistry;
    private metaReader;
    private injectableRegistry;
    private isCore;
    private semanticDepGraphUpdater;
    private annotateForClosureCompiler;
    private compileUndecoratedClassesWithAngularFeatures;
    private perf;
    constructor(reflector: ReflectionHost, evaluator: PartialEvaluator, metaRegistry: MetadataRegistry, scopeRegistry: LocalModuleScopeRegistry, metaReader: MetadataReader, injectableRegistry: InjectableClassRegistry, isCore: boolean, semanticDepGraphUpdater: SemanticDepGraphUpdater | null, annotateForClosureCompiler: boolean, compileUndecoratedClassesWithAngularFeatures: boolean, perf: PerfRecorder);
    readonly precedence = HandlerPrecedence.PRIMARY;
    readonly name: string;
    detect(node: ClassDeclaration, decorators: Decorator[] | null): DetectResult<Decorator | null> | undefined;
    analyze(node: ClassDeclaration, decorator: Readonly<Decorator | null>, flags?: HandlerFlags): AnalysisOutput<DirectiveHandlerData>;
    symbol(node: ClassDeclaration, analysis: Readonly<DirectiveHandlerData>): DirectiveSymbol;
    register(node: ClassDeclaration, analysis: Readonly<DirectiveHandlerData>): void;
    resolve(node: ClassDeclaration, analysis: DirectiveHandlerData, symbol: DirectiveSymbol): ResolveResult<unknown>;
    compileFull(node: ClassDeclaration, analysis: Readonly<DirectiveHandlerData>, resolution: Readonly<unknown>, pool: ConstantPool): CompileResult[];
    compilePartial(node: ClassDeclaration, analysis: Readonly<DirectiveHandlerData>, resolution: Readonly<unknown>): CompileResult[];
    /**
     * Checks if a given class uses Angular features and returns the TypeScript node
     * that indicated the usage. Classes are considered using Angular features if they
     * contain class members that are either decorated with a known Angular decorator,
     * or if they correspond to a known Angular lifecycle hook.
     */
    private findClassFieldWithAngularFeatures;
}
/**
 * Helper function to extract metadata from a `Directive` or `Component`. `Directive`s without a
 * selector are allowed to be used for abstract base classes. These abstract directives should not
 * appear in the declarations of an `NgModule` and additional verification is done when processing
 * the module.
 */
export declare function extractDirectiveMetadata(clazz: ClassDeclaration, decorator: Readonly<Decorator | null>, reflector: ReflectionHost, evaluator: PartialEvaluator, isCore: boolean, flags: HandlerFlags, annotateForClosureCompiler: boolean, defaultSelector?: string | null): {
    decorator: Map<string, ts.Expression>;
    metadata: R3DirectiveMetadata;
    inputs: ClassPropertyMapping;
    outputs: ClassPropertyMapping;
    isStructural: boolean;
} | undefined;
export declare function extractQueryMetadata(exprNode: ts.Node, name: string, args: ReadonlyArray<ts.Expression>, propertyName: string, reflector: ReflectionHost, evaluator: PartialEvaluator): R3QueryMetadata;
export declare function extractQueriesFromDecorator(queryData: ts.Expression, reflector: ReflectionHost, evaluator: PartialEvaluator, isCore: boolean): {
    content: R3QueryMetadata[];
    view: R3QueryMetadata[];
};
export declare function parseFieldArrayValue(directive: Map<string, ts.Expression>, field: string, evaluator: PartialEvaluator): null | string[];
export declare function queriesFromFields(fields: {
    member: ClassMember;
    decorators: Decorator[];
}[], reflector: ReflectionHost, evaluator: PartialEvaluator): R3QueryMetadata[];
export declare function extractHostBindings(members: ClassMember[], evaluator: PartialEvaluator, coreModule: string | undefined, metadata?: Map<string, ts.Expression>): ParsedHostBindings;
