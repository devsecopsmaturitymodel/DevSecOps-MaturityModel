"use strict";
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getKeywords = void 0;
const core_1 = require("@babel/core");
const helper_annotate_as_pure_1 = __importDefault(require("@babel/helper-annotate-as-pure"));
/**
 * The name of the Typescript decorator helper function created by the TypeScript compiler.
 */
const TSLIB_DECORATE_HELPER_NAME = '__decorate';
/**
 * The set of Angular static fields that should always be wrapped.
 * These fields may appear to have side effects but are safe to remove if the associated class
 * is otherwise unused within the output.
 */
const angularStaticsToWrap = new Set([
    'ɵcmp',
    'ɵdir',
    'ɵfac',
    'ɵinj',
    'ɵmod',
    'ɵpipe',
    'ɵprov',
    'INJECTOR_KEY',
]);
/**
 * An object map of static fields and related value checks for discovery of Angular generated
 * JIT related static fields.
 */
const angularStaticsToElide = {
    'ctorParameters'(path) {
        return path.isFunctionExpression() || path.isArrowFunctionExpression();
    },
    'decorators'(path) {
        return path.isArrayExpression();
    },
    'propDecorators'(path) {
        return path.isObjectExpression();
    },
};
/**
 * Provides one or more keywords that if found within the content of a source file indicate
 * that this plugin should be used with a source file.
 *
 * @returns An a string iterable containing one or more keywords.
 */
function getKeywords() {
    return ['class'];
}
exports.getKeywords = getKeywords;
/**
 * Determines whether a property and its initializer value can be safely wrapped in a pure
 * annotated IIFE. Values that may cause side effects are not considered safe to wrap.
 * Wrapping such values may cause runtime errors and/or incorrect runtime behavior.
 *
 * @param propertyName The name of the property to analyze.
 * @param assignmentValue The initializer value that will be assigned to the property.
 * @returns If the property can be safely wrapped, then true; otherwise, false.
 */
function canWrapProperty(propertyName, assignmentValue) {
    if (angularStaticsToWrap.has(propertyName)) {
        return true;
    }
    const { leadingComments } = assignmentValue.node;
    if (leadingComments === null || leadingComments === void 0 ? void 0 : leadingComments.some(
    // `@pureOrBreakMyCode` is used by closure and is present in Angular code
    ({ value }) => value.includes('@__PURE__') ||
        value.includes('#__PURE__') ||
        value.includes('@pureOrBreakMyCode'))) {
        return true;
    }
    return assignmentValue.isPure();
}
/**
 * Analyze the sibling nodes of a class to determine if any downlevel elements should be
 * wrapped in a pure annotated IIFE. Also determines if any elements have potential side
 * effects.
 *
 * @param origin The starting NodePath location for analyzing siblings.
 * @param classIdentifier The identifier node that represents the name of the class.
 * @param allowWrappingDecorators Whether to allow decorators to be wrapped.
 * @returns An object containing the results of the analysis.
 */
function analyzeClassSiblings(origin, classIdentifier, allowWrappingDecorators) {
    var _a;
    const wrapStatementPaths = [];
    let hasPotentialSideEffects = false;
    for (let i = 1;; ++i) {
        const nextStatement = origin.getSibling(+origin.key + i);
        if (!nextStatement.isExpressionStatement()) {
            break;
        }
        // Valid sibling statements for class declarations are only assignment expressions
        // and TypeScript decorator helper call expressions
        const nextExpression = nextStatement.get('expression');
        if (nextExpression.isCallExpression()) {
            if (!core_1.types.isIdentifier(nextExpression.node.callee) ||
                nextExpression.node.callee.name !== TSLIB_DECORATE_HELPER_NAME) {
                break;
            }
            if (allowWrappingDecorators) {
                wrapStatementPaths.push(nextStatement);
            }
            else {
                // Statement cannot be safely wrapped which makes wrapping the class unneeded.
                // The statement will prevent even a wrapped class from being optimized away.
                hasPotentialSideEffects = true;
            }
            continue;
        }
        else if (!nextExpression.isAssignmentExpression()) {
            break;
        }
        // Valid assignment expressions should be member access expressions using the class
        // name as the object and an identifier as the property for static fields or only
        // the class name for decorators.
        const left = nextExpression.get('left');
        if (left.isIdentifier()) {
            if (!left.scope.bindingIdentifierEquals(left.node.name, classIdentifier) ||
                !core_1.types.isCallExpression(nextExpression.node.right) ||
                !core_1.types.isIdentifier(nextExpression.node.right.callee) ||
                nextExpression.node.right.callee.name !== TSLIB_DECORATE_HELPER_NAME) {
                break;
            }
            if (allowWrappingDecorators) {
                wrapStatementPaths.push(nextStatement);
            }
            else {
                // Statement cannot be safely wrapped which makes wrapping the class unneeded.
                // The statement will prevent even a wrapped class from being optimized away.
                hasPotentialSideEffects = true;
            }
            continue;
        }
        else if (!left.isMemberExpression() ||
            !core_1.types.isIdentifier(left.node.object) ||
            !left.scope.bindingIdentifierEquals(left.node.object.name, classIdentifier) ||
            !core_1.types.isIdentifier(left.node.property)) {
            break;
        }
        const propertyName = left.node.property.name;
        const assignmentValue = nextExpression.get('right');
        if ((_a = angularStaticsToElide[propertyName]) === null || _a === void 0 ? void 0 : _a.call(angularStaticsToElide, assignmentValue)) {
            nextStatement.remove();
            --i;
        }
        else if (canWrapProperty(propertyName, assignmentValue)) {
            wrapStatementPaths.push(nextStatement);
        }
        else {
            // Statement cannot be safely wrapped which makes wrapping the class unneeded.
            // The statement will prevent even a wrapped class from being optimized away.
            hasPotentialSideEffects = true;
        }
    }
    return { hasPotentialSideEffects, wrapStatementPaths };
}
/**
 * The set of classed already visited and analyzed during the plugin's execution.
 * This is used to prevent adjusted classes from being repeatedly analyzed which can lead
 * to an infinite loop.
 */
