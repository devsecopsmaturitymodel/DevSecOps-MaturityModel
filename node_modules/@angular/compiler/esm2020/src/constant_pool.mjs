/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import * as o from './output/output_ast';
const CONSTANT_PREFIX = '_c';
/**
 * `ConstantPool` tries to reuse literal factories when two or more literals are identical.
 * We determine whether literals are identical by creating a key out of their AST using the
 * `KeyVisitor`. This constant is used to replace dynamic expressions which can't be safely
 * converted into a key. E.g. given an expression `{foo: bar()}`, since we don't know what
 * the result of `bar` will be, we create a key that looks like `{foo: <unknown>}`. Note
 * that we use a variable, rather than something like `null` in order to avoid collisions.
 */
const UNKNOWN_VALUE_KEY = o.variable('<unknown>');
/**
 * Context to use when producing a key.
 *
 * This ensures we see the constant not the reference variable when producing
 * a key.
 */
const KEY_CONTEXT = {};
/**
 * Generally all primitive values are excluded from the `ConstantPool`, but there is an exclusion
 * for strings that reach a certain length threshold. This constant defines the length threshold for
 * strings.
 */
const POOL_INCLUSION_LENGTH_THRESHOLD_FOR_STRINGS = 50;
/**
 * A node that is a place-holder that allows the node to be replaced when the actual
 * node is known.
 *
 * This allows the constant pool to change an expression from a direct reference to
 * a constant to a shared constant. It returns a fix-up node that is later allowed to
 * change the referenced expression.
 */
class FixupExpression extends o.Expression {
    constructor(resolved) {
        super(resolved.type);
        this.resolved = resolved;
        this.original = resolved;
    }
    visitExpression(visitor, context) {
        if (context === KEY_CONTEXT) {
            // When producing a key we want to traverse the constant not the
            // variable used to refer to it.
            return this.original.visitExpression(visitor, context);
        }
        else {
            return this.resolved.visitExpression(visitor, context);
        }
    }
    isEquivalent(e) {
        return e instanceof FixupExpression && this.resolved.isEquivalent(e.resolved);
    }
    isConstant() {
        return true;
    }
    fixup(expression) {
        this.resolved = expression;
        this.shared = true;
    }
}
/**
 * A constant pool allows a code emitter to share constant in an output context.
 *
 * The constant pool also supports sharing access to ivy definitions references.
 */
export class ConstantPool {
    constructor(isClosureCompilerEnabled = false) {
        this.isClosureCompilerEnabled = isClosureCompilerEnabled;
        this.statements = [];
        this.literals = new Map();
        this.literalFactories = new Map();
        this.nextNameIndex = 0;
    }
    getConstLiteral(literal, forceShared) {
        if ((literal instanceof o.LiteralExpr && !isLongStringLiteral(literal)) ||
            literal instanceof FixupExpression) {
            // Do no put simple literals into the constant pool or try to produce a constant for a
            // reference to a constant.
            return literal;
        }
        const key = this.keyOf(literal);
        let fixup = this.literals.get(key);
        let newValue = false;
        if (!fixup) {
            fixup = new FixupExpression(literal);
            this.literals.set(key, fixup);
            newValue = true;
        }
        if ((!newValue && !fixup.shared) || (newValue && forceShared)) {
            // Replace the expression with a variable
            const name = this.freshName();
            let definition;
            let usage;
            if (this.isClosureCompilerEnabled && isLongStringLiteral(literal)) {
                // For string literals, Closure will **always** inline the string at
                // **all** usages, duplicating it each time. For large strings, this
                // unnecessarily bloats bundle size. To work around this restriction, we
                // wrap the string in a function, and call that function for each usage.
                // This tricks Closure into using inline logic for functions instead of
                // string literals. Function calls are only inlined if the body is small
                // enough to be worth it. By doing this, very large strings will be
                // shared across multiple usages, rather than duplicating the string at
                // each usage site.
                //
                // const myStr = function() { return "very very very long string"; };
                // const usage1 = myStr();
                // const usage2 = myStr();
                definition = o.variable(name).set(new o.FunctionExpr([], // Params.
                [
                    // Statements.
                    new o.ReturnStatement(literal),
                ]));
                usage = o.variable(name).callFn([]);
            }
            else {
                // Just declare and use the variable directly, without a function call
                // indirection. This saves a few bytes and avoids an unncessary call.
                definition = o.variable(name).set(literal);
                usage = o.variable(name);
            }
            this.statements.push(definition.toDeclStmt(o.INFERRED_TYPE, o.StmtModifier.Final));
            fixup.fixup(usage);
        }
        return fixup;
    }
    getLiteralFactory(literal) {
        // Create a pure function that builds an array of a mix of constant and variable expressions
        if (literal instanceof o.LiteralArrayExpr) {
            const argumentsForKey = literal.entries.map(e => e.isConstant() ? e : UNKNOWN_VALUE_KEY);
            const key = this.keyOf(o.literalArr(argumentsForKey));
            return this._getLiteralFactory(key, literal.entries, entries => o.literalArr(entries));
        }
        else {
            const expressionForKey = o.literalMap(literal.entries.map(e => ({
                key: e.key,
                value: e.value.isConstant() ? e.value : UNKNOWN_VALUE_KEY,
                quoted: e.quoted
            })));
            const key = this.keyOf(expressionForKey);
            return this._getLiteralFactory(key, literal.entries.map(e => e.value), entries => o.literalMap(entries.map((value, index) => ({
                key: literal.entries[index].key,
                value,
                quoted: literal.entries[index].quoted
            }))));
        }
    }
    _getLiteralFactory(key, values, resultMap) {
        let literalFactory = this.literalFactories.get(key);
        const literalFactoryArguments = values.filter((e => !e.isConstant()));
        if (!literalFactory) {
            const resultExpressions = values.map((e, index) => e.isConstant() ? this.getConstLiteral(e, true) : o.variable(`a${index}`));
            const parameters = resultExpressions.filter(isVariable).map(e => new o.FnParam(e.name, o.DYNAMIC_TYPE));
            const pureFunctionDeclaration = o.fn(parameters, [new o.ReturnStatement(resultMap(resultExpressions))], o.INFERRED_TYPE);
            const name = this.freshName();
            this.statements.push(o.variable(name)
                .set(pureFunctionDeclaration)
                .toDeclStmt(o.INFERRED_TYPE, o.StmtModifier.Final));
            literalFactory = o.variable(name);
            this.literalFactories.set(key, literalFactory);
        }
        return { literalFactory, literalFactoryArguments };
    }
    /**
     * Produce a unique name.
     *
     * The name might be unique among different prefixes if any of the prefixes end in
     * a digit so the prefix should be a constant string (not based on user input) and
     * must not end in a digit.
     */
    uniqueName(prefix) {
        return `${prefix}${this.nextNameIndex++}`;
    }
    freshName() {
        return this.uniqueName(CONSTANT_PREFIX);
    }
    keyOf(expression) {
        return expression.visitExpression(new KeyVisitor(), KEY_CONTEXT);
    }
}
/**
 * Visitor used to determine if 2 expressions are equivalent and can be shared in the
 * `ConstantPool`.
 *
 * When the id (string) generated by the visitor is equal, expressions are considered equivalent.
 */
