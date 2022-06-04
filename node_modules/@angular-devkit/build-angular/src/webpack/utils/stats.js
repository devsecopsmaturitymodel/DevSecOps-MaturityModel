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
exports.webpackStatsLogger = exports.createWebpackLoggingCallback = exports.statsHasWarnings = exports.statsHasErrors = exports.statsErrorsToString = exports.statsWarningsToString = exports.generateBundleStats = exports.formatSize = void 0;
const core_1 = require("@angular-devkit/core");
const path = __importStar(require("path"));
const text_table_1 = __importDefault(require("text-table"));
const color_1 = require("../../utils/color");
const async_chunks_1 = require("./async-chunks");
const helpers_1 = require("./helpers");
function formatSize(size) {
    if (size <= 0) {
        return '0 bytes';
    }
    const abbreviations = ['bytes', 'kB', 'MB', 'GB'];
    const index = Math.floor(Math.log(size) / Math.log(1024));
    const roundedSize = size / Math.pow(1024, index);
    // bytes don't have a fraction
    const fractionDigits = index === 0 ? 0 : 2;
    return `${roundedSize.toFixed(fractionDigits)} ${abbreviations[index]}`;
}
exports.formatSize = formatSize;
function generateBundleStats(info) {
    var _a, _b, _c;
    const rawSize = typeof info.rawSize === 'number' ? info.rawSize : '-';
    const estimatedTransferSize = typeof info.estimatedTransferSize === 'number' ? info.estimatedTransferSize : '-';
    const files = (_b = (_a = info.files) === null || _a === void 0 ? void 0 : _a.filter((f) => !f.endsWith('.map')).map((f) => path.basename(f)).join(', ')) !== null && _b !== void 0 ? _b : '';
    const names = ((_c = info.names) === null || _c === void 0 ? void 0 : _c.length) ? info.names.join(', ') : '-';
    const initial = !!info.initial;
    return {
        initial,
        stats: [files, names, rawSize, estimatedTransferSize],
    };
}
exports.generateBundleStats = generateBundleStats;
function generateBuildStatsTable(data, colors, showTotalSize, showEstimatedTransferSize, budgetFailures) {
    const g = (x) => (colors ? color_1.colors.greenBright(x) : x);
    const c = (x) => (colors ? color_1.colors.cyanBright(x) : x);
    const r = (x) => (colors ? color_1.colors.redBright(x) : x);
    const y = (x) => (colors ? color_1.colors.yellowBright(x) : x);
    const bold = (x) => (colors ? color_1.colors.bold(x) : x);
    const dim = (x) => (colors ? color_1.colors.dim(x) : x);
    const getSizeColor = (name, file, defaultColor = c) => {
        const severity = budgets.get(name) || (file && budgets.get(file));
        switch (severity) {
            case 'warning':
                return y;
            case 'error':
                return r;
            default:
                return defaultColor;
        }
    };
    const changedEntryChunksStats = [];
    const changedLazyChunksStats = [];
    let initialTotalRawSize = 0;
    let initialTotalEstimatedTransferSize;
    const budgets = new Map();
    if (budgetFailures) {
        for (const { label, severity } of budgetFailures) {
            // In some cases a file can have multiple budget failures.
            // Favor error.
            if (label && (!budgets.has(label) || budgets.get(label) === 'warning')) {
                budgets.set(label, severity);
            }
        }
    }
    for (const { initial, stats } of data) {
        const [files, names, rawSize, estimatedTransferSize] = stats;
        const getRawSizeColor = getSizeColor(names, files);
        let data;
        if (showEstimatedTransferSize) {
            data = [
                g(files),
                names,
                getRawSizeColor(typeof rawSize === 'number' ? formatSize(rawSize) : rawSize),
                c(typeof estimatedTransferSize === 'number'
                    ? formatSize(estimatedTransferSize)
                    : estimatedTransferSize),
            ];
        }
        else {
            data = [
                g(files),
                names,
                getRawSizeColor(typeof rawSize === 'number' ? formatSize(rawSize) : rawSize),
                '',
            ];
        }
        if (initial) {
            changedEntryChunksStats.push(data);
            if (typeof rawSize === 'number') {
                initialTotalRawSize += rawSize;
            }
            if (showEstimatedTransferSize && typeof estimatedTransferSize === 'number') {
                if (initialTotalEstimatedTransferSize === undefined) {
                    initialTotalEstimatedTransferSize = 0;
                }
                initialTotalEstimatedTransferSize += estimatedTransferSize;
            }
        }
        else {
            changedLazyChunksStats.push(data);
        }
    }
    const bundleInfo = [];
    const baseTitles = ['Names', 'Raw Size'];
    const tableAlign = ['l', 'l', 'r'];
    if (showEstimatedTransferSize) {
        baseTitles.push('Estimated Transfer Size');
        tableAlign.push('r');
    }
    // Entry chunks
    if (changedEntryChunksStats.length) {
        bundleInfo.push(['Initial Chunk Files', ...baseTitles].map(bold), ...changedEntryChunksStats);
        if (showTotalSize) {
            bundleInfo.push([]);
            const initialSizeTotalColor = getSizeColor('bundle initial', undefined, (x) => x);
            const totalSizeElements = [
                ' ',
                'Initial Total',
                initialSizeTotalColor(formatSize(initialTotalRawSize)),
            ];
            if (showEstimatedTransferSize) {
                totalSizeElements.push(typeof initialTotalEstimatedTransferSize === 'number'
                    ? formatSize(initialTotalEstimatedTransferSize)
                    : '-');
            }
            bundleInfo.push(totalSizeElements.map(bold));
        }
    }
    // Seperator
    if (changedEntryChunksStats.length && changedLazyChunksStats.length) {
        bundleInfo.push([]);
    }
    // Lazy chunks
    if (changedLazyChunksStats.length) {
        bundleInfo.push(['Lazy Chunk Files', ...baseTitles].map(bold), ...changedLazyChunksStats);
    }
    return (0, text_table_1.default)(bundleInfo, {
        hsep: dim(' | '),
        stringLength: (s) => (0, color_1.removeColor)(s).length,
        align: tableAlign,
    });
}
function generateBuildStats(hash, time, colors) {
    const w = (x) => (colors ? color_1.colors.bold.white(x) : x);
    return `Build at: ${w(new Date().toISOString())} - Hash: ${w(hash)} - Time: ${w('' + time)}ms`;
}
// We use this cache because we can have multiple builders running in the same process,
// where each builder has different output path.
// Ideally, we should create the logging callback as a factory, but that would need a refactoring.
const runsCache = new Set();
function statsToString(json, 
// eslint-disable-next-line @typescript-eslint/no-explicit-any
statsConfig, budgetFailures) {
    var _a, _b;
    if (!((_a = json.chunks) === null || _a === void 0 ? void 0 : _a.length)) {
        return '';
    }
    const colors = statsConfig.colors;
    const rs = (x) => (colors ? color_1.colors.reset(x) : x);
    const changedChunksStats = [];
    let unchangedChunkNumber = 0;
    let hasEstimatedTransferSizes = false;
    const isFirstRun = !runsCache.has(json.outputPath || '');
    for (const chunk of json.chunks) {
        // During first build we want to display unchanged chunks
        // but unchanged cached chunks are always marked as not rendered.
        if (!isFirstRun && !chunk.rendered) {
            continue;
        }
        const assets = (_b = json.assets) === null || _b === void 0 ? void 0 : _b.filter((asset) => { var _a; return (_a = chunk.files) === null || _a === void 0 ? void 0 : _a.includes(asset.name); });
        let rawSize = 0;
        let estimatedTransferSize;
        if (assets) {
            for (const asset of assets) {
                if (asset.name.endsWith('.map')) {
                    continue;
                }
                rawSize += asset.size;
                if (typeof asset.info.estimatedTransferSize === 'number') {
                    if (estimatedTransferSize === undefined) {
                        estimatedTransferSize = 0;
                        hasEstimatedTransferSizes = true;
                    }
                    estimatedTransferSize += asset.info.estimatedTransferSize;
                }
            }
        }
        changedChunksStats.push(generateBundleStats({ ...chunk, rawSize, estimatedTransferSize }));
    }
    unchangedChunkNumber = json.chunks.length - changedChunksStats.length;
    runsCache.add(json.outputPath || '');
    // Sort chunks by size in descending order
    changedChunksStats.sort((a, b) => {
        if (a.stats[2] > b.stats[2]) {
            return -1;
        }
        if (a.stats[2] < b.stats[2]) {
            return 1;
        }
        return 0;
    });
    const statsTable = generateBuildStatsTable(changedChunksStats, colors, unchangedChunkNumber === 0, hasEstimatedTransferSizes, budgetFailures);
    // In some cases we do things outside of webpack context
    // Such us index generation, service worker augmentation etc...
    // This will correct the time and include these.
    let time = 0;
    if (json.builtAt !== undefined && json.time !== undefined) {
        time = Date.now() - json.builtAt + json.time;
    }
    if (unchangedChunkNumber > 0) {
        return ('\n' +
            rs(core_1.tags.stripIndents `
      ${statsTable}

      ${unchangedChunkNumber} unchanged chunks

      ${generateBuildStats(json.hash || '', time, colors)}
      `));
    }
    else {
        return ('\n' +
            rs(core_1.tags.stripIndents `
      ${statsTable}

      ${generateBuildStats(json.hash || '', time, colors)}
      `));
    }
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function statsWarningsToString(json, statsConfig) {
    const colors = statsConfig.colors;
    const c = (x) => (colors ? color_1.colors.reset.cyan(x) : x);
    const y = (x) => (colors ? color_1.colors.reset.yellow(x) : x);
    const yb = (x) => (colors ? color_1.colors.reset.yellowBright(x) : x);
    const warnings = json.warnings ? [...json.warnings] : [];
    if (json.children) {
        warnings.push(...json.children.map((c) => { var _a; return (_a = c.warnings) !== null && _a !== void 0 ? _a : []; }).reduce((a, b) => [...a, ...b], []));
    }
    let output = '';
    for (const warning of warnings) {
        if (typeof warning === 'string') {
            output += yb(`Warning: ${warning}\n\n`);
        }
        else {
            const file = warning.file || warning.moduleName;
            if (file) {
                output += c(file);
                if (warning.loc) {
                    output += ':' + yb(warning.loc);
                }
                output += ' - ';
            }
            if (!/^warning/i.test(warning.message)) {
                output += y('Warning: ');
            }
            output += `${warning.message}\n\n`;
        }
    }
    return output ? '\n' + output : output;
}
exports.statsWarningsToString = statsWarningsToString;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function statsErrorsToString(json, statsConfig) {
    const colors = statsConfig.colors;
    const c = (x) => (colors ? color_1.colors.reset.cyan(x) : x);
    const yb = (x) => (colors ? color_1.colors.reset.yellowBright(x) : x);
    const r = (x) => (colors ? color_1.colors.reset.redBright(x) : x);
    const errors = json.errors ? [...json.errors] : [];
    if (json.children) {
        errors.push(...json.children.map((c) => (c === null || c === void 0 ? void 0 : c.errors) || []).reduce((a, b) => [...a, ...b], []));
    }
    let output = '';
    for (const error of errors) {
        if (typeof error === 'string') {
            output += r(`Error: ${error}\n\n`);
        }
        else {
            const file = error.file || error.moduleName;
            if (file) {
                output += c(file);
                if (error.loc) {
                    output += ':' + yb(error.loc);
                }
                output += ' - ';
            }
            if (!/^error/i.test(error.message)) {
                output += r('Error: ');
            }
            output += `${error.message}\n\n`;
        }
    }
    return output ? '\n' + output : output;
}
exports.statsErrorsToString = statsErrorsToString;
function statsHasErrors(json) {
    var _a, _b;
    return !!(((_a = json.errors) === null || _a === void 0 ? void 0 : _a.length) || ((_b = json.children) === null || _b === void 0 ? void 0 : _b.some((c) => { var _a; return (_a = c.errors) === null || _a === void 0 ? void 0 : _a.length; })));
}
exports.statsHasErrors = statsHasErrors;
function statsHasWarnings(json) {
    var _a, _b;
    return !!(((_a = json.warnings) === null || _a === void 0 ? void 0 : _a.length) || ((_b = json.children) === null || _b === void 0 ? void 0 : _b.some((c) => { var _a; return (_a = c.warnings) === null || _a === void 0 ? void 0 : _a.length; })));
}
exports.statsHasWarnings = statsHasWarnings;
function createWebpackLoggingCallback(options, logger) {
    const { verbose = false, scripts = [], styles = [] } = options;
    const extraEntryPoints = [
        ...(0, helpers_1.normalizeExtraEntryPoints)(styles, 'styles'),
        ...(0, helpers_1.normalizeExtraEntryPoints)(scripts, 'scripts'),
    ];
    return (stats, config) => {
        if (verbose) {
            logger.info(stats.toString(config.stats));
        }
        const rawStats = stats.toJson((0, helpers_1.getStatsOptions)(false));
        const webpackStats = {
            ...rawStats,
            chunks: (0, async_chunks_1.markAsyncChunksNonInitial)(rawStats, extraEntryPoints),
        };
        webpackStatsLogger(logger, webpackStats, config);
    };
}
exports.createWebpackLoggingCallback = createWebpackLoggingCallback;
function webpackStatsLogger(logger, json, config, budgetFailures) {
    logger.info(statsToString(json, config.stats, budgetFailures));
    if (statsHasWarnings(json)) {
        logger.warn(statsWarningsToString(json, config.stats));
    }
    if (statsHasErrors(json)) {
        logger.error(statsErrorsToString(json, config.stats));
    }
}
exports.webpackStatsLogger = webpackStatsLogger;
