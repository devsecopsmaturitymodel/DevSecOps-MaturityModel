/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/// <amd-module name="@angular/compiler-cli/src/ngtsc/typecheck/src/type_check_block" />
import { BoundTarget, SchemaMetadata, TmplAstElement, TmplAstNode, TmplAstReference, TmplAstTemplate, TmplAstVariable } from '@angular/compiler';
import ts from 'typescript';
import { Reference } from '../../imports';
import { ClassDeclaration } from '../../reflection';
import { TemplateId, TypeCheckableDirectiveMeta, TypeCheckBlockMetadata } from '../api';
import { DomSchemaChecker } from './dom';
import { Environment } from './environment';
import { OutOfBandDiagnosticRecorder } from './oob';
/**
 * Controls how generics for the component context class will be handled during TCB generation.
 */
export declare enum TcbGenericContextBehavior {
    /**
     * References to generic parameter bounds will be emitted via the `TypeParameterEmitter`.
     *
     * The caller must verify that all parameter bounds are emittable in order to use this mode.
     */
    UseEmitter = 0,
    /**
     * Generic parameter declarations will be copied directly from the `ts.ClassDeclaration` of the
     * component class.
     *
     * The caller must only use the generated TCB code in a context where such copies will still be
     * valid, such as an inline type check block.
     */
    CopyClassNodes = 1,
    /**
     * Any generic parameters for the component context class will be set to `any`.
     *
     * Produces a less useful type, but is always safe to use.
     */
    FallbackToAny = 2
}
/**
 * Given a `ts.ClassDeclaration` for a component, and metadata regarding that component, compose a
 * "type check block" function.
 *
 * When passed through TypeScript's TypeChecker, type errors that arise within the type check block
 * function indicate issues in the template itself.
 *
 * As a side effect of generating a TCB for the component, `ts.Diagnostic`s may also be produced
 * directly for issues within the template which are identified during generation. These issues are
 * recorded in either the `domSchemaChecker` (which checks usage of DOM elements and bindings) as
 * well as the `oobRecorder` (which records errors when the type-checking code generator is unable
 * to sufficiently understand a template).
 *
 * @param env an `Environment` into which type-checking code will be generated.
 * @param ref a `Reference` to the component class which should be type-checked.
 * @param name a `ts.Identifier` to use for the generated `ts.FunctionDeclaration`.
 * @param meta metadata about the component's template and the function being generated.
 * @param domSchemaChecker used to check and record errors regarding improper usage of DOM elements
 * and bindings.
 * @param oobRecorder used to record errors regarding template elements which could not be correctly
 * translated into types during TCB generation.
 * @param genericContextBehavior controls how generic parameters (especially parameters with generic
 * bounds) will be referenced from the generated TCB code.
 */
export declare function generateTypeCheckBlock(env: Environment, ref: Reference<ClassDeclaration<ts.ClassDeclaration>>, name: ts.Identifier, meta: TypeCheckBlockMetadata, domSchemaChecker: DomSchemaChecker, oobRecorder: OutOfBandDiagnosticRecorder, genericContextBehavior: TcbGenericContextBehavior): ts.FunctionDeclaration;
/**
 * A code generation operation that's involved in the construction of a Type Check Block.
 *
 * The generation of a TCB is non-linear. Bindings within a template may result in the need to
 * construct certain types earlier than they otherwise would be constructed. That is, if the
 * generation of a TCB for a template is broken down into specific operations (constructing a
 * directive, extracting a variable from a let- operation, etc), then it's possible for operations
 * earlier in the sequence to depend on operations which occur later in the sequence.
 *
 * `TcbOp` abstracts the different types of operations which are required to convert a template into
 * a TCB. This allows for two phases of processing for the template, where 1) a linear sequence of
 * `TcbOp`s is generated, and then 2) these operations are executed, not necessarily in linear
 * order.
 *
 * Each `TcbOp` may insert statements into the body of the TCB, and also optionally return a
 * `ts.Expression` which can be used to reference the operation's result.
 */
