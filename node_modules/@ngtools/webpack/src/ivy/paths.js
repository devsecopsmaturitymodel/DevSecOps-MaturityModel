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
exports.externalizePath = exports.normalizePath = void 0;
const nodePath = __importStar(require("path"));
const normalizationCache = new Map();
function normalizePath(path) {
    let result = normalizationCache.get(path);
    if (result === undefined) {
        result = nodePath.win32.normalize(path).replace(/\\/g, nodePath.posix.sep);
        normalizationCache.set(path, result);
    }
    return result;
}
exports.normalizePath = normalizePath;
const externalizationCache = new Map();
function externalizeForWindows(path) {
    let result = externalizationCache.get(path);
    if (result === undefined) {
        result = nodePath.win32.normalize(path);
        externalizationCache.set(path, result);
    }
    return result;
}
exports.externalizePath = (() => {
    if (process.platform !== 'win32') {
        return (path) => path;
    }
    return externalizeForWindows;
})();
