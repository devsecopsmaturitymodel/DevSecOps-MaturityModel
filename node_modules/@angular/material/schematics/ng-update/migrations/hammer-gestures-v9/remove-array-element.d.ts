/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { UpdateRecorder } from '@angular-devkit/schematics';
import * as ts from 'typescript';
/**
 * Retrieves the parent syntax list of the given node. A syntax list node is usually
 * hidden from the default AST node hierarchy because it only contains information that
 * is need when printing a node. e.g. it contains information about comma positions in
 * an array literal expression.
 */
export declare function getParentSyntaxList(node: ts.Node): ts.SyntaxList | null;
/** Removes a given element from its parent array literal expression. */
export declare function removeElementFromArrayExpression(element: ts.Node, recorder: UpdateRecorder): void;
