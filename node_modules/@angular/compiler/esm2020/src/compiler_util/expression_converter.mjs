/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import * as cdAst from '../expression_parser/ast';
import * as o from '../output/output_ast';
import { ParseSourceSpan } from '../parse_util';
export class EventHandlerVars {
}
EventHandlerVars.event = o.variable('$event');
/**
 * Converts the given expression AST into an executable output AST, assuming the expression is
 * used in an action binding (e.g. an event handler).
 */
export function convertActionBinding(localResolver, implicitReceiver, action, bindingId, baseSourceSpan, implicitReceiverAccesses, globals) {
    if (!localResolver) {
        localResolver = new DefaultLocalResolver(globals);
    }
    const actionWithoutBuiltins = convertPropertyBindingBuiltins({
        createLiteralArrayConverter: (argCount) => {
            // Note: no caching for literal arrays in actions.
            return (args) => o.literalArr(args);
        },
        createLiteralMapConverter: (keys) => {
            // Note: no caching for literal maps in actions.
            return (values) => {
                const entries = keys.map((k, i) => ({
                    key: k.key,
                    value: values[i],
                    quoted: k.quoted,
                }));
                return o.literalMap(entries);
            };
        },
        createPipeConverter: (name) => {
            throw new Error(`Illegal State: Actions are not allowed to contain pipes. Pipe: ${name}`);
        }
    }, action);
    const visitor = new _AstToIrVisitor(localResolver, implicitReceiver, bindingId, /* supportsInterpolation */ false, baseSourceSpan, implicitReceiverAccesses);
    const actionStmts = [];
    flattenStatements(actionWithoutBuiltins.visit(visitor, _Mode.Statement), actionStmts);
    prependTemporaryDecls(visitor.temporaryCount, bindingId, actionStmts);
    if (visitor.usesImplicitReceiver) {
        localResolver.notifyImplicitReceiverUse();
    }
    const lastIndex = actionStmts.length - 1;
    if (lastIndex >= 0) {
        const lastStatement = actionStmts[lastIndex];
        // Ensure that the value of the last expression statement is returned
        if (lastStatement instanceof o.ExpressionStatement) {
            actionStmts[lastIndex] = new o.ReturnStatement(lastStatement.expr);
        }
    }
    return actionStmts;
}
export function convertPropertyBindingBuiltins(converterFactory, ast) {
    return convertBuiltins(converterFactory, ast);
}
export class ConvertPropertyBindingResult {
    constructor(stmts, currValExpr) {
        this.stmts = stmts;
        this.currValExpr = currValExpr;
    }
}
/**
 * Converts the given expression AST into an executable output AST, assuming the expression
 * is used in property binding. The expression has to be preprocessed via
 * `convertPropertyBindingBuiltins`.
 */
export function convertPropertyBinding(localResolver, implicitReceiver, expressionWithoutBuiltins, bindingId) {
    if (!localResolver) {
        localResolver = new DefaultLocalResolver();
    }
    const visitor = new _AstToIrVisitor(localResolver, implicitReceiver, bindingId, /* supportsInterpolation */ false);
    const outputExpr = expressionWithoutBuiltins.visit(visitor, _Mode.Expression);
    const stmts = getStatementsFromVisitor(visitor, bindingId);
    if (visitor.usesImplicitReceiver) {
        localResolver.notifyImplicitReceiverUse();
    }
    return new ConvertPropertyBindingResult(stmts, outputExpr);
}
/**
 * Given some expression, such as a binding or interpolation expression, and a context expression to
 * look values up on, visit each facet of the given expression resolving values from the context
 * expression such that a list of arguments can be derived from the found values that can be used as
 * arguments to an external update instruction.
 *
 * @param localResolver The resolver to use to look up expressions by name appropriately
 * @param contextVariableExpression The expression representing the context variable used to create
 * the final argument expressions
 * @param expressionWithArgumentsToExtract The expression to visit to figure out what values need to
 * be resolved and what arguments list to build.
 * @param bindingId A name prefix used to create temporary variable names if they're needed for the
 * arguments generated
 * @returns An array of expressions that can be passed as arguments to instruction expressions like
 * `o.importExpr(R3.propertyInterpolate).callFn(result)`
 */
