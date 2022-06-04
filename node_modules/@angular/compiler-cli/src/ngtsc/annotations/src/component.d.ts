/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/// <amd-module name="@angular/compiler-cli/src/ngtsc/annotations/src/component" />
import { AnimationTriggerNames, ConstantPool, InterpolationConfig, ParsedTemplate, ParseSourceFile, R3ClassMetadata, R3ComponentMetadata, TmplAstNode } from '@angular/compiler';
import ts from 'typescript';
import { CycleAnalyzer, CycleHandlingStrategy } from '../../cycles';
import { ModuleResolver, Reference, ReferenceEmitter } from '../../imports';
import { DependencyTracker } from '../../incremental/api';
import { SemanticDepGraphUpdater, SemanticReference, SemanticSymbol } from '../../incremental/semantic_graph';
import { IndexingContext } from '../../indexer';
import { ClassPropertyMapping, ComponentResources, DirectiveTypeCheckMeta, InjectableClassRegistry, MetadataReader, MetadataRegistry, ResourceRegistry } from '../../metadata';
import { PartialEvaluator } from '../../partial_evaluator';
import { PerfRecorder } from '../../perf';
import { ClassDeclaration, Decorator, ReflectionHost } from '../../reflection';
import { ComponentScopeReader, LocalModuleScopeRegistry, TypeCheckScopeRegistry } from '../../scope';
import { AnalysisOutput, CompileResult, DecoratorHandler, DetectResult, HandlerFlags, HandlerPrecedence, ResolveResult } from '../../transform';
import { TemplateSourceMapping, TypeCheckContext } from '../../typecheck/api';
import { ExtendedTemplateChecker } from '../../typecheck/extended/api';
import { SubsetOfKeys } from '../../util/src/typescript';
import { Xi18nContext } from '../../xi18n';
import { ResourceLoader } from './api';
import { DirectiveSymbol } from './directive';
/**
 * These fields of `R3ComponentMetadata` are updated in the `resolve` phase.
 *
 * The `keyof R3ComponentMetadata &` condition ensures that only fields of `R3ComponentMetadata` can
 * be included here.
 */
export declare type ComponentMetadataResolvedFields = SubsetOfKeys<R3ComponentMetadata, 'directives' | 'pipes' | 'declarationListEmitMode'>;
export interface ComponentAnalysisData {
    /**
     * `meta` includes those fields of `R3ComponentMetadata` which are calculated at `analyze` time
     * (not during resolve).
     */
    meta: Omit<R3ComponentMetadata, ComponentMetadataResolvedFields>;
    baseClass: Reference<ClassDeclaration> | 'dynamic' | null;
    typeCheckMeta: DirectiveTypeCheckMeta;
    template: ParsedTemplateWithSource;
    classMetadata: R3ClassMetadata | null;
    inputs: ClassPropertyMapping;
    outputs: ClassPropertyMapping;
    /**
     * Providers extracted from the `providers` field of the component annotation which will require
     * an Angular factory definition at runtime.
     */
    providersRequiringFactory: Set<Reference<ClassDeclaration>> | null;
    /**
     * Providers extracted from the `viewProviders` field of the component annotation which will
     * require an Angular factory definition at runtime.
     */
    viewProvidersRequiringFactory: Set<Reference<ClassDeclaration>> | null;
    resources: ComponentResources;
    /**
     * `styleUrls` extracted from the decorator, if present.
     */
    styleUrls: StyleUrlMeta[] | null;
    /**
     * Inline stylesheets extracted from the decorator, if present.
     */
    inlineStyles: string[] | null;
    isPoisoned: boolean;
    animationTriggerNames: AnimationTriggerNames | null;
}
export declare type ComponentResolutionData = Pick<R3ComponentMetadata, ComponentMetadataResolvedFields>;
/**
 * The literal style url extracted from the decorator, along with metadata for diagnostics.
 */
export interface StyleUrlMeta {
    url: string;
    nodeForError: ts.Node;
    source: ResourceTypeForDiagnostics.StylesheetFromTemplate | ResourceTypeForDiagnostics.StylesheetFromDecorator;
}
/**
 * Information about the origin of a resource in the application code. This is used for creating
 * diagnostics, so we can point to the root cause of an error in the application code.
 *
 * A template resource comes from the `templateUrl` property on the component decorator.
 *
 * Stylesheets resources can come from either the `styleUrls` property on the component decorator,
 * or from inline `style` tags and style links on the external template.
 */
