/// <amd-module name="@angular/compiler-cli/linker/src/file_linker/partial_linkers/util" />
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { MaybeForwardRefExpression, outputAst as o, R3DeclareDependencyMetadata, R3DependencyMetadata, R3Reference } from '@angular/compiler';
import { AstObject, AstValue } from '../../ast/ast_value';
export declare function wrapReference<TExpression>(wrapped: o.WrappedNodeExpr<TExpression>): R3Reference;
/**
 * Parses the value of an enum from the AST value's symbol name.
 */
export declare function parseEnum<TExpression, TEnum>(value: AstValue<unknown, TExpression>, Enum: TEnum): TEnum[keyof TEnum];
/**
 * Parse a dependency structure from an AST object.
 */
export declare function getDependency<TExpression>(depObj: AstObject<R3DeclareDependencyMetadata, TExpression>): R3DependencyMetadata;
/**
 * Return an `R3ProviderExpression` that represents either the extracted type reference expression
 * from a `forwardRef` function call, or the type itself.
 *
 * For example, the expression `forwardRef(function() { return FooDir; })` returns `FooDir`. Note
 * that this expression is required to be wrapped in a closure, as otherwise the forward reference
 * would be resolved before initialization.
 *
 * If there is no forwardRef call expression then we just return the opaque type.
 */
export declare function extractForwardRef<TExpression>(expr: AstValue<unknown, TExpression>): MaybeForwardRefExpression<o.WrappedNodeExpr<TExpression>>;
