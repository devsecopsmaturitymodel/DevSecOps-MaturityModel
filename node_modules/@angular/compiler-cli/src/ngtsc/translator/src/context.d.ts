/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/// <amd-module name="@angular/compiler-cli/src/ngtsc/translator/src/context" />
/**
 * The current context of a translator visitor as it traverses the AST tree.
 *
 * It tracks whether we are in the process of outputting a statement or an expression.
 */
export declare class Context {
    readonly isStatement: boolean;
    constructor(isStatement: boolean);
    get withExpressionMode(): Context;
    get withStatementMode(): Context;
}
