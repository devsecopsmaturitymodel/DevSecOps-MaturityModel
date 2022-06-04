/// <amd-module name="@angular/compiler-cli/linker/src/file_linker/partial_linkers/partial_injectable_linker_1" />
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { ConstantPool, outputAst as o, R3DeclareInjectableMetadata, R3InjectableMetadata, R3PartialDeclaration } from '@angular/compiler';
import { AstObject } from '../../ast/ast_value';
import { PartialLinker } from './partial_linker';
/**
 * A `PartialLinker` that is designed to process `ɵɵngDeclareInjectable()` call expressions.
 */
export declare class PartialInjectableLinkerVersion1<TExpression> implements PartialLinker<TExpression> {
    linkPartialDeclaration(constantPool: ConstantPool, metaObj: AstObject<R3PartialDeclaration, TExpression>): o.Expression;
}
/**
 * Derives the `R3InjectableMetadata` structure from the AST object.
 */
export declare function toR3InjectableMeta<TExpression>(metaObj: AstObject<R3DeclareInjectableMetadata, TExpression>): R3InjectableMetadata;
