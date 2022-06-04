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
exports.ivy = exports.default = exports.AngularWebpackPlugin = exports.AngularWebpackLoaderPath = void 0;
const ivyInternal = __importStar(require("./ivy"));
var ivy_1 = require("./ivy");
Object.defineProperty(exports, "AngularWebpackLoaderPath", { enumerable: true, get: function () { return ivy_1.AngularWebpackLoaderPath; } });
Object.defineProperty(exports, "AngularWebpackPlugin", { enumerable: true, get: function () { return ivy_1.AngularWebpackPlugin; } });
Object.defineProperty(exports, "default", { enumerable: true, get: function () { return __importDefault(ivy_1).default; } });
/** @deprecated Deprecated as of v12, please use the direct exports
 * (`AngularWebpackPlugin` instead of `ivy.AngularWebpackPlugin`)
 */
// eslint-disable-next-line @typescript-eslint/no-namespace
var ivy;
(function (ivy) {
    ivy.AngularWebpackLoaderPath = ivyInternal.AngularWebpackLoaderPath;
    ivy.AngularWebpackPlugin = ivyInternal.AngularWebpackPlugin;
})(ivy = exports.ivy || (exports.ivy = {}));
