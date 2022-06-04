/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/// <amd-module name="@angular/compiler-cli/src/transformers/util" />
import ts from 'typescript';
export declare const GENERATED_FILES: RegExp;
export declare function error(msg: string): never;
export declare function createMessageDiagnostic(messageText: string): ts.Diagnostic;
/**
 * Strip multiline comment start and end markers from the `commentText` string.
 *
 * This will also strip the JSDOC comment start marker (`/**`).
 */
export declare function stripComment(commentText: string): string;
