/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { Diagnostic } from 'typescript';
import type { Compilation } from 'webpack';
export declare type DiagnosticsReporter = (diagnostics: readonly Diagnostic[]) => void;
export declare function createDiagnosticsReporter(compilation: Compilation, formatter: (diagnostic: Diagnostic) => string): DiagnosticsReporter;
export declare function addWarning(compilation: Compilation, message: string): void;
export declare function addError(compilation: Compilation, message: string): void;
