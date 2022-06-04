/// <amd-module name="@angular/compiler-cli/linker/src/file_linker/partial_linkers/partial_ng_module_linker_1" />
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { ConstantPool, outputAst as o, R3DeclareNgModuleMetadata, R3NgModuleMetadata, R3PartialDeclaration } from '@angular/compiler';
import { AstObject } from '../../ast/ast_value';
import { PartialLinker } from './partial_linker';
/**
 * A `PartialLinker` that is designed to process `ɵɵngDeclareNgModule()` call expressions.
 */
export declare class PartialNgModuleLinkerVersion1<TExpression> implements PartialLinker<TExpression> {
    /**
     * If true then emit the additional declarations, imports, exports, etc in the NgModule
     * definition. These are only used by JIT compilation.
     */
    private emitInline;
    constructor(
    /**
     * If true then emit the additional declarations, imports, exports, etc in the NgModule
     * definition. These are only used by JIT compilation.
     */
    emitInline: boolean);
    linkPartialDeclaration(constantPool: ConstantPool, metaObj: AstObject<R3PartialDeclaration, TExpression>): o.Expression;
}
/**
 * Derives the `R3NgModuleMetadata` structure from the AST object.
 */
export declare function toR3NgModuleMeta<TExpression>(metaObj: AstObject<R3DeclareNgModuleMetadata, TExpression>, emitInline: boolean): R3NgModuleMetadata;
