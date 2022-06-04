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
(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define("@angular/core/schematics/utils/typescript/parse_tsconfig", ["require", "exports", "path", "typescript"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.parseTsconfigFile = void 0;
    const path = __importStar(require("path"));
    const typescript_1 = __importDefault(require("typescript"));
    function parseTsconfigFile(tsconfigPath, basePath) {
        const { config } = typescript_1.default.readConfigFile(tsconfigPath, typescript_1.default.sys.readFile);
        const parseConfigHost = {
            useCaseSensitiveFileNames: typescript_1.default.sys.useCaseSensitiveFileNames,
            fileExists: typescript_1.default.sys.fileExists,
            readDirectory: typescript_1.default.sys.readDirectory,
            readFile: typescript_1.default.sys.readFile,
        };
        // Throw if incorrect arguments are passed to this function. Passing relative base paths
        // results in root directories not being resolved and in later type checking runtime errors.
        // More details can be found here: https://github.com/microsoft/TypeScript/issues/37731.
        if (!path.isAbsolute(basePath)) {
            throw Error('Unexpected relative base path has been specified.');
        }
        return typescript_1.default.parseJsonConfigFileContent(config, parseConfigHost, basePath, {});
    }
    exports.parseTsconfigFile = parseTsconfigFile;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGFyc2VfdHNjb25maWcuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9jb3JlL3NjaGVtYXRpY3MvdXRpbHMvdHlwZXNjcmlwdC9wYXJzZV90c2NvbmZpZy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0dBTUc7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztJQUVILDJDQUE2QjtJQUM3Qiw0REFBNEI7SUFFNUIsU0FBZ0IsaUJBQWlCLENBQUMsWUFBb0IsRUFBRSxRQUFnQjtRQUN0RSxNQUFNLEVBQUMsTUFBTSxFQUFDLEdBQUcsb0JBQUUsQ0FBQyxjQUFjLENBQUMsWUFBWSxFQUFFLG9CQUFFLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBQ2xFLE1BQU0sZUFBZSxHQUFHO1lBQ3RCLHlCQUF5QixFQUFFLG9CQUFFLENBQUMsR0FBRyxDQUFDLHlCQUF5QjtZQUMzRCxVQUFVLEVBQUUsb0JBQUUsQ0FBQyxHQUFHLENBQUMsVUFBVTtZQUM3QixhQUFhLEVBQUUsb0JBQUUsQ0FBQyxHQUFHLENBQUMsYUFBYTtZQUNuQyxRQUFRLEVBQUUsb0JBQUUsQ0FBQyxHQUFHLENBQUMsUUFBUTtTQUMxQixDQUFDO1FBRUYsd0ZBQXdGO1FBQ3hGLDRGQUE0RjtRQUM1Rix3RkFBd0Y7UUFDeEYsSUFBSSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsUUFBUSxDQUFDLEVBQUU7WUFDOUIsTUFBTSxLQUFLLENBQUMsbURBQW1ELENBQUMsQ0FBQztTQUNsRTtRQUVELE9BQU8sb0JBQUUsQ0FBQywwQkFBMEIsQ0FBQyxNQUFNLEVBQUUsZUFBZSxFQUFFLFFBQVEsRUFBRSxFQUFFLENBQUMsQ0FBQztJQUM5RSxDQUFDO0lBakJELDhDQWlCQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQgKiBhcyBwYXRoIGZyb20gJ3BhdGgnO1xuaW1wb3J0IHRzIGZyb20gJ3R5cGVzY3JpcHQnO1xuXG5leHBvcnQgZnVuY3Rpb24gcGFyc2VUc2NvbmZpZ0ZpbGUodHNjb25maWdQYXRoOiBzdHJpbmcsIGJhc2VQYXRoOiBzdHJpbmcpOiB0cy5QYXJzZWRDb21tYW5kTGluZSB7XG4gIGNvbnN0IHtjb25maWd9ID0gdHMucmVhZENvbmZpZ0ZpbGUodHNjb25maWdQYXRoLCB0cy5zeXMucmVhZEZpbGUpO1xuICBjb25zdCBwYXJzZUNvbmZpZ0hvc3QgPSB7XG4gICAgdXNlQ2FzZVNlbnNpdGl2ZUZpbGVOYW1lczogdHMuc3lzLnVzZUNhc2VTZW5zaXRpdmVGaWxlTmFtZXMsXG4gICAgZmlsZUV4aXN0czogdHMuc3lzLmZpbGVFeGlzdHMsXG4gICAgcmVhZERpcmVjdG9yeTogdHMuc3lzLnJlYWREaXJlY3RvcnksXG4gICAgcmVhZEZpbGU6IHRzLnN5cy5yZWFkRmlsZSxcbiAgfTtcblxuICAvLyBUaHJvdyBpZiBpbmNvcnJlY3QgYXJndW1lbnRzIGFyZSBwYXNzZWQgdG8gdGhpcyBmdW5jdGlvbi4gUGFzc2luZyByZWxhdGl2ZSBiYXNlIHBhdGhzXG4gIC8vIHJlc3VsdHMgaW4gcm9vdCBkaXJlY3RvcmllcyBub3QgYmVpbmcgcmVzb2x2ZWQgYW5kIGluIGxhdGVyIHR5cGUgY2hlY2tpbmcgcnVudGltZSBlcnJvcnMuXG4gIC8vIE1vcmUgZGV0YWlscyBjYW4gYmUgZm91bmQgaGVyZTogaHR0cHM6Ly9naXRodWIuY29tL21pY3Jvc29mdC9UeXBlU2NyaXB0L2lzc3Vlcy8zNzczMS5cbiAgaWYgKCFwYXRoLmlzQWJzb2x1dGUoYmFzZVBhdGgpKSB7XG4gICAgdGhyb3cgRXJyb3IoJ1VuZXhwZWN0ZWQgcmVsYXRpdmUgYmFzZSBwYXRoIGhhcyBiZWVuIHNwZWNpZmllZC4nKTtcbiAgfVxuXG4gIHJldHVybiB0cy5wYXJzZUpzb25Db25maWdGaWxlQ29udGVudChjb25maWcsIHBhcnNlQ29uZmlnSG9zdCwgYmFzZVBhdGgsIHt9KTtcbn1cbiJdfQ==