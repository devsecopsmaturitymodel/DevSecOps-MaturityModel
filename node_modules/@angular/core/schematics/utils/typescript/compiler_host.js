var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define("@angular/core/schematics/utils/typescript/compiler_host", ["require", "exports", "path", "typescript", "@angular/core/schematics/utils/typescript/parse_tsconfig"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.canMigrateFile = exports.createMigrationCompilerHost = exports.createMigrationProgram = void 0;
    const path_1 = require("path");
    const typescript_1 = __importDefault(require("typescript"));
    const parse_tsconfig_1 = require("@angular/core/schematics/utils/typescript/parse_tsconfig");
    /**
     * Creates a TypeScript program instance for a TypeScript project within
     * the virtual file system tree.
     * @param tree Virtual file system tree that contains the source files.
     * @param tsconfigPath Virtual file system path that resolves to the TypeScript project.
     * @param basePath Base path for the virtual file system tree.
     * @param fakeFileRead Optional file reader function. Can be used to overwrite files in
     *   the TypeScript program, or to add in-memory files (e.g. to add global types).
     * @param additionalFiles Additional file paths that should be added to the program.
     */
    function createMigrationProgram(tree, tsconfigPath, basePath, fakeFileRead, additionalFiles) {
        // Resolve the tsconfig path to an absolute path. This is needed as TypeScript otherwise
        // is not able to resolve root directories in the given tsconfig. More details can be found
        // in the following issue: https://github.com/microsoft/TypeScript/issues/37731.
        tsconfigPath = (0, path_1.resolve)(basePath, tsconfigPath);
        const parsed = (0, parse_tsconfig_1.parseTsconfigFile)(tsconfigPath, (0, path_1.dirname)(tsconfigPath));
        const host = createMigrationCompilerHost(tree, parsed.options, basePath, fakeFileRead);
        const program = typescript_1.default.createProgram(parsed.fileNames.concat(additionalFiles || []), parsed.options, host);
        return { parsed, host, program };
    }
    exports.createMigrationProgram = createMigrationProgram;
    function createMigrationCompilerHost(tree, options, basePath, fakeRead) {
        const host = typescript_1.default.createCompilerHost(options, true);
        const defaultReadFile = host.readFile;
        // We need to overwrite the host "readFile" method, as we want the TypeScript
        // program to be based on the file contents in the virtual file tree. Otherwise
        // if we run multiple migrations we might have intersecting changes and
        // source files.
        host.readFile = fileName => {
            var _a;
            const treeRelativePath = (0, path_1.relative)(basePath, fileName);
            let result = fakeRead === null || fakeRead === void 0 ? void 0 : fakeRead(treeRelativePath);
            if (result === undefined) {
                // If the relative path resolved to somewhere outside of the tree, fall back to
                // TypeScript's default file reading function since the `tree` will throw an error.
                result = treeRelativePath.startsWith('..') ? defaultReadFile.call(host, fileName) :
                    (_a = tree.read(treeRelativePath)) === null || _a === void 0 ? void 0 : _a.toString();
            }
            // Strip BOM as otherwise TSC methods (Ex: getWidth) will return an offset,
            // which breaks the CLI UpdateRecorder.
            // See: https://github.com/angular/angular/pull/30719
            return result ? result.replace(/^\uFEFF/, '') : undefined;
        };
        return host;
    }
    exports.createMigrationCompilerHost = createMigrationCompilerHost;
    /**
     * Checks whether a file can be migrate by our automated migrations.
     * @param basePath Absolute path to the project.
     * @param sourceFile File being checked.
     * @param program Program that includes the source file.
     */
    function canMigrateFile(basePath, sourceFile, program) {
        // We shouldn't migrate .d.ts files or files from an external library.
        if (sourceFile.isDeclarationFile || program.isSourceFileFromExternalLibrary(sourceFile)) {
            return false;
        }
        // Our migrations are set up to create a `Program` from the project's tsconfig and to migrate all
        // the files within the program. This can include files that are outside of the Angular CLI
        // project. We can't migrate files outside of the project, because our file system interactions
        // go through the CLI's `Tree` which assumes that all files are within the project. See:
        // https://github.com/angular/angular-cli/blob/0b0961c9c233a825b6e4bb59ab7f0790f9b14676/packages/angular_devkit/schematics/src/tree/host-tree.ts#L131
        return !(0, path_1.relative)(basePath, sourceFile.fileName).startsWith('..');
    }
    exports.canMigrateFile = canMigrateFile;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29tcGlsZXJfaG9zdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2NvcmUvc2NoZW1hdGljcy91dGlscy90eXBlc2NyaXB0L2NvbXBpbGVyX2hvc3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7O0lBUUEsK0JBQWdEO0lBQ2hELDREQUE0QjtJQUM1Qiw2RkFBbUQ7SUFJbkQ7Ozs7Ozs7OztPQVNHO0lBQ0gsU0FBZ0Isc0JBQXNCLENBQ2xDLElBQVUsRUFBRSxZQUFvQixFQUFFLFFBQWdCLEVBQUUsWUFBNkIsRUFDakYsZUFBMEI7UUFDNUIsd0ZBQXdGO1FBQ3hGLDJGQUEyRjtRQUMzRixnRkFBZ0Y7UUFDaEYsWUFBWSxHQUFHLElBQUEsY0FBTyxFQUFDLFFBQVEsRUFBRSxZQUFZLENBQUMsQ0FBQztRQUMvQyxNQUFNLE1BQU0sR0FBRyxJQUFBLGtDQUFpQixFQUFDLFlBQVksRUFBRSxJQUFBLGNBQU8sRUFBQyxZQUFZLENBQUMsQ0FBQyxDQUFDO1FBQ3RFLE1BQU0sSUFBSSxHQUFHLDJCQUEyQixDQUFDLElBQUksRUFBRSxNQUFNLENBQUMsT0FBTyxFQUFFLFFBQVEsRUFBRSxZQUFZLENBQUMsQ0FBQztRQUN2RixNQUFNLE9BQU8sR0FDVCxvQkFBRSxDQUFDLGFBQWEsQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxlQUFlLElBQUksRUFBRSxDQUFDLEVBQUUsTUFBTSxDQUFDLE9BQU8sRUFBRSxJQUFJLENBQUMsQ0FBQztRQUMzRixPQUFPLEVBQUMsTUFBTSxFQUFFLElBQUksRUFBRSxPQUFPLEVBQUMsQ0FBQztJQUNqQyxDQUFDO0lBWkQsd0RBWUM7SUFFRCxTQUFnQiwyQkFBMkIsQ0FDdkMsSUFBVSxFQUFFLE9BQTJCLEVBQUUsUUFBZ0IsRUFDekQsUUFBeUI7UUFDM0IsTUFBTSxJQUFJLEdBQUcsb0JBQUUsQ0FBQyxrQkFBa0IsQ0FBQyxPQUFPLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFDbEQsTUFBTSxlQUFlLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQztRQUV0Qyw2RUFBNkU7UUFDN0UsK0VBQStFO1FBQy9FLHVFQUF1RTtRQUN2RSxnQkFBZ0I7UUFDaEIsSUFBSSxDQUFDLFFBQVEsR0FBRyxRQUFRLENBQUMsRUFBRTs7WUFDekIsTUFBTSxnQkFBZ0IsR0FBRyxJQUFBLGVBQVEsRUFBQyxRQUFRLEVBQUUsUUFBUSxDQUFDLENBQUM7WUFDdEQsSUFBSSxNQUFNLEdBQXFCLFFBQVEsYUFBUixRQUFRLHVCQUFSLFFBQVEsQ0FBRyxnQkFBZ0IsQ0FBQyxDQUFDO1lBRTVELElBQUksTUFBTSxLQUFLLFNBQVMsRUFBRTtnQkFDeEIsK0VBQStFO2dCQUMvRSxtRkFBbUY7Z0JBQ25GLE1BQU0sR0FBRyxnQkFBZ0IsQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLGVBQWUsQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLFFBQVEsQ0FBQyxDQUFDLENBQUM7b0JBQ3RDLE1BQUEsSUFBSSxDQUFDLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQywwQ0FBRSxRQUFRLEVBQUUsQ0FBQzthQUN0RjtZQUVELDJFQUEyRTtZQUMzRSx1Q0FBdUM7WUFDdkMscURBQXFEO1lBQ3JELE9BQU8sTUFBTSxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLFNBQVMsRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDO1FBQzVELENBQUMsQ0FBQztRQUVGLE9BQU8sSUFBSSxDQUFDO0lBQ2QsQ0FBQztJQTVCRCxrRUE0QkM7SUFFRDs7Ozs7T0FLRztJQUNILFNBQWdCLGNBQWMsQ0FDMUIsUUFBZ0IsRUFBRSxVQUF5QixFQUFFLE9BQW1CO1FBQ2xFLHNFQUFzRTtRQUN0RSxJQUFJLFVBQVUsQ0FBQyxpQkFBaUIsSUFBSSxPQUFPLENBQUMsK0JBQStCLENBQUMsVUFBVSxDQUFDLEVBQUU7WUFDdkYsT0FBTyxLQUFLLENBQUM7U0FDZDtRQUVELGlHQUFpRztRQUNqRywyRkFBMkY7UUFDM0YsK0ZBQStGO1FBQy9GLHdGQUF3RjtRQUN4RixxSkFBcUo7UUFDckosT0FBTyxDQUFDLElBQUEsZUFBUSxFQUFDLFFBQVEsRUFBRSxVQUFVLENBQUMsUUFBUSxDQUFDLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQ25FLENBQUM7SUFiRCx3Q0FhQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuaW1wb3J0IHtUcmVlfSBmcm9tICdAYW5ndWxhci1kZXZraXQvc2NoZW1hdGljcyc7XG5pbXBvcnQge2Rpcm5hbWUsIHJlbGF0aXZlLCByZXNvbHZlfSBmcm9tICdwYXRoJztcbmltcG9ydCB0cyBmcm9tICd0eXBlc2NyaXB0JztcbmltcG9ydCB7cGFyc2VUc2NvbmZpZ0ZpbGV9IGZyb20gJy4vcGFyc2VfdHNjb25maWcnO1xuXG5leHBvcnQgdHlwZSBGYWtlUmVhZEZpbGVGbiA9IChmaWxlTmFtZTogc3RyaW5nKSA9PiBzdHJpbmd8dW5kZWZpbmVkO1xuXG4vKipcbiAqIENyZWF0ZXMgYSBUeXBlU2NyaXB0IHByb2dyYW0gaW5zdGFuY2UgZm9yIGEgVHlwZVNjcmlwdCBwcm9qZWN0IHdpdGhpblxuICogdGhlIHZpcnR1YWwgZmlsZSBzeXN0ZW0gdHJlZS5cbiAqIEBwYXJhbSB0cmVlIFZpcnR1YWwgZmlsZSBzeXN0ZW0gdHJlZSB0aGF0IGNvbnRhaW5zIHRoZSBzb3VyY2UgZmlsZXMuXG4gKiBAcGFyYW0gdHNjb25maWdQYXRoIFZpcnR1YWwgZmlsZSBzeXN0ZW0gcGF0aCB0aGF0IHJlc29sdmVzIHRvIHRoZSBUeXBlU2NyaXB0IHByb2plY3QuXG4gKiBAcGFyYW0gYmFzZVBhdGggQmFzZSBwYXRoIGZvciB0aGUgdmlydHVhbCBmaWxlIHN5c3RlbSB0cmVlLlxuICogQHBhcmFtIGZha2VGaWxlUmVhZCBPcHRpb25hbCBmaWxlIHJlYWRlciBmdW5jdGlvbi4gQ2FuIGJlIHVzZWQgdG8gb3ZlcndyaXRlIGZpbGVzIGluXG4gKiAgIHRoZSBUeXBlU2NyaXB0IHByb2dyYW0sIG9yIHRvIGFkZCBpbi1tZW1vcnkgZmlsZXMgKGUuZy4gdG8gYWRkIGdsb2JhbCB0eXBlcykuXG4gKiBAcGFyYW0gYWRkaXRpb25hbEZpbGVzIEFkZGl0aW9uYWwgZmlsZSBwYXRocyB0aGF0IHNob3VsZCBiZSBhZGRlZCB0byB0aGUgcHJvZ3JhbS5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZU1pZ3JhdGlvblByb2dyYW0oXG4gICAgdHJlZTogVHJlZSwgdHNjb25maWdQYXRoOiBzdHJpbmcsIGJhc2VQYXRoOiBzdHJpbmcsIGZha2VGaWxlUmVhZD86IEZha2VSZWFkRmlsZUZuLFxuICAgIGFkZGl0aW9uYWxGaWxlcz86IHN0cmluZ1tdKSB7XG4gIC8vIFJlc29sdmUgdGhlIHRzY29uZmlnIHBhdGggdG8gYW4gYWJzb2x1dGUgcGF0aC4gVGhpcyBpcyBuZWVkZWQgYXMgVHlwZVNjcmlwdCBvdGhlcndpc2VcbiAgLy8gaXMgbm90IGFibGUgdG8gcmVzb2x2ZSByb290IGRpcmVjdG9yaWVzIGluIHRoZSBnaXZlbiB0c2NvbmZpZy4gTW9yZSBkZXRhaWxzIGNhbiBiZSBmb3VuZFxuICAvLyBpbiB0aGUgZm9sbG93aW5nIGlzc3VlOiBodHRwczovL2dpdGh1Yi5jb20vbWljcm9zb2Z0L1R5cGVTY3JpcHQvaXNzdWVzLzM3NzMxLlxuICB0c2NvbmZpZ1BhdGggPSByZXNvbHZlKGJhc2VQYXRoLCB0c2NvbmZpZ1BhdGgpO1xuICBjb25zdCBwYXJzZWQgPSBwYXJzZVRzY29uZmlnRmlsZSh0c2NvbmZpZ1BhdGgsIGRpcm5hbWUodHNjb25maWdQYXRoKSk7XG4gIGNvbnN0IGhvc3QgPSBjcmVhdGVNaWdyYXRpb25Db21waWxlckhvc3QodHJlZSwgcGFyc2VkLm9wdGlvbnMsIGJhc2VQYXRoLCBmYWtlRmlsZVJlYWQpO1xuICBjb25zdCBwcm9ncmFtID1cbiAgICAgIHRzLmNyZWF0ZVByb2dyYW0ocGFyc2VkLmZpbGVOYW1lcy5jb25jYXQoYWRkaXRpb25hbEZpbGVzIHx8IFtdKSwgcGFyc2VkLm9wdGlvbnMsIGhvc3QpO1xuICByZXR1cm4ge3BhcnNlZCwgaG9zdCwgcHJvZ3JhbX07XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGVNaWdyYXRpb25Db21waWxlckhvc3QoXG4gICAgdHJlZTogVHJlZSwgb3B0aW9uczogdHMuQ29tcGlsZXJPcHRpb25zLCBiYXNlUGF0aDogc3RyaW5nLFxuICAgIGZha2VSZWFkPzogRmFrZVJlYWRGaWxlRm4pOiB0cy5Db21waWxlckhvc3Qge1xuICBjb25zdCBob3N0ID0gdHMuY3JlYXRlQ29tcGlsZXJIb3N0KG9wdGlvbnMsIHRydWUpO1xuICBjb25zdCBkZWZhdWx0UmVhZEZpbGUgPSBob3N0LnJlYWRGaWxlO1xuXG4gIC8vIFdlIG5lZWQgdG8gb3ZlcndyaXRlIHRoZSBob3N0IFwicmVhZEZpbGVcIiBtZXRob2QsIGFzIHdlIHdhbnQgdGhlIFR5cGVTY3JpcHRcbiAgLy8gcHJvZ3JhbSB0byBiZSBiYXNlZCBvbiB0aGUgZmlsZSBjb250ZW50cyBpbiB0aGUgdmlydHVhbCBmaWxlIHRyZWUuIE90aGVyd2lzZVxuICAvLyBpZiB3ZSBydW4gbXVsdGlwbGUgbWlncmF0aW9ucyB3ZSBtaWdodCBoYXZlIGludGVyc2VjdGluZyBjaGFuZ2VzIGFuZFxuICAvLyBzb3VyY2UgZmlsZXMuXG4gIGhvc3QucmVhZEZpbGUgPSBmaWxlTmFtZSA9PiB7XG4gICAgY29uc3QgdHJlZVJlbGF0aXZlUGF0aCA9IHJlbGF0aXZlKGJhc2VQYXRoLCBmaWxlTmFtZSk7XG4gICAgbGV0IHJlc3VsdDogc3RyaW5nfHVuZGVmaW5lZCA9IGZha2VSZWFkPy4odHJlZVJlbGF0aXZlUGF0aCk7XG5cbiAgICBpZiAocmVzdWx0ID09PSB1bmRlZmluZWQpIHtcbiAgICAgIC8vIElmIHRoZSByZWxhdGl2ZSBwYXRoIHJlc29sdmVkIHRvIHNvbWV3aGVyZSBvdXRzaWRlIG9mIHRoZSB0cmVlLCBmYWxsIGJhY2sgdG9cbiAgICAgIC8vIFR5cGVTY3JpcHQncyBkZWZhdWx0IGZpbGUgcmVhZGluZyBmdW5jdGlvbiBzaW5jZSB0aGUgYHRyZWVgIHdpbGwgdGhyb3cgYW4gZXJyb3IuXG4gICAgICByZXN1bHQgPSB0cmVlUmVsYXRpdmVQYXRoLnN0YXJ0c1dpdGgoJy4uJykgPyBkZWZhdWx0UmVhZEZpbGUuY2FsbChob3N0LCBmaWxlTmFtZSkgOlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdHJlZS5yZWFkKHRyZWVSZWxhdGl2ZVBhdGgpPy50b1N0cmluZygpO1xuICAgIH1cblxuICAgIC8vIFN0cmlwIEJPTSBhcyBvdGhlcndpc2UgVFNDIG1ldGhvZHMgKEV4OiBnZXRXaWR0aCkgd2lsbCByZXR1cm4gYW4gb2Zmc2V0LFxuICAgIC8vIHdoaWNoIGJyZWFrcyB0aGUgQ0xJIFVwZGF0ZVJlY29yZGVyLlxuICAgIC8vIFNlZTogaHR0cHM6Ly9naXRodWIuY29tL2FuZ3VsYXIvYW5ndWxhci9wdWxsLzMwNzE5XG4gICAgcmV0dXJuIHJlc3VsdCA/IHJlc3VsdC5yZXBsYWNlKC9eXFx1RkVGRi8sICcnKSA6IHVuZGVmaW5lZDtcbiAgfTtcblxuICByZXR1cm4gaG9zdDtcbn1cblxuLyoqXG4gKiBDaGVja3Mgd2hldGhlciBhIGZpbGUgY2FuIGJlIG1pZ3JhdGUgYnkgb3VyIGF1dG9tYXRlZCBtaWdyYXRpb25zLlxuICogQHBhcmFtIGJhc2VQYXRoIEFic29sdXRlIHBhdGggdG8gdGhlIHByb2plY3QuXG4gKiBAcGFyYW0gc291cmNlRmlsZSBGaWxlIGJlaW5nIGNoZWNrZWQuXG4gKiBAcGFyYW0gcHJvZ3JhbSBQcm9ncmFtIHRoYXQgaW5jbHVkZXMgdGhlIHNvdXJjZSBmaWxlLlxuICovXG5leHBvcnQgZnVuY3Rpb24gY2FuTWlncmF0ZUZpbGUoXG4gICAgYmFzZVBhdGg6IHN0cmluZywgc291cmNlRmlsZTogdHMuU291cmNlRmlsZSwgcHJvZ3JhbTogdHMuUHJvZ3JhbSk6IGJvb2xlYW4ge1xuICAvLyBXZSBzaG91bGRuJ3QgbWlncmF0ZSAuZC50cyBmaWxlcyBvciBmaWxlcyBmcm9tIGFuIGV4dGVybmFsIGxpYnJhcnkuXG4gIGlmIChzb3VyY2VGaWxlLmlzRGVjbGFyYXRpb25GaWxlIHx8IHByb2dyYW0uaXNTb3VyY2VGaWxlRnJvbUV4dGVybmFsTGlicmFyeShzb3VyY2VGaWxlKSkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIC8vIE91ciBtaWdyYXRpb25zIGFyZSBzZXQgdXAgdG8gY3JlYXRlIGEgYFByb2dyYW1gIGZyb20gdGhlIHByb2plY3QncyB0c2NvbmZpZyBhbmQgdG8gbWlncmF0ZSBhbGxcbiAgLy8gdGhlIGZpbGVzIHdpdGhpbiB0aGUgcHJvZ3JhbS4gVGhpcyBjYW4gaW5jbHVkZSBmaWxlcyB0aGF0IGFyZSBvdXRzaWRlIG9mIHRoZSBBbmd1bGFyIENMSVxuICAvLyBwcm9qZWN0LiBXZSBjYW4ndCBtaWdyYXRlIGZpbGVzIG91dHNpZGUgb2YgdGhlIHByb2plY3QsIGJlY2F1c2Ugb3VyIGZpbGUgc3lzdGVtIGludGVyYWN0aW9uc1xuICAvLyBnbyB0aHJvdWdoIHRoZSBDTEkncyBgVHJlZWAgd2hpY2ggYXNzdW1lcyB0aGF0IGFsbCBmaWxlcyBhcmUgd2l0aGluIHRoZSBwcm9qZWN0LiBTZWU6XG4gIC8vIGh0dHBzOi8vZ2l0aHViLmNvbS9hbmd1bGFyL2FuZ3VsYXItY2xpL2Jsb2IvMGIwOTYxYzljMjMzYTgyNWI2ZTRiYjU5YWI3ZjA3OTBmOWIxNDY3Ni9wYWNrYWdlcy9hbmd1bGFyX2RldmtpdC9zY2hlbWF0aWNzL3NyYy90cmVlL2hvc3QtdHJlZS50cyNMMTMxXG4gIHJldHVybiAhcmVsYXRpdmUoYmFzZVBhdGgsIHNvdXJjZUZpbGUuZmlsZU5hbWUpLnN0YXJ0c1dpdGgoJy4uJyk7XG59XG4iXX0=