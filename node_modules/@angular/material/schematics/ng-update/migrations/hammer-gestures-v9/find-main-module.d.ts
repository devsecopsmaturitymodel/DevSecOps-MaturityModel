/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import * as ts from 'typescript';
/**
 * Finds the main Angular module within the specified source file. The first module
 * that is part of the "bootstrapModule" expression is returned.
 */
export declare function findMainModuleExpression(mainSourceFile: ts.SourceFile): ts.Expression | null;
