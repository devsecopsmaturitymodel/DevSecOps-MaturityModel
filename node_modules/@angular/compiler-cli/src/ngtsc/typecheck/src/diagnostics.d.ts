/// <amd-module name="@angular/compiler-cli/src/ngtsc/typecheck/src/diagnostics" />
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { AbsoluteSourceSpan, ParseSourceSpan } from '@angular/compiler';
import ts from 'typescript';
import { TemplateDiagnostic, TemplateId } from '../api';
import { TemplateSourceResolver } from './tcb_util';
/**
 * Wraps the node in parenthesis such that inserted span comments become attached to the proper
 * node. This is an alias for `ts.createParen` with the benefit that it signifies that the
 * inserted parenthesis are for diagnostic purposes, not for correctness of the rendered TCB code.
 *
 * Note that it is important that nodes and its attached comment are not wrapped into parenthesis
 * by default, as it prevents correct translation of e.g. diagnostics produced for incorrect method
 * arguments. Such diagnostics would then be produced for the parenthesised node whereas the
 * positional comment would be located within that node, resulting in a mismatch.
 */
export declare function wrapForDiagnostics(expr: ts.Expression): ts.Expression;
/**
 * Wraps the node in parenthesis such that inserted span comments become attached to the proper
 * node. This is an alias for `ts.createParen` with the benefit that it signifies that the
 * inserted parenthesis are for use by the type checker, not for correctness of the rendered TCB
 * code.
 */
export declare function wrapForTypeChecker(expr: ts.Expression): ts.Expression;
/**
 * Adds a synthetic comment to the expression that represents the parse span of the provided node.
 * This comment can later be retrieved as trivia of a node to recover original source locations.
 */
export declare function addParseSpanInfo(node: ts.Node, span: AbsoluteSourceSpan | ParseSourceSpan): void;
/**
 * Adds a synthetic comment to the function declaration that contains the template id
 * of the class declaration.
 */
export declare function addTemplateId(tcb: ts.FunctionDeclaration, id: TemplateId): void;
/**
 * Determines if the diagnostic should be reported. Some diagnostics are produced because of the
 * way TCBs are generated; those diagnostics should not be reported as type check errors of the
 * template.
 */
export declare function shouldReportDiagnostic(diagnostic: ts.Diagnostic): boolean;
/**
 * Attempts to translate a TypeScript diagnostic produced during template type-checking to their
 * location of origin, based on the comments that are emitted in the TCB code.
 *
 * If the diagnostic could not be translated, `null` is returned to indicate that the diagnostic
 * should not be reported at all. This prevents diagnostics from non-TCB code in a user's source
 * file from being reported as type-check errors.
 */
export declare function translateDiagnostic(diagnostic: ts.Diagnostic, resolver: TemplateSourceResolver): TemplateDiagnostic | null;
