/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/// <amd-module name="@angular/compiler-cli/src/transformers/program" />
import { CompilerHost, CompilerOptions, Program } from './api';
export declare function createProgram({ rootNames, options, host, oldProgram }: {
    rootNames: ReadonlyArray<string>;
    options: CompilerOptions;
    host: CompilerHost;
    oldProgram?: Program;
}): Program;
