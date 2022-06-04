/// <amd-module name="@angular/compiler-cli/src/ngtsc/incremental/semantic_graph/src/util" />
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { SemanticReference, SemanticSymbol } from './api';
/**
 * Determines whether the provided symbols represent the same declaration.
 */
export declare function isSymbolEqual(a: SemanticSymbol, b: SemanticSymbol): boolean;
/**
 * Determines whether the provided references to a semantic symbol are still equal, i.e. represent
 * the same symbol and are imported by the same path.
 */
export declare function isReferenceEqual(a: SemanticReference, b: SemanticReference): boolean;
export declare function referenceEquality<T>(a: T, b: T): boolean;
/**
 * Determines if the provided arrays are equal to each other, using the provided equality tester
 * that is called for all entries in the array.
 */
export declare function isArrayEqual<T>(a: readonly T[] | null, b: readonly T[] | null, equalityTester?: (a: T, b: T) => boolean): boolean;
/**
 * Determines if the provided sets are equal to each other, using the provided equality tester.
 * Sets that only differ in ordering are considered equal.
 */
export declare function isSetEqual<T>(a: ReadonlySet<T> | null, b: ReadonlySet<T> | null, equalityTester?: (a: T, b: T) => boolean): boolean;
