/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/// <amd-module name="@angular/compiler-cli/src/ngtsc/partial_evaluator/src/diagnostics" />
import ts from 'typescript';
import { DynamicValue } from './dynamic';
import { ResolvedValue } from './result';
/**
 * Derives a type representation from a resolved value to be reported in a diagnostic.
 *
 * @param value The resolved value for which a type representation should be derived.
 * @param maxDepth The maximum nesting depth of objects and arrays, defaults to 1 level.
 */
export declare function describeResolvedType(value: ResolvedValue, maxDepth?: number): string;
/**
 * Creates an array of related information diagnostics for a `DynamicValue` that describe the trace
 * of why an expression was evaluated as dynamic.
 *
 * @param node The node for which a `ts.Diagnostic` is to be created with the trace.
 * @param value The dynamic value for which a trace should be created.
 */
export declare function traceDynamicValue(node: ts.Node, value: DynamicValue): ts.DiagnosticRelatedInformation[];
