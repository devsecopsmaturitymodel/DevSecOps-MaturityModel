/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define("@angular/core/schematics/utils/project_tsconfig_paths", ["require", "exports", "@angular-devkit/core"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.getProjectTsConfigPaths = void 0;
    const core_1 = require("@angular-devkit/core");
    /**
     * Gets all tsconfig paths from a CLI project by reading the workspace configuration
     * and looking for common tsconfig locations.
     */
    function getProjectTsConfigPaths(tree) {
        return __awaiter(this, void 0, void 0, function* () {
            // Start with some tsconfig paths that are generally used within CLI projects. Note
            // that we are not interested in IDE-specific tsconfig files (e.g. /tsconfig.json)
            const buildPaths = new Set();
            const testPaths = new Set();
            const workspace = yield getWorkspace(tree);
            for (const [, project] of workspace.projects) {
                for (const [name, target] of project.targets) {
                    if (name !== 'build' && name !== 'test') {
                        continue;
                    }
                    for (const [, options] of allTargetOptions(target)) {
                        const tsConfig = options.tsConfig;
                        // Filter out tsconfig files that don't exist in the CLI project.
                        if (typeof tsConfig !== 'string' || !tree.exists(tsConfig)) {
                            continue;
                        }
                        if (name === 'build') {
                            buildPaths.add((0, core_1.normalize)(tsConfig));
                        }
                        else {
                            testPaths.add((0, core_1.normalize)(tsConfig));
                        }
                    }
                }
            }
            return {
                buildPaths: [...buildPaths],
                testPaths: [...testPaths],
            };
        });
    }
    exports.getProjectTsConfigPaths = getProjectTsConfigPaths;
    /** Get options for all configurations for the passed builder target. */
    function* allTargetOptions(target) {
        if (target.options) {
            yield [undefined, target.options];
        }
        if (!target.configurations) {
            return;
        }
        for (const [name, options] of Object.entries(target.configurations)) {
            if (options) {
                yield [name, options];
            }
        }
    }
    function createHost(tree) {
        return {
            readFile(path) {
                return __awaiter(this, void 0, void 0, function* () {
                    const data = tree.read(path);
                    if (!data) {
                        throw new Error('File not found.');
                    }
                    return core_1.virtualFs.fileBufferToString(data);
                });
            },
            writeFile(path, data) {
                return __awaiter(this, void 0, void 0, function* () {
                    return tree.overwrite(path, data);
                });
            },
            isDirectory(path) {
                return __awaiter(this, void 0, void 0, function* () {
                    // Approximate a directory check.
                    // We don't need to consider empty directories and hence this is a good enough approach.
                    // This is also per documentation, see:
                    // https://angular.io/guide/schematics-for-libraries#get-the-project-configuration
                    return !tree.exists(path) && tree.getDir(path).subfiles.length > 0;
                });
            },
            isFile(path) {
                return __awaiter(this, void 0, void 0, function* () {
                    return tree.exists(path);
                });
            },
        };
    }
    function getWorkspace(tree) {
        return __awaiter(this, void 0, void 0, function* () {
            const host = createHost(tree);
            const { workspace } = yield core_1.workspaces.readWorkspace('/', host);
            return workspace;
        });
    }
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJvamVjdF90c2NvbmZpZ19wYXRocy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2NvcmUvc2NoZW1hdGljcy91dGlscy9wcm9qZWN0X3RzY29uZmlnX3BhdGhzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7R0FNRzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztJQUVILCtDQUE0RTtJQUc1RTs7O09BR0c7SUFDSCxTQUFzQix1QkFBdUIsQ0FBQyxJQUFVOztZQUV0RCxtRkFBbUY7WUFDbkYsa0ZBQWtGO1lBQ2xGLE1BQU0sVUFBVSxHQUFHLElBQUksR0FBRyxFQUFVLENBQUM7WUFDckMsTUFBTSxTQUFTLEdBQUcsSUFBSSxHQUFHLEVBQVUsQ0FBQztZQUVwQyxNQUFNLFNBQVMsR0FBRyxNQUFNLFlBQVksQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUMzQyxLQUFLLE1BQU0sQ0FBQyxFQUFFLE9BQU8sQ0FBQyxJQUFJLFNBQVMsQ0FBQyxRQUFRLEVBQUU7Z0JBQzVDLEtBQUssTUFBTSxDQUFDLElBQUksRUFBRSxNQUFNLENBQUMsSUFBSSxPQUFPLENBQUMsT0FBTyxFQUFFO29CQUM1QyxJQUFJLElBQUksS0FBSyxPQUFPLElBQUksSUFBSSxLQUFLLE1BQU0sRUFBRTt3QkFDdkMsU0FBUztxQkFDVjtvQkFFRCxLQUFLLE1BQU0sQ0FBQyxFQUFFLE9BQU8sQ0FBQyxJQUFJLGdCQUFnQixDQUFDLE1BQU0sQ0FBQyxFQUFFO3dCQUNsRCxNQUFNLFFBQVEsR0FBRyxPQUFPLENBQUMsUUFBUSxDQUFDO3dCQUNsQyxpRUFBaUU7d0JBQ2pFLElBQUksT0FBTyxRQUFRLEtBQUssUUFBUSxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsRUFBRTs0QkFDMUQsU0FBUzt5QkFDVjt3QkFFRCxJQUFJLElBQUksS0FBSyxPQUFPLEVBQUU7NEJBQ3BCLFVBQVUsQ0FBQyxHQUFHLENBQUMsSUFBQSxnQkFBUyxFQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUM7eUJBQ3JDOzZCQUFNOzRCQUNMLFNBQVMsQ0FBQyxHQUFHLENBQUMsSUFBQSxnQkFBUyxFQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUM7eUJBQ3BDO3FCQUNGO2lCQUNGO2FBQ0Y7WUFFRCxPQUFPO2dCQUNMLFVBQVUsRUFBRSxDQUFDLEdBQUcsVUFBVSxDQUFDO2dCQUMzQixTQUFTLEVBQUUsQ0FBQyxHQUFHLFNBQVMsQ0FBQzthQUMxQixDQUFDO1FBQ0osQ0FBQztLQUFBO0lBbENELDBEQWtDQztJQUVELHdFQUF3RTtJQUN4RSxRQUFRLENBQUMsQ0FDTCxnQkFBZ0IsQ0FBQyxNQUFtQztRQUV0RCxJQUFJLE1BQU0sQ0FBQyxPQUFPLEVBQUU7WUFDbEIsTUFBTSxDQUFDLFNBQVMsRUFBRSxNQUFNLENBQUMsT0FBTyxDQUFDLENBQUM7U0FDbkM7UUFFRCxJQUFJLENBQUMsTUFBTSxDQUFDLGNBQWMsRUFBRTtZQUMxQixPQUFPO1NBQ1I7UUFFRCxLQUFLLE1BQU0sQ0FBQyxJQUFJLEVBQUUsT0FBTyxDQUFDLElBQUksTUFBTSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsY0FBYyxDQUFDLEVBQUU7WUFDbkUsSUFBSSxPQUFPLEVBQUU7Z0JBQ1gsTUFBTSxDQUFDLElBQUksRUFBRSxPQUFPLENBQUMsQ0FBQzthQUN2QjtTQUNGO0lBQ0gsQ0FBQztJQUVELFNBQVMsVUFBVSxDQUFDLElBQVU7UUFDNUIsT0FBTztZQUNDLFFBQVEsQ0FBQyxJQUFZOztvQkFDekIsTUFBTSxJQUFJLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztvQkFDN0IsSUFBSSxDQUFDLElBQUksRUFBRTt3QkFDVCxNQUFNLElBQUksS0FBSyxDQUFDLGlCQUFpQixDQUFDLENBQUM7cUJBQ3BDO29CQUVELE9BQU8sZ0JBQVMsQ0FBQyxrQkFBa0IsQ0FBQyxJQUFJLENBQUMsQ0FBQztnQkFDNUMsQ0FBQzthQUFBO1lBQ0ssU0FBUyxDQUFDLElBQVksRUFBRSxJQUFZOztvQkFDeEMsT0FBTyxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsQ0FBQztnQkFDcEMsQ0FBQzthQUFBO1lBQ0ssV0FBVyxDQUFDLElBQVk7O29CQUM1QixpQ0FBaUM7b0JBQ2pDLHdGQUF3RjtvQkFDeEYsdUNBQXVDO29CQUN2QyxrRkFBa0Y7b0JBQ2xGLE9BQU8sQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsUUFBUSxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUM7Z0JBQ3JFLENBQUM7YUFBQTtZQUNLLE1BQU0sQ0FBQyxJQUFZOztvQkFDdkIsT0FBTyxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDO2dCQUMzQixDQUFDO2FBQUE7U0FDRixDQUFDO0lBQ0osQ0FBQztJQUVELFNBQWUsWUFBWSxDQUFDLElBQVU7O1lBQ3BDLE1BQU0sSUFBSSxHQUFHLFVBQVUsQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUM5QixNQUFNLEVBQUMsU0FBUyxFQUFDLEdBQUcsTUFBTSxpQkFBVSxDQUFDLGFBQWEsQ0FBQyxHQUFHLEVBQUUsSUFBSSxDQUFDLENBQUM7WUFFOUQsT0FBTyxTQUFTLENBQUM7UUFDbkIsQ0FBQztLQUFBIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7anNvbiwgbm9ybWFsaXplLCB2aXJ0dWFsRnMsIHdvcmtzcGFjZXN9IGZyb20gJ0Bhbmd1bGFyLWRldmtpdC9jb3JlJztcbmltcG9ydCB7VHJlZX0gZnJvbSAnQGFuZ3VsYXItZGV2a2l0L3NjaGVtYXRpY3MnO1xuXG4vKipcbiAqIEdldHMgYWxsIHRzY29uZmlnIHBhdGhzIGZyb20gYSBDTEkgcHJvamVjdCBieSByZWFkaW5nIHRoZSB3b3Jrc3BhY2UgY29uZmlndXJhdGlvblxuICogYW5kIGxvb2tpbmcgZm9yIGNvbW1vbiB0c2NvbmZpZyBsb2NhdGlvbnMuXG4gKi9cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBnZXRQcm9qZWN0VHNDb25maWdQYXRocyh0cmVlOiBUcmVlKTpcbiAgICBQcm9taXNlPHtidWlsZFBhdGhzOiBzdHJpbmdbXTsgdGVzdFBhdGhzOiBzdHJpbmdbXTt9PiB7XG4gIC8vIFN0YXJ0IHdpdGggc29tZSB0c2NvbmZpZyBwYXRocyB0aGF0IGFyZSBnZW5lcmFsbHkgdXNlZCB3aXRoaW4gQ0xJIHByb2plY3RzLiBOb3RlXG4gIC8vIHRoYXQgd2UgYXJlIG5vdCBpbnRlcmVzdGVkIGluIElERS1zcGVjaWZpYyB0c2NvbmZpZyBmaWxlcyAoZS5nLiAvdHNjb25maWcuanNvbilcbiAgY29uc3QgYnVpbGRQYXRocyA9IG5ldyBTZXQ8c3RyaW5nPigpO1xuICBjb25zdCB0ZXN0UGF0aHMgPSBuZXcgU2V0PHN0cmluZz4oKTtcblxuICBjb25zdCB3b3Jrc3BhY2UgPSBhd2FpdCBnZXRXb3Jrc3BhY2UodHJlZSk7XG4gIGZvciAoY29uc3QgWywgcHJvamVjdF0gb2Ygd29ya3NwYWNlLnByb2plY3RzKSB7XG4gICAgZm9yIChjb25zdCBbbmFtZSwgdGFyZ2V0XSBvZiBwcm9qZWN0LnRhcmdldHMpIHtcbiAgICAgIGlmIChuYW1lICE9PSAnYnVpbGQnICYmIG5hbWUgIT09ICd0ZXN0Jykge1xuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cblxuICAgICAgZm9yIChjb25zdCBbLCBvcHRpb25zXSBvZiBhbGxUYXJnZXRPcHRpb25zKHRhcmdldCkpIHtcbiAgICAgICAgY29uc3QgdHNDb25maWcgPSBvcHRpb25zLnRzQ29uZmlnO1xuICAgICAgICAvLyBGaWx0ZXIgb3V0IHRzY29uZmlnIGZpbGVzIHRoYXQgZG9uJ3QgZXhpc3QgaW4gdGhlIENMSSBwcm9qZWN0LlxuICAgICAgICBpZiAodHlwZW9mIHRzQ29uZmlnICE9PSAnc3RyaW5nJyB8fCAhdHJlZS5leGlzdHModHNDb25maWcpKSB7XG4gICAgICAgICAgY29udGludWU7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAobmFtZSA9PT0gJ2J1aWxkJykge1xuICAgICAgICAgIGJ1aWxkUGF0aHMuYWRkKG5vcm1hbGl6ZSh0c0NvbmZpZykpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRlc3RQYXRocy5hZGQobm9ybWFsaXplKHRzQ29uZmlnKSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICByZXR1cm4ge1xuICAgIGJ1aWxkUGF0aHM6IFsuLi5idWlsZFBhdGhzXSxcbiAgICB0ZXN0UGF0aHM6IFsuLi50ZXN0UGF0aHNdLFxuICB9O1xufVxuXG4vKiogR2V0IG9wdGlvbnMgZm9yIGFsbCBjb25maWd1cmF0aW9ucyBmb3IgdGhlIHBhc3NlZCBidWlsZGVyIHRhcmdldC4gKi9cbmZ1bmN0aW9uKlxuICAgIGFsbFRhcmdldE9wdGlvbnModGFyZ2V0OiB3b3Jrc3BhY2VzLlRhcmdldERlZmluaXRpb24pOlxuICAgICAgICBJdGVyYWJsZTxbc3RyaW5nIHwgdW5kZWZpbmVkLCBSZWNvcmQ8c3RyaW5nLCBqc29uLkpzb25WYWx1ZXx1bmRlZmluZWQ+XT4ge1xuICBpZiAodGFyZ2V0Lm9wdGlvbnMpIHtcbiAgICB5aWVsZCBbdW5kZWZpbmVkLCB0YXJnZXQub3B0aW9uc107XG4gIH1cblxuICBpZiAoIXRhcmdldC5jb25maWd1cmF0aW9ucykge1xuICAgIHJldHVybjtcbiAgfVxuXG4gIGZvciAoY29uc3QgW25hbWUsIG9wdGlvbnNdIG9mIE9iamVjdC5lbnRyaWVzKHRhcmdldC5jb25maWd1cmF0aW9ucykpIHtcbiAgICBpZiAob3B0aW9ucykge1xuICAgICAgeWllbGQgW25hbWUsIG9wdGlvbnNdO1xuICAgIH1cbiAgfVxufVxuXG5mdW5jdGlvbiBjcmVhdGVIb3N0KHRyZWU6IFRyZWUpOiB3b3Jrc3BhY2VzLldvcmtzcGFjZUhvc3Qge1xuICByZXR1cm4ge1xuICAgIGFzeW5jIHJlYWRGaWxlKHBhdGg6IHN0cmluZyk6IFByb21pc2U8c3RyaW5nPiB7XG4gICAgICBjb25zdCBkYXRhID0gdHJlZS5yZWFkKHBhdGgpO1xuICAgICAgaWYgKCFkYXRhKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcignRmlsZSBub3QgZm91bmQuJyk7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiB2aXJ0dWFsRnMuZmlsZUJ1ZmZlclRvU3RyaW5nKGRhdGEpO1xuICAgIH0sXG4gICAgYXN5bmMgd3JpdGVGaWxlKHBhdGg6IHN0cmluZywgZGF0YTogc3RyaW5nKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgICByZXR1cm4gdHJlZS5vdmVyd3JpdGUocGF0aCwgZGF0YSk7XG4gICAgfSxcbiAgICBhc3luYyBpc0RpcmVjdG9yeShwYXRoOiBzdHJpbmcpOiBQcm9taXNlPGJvb2xlYW4+IHtcbiAgICAgIC8vIEFwcHJveGltYXRlIGEgZGlyZWN0b3J5IGNoZWNrLlxuICAgICAgLy8gV2UgZG9uJ3QgbmVlZCB0byBjb25zaWRlciBlbXB0eSBkaXJlY3RvcmllcyBhbmQgaGVuY2UgdGhpcyBpcyBhIGdvb2QgZW5vdWdoIGFwcHJvYWNoLlxuICAgICAgLy8gVGhpcyBpcyBhbHNvIHBlciBkb2N1bWVudGF0aW9uLCBzZWU6XG4gICAgICAvLyBodHRwczovL2FuZ3VsYXIuaW8vZ3VpZGUvc2NoZW1hdGljcy1mb3ItbGlicmFyaWVzI2dldC10aGUtcHJvamVjdC1jb25maWd1cmF0aW9uXG4gICAgICByZXR1cm4gIXRyZWUuZXhpc3RzKHBhdGgpICYmIHRyZWUuZ2V0RGlyKHBhdGgpLnN1YmZpbGVzLmxlbmd0aCA+IDA7XG4gICAgfSxcbiAgICBhc3luYyBpc0ZpbGUocGF0aDogc3RyaW5nKTogUHJvbWlzZTxib29sZWFuPiB7XG4gICAgICByZXR1cm4gdHJlZS5leGlzdHMocGF0aCk7XG4gICAgfSxcbiAgfTtcbn1cblxuYXN5bmMgZnVuY3Rpb24gZ2V0V29ya3NwYWNlKHRyZWU6IFRyZWUpOiBQcm9taXNlPHdvcmtzcGFjZXMuV29ya3NwYWNlRGVmaW5pdGlvbj4ge1xuICBjb25zdCBob3N0ID0gY3JlYXRlSG9zdCh0cmVlKTtcbiAgY29uc3Qge3dvcmtzcGFjZX0gPSBhd2FpdCB3b3Jrc3BhY2VzLnJlYWRXb3Jrc3BhY2UoJy8nLCBob3N0KTtcblxuICByZXR1cm4gd29ya3NwYWNlO1xufVxuIl19