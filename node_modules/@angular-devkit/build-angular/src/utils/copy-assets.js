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
exports.copyAssets = void 0;
const fs = __importStar(require("fs"));
const glob_1 = __importDefault(require("glob"));
const path = __importStar(require("path"));
function globAsync(pattern, options) {
    return new Promise((resolve, reject) => (0, glob_1.default)(pattern, options, (e, m) => (e ? reject(e) : resolve(m))));
}
async function copyAssets(entries, basePaths, root, changed) {
    const defaultIgnore = ['.gitkeep', '**/.DS_Store', '**/Thumbs.db'];
    for (const entry of entries) {
        const cwd = path.resolve(root, entry.input);
        const files = await globAsync(entry.glob, {
            cwd,
            dot: true,
            nodir: true,
            ignore: entry.ignore ? defaultIgnore.concat(entry.ignore) : defaultIgnore,
            follow: entry.followSymlinks,
        });
        const directoryExists = new Set();
        for (const file of files) {
            const src = path.join(cwd, file);
            if (changed && !changed.has(src)) {
                continue;
            }
            const filePath = entry.flatten ? path.basename(file) : file;
            for (const base of basePaths) {
                const dest = path.join(base, entry.output, filePath);
                const dir = path.dirname(dest);
                if (!directoryExists.has(dir)) {
                    if (!fs.existsSync(dir)) {
                        fs.mkdirSync(dir, { recursive: true });
                    }
                    directoryExists.add(dir);
                }
                fs.copyFileSync(src, dest, fs.constants.COPYFILE_FICLONE);
            }
        }
    }
}
exports.copyAssets = copyAssets;
