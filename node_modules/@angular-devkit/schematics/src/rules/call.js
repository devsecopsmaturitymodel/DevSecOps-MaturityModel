"use strict";
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.callRule = exports.callSource = exports.InvalidSourceResultException = exports.InvalidRuleResultException = void 0;
const core_1 = require("@angular-devkit/core");
const rxjs_1 = require("rxjs");
const operators_1 = require("rxjs/operators");
const interface_1 = require("../tree/interface");
function _getTypeOfResult(value) {
    if (value === undefined) {
        return 'undefined';
    }
    else if (value === null) {
        return 'null';
    }
    else if (typeof value == 'function') {
        return `Function()`;
    }
    else if (typeof value != 'object') {
        return `${typeof value}(${JSON.stringify(value)})`;
    }
    else {
        if (Object.getPrototypeOf(value) == Object) {
            return `Object(${JSON.stringify(value)})`;
        }
        else if (value.constructor) {
            return `Instance of class ${value.constructor.name}`;
        }
        else {
            return 'Unknown Object';
        }
    }
}
/**
 * When a rule or source returns an invalid value.
 */
class InvalidRuleResultException extends core_1.BaseException {
    constructor(value) {
        super(`Invalid rule result: ${_getTypeOfResult(value)}.`);
    }
}
exports.InvalidRuleResultException = InvalidRuleResultException;
class InvalidSourceResultException extends core_1.BaseException {
    constructor(value) {
        super(`Invalid source result: ${_getTypeOfResult(value)}.`);
    }
}
exports.InvalidSourceResultException = InvalidSourceResultException;
function callSource(source, context) {
    const result = source(context);
    if ((0, rxjs_1.isObservable)(result)) {
        // Only return the last Tree, and make sure it's a Tree.
        return result.pipe((0, operators_1.defaultIfEmpty)(), (0, operators_1.last)(), (0, operators_1.tap)((inner) => {
            if (!inner || !(interface_1.TreeSymbol in inner)) {
                throw new InvalidSourceResultException(inner);
            }
        }));
    }
    else if (result && interface_1.TreeSymbol in result) {
        return (0, rxjs_1.of)(result);
    }
    else {
        return (0, rxjs_1.throwError)(new InvalidSourceResultException(result));
    }
}
exports.callSource = callSource;
function callRule(rule, input, context) {
    return ((0, rxjs_1.isObservable)(input) ? input : (0, rxjs_1.of)(input)).pipe((0, operators_1.mergeMap)((inputTree) => {
        const result = rule(inputTree, context);
        if (!result) {
            return (0, rxjs_1.of)(inputTree);
        }
        else if (typeof result == 'function') {
            // This is considered a Rule, chain the rule and return its output.
            return callRule(result, inputTree, context);
        }
        else if ((0, rxjs_1.isObservable)(result)) {
            // Only return the last Tree, and make sure it's a Tree.
            return result.pipe((0, operators_1.defaultIfEmpty)(), (0, operators_1.last)(), (0, operators_1.tap)((inner) => {
                if (!inner || !(interface_1.TreeSymbol in inner)) {
                    throw new InvalidRuleResultException(inner);
                }
            }));
        }
        else if ((0, core_1.isPromise)(result)) {
            return (0, rxjs_1.from)(result).pipe((0, operators_1.mergeMap)((inner) => {
                if (typeof inner === 'function') {
                    // This is considered a Rule, chain the rule and return its output.
                    return callRule(inner, inputTree, context);
                }
                else {
                    return (0, rxjs_1.of)(inputTree);
                }
            }));
        }
        else if (interface_1.TreeSymbol in result) {
            return (0, rxjs_1.of)(result);
        }
        else {
            return (0, rxjs_1.throwError)(new InvalidRuleResultException(result));
        }
    }));
}
exports.callRule = callRule;
