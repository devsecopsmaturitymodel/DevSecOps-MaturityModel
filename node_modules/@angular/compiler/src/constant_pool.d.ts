/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import * as o from './output/output_ast';
/**
 * A constant pool allows a code emitter to share constant in an output context.
 *
 * The constant pool also supports sharing access to ivy definitions references.
 */
export declare class ConstantPool {
    private readonly isClosureCompilerEnabled;
    statements: o.Statement[];
    private literals;
    private literalFactories;
    private nextNameIndex;
    constructor(isClosureCompilerEnabled?: boolean);
    getConstLiteral(literal: o.Expression, forceShared?: boolean): o.Expression;
    getLiteralFactory(literal: o.LiteralArrayExpr | o.LiteralMapExpr): {
        literalFactory: o.Expression;
        literalFactoryArguments: o.Expression[];
    };
    private _getLiteralFactory;
    /**
     * Produce a unique name.
     *
     * The name might be unique among different prefixes if any of the prefixes end in
     * a digit so the prefix should be a constant string (not based on user input) and
     * must not end in a digit.
     */
    uniqueName(prefix: string): string;
    private freshName;
    private keyOf;
}