class KeyVisitor {
    constructor() {
        this.visitWrappedNodeExpr = invalid;
        this.visitWriteVarExpr = invalid;
        this.visitWriteKeyExpr = invalid;
        this.visitWritePropExpr = invalid;
        this.visitInvokeFunctionExpr = invalid;
        this.visitTaggedTemplateExpr = invalid;
        this.visitInstantiateExpr = invalid;
        this.visitConditionalExpr = invalid;
        this.visitNotExpr = invalid;
        this.visitAssertNotNullExpr = invalid;
        this.visitCastExpr = invalid;
        this.visitFunctionExpr = invalid;
        this.visitUnaryOperatorExpr = invalid;
        this.visitBinaryOperatorExpr = invalid;
        this.visitReadPropExpr = invalid;
        this.visitReadKeyExpr = invalid;
        this.visitCommaExpr = invalid;
        this.visitLocalizedString = invalid;
    }
    visitLiteralExpr(ast) {
        return `${typeof ast.value === 'string' ? '"' + ast.value + '"' : ast.value}`;
    }
    visitLiteralArrayExpr(ast, context) {
        return `[${ast.entries.map(entry => entry.visitExpression(this, context)).join(',')}]`;
    }
    visitLiteralMapExpr(ast, context) {
        const mapKey = (entry) => {
            const quote = entry.quoted ? '"' : '';
            return `${quote}${entry.key}${quote}`;
        };
        const mapEntry = (entry) => `${mapKey(entry)}:${entry.value.visitExpression(this, context)}`;
        return `{${ast.entries.map(mapEntry).join(',')}`;
    }
    visitExternalExpr(ast) {
        return ast.value.moduleName ? `EX:${ast.value.moduleName}:${ast.value.name}` :
            `EX:${ast.value.runtime.name}`;
    }
    visitReadVarExpr(node) {
        return `VAR:${node.name}`;
    }
    visitTypeofExpr(node, context) {
        return `TYPEOF:${node.expr.visitExpression(this, context)}`;
    }
}
function invalid(arg) {
    throw new Error(`Invalid state: Visitor ${this.constructor.name} doesn't handle ${arg.constructor.name}`);
}
function isVariable(e) {
    return e instanceof o.ReadVarExpr;
}
function isLongStringLiteral(expr) {
    return expr instanceof o.LiteralExpr && typeof expr.value === 'string' &&
        expr.value.length >= POOL_INCLUSION_LENGTH_THRESHOLD_FOR_STRINGS;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29uc3RhbnRfcG9vbC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2NvbXBpbGVyL3NyYy9jb25zdGFudF9wb29sLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7R0FNRztBQUVILE9BQU8sS0FBSyxDQUFDLE1BQU0scUJBQXFCLENBQUM7QUFFekMsTUFBTSxlQUFlLEdBQUcsSUFBSSxDQUFDO0FBRTdCOzs7Ozs7O0dBT0c7QUFDSCxNQUFNLGlCQUFpQixHQUFHLENBQUMsQ0FBQyxRQUFRLENBQUMsV0FBVyxDQUFDLENBQUM7QUFFbEQ7Ozs7O0dBS0c7QUFDSCxNQUFNLFdBQVcsR0FBRyxFQUFFLENBQUM7QUFFdkI7Ozs7R0FJRztBQUNILE1BQU0sMkNBQTJDLEdBQUcsRUFBRSxDQUFDO0FBRXZEOzs7Ozs7O0dBT0c7QUFDSCxNQUFNLGVBQWdCLFNBQVEsQ0FBQyxDQUFDLFVBQVU7SUFNeEMsWUFBbUIsUUFBc0I7UUFDdkMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQURKLGFBQVEsR0FBUixRQUFRLENBQWM7UUFFdkMsSUFBSSxDQUFDLFFBQVEsR0FBRyxRQUFRLENBQUM7SUFDM0IsQ0FBQztJQUVRLGVBQWUsQ0FBQyxPQUE0QixFQUFFLE9BQVk7UUFDakUsSUFBSSxPQUFPLEtBQUssV0FBVyxFQUFFO1lBQzNCLGdFQUFnRTtZQUNoRSxnQ0FBZ0M7WUFDaEMsT0FBTyxJQUFJLENBQUMsUUFBUSxDQUFDLGVBQWUsQ0FBQyxPQUFPLEVBQUUsT0FBTyxDQUFDLENBQUM7U0FDeEQ7YUFBTTtZQUNMLE9BQU8sSUFBSSxDQUFDLFFBQVEsQ0FBQyxlQUFlLENBQUMsT0FBTyxFQUFFLE9BQU8sQ0FBQyxDQUFDO1NBQ3hEO0lBQ0gsQ0FBQztJQUVRLFlBQVksQ0FBQyxDQUFlO1FBQ25DLE9BQU8sQ0FBQyxZQUFZLGVBQWUsSUFBSSxJQUFJLENBQUMsUUFBUSxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUM7SUFDaEYsQ0FBQztJQUVRLFVBQVU7UUFDakIsT0FBTyxJQUFJLENBQUM7SUFDZCxDQUFDO0lBRUQsS0FBSyxDQUFDLFVBQXdCO1FBQzVCLElBQUksQ0FBQyxRQUFRLEdBQUcsVUFBVSxDQUFDO1FBQzNCLElBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDO0lBQ3JCLENBQUM7Q0FDRjtBQUVEOzs7O0dBSUc7QUFDSCxNQUFNLE9BQU8sWUFBWTtJQU92QixZQUE2QiwyQkFBb0MsS0FBSztRQUF6Qyw2QkFBd0IsR0FBeEIsd0JBQXdCLENBQWlCO1FBTnRFLGVBQVUsR0FBa0IsRUFBRSxDQUFDO1FBQ3ZCLGFBQVEsR0FBRyxJQUFJLEdBQUcsRUFBMkIsQ0FBQztRQUM5QyxxQkFBZ0IsR0FBRyxJQUFJLEdBQUcsRUFBd0IsQ0FBQztRQUVuRCxrQkFBYSxHQUFHLENBQUMsQ0FBQztJQUUrQyxDQUFDO0lBRTFFLGVBQWUsQ0FBQyxPQUFxQixFQUFFLFdBQXFCO1FBQzFELElBQUksQ0FBQyxPQUFPLFlBQVksQ0FBQyxDQUFDLFdBQVcsSUFBSSxDQUFDLG1CQUFtQixDQUFDLE9BQU8sQ0FBQyxDQUFDO1lBQ25FLE9BQU8sWUFBWSxlQUFlLEVBQUU7WUFDdEMsc0ZBQXNGO1lBQ3RGLDJCQUEyQjtZQUMzQixPQUFPLE9BQU8sQ0FBQztTQUNoQjtRQUNELE1BQU0sR0FBRyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDaEMsSUFBSSxLQUFLLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDbkMsSUFBSSxRQUFRLEdBQUcsS0FBSyxDQUFDO1FBQ3JCLElBQUksQ0FBQyxLQUFLLEVBQUU7WUFDVixLQUFLLEdBQUcsSUFBSSxlQUFlLENBQUMsT0FBTyxDQUFDLENBQUM7WUFDckMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsR0FBRyxFQUFFLEtBQUssQ0FBQyxDQUFDO1lBQzlCLFFBQVEsR0FBRyxJQUFJLENBQUM7U0FDakI7UUFFRCxJQUFJLENBQUMsQ0FBQyxRQUFRLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxRQUFRLElBQUksV0FBVyxDQUFDLEVBQUU7WUFDN0QseUNBQXlDO1lBQ3pDLE1BQU0sSUFBSSxHQUFHLElBQUksQ0FBQyxTQUFTLEVBQUUsQ0FBQztZQUM5QixJQUFJLFVBQTBCLENBQUM7WUFDL0IsSUFBSSxLQUFtQixDQUFDO1lBQ3hCLElBQUksSUFBSSxDQUFDLHdCQUF3QixJQUFJLG1CQUFtQixDQUFDLE9BQU8sQ0FBQyxFQUFFO2dCQUNqRSxvRUFBb0U7Z0JBQ3BFLG9FQUFvRTtnQkFDcEUsd0VBQXdFO2dCQUN4RSx3RUFBd0U7Z0JBQ3hFLHVFQUF1RTtnQkFDdkUsd0VBQXdFO2dCQUN4RSxtRUFBbUU7Z0JBQ25FLHVFQUF1RTtnQkFDdkUsbUJBQW1CO2dCQUNuQixFQUFFO2dCQUNGLHFFQUFxRTtnQkFDckUsMEJBQTBCO2dCQUMxQiwwQkFBMEI7Z0JBQzFCLFVBQVUsR0FBRyxDQUFDLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxZQUFZLENBQ2hELEVBQUUsRUFBRyxVQUFVO2dCQUNmO29CQUNFLGNBQWM7b0JBQ2QsSUFBSSxDQUFDLENBQUMsZUFBZSxDQUFDLE9BQU8sQ0FBQztpQkFDL0IsQ0FDQSxDQUFDLENBQUM7Z0JBQ1AsS0FBSyxHQUFHLENBQUMsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxDQUFDO2FBQ3JDO2lCQUFNO2dCQUNMLHNFQUFzRTtnQkFDdEUscUVBQXFFO2dCQUNyRSxVQUFVLEdBQUcsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLENBQUM7Z0JBQzNDLEtBQUssR0FBRyxDQUFDLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDO2FBQzFCO1lBRUQsSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsYUFBYSxFQUFFLENBQUMsQ0FBQyxZQUFZLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztZQUNuRixLQUFLLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDO1NBQ3BCO1FBRUQsT0FBTyxLQUFLLENBQUM7SUFDZixDQUFDO0lBRUQsaUJBQWlCLENBQUMsT0FBNEM7UUFFNUQsNEZBQTRGO1FBQzVGLElBQUksT0FBTyxZQUFZLENBQUMsQ0FBQyxnQkFBZ0IsRUFBRTtZQUN6QyxNQUFNLGVBQWUsR0FBRyxPQUFPLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxVQUFVLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDO1lBQ3pGLE1BQU0sR0FBRyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxlQUFlLENBQUMsQ0FBQyxDQUFDO1lBQ3RELE9BQU8sSUFBSSxDQUFDLGtCQUFrQixDQUFDLEdBQUcsRUFBRSxPQUFPLENBQUMsT0FBTyxFQUFFLE9BQU8sQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDO1NBQ3hGO2FBQU07WUFDTCxNQUFNLGdCQUFnQixHQUFHLENBQUMsQ0FBQyxVQUFVLENBQ2pDLE9BQU8sQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQztnQkFDSixHQUFHLEVBQUUsQ0FBQyxDQUFDLEdBQUc7Z0JBQ1YsS0FBSyxFQUFFLENBQUMsQ0FBQyxLQUFLLENBQUMsVUFBVSxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLGlCQUFpQjtnQkFDekQsTUFBTSxFQUFFLENBQUMsQ0FBQyxNQUFNO2FBQ2pCLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDN0IsTUFBTSxHQUFHLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDO1lBQ3pDLE9BQU8sSUFBSSxDQUFDLGtCQUFrQixDQUMxQixHQUFHLEVBQUUsT0FBTyxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLEVBQ3RDLE9BQU8sQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUMsS0FBSyxFQUFFLEtBQUssRUFBRSxFQUFFLENBQUMsQ0FBQztnQkFDakIsR0FBRyxFQUFFLE9BQU8sQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUMsR0FBRztnQkFDL0IsS0FBSztnQkFDTCxNQUFNLEVBQUUsT0FBTyxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQyxNQUFNO2FBQ3RDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztTQUMvQztJQUNILENBQUM7SUFFTyxrQkFBa0IsQ0FDdEIsR0FBVyxFQUFFLE1BQXNCLEVBQUUsU0FBdUQ7UUFFOUYsSUFBSSxjQUFjLEdBQUcsSUFBSSxDQUFDLGdCQUFnQixDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUNwRCxNQUFNLHVCQUF1QixHQUFHLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLFVBQVUsRUFBRSxDQUFDLENBQUMsQ0FBQztRQUN0RSxJQUFJLENBQUMsY0FBYyxFQUFFO1lBQ25CLE1BQU0saUJBQWlCLEdBQUcsTUFBTSxDQUFDLEdBQUcsQ0FDaEMsQ0FBQyxDQUFDLEVBQUUsS0FBSyxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUMsVUFBVSxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxlQUFlLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLElBQUksS0FBSyxFQUFFLENBQUMsQ0FBQyxDQUFDO1lBQzVGLE1BQU0sVUFBVSxHQUNaLGlCQUFpQixDQUFDLE1BQU0sQ0FBQyxVQUFVLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLElBQUssRUFBRSxDQUFDLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQztZQUMxRixNQUFNLHVCQUF1QixHQUN6QixDQUFDLENBQUMsRUFBRSxDQUFDLFVBQVUsRUFBRSxDQUFDLElBQUksQ0FBQyxDQUFDLGVBQWUsQ0FBQyxTQUFTLENBQUMsaUJBQWlCLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLGFBQWEsQ0FBQyxDQUFDO1lBQzdGLE1BQU0sSUFBSSxHQUFHLElBQUksQ0FBQyxTQUFTLEVBQUUsQ0FBQztZQUM5QixJQUFJLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQztpQkFDWCxHQUFHLENBQUMsdUJBQXVCLENBQUM7aUJBQzVCLFVBQVUsQ0FBQyxDQUFDLENBQUMsYUFBYSxFQUFFLENBQUMsQ0FBQyxZQUFZLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztZQUM3RSxjQUFjLEdBQUcsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUNsQyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsR0FBRyxDQUFDLEdBQUcsRUFBRSxjQUFjLENBQUMsQ0FBQztTQUNoRDtRQUNELE9BQU8sRUFBQyxjQUFjLEVBQUUsdUJBQXVCLEVBQUMsQ0FBQztJQUNuRCxDQUFDO0lBRUQ7Ozs7OztPQU1HO0lBQ0gsVUFBVSxDQUFDLE1BQWM7UUFDdkIsT0FBTyxHQUFHLE1BQU0sR0FBRyxJQUFJLENBQUMsYUFBYSxFQUFFLEVBQUUsQ0FBQztJQUM1QyxDQUFDO0lBRU8sU0FBUztRQUNmLE9BQU8sSUFBSSxDQUFDLFVBQVUsQ0FBQyxlQUFlLENBQUMsQ0FBQztJQUMxQyxDQUFDO0lBRU8sS0FBSyxDQUFDLFVBQXdCO1FBQ3BDLE9BQU8sVUFBVSxDQUFDLGVBQWUsQ0FBQyxJQUFJLFVBQVUsRUFBRSxFQUFFLFdBQVcsQ0FBQyxDQUFDO0lBQ25FLENBQUM7Q0FDRjtBQUVEOzs7OztHQUtHO0FBQ0gsTUFBTSxVQUFVO0lBQWhCO1FBZ0NFLHlCQUFvQixHQUFHLE9BQU8sQ0FBQztRQUMvQixzQkFBaUIsR0FBRyxPQUFPLENBQUM7UUFDNUIsc0JBQWlCLEdBQUcsT0FBTyxDQUFDO1FBQzVCLHVCQUFrQixHQUFHLE9BQU8sQ0FBQztRQUM3Qiw0QkFBdUIsR0FBRyxPQUFPLENBQUM7UUFDbEMsNEJBQXVCLEdBQUcsT0FBTyxDQUFDO1FBQ2xDLHlCQUFvQixHQUFHLE9BQU8sQ0FBQztRQUMvQix5QkFBb0IsR0FBRyxPQUFPLENBQUM7UUFDL0IsaUJBQVksR0FBRyxPQUFPLENBQUM7UUFDdkIsMkJBQXNCLEdBQUcsT0FBTyxDQUFDO1FBQ2pDLGtCQUFhLEdBQUcsT0FBTyxDQUFDO1FBQ3hCLHNCQUFpQixHQUFHLE9BQU8sQ0FBQztRQUM1QiwyQkFBc0IsR0FBRyxPQUFPLENBQUM7UUFDakMsNEJBQXVCLEdBQUcsT0FBTyxDQUFDO1FBQ2xDLHNCQUFpQixHQUFHLE9BQU8sQ0FBQztRQUM1QixxQkFBZ0IsR0FBRyxPQUFPLENBQUM7UUFDM0IsbUJBQWMsR0FBRyxPQUFPLENBQUM7UUFDekIseUJBQW9CLEdBQUcsT0FBTyxDQUFDO0lBQ2pDLENBQUM7SUFqREMsZ0JBQWdCLENBQUMsR0FBa0I7UUFDakMsT0FBTyxHQUFHLE9BQU8sR0FBRyxDQUFDLEtBQUssS0FBSyxRQUFRLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxHQUFHLENBQUMsS0FBSyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEtBQUssRUFBRSxDQUFDO0lBQ2hGLENBQUM7SUFFRCxxQkFBcUIsQ0FBQyxHQUF1QixFQUFFLE9BQWU7UUFDNUQsT0FBTyxJQUFJLEdBQUcsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLGVBQWUsQ0FBQyxJQUFJLEVBQUUsT0FBTyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQztJQUN6RixDQUFDO0lBRUQsbUJBQW1CLENBQUMsR0FBcUIsRUFBRSxPQUFlO1FBQ3hELE1BQU0sTUFBTSxHQUFHLENBQUMsS0FBd0IsRUFBRSxFQUFFO1lBQzFDLE1BQU0sS0FBSyxHQUFHLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDO1lBQ3RDLE9BQU8sR0FBRyxLQUFLLEdBQUcsS0FBSyxDQUFDLEdBQUcsR0FBRyxLQUFLLEVBQUUsQ0FBQztRQUN4QyxDQUFDLENBQUM7UUFDRixNQUFNLFFBQVEsR0FBRyxDQUFDLEtBQXdCLEVBQUUsRUFBRSxDQUMxQyxHQUFHLE1BQU0sQ0FBQyxLQUFLLENBQUMsSUFBSSxLQUFLLENBQUMsS0FBSyxDQUFDLGVBQWUsQ0FBQyxJQUFJLEVBQUUsT0FBTyxDQUFDLEVBQUUsQ0FBQztRQUNyRSxPQUFPLElBQUksR0FBRyxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUM7SUFDbkQsQ0FBQztJQUVELGlCQUFpQixDQUFDLEdBQW1CO1FBQ25DLE9BQU8sR0FBRyxDQUFDLEtBQUssQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLE1BQU0sR0FBRyxDQUFDLEtBQUssQ0FBQyxVQUFVLElBQUksR0FBRyxDQUFDLEtBQUssQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDO1lBQ2hELE1BQU0sR0FBRyxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsSUFBSSxFQUFFLENBQUM7SUFDL0QsQ0FBQztJQUVELGdCQUFnQixDQUFDLElBQW1CO1FBQ2xDLE9BQU8sT0FBTyxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUM7SUFDNUIsQ0FBQztJQUVELGVBQWUsQ0FBQyxJQUFrQixFQUFFLE9BQVk7UUFDOUMsT0FBTyxVQUFVLElBQUksQ0FBQyxJQUFJLENBQUMsZUFBZSxDQUFDLElBQUksRUFBRSxPQUFPLENBQUMsRUFBRSxDQUFDO0lBQzlELENBQUM7Q0FvQkY7QUFFRCxTQUFTLE9BQU8sQ0FBK0IsR0FBNkI7SUFDMUUsTUFBTSxJQUFJLEtBQUssQ0FDWCwwQkFBMEIsSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLG1CQUFtQixHQUFHLENBQUMsV0FBVyxDQUFDLElBQUksRUFBRSxDQUFDLENBQUM7QUFDaEcsQ0FBQztBQUVELFNBQVMsVUFBVSxDQUFDLENBQWU7SUFDakMsT0FBTyxDQUFDLFlBQVksQ0FBQyxDQUFDLFdBQVcsQ0FBQztBQUNwQyxDQUFDO0FBRUQsU0FBUyxtQkFBbUIsQ0FBQyxJQUFrQjtJQUM3QyxPQUFPLElBQUksWUFBWSxDQUFDLENBQUMsV0FBVyxJQUFJLE9BQU8sSUFBSSxDQUFDLEtBQUssS0FBSyxRQUFRO1FBQ2xFLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxJQUFJLDJDQUEyQyxDQUFDO0FBQ3ZFLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0ICogYXMgbyBmcm9tICcuL291dHB1dC9vdXRwdXRfYXN0JztcblxuY29uc3QgQ09OU1RBTlRfUFJFRklYID0gJ19jJztcblxuLyoqXG4gKiBgQ29uc3RhbnRQb29sYCB0cmllcyB0byByZXVzZSBsaXRlcmFsIGZhY3RvcmllcyB3aGVuIHR3byBvciBtb3JlIGxpdGVyYWxzIGFyZSBpZGVudGljYWwuXG4gKiBXZSBkZXRlcm1pbmUgd2hldGhlciBsaXRlcmFscyBhcmUgaWRlbnRpY2FsIGJ5IGNyZWF0aW5nIGEga2V5IG91dCBvZiB0aGVpciBBU1QgdXNpbmcgdGhlXG4gKiBgS2V5VmlzaXRvcmAuIFRoaXMgY29uc3RhbnQgaXMgdXNlZCB0byByZXBsYWNlIGR5bmFtaWMgZXhwcmVzc2lvbnMgd2hpY2ggY2FuJ3QgYmUgc2FmZWx5XG4gKiBjb252ZXJ0ZWQgaW50byBhIGtleS4gRS5nLiBnaXZlbiBhbiBleHByZXNzaW9uIGB7Zm9vOiBiYXIoKX1gLCBzaW5jZSB3ZSBkb24ndCBrbm93IHdoYXRcbiAqIHRoZSByZXN1bHQgb2YgYGJhcmAgd2lsbCBiZSwgd2UgY3JlYXRlIGEga2V5IHRoYXQgbG9va3MgbGlrZSBge2ZvbzogPHVua25vd24+fWAuIE5vdGVcbiAqIHRoYXQgd2UgdXNlIGEgdmFyaWFibGUsIHJhdGhlciB0aGFuIHNvbWV0aGluZyBsaWtlIGBudWxsYCBpbiBvcmRlciB0byBhdm9pZCBjb2xsaXNpb25zLlxuICovXG5jb25zdCBVTktOT1dOX1ZBTFVFX0tFWSA9IG8udmFyaWFibGUoJzx1bmtub3duPicpO1xuXG4vKipcbiAqIENvbnRleHQgdG8gdXNlIHdoZW4gcHJvZHVjaW5nIGEga2V5LlxuICpcbiAqIFRoaXMgZW5zdXJlcyB3ZSBzZWUgdGhlIGNvbnN0YW50IG5vdCB0aGUgcmVmZXJlbmNlIHZhcmlhYmxlIHdoZW4gcHJvZHVjaW5nXG4gKiBhIGtleS5cbiAqL1xuY29uc3QgS0VZX0NPTlRFWFQgPSB7fTtcblxuLyoqXG4gKiBHZW5lcmFsbHkgYWxsIHByaW1pdGl2ZSB2YWx1ZXMgYXJlIGV4Y2x1ZGVkIGZyb20gdGhlIGBDb25zdGFudFBvb2xgLCBidXQgdGhlcmUgaXMgYW4gZXhjbHVzaW9uXG4gKiBmb3Igc3RyaW5ncyB0aGF0IHJlYWNoIGEgY2VydGFpbiBsZW5ndGggdGhyZXNob2xkLiBUaGlzIGNvbnN0YW50IGRlZmluZXMgdGhlIGxlbmd0aCB0aHJlc2hvbGQgZm9yXG4gKiBzdHJpbmdzLlxuICovXG5jb25zdCBQT09MX0lOQ0xVU0lPTl9MRU5HVEhfVEhSRVNIT0xEX0ZPUl9TVFJJTkdTID0gNTA7XG5cbi8qKlxuICogQSBub2RlIHRoYXQgaXMgYSBwbGFjZS1ob2xkZXIgdGhhdCBhbGxvd3MgdGhlIG5vZGUgdG8gYmUgcmVwbGFjZWQgd2hlbiB0aGUgYWN0dWFsXG4gKiBub2RlIGlzIGtub3duLlxuICpcbiAqIFRoaXMgYWxsb3dzIHRoZSBjb25zdGFudCBwb29sIHRvIGNoYW5nZSBhbiBleHByZXNzaW9uIGZyb20gYSBkaXJlY3QgcmVmZXJlbmNlIHRvXG4gKiBhIGNvbnN0YW50IHRvIGEgc2hhcmVkIGNvbnN0YW50LiBJdCByZXR1cm5zIGEgZml4LXVwIG5vZGUgdGhhdCBpcyBsYXRlciBhbGxvd2VkIHRvXG4gKiBjaGFuZ2UgdGhlIHJlZmVyZW5jZWQgZXhwcmVzc2lvbi5cbiAqL1xuY2xhc3MgRml4dXBFeHByZXNzaW9uIGV4dGVuZHMgby5FeHByZXNzaW9uIHtcbiAgcHJpdmF0ZSBvcmlnaW5hbDogby5FeHByZXNzaW9uO1xuXG4gIC8vIFRPRE8oaXNzdWUvMjQ1NzEpOiByZW1vdmUgJyEnLlxuICBzaGFyZWQhOiBib29sZWFuO1xuXG4gIGNvbnN0cnVjdG9yKHB1YmxpYyByZXNvbHZlZDogby5FeHByZXNzaW9uKSB7XG4gICAgc3VwZXIocmVzb2x2ZWQudHlwZSk7XG4gICAgdGhpcy5vcmlnaW5hbCA9IHJlc29sdmVkO1xuICB9XG5cbiAgb3ZlcnJpZGUgdmlzaXRFeHByZXNzaW9uKHZpc2l0b3I6IG8uRXhwcmVzc2lvblZpc2l0b3IsIGNvbnRleHQ6IGFueSk6IGFueSB7XG4gICAgaWYgKGNvbnRleHQgPT09IEtFWV9DT05URVhUKSB7XG4gICAgICAvLyBXaGVuIHByb2R1Y2luZyBhIGtleSB3ZSB3YW50IHRvIHRyYXZlcnNlIHRoZSBjb25zdGFudCBub3QgdGhlXG4gICAgICAvLyB2YXJpYWJsZSB1c2VkIHRvIHJlZmVyIHRvIGl0LlxuICAgICAgcmV0dXJuIHRoaXMub3JpZ2luYWwudmlzaXRFeHByZXNzaW9uKHZpc2l0b3IsIGNvbnRleHQpO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gdGhpcy5yZXNvbHZlZC52aXNpdEV4cHJlc3Npb24odmlzaXRvciwgY29udGV4dCk7XG4gICAgfVxuICB9XG5cbiAgb3ZlcnJpZGUgaXNFcXVpdmFsZW50KGU6IG8uRXhwcmVzc2lvbik6IGJvb2xlYW4ge1xuICAgIHJldHVybiBlIGluc3RhbmNlb2YgRml4dXBFeHByZXNzaW9uICYmIHRoaXMucmVzb2x2ZWQuaXNFcXVpdmFsZW50KGUucmVzb2x2ZWQpO1xuICB9XG5cbiAgb3ZlcnJpZGUgaXNDb25zdGFudCgpIHtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuXG4gIGZpeHVwKGV4cHJlc3Npb246IG8uRXhwcmVzc2lvbikge1xuICAgIHRoaXMucmVzb2x2ZWQgPSBleHByZXNzaW9uO1xuICAgIHRoaXMuc2hhcmVkID0gdHJ1ZTtcbiAgfVxufVxuXG4vKipcbiAqIEEgY29uc3RhbnQgcG9vbCBhbGxvd3MgYSBjb2RlIGVtaXR0ZXIgdG8gc2hhcmUgY29uc3RhbnQgaW4gYW4gb3V0cHV0IGNvbnRleHQuXG4gKlxuICogVGhlIGNvbnN0YW50IHBvb2wgYWxzbyBzdXBwb3J0cyBzaGFyaW5nIGFjY2VzcyB0byBpdnkgZGVmaW5pdGlvbnMgcmVmZXJlbmNlcy5cbiAqL1xuZXhwb3J0IGNsYXNzIENvbnN0YW50UG9vbCB7XG4gIHN0YXRlbWVudHM6IG8uU3RhdGVtZW50W10gPSBbXTtcbiAgcHJpdmF0ZSBsaXRlcmFscyA9IG5ldyBNYXA8c3RyaW5nLCBGaXh1cEV4cHJlc3Npb24+KCk7XG4gIHByaXZhdGUgbGl0ZXJhbEZhY3RvcmllcyA9IG5ldyBNYXA8c3RyaW5nLCBvLkV4cHJlc3Npb24+KCk7XG5cbiAgcHJpdmF0ZSBuZXh0TmFtZUluZGV4ID0gMDtcblxuICBjb25zdHJ1Y3Rvcihwcml2YXRlIHJlYWRvbmx5IGlzQ2xvc3VyZUNvbXBpbGVyRW5hYmxlZDogYm9vbGVhbiA9IGZhbHNlKSB7fVxuXG4gIGdldENvbnN0TGl0ZXJhbChsaXRlcmFsOiBvLkV4cHJlc3Npb24sIGZvcmNlU2hhcmVkPzogYm9vbGVhbik6IG8uRXhwcmVzc2lvbiB7XG4gICAgaWYgKChsaXRlcmFsIGluc3RhbmNlb2Ygby5MaXRlcmFsRXhwciAmJiAhaXNMb25nU3RyaW5nTGl0ZXJhbChsaXRlcmFsKSkgfHxcbiAgICAgICAgbGl0ZXJhbCBpbnN0YW5jZW9mIEZpeHVwRXhwcmVzc2lvbikge1xuICAgICAgLy8gRG8gbm8gcHV0IHNpbXBsZSBsaXRlcmFscyBpbnRvIHRoZSBjb25zdGFudCBwb29sIG9yIHRyeSB0byBwcm9kdWNlIGEgY29uc3RhbnQgZm9yIGFcbiAgICAgIC8vIHJlZmVyZW5jZSB0byBhIGNvbnN0YW50LlxuICAgICAgcmV0dXJuIGxpdGVyYWw7XG4gICAgfVxuICAgIGNvbnN0IGtleSA9IHRoaXMua2V5T2YobGl0ZXJhbCk7XG4gICAgbGV0IGZpeHVwID0gdGhpcy5saXRlcmFscy5nZXQoa2V5KTtcbiAgICBsZXQgbmV3VmFsdWUgPSBmYWxzZTtcbiAgICBpZiAoIWZpeHVwKSB7XG4gICAgICBmaXh1cCA9IG5ldyBGaXh1cEV4cHJlc3Npb24obGl0ZXJhbCk7XG4gICAgICB0aGlzLmxpdGVyYWxzLnNldChrZXksIGZpeHVwKTtcbiAgICAgIG5ld1ZhbHVlID0gdHJ1ZTtcbiAgICB9XG5cbiAgICBpZiAoKCFuZXdWYWx1ZSAmJiAhZml4dXAuc2hhcmVkKSB8fCAobmV3VmFsdWUgJiYgZm9yY2VTaGFyZWQpKSB7XG4gICAgICAvLyBSZXBsYWNlIHRoZSBleHByZXNzaW9uIHdpdGggYSB2YXJpYWJsZVxuICAgICAgY29uc3QgbmFtZSA9IHRoaXMuZnJlc2hOYW1lKCk7XG4gICAgICBsZXQgZGVmaW5pdGlvbjogby5Xcml0ZVZhckV4cHI7XG4gICAgICBsZXQgdXNhZ2U6IG8uRXhwcmVzc2lvbjtcbiAgICAgIGlmICh0aGlzLmlzQ2xvc3VyZUNvbXBpbGVyRW5hYmxlZCAmJiBpc0xvbmdTdHJpbmdMaXRlcmFsKGxpdGVyYWwpKSB7XG4gICAgICAgIC8vIEZvciBzdHJpbmcgbGl0ZXJhbHMsIENsb3N1cmUgd2lsbCAqKmFsd2F5cyoqIGlubGluZSB0aGUgc3RyaW5nIGF0XG4gICAgICAgIC8vICoqYWxsKiogdXNhZ2VzLCBkdXBsaWNhdGluZyBpdCBlYWNoIHRpbWUuIEZvciBsYXJnZSBzdHJpbmdzLCB0aGlzXG4gICAgICAgIC8vIHVubmVjZXNzYXJpbHkgYmxvYXRzIGJ1bmRsZSBzaXplLiBUbyB3b3JrIGFyb3VuZCB0aGlzIHJlc3RyaWN0aW9uLCB3ZVxuICAgICAgICAvLyB3cmFwIHRoZSBzdHJpbmcgaW4gYSBmdW5jdGlvbiwgYW5kIGNhbGwgdGhhdCBmdW5jdGlvbiBmb3IgZWFjaCB1c2FnZS5cbiAgICAgICAgLy8gVGhpcyB0cmlja3MgQ2xvc3VyZSBpbnRvIHVzaW5nIGlubGluZSBsb2dpYyBmb3IgZnVuY3Rpb25zIGluc3RlYWQgb2ZcbiAgICAgICAgLy8gc3RyaW5nIGxpdGVyYWxzLiBGdW5jdGlvbiBjYWxscyBhcmUgb25seSBpbmxpbmVkIGlmIHRoZSBib2R5IGlzIHNtYWxsXG4gICAgICAgIC8vIGVub3VnaCB0byBiZSB3b3J0aCBpdC4gQnkgZG9pbmcgdGhpcywgdmVyeSBsYXJnZSBzdHJpbmdzIHdpbGwgYmVcbiAgICAgICAgLy8gc2hhcmVkIGFjcm9zcyBtdWx0aXBsZSB1c2FnZXMsIHJhdGhlciB0aGFuIGR1cGxpY2F0aW5nIHRoZSBzdHJpbmcgYXRcbiAgICAgICAgLy8gZWFjaCB1c2FnZSBzaXRlLlxuICAgICAgICAvL1xuICAgICAgICAvLyBjb25zdCBteVN0ciA9IGZ1bmN0aW9uKCkgeyByZXR1cm4gXCJ2ZXJ5IHZlcnkgdmVyeSBsb25nIHN0cmluZ1wiOyB9O1xuICAgICAgICAvLyBjb25zdCB1c2FnZTEgPSBteVN0cigpO1xuICAgICAgICAvLyBjb25zdCB1c2FnZTIgPSBteVN0cigpO1xuICAgICAgICBkZWZpbml0aW9uID0gby52YXJpYWJsZShuYW1lKS5zZXQobmV3IG8uRnVuY3Rpb25FeHByKFxuICAgICAgICAgICAgW10sICAvLyBQYXJhbXMuXG4gICAgICAgICAgICBbXG4gICAgICAgICAgICAgIC8vIFN0YXRlbWVudHMuXG4gICAgICAgICAgICAgIG5ldyBvLlJldHVyblN0YXRlbWVudChsaXRlcmFsKSxcbiAgICAgICAgICAgIF0sXG4gICAgICAgICAgICApKTtcbiAgICAgICAgdXNhZ2UgPSBvLnZhcmlhYmxlKG5hbWUpLmNhbGxGbihbXSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICAvLyBKdXN0IGRlY2xhcmUgYW5kIHVzZSB0aGUgdmFyaWFibGUgZGlyZWN0bHksIHdpdGhvdXQgYSBmdW5jdGlvbiBjYWxsXG4gICAgICAgIC8vIGluZGlyZWN0aW9uLiBUaGlzIHNhdmVzIGEgZmV3IGJ5dGVzIGFuZCBhdm9pZHMgYW4gdW5uY2Vzc2FyeSBjYWxsLlxuICAgICAgICBkZWZpbml0aW9uID0gby52YXJpYWJsZShuYW1lKS5zZXQobGl0ZXJhbCk7XG4gICAgICAgIHVzYWdlID0gby52YXJpYWJsZShuYW1lKTtcbiAgICAgIH1cblxuICAgICAgdGhpcy5zdGF0ZW1lbnRzLnB1c2goZGVmaW5pdGlvbi50b0RlY2xTdG10KG8uSU5GRVJSRURfVFlQRSwgby5TdG10TW9kaWZpZXIuRmluYWwpKTtcbiAgICAgIGZpeHVwLmZpeHVwKHVzYWdlKTtcbiAgICB9XG5cbiAgICByZXR1cm4gZml4dXA7XG4gIH1cblxuICBnZXRMaXRlcmFsRmFjdG9yeShsaXRlcmFsOiBvLkxpdGVyYWxBcnJheUV4cHJ8by5MaXRlcmFsTWFwRXhwcik6XG4gICAgICB7bGl0ZXJhbEZhY3Rvcnk6IG8uRXhwcmVzc2lvbiwgbGl0ZXJhbEZhY3RvcnlBcmd1bWVudHM6IG8uRXhwcmVzc2lvbltdfSB7XG4gICAgLy8gQ3JlYXRlIGEgcHVyZSBmdW5jdGlvbiB0aGF0IGJ1aWxkcyBhbiBhcnJheSBvZiBhIG1peCBvZiBjb25zdGFudCBhbmQgdmFyaWFibGUgZXhwcmVzc2lvbnNcbiAgICBpZiAobGl0ZXJhbCBpbnN0YW5jZW9mIG8uTGl0ZXJhbEFycmF5RXhwcikge1xuICAgICAgY29uc3QgYXJndW1lbnRzRm9yS2V5ID0gbGl0ZXJhbC5lbnRyaWVzLm1hcChlID0+IGUuaXNDb25zdGFudCgpID8gZSA6IFVOS05PV05fVkFMVUVfS0VZKTtcbiAgICAgIGNvbnN0IGtleSA9IHRoaXMua2V5T2Yoby5saXRlcmFsQXJyKGFyZ3VtZW50c0ZvcktleSkpO1xuICAgICAgcmV0dXJuIHRoaXMuX2dldExpdGVyYWxGYWN0b3J5KGtleSwgbGl0ZXJhbC5lbnRyaWVzLCBlbnRyaWVzID0+IG8ubGl0ZXJhbEFycihlbnRyaWVzKSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnN0IGV4cHJlc3Npb25Gb3JLZXkgPSBvLmxpdGVyYWxNYXAoXG4gICAgICAgICAgbGl0ZXJhbC5lbnRyaWVzLm1hcChlID0+ICh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGtleTogZS5rZXksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlOiBlLnZhbHVlLmlzQ29uc3RhbnQoKSA/IGUudmFsdWUgOiBVTktOT1dOX1ZBTFVFX0tFWSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcXVvdGVkOiBlLnF1b3RlZFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSkpKTtcbiAgICAgIGNvbnN0IGtleSA9IHRoaXMua2V5T2YoZXhwcmVzc2lvbkZvcktleSk7XG4gICAgICByZXR1cm4gdGhpcy5fZ2V0TGl0ZXJhbEZhY3RvcnkoXG4gICAgICAgICAga2V5LCBsaXRlcmFsLmVudHJpZXMubWFwKGUgPT4gZS52YWx1ZSksXG4gICAgICAgICAgZW50cmllcyA9PiBvLmxpdGVyYWxNYXAoZW50cmllcy5tYXAoKHZhbHVlLCBpbmRleCkgPT4gKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGtleTogbGl0ZXJhbC5lbnRyaWVzW2luZGV4XS5rZXksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHF1b3RlZDogbGl0ZXJhbC5lbnRyaWVzW2luZGV4XS5xdW90ZWRcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KSkpKTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIF9nZXRMaXRlcmFsRmFjdG9yeShcbiAgICAgIGtleTogc3RyaW5nLCB2YWx1ZXM6IG8uRXhwcmVzc2lvbltdLCByZXN1bHRNYXA6IChwYXJhbWV0ZXJzOiBvLkV4cHJlc3Npb25bXSkgPT4gby5FeHByZXNzaW9uKTpcbiAgICAgIHtsaXRlcmFsRmFjdG9yeTogby5FeHByZXNzaW9uLCBsaXRlcmFsRmFjdG9yeUFyZ3VtZW50czogby5FeHByZXNzaW9uW119IHtcbiAgICBsZXQgbGl0ZXJhbEZhY3RvcnkgPSB0aGlzLmxpdGVyYWxGYWN0b3JpZXMuZ2V0KGtleSk7XG4gICAgY29uc3QgbGl0ZXJhbEZhY3RvcnlBcmd1bWVudHMgPSB2YWx1ZXMuZmlsdGVyKChlID0+ICFlLmlzQ29uc3RhbnQoKSkpO1xuICAgIGlmICghbGl0ZXJhbEZhY3RvcnkpIHtcbiAgICAgIGNvbnN0IHJlc3VsdEV4cHJlc3Npb25zID0gdmFsdWVzLm1hcChcbiAgICAgICAgICAoZSwgaW5kZXgpID0+IGUuaXNDb25zdGFudCgpID8gdGhpcy5nZXRDb25zdExpdGVyYWwoZSwgdHJ1ZSkgOiBvLnZhcmlhYmxlKGBhJHtpbmRleH1gKSk7XG4gICAgICBjb25zdCBwYXJhbWV0ZXJzID1cbiAgICAgICAgICByZXN1bHRFeHByZXNzaW9ucy5maWx0ZXIoaXNWYXJpYWJsZSkubWFwKGUgPT4gbmV3IG8uRm5QYXJhbShlLm5hbWUhLCBvLkRZTkFNSUNfVFlQRSkpO1xuICAgICAgY29uc3QgcHVyZUZ1bmN0aW9uRGVjbGFyYXRpb24gPVxuICAgICAgICAgIG8uZm4ocGFyYW1ldGVycywgW25ldyBvLlJldHVyblN0YXRlbWVudChyZXN1bHRNYXAocmVzdWx0RXhwcmVzc2lvbnMpKV0sIG8uSU5GRVJSRURfVFlQRSk7XG4gICAgICBjb25zdCBuYW1lID0gdGhpcy5mcmVzaE5hbWUoKTtcbiAgICAgIHRoaXMuc3RhdGVtZW50cy5wdXNoKG8udmFyaWFibGUobmFtZSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAuc2V0KHB1cmVGdW5jdGlvbkRlY2xhcmF0aW9uKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC50b0RlY2xTdG10KG8uSU5GRVJSRURfVFlQRSwgby5TdG10TW9kaWZpZXIuRmluYWwpKTtcbiAgICAgIGxpdGVyYWxGYWN0b3J5ID0gby52YXJpYWJsZShuYW1lKTtcbiAgICAgIHRoaXMubGl0ZXJhbEZhY3Rvcmllcy5zZXQoa2V5LCBsaXRlcmFsRmFjdG9yeSk7XG4gICAgfVxuICAgIHJldHVybiB7bGl0ZXJhbEZhY3RvcnksIGxpdGVyYWxGYWN0b3J5QXJndW1lbnRzfTtcbiAgfVxuXG4gIC8qKlxuICAgKiBQcm9kdWNlIGEgdW5pcXVlIG5hbWUuXG4gICAqXG4gICAqIFRoZSBuYW1lIG1pZ2h0IGJlIHVuaXF1ZSBhbW9uZyBkaWZmZXJlbnQgcHJlZml4ZXMgaWYgYW55IG9mIHRoZSBwcmVmaXhlcyBlbmQgaW5cbiAgICogYSBkaWdpdCBzbyB0aGUgcHJlZml4IHNob3VsZCBiZSBhIGNvbnN0YW50IHN0cmluZyAobm90IGJhc2VkIG9uIHVzZXIgaW5wdXQpIGFuZFxuICAgKiBtdXN0IG5vdCBlbmQgaW4gYSBkaWdpdC5cbiAgICovXG4gIHVuaXF1ZU5hbWUocHJlZml4OiBzdHJpbmcpOiBzdHJpbmcge1xuICAgIHJldHVybiBgJHtwcmVmaXh9JHt0aGlzLm5leHROYW1lSW5kZXgrK31gO1xuICB9XG5cbiAgcHJpdmF0ZSBmcmVzaE5hbWUoKTogc3RyaW5nIHtcbiAgICByZXR1cm4gdGhpcy51bmlxdWVOYW1lKENPTlNUQU5UX1BSRUZJWCk7XG4gIH1cblxuICBwcml2YXRlIGtleU9mKGV4cHJlc3Npb246IG8uRXhwcmVzc2lvbikge1xuICAgIHJldHVybiBleHByZXNzaW9uLnZpc2l0RXhwcmVzc2lvbihuZXcgS2V5VmlzaXRvcigpLCBLRVlfQ09OVEVYVCk7XG4gIH1cbn1cblxuLyoqXG4gKiBWaXNpdG9yIHVzZWQgdG8gZGV0ZXJtaW5lIGlmIDIgZXhwcmVzc2lvbnMgYXJlIGVxdWl2YWxlbnQgYW5kIGNhbiBiZSBzaGFyZWQgaW4gdGhlXG4gKiBgQ29uc3RhbnRQb29sYC5cbiAqXG4gKiBXaGVuIHRoZSBpZCAoc3RyaW5nKSBnZW5lcmF0ZWQgYnkgdGhlIHZpc2l0b3IgaXMgZXF1YWwsIGV4cHJlc3Npb25zIGFyZSBjb25zaWRlcmVkIGVxdWl2YWxlbnQuXG4gKi9cbmNsYXNzIEtleVZpc2l0b3IgaW1wbGVtZW50cyBvLkV4cHJlc3Npb25WaXNpdG9yIHtcbiAgdmlzaXRMaXRlcmFsRXhwcihhc3Q6IG8uTGl0ZXJhbEV4cHIpOiBzdHJpbmcge1xuICAgIHJldHVybiBgJHt0eXBlb2YgYXN0LnZhbHVlID09PSAnc3RyaW5nJyA/ICdcIicgKyBhc3QudmFsdWUgKyAnXCInIDogYXN0LnZhbHVlfWA7XG4gIH1cblxuICB2aXNpdExpdGVyYWxBcnJheUV4cHIoYXN0OiBvLkxpdGVyYWxBcnJheUV4cHIsIGNvbnRleHQ6IG9iamVjdCk6IHN0cmluZyB7XG4gICAgcmV0dXJuIGBbJHthc3QuZW50cmllcy5tYXAoZW50cnkgPT4gZW50cnkudmlzaXRFeHByZXNzaW9uKHRoaXMsIGNvbnRleHQpKS5qb2luKCcsJyl9XWA7XG4gIH1cblxuICB2aXNpdExpdGVyYWxNYXBFeHByKGFzdDogby5MaXRlcmFsTWFwRXhwciwgY29udGV4dDogb2JqZWN0KTogc3RyaW5nIHtcbiAgICBjb25zdCBtYXBLZXkgPSAoZW50cnk6IG8uTGl0ZXJhbE1hcEVudHJ5KSA9PiB7XG4gICAgICBjb25zdCBxdW90ZSA9IGVudHJ5LnF1b3RlZCA/ICdcIicgOiAnJztcbiAgICAgIHJldHVybiBgJHtxdW90ZX0ke2VudHJ5LmtleX0ke3F1b3RlfWA7XG4gICAgfTtcbiAgICBjb25zdCBtYXBFbnRyeSA9IChlbnRyeTogby5MaXRlcmFsTWFwRW50cnkpID0+XG4gICAgICAgIGAke21hcEtleShlbnRyeSl9OiR7ZW50cnkudmFsdWUudmlzaXRFeHByZXNzaW9uKHRoaXMsIGNvbnRleHQpfWA7XG4gICAgcmV0dXJuIGB7JHthc3QuZW50cmllcy5tYXAobWFwRW50cnkpLmpvaW4oJywnKX1gO1xuICB9XG5cbiAgdmlzaXRFeHRlcm5hbEV4cHIoYXN0OiBvLkV4dGVybmFsRXhwcik6IHN0cmluZyB7XG4gICAgcmV0dXJuIGFzdC52YWx1ZS5tb2R1bGVOYW1lID8gYEVYOiR7YXN0LnZhbHVlLm1vZHVsZU5hbWV9OiR7YXN0LnZhbHVlLm5hbWV9YCA6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYEVYOiR7YXN0LnZhbHVlLnJ1bnRpbWUubmFtZX1gO1xuICB9XG5cbiAgdmlzaXRSZWFkVmFyRXhwcihub2RlOiBvLlJlYWRWYXJFeHByKSB7XG4gICAgcmV0dXJuIGBWQVI6JHtub2RlLm5hbWV9YDtcbiAgfVxuXG4gIHZpc2l0VHlwZW9mRXhwcihub2RlOiBvLlR5cGVvZkV4cHIsIGNvbnRleHQ6IGFueSk6IHN0cmluZyB7XG4gICAgcmV0dXJuIGBUWVBFT0Y6JHtub2RlLmV4cHIudmlzaXRFeHByZXNzaW9uKHRoaXMsIGNvbnRleHQpfWA7XG4gIH1cblxuICB2aXNpdFdyYXBwZWROb2RlRXhwciA9IGludmFsaWQ7XG4gIHZpc2l0V3JpdGVWYXJFeHByID0gaW52YWxpZDtcbiAgdmlzaXRXcml0ZUtleUV4cHIgPSBpbnZhbGlkO1xuICB2aXNpdFdyaXRlUHJvcEV4cHIgPSBpbnZhbGlkO1xuICB2aXNpdEludm9rZUZ1bmN0aW9uRXhwciA9IGludmFsaWQ7XG4gIHZpc2l0VGFnZ2VkVGVtcGxhdGVFeHByID0gaW52YWxpZDtcbiAgdmlzaXRJbnN0YW50aWF0ZUV4cHIgPSBpbnZhbGlkO1xuICB2aXNpdENvbmRpdGlvbmFsRXhwciA9IGludmFsaWQ7XG4gIHZpc2l0Tm90RXhwciA9IGludmFsaWQ7XG4gIHZpc2l0QXNzZXJ0Tm90TnVsbEV4cHIgPSBpbnZhbGlkO1xuICB2aXNpdENhc3RFeHByID0gaW52YWxpZDtcbiAgdmlzaXRGdW5jdGlvbkV4cHIgPSBpbnZhbGlkO1xuICB2aXNpdFVuYXJ5T3BlcmF0b3JFeHByID0gaW52YWxpZDtcbiAgdmlzaXRCaW5hcnlPcGVyYXRvckV4cHIgPSBpbnZhbGlkO1xuICB2aXNpdFJlYWRQcm9wRXhwciA9IGludmFsaWQ7XG4gIHZpc2l0UmVhZEtleUV4cHIgPSBpbnZhbGlkO1xuICB2aXNpdENvbW1hRXhwciA9IGludmFsaWQ7XG4gIHZpc2l0TG9jYWxpemVkU3RyaW5nID0gaW52YWxpZDtcbn1cblxuZnVuY3Rpb24gaW52YWxpZDxUPih0aGlzOiBvLkV4cHJlc3Npb25WaXNpdG9yLCBhcmc6IG8uRXhwcmVzc2lvbnxvLlN0YXRlbWVudCk6IG5ldmVyIHtcbiAgdGhyb3cgbmV3IEVycm9yKFxuICAgICAgYEludmFsaWQgc3RhdGU6IFZpc2l0b3IgJHt0aGlzLmNvbnN0cnVjdG9yLm5hbWV9IGRvZXNuJ3QgaGFuZGxlICR7YXJnLmNvbnN0cnVjdG9yLm5hbWV9YCk7XG59XG5cbmZ1bmN0aW9uIGlzVmFyaWFibGUoZTogby5FeHByZXNzaW9uKTogZSBpcyBvLlJlYWRWYXJFeHByIHtcbiAgcmV0dXJuIGUgaW5zdGFuY2VvZiBvLlJlYWRWYXJFeHByO1xufVxuXG5mdW5jdGlvbiBpc0xvbmdTdHJpbmdMaXRlcmFsKGV4cHI6IG8uRXhwcmVzc2lvbik6IGJvb2xlYW4ge1xuICByZXR1cm4gZXhwciBpbnN0YW5jZW9mIG8uTGl0ZXJhbEV4cHIgJiYgdHlwZW9mIGV4cHIudmFsdWUgPT09ICdzdHJpbmcnICYmXG4gICAgICBleHByLnZhbHVlLmxlbmd0aCA+PSBQT09MX0lOQ0xVU0lPTl9MRU5HVEhfVEhSRVNIT0xEX0ZPUl9TVFJJTkdTO1xufVxuIl19