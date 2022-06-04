/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/// <amd-module name="@angular/core/schematics/utils/typescript/symbol" />
import ts from 'typescript';
export declare function getValueSymbolOfDeclaration(node: ts.Node, typeChecker: ts.TypeChecker): ts.Symbol | undefined;
/** Checks whether a node is referring to a specific import specifier. */
export declare function isReferenceToImport(typeChecker: ts.TypeChecker, node: ts.Node, importSpecifier: ts.ImportSpecifier): boolean;
/** Checks whether a node's type is nullable (`null`, `undefined` or `void`). */
export declare function isNullableType(typeChecker: ts.TypeChecker, node: ts.Node): boolean;
/**
 * Walks through the types and sub-types of a node, looking for a
 * type that has the same name as one of the passed-in ones.
 */
export declare function hasOneOfTypes(typeChecker: ts.TypeChecker, node: ts.Node, types: string[]): boolean;
