/// <amd-module name="@angular/compiler-cli/src/ngtsc/typecheck/src/type_emitter" />
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import ts from 'typescript';
/**
 * A type reference resolver function is responsible for translating a type reference from the
 * origin source file into a type reference that is valid in the desired source file. If the type
 * cannot be translated to the desired source file, then null can be returned.
 */
export declare type TypeReferenceTranslator = (type: ts.TypeReferenceNode) => ts.TypeReferenceNode | null;
/**
 * Determines whether the provided type can be emitted, which means that it can be safely emitted
 * into a different location.
 *
 * If this function returns true, a `TypeEmitter` should be able to succeed. Vice versa, if this
 * function returns false, then using the `TypeEmitter` should not be attempted as it is known to
 * fail.
 */
export declare function canEmitType(type: ts.TypeNode, canEmit: (type: ts.TypeReferenceNode) => boolean): boolean;
/**
 * Given a `ts.TypeNode`, this class derives an equivalent `ts.TypeNode` that has been emitted into
 * a different context.
 *
 * For example, consider the following code:
 *
 * ```
 * import {NgIterable} from '@angular/core';
 *
 * class NgForOf<T, U extends NgIterable<T>> {}
 * ```
 *
 * Here, the generic type parameters `T` and `U` can be emitted into a different context, as the
 * type reference to `NgIterable` originates from an absolute module import so that it can be
 * emitted anywhere, using that same module import. The process of emitting translates the
 * `NgIterable` type reference to a type reference that is valid in the context in which it is
 * emitted, for example:
 *
 * ```
 * import * as i0 from '@angular/core';
 * import * as i1 from '@angular/common';
 *
 * const _ctor1: <T, U extends i0.NgIterable<T>>(o: Pick<i1.NgForOf<T, U>, 'ngForOf'>):
 * i1.NgForOf<T, U>;
 * ```
 *
 * Notice how the type reference for `NgIterable` has been translated into a qualified name,
 * referring to the namespace import that was created.
 */
export declare class TypeEmitter {
    private translator;
    constructor(translator: TypeReferenceTranslator);
    emitType(type: ts.TypeNode): ts.TypeNode;
    private emitTypeReference;
}
