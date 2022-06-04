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
exports.findTests = void 0;
const fs_1 = require("fs");
const glob = __importStar(require("glob"));
const path_1 = require("path");
const is_directory_1 = require("../../utils/is-directory");
// go through all patterns and find unique list of files
function findTests(patterns, cwd, workspaceRoot) {
    return patterns.reduce((files, pattern) => {
        const relativePathToMain = cwd.replace(workspaceRoot, '').substr(1); // remove leading slash
        const tests = findMatchingTests(pattern, cwd, relativePathToMain);
        tests.forEach((file) => {
            if (!files.includes(file)) {
                files.push(file);
            }
        });
        return files;
    }, []);
}
exports.findTests = findTests;
function findMatchingTests(pattern, cwd, relativePathToMain) {
    // normalize pattern, glob lib only accepts forward slashes
    pattern = pattern.replace(/\\/g, '/');
    relativePathToMain = relativePathToMain.replace(/\\/g, '/');
    // remove relativePathToMain to support relative paths from root
    // such paths are easy to get when running scripts via IDEs
    if (pattern.startsWith(relativePathToMain + '/')) {
        pattern = pattern.substr(relativePathToMain.length + 1); // +1 to include slash
    }
    // special logic when pattern does not look like a glob
    if (!glob.hasMagic(pattern)) {
        if ((0, is_directory_1.isDirectory)((0, path_1.join)(cwd, pattern))) {
            pattern = `${pattern}/**/*.spec.@(ts|tsx)`;
        }
        else {
            // see if matching spec file exists
            const extension = (0, path_1.extname)(pattern);
            const matchingSpec = `${(0, path_1.basename)(pattern, extension)}.spec${extension}`;
            if ((0, fs_1.existsSync)((0, path_1.join)(cwd, (0, path_1.dirname)(pattern), matchingSpec))) {
                pattern = (0, path_1.join)((0, path_1.dirname)(pattern), matchingSpec).replace(/\\/g, '/');
            }
        }
    }
    const files = glob.sync(pattern, {
        cwd,
    });
    return files;
}
