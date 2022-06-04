/// <amd-module name="@angular/localize/tools/src/source_file_utils" />
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { PathManipulation } from '@angular/compiler-cli/private/localize';
import { ɵParsedTranslation, ɵSourceLocation } from '@angular/localize';
import { NodePath } from '@babel/traverse';
import { types as t } from './babel_core';
import { DiagnosticHandlingStrategy, Diagnostics } from './diagnostics';
/**
 * Is the given `expression` the global `$localize` identifier?
 *
 * @param expression The expression to check.
 * @param localizeName The configured name of `$localize`.
 */
export declare function isLocalize(expression: NodePath, localizeName: string): expression is NodePath<t.Identifier>;
/**
 * Is the given `expression` an identifier with the correct `name`?
 *
 * @param expression The expression to check.
 * @param name The name of the identifier we are looking for.
 */
export declare function isNamedIdentifier(expression: NodePath, name: string): expression is NodePath<t.Identifier>;
/**
 * Is the given `identifier` declared globally.
 *
 * @param identifier The identifier to check.
 * @publicApi used by CLI
 */
export declare function isGlobalIdentifier(identifier: NodePath<t.Identifier>): boolean;
/**
 * Build a translated expression to replace the call to `$localize`.
 * @param messageParts The static parts of the message.
 * @param substitutions The expressions to substitute into the message.
 * @publicApi used by CLI
 */
export declare function buildLocalizeReplacement(messageParts: TemplateStringsArray, substitutions: readonly t.Expression[]): t.Expression;
/**
 * Extract the message parts from the given `call` (to `$localize`).
 *
 * The message parts will either by the first argument to the `call` or it will be wrapped in call
 * to a helper function like `__makeTemplateObject`.
 *
 * @param call The AST node of the call to process.
 * @param fs The file system to use when computing source-map paths. If not provided then it uses
 *     the "current" FileSystem.
 * @publicApi used by CLI
 */
export declare function unwrapMessagePartsFromLocalizeCall(call: NodePath<t.CallExpression>, fs?: PathManipulation): [TemplateStringsArray, (ɵSourceLocation | undefined)[]];
/**
 * Parse the localize call expression to extract the arguments that hold the substition expressions.
 *
 * @param call The AST node of the call to process.
 * @param fs The file system to use when computing source-map paths. If not provided then it uses
 *     the "current" FileSystem.
 * @publicApi used by CLI
 */
export declare function unwrapSubstitutionsFromLocalizeCall(call: NodePath<t.CallExpression>, fs?: PathManipulation): [t.Expression[], (ɵSourceLocation | undefined)[]];
/**
 * Parse the tagged template literal to extract the message parts.
 *
 * @param elements The elements of the template literal to process.
 * @param fs The file system to use when computing source-map paths. If not provided then it uses
 *     the "current" FileSystem.
 * @publicApi used by CLI
 */
export declare function unwrapMessagePartsFromTemplateLiteral(elements: NodePath<t.TemplateElement>[], fs?: PathManipulation): [
    TemplateStringsArray,
    (ɵSourceLocation | undefined)[]
];
/**
 * Parse the tagged template literal to extract the interpolation expressions.
 *
 * @param quasi The AST node of the template literal to process.
 * @param fs The file system to use when computing source-map paths. If not provided then it uses
 *     the "current" FileSystem.
 * @publicApi used by CLI
 */
export declare function unwrapExpressionsFromTemplateLiteral(quasi: NodePath<t.TemplateLiteral>, fs?: PathManipulation): [t.Expression[], (ɵSourceLocation | undefined)[]];
/**
 * Wrap the given `expression` in parentheses if it is a binary expression.
 *
 * This ensures that this expression is evaluated correctly if it is embedded in another expression.
 *
 * @param expression The expression to potentially wrap.
 */
export declare function wrapInParensIfNecessary(expression: t.Expression): t.Expression;
/**
 * Extract the string values from an `array` of string literals.
 *
 * @param array The array to unwrap.
 * @param fs The file system to use when computing source-map paths. If not provided then it uses
 *     the "current" FileSystem.
 */
export declare function unwrapStringLiteralArray(array: NodePath<t.Expression>, fs?: PathManipulation): [string[], (ɵSourceLocation | undefined)[]];
/**
 * This expression is believed to be a call to a "lazy-load" template object helper function.
 * This is expected to be of the form:
 *
 * ```ts
 *  function _templateObject() {
 *    var e = _taggedTemplateLiteral(['cooked string', 'raw string']);
 *    return _templateObject = function() { return e }, e
 *  }
 * ```
 *
 * We unwrap this to return the call to `_taggedTemplateLiteral()`.
 *
 * @param call the call expression to unwrap
 * @returns the  call expression
 */
export declare function unwrapLazyLoadHelperCall(call: NodePath<t.CallExpression>): NodePath<t.CallExpression>;
/**
 * Is the given `node` an array of literal strings?
 *
 * @param node The node to test.
 */
export declare function isStringLiteralArray(node: t.Node): node is t.Expression & {
    elements: t.StringLiteral[];
};
/**
 * Are all the given `nodes` expressions?
 * @param nodes The nodes to test.
 */
export declare function isArrayOfExpressions(paths: NodePath<t.Node>[]): paths is NodePath<t.Expression>[];
/** Options that affect how the `makeEsXXXTranslatePlugin()` functions work. */
export interface TranslatePluginOptions {
    missingTranslation?: DiagnosticHandlingStrategy;
    localizeName?: string;
}
/**
 * Translate the text of the given message, using the given translations.
 *
 * Logs as warning if the translation is not available
 * @publicApi used by CLI
 */
export declare function translate(diagnostics: Diagnostics, translations: Record<string, ɵParsedTranslation>, messageParts: TemplateStringsArray, substitutions: readonly any[], missingTranslation: DiagnosticHandlingStrategy): [TemplateStringsArray, readonly any[]];
export declare class BabelParseError extends Error {
    node: t.Node;
    private readonly type;
    constructor(node: t.Node, message: string);
}
export declare function isBabelParseError(e: any): e is BabelParseError;
export declare function buildCodeFrameError(fs: PathManipulation, path: NodePath, e: BabelParseError): string;
export declare function getLocation(fs: PathManipulation, startPath: NodePath, endPath?: NodePath): ɵSourceLocation | undefined;
export declare function serializeLocationPosition(location: ɵSourceLocation): string;
