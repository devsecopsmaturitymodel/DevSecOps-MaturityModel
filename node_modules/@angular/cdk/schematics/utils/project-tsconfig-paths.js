"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.getWorkspaceConfigGracefully = exports.getTargetTsconfigPath = void 0;
const core_1 = require("@angular-devkit/core");
const reader_1 = require("@angular-devkit/core/src/workspace/json/reader");
/** Name of the default Angular CLI workspace configuration files. */
const defaultWorkspaceConfigPaths = ['/angular.json', '/.angular.json'];
/** Gets the tsconfig path from the given target within the specified project. */
function getTargetTsconfigPath(project, targetName) {
    var _a, _b, _c;
    const tsconfig = (_c = (_b = (_a = project.targets) === null || _a === void 0 ? void 0 : _a.get(targetName)) === null || _b === void 0 ? void 0 : _b.options) === null || _c === void 0 ? void 0 : _c.tsConfig;
    return tsconfig ? (0, core_1.normalize)(tsconfig) : null;
}
exports.getTargetTsconfigPath = getTargetTsconfigPath;
/** Resolve the workspace configuration of the specified tree gracefully. */
function getWorkspaceConfigGracefully(tree) {
    return __awaiter(this, void 0, void 0, function* () {
        const path = defaultWorkspaceConfigPaths.find(filePath => tree.exists(filePath));
        const configBuffer = tree.read(path);
        if (!path || !configBuffer) {
            return null;
        }
        try {
            return yield (0, reader_1.readJsonWorkspace)(path, {
                readFile: (filePath) => __awaiter(this, void 0, void 0, function* () { return tree.read(filePath).toString(); }),
            });
        }
        catch (_a) {
            return null;
        }
    });
}
exports.getWorkspaceConfigGracefully = getWorkspaceConfigGracefully;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJvamVjdC10c2NvbmZpZy1wYXRocy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uL3NyYy9jZGsvc2NoZW1hdGljcy91dGlscy9wcm9qZWN0LXRzY29uZmlnLXBhdGhzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7O0dBTUc7Ozs7Ozs7Ozs7OztBQUVILCtDQUErQztBQU0vQywyRUFBaUY7QUFJakYscUVBQXFFO0FBQ3JFLE1BQU0sMkJBQTJCLEdBQUcsQ0FBQyxlQUFlLEVBQUUsZ0JBQWdCLENBQUMsQ0FBQztBQUV4RSxpRkFBaUY7QUFDakYsU0FBZ0IscUJBQXFCLENBQ25DLE9BQTBCLEVBQzFCLFVBQWtCOztJQUVsQixNQUFNLFFBQVEsR0FBRyxNQUFBLE1BQUEsTUFBQSxPQUFPLENBQUMsT0FBTywwQ0FBRSxHQUFHLENBQUMsVUFBVSxDQUFDLDBDQUFFLE9BQU8sMENBQUUsUUFBUSxDQUFDO0lBQ3JFLE9BQU8sUUFBUSxDQUFDLENBQUMsQ0FBQyxJQUFBLGdCQUFTLEVBQUMsUUFBa0IsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUM7QUFDekQsQ0FBQztBQU5ELHNEQU1DO0FBRUQsNEVBQTRFO0FBQzVFLFNBQXNCLDRCQUE0QixDQUNoRCxJQUFVOztRQUVWLE1BQU0sSUFBSSxHQUFHLDJCQUEyQixDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQztRQUNqRixNQUFNLFlBQVksR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUssQ0FBQyxDQUFDO1FBRXRDLElBQUksQ0FBQyxJQUFJLElBQUksQ0FBQyxZQUFZLEVBQUU7WUFDMUIsT0FBTyxJQUFJLENBQUM7U0FDYjtRQUVELElBQUk7WUFDRixPQUFPLE1BQU0sSUFBQSwwQkFBaUIsRUFBQyxJQUFJLEVBQUU7Z0JBQ25DLFFBQVEsRUFBRSxDQUFNLFFBQVEsRUFBQyxFQUFFLGdEQUFDLE9BQUEsSUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUUsQ0FBQyxRQUFRLEVBQUUsQ0FBQSxHQUFBO2FBQzNDLENBQUMsQ0FBQztTQUNyQjtRQUFDLFdBQU07WUFDTixPQUFPLElBQUksQ0FBQztTQUNiO0lBQ0gsQ0FBQztDQUFBO0FBakJELG9FQWlCQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge25vcm1hbGl6ZX0gZnJvbSAnQGFuZ3VsYXItZGV2a2l0L2NvcmUnO1xuaW1wb3J0IHtcbiAgUHJvamVjdERlZmluaXRpb24sXG4gIFdvcmtzcGFjZURlZmluaXRpb24sXG4gIFdvcmtzcGFjZUhvc3QsXG59IGZyb20gJ0Bhbmd1bGFyLWRldmtpdC9jb3JlL3NyYy93b3Jrc3BhY2UnO1xuaW1wb3J0IHtyZWFkSnNvbldvcmtzcGFjZX0gZnJvbSAnQGFuZ3VsYXItZGV2a2l0L2NvcmUvc3JjL3dvcmtzcGFjZS9qc29uL3JlYWRlcic7XG5pbXBvcnQge1RyZWV9IGZyb20gJ0Bhbmd1bGFyLWRldmtpdC9zY2hlbWF0aWNzJztcbmltcG9ydCB7V29ya3NwYWNlUGF0aH0gZnJvbSAnLi4vdXBkYXRlLXRvb2wvZmlsZS1zeXN0ZW0nO1xuXG4vKiogTmFtZSBvZiB0aGUgZGVmYXVsdCBBbmd1bGFyIENMSSB3b3Jrc3BhY2UgY29uZmlndXJhdGlvbiBmaWxlcy4gKi9cbmNvbnN0IGRlZmF1bHRXb3Jrc3BhY2VDb25maWdQYXRocyA9IFsnL2FuZ3VsYXIuanNvbicsICcvLmFuZ3VsYXIuanNvbiddO1xuXG4vKiogR2V0cyB0aGUgdHNjb25maWcgcGF0aCBmcm9tIHRoZSBnaXZlbiB0YXJnZXQgd2l0aGluIHRoZSBzcGVjaWZpZWQgcHJvamVjdC4gKi9cbmV4cG9ydCBmdW5jdGlvbiBnZXRUYXJnZXRUc2NvbmZpZ1BhdGgoXG4gIHByb2plY3Q6IFByb2plY3REZWZpbml0aW9uLFxuICB0YXJnZXROYW1lOiBzdHJpbmcsXG4pOiBXb3Jrc3BhY2VQYXRoIHwgbnVsbCB7XG4gIGNvbnN0IHRzY29uZmlnID0gcHJvamVjdC50YXJnZXRzPy5nZXQodGFyZ2V0TmFtZSk/Lm9wdGlvbnM/LnRzQ29uZmlnO1xuICByZXR1cm4gdHNjb25maWcgPyBub3JtYWxpemUodHNjb25maWcgYXMgc3RyaW5nKSA6IG51bGw7XG59XG5cbi8qKiBSZXNvbHZlIHRoZSB3b3Jrc3BhY2UgY29uZmlndXJhdGlvbiBvZiB0aGUgc3BlY2lmaWVkIHRyZWUgZ3JhY2VmdWxseS4gKi9cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBnZXRXb3Jrc3BhY2VDb25maWdHcmFjZWZ1bGx5KFxuICB0cmVlOiBUcmVlLFxuKTogUHJvbWlzZTxXb3Jrc3BhY2VEZWZpbml0aW9uIHwgbnVsbD4ge1xuICBjb25zdCBwYXRoID0gZGVmYXVsdFdvcmtzcGFjZUNvbmZpZ1BhdGhzLmZpbmQoZmlsZVBhdGggPT4gdHJlZS5leGlzdHMoZmlsZVBhdGgpKTtcbiAgY29uc3QgY29uZmlnQnVmZmVyID0gdHJlZS5yZWFkKHBhdGghKTtcblxuICBpZiAoIXBhdGggfHwgIWNvbmZpZ0J1ZmZlcikge1xuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAgdHJ5IHtcbiAgICByZXR1cm4gYXdhaXQgcmVhZEpzb25Xb3Jrc3BhY2UocGF0aCwge1xuICAgICAgcmVhZEZpbGU6IGFzeW5jIGZpbGVQYXRoID0+IHRyZWUucmVhZChmaWxlUGF0aCkhLnRvU3RyaW5nKCksXG4gICAgfSBhcyBXb3Jrc3BhY2VIb3N0KTtcbiAgfSBjYXRjaCB7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cbn1cbiJdfQ==