declare abstract class TcbOp {
    /**
     * Set to true if this operation can be considered optional. Optional operations are only executed
     * when depended upon by other operations, otherwise they are disregarded. This allows for less
     * code to generate, parse and type-check, overall positively contributing to performance.
     */
    abstract readonly optional: boolean;
    abstract execute(): ts.Expression | null;
    /**
     * Replacement value or operation used while this `TcbOp` is executing (i.e. to resolve circular
     * references during its execution).
     *
     * This is usually a `null!` expression (which asks TS to infer an appropriate type), but another
     * `TcbOp` can be returned in cases where additional code generation is necessary to deal with
     * circular references.
     */
    circularFallback(): TcbOp | ts.Expression;
}
/**
 * A `TcbOp` which generates code to check event bindings on an element that correspond with the
 * outputs of a directive.
 *
 * Executing this operation returns nothing.
 */
export declare class TcbDirectiveOutputsOp extends TcbOp {
    private tcb;
    private scope;
    private node;
    private dir;
    constructor(tcb: Context, scope: Scope, node: TmplAstTemplate | TmplAstElement, dir: TypeCheckableDirectiveMeta);
    get optional(): boolean;
    execute(): null;
}
/**
 * Overall generation context for the type check block.
 *
 * `Context` handles operations during code generation which are global with respect to the whole
 * block. It's responsible for variable name allocation and management of any imports needed. It
 * also contains the template metadata itself.
 */
export declare class Context {
    readonly env: Environment;
    readonly domSchemaChecker: DomSchemaChecker;
    readonly oobRecorder: OutOfBandDiagnosticRecorder;
    readonly id: TemplateId;
    readonly boundTarget: BoundTarget<TypeCheckableDirectiveMeta>;
    private pipes;
    readonly schemas: SchemaMetadata[];
    private nextId;
    constructor(env: Environment, domSchemaChecker: DomSchemaChecker, oobRecorder: OutOfBandDiagnosticRecorder, id: TemplateId, boundTarget: BoundTarget<TypeCheckableDirectiveMeta>, pipes: Map<string, Reference<ClassDeclaration<ts.ClassDeclaration>>>, schemas: SchemaMetadata[]);
    /**
     * Allocate a new variable name for use within the `Context`.
     *
     * Currently this uses a monotonically increasing counter, but in the future the variable name
     * might change depending on the type of data being stored.
     */
    allocateId(): ts.Identifier;
    getPipeByName(name: string): Reference<ClassDeclaration<ts.ClassDeclaration>> | null;
}
/**
 * Local scope within the type check block for a particular template.
 *
 * The top-level template and each nested `<ng-template>` have their own `Scope`, which exist in a
 * hierarchy. The structure of this hierarchy mirrors the syntactic scopes in the generated type
 * check block, where each nested template is encased in an `if` structure.
 *
 * As a template's `TcbOp`s are executed in a given `Scope`, statements are added via
 * `addStatement()`. When this processing is complete, the `Scope` can be turned into a `ts.Block`
 * via `renderToBlock()`.
 *
 * If a `TcbOp` requires the output of another, it can call `resolve()`.
 */
