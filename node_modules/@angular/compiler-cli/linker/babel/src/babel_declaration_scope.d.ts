/// <amd-module name="@angular/compiler-cli/linker/babel/src/babel_declaration_scope" />
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { NodePath, Scope } from '@babel/traverse';
import { DeclarationScope } from '../../../linker';
import { types as t } from './babel_core';
export declare type ConstantScopePath = NodePath<t.FunctionDeclaration> | NodePath<t.FunctionExpression> | NodePath<t.Program>;
/**
 * This class represents the lexical scope of a partial declaration in Babel source code.
 *
 * Its only responsibility is to compute a reference object for the scope of shared constant
 * statements that will be generated during partial linking.
 */
export declare class BabelDeclarationScope implements DeclarationScope<ConstantScopePath, t.Expression> {
    private declarationScope;
    /**
     * Construct a new `BabelDeclarationScope`.
     *
     * @param declarationScope the Babel scope containing the declaration call expression.
     */
    constructor(declarationScope: Scope);
    /**
     * Compute the Babel `NodePath` that can be used to reference the lexical scope where any
     * shared constant statements would be inserted.
     *
     * There will only be a shared constant scope if the expression is in an ECMAScript module, or a
     * UMD module. Otherwise `null` is returned to indicate that constant statements must be emitted
     * locally to the generated linked definition, to avoid polluting the global scope.
     *
     * @param expression the expression that points to the Angular core framework import.
     */
    getConstantScopeRef(expression: t.Expression): ConstantScopePath | null;
}
