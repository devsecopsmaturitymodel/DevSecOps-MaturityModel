/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/// <amd-module name="@angular/core/schematics/migrations/router-link-empty-expression/angular/html_routerlink_empty_expr_visitor" />
import type { TmplAstBoundAttribute, TmplAstElement, TmplAstTemplate } from '@angular/compiler';
import { TemplateAstVisitor } from '../../../utils/template_ast_visitor';
/**
 * HTML AST visitor that traverses the Render3 HTML AST in order to find all
 * undefined routerLink asssignment ([routerLink]="").
 */
export declare class RouterLinkEmptyExprVisitor extends TemplateAstVisitor {
    readonly emptyRouterLinkExpressions: TmplAstBoundAttribute[];
    visitElement(element: TmplAstElement): void;
    visitTemplate(t: TmplAstTemplate): void;
    visitBoundAttribute(node: TmplAstBoundAttribute): void;
}
