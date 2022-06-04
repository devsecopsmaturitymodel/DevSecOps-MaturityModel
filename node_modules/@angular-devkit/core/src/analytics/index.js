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
exports.NgCliAnalyticsMetricsFlagInfo = exports.NgCliAnalyticsDimensionsFlagInfo = exports.NgCliAnalyticsMetrics = exports.NgCliAnalyticsDimensions = void 0;
__exportStar(require("./api"), exports);
__exportStar(require("./forwarder"), exports);
__exportStar(require("./logging"), exports);
__exportStar(require("./multi"), exports);
__exportStar(require("./noop"), exports);
/**
 * MAKE SURE TO KEEP THIS IN SYNC WITH THE TABLE AND CONTENT IN `/docs/design/analytics.md`.
 * WE LIST THOSE DIMENSIONS (AND MORE).
 *
 * These cannot be in their respective schema.json file because we either change the type
 * (e.g. --buildEventLog is string, but we want to know the usage of it, not its value), or
 * some validation needs to be done (we cannot record ng add --collection if it's not marked as
 * allowed).
 */
var NgCliAnalyticsDimensions;
(function (NgCliAnalyticsDimensions) {
    NgCliAnalyticsDimensions[NgCliAnalyticsDimensions["CpuCount"] = 1] = "CpuCount";
    NgCliAnalyticsDimensions[NgCliAnalyticsDimensions["CpuSpeed"] = 2] = "CpuSpeed";
    NgCliAnalyticsDimensions[NgCliAnalyticsDimensions["RamInGigabytes"] = 3] = "RamInGigabytes";
    NgCliAnalyticsDimensions[NgCliAnalyticsDimensions["NodeVersion"] = 4] = "NodeVersion";
    NgCliAnalyticsDimensions[NgCliAnalyticsDimensions["NgAddCollection"] = 6] = "NgAddCollection";
    NgCliAnalyticsDimensions[NgCliAnalyticsDimensions["AngularCLIMajorVersion"] = 8] = "AngularCLIMajorVersion";
    NgCliAnalyticsDimensions[NgCliAnalyticsDimensions["BuildErrors"] = 20] = "BuildErrors";
})(NgCliAnalyticsDimensions = exports.NgCliAnalyticsDimensions || (exports.NgCliAnalyticsDimensions = {}));
var NgCliAnalyticsMetrics;
(function (NgCliAnalyticsMetrics) {
    NgCliAnalyticsMetrics[NgCliAnalyticsMetrics["NgComponentCount"] = 1] = "NgComponentCount";
    NgCliAnalyticsMetrics[NgCliAnalyticsMetrics["UNUSED_2"] = 2] = "UNUSED_2";
    NgCliAnalyticsMetrics[NgCliAnalyticsMetrics["UNUSED_3"] = 3] = "UNUSED_3";
    NgCliAnalyticsMetrics[NgCliAnalyticsMetrics["UNUSED_4"] = 4] = "UNUSED_4";
    NgCliAnalyticsMetrics[NgCliAnalyticsMetrics["BuildTime"] = 5] = "BuildTime";
    NgCliAnalyticsMetrics[NgCliAnalyticsMetrics["NgOnInitCount"] = 6] = "NgOnInitCount";
    NgCliAnalyticsMetrics[NgCliAnalyticsMetrics["InitialChunkSize"] = 7] = "InitialChunkSize";
    NgCliAnalyticsMetrics[NgCliAnalyticsMetrics["TotalChunkCount"] = 8] = "TotalChunkCount";
    NgCliAnalyticsMetrics[NgCliAnalyticsMetrics["TotalChunkSize"] = 9] = "TotalChunkSize";
    NgCliAnalyticsMetrics[NgCliAnalyticsMetrics["LazyChunkCount"] = 10] = "LazyChunkCount";
    NgCliAnalyticsMetrics[NgCliAnalyticsMetrics["LazyChunkSize"] = 11] = "LazyChunkSize";
    NgCliAnalyticsMetrics[NgCliAnalyticsMetrics["AssetCount"] = 12] = "AssetCount";
    NgCliAnalyticsMetrics[NgCliAnalyticsMetrics["AssetSize"] = 13] = "AssetSize";
    NgCliAnalyticsMetrics[NgCliAnalyticsMetrics["PolyfillSize"] = 14] = "PolyfillSize";
    NgCliAnalyticsMetrics[NgCliAnalyticsMetrics["CssSize"] = 15] = "CssSize";
})(NgCliAnalyticsMetrics = exports.NgCliAnalyticsMetrics || (exports.NgCliAnalyticsMetrics = {}));
// This table is used when generating the analytics.md file. It should match the enum above
// or the validate-user-analytics script will fail.
exports.NgCliAnalyticsDimensionsFlagInfo = {
    CpuCount: ['CPU Count', 'number'],
    CpuSpeed: ['CPU Speed', 'number'],
    RamInGigabytes: ['RAM (In GB)', 'number'],
    NodeVersion: ['Node Version', 'number'],
    NgAddCollection: ['--collection', 'string'],
    AngularCLIMajorVersion: ['Angular CLI Major Version', 'string'],
    BuildErrors: ['Build Errors (comma separated)', 'string'],
};
// This table is used when generating the analytics.md file. It should match the enum above
// or the validate-user-analytics script will fail.
exports.NgCliAnalyticsMetricsFlagInfo = {
    NgComponentCount: ['NgComponentCount', 'number'],
    UNUSED_2: ['UNUSED_2', 'none'],
    UNUSED_3: ['UNUSED_3', 'none'],
    UNUSED_4: ['UNUSED_4', 'none'],
    BuildTime: ['Build Time', 'number'],
    NgOnInitCount: ['NgOnInit Count', 'number'],
    InitialChunkSize: ['Initial Chunk Size', 'number'],
    TotalChunkCount: ['Total Chunk Count', 'number'],
    TotalChunkSize: ['Total Chunk Size', 'number'],
    LazyChunkCount: ['Lazy Chunk Count', 'number'],
    LazyChunkSize: ['Lazy Chunk Size', 'number'],
    AssetCount: ['Asset Count', 'number'],
    AssetSize: ['Asset Size', 'number'],
    PolyfillSize: [' Polyfill Size', 'number'],
    CssSize: [' Css Size', 'number'],
};
