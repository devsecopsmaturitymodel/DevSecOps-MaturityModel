/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/// <amd-module name="@angular/compiler-cli/src/ngtsc/typecheck/extended/api/api" />
import { AST, ParseSourceSpan, TmplAstNode } from '@angular/compiler';
import ts from 'typescript';
import { NgCompilerOptions } from '../../../core/api';
import { ErrorCode, ExtendedTemplateDiagnosticName } from '../../../diagnostics';
import { NgTemplateDiagnostic, TemplateTypeChecker } from '../../api';
/**
 * A Template Check receives information about the template it's checking and returns
 * information about the diagnostics to be generated.
 */
export interface TemplateCheck<Code extends ErrorCode> {
    /** Unique template check code, used for configuration and searching the error. */
    code: Code;
    /** Runs check and returns information about the diagnostics to be generated. */
    run(ctx: TemplateContext<Code>, component: ts.ClassDeclaration, template: TmplAstNode[]): NgTemplateDiagnostic<Code>[];
}
/**
 * The TemplateContext provided to a Template Check to get diagnostic information.
 */
export interface TemplateContext<Code extends ErrorCode> {
    /** Interface that provides information about template nodes. */
    templateTypeChecker: TemplateTypeChecker;
    /**
     * TypeScript interface that provides type information about symbols that appear
     * in the template (it is not to query types outside the Angular component).
     */
    typeChecker: ts.TypeChecker;
    /**
     * Creates a template diagnostic with the given information for the template being processed and
     * using the diagnostic category configured for the extended template diagnostic.
     */
    makeTemplateDiagnostic(sourceSpan: ParseSourceSpan, message: string, relatedInformation?: {
        text: string;
        start: number;
        end: number;
        sourceFile: ts.SourceFile;
    }[]): NgTemplateDiagnostic<Code>;
}
/**
 * A factory which creates a template check for a particular code and name. This binds the two
 * together and associates them with a specific `TemplateCheck`.
 */
export interface TemplateCheckFactory<Code extends ErrorCode, Name extends ExtendedTemplateDiagnosticName> {
    code: Code;
    name: Name;
    create(options: NgCompilerOptions): TemplateCheck<Code> | null;
}
/**
 * This abstract class provides a base implementation for the run method.
 */
export declare abstract class TemplateCheckWithVisitor<Code extends ErrorCode> implements TemplateCheck<Code> {
    abstract code: Code;
    /**
     * Base implementation for run function, visits all nodes in template and calls
     * `visitNode()` for each one.
     */
    run(ctx: TemplateContext<Code>, component: ts.ClassDeclaration, template: TmplAstNode[]): NgTemplateDiagnostic<Code>[];
    /**
     * Visit a TmplAstNode or AST node of the template. Authors should override this
     * method to implement the check and return diagnostics.
     */
    abstract visitNode(ctx: TemplateContext<Code>, component: ts.ClassDeclaration, node: TmplAstNode | AST): NgTemplateDiagnostic<Code>[];
}
