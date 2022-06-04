"use strict";
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.getKeywords = void 0;
const core_1 = require("@babel/core");
/**
 * The name of the Angular class metadata function created by the Angular compiler.
 */
const SET_CLASS_METADATA_NAME = 'ɵsetClassMetadata';
/**
 * Provides one or more keywords that if found within the content of a source file indicate
 * that this plugin should be used with a source file.
 *
 * @returns An a string iterable containing one or more keywords.
 */
function getKeywords() {
    return [SET_CLASS_METADATA_NAME];
}
exports.getKeywords = getKeywords;
/**
 * A babel plugin factory function for eliding the Angular class metadata function (`ɵsetClassMetadata`).
 *
 * @returns A babel plugin object instance.
 */
function default_1() {
    return {
        visitor: {
            CallExpression(path) {
                var _a;
                const callee = path.node.callee;
                // The function being called must be the metadata function name
                let calleeName;
                if (core_1.types.isMemberExpression(callee) && core_1.types.isIdentifier(callee.property)) {
                    calleeName = callee.property.name;
                }
                else if (core_1.types.isIdentifier(callee)) {
                    calleeName = callee.name;
                }
                if (calleeName !== SET_CLASS_METADATA_NAME) {
                    return;
                }
                // There must be four arguments that meet the following criteria:
                // * First must be an identifier
                // * Second must be an array literal
                const callArguments = path.node.arguments;
                if (callArguments.length !== 4 ||
                    !core_1.types.isIdentifier(callArguments[0]) ||
                    !core_1.types.isArrayExpression(callArguments[1])) {
                    return;
                }
                // The metadata function is always emitted inside a function expression
                if (!((_a = path.getFunctionParent()) === null || _a === void 0 ? void 0 : _a.isFunctionExpression())) {
                    return;
                }
                // Replace the metadata function with `void 0` which is the equivalent return value
                // of the metadata function.
                path.replaceWith(path.scope.buildUndefinedNode());
            },
        },
    };
}
exports.default = default_1;
