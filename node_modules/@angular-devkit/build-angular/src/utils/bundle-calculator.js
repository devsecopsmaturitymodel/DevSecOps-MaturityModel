"use strict";
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkThresholds = exports.checkBudgets = exports.calculateThresholds = exports.ThresholdSeverity = void 0;
const schema_1 = require("../builders/browser/schema");
const stats_1 = require("../webpack/utils/stats");
var ThresholdType;
(function (ThresholdType) {
    ThresholdType["Max"] = "maximum";
    ThresholdType["Min"] = "minimum";
})(ThresholdType || (ThresholdType = {}));
var ThresholdSeverity;
(function (ThresholdSeverity) {
    ThresholdSeverity["Warning"] = "warning";
    ThresholdSeverity["Error"] = "error";
})(ThresholdSeverity = exports.ThresholdSeverity || (exports.ThresholdSeverity = {}));
function* calculateThresholds(budget) {
    if (budget.maximumWarning) {
        yield {
            limit: calculateBytes(budget.maximumWarning, budget.baseline, 1),
            type: ThresholdType.Max,
            severity: ThresholdSeverity.Warning,
        };
    }
    if (budget.maximumError) {
        yield {
            limit: calculateBytes(budget.maximumError, budget.baseline, 1),
            type: ThresholdType.Max,
            severity: ThresholdSeverity.Error,
        };
    }
    if (budget.minimumWarning) {
        yield {
            limit: calculateBytes(budget.minimumWarning, budget.baseline, -1),
            type: ThresholdType.Min,
            severity: ThresholdSeverity.Warning,
        };
    }
    if (budget.minimumError) {
        yield {
            limit: calculateBytes(budget.minimumError, budget.baseline, -1),
            type: ThresholdType.Min,
            severity: ThresholdSeverity.Error,
        };
    }
    if (budget.warning) {
        yield {
            limit: calculateBytes(budget.warning, budget.baseline, -1),
            type: ThresholdType.Min,
            severity: ThresholdSeverity.Warning,
        };
        yield {
            limit: calculateBytes(budget.warning, budget.baseline, 1),
            type: ThresholdType.Max,
            severity: ThresholdSeverity.Warning,
        };
    }
    if (budget.error) {
        yield {
            limit: calculateBytes(budget.error, budget.baseline, -1),
            type: ThresholdType.Min,
            severity: ThresholdSeverity.Error,
        };
        yield {
            limit: calculateBytes(budget.error, budget.baseline, 1),
            type: ThresholdType.Max,
            severity: ThresholdSeverity.Error,
        };
    }
}
exports.calculateThresholds = calculateThresholds;
/**
 * Calculates the sizes for bundles in the budget type provided.
 */
function calculateSizes(budget, stats) {
    if (budget.type === schema_1.Type.AnyComponentStyle) {
        // Component style size information is not available post-build, this must
        // be checked mid-build via the `AnyComponentStyleBudgetChecker` plugin.
        throw new Error('Can not calculate size of AnyComponentStyle. Use `AnyComponentStyleBudgetChecker` instead.');
    }
    const calculatorMap = {
        all: AllCalculator,
        allScript: AllScriptCalculator,
        any: AnyCalculator,
        anyScript: AnyScriptCalculator,
        bundle: BundleCalculator,
        initial: InitialCalculator,
    };
    const ctor = calculatorMap[budget.type];
    const { chunks, assets } = stats;
    if (!chunks) {
        throw new Error('Webpack stats output did not include chunk information.');
    }
    if (!assets) {
        throw new Error('Webpack stats output did not include asset information.');
    }
    const calculator = new ctor(budget, chunks, assets);
    return calculator.calculate();
}
class Calculator {
    constructor(budget, chunks, assets) {
        this.budget = budget;
        this.chunks = chunks;
        this.assets = assets;
    }
    /** Calculates the size of the given chunk for the provided build type. */
    calculateChunkSize(chunk) {
        // No differential builds, get the chunk size by summing its assets.
        if (!chunk.files) {
            return 0;
        }
        return chunk.files
            .filter((file) => !file.endsWith('.map'))
            .map((file) => {
            const asset = this.assets.find((asset) => asset.name === file);
            if (!asset) {
                throw new Error(`Could not find asset for file: ${file}`);
            }
            return asset.size;
        })
            .reduce((l, r) => l + r, 0);
    }
    getAssetSize(asset) {
        return asset.size;
    }
}
/**
 * A named bundle.
 */