export declare const enum ResourceTypeForDiagnostics {
    Template = 0,
    StylesheetFromTemplate = 1,
    StylesheetFromDecorator = 2
}
/**
 * Represents an Angular component.
 */
export declare class ComponentSymbol extends DirectiveSymbol {
    usedDirectives: SemanticReference[];
    usedPipes: SemanticReference[];
    isRemotelyScoped: boolean;
    isEmitAffected(previousSymbol: SemanticSymbol, publicApiAffected: Set<SemanticSymbol>): boolean;
    isTypeCheckBlockAffected(previousSymbol: SemanticSymbol, typeCheckApiAffected: Set<SemanticSymbol>): boolean;
}
/**
 * `DecoratorHandler` which handles the `@Component` annotation.
 */
export declare class ComponentDecoratorHandler implements DecoratorHandler<Decorator, ComponentAnalysisData, ComponentSymbol, ComponentResolutionData> {
    private reflector;
    private evaluator;
    private metaRegistry;
    private metaReader;
    private scopeReader;
    private scopeRegistry;
    private typeCheckScopeRegistry;
    private resourceRegistry;
    private isCore;
    private resourceLoader;
    private rootDirs;
    private defaultPreserveWhitespaces;
    private i18nUseExternalIds;
    private enableI18nLegacyMessageIdFormat;
    private usePoisonedData;
    private i18nNormalizeLineEndingsInICUs;
    private moduleResolver;
    private cycleAnalyzer;
    private cycleHandlingStrategy;
    private refEmitter;
    private depTracker;
    private injectableRegistry;
    private semanticDepGraphUpdater;
    private annotateForClosureCompiler;
    private perf;
    constructor(reflector: ReflectionHost, evaluator: PartialEvaluator, metaRegistry: MetadataRegistry, metaReader: MetadataReader, scopeReader: ComponentScopeReader, scopeRegistry: LocalModuleScopeRegistry, typeCheckScopeRegistry: TypeCheckScopeRegistry, resourceRegistry: ResourceRegistry, isCore: boolean, resourceLoader: ResourceLoader, rootDirs: ReadonlyArray<string>, defaultPreserveWhitespaces: boolean, i18nUseExternalIds: boolean, enableI18nLegacyMessageIdFormat: boolean, usePoisonedData: boolean, i18nNormalizeLineEndingsInICUs: boolean | undefined, moduleResolver: ModuleResolver, cycleAnalyzer: CycleAnalyzer, cycleHandlingStrategy: CycleHandlingStrategy, refEmitter: ReferenceEmitter, depTracker: DependencyTracker | null, injectableRegistry: InjectableClassRegistry, semanticDepGraphUpdater: SemanticDepGraphUpdater | null, annotateForClosureCompiler: boolean, perf: PerfRecorder);
    private literalCache;
    private elementSchemaRegistry;
    /**
     * During the asynchronous preanalyze phase, it's necessary to parse the template to extract
     * any potential <link> tags which might need to be loaded. This cache ensures that work is not
     * thrown away, and the parsed template is reused during the analyze phase.
     */
    private preanalyzeTemplateCache;
    private preanalyzeStylesCache;
    readonly precedence = HandlerPrecedence.PRIMARY;
    readonly name: string;
    detect(node: ClassDeclaration, decorators: Decorator[] | null): DetectResult<Decorator> | undefined;
    preanalyze(node: ClassDeclaration, decorator: Readonly<Decorator>): Promise<void> | undefined;
    analyze(node: ClassDeclaration, decorator: Readonly<Decorator>, flags?: HandlerFlags): AnalysisOutput<ComponentAnalysisData>;
    symbol(node: ClassDeclaration, analysis: Readonly<ComponentAnalysisData>): ComponentSymbol;
    register(node: ClassDeclaration, analysis: ComponentAnalysisData): void;
    index(context: IndexingContext, node: ClassDeclaration, analysis: Readonly<ComponentAnalysisData>): null | undefined;
    typeCheck(ctx: TypeCheckContext, node: ClassDeclaration, meta: Readonly<ComponentAnalysisData>): void;
    extendedTemplateCheck(component: ts.ClassDeclaration, extendedTemplateChecker: ExtendedTemplateChecker): ts.Diagnostic[];
    resolve(node: ClassDeclaration, analysis: Readonly<ComponentAnalysisData>, symbol: ComponentSymbol): ResolveResult<ComponentResolutionData>;
    xi18n(ctx: Xi18nContext, node: ClassDeclaration, analysis: Readonly<ComponentAnalysisData>): void;
    updateResources(node: ClassDeclaration, analysis: ComponentAnalysisData): void;
    compileFull(node: ClassDeclaration, analysis: Readonly<ComponentAnalysisData>, resolution: Readonly<ComponentResolutionData>, pool: ConstantPool): CompileResult[];
    compilePartial(node: ClassDeclaration, analysis: Readonly<ComponentAnalysisData>, resolution: Readonly<ComponentResolutionData>): CompileResult[];
    /**
     * Transforms the given decorator to inline external resources. i.e. if the decorator
     * resolves to `@Component`, the `templateUrl` and `styleUrls` metadata fields will be
     * transformed to their semantically-equivalent inline variants.
     *
     * This method is used for serializing decorators into the class metadata. The emitted
     * class metadata should not refer to external resources as this would be inconsistent
     * with the component definitions/declarations which already inline external resources.
     *
     * Additionally, the references to external resources would require libraries to ship
     * external resources exclusively for the class metadata.
     */
    private _transformDecoratorToInlineResources;
    private _resolveLiteral;
    private _resolveEnumValue;
    private _extractComponentStyleUrls;
    private _extractStyleUrlsFromExpression;
    private _extractStyleResources;
    private _preloadAndParseTemplate;
    private extractTemplate;
    private _parseTemplate;
    private parseTemplateDeclaration;
    private _resolveImportedFile;
    /**
     * Check whether adding an import from `origin` to the source-file corresponding to `expr` would
     * create a cyclic import.
     *
     * @returns a `Cycle` object if a cycle would be created, otherwise `null`.
     */
    private _checkForCyclicImport;
    private _recordSyntheticImport;
    private makeResourceNotFoundError;
    private _extractTemplateStyleUrls;
}
/**
 * Information about the template which was extracted during parsing.
 *
 * This contains the actual parsed template as well as any metadata collected during its parsing,
 * some of which might be useful for re-parsing the template with different options.
 */
