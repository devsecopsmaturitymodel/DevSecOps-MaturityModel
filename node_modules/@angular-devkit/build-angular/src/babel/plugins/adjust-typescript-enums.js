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
 * Provides one or more keywords that if found within the content of a source file indicate
 * that this plugin should be used with a source file.
 *
 * @returns An a string iterable containing one or more keywords.
 */
function getKeywords() {
    return ['var'];
}
exports.getKeywords = getKeywords;
/**
 * A babel plugin factory function for adjusting TypeScript emitted enums.
 *
 * @returns A babel plugin object instance.
 */
function default_1() {
    return {
        visitor: {
            VariableDeclaration(path, state) {
                const { parentPath, node } = path;
                const { loose } = state.opts;
                if (node.kind !== 'var' || node.declarations.length !== 1) {
                    return;
                }
                const declaration = path.get('declarations')[0];
                if (declaration.node.init) {
                    return;
                }
                const declarationId = declaration.node.id;
                if (!core_1.types.isIdentifier(declarationId)) {
                    return;
                }
                const hasExport = parentPath.isExportNamedDeclaration() || parentPath.isExportDefaultDeclaration();
                const origin = hasExport ? parentPath : path;
                const nextStatement = origin.getSibling(+origin.key + 1);
                if (!nextStatement.isExpressionStatement()) {
                    return;
                }
                const nextExpression = nextStatement.get('expression');
                if (!nextExpression.isCallExpression() || nextExpression.node.arguments.length !== 1) {
                    return;
                }
                const enumCallArgument = nextExpression.node.arguments[0];
                if (!core_1.types.isLogicalExpression(enumCallArgument, { operator: '||' })) {
                    return;
                }
                // Check if identifiers match var declaration
                if (!core_1.types.isIdentifier(enumCallArgument.left) ||
                    !nextExpression.scope.bindingIdentifierEquals(enumCallArgument.left.name, declarationId)) {
                    return;
                }
                const enumCallee = nextExpression.get('callee');
                if (!enumCallee.isFunctionExpression() || enumCallee.node.params.length !== 1) {
                    return;
                }
                const enumCalleeParam = enumCallee.node.params[0];
                const isEnumCalleeMatching = core_1.types.isIdentifier(enumCalleeParam) && enumCalleeParam.name === declarationId.name;
                // Loose mode rewrites the enum to a shorter but less TypeScript-like form
                // Note: We only can apply the `loose` mode transformation if the callee parameter matches
                // with the declaration identifier name. This is necessary in case the the declaration id has
                // been renamed to avoid collisions, as the loose transform would then break the enum assignments
                // which rely on the differently-named callee identifier name.
                let enumAssignments;
                if (loose && isEnumCalleeMatching) {
                    enumAssignments = [];
                }
                // Check if all enum member values are pure.
                // If not, leave as-is due to potential side efects
                let hasElements = false;
                for (const enumStatement of enumCallee.get('body').get('body')) {
                    if (!enumStatement.isExpressionStatement()) {
                        return;
                    }
                    const enumValueAssignment = enumStatement.get('expression');
                    if (!enumValueAssignment.isAssignmentExpression() ||
                        !enumValueAssignment.get('right').isPure()) {
                        return;
                    }
                    hasElements = true;
                    enumAssignments === null || enumAssignments === void 0 ? void 0 : enumAssignments.push(enumStatement.node);
                }
                // If there are no enum elements then there is nothing to wrap
                if (!hasElements) {
                    return;
                }
                // Remove existing enum initializer
                const enumInitializer = nextExpression.node;
                nextExpression.remove();
                // Create IIFE block contents
                let blockContents;
                if (enumAssignments) {
                    // Loose mode
                    blockContents = [
                        core_1.types.expressionStatement(core_1.types.assignmentExpression('=', core_1.types.cloneNode(declarationId), core_1.types.logicalExpression('||', core_1.types.cloneNode(declarationId), core_1.types.objectExpression([])))),
                        ...enumAssignments,
                    ];
                }
                else {
                    blockContents = [core_1.types.expressionStatement(enumInitializer)];
                }
                // Wrap existing enum initializer in a pure annotated IIFE
                const container = core_1.types.arrowFunctionExpression([], core_1.types.blockStatement([
                    ...blockContents,
                    core_1.types.returnStatement(core_1.types.cloneNode(declarationId)),
                ]));
                const replacementInitializer = core_1.types.callExpression(core_1.types.parenthesizedExpression(container), []);
                (0, helper_annotate_as_pure_1.default)(replacementInitializer);
                // Add the wrapped enum initializer directly to the variable declaration
                declaration.get('init').replaceWith(replacementInitializer);
            },
        },
    };
}
exports.default = default_1;
