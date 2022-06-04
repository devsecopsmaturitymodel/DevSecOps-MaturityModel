/// <amd-module name="@angular/compiler-cli/linker/babel/src/ast/babel_ast_factory" />
import { AstFactory, BinaryOperator, LeadingComment, ObjectLiteralProperty, SourceMapRange, TemplateLiteral, VariableDeclarationType } from '../../../../src/ngtsc/translator';
import { types as t } from '../babel_core';
/**
 * A Babel flavored implementation of the AstFactory.
 */
export declare class BabelAstFactory implements AstFactory<t.Statement, t.Expression> {
    /** The absolute path to the source file being compiled. */
    private sourceUrl;
    constructor(
    /** The absolute path to the source file being compiled. */
    sourceUrl: string);
    attachComments(statement: t.Statement, leadingComments: LeadingComment[]): void;
    createArrayLiteral: typeof t.arrayExpression;
    createAssignment(target: t.Expression, value: t.Expression): t.Expression;
    createBinaryExpression(leftOperand: t.Expression, operator: BinaryOperator, rightOperand: t.Expression): t.Expression;
    createBlock: typeof t.blockStatement;
    createCallExpression(callee: t.Expression, args: t.Expression[], pure: boolean): t.Expression;
    createConditional: typeof t.conditionalExpression;
    createElementAccess(expression: t.Expression, element: t.Expression): t.Expression;
    createExpressionStatement: typeof t.expressionStatement;
    createFunctionDeclaration(functionName: string, parameters: string[], body: t.Statement): t.Statement;
    createFunctionExpression(functionName: string | null, parameters: string[], body: t.Statement): t.Expression;
    createIdentifier: typeof t.identifier;
    createIfStatement: typeof t.ifStatement;
    createLiteral(value: string | number | boolean | null | undefined): t.Expression;
    createNewExpression: typeof t.newExpression;
    createObjectLiteral(properties: ObjectLiteralProperty<t.Expression>[]): t.Expression;
    createParenthesizedExpression: typeof t.parenthesizedExpression;
    createPropertyAccess(expression: t.Expression, propertyName: string): t.Expression;
    createReturnStatement: typeof t.returnStatement;
    createTaggedTemplate(tag: t.Expression, template: TemplateLiteral<t.Expression>): t.Expression;
    createThrowStatement: typeof t.throwStatement;
    createTypeOfExpression(expression: t.Expression): t.Expression;
    createUnaryExpression: typeof t.unaryExpression;
    createVariableDeclaration(variableName: string, initializer: t.Expression | null, type: VariableDeclarationType): t.Statement;
    setSourceMapRange<T extends t.Statement | t.Expression | t.TemplateElement>(node: T, sourceMapRange: SourceMapRange | null): T;
}
