/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { AbstractEmitterVisitor, EmitterVisitorContext } from './abstract_emitter';
import * as o from './output_ast';
export declare abstract class AbstractJsEmitterVisitor extends AbstractEmitterVisitor {
    constructor();
    visitWrappedNodeExpr(ast: o.WrappedNodeExpr<any>, ctx: EmitterVisitorContext): any;
    visitDeclareVarStmt(stmt: o.DeclareVarStmt, ctx: EmitterVisitorContext): any;
    visitTaggedTemplateExpr(ast: o.TaggedTemplateExpr, ctx: EmitterVisitorContext): any;
    visitFunctionExpr(ast: o.FunctionExpr, ctx: EmitterVisitorContext): any;
    visitDeclareFunctionStmt(stmt: o.DeclareFunctionStmt, ctx: EmitterVisitorContext): any;
    visitLocalizedString(ast: o.LocalizedString, ctx: EmitterVisitorContext): any;
    private _visitParams;
}