export function convertUpdateArguments(localResolver, contextVariableExpression, expressionWithArgumentsToExtract, bindingId) {
    const visitor = new _AstToIrVisitor(localResolver, contextVariableExpression, bindingId, /* supportsInterpolation */ true);
    const outputExpr = visitor.visitInterpolation(expressionWithArgumentsToExtract, _Mode.Expression);
    if (visitor.usesImplicitReceiver) {
        localResolver.notifyImplicitReceiverUse();
    }
    const stmts = getStatementsFromVisitor(visitor, bindingId);
    const args = outputExpr.args;
    return { stmts, args };
}
function getStatementsFromVisitor(visitor, bindingId) {
    const stmts = [];
    for (let i = 0; i < visitor.temporaryCount; i++) {
        stmts.push(temporaryDeclaration(bindingId, i));
    }
    return stmts;
}
function convertBuiltins(converterFactory, ast) {
    const visitor = new _BuiltinAstConverter(converterFactory);
    return ast.visit(visitor);
}
function temporaryName(bindingId, temporaryNumber) {
    return `tmp_${bindingId}_${temporaryNumber}`;
}
function temporaryDeclaration(bindingId, temporaryNumber) {
    return new o.DeclareVarStmt(temporaryName(bindingId, temporaryNumber));
}
function prependTemporaryDecls(temporaryCount, bindingId, statements) {
    for (let i = temporaryCount - 1; i >= 0; i--) {
        statements.unshift(temporaryDeclaration(bindingId, i));
    }
}
var _Mode;
(function (_Mode) {
    _Mode[_Mode["Statement"] = 0] = "Statement";
    _Mode[_Mode["Expression"] = 1] = "Expression";
})(_Mode || (_Mode = {}));
function ensureStatementMode(mode, ast) {
    if (mode !== _Mode.Statement) {
        throw new Error(`Expected a statement, but saw ${ast}`);
    }
}
function ensureExpressionMode(mode, ast) {
    if (mode !== _Mode.Expression) {
        throw new Error(`Expected an expression, but saw ${ast}`);
    }
}
function convertToStatementIfNeeded(mode, expr) {
    if (mode === _Mode.Statement) {
        return expr.toStmt();
    }
    else {
        return expr;
    }
}
class _BuiltinAstConverter extends cdAst.AstTransformer {
    constructor(_converterFactory) {
        super();
        this._converterFactory = _converterFactory;
    }
    visitPipe(ast, context) {
        const args = [ast.exp, ...ast.args].map(ast => ast.visit(this, context));
        return new BuiltinFunctionCall(ast.span, ast.sourceSpan, args, this._converterFactory.createPipeConverter(ast.name, args.length));
    }
    visitLiteralArray(ast, context) {
        const args = ast.expressions.map(ast => ast.visit(this, context));
        return new BuiltinFunctionCall(ast.span, ast.sourceSpan, args, this._converterFactory.createLiteralArrayConverter(ast.expressions.length));
    }
    visitLiteralMap(ast, context) {
        const args = ast.values.map(ast => ast.visit(this, context));
        return new BuiltinFunctionCall(ast.span, ast.sourceSpan, args, this._converterFactory.createLiteralMapConverter(ast.keys));
    }
}
class _AstToIrVisitor {
    constructor(_localResolver, _implicitReceiver, bindingId, supportsInterpolation, baseSourceSpan, implicitReceiverAccesses) {
        this._localResolver = _localResolver;
        this._implicitReceiver = _implicitReceiver;
        this.bindingId = bindingId;
        this.supportsInterpolation = supportsInterpolation;
        this.baseSourceSpan = baseSourceSpan;
        this.implicitReceiverAccesses = implicitReceiverAccesses;
        this._nodeMap = new Map();
        this._resultMap = new Map();
        this._currentTemporary = 0;
        this.temporaryCount = 0;
        this.usesImplicitReceiver = false;
    }
    visitUnary(ast, mode) {
        let op;
        switch (ast.operator) {
            case '+':
                op = o.UnaryOperator.Plus;
                break;
            case '-':
                op = o.UnaryOperator.Minus;
                break;
            default:
                throw new Error(`Unsupported operator ${ast.operator}`);
        }
        return convertToStatementIfNeeded(mode, new o.UnaryOperatorExpr(op, this._visit(ast.expr, _Mode.Expression), undefined, this.convertSourceSpan(ast.span)));
    }
    visitBinary(ast, mode) {
        let op;
        switch (ast.operation) {
            case '+':
                op = o.BinaryOperator.Plus;
                break;
            case '-':
                op = o.BinaryOperator.Minus;
                break;
            case '*':
                op = o.BinaryOperator.Multiply;
                break;
            case '/':
                op = o.BinaryOperator.Divide;
                break;
            case '%':
                op = o.BinaryOperator.Modulo;
                break;
            case '&&':
                op = o.BinaryOperator.And;
                break;
            case '||':
                op = o.BinaryOperator.Or;
                break;
            case '==':
                op = o.BinaryOperator.Equals;
                break;
            case '!=':
                op = o.BinaryOperator.NotEquals;
                break;
            case '===':
                op = o.BinaryOperator.Identical;
                break;
            case '!==':
                op = o.BinaryOperator.NotIdentical;
                break;
            case '<':
                op = o.BinaryOperator.Lower;
                break;
            case '>':
                op = o.BinaryOperator.Bigger;
                break;
            case '<=':
                op = o.BinaryOperator.LowerEquals;
                break;
            case '>=':
                op = o.BinaryOperator.BiggerEquals;
                break;
            case '??':
                return this.convertNullishCoalesce(ast, mode);
            default:
                throw new Error(`Unsupported operation ${ast.operation}`);
        }
        return convertToStatementIfNeeded(mode, new o.BinaryOperatorExpr(op, this._visit(ast.left, _Mode.Expression), this._visit(ast.right, _Mode.Expression), undefined, this.convertSourceSpan(ast.span)));
    }
    visitChain(ast, mode) {
        ensureStatementMode(mode, ast);
        return this.visitAll(ast.expressions, mode);
    }
    visitConditional(ast, mode) {
        const value = this._visit(ast.condition, _Mode.Expression);
        return convertToStatementIfNeeded(mode, value.conditional(this._visit(ast.trueExp, _Mode.Expression), this._visit(ast.falseExp, _Mode.Expression), this.convertSourceSpan(ast.span)));
    }
    visitPipe(ast, mode) {
        throw new Error(`Illegal state: Pipes should have been converted into functions. Pipe: ${ast.name}`);
    }
    visitImplicitReceiver(ast, mode) {
        ensureExpressionMode(mode, ast);
        this.usesImplicitReceiver = true;
        return this._implicitReceiver;
    }
    visitThisReceiver(ast, mode) {
        return this.visitImplicitReceiver(ast, mode);
    }
    visitInterpolation(ast, mode) {
        if (!this.supportsInterpolation) {
            throw new Error('Unexpected interpolation');
        }
        ensureExpressionMode(mode, ast);
        let args = [];
        for (let i = 0; i < ast.strings.length - 1; i++) {
            args.push(o.literal(ast.strings[i]));
            args.push(this._visit(ast.expressions[i], _Mode.Expression));
        }
        args.push(o.literal(ast.strings[ast.strings.length - 1]));
        // If we're dealing with an interpolation of 1 value with an empty prefix and suffix, reduce the
        // args returned to just the value, because we're going to pass it to a special instruction.
        const strings = ast.strings;
        if (strings.length === 2 && strings[0] === '' && strings[1] === '') {
            // Single argument interpolate instructions.
            args = [args[1]];
        }
        else if (ast.expressions.length >= 9) {
            // 9 or more arguments must be passed to the `interpolateV`-style instructions, which accept
            // an array of arguments
            args = [o.literalArr(args)];
        }
        return new InterpolationExpression(args);
    }
    visitKeyedRead(ast, mode) {
        const leftMostSafe = this.leftMostSafeNode(ast);
        if (leftMostSafe) {
            return this.convertSafeAccess(ast, leftMostSafe, mode);
        }
        else {
            return convertToStatementIfNeeded(mode, this._visit(ast.receiver, _Mode.Expression).key(this._visit(ast.key, _Mode.Expression)));
        }
    }
    visitKeyedWrite(ast, mode) {
        const obj = this._visit(ast.receiver, _Mode.Expression);
        const key = this._visit(ast.key, _Mode.Expression);
        const value = this._visit(ast.value, _Mode.Expression);
        if (obj === this._implicitReceiver) {
            this._localResolver.maybeRestoreView();
        }
        return convertToStatementIfNeeded(mode, obj.key(key).set(value));
    }
    visitLiteralArray(ast, mode) {
        throw new Error(`Illegal State: literal arrays should have been converted into functions`);
    }
    visitLiteralMap(ast, mode) {
        throw new Error(`Illegal State: literal maps should have been converted into functions`);
    }
    visitLiteralPrimitive(ast, mode) {
        // For literal values of null, undefined, true, or false allow type interference
        // to infer the type.
        const type = ast.value === null || ast.value === undefined || ast.value === true || ast.value === true ?
            o.INFERRED_TYPE :
            undefined;
        return convertToStatementIfNeeded(mode, o.literal(ast.value, type, this.convertSourceSpan(ast.span)));
    }
    _getLocal(name, receiver) {
        if (this._localResolver.globals?.has(name) && receiver instanceof cdAst.ThisReceiver) {
            return null;
        }
        return this._localResolver.getLocal(name);
    }
    visitPrefixNot(ast, mode) {
        return convertToStatementIfNeeded(mode, o.not(this._visit(ast.expression, _Mode.Expression)));
    }
    visitNonNullAssert(ast, mode) {
        return convertToStatementIfNeeded(mode, this._visit(ast.expression, _Mode.Expression));
    }
    visitPropertyRead(ast, mode) {
        const leftMostSafe = this.leftMostSafeNode(ast);
        if (leftMostSafe) {
            return this.convertSafeAccess(ast, leftMostSafe, mode);
        }
        else {
            let result = null;
            const prevUsesImplicitReceiver = this.usesImplicitReceiver;
            const receiver = this._visit(ast.receiver, _Mode.Expression);
            if (receiver === this._implicitReceiver) {
                result = this._getLocal(ast.name, ast.receiver);
                if (result) {
                    // Restore the previous "usesImplicitReceiver" state since the implicit
                    // receiver has been replaced with a resolved local expression.
                    this.usesImplicitReceiver = prevUsesImplicitReceiver;
                    this.addImplicitReceiverAccess(ast.name);
                }
            }
            if (result == null) {
                result = receiver.prop(ast.name, this.convertSourceSpan(ast.span));
            }
            return convertToStatementIfNeeded(mode, result);
        }
    }
    visitPropertyWrite(ast, mode) {
        const receiver = this._visit(ast.receiver, _Mode.Expression);
        const prevUsesImplicitReceiver = this.usesImplicitReceiver;
        let varExpr = null;
        if (receiver === this._implicitReceiver) {
            const localExpr = this._getLocal(ast.name, ast.receiver);
            if (localExpr) {
                if (localExpr instanceof o.ReadPropExpr) {
                    // If the local variable is a property read expression, it's a reference
                    // to a 'context.property' value and will be used as the target of the
                    // write expression.
                    varExpr = localExpr;
                    // Restore the previous "usesImplicitReceiver" state since the implicit
                    // receiver has been replaced with a resolved local expression.
                    this.usesImplicitReceiver = prevUsesImplicitReceiver;
                    this.addImplicitReceiverAccess(ast.name);
                }
                else {
                    // Otherwise it's an error.
                    const receiver = ast.name;
                    const value = (ast.value instanceof cdAst.PropertyRead) ? ast.value.name : undefined;
                    throw new Error(`Cannot assign value "${value}" to template variable "${receiver}". Template variables are read-only.`);
                }
            }
        }
        // If no local expression could be produced, use the original receiver's
        // property as the target.
        if (varExpr === null) {
            varExpr = receiver.prop(ast.name, this.convertSourceSpan(ast.span));
        }
        return convertToStatementIfNeeded(mode, varExpr.set(this._visit(ast.value, _Mode.Expression)));
    }
    visitSafePropertyRead(ast, mode) {
        return this.convertSafeAccess(ast, this.leftMostSafeNode(ast), mode);
    }
    visitSafeKeyedRead(ast, mode) {
        return this.convertSafeAccess(ast, this.leftMostSafeNode(ast), mode);
    }
    visitAll(asts, mode) {
        return asts.map(ast => this._visit(ast, mode));
    }
    visitQuote(ast, mode) {
        throw new Error(`Quotes are not supported for evaluation!
        Statement: ${ast.uninterpretedExpression} located at ${ast.location}`);
    }
    visitCall(ast, mode) {
        const leftMostSafe = this.leftMostSafeNode(ast);
        if (leftMostSafe) {
            return this.convertSafeAccess(ast, leftMostSafe, mode);
        }
        const convertedArgs = this.visitAll(ast.args, _Mode.Expression);
        if (ast instanceof BuiltinFunctionCall) {
            return convertToStatementIfNeeded(mode, ast.converter(convertedArgs));
        }
        const receiver = ast.receiver;
        if (receiver instanceof cdAst.PropertyRead &&
            receiver.receiver instanceof cdAst.ImplicitReceiver &&
            !(receiver.receiver instanceof cdAst.ThisReceiver) && receiver.name === '$any') {
            if (convertedArgs.length !== 1) {
                throw new Error(`Invalid call to $any, expected 1 argument but received ${convertedArgs.length || 'none'}`);
            }
            return convertToStatementIfNeeded(mode, convertedArgs[0]);
        }
        const call = this._visit(receiver, _Mode.Expression)
            .callFn(convertedArgs, this.convertSourceSpan(ast.span));
        return convertToStatementIfNeeded(mode, call);
    }
    visitSafeCall(ast, mode) {
        return this.convertSafeAccess(ast, this.leftMostSafeNode(ast), mode);
    }
    _visit(ast, mode) {
        const result = this._resultMap.get(ast);
        if (result)
            return result;
        return (this._nodeMap.get(ast) || ast).visit(this, mode);
    }
    convertSafeAccess(ast, leftMostSafe, mode) {
        // If the expression contains a safe access node on the left it needs to be converted to
        // an expression that guards the access to the member by checking the receiver for blank. As
        // execution proceeds from left to right, the left most part of the expression must be guarded
        // first but, because member access is left associative, the right side of the expression is at
        // the top of the AST. The desired result requires lifting a copy of the left part of the
        // expression up to test it for blank before generating the unguarded version.
        // Consider, for example the following expression: a?.b.c?.d.e
        // This results in the ast:
        //         .
        //        / \
        //       ?.   e
        //      /  \
        //     .    d
        //    / \
        //   ?.  c
        //  /  \
        // a    b
        // The following tree should be generated:
        //
        //        /---- ? ----\
        //       /      |      \
        //     a   /--- ? ---\  null
        //        /     |     \
        //       .      .     null
        //      / \    / \
        //     .  c   .   e
        //    / \    / \
        //   a   b  .   d
        //         / \
        //        .   c
        //       / \
        //      a   b
        //
        // Notice that the first guard condition is the left hand of the left most safe access node
        // which comes in as leftMostSafe to this routine.
        let guardedExpression = this._visit(leftMostSafe.receiver, _Mode.Expression);
        let temporary = undefined;
        if (this.needsTemporaryInSafeAccess(leftMostSafe.receiver)) {
            // If the expression has method calls or pipes then we need to save the result into a
            // temporary variable to avoid calling stateful or impure code more than once.
            temporary = this.allocateTemporary();
            // Preserve the result in the temporary variable
            guardedExpression = temporary.set(guardedExpression);
            // Ensure all further references to the guarded expression refer to the temporary instead.
            this._resultMap.set(leftMostSafe.receiver, temporary);
        }
        const condition = guardedExpression.isBlank();
        // Convert the ast to an unguarded access to the receiver's member. The map will substitute
        // leftMostNode with its unguarded version in the call to `this.visit()`.
        if (leftMostSafe instanceof cdAst.SafeCall) {
            this._nodeMap.set(leftMostSafe, new cdAst.Call(leftMostSafe.span, leftMostSafe.sourceSpan, leftMostSafe.receiver, leftMostSafe.args, leftMostSafe.argumentSpan));
        }
        else if (leftMostSafe instanceof cdAst.SafeKeyedRead) {
            this._nodeMap.set(leftMostSafe, new cdAst.KeyedRead(leftMostSafe.span, leftMostSafe.sourceSpan, leftMostSafe.receiver, leftMostSafe.key));
        }
        else {
            this._nodeMap.set(leftMostSafe, new cdAst.PropertyRead(leftMostSafe.span, leftMostSafe.sourceSpan, leftMostSafe.nameSpan, leftMostSafe.receiver, leftMostSafe.name));
        }
        // Recursively convert the node now without the guarded member access.
        const access = this._visit(ast, _Mode.Expression);
        // Remove the mapping. This is not strictly required as the converter only traverses each node
        // once but is safer if the conversion is changed to traverse the nodes more than once.
        this._nodeMap.delete(leftMostSafe);
        // If we allocated a temporary, release it.
        if (temporary) {
            this.releaseTemporary(temporary);
        }
        // Produce the conditional
        return convertToStatementIfNeeded(mode, condition.conditional(o.NULL_EXPR, access));
    }
    convertNullishCoalesce(ast, mode) {
        const left = this._visit(ast.left, _Mode.Expression);
        const right = this._visit(ast.right, _Mode.Expression);
        const temporary = this.allocateTemporary();
        this.releaseTemporary(temporary);
        // Generate the following expression. It is identical to how TS
        // transpiles binary expressions with a nullish coalescing operator.
        // let temp;
        // (temp = a) !== null && temp !== undefined ? temp : b;
        return convertToStatementIfNeeded(mode, temporary.set(left)
            .notIdentical(o.NULL_EXPR)
            .and(temporary.notIdentical(o.literal(undefined)))
            .conditional(temporary, right));
    }
    // Given an expression of the form a?.b.c?.d.e then the left most safe node is
    // the (a?.b). The . and ?. are left associative thus can be rewritten as:
    // ((((a?.c).b).c)?.d).e. This returns the most deeply nested safe read or
    // safe method call as this needs to be transformed initially to:
    //   a == null ? null : a.c.b.c?.d.e
    // then to:
    //   a == null ? null : a.b.c == null ? null : a.b.c.d.e
    leftMostSafeNode(ast) {
        const visit = (visitor, ast) => {
            return (this._nodeMap.get(ast) || ast).visit(visitor);
        };
        return ast.visit({
            visitUnary(ast) {
                return null;
            },
            visitBinary(ast) {
                return null;
            },
            visitChain(ast) {
                return null;
            },
            visitConditional(ast) {
                return null;
            },
            visitCall(ast) {
                return visit(this, ast.receiver);
            },
            visitSafeCall(ast) {
                return visit(this, ast.receiver) || ast;
            },
            visitImplicitReceiver(ast) {
                return null;
            },
            visitThisReceiver(ast) {
                return null;
            },
            visitInterpolation(ast) {
                return null;
            },
            visitKeyedRead(ast) {
                return visit(this, ast.receiver);
            },
            visitKeyedWrite(ast) {
                return null;
            },
            visitLiteralArray(ast) {
                return null;
            },
            visitLiteralMap(ast) {
                return null;
            },
            visitLiteralPrimitive(ast) {
                return null;
            },
            visitPipe(ast) {
                return null;
            },
            visitPrefixNot(ast) {
                return null;
            },
            visitNonNullAssert(ast) {
                return null;
            },
            visitPropertyRead(ast) {
                return visit(this, ast.receiver);
            },
            visitPropertyWrite(ast) {
                return null;
            },
            visitQuote(ast) {
                return null;
            },
            visitSafePropertyRead(ast) {
                return visit(this, ast.receiver) || ast;
            },
            visitSafeKeyedRead(ast) {
                return visit(this, ast.receiver) || ast;
            }
        });
    }
    // Returns true of the AST includes a method or a pipe indicating that, if the
    // expression is used as the target of a safe property or method access then
    // the expression should be stored into a temporary variable.
    needsTemporaryInSafeAccess(ast) {
        const visit = (visitor, ast) => {
            return ast && (this._nodeMap.get(ast) || ast).visit(visitor);
        };
        const visitSome = (visitor, ast) => {
            return ast.some(ast => visit(visitor, ast));
        };
        return ast.visit({
            visitUnary(ast) {
                return visit(this, ast.expr);
            },
            visitBinary(ast) {
                return visit(this, ast.left) || visit(this, ast.right);
            },
            visitChain(ast) {
                return false;
            },
            visitConditional(ast) {
                return visit(this, ast.condition) || visit(this, ast.trueExp) || visit(this, ast.falseExp);
            },
            visitCall(ast) {
                return true;
            },
            visitSafeCall(ast) {
                return true;
            },
            visitImplicitReceiver(ast) {
                return false;
            },
            visitThisReceiver(ast) {
                return false;
            },
            visitInterpolation(ast) {
                return visitSome(this, ast.expressions);
            },
            visitKeyedRead(ast) {
                return false;
            },
            visitKeyedWrite(ast) {
                return false;
            },
            visitLiteralArray(ast) {
                return true;
            },
            visitLiteralMap(ast) {
                return true;
            },
            visitLiteralPrimitive(ast) {
                return false;
            },
            visitPipe(ast) {
                return true;
            },
            visitPrefixNot(ast) {
                return visit(this, ast.expression);
            },
            visitNonNullAssert(ast) {
                return visit(this, ast.expression);
            },
            visitPropertyRead(ast) {
                return false;
            },
            visitPropertyWrite(ast) {
                return false;
            },
            visitQuote(ast) {
                return false;
            },
            visitSafePropertyRead(ast) {
                return false;
            },
            visitSafeKeyedRead(ast) {
                return false;
            }
        });
    }
    allocateTemporary() {
        const tempNumber = this._currentTemporary++;
        this.temporaryCount = Math.max(this._currentTemporary, this.temporaryCount);
        return new o.ReadVarExpr(temporaryName(this.bindingId, tempNumber));
    }
    releaseTemporary(temporary) {
        this._currentTemporary--;
        if (temporary.name != temporaryName(this.bindingId, this._currentTemporary)) {
            throw new Error(`Temporary ${temporary.name} released out of order`);
        }
    }
    /**
     * Creates an absolute `ParseSourceSpan` from the relative `ParseSpan`.
     *
     * `ParseSpan` objects are relative to the start of the expression.
     * This method converts these to full `ParseSourceSpan` objects that
     * show where the span is within the overall source file.
     *
     * @param span the relative span to convert.
     * @returns a `ParseSourceSpan` for the given span or null if no
     * `baseSourceSpan` was provided to this class.
     */
    convertSourceSpan(span) {
        if (this.baseSourceSpan) {
            const start = this.baseSourceSpan.start.moveBy(span.start);
            const end = this.baseSourceSpan.start.moveBy(span.end);
            const fullStart = this.baseSourceSpan.fullStart.moveBy(span.start);
            return new ParseSourceSpan(start, end, fullStart);
        }
        else {
            return null;
        }
    }
    /** Adds the name of an AST to the list of implicit receiver accesses. */
    addImplicitReceiverAccess(name) {
        if (this.implicitReceiverAccesses) {
            this.implicitReceiverAccesses.add(name);
        }
    }
}
function flattenStatements(arg, output) {
    if (Array.isArray(arg)) {
        arg.forEach((entry) => flattenStatements(entry, output));
    }
    else {
        output.push(arg);
    }
}
function unsupported() {
    throw new Error('Unsupported operation');
}
class InterpolationExpression extends o.Expression {
    constructor(args) {
        super(null, null);
        this.args = args;
        this.isConstant = unsupported;
        this.isEquivalent = unsupported;
        this.visitExpression = unsupported;
    }
}
class DefaultLocalResolver {
    constructor(globals) {
        this.globals = globals;
    }
    notifyImplicitReceiverUse() { }
    maybeRestoreView() { }
    getLocal(name) {
        if (name === EventHandlerVars.event.name) {
            return EventHandlerVars.event;
        }
        return null;
    }
}
export class BuiltinFunctionCall extends cdAst.Call {
    constructor(span, sourceSpan, args, converter) {
        super(span, sourceSpan, new cdAst.EmptyExpr(span, sourceSpan), args, null);
        this.converter = converter;
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXhwcmVzc2lvbl9jb252ZXJ0ZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9jb21waWxlci9zcmMvY29tcGlsZXJfdXRpbC9leHByZXNzaW9uX2NvbnZlcnRlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0dBTUc7QUFFSCxPQUFPLEtBQUssS0FBSyxNQUFNLDBCQUEwQixDQUFDO0FBQ2xELE9BQU8sS0FBSyxDQUFDLE1BQU0sc0JBQXNCLENBQUM7QUFDMUMsT0FBTyxFQUFDLGVBQWUsRUFBQyxNQUFNLGVBQWUsQ0FBQztBQUU5QyxNQUFNLE9BQU8sZ0JBQWdCOztBQUNwQixzQkFBSyxHQUFHLENBQUMsQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLENBQUM7QUFVdEM7OztHQUdHO0FBQ0gsTUFBTSxVQUFVLG9CQUFvQixDQUNoQyxhQUFpQyxFQUFFLGdCQUE4QixFQUFFLE1BQWlCLEVBQ3BGLFNBQWlCLEVBQUUsY0FBZ0MsRUFBRSx3QkFBc0MsRUFDM0YsT0FBcUI7SUFDdkIsSUFBSSxDQUFDLGFBQWEsRUFBRTtRQUNsQixhQUFhLEdBQUcsSUFBSSxvQkFBb0IsQ0FBQyxPQUFPLENBQUMsQ0FBQztLQUNuRDtJQUNELE1BQU0scUJBQXFCLEdBQUcsOEJBQThCLENBQ3hEO1FBQ0UsMkJBQTJCLEVBQUUsQ0FBQyxRQUFnQixFQUFFLEVBQUU7WUFDaEQsa0RBQWtEO1lBQ2xELE9BQU8sQ0FBQyxJQUFvQixFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ3RELENBQUM7UUFDRCx5QkFBeUIsRUFBRSxDQUFDLElBQXNDLEVBQUUsRUFBRTtZQUNwRSxnREFBZ0Q7WUFDaEQsT0FBTyxDQUFDLE1BQXNCLEVBQUUsRUFBRTtnQkFDaEMsTUFBTSxPQUFPLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVB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QjtRQUNwQyxLQUFLLENBQUMsSUFBSSxFQUFFLFVBQVUsRUFBRSxJQUFJLEtBQUssQ0FBQyxTQUFTLENBQUMsSUFBSSxFQUFFLFVBQVUsQ0FBQyxFQUFFLElBQUksRUFBRSxJQUFLLENBQUMsQ0FBQztRQURuRSxjQUFTLEdBQVQsU0FBUyxDQUFrQjtJQUV0QyxDQUFDO0NBQ0YiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0ICogYXMgY2RBc3QgZnJvbSAnLi4vZXhwcmVzc2lvbl9wYXJzZXIvYXN0JztcbmltcG9ydCAqIGFzIG8gZnJvbSAnLi4vb3V0cHV0L291dHB1dF9hc3QnO1xuaW1wb3J0IHtQYXJzZVNvdXJjZVNwYW59IGZyb20gJy4uL3BhcnNlX3V0aWwnO1xuXG5leHBvcnQgY2xhc3MgRXZlbnRIYW5kbGVyVmFycyB7XG4gIHN0YXRpYyBldmVudCA9IG8udmFyaWFibGUoJyRldmVudCcpO1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIExvY2FsUmVzb2x2ZXIge1xuICBnZXRMb2NhbChuYW1lOiBzdHJpbmcpOiBvLkV4cHJlc3Npb258bnVsbDtcbiAgbm90aWZ5SW1wbGljaXRSZWNlaXZlclVzZSgpOiB2b2lkO1xuICBnbG9iYWxzPzogU2V0PHN0cmluZz47XG4gIG1heWJlUmVzdG9yZVZpZXcoKTogdm9pZDtcbn1cblxuLyoqXG4gKiBDb252ZXJ0cyB0aGUgZ2l2ZW4gZXhwcmVzc2lvbiBBU1QgaW50byBhbiBleGVjdXRhYmxlIG91dHB1dCBBU1QsIGFzc3VtaW5nIHRoZSBleHByZXNzaW9uIGlzXG4gKiB1c2VkIGluIGFuIGFjdGlvbiBiaW5kaW5nIChlLmcuIGFuIGV2ZW50IGhhbmRsZXIpLlxuICovXG5leHBvcnQgZnVuY3Rpb24gY29udmVydEFjdGlvbkJpbmRpbmcoXG4gICAgbG9jYWxSZXNvbHZlcjogTG9jYWxSZXNvbHZlcnxudWxsLCBpbXBsaWNpdFJlY2VpdmVyOiBvLkV4cHJlc3Npb24sIGFjdGlvbjogY2RBc3QuQVNULFxuICAgIGJpbmRpbmdJZDogc3RyaW5nLCBiYXNlU291cmNlU3Bhbj86IFBhcnNlU291cmNlU3BhbiwgaW1wbGljaXRSZWNlaXZlckFjY2Vzc2VzPzogU2V0PHN0cmluZz4sXG4gICAgZ2xvYmFscz86IFNldDxzdHJpbmc+KTogby5TdGF0ZW1lbnRbXSB7XG4gIGlmICghbG9jYWxSZXNvbHZlcikge1xuICAgIGxvY2FsUmVzb2x2ZXIgPSBuZXcgRGVmYXVsdExvY2FsUmVzb2x2ZXIoZ2xvYmFscyk7XG4gIH1cbiAgY29uc3QgYWN0aW9uV2l0aG91dEJ1aWx0aW5zID0gY29udmVydFByb3BlcnR5QmluZGluZ0J1aWx0aW5zKFxuICAgICAge1xuICAgICAgICBjcmVhdGVMaXRlcmFsQXJyYXlDb252ZXJ0ZXI6IChhcmdDb3VudDogbnVtYmVyKSA9PiB7XG4gICAgICAgICAgLy8gTm90ZTogbm8gY2FjaGluZyBmb3IgbGl0ZXJhbCBhcnJheXMgaW4gYWN0aW9ucy5cbiAgICAgICAgICByZXR1cm4gKGFyZ3M6IG8uRXhwcmVzc2lvbltdKSA9PiBvLmxpdGVyYWxBcnIoYXJncyk7XG4gICAgICAgIH0sXG4gICAgICAgIGNyZWF0ZUxpdGVyYWxNYXBDb252ZXJ0ZXI6IChrZXlzOiB7a2V5OiBzdHJpbmcsIHF1b3RlZDogYm9vbGVhbn1bXSkgPT4ge1xuICAgICAgICAgIC8vIE5vdGU6IG5vIGNhY2hpbmcgZm9yIGxpdGVyYWwgbWFwcyBpbiBhY3Rpb25zLlxuICAgICAgICAgIHJldHVybiAodmFsdWVzOiBvLkV4cHJlc3Npb25bXSkgPT4ge1xuICAgICAgICAgICAgY29uc3QgZW50cmllcyA9IGtleXMubWFwKChrLCBpKSA9PiAoe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAga2V5OiBrLmtleSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlOiB2YWx1ZXNbaV0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBxdW90ZWQ6IGsucXVvdGVkLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pKTtcbiAgICAgICAgICAgIHJldHVybiBvLmxpdGVyYWxNYXAoZW50cmllcyk7XG4gICAgICAgICAgfTtcbiAgICAgICAgfSxcbiAgICAgICAgY3JlYXRlUGlwZUNvbnZlcnRlcjogKG5hbWU6IHN0cmluZykgPT4ge1xuICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgSWxsZWdhbCBTdGF0ZTogQWN0aW9ucyBhcmUgbm90IGFsbG93ZWQgdG8gY29udGFpbiBwaXBlcy4gUGlwZTogJHtuYW1lfWApO1xuICAgICAgICB9XG4gICAgICB9LFxuICAgICAgYWN0aW9uKTtcblxuICBjb25zdCB2aXNpdG9yID0gbmV3IF9Bc3RUb0lyVmlzaXRvcihcbiAgICAgIGxvY2FsUmVzb2x2ZXIsIGltcGxpY2l0UmVjZWl2ZXIsIGJpbmRpbmdJZCwgLyogc3VwcG9ydHNJbnRlcnBvbGF0aW9uICovIGZhbHNlLCBiYXNlU291cmNlU3BhbixcbiAgICAgIGltcGxpY2l0UmVjZWl2ZXJBY2Nlc3Nlcyk7XG4gIGNvbnN0IGFjdGlvblN0bXRzOiBvLlN0YXRlbWVudFtdID0gW107XG4gIGZsYXR0ZW5TdGF0ZW1lbnRzKGFjdGlvbldpdGhvdXRCdWlsdGlucy52aXNpdCh2aXNpdG9yLCBfTW9kZS5TdGF0ZW1lbnQpLCBhY3Rpb25TdG10cyk7XG4gIHByZXBlbmRUZW1wb3JhcnlEZWNscyh2aXNpdG9yLnRlbXBvcmFyeUNvdW50LCBiaW5kaW5nSWQsIGFjdGlvblN0bXRzKTtcblxuICBpZiAodmlzaXRvci51c2VzSW1wbGljaXRSZWNlaXZlcikge1xuICAgIGxvY2FsUmVzb2x2ZXIubm90aWZ5SW1wbGljaXRSZWNlaXZlclVzZSgpO1xuICB9XG5cbiAgY29uc3QgbGFzdEluZGV4ID0gYWN0aW9uU3RtdHMubGVuZ3RoIC0gMTtcbiAgaWYgKGxhc3RJbmRleCA+PSAwKSB7XG4gICAgY29uc3QgbGFzdFN0YXRlbWVudCA9IGFjdGlvblN0bXRzW2xhc3RJbmRleF07XG4gICAgLy8gRW5zdXJlIHRoYXQgdGhlIHZhbHVlIG9mIHRoZSBsYXN0IGV4cHJlc3Npb24gc3RhdGVtZW50IGlzIHJldHVybmVkXG4gICAgaWYgKGxhc3RTdGF0ZW1lbnQgaW5zdGFuY2VvZiBvLkV4cHJlc3Npb25TdGF0ZW1lbnQpIHtcbiAgICAgIGFjdGlvblN0bXRzW2xhc3RJbmRleF0gPSBuZXcgby5SZXR1cm5TdGF0ZW1lbnQobGFzdFN0YXRlbWVudC5leHByKTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIGFjdGlvblN0bXRzO1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIEJ1aWx0aW5Db252ZXJ0ZXIge1xuICAoYXJnczogby5FeHByZXNzaW9uW10pOiBvLkV4cHJlc3Npb247XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgQnVpbHRpbkNvbnZlcnRlckZhY3Rvcnkge1xuICBjcmVhdGVMaXRlcmFsQXJyYXlDb252ZXJ0ZXIoYXJnQ291bnQ6IG51bWJlcik6IEJ1aWx0aW5Db252ZXJ0ZXI7XG4gIGNyZWF0ZUxpdGVyYWxNYXBDb252ZXJ0ZXIoa2V5czoge2tleTogc3RyaW5nLCBxdW90ZWQ6IGJvb2xlYW59W10pOiBCdWlsdGluQ29udmVydGVyO1xuICBjcmVhdGVQaXBlQ29udmVydGVyKG5hbWU6IHN0cmluZywgYXJnQ291bnQ6IG51bWJlcik6IEJ1aWx0aW5Db252ZXJ0ZXI7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBjb252ZXJ0UHJvcGVydHlCaW5kaW5nQnVpbHRpbnMoXG4gICAgY29udmVydGVyRmFjdG9yeTogQnVpbHRpbkNvbnZlcnRlckZhY3RvcnksIGFzdDogY2RBc3QuQVNUKTogY2RBc3QuQVNUIHtcbiAgcmV0dXJuIGNvbnZlcnRCdWlsdGlucyhjb252ZXJ0ZXJGYWN0b3J5LCBhc3QpO1xufVxuXG5leHBvcnQgY2xhc3MgQ29udmVydFByb3BlcnR5QmluZGluZ1Jlc3VsdCB7XG4gIGNvbnN0cnVjdG9yKHB1YmxpYyBzdG10czogby5TdGF0ZW1lbnRbXSwgcHVibGljIGN1cnJWYWxFeHByOiBvLkV4cHJlc3Npb24pIHt9XG59XG5cbi8qKlxuICogQ29udmVydHMgdGhlIGdpdmVuIGV4cHJlc3Npb24gQVNUIGludG8gYW4gZXhlY3V0YWJsZSBvdXRwdXQgQVNULCBhc3N1bWluZyB0aGUgZXhwcmVzc2lvblxuICogaXMgdXNlZCBpbiBwcm9wZXJ0eSBiaW5kaW5nLiBUaGUgZXhwcmVzc2lvbiBoYXMgdG8gYmUgcHJlcHJvY2Vzc2VkIHZpYVxuICogYGNvbnZlcnRQcm9wZXJ0eUJpbmRpbmdCdWlsdGluc2AuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBjb252ZXJ0UHJvcGVydHlCaW5kaW5nKFxuICAgIGxvY2FsUmVzb2x2ZXI6IExvY2FsUmVzb2x2ZXJ8bnVsbCwgaW1wbGljaXRSZWNlaXZlcjogby5FeHByZXNzaW9uLFxuICAgIGV4cHJlc3Npb25XaXRob3V0QnVpbHRpbnM6IGNkQXN0LkFTVCwgYmluZGluZ0lkOiBzdHJpbmcpOiBDb252ZXJ0UHJvcGVydHlCaW5kaW5nUmVzdWx0IHtcbiAgaWYgKCFsb2NhbFJlc29sdmVyKSB7XG4gICAgbG9jYWxSZXNvbHZlciA9IG5ldyBEZWZhdWx0TG9jYWxSZXNvbHZlcigpO1xuICB9XG4gIGNvbnN0IHZpc2l0b3IgPSBuZXcgX0FzdFRvSXJWaXNpdG9yKFxuICAgICAgbG9jYWxSZXNvbHZlciwgaW1wbGljaXRSZWNlaXZlciwgYmluZGluZ0lkLCAvKiBzdXBwb3J0c0ludGVycG9sYXRpb24gKi8gZmFsc2UpO1xuICBjb25zdCBvdXRwdXRFeHByOiBvLkV4cHJlc3Npb24gPSBleHByZXNzaW9uV2l0aG91dEJ1aWx0aW5zLnZpc2l0KHZpc2l0b3IsIF9Nb2RlLkV4cHJlc3Npb24pO1xuICBjb25zdCBzdG10czogby5TdGF0ZW1lbnRbXSA9IGdldFN0YXRlbWVudHNGcm9tVmlzaXRvcih2aXNpdG9yLCBiaW5kaW5nSWQpO1xuXG4gIGlmICh2aXNpdG9yLnVzZXNJbXBsaWNpdFJlY2VpdmVyKSB7XG4gICAgbG9jYWxSZXNvbHZlci5ub3RpZnlJbXBsaWNpdFJlY2VpdmVyVXNlKCk7XG4gIH1cblxuICByZXR1cm4gbmV3IENvbnZlcnRQcm9wZXJ0eUJpbmRpbmdSZXN1bHQoc3RtdHMsIG91dHB1dEV4cHIpO1xufVxuXG4vKipcbiAqIEdpdmVuIHNvbWUgZXhwcmVzc2lvbiwgc3VjaCBhcyBhIGJpbmRpbmcgb3IgaW50ZXJwb2xhdGlvbiBleHByZXNzaW9uLCBhbmQgYSBjb250ZXh0IGV4cHJlc3Npb24gdG9cbiAqIGxvb2sgdmFsdWVzIHVwIG9uLCB2aXNpdCBlYWNoIGZhY2V0IG9mIHRoZSBnaXZlbiBleHByZXNzaW9uIHJlc29sdmluZyB2YWx1ZXMgZnJvbSB0aGUgY29udGV4dFxuICogZXhwcmVzc2lvbiBzdWNoIHRoYXQgYSBsaXN0IG9mIGFyZ3VtZW50cyBjYW4gYmUgZGVyaXZlZCBmcm9tIHRoZSBmb3VuZCB2YWx1ZXMgdGhhdCBjYW4gYmUgdXNlZCBhc1xuICogYXJndW1lbnRzIHRvIGFuIGV4dGVybmFsIHVwZGF0ZSBpbnN0cnVjdGlvbi5cbiAqXG4gKiBAcGFyYW0gbG9jYWxSZXNvbHZlciBUaGUgcmVzb2x2ZXIgdG8gdXNlIHRvIGxvb2sgdXAgZXhwcmVzc2lvbnMgYnkgbmFtZSBhcHByb3ByaWF0ZWx5XG4gKiBAcGFyYW0gY29udGV4dFZhcmlhYmxlRXhwcmVzc2lvbiBUaGUgZXhwcmVzc2lvbiByZXByZXNlbnRpbmcgdGhlIGNvbnRleHQgdmFyaWFibGUgdXNlZCB0byBjcmVhdGVcbiAqIHRoZSBmaW5hbCBhcmd1bWVudCBleHByZXNzaW9uc1xuICogQHBhcmFtIGV4cHJlc3Npb25XaXRoQXJndW1lbnRzVG9FeHRyYWN0IFRoZSBleHByZXNzaW9uIHRvIHZpc2l0IHRvIGZpZ3VyZSBvdXQgd2hhdCB2YWx1ZXMgbmVlZCB0b1xuICogYmUgcmVzb2x2ZWQgYW5kIHdoYXQgYXJndW1lbnRzIGxpc3QgdG8gYnVpbGQuXG4gKiBAcGFyYW0gYmluZGluZ0lkIEEgbmFtZSBwcmVmaXggdXNlZCB0byBjcmVhdGUgdGVtcG9yYXJ5IHZhcmlhYmxlIG5hbWVzIGlmIHRoZXkncmUgbmVlZGVkIGZvciB0aGVcbiAqIGFyZ3VtZW50cyBnZW5lcmF0ZWRcbiAqIEByZXR1cm5zIEFuIGFycmF5IG9mIGV4cHJlc3Npb25zIHRoYXQgY2FuIGJlIHBhc3NlZCBhcyBhcmd1bWVudHMgdG8gaW5zdHJ1Y3Rpb24gZXhwcmVzc2lvbnMgbGlrZVxuICogYG8uaW1wb3J0RXhwcihSMy5wcm9wZXJ0eUludGVycG9sYXRlKS5jYWxsRm4ocmVzdWx0KWBcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGNvbnZlcnRVcGRhdGVBcmd1bWVudHMoXG4gICAgbG9jYWxSZXNvbHZlcjogTG9jYWxSZXNvbHZlciwgY29udGV4dFZhcmlhYmxlRXhwcmVzc2lvbjogby5FeHByZXNzaW9uLFxuICAgIGV4cHJlc3Npb25XaXRoQXJndW1lbnRzVG9FeHRyYWN0OiBjZEFzdC5JbnRlcnBvbGF0aW9uLCBiaW5kaW5nSWQ6IHN0cmluZykge1xuICBjb25zdCB2aXNpdG9yID0gbmV3IF9Bc3RUb0lyVmlzaXRvcihcbiAgICAgIGxvY2FsUmVzb2x2ZXIsIGNvbnRleHRWYXJpYWJsZUV4cHJlc3Npb24sIGJpbmRpbmdJZCwgLyogc3VwcG9ydHNJbnRlcnBvbGF0aW9uICovIHRydWUpO1xuICBjb25zdCBvdXRwdXRFeHByID0gdmlzaXRvci52aXNpdEludGVycG9sYXRpb24oZXhwcmVzc2lvbldpdGhBcmd1bWVudHNUb0V4dHJhY3QsIF9Nb2RlLkV4cHJlc3Npb24pO1xuXG4gIGlmICh2aXNpdG9yLnVzZXNJbXBsaWNpdFJlY2VpdmVyKSB7XG4gICAgbG9jYWxSZXNvbHZlci5ub3RpZnlJbXBsaWNpdFJlY2VpdmVyVXNlKCk7XG4gIH1cblxuICBjb25zdCBzdG10cyA9IGdldFN0YXRlbWVudHNGcm9tVmlzaXRvcih2aXNpdG9yLCBiaW5kaW5nSWQpO1xuICBjb25zdCBhcmdzID0gb3V0cHV0RXhwci5hcmdzO1xuICByZXR1cm4ge3N0bXRzLCBhcmdzfTtcbn1cblxuZnVuY3Rpb24gZ2V0U3RhdGVtZW50c0Zyb21WaXNpdG9yKHZpc2l0b3I6IF9Bc3RUb0lyVmlzaXRvciwgYmluZGluZ0lkOiBzdHJpbmcpIHtcbiAgY29uc3Qgc3RtdHM6IG8uU3RhdGVtZW50W10gPSBbXTtcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCB2aXNpdG9yLnRlbXBvcmFyeUNvdW50OyBpKyspIHtcbiAgICBzdG10cy5wdXNoKHRlbXBvcmFyeURlY2xhcmF0aW9uKGJpbmRpbmdJZCwgaSkpO1xuICB9XG4gIHJldHVybiBzdG10cztcbn1cblxuZnVuY3Rpb24gY29udmVydEJ1aWx0aW5zKGNvbnZlcnRlckZhY3Rvcnk6IEJ1aWx0aW5Db252ZXJ0ZXJGYWN0b3J5LCBhc3Q6IGNkQXN0LkFTVCk6IGNkQXN0LkFTVCB7XG4gIGNvbnN0IHZpc2l0b3IgPSBuZXcgX0J1aWx0aW5Bc3RDb252ZXJ0ZXIoY29udmVydGVyRmFjdG9yeSk7XG4gIHJldHVybiBhc3QudmlzaXQodmlzaXRvcik7XG59XG5cbmZ1bmN0aW9uIHRlbXBvcmFyeU5hbWUoYmluZGluZ0lkOiBzdHJpbmcsIHRlbXBvcmFyeU51bWJlcjogbnVtYmVyKTogc3RyaW5nIHtcbiAgcmV0dXJuIGB0bXBfJHtiaW5kaW5nSWR9XyR7dGVtcG9yYXJ5TnVtYmVyfWA7XG59XG5cbmZ1bmN0aW9uIHRlbXBvcmFyeURlY2xhcmF0aW9uKGJpbmRpbmdJZDogc3RyaW5nLCB0ZW1wb3JhcnlOdW1iZXI6IG51bWJlcik6IG8uU3RhdGVtZW50IHtcbiAgcmV0dXJuIG5ldyBvLkRlY2xhcmVWYXJTdG10KHRlbXBvcmFyeU5hbWUoYmluZGluZ0lkLCB0ZW1wb3JhcnlOdW1iZXIpKTtcbn1cblxuZnVuY3Rpb24gcHJlcGVuZFRlbXBvcmFyeURlY2xzKFxuICAgIHRlbXBvcmFyeUNvdW50OiBudW1iZXIsIGJpbmRpbmdJZDogc3RyaW5nLCBzdGF0ZW1lbnRzOiBvLlN0YXRlbWVudFtdKSB7XG4gIGZvciAobGV0IGkgPSB0ZW1wb3JhcnlDb3VudCAtIDE7IGkgPj0gMDsgaS0tKSB7XG4gICAgc3RhdGVtZW50cy51bnNoaWZ0KHRlbXBvcmFyeURlY2xhcmF0aW9uKGJpbmRpbmdJZCwgaSkpO1xuICB9XG59XG5cbmVudW0gX01vZGUge1xuICBTdGF0ZW1lbnQsXG4gIEV4cHJlc3Npb25cbn1cblxuZnVuY3Rpb24gZW5zdXJlU3RhdGVtZW50TW9kZShtb2RlOiBfTW9kZSwgYXN0OiBjZEFzdC5BU1QpIHtcbiAgaWYgKG1vZGUgIT09IF9Nb2RlLlN0YXRlbWVudCkge1xuICAgIHRocm93IG5ldyBFcnJvcihgRXhwZWN0ZWQgYSBzdGF0ZW1lbnQsIGJ1dCBzYXcgJHthc3R9YCk7XG4gIH1cbn1cblxuZnVuY3Rpb24gZW5zdXJlRXhwcmVzc2lvbk1vZGUobW9kZTogX01vZGUsIGFzdDogY2RBc3QuQVNUKSB7XG4gIGlmIChtb2RlICE9PSBfTW9kZS5FeHByZXNzaW9uKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKGBFeHBlY3RlZCBhbiBleHByZXNzaW9uLCBidXQgc2F3ICR7YXN0fWApO1xuICB9XG59XG5cbmZ1bmN0aW9uIGNvbnZlcnRUb1N0YXRlbWVudElmTmVlZGVkKG1vZGU6IF9Nb2RlLCBleHByOiBvLkV4cHJlc3Npb24pOiBvLkV4cHJlc3Npb258by5TdGF0ZW1lbnQge1xuICBpZiAobW9kZSA9PT0gX01vZGUuU3RhdGVtZW50KSB7XG4gICAgcmV0dXJuIGV4cHIudG9TdG10KCk7XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIGV4cHI7XG4gIH1cbn1cblxuY2xhc3MgX0J1aWx0aW5Bc3RDb252ZXJ0ZXIgZXh0ZW5kcyBjZEFzdC5Bc3RUcmFuc2Zvcm1lciB7XG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgX2NvbnZlcnRlckZhY3Rvcnk6IEJ1aWx0aW5Db252ZXJ0ZXJGYWN0b3J5KSB7XG4gICAgc3VwZXIoKTtcbiAgfVxuICBvdmVycmlkZSB2aXNpdFBpcGUoYXN0OiBjZEFzdC5CaW5kaW5nUGlwZSwgY29udGV4dDogYW55KTogYW55IHtcbiAgICBjb25zdCBhcmdzID0gW2FzdC5leHAsIC4uLmFzdC5hcmdzXS5tYXAoYXN0ID0+IGFzdC52aXNpdCh0aGlzLCBjb250ZXh0KSk7XG4gICAgcmV0dXJuIG5ldyBCdWlsdGluRnVuY3Rpb25DYWxsKFxuICAgICAgICBhc3Quc3BhbiwgYXN0LnNvdXJjZVNwYW4sIGFyZ3MsXG4gICAgICAgIHRoaXMuX2NvbnZlcnRlckZhY3RvcnkuY3JlYXRlUGlwZUNvbnZlcnRlcihhc3QubmFtZSwgYXJncy5sZW5ndGgpKTtcbiAgfVxuICBvdmVycmlkZSB2aXNpdExpdGVyYWxBcnJheShhc3Q6IGNkQXN0LkxpdGVyYWxBcnJheSwgY29udGV4dDogYW55KTogYW55IHtcbiAgICBjb25zdCBhcmdzID0gYXN0LmV4cHJlc3Npb25zLm1hcChhc3QgPT4gYXN0LnZpc2l0KHRoaXMsIGNvbnRleHQpKTtcbiAgICByZXR1cm4gbmV3IEJ1aWx0aW5GdW5jdGlvbkNhbGwoXG4gICAgICAgIGFzdC5zcGFuLCBhc3Quc291cmNlU3BhbiwgYXJncyxcbiAgICAgICAgdGhpcy5fY29udmVydGVyRmFjdG9yeS5jcmVhdGVMaXRlcmFsQXJyYXlDb252ZXJ0ZXIoYXN0LmV4cHJlc3Npb25zLmxlbmd0aCkpO1xuICB9XG4gIG92ZXJyaWRlIHZpc2l0TGl0ZXJhbE1hcChhc3Q6IGNkQXN0LkxpdGVyYWxNYXAsIGNvbnRleHQ6IGFueSk6IGFueSB7XG4gICAgY29uc3QgYXJncyA9IGFzdC52YWx1ZXMubWFwKGFzdCA9PiBhc3QudmlzaXQodGhpcywgY29udGV4dCkpO1xuXG4gICAgcmV0dXJuIG5ldyBCdWlsdGluRnVuY3Rpb25DYWxsKFxuICAgICAgICBhc3Quc3BhbiwgYXN0LnNvdXJjZVNwYW4sIGFyZ3MsIHRoaXMuX2NvbnZlcnRlckZhY3RvcnkuY3JlYXRlTGl0ZXJhbE1hcENvbnZlcnRlcihhc3Qua2V5cykpO1xuICB9XG59XG5cbmNsYXNzIF9Bc3RUb0lyVmlzaXRvciBpbXBsZW1lbnRzIGNkQXN0LkFzdFZpc2l0b3Ige1xuICBwcml2YXRlIF9ub2RlTWFwID0gbmV3IE1hcDxjZEFzdC5BU1QsIGNkQXN0LkFTVD4oKTtcbiAgcHJpdmF0ZSBfcmVzdWx0TWFwID0gbmV3IE1hcDxjZEFzdC5BU1QsIG8uRXhwcmVzc2lvbj4oKTtcbiAgcHJpdmF0ZSBfY3VycmVudFRlbXBvcmFyeTogbnVtYmVyID0gMDtcbiAgcHVibGljIHRlbXBvcmFyeUNvdW50OiBudW1iZXIgPSAwO1xuICBwdWJsaWMgdXNlc0ltcGxpY2l0UmVjZWl2ZXI6IGJvb2xlYW4gPSBmYWxzZTtcblxuICBjb25zdHJ1Y3RvcihcbiAgICAgIHByaXZhdGUgX2xvY2FsUmVzb2x2ZXI6IExvY2FsUmVzb2x2ZXIsIHByaXZhdGUgX2ltcGxpY2l0UmVjZWl2ZXI6IG8uRXhwcmVzc2lvbixcbiAgICAgIHByaXZhdGUgYmluZGluZ0lkOiBzdHJpbmcsIHByaXZhdGUgc3VwcG9ydHNJbnRlcnBvbGF0aW9uOiBib29sZWFuLFxuICAgICAgcHJpdmF0ZSBiYXNlU291cmNlU3Bhbj86IFBhcnNlU291cmNlU3BhbiwgcHJpdmF0ZSBpbXBsaWNpdFJlY2VpdmVyQWNjZXNzZXM/OiBTZXQ8c3RyaW5nPikge31cblxuICB2aXNpdFVuYXJ5KGFzdDogY2RBc3QuVW5hcnksIG1vZGU6IF9Nb2RlKTogYW55IHtcbiAgICBsZXQgb3A6IG8uVW5hcnlPcGVyYXRvcjtcbiAgICBzd2l0Y2ggKGFzdC5vcGVyYXRvcikge1xuICAgICAgY2FzZSAnKyc6XG4gICAgICAgIG9wID0gby5VbmFyeU9wZXJhdG9yLlBsdXM7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAnLSc6XG4gICAgICAgIG9wID0gby5VbmFyeU9wZXJhdG9yLk1pbnVzO1xuICAgICAgICBicmVhaztcbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihgVW5zdXBwb3J0ZWQgb3BlcmF0b3IgJHthc3Qub3BlcmF0b3J9YCk7XG4gICAgfVxuXG4gICAgcmV0dXJuIGNvbnZlcnRUb1N0YXRlbWVudElmTmVlZGVkKFxuICAgICAgICBtb2RlLFxuICAgICAgICBuZXcgby5VbmFyeU9wZXJhdG9yRXhwcihcbiAgICAgICAgICAgIG9wLCB0aGlzLl92aXNpdChhc3QuZXhwciwgX01vZGUuRXhwcmVzc2lvbiksIHVuZGVmaW5lZCxcbiAgICAgICAgICAgIHRoaXMuY29udmVydFNvdXJjZVNwYW4oYXN0LnNwYW4pKSk7XG4gIH1cblxuICB2aXNpdEJpbmFyeShhc3Q6IGNkQXN0LkJpbmFyeSwgbW9kZTogX01vZGUpOiBhbnkge1xuICAgIGxldCBvcDogby5CaW5hcnlPcGVyYXRvcjtcbiAgICBzd2l0Y2ggKGFzdC5vcGVyYXRpb24pIHtcbiAgICAgIGNhc2UgJysnOlxuICAgICAgICBvcCA9IG8uQmluYXJ5T3BlcmF0b3IuUGx1cztcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICctJzpcbiAgICAgICAgb3AgPSBvLkJpbmFyeU9wZXJhdG9yLk1pbnVzO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJyonOlxuICAgICAgICBvcCA9IG8uQmluYXJ5T3BlcmF0b3IuTXVsdGlwbHk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAnLyc6XG4gICAgICAgIG9wID0gby5CaW5hcnlPcGVyYXRvci5EaXZpZGU7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAnJSc6XG4gICAgICAgIG9wID0gby5CaW5hcnlPcGVyYXRvci5Nb2R1bG87XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAnJiYnOlxuICAgICAgICBvcCA9IG8uQmluYXJ5T3BlcmF0b3IuQW5kO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ3x8JzpcbiAgICAgICAgb3AgPSBvLkJpbmFyeU9wZXJhdG9yLk9yO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJz09JzpcbiAgICAgICAgb3AgPSBvLkJpbmFyeU9wZXJhdG9yLkVxdWFscztcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICchPSc6XG4gICAgICAgIG9wID0gby5CaW5hcnlPcGVyYXRvci5Ob3RFcXVhbHM7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAnPT09JzpcbiAgICAgICAgb3AgPSBvLkJpbmFyeU9wZXJhdG9yLklkZW50aWNhbDtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICchPT0nOlxuICAgICAgICBvcCA9IG8uQmluYXJ5T3BlcmF0b3IuTm90SWRlbnRpY2FsO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJzwnOlxuICAgICAgICBvcCA9IG8uQmluYXJ5T3BlcmF0b3IuTG93ZXI7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAnPic6XG4gICAgICAgIG9wID0gby5CaW5hcnlPcGVyYXRvci5CaWdnZXI7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAnPD0nOlxuICAgICAgICBvcCA9IG8uQmluYXJ5T3BlcmF0b3IuTG93ZXJFcXVhbHM7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAnPj0nOlxuICAgICAgICBvcCA9IG8uQmluYXJ5T3BlcmF0b3IuQmlnZ2VyRXF1YWxzO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJz8/JzpcbiAgICAgICAgcmV0dXJuIHRoaXMuY29udmVydE51bGxpc2hDb2FsZXNjZShhc3QsIG1vZGUpO1xuICAgICAgZGVmYXVsdDpcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBVbnN1cHBvcnRlZCBvcGVyYXRpb24gJHthc3Qub3BlcmF0aW9ufWApO1xuICAgIH1cblxuICAgIHJldHVybiBjb252ZXJ0VG9TdGF0ZW1lbnRJZk5lZWRlZChcbiAgICAgICAgbW9kZSxcbiAgICAgICAgbmV3IG8uQmluYXJ5T3BlcmF0b3JFeHByKFxuICAgICAgICAgICAgb3AsIHRoaXMuX3Zpc2l0KGFzdC5sZWZ0LCBfTW9kZS5FeHByZXNzaW9uKSwgdGhpcy5fdmlzaXQoYXN0LnJpZ2h0LCBfTW9kZS5FeHByZXNzaW9uKSxcbiAgICAgICAgICAgIHVuZGVmaW5lZCwgdGhpcy5jb252ZXJ0U291cmNlU3Bhbihhc3Quc3BhbikpKTtcbiAgfVxuXG4gIHZpc2l0Q2hhaW4oYXN0OiBjZEFzdC5DaGFpbiwgbW9kZTogX01vZGUpOiBhbnkge1xuICAgIGVuc3VyZVN0YXRlbWVudE1vZGUobW9kZSwgYXN0KTtcbiAgICByZXR1cm4gdGhpcy52aXNpdEFsbChhc3QuZXhwcmVzc2lvbnMsIG1vZGUpO1xuICB9XG5cbiAgdmlzaXRDb25kaXRpb25hbChhc3Q6IGNkQXN0LkNvbmRpdGlvbmFsLCBtb2RlOiBfTW9kZSk6IGFueSB7XG4gICAgY29uc3QgdmFsdWU6IG8uRXhwcmVzc2lvbiA9IHRoaXMuX3Zpc2l0KGFzdC5jb25kaXRpb24sIF9Nb2RlLkV4cHJlc3Npb24pO1xuICAgIHJldHVybiBjb252ZXJ0VG9TdGF0ZW1lbnRJZk5lZWRlZChcbiAgICAgICAgbW9kZSxcbiAgICAgICAgdmFsdWUuY29uZGl0aW9uYWwoXG4gICAgICAgICAgICB0aGlzLl92aXNpdChhc3QudHJ1ZUV4cCwgX01vZGUuRXhwcmVzc2lvbiksIHRoaXMuX3Zpc2l0KGFzdC5mYWxzZUV4cCwgX01vZGUuRXhwcmVzc2lvbiksXG4gICAgICAgICAgICB0aGlzLmNvbnZlcnRTb3VyY2VTcGFuKGFzdC5zcGFuKSkpO1xuICB9XG5cbiAgdmlzaXRQaXBlKGFzdDogY2RBc3QuQmluZGluZ1BpcGUsIG1vZGU6IF9Nb2RlKTogYW55IHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICAgIGBJbGxlZ2FsIHN0YXRlOiBQaXBlcyBzaG91bGQgaGF2ZSBiZWVuIGNvbnZlcnRlZCBpbnRvIGZ1bmN0aW9ucy4gUGlwZTogJHthc3QubmFtZX1gKTtcbiAgfVxuXG4gIHZpc2l0SW1wbGljaXRSZWNlaXZlcihhc3Q6IGNkQXN0LkltcGxpY2l0UmVjZWl2ZXIsIG1vZGU6IF9Nb2RlKTogYW55IHtcbiAgICBlbnN1cmVFeHByZXNzaW9uTW9kZShtb2RlLCBhc3QpO1xuICAgIHRoaXMudXNlc0ltcGxpY2l0UmVjZWl2ZXIgPSB0cnVlO1xuICAgIHJldHVybiB0aGlzLl9pbXBsaWNpdFJlY2VpdmVyO1xuICB9XG5cbiAgdmlzaXRUaGlzUmVjZWl2ZXIoYXN0OiBjZEFzdC5UaGlzUmVjZWl2ZXIsIG1vZGU6IF9Nb2RlKTogYW55IHtcbiAgICByZXR1cm4gdGhpcy52aXNpdEltcGxpY2l0UmVjZWl2ZXIoYXN0LCBtb2RlKTtcbiAgfVxuXG4gIHZpc2l0SW50ZXJwb2xhdGlvbihhc3Q6IGNkQXN0LkludGVycG9sYXRpb24sIG1vZGU6IF9Nb2RlKTogSW50ZXJwb2xhdGlvbkV4cHJlc3Npb24ge1xuICAgIGlmICghdGhpcy5zdXBwb3J0c0ludGVycG9sYXRpb24pIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignVW5leHBlY3RlZCBpbnRlcnBvbGF0aW9uJyk7XG4gICAgfVxuXG4gICAgZW5zdXJlRXhwcmVzc2lvbk1vZGUobW9kZSwgYXN0KTtcbiAgICBsZXQgYXJnczogby5FeHByZXNzaW9uW10gPSBbXTtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGFzdC5zdHJpbmdzLmxlbmd0aCAtIDE7IGkrKykge1xuICAgICAgYXJncy5wdXNoKG8ubGl0ZXJhbChhc3Quc3RyaW5nc1tpXSkpO1xuICAgICAgYXJncy5wdXNoKHRoaXMuX3Zpc2l0KGFzdC5leHByZXNzaW9uc1tpXSwgX01vZGUuRXhwcmVzc2lvbikpO1xuICAgIH1cbiAgICBhcmdzLnB1c2goby5saXRlcmFsKGFzdC5zdHJpbmdzW2FzdC5zdHJpbmdzLmxlbmd0aCAtIDFdKSk7XG5cbiAgICAvLyBJZiB3ZSdyZSBkZWFsaW5nIHdpdGggYW4gaW50ZXJwb2xhdGlvbiBvZiAxIHZhbHVlIHdpdGggYW4gZW1wdHkgcHJlZml4IGFuZCBzdWZmaXgsIHJlZHVjZSB0aGVcbiAgICAvLyBhcmdzIHJldHVybmVkIHRvIGp1c3QgdGhlIHZhbHVlLCBiZWNhdXNlIHdlJ3JlIGdvaW5nIHRvIHBhc3MgaXQgdG8gYSBzcGVjaWFsIGluc3RydWN0aW9uLlxuICAgIGNvbnN0IHN0cmluZ3MgPSBhc3Quc3RyaW5ncztcbiAgICBpZiAoc3RyaW5ncy5sZW5ndGggPT09IDIgJiYgc3RyaW5nc1swXSA9PT0gJycgJiYgc3RyaW5nc1sxXSA9PT0gJycpIHtcbiAgICAgIC8vIFNpbmdsZSBhcmd1bWVudCBpbnRlcnBvbGF0ZSBpbnN0cnVjdGlvbnMuXG4gICAgICBhcmdzID0gW2FyZ3NbMV1dO1xuICAgIH0gZWxzZSBpZiAoYXN0LmV4cHJlc3Npb25zLmxlbmd0aCA+PSA5KSB7XG4gICAgICAvLyA5IG9yIG1vcmUgYXJndW1lbnRzIG11c3QgYmUgcGFzc2VkIHRvIHRoZSBgaW50ZXJwb2xhdGVWYC1zdHlsZSBpbnN0cnVjdGlvbnMsIHdoaWNoIGFjY2VwdFxuICAgICAgLy8gYW4gYXJyYXkgb2YgYXJndW1lbnRzXG4gICAgICBhcmdzID0gW28ubGl0ZXJhbEFycihhcmdzKV07XG4gICAgfVxuXG4gICAgcmV0dXJuIG5ldyBJbnRlcnBvbGF0aW9uRXhwcmVzc2lvbihhcmdzKTtcbiAgfVxuXG4gIHZpc2l0S2V5ZWRSZWFkKGFzdDogY2RBc3QuS2V5ZWRSZWFkLCBtb2RlOiBfTW9kZSk6IGFueSB7XG4gICAgY29uc3QgbGVmdE1vc3RTYWZlID0gdGhpcy5sZWZ0TW9zdFNhZmVOb2RlKGFzdCk7XG4gICAgaWYgKGxlZnRNb3N0U2FmZSkge1xuICAgICAgcmV0dXJuIHRoaXMuY29udmVydFNhZmVBY2Nlc3MoYXN0LCBsZWZ0TW9zdFNhZmUsIG1vZGUpO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gY29udmVydFRvU3RhdGVtZW50SWZOZWVkZWQoXG4gICAgICAgICAgbW9kZSxcbiAgICAgICAgICB0aGlzLl92aXNpdChhc3QucmVjZWl2ZXIsIF9Nb2RlLkV4cHJlc3Npb24pLmtleSh0aGlzLl92aXNpdChhc3Qua2V5LCBfTW9kZS5FeHByZXNzaW9uKSkpO1xuICAgIH1cbiAgfVxuXG4gIHZpc2l0S2V5ZWRXcml0ZShhc3Q6IGNkQXN0LktleWVkV3JpdGUsIG1vZGU6IF9Nb2RlKTogYW55IHtcbiAgICBjb25zdCBvYmo6IG8uRXhwcmVzc2lvbiA9IHRoaXMuX3Zpc2l0KGFzdC5yZWNlaXZlciwgX01vZGUuRXhwcmVzc2lvbik7XG4gICAgY29uc3Qga2V5OiBvLkV4cHJlc3Npb24gPSB0aGlzLl92aXNpdChhc3Qua2V5LCBfTW9kZS5FeHByZXNzaW9uKTtcbiAgICBjb25zdCB2YWx1ZTogby5FeHByZXNzaW9uID0gdGhpcy5fdmlzaXQoYXN0LnZhbHVlLCBfTW9kZS5FeHByZXNzaW9uKTtcblxuICAgIGlmIChvYmogPT09IHRoaXMuX2ltcGxpY2l0UmVjZWl2ZXIpIHtcbiAgICAgIHRoaXMuX2xvY2FsUmVzb2x2ZXIubWF5YmVSZXN0b3JlVmlldygpO1xuICAgIH1cblxuICAgIHJldHVybiBjb252ZXJ0VG9TdGF0ZW1lbnRJZk5lZWRlZChtb2RlLCBvYmoua2V5KGtleSkuc2V0KHZhbHVlKSk7XG4gIH1cblxuICB2aXNpdExpdGVyYWxBcnJheShhc3Q6IGNkQXN0LkxpdGVyYWxBcnJheSwgbW9kZTogX01vZGUpOiBhbnkge1xuICAgIHRocm93IG5ldyBFcnJvcihgSWxsZWdhbCBTdGF0ZTogbGl0ZXJhbCBhcnJheXMgc2hvdWxkIGhhdmUgYmVlbiBjb252ZXJ0ZWQgaW50byBmdW5jdGlvbnNgKTtcbiAgfVxuXG4gIHZpc2l0TGl0ZXJhbE1hcChhc3Q6IGNkQXN0LkxpdGVyYWxNYXAsIG1vZGU6IF9Nb2RlKTogYW55IHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoYElsbGVnYWwgU3RhdGU6IGxpdGVyYWwgbWFwcyBzaG91bGQgaGF2ZSBiZWVuIGNvbnZlcnRlZCBpbnRvIGZ1bmN0aW9uc2ApO1xuICB9XG5cbiAgdmlzaXRMaXRlcmFsUHJpbWl0aXZlKGFzdDogY2RBc3QuTGl0ZXJhbFByaW1pdGl2ZSwgbW9kZTogX01vZGUpOiBhbnkge1xuICAgIC8vIEZvciBsaXRlcmFsIHZhbHVlcyBvZiBudWxsLCB1bmRlZmluZWQsIHRydWUsIG9yIGZhbHNlIGFsbG93IHR5cGUgaW50ZXJmZXJlbmNlXG4gICAgLy8gdG8gaW5mZXIgdGhlIHR5cGUuXG4gICAgY29uc3QgdHlwZSA9XG4gICAgICAgIGFzdC52YWx1ZSA9PT0gbnVsbCB8fCBhc3QudmFsdWUgPT09IHVuZGVmaW5lZCB8fCBhc3QudmFsdWUgPT09IHRydWUgfHwgYXN0LnZhbHVlID09PSB0cnVlID9cbiAgICAgICAgby5JTkZFUlJFRF9UWVBFIDpcbiAgICAgICAgdW5kZWZpbmVkO1xuICAgIHJldHVybiBjb252ZXJ0VG9TdGF0ZW1lbnRJZk5lZWRlZChcbiAgICAgICAgbW9kZSwgby5saXRlcmFsKGFzdC52YWx1ZSwgdHlwZSwgdGhpcy5jb252ZXJ0U291cmNlU3Bhbihhc3Quc3BhbikpKTtcbiAgfVxuXG4gIHByaXZhdGUgX2dldExvY2FsKG5hbWU6IHN0cmluZywgcmVjZWl2ZXI6IGNkQXN0LkFTVCk6IG8uRXhwcmVzc2lvbnxudWxsIHtcbiAgICBpZiAodGhpcy5fbG9jYWxSZXNvbHZlci5nbG9iYWxzPy5oYXMobmFtZSkgJiYgcmVjZWl2ZXIgaW5zdGFuY2VvZiBjZEFzdC5UaGlzUmVjZWl2ZXIpIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzLl9sb2NhbFJlc29sdmVyLmdldExvY2FsKG5hbWUpO1xuICB9XG5cbiAgdmlzaXRQcmVmaXhOb3QoYXN0OiBjZEFzdC5QcmVmaXhOb3QsIG1vZGU6IF9Nb2RlKTogYW55IHtcbiAgICByZXR1cm4gY29udmVydFRvU3RhdGVtZW50SWZOZWVkZWQobW9kZSwgby5ub3QodGhpcy5fdmlzaXQoYXN0LmV4cHJlc3Npb24sIF9Nb2RlLkV4cHJlc3Npb24pKSk7XG4gIH1cblxuICB2aXNpdE5vbk51bGxBc3NlcnQoYXN0OiBjZEFzdC5Ob25OdWxsQXNzZXJ0LCBtb2RlOiBfTW9kZSk6IGFueSB7XG4gICAgcmV0dXJuIGNvbnZlcnRUb1N0YXRlbWVudElmTmVlZGVkKG1vZGUsIHRoaXMuX3Zpc2l0KGFzdC5leHByZXNzaW9uLCBfTW9kZS5FeHByZXNzaW9uKSk7XG4gIH1cblxuICB2aXNpdFByb3BlcnR5UmVhZChhc3Q6IGNkQXN0LlByb3BlcnR5UmVhZCwgbW9kZTogX01vZGUpOiBhbnkge1xuICAgIGNvbnN0IGxlZnRNb3N0U2FmZSA9IHRoaXMubGVmdE1vc3RTYWZlTm9kZShhc3QpO1xuICAgIGlmIChsZWZ0TW9zdFNhZmUpIHtcbiAgICAgIHJldHVybiB0aGlzLmNvbnZlcnRTYWZlQWNjZXNzKGFzdCwgbGVmdE1vc3RTYWZlLCBtb2RlKTtcbiAgICB9IGVsc2Uge1xuICAgICAgbGV0IHJlc3VsdDogYW55ID0gbnVsbDtcbiAgICAgIGNvbnN0IHByZXZVc2VzSW1wbGljaXRSZWNlaXZlciA9IHRoaXMudXNlc0ltcGxpY2l0UmVjZWl2ZXI7XG4gICAgICBjb25zdCByZWNlaXZlciA9IHRoaXMuX3Zpc2l0KGFzdC5yZWNlaXZlciwgX01vZGUuRXhwcmVzc2lvbik7XG4gICAgICBpZiAocmVjZWl2ZXIgPT09IHRoaXMuX2ltcGxpY2l0UmVjZWl2ZXIpIHtcbiAgICAgICAgcmVzdWx0ID0gdGhpcy5fZ2V0TG9jYWwoYXN0Lm5hbWUsIGFzdC5yZWNlaXZlcik7XG4gICAgICAgIGlmIChyZXN1bHQpIHtcbiAgICAgICAgICAvLyBSZXN0b3JlIHRoZSBwcmV2aW91cyBcInVzZXNJbXBsaWNpdFJlY2VpdmVyXCIgc3RhdGUgc2luY2UgdGhlIGltcGxpY2l0XG4gICAgICAgICAgLy8gcmVjZWl2ZXIgaGFzIGJlZW4gcmVwbGFjZWQgd2l0aCBhIHJlc29sdmVkIGxvY2FsIGV4cHJlc3Npb24uXG4gICAgICAgICAgdGhpcy51c2VzSW1wbGljaXRSZWNlaXZlciA9IHByZXZVc2VzSW1wbGljaXRSZWNlaXZlcjtcbiAgICAgICAgICB0aGlzLmFkZEltcGxpY2l0UmVjZWl2ZXJBY2Nlc3MoYXN0Lm5hbWUpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBpZiAocmVzdWx0ID09IG51bGwpIHtcbiAgICAgICAgcmVzdWx0ID0gcmVjZWl2ZXIucHJvcChhc3QubmFtZSwgdGhpcy5jb252ZXJ0U291cmNlU3Bhbihhc3Quc3BhbikpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIGNvbnZlcnRUb1N0YXRlbWVudElmTmVlZGVkKG1vZGUsIHJlc3VsdCk7XG4gICAgfVxuICB9XG5cbiAgdmlzaXRQcm9wZXJ0eVdyaXRlKGFzdDogY2RBc3QuUHJvcGVydHlXcml0ZSwgbW9kZTogX01vZGUpOiBhbnkge1xuICAgIGNvbnN0IHJlY2VpdmVyOiBvLkV4cHJlc3Npb24gPSB0aGlzLl92aXNpdChhc3QucmVjZWl2ZXIsIF9Nb2RlLkV4cHJlc3Npb24pO1xuICAgIGNvbnN0IHByZXZVc2VzSW1wbGljaXRSZWNlaXZlciA9IHRoaXMudXNlc0ltcGxpY2l0UmVjZWl2ZXI7XG5cbiAgICBsZXQgdmFyRXhwcjogby5SZWFkUHJvcEV4cHJ8bnVsbCA9IG51bGw7XG4gICAgaWYgKHJlY2VpdmVyID09PSB0aGlzLl9pbXBsaWNpdFJlY2VpdmVyKSB7XG4gICAgICBjb25zdCBsb2NhbEV4cHIgPSB0aGlzLl9nZXRMb2NhbChhc3QubmFtZSwgYXN0LnJlY2VpdmVyKTtcbiAgICAgIGlmIChsb2NhbEV4cHIpIHtcbiAgICAgICAgaWYgKGxvY2FsRXhwciBpbnN0YW5jZW9mIG8uUmVhZFByb3BFeHByKSB7XG4gICAgICAgICAgLy8gSWYgdGhlIGxvY2FsIHZhcmlhYmxlIGlzIGEgcHJvcGVydHkgcmVhZCBleHByZXNzaW9uLCBpdCdzIGEgcmVmZXJlbmNlXG4gICAgICAgICAgLy8gdG8gYSAnY29udGV4dC5wcm9wZXJ0eScgdmFsdWUgYW5kIHdpbGwgYmUgdXNlZCBhcyB0aGUgdGFyZ2V0IG9mIHRoZVxuICAgICAgICAgIC8vIHdyaXRlIGV4cHJlc3Npb24uXG4gICAgICAgICAgdmFyRXhwciA9IGxvY2FsRXhwcjtcbiAgICAgICAgICAvLyBSZXN0b3JlIHRoZSBwcmV2aW91cyBcInVzZXNJbXBsaWNpdFJlY2VpdmVyXCIgc3RhdGUgc2luY2UgdGhlIGltcGxpY2l0XG4gICAgICAgICAgLy8gcmVjZWl2ZXIgaGFzIGJlZW4gcmVwbGFjZWQgd2l0aCBhIHJlc29sdmVkIGxvY2FsIGV4cHJlc3Npb24uXG4gICAgICAgICAgdGhpcy51c2VzSW1wbGljaXRSZWNlaXZlciA9IHByZXZVc2VzSW1wbGljaXRSZWNlaXZlcjtcbiAgICAgICAgICB0aGlzLmFkZEltcGxpY2l0UmVjZWl2ZXJBY2Nlc3MoYXN0Lm5hbWUpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIC8vIE90aGVyd2lzZSBpdCdzIGFuIGVycm9yLlxuICAgICAgICAgIGNvbnN0IHJlY2VpdmVyID0gYXN0Lm5hbWU7XG4gICAgICAgICAgY29uc3QgdmFsdWUgPSAoYXN0LnZhbHVlIGluc3RhbmNlb2YgY2RBc3QuUHJvcGVydHlSZWFkKSA/IGFzdC52YWx1ZS5uYW1lIDogdW5kZWZpbmVkO1xuICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgQ2Fubm90IGFzc2lnbiB2YWx1ZSBcIiR7dmFsdWV9XCIgdG8gdGVtcGxhdGUgdmFyaWFibGUgXCIke1xuICAgICAgICAgICAgICByZWNlaXZlcn1cIi4gVGVtcGxhdGUgdmFyaWFibGVzIGFyZSByZWFkLW9ubHkuYCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgLy8gSWYgbm8gbG9jYWwgZXhwcmVzc2lvbiBjb3VsZCBiZSBwcm9kdWNlZCwgdXNlIHRoZSBvcmlnaW5hbCByZWNlaXZlcidzXG4gICAgLy8gcHJvcGVydHkgYXMgdGhlIHRhcmdldC5cbiAgICBpZiAodmFyRXhwciA9PT0gbnVsbCkge1xuICAgICAgdmFyRXhwciA9IHJlY2VpdmVyLnByb3AoYXN0Lm5hbWUsIHRoaXMuY29udmVydFNvdXJjZVNwYW4oYXN0LnNwYW4pKTtcbiAgICB9XG4gICAgcmV0dXJuIGNvbnZlcnRUb1N0YXRlbWVudElmTmVlZGVkKG1vZGUsIHZhckV4cHIuc2V0KHRoaXMuX3Zpc2l0KGFzdC52YWx1ZSwgX01vZGUuRXhwcmVzc2lvbikpKTtcbiAgfVxuXG4gIHZpc2l0U2FmZVByb3BlcnR5UmVhZChhc3Q6IGNkQXN0LlNhZmVQcm9wZXJ0eVJlYWQsIG1vZGU6IF9Nb2RlKTogYW55IHtcbiAgICByZXR1cm4gdGhpcy5jb252ZXJ0U2FmZUFjY2Vzcyhhc3QsIHRoaXMubGVmdE1vc3RTYWZlTm9kZShhc3QpLCBtb2RlKTtcbiAgfVxuXG4gIHZpc2l0U2FmZUtleWVkUmVhZChhc3Q6IGNkQXN0LlNhZmVLZXllZFJlYWQsIG1vZGU6IF9Nb2RlKTogYW55IHtcbiAgICByZXR1cm4gdGhpcy5jb252ZXJ0U2FmZUFjY2Vzcyhhc3QsIHRoaXMubGVmdE1vc3RTYWZlTm9kZShhc3QpLCBtb2RlKTtcbiAgfVxuXG4gIHZpc2l0QWxsKGFzdHM6IGNkQXN0LkFTVFtdLCBtb2RlOiBfTW9kZSk6IGFueSB7XG4gICAgcmV0dXJuIGFzdHMubWFwKGFzdCA9PiB0aGlzLl92aXNpdChhc3QsIG1vZGUpKTtcbiAgfVxuXG4gIHZpc2l0UXVvdGUoYXN0OiBjZEFzdC5RdW90ZSwgbW9kZTogX01vZGUpOiBhbnkge1xuICAgIHRocm93IG5ldyBFcnJvcihgUXVvdGVzIGFyZSBub3Qgc3VwcG9ydGVkIGZvciBldmFsdWF0aW9uIVxuICAgICAgICBTdGF0ZW1lbnQ6ICR7YXN0LnVuaW50ZXJwcmV0ZWRFeHByZXNzaW9ufSBsb2NhdGVkIGF0ICR7YXN0LmxvY2F0aW9ufWApO1xuICB9XG5cbiAgdmlzaXRDYWxsKGFzdDogY2RBc3QuQ2FsbCwgbW9kZTogX01vZGUpOiBhbnkge1xuICAgIGNvbnN0IGxlZnRNb3N0U2FmZSA9IHRoaXMubGVmdE1vc3RTYWZlTm9kZShhc3QpO1xuICAgIGlmIChsZWZ0TW9zdFNhZmUpIHtcbiAgICAgIHJldHVybiB0aGlzLmNvbnZlcnRTYWZlQWNjZXNzKGFzdCwgbGVmdE1vc3RTYWZlLCBtb2RlKTtcbiAgICB9XG5cbiAgICBjb25zdCBjb252ZXJ0ZWRBcmdzID0gdGhpcy52aXNpdEFsbChhc3QuYXJncywgX01vZGUuRXhwcmVzc2lvbik7XG5cbiAgICBpZiAoYXN0IGluc3RhbmNlb2YgQnVpbHRpbkZ1bmN0aW9uQ2FsbCkge1xuICAgICAgcmV0dXJuIGNvbnZlcnRUb1N0YXRlbWVudElmTmVlZGVkKG1vZGUsIGFzdC5jb252ZXJ0ZXIoY29udmVydGVkQXJncykpO1xuICAgIH1cblxuICAgIGNvbnN0IHJlY2VpdmVyID0gYXN0LnJlY2VpdmVyO1xuICAgIGlmIChyZWNlaXZlciBpbnN0YW5jZW9mIGNkQXN0LlByb3BlcnR5UmVhZCAmJlxuICAgICAgICByZWNlaXZlci5yZWNlaXZlciBpbnN0YW5jZW9mIGNkQXN0LkltcGxpY2l0UmVjZWl2ZXIgJiZcbiAgICAgICAgIShyZWNlaXZlci5yZWNlaXZlciBpbnN0YW5jZW9mIGNkQXN0LlRoaXNSZWNlaXZlcikgJiYgcmVjZWl2ZXIubmFtZSA9PT0gJyRhbnknKSB7XG4gICAgICBpZiAoY29udmVydGVkQXJncy5sZW5ndGggIT09IDEpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBJbnZhbGlkIGNhbGwgdG8gJGFueSwgZXhwZWN0ZWQgMSBhcmd1bWVudCBidXQgcmVjZWl2ZWQgJHtcbiAgICAgICAgICAgIGNvbnZlcnRlZEFyZ3MubGVuZ3RoIHx8ICdub25lJ31gKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBjb252ZXJ0VG9TdGF0ZW1lbnRJZk5lZWRlZChtb2RlLCBjb252ZXJ0ZWRBcmdzWzBdIGFzIG8uRXhwcmVzc2lvbik7XG4gICAgfVxuXG4gICAgY29uc3QgY2FsbCA9IHRoaXMuX3Zpc2l0KHJlY2VpdmVyLCBfTW9kZS5FeHByZXNzaW9uKVxuICAgICAgICAgICAgICAgICAgICAgLmNhbGxGbihjb252ZXJ0ZWRBcmdzLCB0aGlzLmNvbnZlcnRTb3VyY2VTcGFuKGFzdC5zcGFuKSk7XG4gICAgcmV0dXJuIGNvbnZlcnRUb1N0YXRlbWVudElmTmVlZGVkKG1vZGUsIGNhbGwpO1xuICB9XG5cbiAgdmlzaXRTYWZlQ2FsbChhc3Q6IGNkQXN0LlNhZmVDYWxsLCBtb2RlOiBfTW9kZSk6IGFueSB7XG4gICAgcmV0dXJuIHRoaXMuY29udmVydFNhZmVBY2Nlc3MoYXN0LCB0aGlzLmxlZnRNb3N0U2FmZU5vZGUoYXN0KSwgbW9kZSk7XG4gIH1cblxuICBwcml2YXRlIF92aXNpdChhc3Q6IGNkQXN0LkFTVCwgbW9kZTogX01vZGUpOiBhbnkge1xuICAgIGNvbnN0IHJlc3VsdCA9IHRoaXMuX3Jlc3VsdE1hcC5nZXQoYXN0KTtcbiAgICBpZiAocmVzdWx0KSByZXR1cm4gcmVzdWx0O1xuICAgIHJldHVybiAodGhpcy5fbm9kZU1hcC5nZXQoYXN0KSB8fCBhc3QpLnZpc2l0KHRoaXMsIG1vZGUpO1xuICB9XG5cbiAgcHJpdmF0ZSBjb252ZXJ0U2FmZUFjY2VzcyhcbiAgICAgIGFzdDogY2RBc3QuQVNULCBsZWZ0TW9zdFNhZmU6IGNkQXN0LlNhZmVQcm9wZXJ0eVJlYWR8Y2RBc3QuU2FmZUtleWVkUmVhZHxjZEFzdC5TYWZlQ2FsbCxcbiAgICAgIG1vZGU6IF9Nb2RlKTogYW55IHtcbiAgICAvLyBJZiB0aGUgZXhwcmVzc2lvbiBjb250YWlucyBhIHNhZmUgYWNjZXNzIG5vZGUgb24gdGhlIGxlZnQgaXQgbmVlZHMgdG8gYmUgY29udmVydGVkIHRvXG4gICAgLy8gYW4gZXhwcmVzc2lvbiB0aGF0IGd1YXJkcyB0aGUgYWNjZXNzIHRvIHRoZSBtZW1iZXIgYnkgY2hlY2tpbmcgdGhlIHJlY2VpdmVyIGZvciBibGFuay4gQXNcbiAgICAvLyBleGVjdXRpb24gcHJvY2VlZHMgZnJvbSBsZWZ0IHRvIHJpZ2h0LCB0aGUgbGVmdCBtb3N0IHBhcnQgb2YgdGhlIGV4cHJlc3Npb24gbXVzdCBiZSBndWFyZGVkXG4gICAgLy8gZmlyc3QgYnV0LCBiZWNhdXNlIG1lbWJlciBhY2Nlc3MgaXMgbGVmdCBhc3NvY2lhdGl2ZSwgdGhlIHJpZ2h0IHNpZGUgb2YgdGhlIGV4cHJlc3Npb24gaXMgYXRcbiAgICAvLyB0aGUgdG9wIG9mIHRoZSBBU1QuIFRoZSBkZXNpcmVkIHJlc3VsdCByZXF1aXJlcyBsaWZ0aW5nIGEgY29weSBvZiB0aGUgbGVmdCBwYXJ0IG9mIHRoZVxuICAgIC8vIGV4cHJlc3Npb24gdXAgdG8gdGVzdCBpdCBmb3IgYmxhbmsgYmVmb3JlIGdlbmVyYXRpbmcgdGhlIHVuZ3VhcmRlZCB2ZXJzaW9uLlxuXG4gICAgLy8gQ29uc2lkZXIsIGZvciBleGFtcGxlIHRoZSBmb2xsb3dpbmcgZXhwcmVzc2lvbjogYT8uYi5jPy5kLmVcblxuICAgIC8vIFRoaXMgcmVzdWx0cyBpbiB0aGUgYXN0OlxuICAgIC8vICAgICAgICAgLlxuICAgIC8vICAgICAgICAvIFxcXG4gICAgLy8gICAgICAgPy4gICBlXG4gICAgLy8gICAgICAvICBcXFxuICAgIC8vICAgICAuICAgIGRcbiAgICAvLyAgICAvIFxcXG4gICAgLy8gICA/LiAgY1xuICAgIC8vICAvICBcXFxuICAgIC8vIGEgICAgYlxuXG4gICAgLy8gVGhlIGZvbGxvd2luZyB0cmVlIHNob3VsZCBiZSBnZW5lcmF0ZWQ6XG4gICAgLy9cbiAgICAvLyAgICAgICAgLy0tLS0gPyAtLS0tXFxcbiAgICAvLyAgICAgICAvICAgICAgfCAgICAgIFxcXG4gICAgLy8gICAgIGEgICAvLS0tID8gLS0tXFwgIG51bGxcbiAgICAvLyAgICAgICAgLyAgICAgfCAgICAgXFxcbiAgICAvLyAgICAgICAuICAgICAgLiAgICAgbnVsbFxuICAgIC8vICAgICAgLyBcXCAgICAvIFxcXG4gICAgLy8gICAgIC4gIGMgICAuICAgZVxuICAgIC8vICAgIC8gXFwgICAgLyBcXFxuICAgIC8vICAgYSAgIGIgIC4gICBkXG4gICAgLy8gICAgICAgICAvIFxcXG4gICAgLy8gICAgICAgIC4gICBjXG4gICAgLy8gICAgICAgLyBcXFxuICAgIC8vICAgICAgYSAgIGJcbiAgICAvL1xuICAgIC8vIE5vdGljZSB0aGF0IHRoZSBmaXJzdCBndWFyZCBjb25kaXRpb24gaXMgdGhlIGxlZnQgaGFuZCBvZiB0aGUgbGVmdCBtb3N0IHNhZmUgYWNjZXNzIG5vZGVcbiAgICAvLyB3aGljaCBjb21lcyBpbiBhcyBsZWZ0TW9zdFNhZmUgdG8gdGhpcyByb3V0aW5lLlxuXG4gICAgbGV0IGd1YXJkZWRFeHByZXNzaW9uID0gdGhpcy5fdmlzaXQobGVmdE1vc3RTYWZlLnJlY2VpdmVyLCBfTW9kZS5FeHByZXNzaW9uKTtcbiAgICBsZXQgdGVtcG9yYXJ5OiBvLlJlYWRWYXJFeHByfHVuZGVmaW5lZCA9IHVuZGVmaW5lZDtcbiAgICBpZiAodGhpcy5uZWVkc1RlbXBvcmFyeUluU2FmZUFjY2VzcyhsZWZ0TW9zdFNhZmUucmVjZWl2ZXIpKSB7XG4gICAgICAvLyBJZiB0aGUgZXhwcmVzc2lvbiBoYXMgbWV0aG9kIGNhbGxzIG9yIHBpcGVzIHRoZW4gd2UgbmVlZCB0byBzYXZlIHRoZSByZXN1bHQgaW50byBhXG4gICAgICAvLyB0ZW1wb3JhcnkgdmFyaWFibGUgdG8gYXZvaWQgY2FsbGluZyBzdGF0ZWZ1bCBvciBpbXB1cmUgY29kZSBtb3JlIHRoYW4gb25jZS5cbiAgICAgIHRlbXBvcmFyeSA9IHRoaXMuYWxsb2NhdGVUZW1wb3JhcnkoKTtcblxuICAgICAgLy8gUHJlc2VydmUgdGhlIHJlc3VsdCBpbiB0aGUgdGVtcG9yYXJ5IHZhcmlhYmxlXG4gICAgICBndWFyZGVkRXhwcmVzc2lvbiA9IHRlbXBvcmFyeS5zZXQoZ3VhcmRlZEV4cHJlc3Npb24pO1xuXG4gICAgICAvLyBFbnN1cmUgYWxsIGZ1cnRoZXIgcmVmZXJlbmNlcyB0byB0aGUgZ3VhcmRlZCBleHByZXNzaW9uIHJlZmVyIHRvIHRoZSB0ZW1wb3JhcnkgaW5zdGVhZC5cbiAgICAgIHRoaXMuX3Jlc3VsdE1hcC5zZXQobGVmdE1vc3RTYWZlLnJlY2VpdmVyLCB0ZW1wb3JhcnkpO1xuICAgIH1cbiAgICBjb25zdCBjb25kaXRpb24gPSBndWFyZGVkRXhwcmVzc2lvbi5pc0JsYW5rKCk7XG5cbiAgICAvLyBDb252ZXJ0IHRoZSBhc3QgdG8gYW4gdW5ndWFyZGVkIGFjY2VzcyB0byB0aGUgcmVjZWl2ZXIncyBtZW1iZXIuIFRoZSBtYXAgd2lsbCBzdWJzdGl0dXRlXG4gICAgLy8gbGVmdE1vc3ROb2RlIHdpdGggaXRzIHVuZ3VhcmRlZCB2ZXJzaW9uIGluIHRoZSBjYWxsIHRvIGB0aGlzLnZpc2l0KClgLlxuICAgIGlmIChsZWZ0TW9zdFNhZmUgaW5zdGFuY2VvZiBjZEFzdC5TYWZlQ2FsbCkge1xuICAgICAgdGhpcy5fbm9kZU1hcC5zZXQoXG4gICAgICAgICAgbGVmdE1vc3RTYWZlLFxuICAgICAgICAgIG5ldyBjZEFzdC5DYWxsKFxuICAgICAgICAgICAgICBsZWZ0TW9zdFNhZmUuc3BhbiwgbGVmdE1vc3RTYWZlLnNvdXJjZVNwYW4sIGxlZnRNb3N0U2FmZS5yZWNlaXZlciwgbGVmdE1vc3RTYWZlLmFyZ3MsXG4gICAgICAgICAgICAgIGxlZnRNb3N0U2FmZS5hcmd1bWVudFNwYW4pKTtcbiAgICB9IGVsc2UgaWYgKGxlZnRNb3N0U2FmZSBpbnN0YW5jZW9mIGNkQXN0LlNhZmVLZXllZFJlYWQpIHtcbiAgICAgIHRoaXMuX25vZGVNYXAuc2V0KFxuICAgICAgICAgIGxlZnRNb3N0U2FmZSxcbiAgICAgICAgICBuZXcgY2RBc3QuS2V5ZWRSZWFkKFxuICAgICAgICAgICAgICBsZWZ0TW9zdFNhZmUuc3BhbiwgbGVmdE1vc3RTYWZlLnNvdXJjZVNwYW4sIGxlZnRNb3N0U2FmZS5yZWNlaXZlciwgbGVmdE1vc3RTYWZlLmtleSkpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLl9ub2RlTWFwLnNldChcbiAgICAgICAgICBsZWZ0TW9zdFNhZmUsXG4gICAgICAgICAgbmV3IGNkQXN0LlByb3BlcnR5UmVhZChcbiAgICAgICAgICAgICAgbGVmdE1vc3RTYWZlLnNwYW4sIGxlZnRNb3N0U2FmZS5zb3VyY2VTcGFuLCBsZWZ0TW9zdFNhZmUubmFtZVNwYW4sXG4gICAgICAgICAgICAgIGxlZnRNb3N0U2FmZS5yZWNlaXZlciwgbGVmdE1vc3RTYWZlLm5hbWUpKTtcbiAgICB9XG5cbiAgICAvLyBSZWN1cnNpdmVseSBjb252ZXJ0IHRoZSBub2RlIG5vdyB3aXRob3V0IHRoZSBndWFyZGVkIG1lbWJlciBhY2Nlc3MuXG4gICAgY29uc3QgYWNjZXNzID0gdGhpcy5fdmlzaXQoYXN0LCBfTW9kZS5FeHByZXNzaW9uKTtcblxuICAgIC8vIFJlbW92ZSB0aGUgbWFwcGluZy4gVGhpcyBpcyBub3Qgc3RyaWN0bHkgcmVxdWlyZWQgYXMgdGhlIGNvbnZlcnRlciBvbmx5IHRyYXZlcnNlcyBlYWNoIG5vZGVcbiAgICAvLyBvbmNlIGJ1dCBpcyBzYWZlciBpZiB0aGUgY29udmVyc2lvbiBpcyBjaGFuZ2VkIHRvIHRyYXZlcnNlIHRoZSBub2RlcyBtb3JlIHRoYW4gb25jZS5cbiAgICB0aGlzLl9ub2RlTWFwLmRlbGV0ZShsZWZ0TW9zdFNhZmUpO1xuXG4gICAgLy8gSWYgd2UgYWxsb2NhdGVkIGEgdGVtcG9yYXJ5LCByZWxlYXNlIGl0LlxuICAgIGlmICh0ZW1wb3JhcnkpIHtcbiAgICAgIHRoaXMucmVsZWFzZVRlbXBvcmFyeSh0ZW1wb3JhcnkpO1xuICAgIH1cblxuICAgIC8vIFByb2R1Y2UgdGhlIGNvbmRpdGlvbmFsXG4gICAgcmV0dXJuIGNvbnZlcnRUb1N0YXRlbWVudElmTmVlZGVkKG1vZGUsIGNvbmRpdGlvbi5jb25kaXRpb25hbChvLk5VTExfRVhQUiwgYWNjZXNzKSk7XG4gIH1cblxuICBwcml2YXRlIGNvbnZlcnROdWxsaXNoQ29hbGVzY2UoYXN0OiBjZEFzdC5CaW5hcnksIG1vZGU6IF9Nb2RlKTogYW55IHtcbiAgICBjb25zdCBsZWZ0OiBvLkV4cHJlc3Npb24gPSB0aGlzLl92aXNpdChhc3QubGVmdCwgX01vZGUuRXhwcmVzc2lvbik7XG4gICAgY29uc3QgcmlnaHQ6IG8uRXhwcmVzc2lvbiA9IHRoaXMuX3Zpc2l0KGFzdC5yaWdodCwgX01vZGUuRXhwcmVzc2lvbik7XG4gICAgY29uc3QgdGVtcG9yYXJ5ID0gdGhpcy5hbGxvY2F0ZVRlbXBvcmFyeSgpO1xuICAgIHRoaXMucmVsZWFzZVRlbXBvcmFyeSh0ZW1wb3JhcnkpO1xuXG4gICAgLy8gR2VuZXJhdGUgdGhlIGZvbGxvd2luZyBleHByZXNzaW9uLiBJdCBpcyBpZGVudGljYWwgdG8gaG93IFRTXG4gICAgLy8gdHJhbnNwaWxlcyBiaW5hcnkgZXhwcmVzc2lvbnMgd2l0aCBhIG51bGxpc2ggY29hbGVzY2luZyBvcGVyYXRvci5cbiAgICAvLyBsZXQgdGVtcDtcbiAgICAvLyAodGVtcCA9IGEpICE9PSBudWxsICYmIHRlbXAgIT09IHVuZGVmaW5lZCA/IHRlbXAgOiBiO1xuICAgIHJldHVybiBjb252ZXJ0VG9TdGF0ZW1lbnRJZk5lZWRlZChcbiAgICAgICAgbW9kZSxcbiAgICAgICAgdGVtcG9yYXJ5LnNldChsZWZ0KVxuICAgICAgICAgICAgLm5vdElkZW50aWNhbChvLk5VTExfRVhQUilcbiAgICAgICAgICAgIC5hbmQodGVtcG9yYXJ5Lm5vdElkZW50aWNhbChvLmxpdGVyYWwodW5kZWZpbmVkKSkpXG4gICAgICAgICAgICAuY29uZGl0aW9uYWwodGVtcG9yYXJ5LCByaWdodCkpO1xuICB9XG5cbiAgLy8gR2l2ZW4gYW4gZXhwcmVzc2lvbiBvZiB0aGUgZm9ybSBhPy5iLmM/LmQuZSB0aGVuIHRoZSBsZWZ0IG1vc3Qgc2FmZSBub2RlIGlzXG4gIC8vIHRoZSAoYT8uYikuIFRoZSAuIGFuZCA/LiBhcmUgbGVmdCBhc3NvY2lhdGl2ZSB0aHVzIGNhbiBiZSByZXdyaXR0ZW4gYXM6XG4gIC8vICgoKChhPy5jKS5iKS5jKT8uZCkuZS4gVGhpcyByZXR1cm5zIHRoZSBtb3N0IGRlZXBseSBuZXN0ZWQgc2FmZSByZWFkIG9yXG4gIC8vIHNhZmUgbWV0aG9kIGNhbGwgYXMgdGhpcyBuZWVkcyB0byBiZSB0cmFuc2Zvcm1lZCBpbml0aWFsbHkgdG86XG4gIC8vICAgYSA9PSBudWxsID8gbnVsbCA6IGEuYy5iLmM/LmQuZVxuICAvLyB0aGVuIHRvOlxuICAvLyAgIGEgPT0gbnVsbCA/IG51bGwgOiBhLmIuYyA9PSBudWxsID8gbnVsbCA6IGEuYi5jLmQuZVxuICBwcml2YXRlIGxlZnRNb3N0U2FmZU5vZGUoYXN0OiBjZEFzdC5BU1QpOiBjZEFzdC5TYWZlUHJvcGVydHlSZWFkfGNkQXN0LlNhZmVLZXllZFJlYWQge1xuICAgIGNvbnN0IHZpc2l0ID0gKHZpc2l0b3I6IGNkQXN0LkFzdFZpc2l0b3IsIGFzdDogY2RBc3QuQVNUKTogYW55ID0+IHtcbiAgICAgIHJldHVybiAodGhpcy5fbm9kZU1hcC5nZXQoYXN0KSB8fCBhc3QpLnZpc2l0KHZpc2l0b3IpO1xuICAgIH07XG4gICAgcmV0dXJuIGFzdC52aXNpdCh7XG4gICAgICB2aXNpdFVuYXJ5KGFzdDogY2RBc3QuVW5hcnkpIHtcbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICB9LFxuICAgICAgdmlzaXRCaW5hcnkoYXN0OiBjZEFzdC5CaW5hcnkpIHtcbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICB9LFxuICAgICAgdmlzaXRDaGFpbihhc3Q6IGNkQXN0LkNoYWluKSB7XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgICAgfSxcbiAgICAgIHZpc2l0Q29uZGl0aW9uYWwoYXN0OiBjZEFzdC5Db25kaXRpb25hbCkge1xuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgIH0sXG4gICAgICB2aXNpdENhbGwoYXN0OiBjZEFzdC5DYWxsKSB7XG4gICAgICAgIHJldHVybiB2aXNpdCh0aGlzLCBhc3QucmVjZWl2ZXIpO1xuICAgICAgfSxcbiAgICAgIHZpc2l0U2FmZUNhbGwoYXN0OiBjZEFzdC5TYWZlQ2FsbCkge1xuICAgICAgICByZXR1cm4gdmlzaXQodGhpcywgYXN0LnJlY2VpdmVyKSB8fCBhc3Q7XG4gICAgICB9LFxuICAgICAgdmlzaXRJbXBsaWNpdFJlY2VpdmVyKGFzdDogY2RBc3QuSW1wbGljaXRSZWNlaXZlcikge1xuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgIH0sXG4gICAgICB2aXNpdFRoaXNSZWNlaXZlcihhc3Q6IGNkQXN0LlRoaXNSZWNlaXZlcikge1xuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgIH0sXG4gICAgICB2aXNpdEludGVycG9sYXRpb24oYXN0OiBjZEFzdC5JbnRlcnBvbGF0aW9uKSB7XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgICAgfSxcbiAgICAgIHZpc2l0S2V5ZWRSZWFkKGFzdDogY2RBc3QuS2V5ZWRSZWFkKSB7XG4gICAgICAgIHJldHVybiB2aXNpdCh0aGlzLCBhc3QucmVjZWl2ZXIpO1xuICAgICAgfSxcbiAgICAgIHZpc2l0S2V5ZWRXcml0ZShhc3Q6IGNkQXN0LktleWVkV3JpdGUpIHtcbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICB9LFxuICAgICAgdmlzaXRMaXRlcmFsQXJyYXkoYXN0OiBjZEFzdC5MaXRlcmFsQXJyYXkpIHtcbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICB9LFxuICAgICAgdmlzaXRMaXRlcmFsTWFwKGFzdDogY2RBc3QuTGl0ZXJhbE1hcCkge1xuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgIH0sXG4gICAgICB2aXNpdExpdGVyYWxQcmltaXRpdmUoYXN0OiBjZEFzdC5MaXRlcmFsUHJpbWl0aXZlKSB7XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgICAgfSxcbiAgICAgIHZpc2l0UGlwZShhc3Q6IGNkQXN0LkJpbmRpbmdQaXBlKSB7XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgICAgfSxcbiAgICAgIHZpc2l0UHJlZml4Tm90KGFzdDogY2RBc3QuUHJlZml4Tm90KSB7XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgICAgfSxcbiAgICAgIHZpc2l0Tm9uTnVsbEFzc2VydChhc3Q6IGNkQXN0Lk5vbk51bGxBc3NlcnQpIHtcbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICB9LFxuICAgICAgdmlzaXRQcm9wZXJ0eVJlYWQoYXN0OiBjZEFzdC5Qcm9wZXJ0eVJlYWQpIHtcbiAgICAgICAgcmV0dXJuIHZpc2l0KHRoaXMsIGFzdC5yZWNlaXZlcik7XG4gICAgICB9LFxuICAgICAgdmlzaXRQcm9wZXJ0eVdyaXRlKGFzdDogY2RBc3QuUHJvcGVydHlXcml0ZSkge1xuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgIH0sXG4gICAgICB2aXNpdFF1b3RlKGFzdDogY2RBc3QuUXVvdGUpIHtcbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICB9LFxuICAgICAgdmlzaXRTYWZlUHJvcGVydHlSZWFkKGFzdDogY2RBc3QuU2FmZVByb3BlcnR5UmVhZCkge1xuICAgICAgICByZXR1cm4gdmlzaXQodGhpcywgYXN0LnJlY2VpdmVyKSB8fCBhc3Q7XG4gICAgICB9LFxuICAgICAgdmlzaXRTYWZlS2V5ZWRSZWFkKGFzdDogY2RBc3QuU2FmZUtleWVkUmVhZCkge1xuICAgICAgICByZXR1cm4gdmlzaXQodGhpcywgYXN0LnJlY2VpdmVyKSB8fCBhc3Q7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICAvLyBSZXR1cm5zIHRydWUgb2YgdGhlIEFTVCBpbmNsdWRlcyBhIG1ldGhvZCBvciBhIHBpcGUgaW5kaWNhdGluZyB0aGF0LCBpZiB0aGVcbiAgLy8gZXhwcmVzc2lvbiBpcyB1c2VkIGFzIHRoZSB0YXJnZXQgb2YgYSBzYWZlIHByb3BlcnR5IG9yIG1ldGhvZCBhY2Nlc3MgdGhlblxuICAvLyB0aGUgZXhwcmVzc2lvbiBzaG91bGQgYmUgc3RvcmVkIGludG8gYSB0ZW1wb3JhcnkgdmFyaWFibGUuXG4gIHByaXZhdGUgbmVlZHNUZW1wb3JhcnlJblNhZmVBY2Nlc3MoYXN0OiBjZEFzdC5BU1QpOiBib29sZWFuIHtcbiAgICBjb25zdCB2aXNpdCA9ICh2aXNpdG9yOiBjZEFzdC5Bc3RWaXNpdG9yLCBhc3Q6IGNkQXN0LkFTVCk6IGJvb2xlYW4gPT4ge1xuICAgICAgcmV0dXJuIGFzdCAmJiAodGhpcy5fbm9kZU1hcC5nZXQoYXN0KSB8fCBhc3QpLnZpc2l0KHZpc2l0b3IpO1xuICAgIH07XG4gICAgY29uc3QgdmlzaXRTb21lID0gKHZpc2l0b3I6IGNkQXN0LkFzdFZpc2l0b3IsIGFzdDogY2RBc3QuQVNUW10pOiBib29sZWFuID0+IHtcbiAgICAgIHJldHVybiBhc3Quc29tZShhc3QgPT4gdmlzaXQodmlzaXRvciwgYXN0KSk7XG4gICAgfTtcbiAgICByZXR1cm4gYXN0LnZpc2l0KHtcbiAgICAgIHZpc2l0VW5hcnkoYXN0OiBjZEFzdC5VbmFyeSk6IGJvb2xlYW4ge1xuICAgICAgICByZXR1cm4gdmlzaXQodGhpcywgYXN0LmV4cHIpO1xuICAgICAgfSxcbiAgICAgIHZpc2l0QmluYXJ5KGFzdDogY2RBc3QuQmluYXJ5KTogYm9vbGVhbiB7XG4gICAgICAgIHJldHVybiB2aXNpdCh0aGlzLCBhc3QubGVmdCkgfHwgdmlzaXQodGhpcywgYXN0LnJpZ2h0KTtcbiAgICAgIH0sXG4gICAgICB2aXNpdENoYWluKGFzdDogY2RBc3QuQ2hhaW4pIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfSxcbiAgICAgIHZpc2l0Q29uZGl0aW9uYWwoYXN0OiBjZEFzdC5Db25kaXRpb25hbCk6IGJvb2xlYW4ge1xuICAgICAgICByZXR1cm4gdmlzaXQodGhpcywgYXN0LmNvbmRpdGlvbikgfHwgdmlzaXQodGhpcywgYXN0LnRydWVFeHApIHx8IHZpc2l0KHRoaXMsIGFzdC5mYWxzZUV4cCk7XG4gICAgICB9LFxuICAgICAgdmlzaXRDYWxsKGFzdDogY2RBc3QuQ2FsbCkge1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH0sXG4gICAgICB2aXNpdFNhZmVDYWxsKGFzdDogY2RBc3QuU2FmZUNhbGwpIHtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9LFxuICAgICAgdmlzaXRJbXBsaWNpdFJlY2VpdmVyKGFzdDogY2RBc3QuSW1wbGljaXRSZWNlaXZlcikge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9LFxuICAgICAgdmlzaXRUaGlzUmVjZWl2ZXIoYXN0OiBjZEFzdC5UaGlzUmVjZWl2ZXIpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfSxcbiAgICAgIHZpc2l0SW50ZXJwb2xhdGlvbihhc3Q6IGNkQXN0LkludGVycG9sYXRpb24pIHtcbiAgICAgICAgcmV0dXJuIHZpc2l0U29tZSh0aGlzLCBhc3QuZXhwcmVzc2lvbnMpO1xuICAgICAgfSxcbiAgICAgIHZpc2l0S2V5ZWRSZWFkKGFzdDogY2RBc3QuS2V5ZWRSZWFkKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH0sXG4gICAgICB2aXNpdEtleWVkV3JpdGUoYXN0OiBjZEFzdC5LZXllZFdyaXRlKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH0sXG4gICAgICB2aXNpdExpdGVyYWxBcnJheShhc3Q6IGNkQXN0LkxpdGVyYWxBcnJheSkge1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH0sXG4gICAgICB2aXNpdExpdGVyYWxNYXAoYXN0OiBjZEFzdC5MaXRlcmFsTWFwKSB7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfSxcbiAgICAgIHZpc2l0TGl0ZXJhbFByaW1pdGl2ZShhc3Q6IGNkQXN0LkxpdGVyYWxQcmltaXRpdmUpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfSxcbiAgICAgIHZpc2l0UGlwZShhc3Q6IGNkQXN0LkJpbmRpbmdQaXBlKSB7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfSxcbiAgICAgIHZpc2l0UHJlZml4Tm90KGFzdDogY2RBc3QuUHJlZml4Tm90KSB7XG4gICAgICAgIHJldHVybiB2aXNpdCh0aGlzLCBhc3QuZXhwcmVzc2lvbik7XG4gICAgICB9LFxuICAgICAgdmlzaXROb25OdWxsQXNzZXJ0KGFzdDogY2RBc3QuUHJlZml4Tm90KSB7XG4gICAgICAgIHJldHVybiB2aXNpdCh0aGlzLCBhc3QuZXhwcmVzc2lvbik7XG4gICAgICB9LFxuICAgICAgdmlzaXRQcm9wZXJ0eVJlYWQoYXN0OiBjZEFzdC5Qcm9wZXJ0eVJlYWQpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfSxcbiAgICAgIHZpc2l0UHJvcGVydHlXcml0ZShhc3Q6IGNkQXN0LlByb3BlcnR5V3JpdGUpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfSxcbiAgICAgIHZpc2l0UXVvdGUoYXN0OiBjZEFzdC5RdW90ZSkge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9LFxuICAgICAgdmlzaXRTYWZlUHJvcGVydHlSZWFkKGFzdDogY2RBc3QuU2FmZVByb3BlcnR5UmVhZCkge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9LFxuICAgICAgdmlzaXRTYWZlS2V5ZWRSZWFkKGFzdDogY2RBc3QuU2FmZUtleWVkUmVhZCkge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICBwcml2YXRlIGFsbG9jYXRlVGVtcG9yYXJ5KCk6IG8uUmVhZFZhckV4cHIge1xuICAgIGNvbnN0IHRlbXBOdW1iZXIgPSB0aGlzLl9jdXJyZW50VGVtcG9yYXJ5Kys7XG4gICAgdGhpcy50ZW1wb3JhcnlDb3VudCA9IE1hdGgubWF4KHRoaXMuX2N1cnJlbnRUZW1wb3JhcnksIHRoaXMudGVtcG9yYXJ5Q291bnQpO1xuICAgIHJldHVybiBuZXcgby5SZWFkVmFyRXhwcih0ZW1wb3JhcnlOYW1lKHRoaXMuYmluZGluZ0lkLCB0ZW1wTnVtYmVyKSk7XG4gIH1cblxuICBwcml2YXRlIHJlbGVhc2VUZW1wb3JhcnkodGVtcG9yYXJ5OiBvLlJlYWRWYXJFeHByKSB7XG4gICAgdGhpcy5fY3VycmVudFRlbXBvcmFyeS0tO1xuICAgIGlmICh0ZW1wb3JhcnkubmFtZSAhPSB0ZW1wb3JhcnlOYW1lKHRoaXMuYmluZGluZ0lkLCB0aGlzLl9jdXJyZW50VGVtcG9yYXJ5KSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGBUZW1wb3JhcnkgJHt0ZW1wb3JhcnkubmFtZX0gcmVsZWFzZWQgb3V0IG9mIG9yZGVyYCk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIENyZWF0ZXMgYW4gYWJzb2x1dGUgYFBhcnNlU291cmNlU3BhbmAgZnJvbSB0aGUgcmVsYXRpdmUgYFBhcnNlU3BhbmAuXG4gICAqXG4gICAqIGBQYXJzZVNwYW5gIG9iamVjdHMgYXJlIHJlbGF0aXZlIHRvIHRoZSBzdGFydCBvZiB0aGUgZXhwcmVzc2lvbi5cbiAgICogVGhpcyBtZXRob2QgY29udmVydHMgdGhlc2UgdG8gZnVsbCBgUGFyc2VTb3VyY2VTcGFuYCBvYmplY3RzIHRoYXRcbiAgICogc2hvdyB3aGVyZSB0aGUgc3BhbiBpcyB3aXRoaW4gdGhlIG92ZXJhbGwgc291cmNlIGZpbGUuXG4gICAqXG4gICAqIEBwYXJhbSBzcGFuIHRoZSByZWxhdGl2ZSBzcGFuIHRvIGNvbnZlcnQuXG4gICAqIEByZXR1cm5zIGEgYFBhcnNlU291cmNlU3BhbmAgZm9yIHRoZSBnaXZlbiBzcGFuIG9yIG51bGwgaWYgbm9cbiAgICogYGJhc2VTb3VyY2VTcGFuYCB3YXMgcHJvdmlkZWQgdG8gdGhpcyBjbGFzcy5cbiAgICovXG4gIHByaXZhdGUgY29udmVydFNvdXJjZVNwYW4oc3BhbjogY2RBc3QuUGFyc2VTcGFuKSB7XG4gICAgaWYgKHRoaXMuYmFzZVNvdXJjZVNwYW4pIHtcbiAgICAgIGNvbnN0IHN0YXJ0ID0gdGhpcy5iYXNlU291cmNlU3Bhbi5zdGFydC5tb3ZlQnkoc3Bhbi5zdGFydCk7XG4gICAgICBjb25zdCBlbmQgPSB0aGlzLmJhc2VTb3VyY2VTcGFuLnN0YXJ0Lm1vdmVCeShzcGFuLmVuZCk7XG4gICAgICBjb25zdCBmdWxsU3RhcnQgPSB0aGlzLmJhc2VTb3VyY2VTcGFuLmZ1bGxTdGFydC5tb3ZlQnkoc3Bhbi5zdGFydCk7XG4gICAgICByZXR1cm4gbmV3IFBhcnNlU291cmNlU3BhbihzdGFydCwgZW5kLCBmdWxsU3RhcnQpO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gIH1cblxuICAvKiogQWRkcyB0aGUgbmFtZSBvZiBhbiBBU1QgdG8gdGhlIGxpc3Qgb2YgaW1wbGljaXQgcmVjZWl2ZXIgYWNjZXNzZXMuICovXG4gIHByaXZhdGUgYWRkSW1wbGljaXRSZWNlaXZlckFjY2VzcyhuYW1lOiBzdHJpbmcpIHtcbiAgICBpZiAodGhpcy5pbXBsaWNpdFJlY2VpdmVyQWNjZXNzZXMpIHtcbiAgICAgIHRoaXMuaW1wbGljaXRSZWNlaXZlckFjY2Vzc2VzLmFkZChuYW1lKTtcbiAgICB9XG4gIH1cbn1cblxuZnVuY3Rpb24gZmxhdHRlblN0YXRlbWVudHMoYXJnOiBhbnksIG91dHB1dDogby5TdGF0ZW1lbnRbXSkge1xuICBpZiAoQXJyYXkuaXNBcnJheShhcmcpKSB7XG4gICAgKDxhbnlbXT5hcmcpLmZvckVhY2goKGVudHJ5KSA9PiBmbGF0dGVuU3RhdGVtZW50cyhlbnRyeSwgb3V0cHV0KSk7XG4gIH0gZWxzZSB7XG4gICAgb3V0cHV0LnB1c2goYXJnKTtcbiAgfVxufVxuXG5mdW5jdGlvbiB1bnN1cHBvcnRlZCgpOiBuZXZlciB7XG4gIHRocm93IG5ldyBFcnJvcignVW5zdXBwb3J0ZWQgb3BlcmF0aW9uJyk7XG59XG5cbmNsYXNzIEludGVycG9sYXRpb25FeHByZXNzaW9uIGV4dGVuZHMgby5FeHByZXNzaW9uIHtcbiAgY29uc3RydWN0b3IocHVibGljIGFyZ3M6IG8uRXhwcmVzc2lvbltdKSB7XG4gICAgc3VwZXIobnVsbCwgbnVsbCk7XG4gIH1cblxuICBvdmVycmlkZSBpc0NvbnN0YW50ID0gdW5zdXBwb3J0ZWQ7XG4gIG92ZXJyaWRlIGlzRXF1aXZhbGVudCA9IHVuc3VwcG9ydGVkO1xuICBvdmVycmlkZSB2aXNpdEV4cHJlc3Npb24gPSB1bnN1cHBvcnRlZDtcbn1cblxuY2xhc3MgRGVmYXVsdExvY2FsUmVzb2x2ZXIgaW1wbGVtZW50cyBMb2NhbFJlc29sdmVyIHtcbiAgY29uc3RydWN0b3IocHVibGljIGdsb2JhbHM/OiBTZXQ8c3RyaW5nPikge31cbiAgbm90aWZ5SW1wbGljaXRSZWNlaXZlclVzZSgpOiB2b2lkIHt9XG4gIG1heWJlUmVzdG9yZVZpZXcoKTogdm9pZCB7fVxuICBnZXRMb2NhbChuYW1lOiBzdHJpbmcpOiBvLkV4cHJlc3Npb258bnVsbCB7XG4gICAgaWYgKG5hbWUgPT09IEV2ZW50SGFuZGxlclZhcnMuZXZlbnQubmFtZSkge1xuICAgICAgcmV0dXJuIEV2ZW50SGFuZGxlclZhcnMuZXZlbnQ7XG4gICAgfVxuICAgIHJldHVybiBudWxsO1xuICB9XG59XG5cbmV4cG9ydCBjbGFzcyBCdWlsdGluRnVuY3Rpb25DYWxsIGV4dGVuZHMgY2RBc3QuQ2FsbCB7XG4gIGNvbnN0cnVjdG9yKFxuICAgICAgc3BhbjogY2RBc3QuUGFyc2VTcGFuLCBzb3VyY2VTcGFuOiBjZEFzdC5BYnNvbHV0ZVNvdXJjZVNwYW4sIGFyZ3M6IGNkQXN0LkFTVFtdLFxuICAgICAgcHVibGljIGNvbnZlcnRlcjogQnVpbHRpbkNvbnZlcnRlcikge1xuICAgIHN1cGVyKHNwYW4sIHNvdXJjZVNwYW4sIG5ldyBjZEFzdC5FbXB0eUV4cHIoc3Bhbiwgc291cmNlU3BhbiksIGFyZ3MsIG51bGwhKTtcbiAgfVxufVxuIl19