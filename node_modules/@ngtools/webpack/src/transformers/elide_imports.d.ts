/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import * as ts from 'typescript';
export declare function elideImports(sourceFile: ts.SourceFile, removedNodes: ts.Node[], getTypeChecker: () => ts.TypeChecker, compilerOptions: ts.CompilerOptions): Set<ts.Node>;
