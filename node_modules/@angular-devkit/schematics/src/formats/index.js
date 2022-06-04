"use strict";
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.standardFormats = exports.pathFormat = exports.htmlSelectorFormat = void 0;
const html_selector_1 = require("./html-selector");
const path_1 = require("./path");
var html_selector_2 = require("./html-selector");
Object.defineProperty(exports, "htmlSelectorFormat", { enumerable: true, get: function () { return html_selector_2.htmlSelectorFormat; } });
var path_2 = require("./path");
Object.defineProperty(exports, "pathFormat", { enumerable: true, get: function () { return path_2.pathFormat; } });
exports.standardFormats = [html_selector_1.htmlSelectorFormat, path_1.pathFormat];