class BundleCalculator extends Calculator {
    calculate() {
        const budgetName = this.budget.name;
        if (!budgetName) {
            return [];
        }
        const size = this.chunks
            .filter((chunk) => { var _a; return (_a = chunk === null || chunk === void 0 ? void 0 : chunk.names) === null || _a === void 0 ? void 0 : _a.includes(budgetName); })
            .map((chunk) => this.calculateChunkSize(chunk))
            .reduce((l, r) => l + r, 0);
        return [{ size, label: this.budget.name }];
    }
}
/**
 * The sum of all initial chunks (marked as initial).
 */
class InitialCalculator extends Calculator {
    calculate() {
        return [
            {
                label: `bundle initial`,
                size: this.chunks
                    .filter((chunk) => chunk.initial)
                    .map((chunk) => this.calculateChunkSize(chunk))
                    .reduce((l, r) => l + r, 0),
            },
        ];
    }
}
/**
 * The sum of all the scripts portions.
 */
class AllScriptCalculator extends Calculator {
    calculate() {
        const size = this.assets
            .filter((asset) => asset.name.endsWith('.js'))
            .map((asset) => this.getAssetSize(asset))
            .reduce((total, size) => total + size, 0);
        return [{ size, label: 'total scripts' }];
    }
}
/**
 * All scripts and assets added together.
 */
class AllCalculator extends Calculator {
    calculate() {
        const size = this.assets
            .filter((asset) => !asset.name.endsWith('.map'))
            .map((asset) => this.getAssetSize(asset))
            .reduce((total, size) => total + size, 0);
        return [{ size, label: 'total' }];
    }
}
/**
 * Any script, individually.
 */
class AnyScriptCalculator extends Calculator {
    calculate() {
        return this.assets
            .filter((asset) => asset.name.endsWith('.js'))
            .map((asset) => ({
            size: this.getAssetSize(asset),
            label: asset.name,
        }));
    }
}
/**
 * Any script or asset (images, css, etc).
 */
class AnyCalculator extends Calculator {
    calculate() {
        return this.assets
            .filter((asset) => !asset.name.endsWith('.map'))
            .map((asset) => ({
            size: this.getAssetSize(asset),
            label: asset.name,
        }));
    }
}
/**
 * Calculate the bytes given a string value.
 */
function calculateBytes(input, baseline, factor = 1) {
    const matches = input.match(/^\s*(\d+(?:\.\d+)?)\s*(%|(?:[mM]|[kK]|[gG])?[bB])?\s*$/);
    if (!matches) {
        return NaN;
    }
    const baselineBytes = (baseline && calculateBytes(baseline)) || 0;
    let value = Number(matches[1]);
    switch (matches[2] && matches[2].toLowerCase()) {
        case '%':
            value = (baselineBytes * value) / 100;
            break;
        case 'kb':
            value *= 1024;
            break;
        case 'mb':
            value *= 1024 * 1024;
            break;
        case 'gb':
            value *= 1024 * 1024 * 1024;
            break;
    }
    if (baselineBytes === 0) {
        return value;
    }
    return baselineBytes + value * factor;
}
function* checkBudgets(budgets, webpackStats) {
    // Ignore AnyComponentStyle budgets as these are handled in `AnyComponentStyleBudgetChecker`.
    const computableBudgets = budgets.filter((budget) => budget.type !== schema_1.Type.AnyComponentStyle);
    for (const budget of computableBudgets) {
        const sizes = calculateSizes(budget, webpackStats);
        for (const { size, label } of sizes) {
            yield* checkThresholds(calculateThresholds(budget), size, label);
        }
    }
}
exports.checkBudgets = checkBudgets;
function* checkThresholds(thresholds, size, label) {
    for (const threshold of thresholds) {
        switch (threshold.type) {
            case ThresholdType.Max: {
                if (size <= threshold.limit) {
                    continue;
                }
                const sizeDifference = (0, stats_1.formatSize)(size - threshold.limit);
                yield {
                    severity: threshold.severity,
                    label,
                    message: `${label} exceeded maximum budget. Budget ${(0, stats_1.formatSize)(threshold.limit)} was not met by ${sizeDifference} with a total of ${(0, stats_1.formatSize)(size)}.`,
                };
                break;
            }
            case ThresholdType.Min: {
                if (size >= threshold.limit) {
                    continue;
                }
                const sizeDifference = (0, stats_1.formatSize)(threshold.limit - size);
                yield {
                    severity: threshold.severity,
                    label,
                    message: `${label} failed to meet minimum budget. Budget ${(0, stats_1.formatSize)(threshold.limit)} was not met by ${sizeDifference} with a total of ${(0, stats_1.formatSize)(size)}.`,
                };
                break;
            }
            default: {
                throw new Error(`Unexpected threshold type: ${ThresholdType[threshold.type]}`);
            }
        }
    }
}
exports.checkThresholds = checkThresholds;
