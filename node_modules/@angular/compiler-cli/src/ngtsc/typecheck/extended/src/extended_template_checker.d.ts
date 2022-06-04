/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/// <amd-module name="@angular/compiler-cli/src/ngtsc/typecheck/extended/src/extended_template_checker" />
import ts from 'typescript';
import { NgCompilerOptions } from '../../../core/api';
import { ErrorCode, ExtendedTemplateDiagnosticName } from '../../../diagnostics';
import { TemplateDiagnostic, TemplateTypeChecker } from '../../api';
import { ExtendedTemplateChecker, TemplateCheckFactory } from '../api';
export declare class ExtendedTemplateCheckerImpl implements ExtendedTemplateChecker {
    private readonly partialCtx;
    private readonly templateChecks;
    constructor(templateTypeChecker: TemplateTypeChecker, typeChecker: ts.TypeChecker, templateCheckFactories: readonly TemplateCheckFactory<ErrorCode, ExtendedTemplateDiagnosticName>[], options: NgCompilerOptions);
    getDiagnosticsForComponent(component: ts.ClassDeclaration): TemplateDiagnostic[];
}
