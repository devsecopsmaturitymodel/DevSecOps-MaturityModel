/// <amd-module name="@angular/compiler-cli/linker/src/file_linker/partial_linkers/partial_injector_linker_1" />
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { ConstantPool, outputAst as o, R3DeclareInjectorMetadata, R3InjectorMetadata, R3PartialDeclaration } from '@angular/compiler';
import { AstObject } from '../../ast/ast_value';
import { PartialLinker } from './partial_linker';
/**
 * A `PartialLinker` that is designed to process `ɵɵngDeclareInjector()` call expressions.
 */
export declare class PartialInjectorLinkerVersion1<TExpression> implements PartialLinker<TExpression> {
    linkPartialDeclaration(constantPool: ConstantPool, metaObj: AstObject<R3PartialDeclaration, TExpression>): o.Expression;
}
/**
 * Derives the `R3InjectorMetadata` structure from the AST object.
 */
export declare function toR3InjectorMeta<TExpression>(metaObj: AstObject<R3DeclareInjectorMetadata, TExpression>): R3InjectorMetadata;
