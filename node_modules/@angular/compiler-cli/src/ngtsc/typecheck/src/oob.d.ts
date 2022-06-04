/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/// <amd-module name="@angular/compiler-cli/src/ngtsc/typecheck/src/oob" />
import { BindingPipe, PropertyWrite, TmplAstBoundAttribute, TmplAstBoundEvent, TmplAstElement, TmplAstReference, TmplAstVariable } from '@angular/compiler';
import { ClassDeclaration } from '../../reflection';
import { TemplateDiagnostic, TemplateId } from '../api';
import { TemplateSourceResolver } from './tcb_util';
/**
 * Collects `ts.Diagnostic`s on problems which occur in the template which aren't directly sourced
 * from Type Check Blocks.
 *
 * During the creation of a Type Check Block, the template is traversed and the
 * `OutOfBandDiagnosticRecorder` is called to record cases when a correct interpretation for the
 * template cannot be found. These operations create `ts.Diagnostic`s which are stored by the
 * recorder for later display.
 */
export interface OutOfBandDiagnosticRecorder {
    readonly diagnostics: ReadonlyArray<TemplateDiagnostic>;
    /**
     * Reports a `#ref="target"` expression in the template for which a target directive could not be
     * found.
     *
     * @param templateId the template type-checking ID of the template which contains the broken
     * reference.
     * @param ref the `TmplAstReference` which could not be matched to a directive.
     */
    missingReferenceTarget(templateId: TemplateId, ref: TmplAstReference): void;
    /**
     * Reports usage of a `| pipe` expression in the template for which the named pipe could not be
     * found.
     *
     * @param templateId the template type-checking ID of the template which contains the unknown
     * pipe.
     * @param ast the `BindingPipe` invocation of the pipe which could not be found.
     */
    missingPipe(templateId: TemplateId, ast: BindingPipe): void;
    illegalAssignmentToTemplateVar(templateId: TemplateId, assignment: PropertyWrite, target: TmplAstVariable): void;
    /**
     * Reports a duplicate declaration of a template variable.
     *
     * @param templateId the template type-checking ID of the template which contains the duplicate
     * declaration.
     * @param variable the `TmplAstVariable` which duplicates a previously declared variable.
     * @param firstDecl the first variable declaration which uses the same name as `variable`.
     */
    duplicateTemplateVar(templateId: TemplateId, variable: TmplAstVariable, firstDecl: TmplAstVariable): void;
    requiresInlineTcb(templateId: TemplateId, node: ClassDeclaration): void;
    requiresInlineTypeConstructors(templateId: TemplateId, node: ClassDeclaration, directives: ClassDeclaration[]): void;
    /**
     * Report a warning when structural directives support context guards, but the current
     * type-checking configuration prohibits their usage.
     */
    suboptimalTypeInference(templateId: TemplateId, variables: TmplAstVariable[]): void;
    /**
     * Reports a split two way binding error message.
     */
    splitTwoWayBinding(templateId: TemplateId, input: TmplAstBoundAttribute, output: TmplAstBoundEvent, inputConsumer: ClassDeclaration, outputConsumer: ClassDeclaration | TmplAstElement): void;
}
export declare class OutOfBandDiagnosticRecorderImpl implements OutOfBandDiagnosticRecorder {
    private resolver;
    private _diagnostics;
    /**
     * Tracks which `BindingPipe` nodes have already been recorded as invalid, so only one diagnostic
     * is ever produced per node.
     */
    private recordedPipes;
    constructor(resolver: TemplateSourceResolver);
    get diagnostics(): ReadonlyArray<TemplateDiagnostic>;
    missingReferenceTarget(templateId: TemplateId, ref: TmplAstReference): void;
    missingPipe(templateId: TemplateId, ast: BindingPipe): void;
    illegalAssignmentToTemplateVar(templateId: TemplateId, assignment: PropertyWrite, target: TmplAstVariable): void;
    duplicateTemplateVar(templateId: TemplateId, variable: TmplAstVariable, firstDecl: TmplAstVariable): void;
    requiresInlineTcb(templateId: TemplateId, node: ClassDeclaration): void;
    requiresInlineTypeConstructors(templateId: TemplateId, node: ClassDeclaration, directives: ClassDeclaration[]): void;
    suboptimalTypeInference(templateId: TemplateId, variables: TmplAstVariable[]): void;
    splitTwoWayBinding(templateId: TemplateId, input: TmplAstBoundAttribute, output: TmplAstBoundEvent, inputConsumer: ClassDeclaration, outputConsumer: ClassDeclaration | TmplAstElement): void;
}
