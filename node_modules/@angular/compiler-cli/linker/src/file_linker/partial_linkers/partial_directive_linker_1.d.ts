/// <amd-module name="@angular/compiler-cli/linker/src/file_linker/partial_linkers/partial_directive_linker_1" />
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { ConstantPool, outputAst as o, ParseSourceSpan, R3DeclareDirectiveMetadata, R3DirectiveMetadata, R3PartialDeclaration } from '@angular/compiler';
import { AbsoluteFsPath } from '../../../../src/ngtsc/file_system';
import { Range } from '../../ast/ast_host';
import { AstObject } from '../../ast/ast_value';
import { PartialLinker } from './partial_linker';
/**
 * A `PartialLinker` that is designed to process `ɵɵngDeclareDirective()` call expressions.
 */
export declare class PartialDirectiveLinkerVersion1<TExpression> implements PartialLinker<TExpression> {
    private sourceUrl;
    private code;
    constructor(sourceUrl: AbsoluteFsPath, code: string);
    linkPartialDeclaration(constantPool: ConstantPool, metaObj: AstObject<R3PartialDeclaration, TExpression>): o.Expression;
}
/**
 * Derives the `R3DirectiveMetadata` structure from the AST object.
 */
export declare function toR3DirectiveMeta<TExpression>(metaObj: AstObject<R3DeclareDirectiveMetadata, TExpression>, code: string, sourceUrl: AbsoluteFsPath): R3DirectiveMetadata;
export declare function createSourceSpan(range: Range, code: string, sourceUrl: string): ParseSourceSpan;
