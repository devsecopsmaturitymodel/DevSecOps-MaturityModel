/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/// <amd-module name="@angular/compiler-cli/src/ngtsc/diagnostics/src/error" />
import ts from 'typescript';
import { ErrorCode } from './error_code';
export declare class FatalDiagnosticError {
    readonly code: ErrorCode;
    readonly node: ts.Node;
    readonly message: string | ts.DiagnosticMessageChain;
    readonly relatedInformation?: ts.DiagnosticRelatedInformation[] | undefined;
    constructor(code: ErrorCode, node: ts.Node, message: string | ts.DiagnosticMessageChain, relatedInformation?: ts.DiagnosticRelatedInformation[] | undefined);
    toDiagnostic(): ts.DiagnosticWithLocation;
}
export declare function makeDiagnostic(code: ErrorCode, node: ts.Node, messageText: string | ts.DiagnosticMessageChain, relatedInformation?: ts.DiagnosticRelatedInformation[]): ts.DiagnosticWithLocation;
export declare function makeDiagnosticChain(messageText: string, next?: ts.DiagnosticMessageChain[]): ts.DiagnosticMessageChain;
export declare function makeRelatedInformation(node: ts.Node, messageText: string): ts.DiagnosticRelatedInformation;
export declare function isFatalDiagnosticError(err: any): err is FatalDiagnosticError;
