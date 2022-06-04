/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/// <amd-module name="@angular/compiler-cli/src/ngtsc/translator/src/type_translator" />
import * as o from '@angular/compiler';
import ts from 'typescript';
import { Context } from './context';
import { ImportManager } from './import_manager';
export declare function translateType(type: o.Type, imports: ImportManager): ts.TypeNode;
export declare class TypeTranslatorVisitor implements o.ExpressionVisitor, o.TypeVisitor {
    private imports;
    constructor(imports: ImportManager);
    visitBuiltinType(type: o.BuiltinType, context: Context): ts.KeywordTypeNode;
    visitExpressionType(type: o.ExpressionType, context: Context): ts.TypeNode;
    visitArrayType(type: o.ArrayType, context: Context): ts.ArrayTypeNode;
    visitMapType(type: o.MapType, context: Context): ts.TypeLiteralNode;
    visitReadVarExpr(ast: o.ReadVarExpr, context: Context): ts.TypeQueryNode;
    visitWriteVarExpr(expr: o.WriteVarExpr, context: Context): never;
    visitWriteKeyExpr(expr: o.WriteKeyExpr, context: Context): never;
    visitWritePropExpr(expr: o.WritePropExpr, context: Context): never;
    visitInvokeFunctionExpr(ast: o.InvokeFunctionExpr, context: Context): never;
    visitTaggedTemplateExpr(ast: o.TaggedTemplateExpr, context: Context): never;
    visitInstantiateExpr(ast: o.InstantiateExpr, context: Context): never;
    visitLiteralExpr(ast: o.LiteralExpr, context: Context): ts.TypeNode;
    visitLocalizedString(ast: o.LocalizedString, context: Context): never;
    visitExternalExpr(ast: o.ExternalExpr, context: Context): ts.EntityName | ts.TypeReferenceNode;
    visitConditionalExpr(ast: o.ConditionalExpr, context: Context): void;
    visitNotExpr(ast: o.NotExpr, context: Context): void;
    visitFunctionExpr(ast: o.FunctionExpr, context: Context): void;
    visitUnaryOperatorExpr(ast: o.UnaryOperatorExpr, context: Context): void;
    visitBinaryOperatorExpr(ast: o.BinaryOperatorExpr, context: Context): void;
    visitReadPropExpr(ast: o.ReadPropExpr, context: Context): void;
    visitReadKeyExpr(ast: o.ReadKeyExpr, context: Context): void;
    visitLiteralArrayExpr(ast: o.LiteralArrayExpr, context: Context): ts.TupleTypeNode;
    visitLiteralMapExpr(ast: o.LiteralMapExpr, context: Context): ts.TypeLiteralNode;
    visitCommaExpr(ast: o.CommaExpr, context: Context): void;
    visitWrappedNodeExpr(ast: o.WrappedNodeExpr<any>, context: Context): ts.TypeNode;
    visitTypeofExpr(ast: o.TypeofExpr, context: Context): ts.TypeQueryNode;
    private translateType;
    private translateExpression;
}
