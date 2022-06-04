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
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateOptionsWithSchema = exports.NodeModulesTestEngineHost = exports.NodePackageDoesNotSupportSchematics = exports.NodeModulesEngineHost = exports.FileSystemEngineHost = void 0;
__exportStar(require("./description"), exports);
__exportStar(require("./export-ref"), exports);
__exportStar(require("./file-system-engine-host-base"), exports);
__exportStar(require("./workflow/node-workflow"), exports);
var file_system_engine_host_1 = require("./file-system-engine-host");
Object.defineProperty(exports, "FileSystemEngineHost", { enumerable: true, get: function () { return file_system_engine_host_1.FileSystemEngineHost; } });
var node_module_engine_host_1 = require("./node-module-engine-host");
Object.defineProperty(exports, "NodeModulesEngineHost", { enumerable: true, get: function () { return node_module_engine_host_1.NodeModulesEngineHost; } });
Object.defineProperty(exports, "NodePackageDoesNotSupportSchematics", { enumerable: true, get: function () { return node_module_engine_host_1.NodePackageDoesNotSupportSchematics; } });
var node_modules_test_engine_host_1 = require("./node-modules-test-engine-host");
Object.defineProperty(exports, "NodeModulesTestEngineHost", { enumerable: true, get: function () { return node_modules_test_engine_host_1.NodeModulesTestEngineHost; } });
var schema_option_transform_1 = require("./schema-option-transform");
Object.defineProperty(exports, "validateOptionsWithSchema", { enumerable: true, get: function () { return schema_option_transform_1.validateOptionsWithSchema; } });
