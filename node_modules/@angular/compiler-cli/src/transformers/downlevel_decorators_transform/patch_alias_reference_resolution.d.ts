/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/// <amd-module name="@angular/compiler-cli/src/transformers/downlevel_decorators_transform/patch_alias_reference_resolution" />
import ts from 'typescript';
/**
 * Gets whether a given node corresponds to an import alias declaration. Alias
 * declarations can be import specifiers, namespace imports or import clauses
 * as these do not declare an actual symbol but just point to a target declaration.
 */
export declare function isAliasImportDeclaration(node: ts.Node): node is ts.ImportSpecifier | ts.NamespaceImport | ts.ImportClause;
