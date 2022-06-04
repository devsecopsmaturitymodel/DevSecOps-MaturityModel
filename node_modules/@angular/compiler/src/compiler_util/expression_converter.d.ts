/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import * as cdAst from '../expression_parser/ast';
import * as o from '../output/output_ast';
import { ParseSourceSpan } from '../parse_util';
export declare class EventHandlerVars {
    static event: o.ReadVarExpr;
}
export interface LocalResolver {
    getLocal(name: string): o.Expression | null;
    notifyImplicitReceiverUse(): void;
    globals?: Set<string>;
    maybeRestoreView(): void;
}
/**
 * Converts the given expression AST into an executable output AST, assuming the expression is
 * used in an action binding (e.g. an event handler).
 */
export declare function convertActionBinding(localResolver: LocalResolver | null, implicitReceiver: o.Expression, action: cdAst.AST, bindingId: string, baseSourceSpan?: ParseSourceSpan, implicitReceiverAccesses?: Set<string>, globals?: Set<string>): o.Statement[];
export interface BuiltinConverter {
    (args: o.Expression[]): o.Expression;
}
export interface BuiltinConverterFactory {
    createLiteralArrayConverter(argCount: number): BuiltinConverter;
    createLiteralMapConverter(keys: {
        key: string;
        quoted: boolean;
    }[]): BuiltinConverter;
    createPipeConverter(name: string, argCount: number): BuiltinConverter;
}
export declare function convertPropertyBindingBuiltins(converterFactory: BuiltinConverterFactory, ast: cdAst.AST): cdAst.AST;
export declare class ConvertPropertyBindingResult {
    stmts: o.Statement[];
    currValExpr: o.Expression;
    constructor(stmts: o.Statement[], currValExpr: o.Expression);
}
/**
 * Converts the given expression AST into an executable output AST, assuming the expression
 * is used in property binding. The expression has to be preprocessed via
 * `convertPropertyBindingBuiltins`.
 */
export declare function convertPropertyBinding(localResolver: LocalResolver | null, implicitReceiver: o.Expression, expressionWithoutBuiltins: cdAst.AST, bindingId: string): ConvertPropertyBindingResult;
/**
 * Given some expression, such as a binding or interpolation expression, and a context expression to
 * look values up on, visit each facet of the given expression resolving values from the context
 * expression such that a list of arguments can be derived from the found values that can be used as
 * arguments to an external update instruction.
 *
 * @param localResolver The resolver to use to look up expressions by name appropriately
 * @param contextVariableExpression The expression representing the context variable used to create
 * the final argument expressions
 * @param expressionWithArgumentsToExtract The expression to visit to figure out what values need to
 * be resolved and what arguments list to build.
 * @param bindingId A name prefix used to create temporary variable names if they're needed for the
 * arguments generated
 * @returns An array of expressions that can be passed as arguments to instruction expressions like
 * `o.importExpr(R3.propertyInterpolate).callFn(result)`
 */
export declare function convertUpdateArguments(localResolver: LocalResolver, contextVariableExpression: o.Expression, expressionWithArgumentsToExtract: cdAst.Interpolation, bindingId: string): {
    stmts: o.Statement[];
    args: o.Expression[];
};
export declare class BuiltinFunctionCall extends cdAst.Call {
    converter: BuiltinConverter;
    constructor(span: cdAst.ParseSpan, sourceSpan: cdAst.AbsoluteSourceSpan, args: cdAst.AST[], converter: BuiltinConverter);
}
