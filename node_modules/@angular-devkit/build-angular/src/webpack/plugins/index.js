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
exports.PostcssCliResources = exports.JavaScriptOptimizerPlugin = exports.JsonStatsPlugin = exports.CommonJsUsageWarnPlugin = exports.DedupeModuleResolvePlugin = exports.RemoveHashPlugin = exports.SuppressExtractedTextChunksWebpackPlugin = exports.ScriptsWebpackPlugin = exports.AnyComponentStyleBudgetChecker = void 0;
// Exports the webpack plugins we use internally.
var any_component_style_budget_checker_1 = require("./any-component-style-budget-checker");
Object.defineProperty(exports, "AnyComponentStyleBudgetChecker", { enumerable: true, get: function () { return any_component_style_budget_checker_1.AnyComponentStyleBudgetChecker; } });
var scripts_webpack_plugin_1 = require("./scripts-webpack-plugin");
Object.defineProperty(exports, "ScriptsWebpackPlugin", { enumerable: true, get: function () { return scripts_webpack_plugin_1.ScriptsWebpackPlugin; } });
var suppress_entry_chunks_webpack_plugin_1 = require("./suppress-entry-chunks-webpack-plugin");
Object.defineProperty(exports, "SuppressExtractedTextChunksWebpackPlugin", { enumerable: true, get: function () { return suppress_entry_chunks_webpack_plugin_1.SuppressExtractedTextChunksWebpackPlugin; } });
var remove_hash_plugin_1 = require("./remove-hash-plugin");
Object.defineProperty(exports, "RemoveHashPlugin", { enumerable: true, get: function () { return remove_hash_plugin_1.RemoveHashPlugin; } });
var dedupe_module_resolve_plugin_1 = require("./dedupe-module-resolve-plugin");
Object.defineProperty(exports, "DedupeModuleResolvePlugin", { enumerable: true, get: function () { return dedupe_module_resolve_plugin_1.DedupeModuleResolvePlugin; } });
var common_js_usage_warn_plugin_1 = require("./common-js-usage-warn-plugin");
Object.defineProperty(exports, "CommonJsUsageWarnPlugin", { enumerable: true, get: function () { return common_js_usage_warn_plugin_1.CommonJsUsageWarnPlugin; } });
var json_stats_plugin_1 = require("./json-stats-plugin");
Object.defineProperty(exports, "JsonStatsPlugin", { enumerable: true, get: function () { return json_stats_plugin_1.JsonStatsPlugin; } });
var javascript_optimizer_plugin_1 = require("./javascript-optimizer-plugin");
Object.defineProperty(exports, "JavaScriptOptimizerPlugin", { enumerable: true, get: function () { return javascript_optimizer_plugin_1.JavaScriptOptimizerPlugin; } });
var postcss_cli_resources_1 = require("./postcss-cli-resources");
Object.defineProperty(exports, "PostcssCliResources", { enumerable: true, get: function () { return __importDefault(postcss_cli_resources_1).default; } });
