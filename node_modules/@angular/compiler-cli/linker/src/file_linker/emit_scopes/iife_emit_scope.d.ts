/// <amd-module name="@angular/compiler-cli/linker/src/file_linker/emit_scopes/iife_emit_scope" />
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { outputAst as o } from '@angular/compiler';
import { AstFactory } from '../../../../src/ngtsc/translator';
import { Translator } from '../translator';
import { EmitScope } from './emit_scope';
/**
 * This class is a specialization of the `EmitScope` class that is designed for the situation where
 * there is no clear shared scope for constant statements. In this case they are bundled with the
 * translated definition inside an IIFE.
 */
export declare class IifeEmitScope<TStatement, TExpression> extends EmitScope<TStatement, TExpression> {
    private readonly factory;
    constructor(ngImport: TExpression, translator: Translator<TStatement, TExpression>, factory: AstFactory<TStatement, TExpression>);
    /**
     * Translate the given Output AST definition expression into a generic `TExpression`.
     *
     * Wraps the output from `EmitScope.translateDefinition()` and `EmitScope.getConstantStatements()`
     * in an IIFE.
     */
    translateDefinition(definition: o.Expression): TExpression;
    /**
     * It is not valid to call this method, since there will be no shared constant statements - they
     * are already emitted in the IIFE alongside the translated definition.
     */
    getConstantStatements(): TStatement[];
}
