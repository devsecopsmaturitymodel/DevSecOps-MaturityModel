/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/// <amd-module name="@angular/compiler-cli/src/ngtsc/partial_evaluator/src/ts_helpers" />
import ts from 'typescript';
import { ObjectAssignBuiltinFn } from './builtin';
import { KnownFn, ResolvedValue, ResolvedValueArray } from './result';
export declare class AssignHelperFn extends ObjectAssignBuiltinFn {
}
export declare class SpreadHelperFn extends KnownFn {
    evaluate(node: ts.Node, args: ResolvedValueArray): ResolvedValueArray;
}
export declare class SpreadArrayHelperFn extends KnownFn {
    evaluate(node: ts.Node, args: ResolvedValueArray): ResolvedValue;
}
export declare class ReadHelperFn extends KnownFn {
    evaluate(node: ts.Node, args: ResolvedValueArray): ResolvedValue;
}