declare class Scope {
    private tcb;
    private parent;
    private guard;
    /**
     * A queue of operations which need to be performed to generate the TCB code for this scope.
     *
     * This array can contain either a `TcbOp` which has yet to be executed, or a `ts.Expression|null`
     * representing the memoized result of executing the operation. As operations are executed, their
     * results are written into the `opQueue`, overwriting the original operation.
     *
     * If an operation is in the process of being executed, it is temporarily overwritten here with
     * `INFER_TYPE_FOR_CIRCULAR_OP_EXPR`. This way, if a cycle is encountered where an operation
     * depends transitively on its own result, the inner operation will infer the least narrow type
     * that fits instead. This has the same semantics as TypeScript itself when types are referenced
     * circularly.
     */
    private opQueue;
    /**
     * A map of `TmplAstElement`s to the index of their `TcbElementOp` in the `opQueue`
     */
    private elementOpMap;
    /**
     * A map of maps which tracks the index of `TcbDirectiveCtorOp`s in the `opQueue` for each
     * directive on a `TmplAstElement` or `TmplAstTemplate` node.
     */
    private directiveOpMap;
    /**
     * A map of `TmplAstReference`s to the index of their `TcbReferenceOp` in the `opQueue`
     */
    private referenceOpMap;
    /**
     * Map of immediately nested <ng-template>s (within this `Scope`) represented by `TmplAstTemplate`
     * nodes to the index of their `TcbTemplateContextOp`s in the `opQueue`.
     */
    private templateCtxOpMap;
    /**
     * Map of variables declared on the template that created this `Scope` (represented by
     * `TmplAstVariable` nodes) to the index of their `TcbVariableOp`s in the `opQueue`.
     */
    private varMap;
    /**
     * Statements for this template.
     *
     * Executing the `TcbOp`s in the `opQueue` populates this array.
     */
    private statements;
    private constructor();
    /**
     * Constructs a `Scope` given either a `TmplAstTemplate` or a list of `TmplAstNode`s.
     *
     * @param tcb the overall context of TCB generation.
     * @param parent the `Scope` of the parent template (if any) or `null` if this is the root
     * `Scope`.
     * @param templateOrNodes either a `TmplAstTemplate` representing the template for which to
     * calculate the `Scope`, or a list of nodes if no outer template object is available.
     * @param guard an expression that is applied to this scope for type narrowing purposes.
     */
    static forNodes(tcb: Context, parent: Scope | null, templateOrNodes: TmplAstTemplate | (TmplAstNode[]), guard: ts.Expression | null): Scope;
    /**
     * Look up a `ts.Expression` representing the value of some operation in the current `Scope`,
     * including any parent scope(s). This method always returns a mutable clone of the
     * `ts.Expression` with the comments cleared.
     *
     * @param node a `TmplAstNode` of the operation in question. The lookup performed will depend on
     * the type of this node:
     *
     * Assuming `directive` is not present, then `resolve` will return:
     *
     * * `TmplAstElement` - retrieve the expression for the element DOM node
     * * `TmplAstTemplate` - retrieve the template context variable
     * * `TmplAstVariable` - retrieve a template let- variable
     * * `TmplAstReference` - retrieve variable created for the local ref
     *
     * @param directive if present, a directive type on a `TmplAstElement` or `TmplAstTemplate` to
     * look up instead of the default for an element or template node.
     */
    resolve(node: TmplAstElement | TmplAstTemplate | TmplAstVariable | TmplAstReference, directive?: TypeCheckableDirectiveMeta): ts.Expression;
    /**
     * Add a statement to this scope.
     */
    addStatement(stmt: ts.Statement): void;
    /**
     * Get the statements.
     */
    render(): ts.Statement[];
    /**
     * Returns an expression of all template guards that apply to this scope, including those of
     * parent scopes. If no guards have been applied, null is returned.
     */
    guards(): ts.Expression | null;
    private resolveLocal;
    /**
     * Like `executeOp`, but assert that the operation actually returned `ts.Expression`.
     */
    private resolveOp;
    /**
     * Execute a particular `TcbOp` in the `opQueue`.
     *
     * This method replaces the operation in the `opQueue` with the result of execution (once done)
     * and also protects against a circular dependency from the operation to itself by temporarily
     * setting the operation's result to a special expression.
     */
    private executeOp;
    private appendNode;
    private checkAndAppendReferencesOfNode;
    private appendDirectivesAndInputsOfNode;
    private appendOutputsOfNode;
    private appendDeepSchemaChecks;
    private appendIcuExpressions;
}
export {};
