/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/// <amd-module name="@angular/compiler-cli/src/ngtsc/incremental/semantic_graph/src/graph" />
import { Expression } from '@angular/compiler';
import { AbsoluteFsPath } from '../../../file_system';
import { ClassDeclaration } from '../../../reflection';
import { SemanticReference, SemanticSymbol } from './api';
export interface SemanticDependencyResult {
    /**
     * The files that need to be re-emitted.
     */
    needsEmit: Set<AbsoluteFsPath>;
    /**
     * The files for which the type-check block should be regenerated.
     */
    needsTypeCheckEmit: Set<AbsoluteFsPath>;
    /**
     * The newly built graph that represents the current compilation.
     */
    newGraph: SemanticDepGraph;
}
/**
 * The semantic dependency graph of a single compilation.
 */
export declare class SemanticDepGraph {
    readonly files: Map<AbsoluteFsPath, Map<string, SemanticSymbol>>;
    readonly symbolByDecl: Map<ClassDeclaration<import("@angular/compiler-cli/src/ngtsc/reflection").DeclarationNode>, SemanticSymbol>;
    /**
     * Registers a symbol in the graph. The symbol is given a unique identifier if possible, such that
     * its equivalent symbol can be obtained from a prior graph even if its declaration node has
     * changed across rebuilds. Symbols without an identifier are only able to find themselves in a
     * prior graph if their declaration node is identical.
     */
    registerSymbol(symbol: SemanticSymbol): void;
    /**
     * Attempts to resolve a symbol in this graph that represents the given symbol from another graph.
     * If no matching symbol could be found, null is returned.
     *
     * @param symbol The symbol from another graph for which its equivalent in this graph should be
     * found.
     */
    getEquivalentSymbol(symbol: SemanticSymbol): SemanticSymbol | null;
    /**
     * Attempts to find the symbol by its identifier.
     */
    private getSymbolByName;
    /**
     * Attempts to resolve the declaration to its semantic symbol.
     */
    getSymbolByDecl(decl: ClassDeclaration): SemanticSymbol | null;
}
/**
 * Implements the logic to go from a previous dependency graph to a new one, along with information
 * on which files have been affected.
 */
export declare class SemanticDepGraphUpdater {
    /**
     * The semantic dependency graph of the most recently succeeded compilation, or null if this
     * is the initial build.
     */
    private priorGraph;
    private readonly newGraph;
    /**
     * Contains opaque symbols that were created for declarations for which there was no symbol
     * registered, which happens for e.g. external declarations.
     */
    private readonly opaqueSymbols;
    constructor(
    /**
     * The semantic dependency graph of the most recently succeeded compilation, or null if this
     * is the initial build.
     */
    priorGraph: SemanticDepGraph | null);
    /**
     * Registers the symbol in the new graph that is being created.
     */
    registerSymbol(symbol: SemanticSymbol): void;
    /**
     * Takes all facts that have been gathered to create a new semantic dependency graph. In this
     * process, the semantic impact of the changes is determined which results in a set of files that
     * need to be emitted and/or type-checked.
     */
    finalize(): SemanticDependencyResult;
    private determineInvalidatedFiles;
    private determineInvalidatedTypeCheckFiles;
    /**
     * Creates a `SemanticReference` for the reference to `decl` using the expression `expr`. See
     * the documentation of `SemanticReference` for details.
     */
    getSemanticReference(decl: ClassDeclaration, expr: Expression): SemanticReference;
    /**
     * Gets the `SemanticSymbol` that was registered for `decl` during the current compilation, or
     * returns an opaque symbol that represents `decl`.
     */
    getSymbol(decl: ClassDeclaration): SemanticSymbol;
    /**
     * Gets or creates an `OpaqueSymbol` for the provided class declaration.
     */
    private getOpaqueSymbol;
}
