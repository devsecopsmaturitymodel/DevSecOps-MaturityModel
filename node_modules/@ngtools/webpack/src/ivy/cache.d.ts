/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import * as ts from 'typescript';
export declare class SourceFileCache extends Map<string, ts.SourceFile> {
    private readonly angularDiagnostics;
    invalidate(file: string): void;
    updateAngularDiagnostics(sourceFile: ts.SourceFile, diagnostics: ts.Diagnostic[]): void;
    getAngularDiagnostics(sourceFile: ts.SourceFile): ts.Diagnostic[] | undefined;
}
