"use strict";
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.AngularWebpackLoaderPath = exports.AngularWebpackPlugin = exports.default = void 0;
var loader_1 = require("./loader");
Object.defineProperty(exports, "default", { enumerable: true, get: function () { return loader_1.angularWebpackLoader; } });
var plugin_1 = require("./plugin");
Object.defineProperty(exports, "AngularWebpackPlugin", { enumerable: true, get: function () { return plugin_1.AngularWebpackPlugin; } });
exports.AngularWebpackLoaderPath = __filename;
