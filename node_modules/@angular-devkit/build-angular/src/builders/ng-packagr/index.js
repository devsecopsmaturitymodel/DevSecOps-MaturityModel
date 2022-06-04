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
exports.execute = void 0;
const architect_1 = require("@angular-devkit/architect");
const path_1 = require("path");
const rxjs_1 = require("rxjs");
const operators_1 = require("rxjs/operators");
const normalize_cache_1 = require("../../utils/normalize-cache");
const purge_cache_1 = require("../../utils/purge-cache");
/**
 * @experimental Direct usage of this function is considered experimental.
 */
function execute(options, context) {
    return (0, rxjs_1.from)((async () => {
        var _a;
        // Purge old build disk cache.
        await (0, purge_cache_1.purgeStaleBuildCache)(context);
        const root = context.workspaceRoot;
        const packager = (await Promise.resolve().then(() => __importStar(require('ng-packagr')))).ngPackagr();
        packager.forProject((0, path_1.resolve)(root, options.project));
        if (options.tsConfig) {
            packager.withTsConfig((0, path_1.resolve)(root, options.tsConfig));
        }
        const projectName = (_a = context.target) === null || _a === void 0 ? void 0 : _a.project;
        if (!projectName) {
            throw new Error('The builder requires a target.');
        }
        const metadata = await context.getProjectMetadata(projectName);
        const { enabled: cacheEnabled, path: cacheDirectory } = (0, normalize_cache_1.normalizeCacheOptions)(metadata, context.workspaceRoot);
        const ngPackagrOptions = {
            cacheEnabled,
            cacheDirectory: (0, path_1.join)(cacheDirectory, 'ng-packagr'),
        };
        return { packager, ngPackagrOptions };
    })()).pipe((0, operators_1.switchMap)(({ packager, ngPackagrOptions }) => options.watch ? packager.watch(ngPackagrOptions) : packager.build(ngPackagrOptions)), (0, operators_1.mapTo)({ success: true }), (0, operators_1.catchError)((err) => (0, rxjs_1.of)({ success: false, error: err.message })));
}
exports.execute = execute;
exports.default = (0, architect_1.createBuilder)(execute);
