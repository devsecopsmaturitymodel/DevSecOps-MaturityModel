"use strict";
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommandScope = exports.OptionType = void 0;
/**
 * Value types of an Option.
 */
var OptionType;
(function (OptionType) {
    OptionType["Any"] = "any";
    OptionType["Array"] = "array";
    OptionType["Boolean"] = "boolean";
    OptionType["Number"] = "number";
    OptionType["String"] = "string";
})(OptionType = exports.OptionType || (exports.OptionType = {}));
/**
 * Scope of the command.
 */
var CommandScope;
(function (CommandScope) {
    CommandScope["InProject"] = "in";
    CommandScope["OutProject"] = "out";
    CommandScope["Everywhere"] = "all";
    CommandScope["Default"] = "in";
})(CommandScope = exports.CommandScope || (exports.CommandScope = {}));
