/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/// <amd-module name="@angular/compiler-cli/src/transformers/i18n" />
import { MessageBundle } from '@angular/compiler';
import ts from 'typescript';
import { CompilerOptions } from './api';
export declare function i18nGetExtension(formatName: string): string;
export declare function i18nExtract(formatName: string | null, outFile: string | null, host: ts.CompilerHost, options: CompilerOptions, bundle: MessageBundle, pathResolve?: (...segments: string[]) => string): string[];
export declare function i18nSerialize(bundle: MessageBundle, formatName: string, options: CompilerOptions): string;
