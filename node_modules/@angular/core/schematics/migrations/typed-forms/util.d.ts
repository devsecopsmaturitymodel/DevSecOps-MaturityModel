/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/// <amd-module name="@angular/core/schematics/migrations/typed-forms/util" />
import ts from 'typescript';
export declare const controlClassNames: string[];
export declare const builderMethodNames: string[];
export declare const anySymbolName = "AnyForUntypedForms";
export interface MigratableNode {
    node: ts.Expression;
    generic: string;
}
export declare function getControlClassImports(sourceFile: ts.SourceFile): (ts.ImportSpecifier | null)[];
export declare function getFormBuilderImport(sourceFile: ts.SourceFile): ts.ImportSpecifier | null;
export declare function getAnyImport(sourceFile: ts.SourceFile): ts.ImportSpecifier | null;
export declare function findControlClassUsages(sourceFile: ts.SourceFile, typeChecker: ts.TypeChecker, importSpecifier: ts.ImportSpecifier | null): MigratableNode[];
export declare function findFormBuilderCalls(sourceFile: ts.SourceFile, typeChecker: ts.TypeChecker, importSpecifier: ts.ImportSpecifier | null): MigratableNode[];
