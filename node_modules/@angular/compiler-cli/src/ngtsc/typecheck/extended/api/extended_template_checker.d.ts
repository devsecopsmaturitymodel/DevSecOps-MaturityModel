/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/// <amd-module name="@angular/compiler-cli/src/ngtsc/typecheck/extended/api/extended_template_checker" />
import ts from 'typescript';
import { TemplateDiagnostic } from '../../api';
/**
 * Interface to generate extended template diangostics from the component tempaltes.
 */
export interface ExtendedTemplateChecker {
    /**
     * Run `TemplateCheck`s for a component and return the generated `ts.Diagnostic`s.
     */
    getDiagnosticsForComponent(component: ts.ClassDeclaration): TemplateDiagnostic[];
}
