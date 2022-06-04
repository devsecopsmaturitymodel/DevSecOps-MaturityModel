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
exports.getSupportedBrowsers = void 0;
const browserslist_1 = __importDefault(require("browserslist"));
function getSupportedBrowsers(projectRoot) {
    browserslist_1.default.defaults = [
        'last 1 Chrome version',
        'last 1 Firefox version',
        'last 2 Edge major versions',
        'last 2 Safari major versions',
        'last 2 iOS major versions',
        'Firefox ESR',
    ];
    return (0, browserslist_1.default)(undefined, { path: projectRoot });
}
exports.getSupportedBrowsers = getSupportedBrowsers;