const visitedClasses = new WeakSet();
/**
 * A babel plugin factory function for adjusting classes; primarily with Angular metadata.
 * The adjustments include wrapping classes with known safe or no side effects with pure
 * annotations to support dead code removal of unused classes. Angular compiler generated
 * metadata static fields not required in AOT mode are also elided to better support bundler-
 * level treeshaking.
 *
 * @returns A babel plugin object instance.
 */
function default_1() {
    return {
        visitor: {
            ClassDeclaration(path, state) {
                const { node: classNode, parentPath } = path;
                const { wrapDecorators } = state.opts;
                if (visitedClasses.has(classNode)) {
                    return;
                }
                // Analyze sibling statements for elements of the class that were downleveled
                const hasExport = parentPath.isExportNamedDeclaration() || parentPath.isExportDefaultDeclaration();
                const origin = hasExport ? parentPath : path;
                const { wrapStatementPaths, hasPotentialSideEffects } = analyzeClassSiblings(origin, classNode.id, wrapDecorators);
                visitedClasses.add(classNode);
                if (hasPotentialSideEffects || wrapStatementPaths.length === 0) {
                    return;
                }
                const wrapStatementNodes = [];
                for (const statementPath of wrapStatementPaths) {
                    wrapStatementNodes.push(statementPath.node);
                    statementPath.remove();
                }
                // Wrap class and safe static assignments in a pure annotated IIFE
                const container = core_1.types.arrowFunctionExpression([], core_1.types.blockStatement([
                    classNode,
                    ...wrapStatementNodes,
                    core_1.types.returnStatement(core_1.types.cloneNode(classNode.id)),
                ]));
                const replacementInitializer = core_1.types.callExpression(core_1.types.parenthesizedExpression(container), []);
                (0, helper_annotate_as_pure_1.default)(replacementInitializer);
                // Replace class with IIFE wrapped class
                const declaration = core_1.types.variableDeclaration('let', [
                    core_1.types.variableDeclarator(core_1.types.cloneNode(classNode.id), replacementInitializer),
                ]);
                if (parentPath.isExportDefaultDeclaration()) {
                    // When converted to a variable declaration, the default export must be moved
                    // to a subsequent statement to prevent a JavaScript syntax error.
                    parentPath.replaceWithMultiple([
                        declaration,
                        core_1.types.exportNamedDeclaration(undefined, [
                            core_1.types.exportSpecifier(core_1.types.cloneNode(classNode.id), core_1.types.identifier('default')),
                        ]),
                    ]);
                }
                else {
                    path.replaceWith(declaration);
                }
            },
            ClassExpression(path, state) {
                const { node: classNode, parentPath } = path;
                const { wrapDecorators } = state.opts;
                // Class expressions are used by TypeScript to represent downlevel class/constructor decorators.
                // If not wrapping decorators, they do not need to be processed.
                if (!wrapDecorators || visitedClasses.has(classNode)) {
                    return;
                }
                if (!classNode.id ||
                    !parentPath.isVariableDeclarator() ||
                    !core_1.types.isIdentifier(parentPath.node.id) ||
                    parentPath.node.id.name !== classNode.id.name) {
                    return;
                }
                const origin = parentPath.parentPath;
                if (!origin.isVariableDeclaration() || origin.node.declarations.length !== 1) {
                    return;
                }
                const { wrapStatementPaths, hasPotentialSideEffects } = analyzeClassSiblings(origin, parentPath.node.id, wrapDecorators);
                visitedClasses.add(classNode);
                if (hasPotentialSideEffects || wrapStatementPaths.length === 0) {
                    return;
                }
                const wrapStatementNodes = [];
                for (const statementPath of wrapStatementPaths) {
                    wrapStatementNodes.push(statementPath.node);
                    statementPath.remove();
                }
                // Wrap class and safe static assignments in a pure annotated IIFE
                const container = core_1.types.arrowFunctionExpression([], core_1.types.blockStatement([
                    core_1.types.variableDeclaration('let', [
                        core_1.types.variableDeclarator(core_1.types.cloneNode(classNode.id), classNode),
                    ]),
                    ...wrapStatementNodes,
                    core_1.types.returnStatement(core_1.types.cloneNode(classNode.id)),
                ]));
                const replacementInitializer = core_1.types.callExpression(core_1.types.parenthesizedExpression(container), []);
                (0, helper_annotate_as_pure_1.default)(replacementInitializer);
                // Add the wrapped class directly to the variable declaration
                parentPath.get('init').replaceWith(replacementInitializer);
            },
        },
    };
}
exports.default = default_1;
