"use strict";
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@babel/core");
const helper_annotate_as_pure_1 = __importDefault(require("@babel/helper-annotate-as-pure"));
const tslib = __importStar(require("tslib"));
/**
 * A cached set of TypeScript helper function names used by the helper name matcher utility function.
 */
const tslibHelpers = new Set(Object.keys(tslib).filter((h) => h.startsWith('__')));
/**
 * Determinates whether an identifier name matches one of the TypeScript helper function names.
 *
 * @param name The identifier name to check.
 * @returns True, if the name matches a TypeScript helper name; otherwise, false.
 */
function isTslibHelperName(name) {
    const nameParts = name.split('$');
    const originalName = nameParts[0];
    if (nameParts.length > 2 || (nameParts.length === 2 && isNaN(+nameParts[1]))) {
        return false;
    }
    return tslibHelpers.has(originalName);
}
/**
 * A babel plugin factory function for adding the PURE annotation to top-level new and call expressions.
 *
 * @returns A babel plugin object instance.
 */
function default_1() {
    return {
        visitor: {
            CallExpression(path) {
                // If the expression has a function parent, it is not top-level
                if (path.getFunctionParent()) {
                    return;
                }
                const callee = path.node.callee;
                if (core_1.types.isFunctionExpression(callee) && path.node.arguments.length !== 0) {
                    return;
                }
                // Do not annotate TypeScript helpers emitted by the TypeScript compiler.
                // TypeScript helpers are intended to cause side effects.
                if (core_1.types.isIdentifier(callee) && isTslibHelperName(callee.name)) {
                    return;
                }
                (0, helper_annotate_as_pure_1.default)(path);
            },
            NewExpression(path) {
                // If the expression has a function parent, it is not top-level
                if (!path.getFunctionParent()) {
                    (0, helper_annotate_as_pure_1.default)(path);
                }
            },
        },
    };
}
exports.default = default_1;