export interface ParsedComponentTemplate extends ParsedTemplate {
    /**
     * The template AST, parsed in a manner which preserves source map information for diagnostics.
     *
     * Not useful for emit.
     */
    diagNodes: TmplAstNode[];
    /**
     * The `ParseSourceFile` for the template.
     */
    file: ParseSourceFile;
}
export interface ParsedTemplateWithSource extends ParsedComponentTemplate {
    /** The string contents of the template. */
    content: string;
    sourceMapping: TemplateSourceMapping;
    declaration: TemplateDeclaration;
}
/**
 * Common fields extracted from the declaration of a template.
 */
interface CommonTemplateDeclaration {
    preserveWhitespaces: boolean;
    interpolationConfig: InterpolationConfig;
    templateUrl: string;
    resolvedTemplateUrl: string;
}
/**
 * Information extracted from the declaration of an inline template.
 */
interface InlineTemplateDeclaration extends CommonTemplateDeclaration {
    isInline: true;
    expression: ts.Expression;
}
/**
 * Information extracted from the declaration of an external template.
 */
interface ExternalTemplateDeclaration extends CommonTemplateDeclaration {
    isInline: false;
    templateUrlExpression: ts.Expression;
}
/**
 * The declaration of a template extracted from a component decorator.
 *
 * This data is extracted and stored separately to facilitate re-interpreting the template
 * declaration whenever the compiler is notified of a change to a template file. With this
 * information, `ComponentDecoratorHandler` is able to re-read the template and update the component
 * record without needing to parse the original decorator again.
 */
declare type TemplateDeclaration = InlineTemplateDeclaration | ExternalTemplateDeclaration;
export {};
