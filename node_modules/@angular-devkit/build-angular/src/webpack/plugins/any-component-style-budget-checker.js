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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnyComponentStyleBudgetChecker = void 0;
const path = __importStar(require("path"));
const webpack_1 = require("webpack");
const schema_1 = require("../../builders/browser/schema");
const bundle_calculator_1 = require("../../utils/bundle-calculator");
const webpack_diagnostics_1 = require("../../utils/webpack-diagnostics");
const PLUGIN_NAME = 'AnyComponentStyleBudgetChecker';
/**
 * Check budget sizes for component styles by emitting a warning or error if a
 * budget is exceeded by a particular component's styles.
 */
class AnyComponentStyleBudgetChecker {
    constructor(budgets) {
        this.budgets = budgets.filter((budget) => budget.type === schema_1.Type.AnyComponentStyle);
    }
    apply(compiler) {
        compiler.hooks.compilation.tap(PLUGIN_NAME, (compilation) => {
            compilation.hooks.processAssets.tap({
                name: PLUGIN_NAME,
                stage: webpack_1.Compilation.PROCESS_ASSETS_STAGE_ANALYSE,
            }, () => {
                // No budgets.
                if (this.budgets.length === 0) {
                    return;
                }
                // In AOT compilations component styles get processed in child compilations.
                if (!compilation.compiler.parentCompilation) {
                    return;
                }
                const cssExtensions = ['.css', '.scss', '.less', '.styl', '.sass'];
                const componentStyles = Object.keys(compilation.assets)
                    .filter((name) => cssExtensions.includes(path.extname(name)))
                    .map((name) => ({
                    size: compilation.assets[name].size(),
                    label: name,
                }));
                const thresholds = this.budgets.flatMap((budget) => [...(0, bundle_calculator_1.calculateThresholds)(budget)]);
                for (const { size, label } of componentStyles) {
                    for (const { severity, message } of (0, bundle_calculator_1.checkThresholds)(thresholds[Symbol.iterator](), size, label)) {
                        switch (severity) {
                            case bundle_calculator_1.ThresholdSeverity.Warning:
                                (0, webpack_diagnostics_1.addWarning)(compilation, message);
                                break;
                            case bundle_calculator_1.ThresholdSeverity.Error:
                                (0, webpack_diagnostics_1.addError)(compilation, message);
                                break;
                            default:
                                assertNever(severity);
                        }
                    }
                }
            });
        });
    }
}
exports.AnyComponentStyleBudgetChecker = AnyComponentStyleBudgetChecker;
function assertNever(input) {
    throw new Error(`Unexpected call to assertNever() with input: ${JSON.stringify(input, null /* replacer */, 4 /* tabSize */)}`);
}
