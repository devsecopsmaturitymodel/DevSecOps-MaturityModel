/// <amd-module name="@angular/compiler-cli/linker/src/file_linker/translator" />
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import * as o from '@angular/compiler';
import { AstFactory, ImportGenerator, TranslatorOptions } from '../../../src/ngtsc/translator';
/**
 * Generic translator helper class, which exposes methods for translating expressions and
 * statements.
 */
export declare class Translator<TStatement, TExpression> {
    private factory;
    constructor(factory: AstFactory<TStatement, TExpression>);
    /**
     * Translate the given output AST in the context of an expression.
     */
    translateExpression(expression: o.Expression, imports: ImportGenerator<TExpression>, options?: TranslatorOptions<TExpression>): TExpression;
    /**
     * Translate the given output AST in the context of a statement.
     */
    translateStatement(statement: o.Statement, imports: ImportGenerator<TExpression>, options?: TranslatorOptions<TExpression>): TStatement;
}
