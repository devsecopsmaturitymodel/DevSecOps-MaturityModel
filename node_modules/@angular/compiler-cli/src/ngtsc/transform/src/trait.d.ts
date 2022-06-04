/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/// <amd-module name="@angular/compiler-cli/src/ngtsc/transform/src/trait" />
import ts from 'typescript';
import { SemanticSymbol } from '../../incremental/semantic_graph';
import { DecoratorHandler, DetectResult } from './api';
export declare enum TraitState {
    /**
     * Pending traits are freshly created and have never been analyzed.
     */
    Pending = 0,
    /**
     * Analyzed traits have successfully been analyzed, but are pending resolution.
     */
    Analyzed = 1,
    /**
     * Resolved traits have successfully been analyzed and resolved and are ready for compilation.
     */
    Resolved = 2,
    /**
     * Skipped traits are no longer considered for compilation.
     */
    Skipped = 3
}
/**
 * An Ivy aspect added to a class (for example, the compilation of a component definition).
 *
 * Traits are created when a `DecoratorHandler` matches a class. Each trait begins in a pending
 * state and undergoes transitions as compilation proceeds through the various steps.
 *
 * In practice, traits are instances of the private class `TraitImpl` declared below. Through the
 * various interfaces included in this union type, the legal API of a trait in any given state is
 * represented in the type system. This includes any possible transitions from one type to the next.
 *
 * This not only simplifies the implementation, but ensures traits are monomorphic objects as
 * they're all just "views" in the type system of the same object (which never changes shape).
 */
export declare type Trait<D, A, S extends SemanticSymbol | null, R> = PendingTrait<D, A, S, R> | SkippedTrait<D, A, S, R> | AnalyzedTrait<D, A, S, R> | ResolvedTrait<D, A, S, R>;
/**
 * The value side of `Trait` exposes a helper to create a `Trait` in a pending state (by delegating
 * to `TraitImpl`).
 */
export declare const Trait: {
    pending: <D, A, S extends SemanticSymbol | null, R>(handler: DecoratorHandler<D, A, S, R>, detected: DetectResult<D>) => PendingTrait<D, A, S, R>;
};
/**
 * The part of the `Trait` interface that's common to all trait states.
 */
export interface TraitBase<D, A, S extends SemanticSymbol | null, R> {
    /**
     * Current state of the trait.
     *
     * This will be narrowed in the interfaces for each specific state.
     */
    state: TraitState;
    /**
     * The `DecoratorHandler` which matched on the class to create this trait.
     */
    handler: DecoratorHandler<D, A, S, R>;
    /**
     * The detection result (of `handler.detect`) which indicated that this trait applied to the
     * class.
     *
     * This is mainly used to cache the detection between pre-analysis and analysis.
     */
    detected: DetectResult<D>;
}
/**
 * A trait in the pending state.
 *
 * Pending traits have yet to be analyzed in any way.
 */
export interface PendingTrait<D, A, S extends SemanticSymbol | null, R> extends TraitBase<D, A, S, R> {
    state: TraitState.Pending;
    /**
     * This pending trait has been successfully analyzed, and should transition to the "analyzed"
     * state.
     */
    toAnalyzed(analysis: A | null, diagnostics: ts.Diagnostic[] | null, symbol: S): AnalyzedTrait<D, A, S, R>;
    /**
     * During analysis it was determined that this trait is not eligible for compilation after all,
     * and should be transitioned to the "skipped" state.
     */
    toSkipped(): SkippedTrait<D, A, S, R>;
}
/**
 * A trait in the "skipped" state.
 *
 * Skipped traits aren't considered for compilation.
 *
 * This is a terminal state.
 */
export interface SkippedTrait<D, A, S extends SemanticSymbol | null, R> extends TraitBase<D, A, S, R> {
    state: TraitState.Skipped;
}
/**
 * A trait in the "analyzed" state.
 *
 * Analyzed traits have analysis results available, and are eligible for resolution.
 */
export interface AnalyzedTrait<D, A, S extends SemanticSymbol | null, R> extends TraitBase<D, A, S, R> {
    state: TraitState.Analyzed;
    symbol: S;
    /**
     * Analysis results of the given trait (if able to be produced), or `null` if analysis failed
     * completely.
     */
    analysis: Readonly<A> | null;
    /**
     * Any diagnostics that resulted from analysis, or `null` if none.
     */
    analysisDiagnostics: ts.Diagnostic[] | null;
    /**
     * This analyzed trait has been successfully resolved, and should be transitioned to the
     * "resolved" state.
     */
    toResolved(resolution: R | null, diagnostics: ts.Diagnostic[] | null): ResolvedTrait<D, A, S, R>;
}
/**
 * A trait in the "resolved" state.
 *
 * Resolved traits have been successfully analyzed and resolved, contain no errors, and are ready
 * for the compilation phase.
 *
 * This is a terminal state.
 */
export interface ResolvedTrait<D, A, S extends SemanticSymbol | null, R> extends TraitBase<D, A, S, R> {
    state: TraitState.Resolved;
    symbol: S;
    /**
     * Resolved traits must have produced valid analysis results.
     */
    analysis: Readonly<A>;
    /**
     * Analysis may have still resulted in diagnostics.
     */
    analysisDiagnostics: ts.Diagnostic[] | null;
    /**
     * Diagnostics resulting from resolution are tracked separately from
     */
    resolveDiagnostics: ts.Diagnostic[] | null;
    /**
     * The results returned by a successful resolution of the given class/`DecoratorHandler`
     * combination.
     */
    resolution: Readonly<R> | null;
}
