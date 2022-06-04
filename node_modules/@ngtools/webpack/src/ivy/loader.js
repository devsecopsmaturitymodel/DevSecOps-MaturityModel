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
exports.default = exports.angularWebpackLoader = void 0;
const path = __importStar(require("path"));
const symbol_1 = require("./symbol");
const JS_FILE_REGEXP = /\.[cm]?js$/;
function angularWebpackLoader(content, map) {
    const callback = this.async();
    if (!callback) {
        throw new Error('Invalid webpack version');
    }
    const fileEmitter = this[symbol_1.AngularPluginSymbol];
    if (!fileEmitter || typeof fileEmitter !== 'object') {
        if (JS_FILE_REGEXP.test(this.resourcePath)) {
            // Passthrough for JS files when no plugin is used
            this.callback(undefined, content, map);
            return;
        }
        callback(new Error('The Angular Webpack loader requires the AngularWebpackPlugin.'));
        return;
    }
    fileEmitter
        .emit(this.resourcePath)
        .then((result) => {
        if (!result) {
            if (JS_FILE_REGEXP.test(this.resourcePath)) {
                // Return original content for JS files if not compiled by TypeScript ("allowJs")
                this.callback(undefined, content, map);
            }
            else {
                // File is not part of the compilation
                const message = `${this.resourcePath} is missing from the TypeScript compilation. ` +
                    `Please make sure it is in your tsconfig via the 'files' or 'include' property.`;
                callback(new Error(message));
            }
            return;
        }
        result.dependencies.forEach((dependency) => this.addDependency(dependency));
        let resultContent = result.content || '';
        let resultMap;
        if (result.map) {
            resultContent = resultContent.replace(/^\/\/# sourceMappingURL=[^\r\n]*/gm, '');
            resultMap = JSON.parse(result.map);
            resultMap.sources = resultMap.sources.map((source) => path.join(path.dirname(this.resourcePath), source));
        }
        callback(undefined, resultContent, resultMap);
    })
        .catch((err) => {
        // The below is needed to hide stacktraces from users.
        const message = err instanceof Error ? err.message : err;
        callback(new Error(message));
    });
}
exports.angularWebpackLoader = angularWebpackLoader;
exports.default = angularWebpackLoader;
