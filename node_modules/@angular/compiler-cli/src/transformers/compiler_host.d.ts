/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/// <amd-module name="@angular/compiler-cli/src/transformers/compiler_host" />
import ts from 'typescript';
import { CompilerHost, CompilerOptions } from './api';
export declare function setWrapHostForTest(wrapFn: ((host: ts.CompilerHost) => ts.CompilerHost) | null): void;
export declare function createCompilerHost({ options, tsHost }: {
    options: CompilerOptions;
    tsHost?: ts.CompilerHost;
}): CompilerHost;
