/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/// <amd-module name="@angular/compiler-cli/src/ngtsc/shims/src/util" />
import { AbsoluteFsPath } from '../../file_system';
/**
 * Replace the .ts or .tsx extension of a file with the shim filename suffix.
 */
export declare function makeShimFileName(fileName: AbsoluteFsPath, suffix: string): AbsoluteFsPath;
export declare function generatedModuleName(originalModuleName: string, originalFileName: string, genSuffix: string): string;
