/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/// <amd-module name="@angular/core/schematics/utils/typescript/nodes" />
import ts from 'typescript';
/** Checks whether the given TypeScript node has the specified modifier set. */
export declare function hasModifier(node: ts.Node, modifierKind: ts.SyntaxKind): boolean;
/** Find the closest parent node of a particular kind. */
export declare function closestNode<T extends ts.Node>(node: ts.Node, kind: ts.SyntaxKind): T | null;
/**
 * Checks whether a particular node is part of a null check. E.g. given:
 * `foo.bar ? foo.bar.value : null` the null check would be `foo.bar`.
 */
export declare function isNullCheck(node: ts.Node): boolean;
/** Checks whether a property access is safe (e.g. `foo.parent?.value`). */
export declare function isSafeAccess(node: ts.Node): boolean;
