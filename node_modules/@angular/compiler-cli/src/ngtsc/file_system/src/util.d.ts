/// <amd-module name="@angular/compiler-cli/src/ngtsc/file_system/src/util" />
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import ts from 'typescript';
import { AbsoluteFsPath, PathString } from './types';
/**
 * Convert Windows-style separators to POSIX separators.
 */
export declare function normalizeSeparators(path: string): string;
/**
 * Remove a .ts, .d.ts, or .js extension from a file name.
 */
export declare function stripExtension<T extends PathString>(path: T): T;
export declare function getSourceFileOrError(program: ts.Program, fileName: AbsoluteFsPath): ts.SourceFile;
