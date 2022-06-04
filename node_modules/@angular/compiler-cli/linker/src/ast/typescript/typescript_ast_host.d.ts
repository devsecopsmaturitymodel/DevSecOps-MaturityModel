/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/// <amd-module name="@angular/compiler-cli/linker/src/ast/typescript/typescript_ast_host" />
import ts from 'typescript';
import { AstHost, Range } from '../ast_host';
/**
 * This implementation of `AstHost` is able to get information from TypeScript AST nodes.
 *
 * This host is not actually used at runtime in the current code.
 *
 * It is implemented here to ensure that the `AstHost` abstraction is not unfairly skewed towards
 * the Babel implementation. It could also provide a basis for a 3rd TypeScript compiler plugin to
 * do linking in the future.
 */
export declare class TypeScriptAstHost implements AstHost<ts.Expression> {
    getSymbolName(node: ts.Expression): string | null;
    isStringLiteral: typeof ts.isStringLiteral;
    parseStringLiteral(str: ts.Expression): string;
    isNumericLiteral: typeof ts.isNumericLiteral;
    parseNumericLiteral(num: ts.Expression): number;
    isBooleanLiteral(node: ts.Expression): boolean;
    parseBooleanLiteral(bool: ts.Expression): boolean;
    isArrayLiteral: typeof ts.isArrayLiteralExpression;
    parseArrayLiteral(array: ts.Expression): ts.Expression[];
    isObjectLiteral: typeof ts.isObjectLiteralExpression;
    parseObjectLiteral(obj: ts.Expression): Map<string, ts.Expression>;
    isFunctionExpression(node: ts.Expression): node is ts.FunctionExpression | ts.ArrowFunction;
    parseReturnValue(fn: ts.Expression): ts.Expression;
    isCallExpression: typeof ts.isCallExpression;
    parseCallee(call: ts.Expression): ts.Expression;
    parseArguments(call: ts.Expression): ts.Expression[];
    getRange(node: ts.Expression): Range;
}
