/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import * as ts from 'typescript';
export declare function createAotTransformers(builder: ts.BuilderProgram, options: {
    emitClassMetadata?: boolean;
    emitNgModuleScope?: boolean;
}): ts.CustomTransformers;
export declare function createJitTransformers(builder: ts.BuilderProgram, compilerCli: typeof import('@angular/compiler-cli'), options: {
    inlineStyleFileExtension?: string;
}): ts.CustomTransformers;
export declare function mergeTransformers(first: ts.CustomTransformers, second: ts.CustomTransformers): ts.CustomTransformers;
export declare function replaceBootstrap(getTypeChecker: () => ts.TypeChecker): ts.TransformerFactory<ts.SourceFile>;
