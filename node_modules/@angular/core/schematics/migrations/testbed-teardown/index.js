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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define("@angular/core/schematics/migrations/testbed-teardown", ["require", "exports", "@angular-devkit/schematics", "path", "typescript", "@angular/core/schematics/utils/project_tsconfig_paths", "@angular/core/schematics/utils/typescript/compiler_host", "@angular/core/schematics/migrations/testbed-teardown/util"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const schematics_1 = require("@angular-devkit/schematics");
    const path_1 = require("path");
    const typescript_1 = __importDefault(require("typescript"));
    const project_tsconfig_paths_1 = require("@angular/core/schematics/utils/project_tsconfig_paths");
    const compiler_host_1 = require("@angular/core/schematics/utils/typescript/compiler_host");
    const util_1 = require("@angular/core/schematics/migrations/testbed-teardown/util");
    /** Migration that adds the `teardown` flag to `TestBed` calls. */
    function default_1() {
        return (tree) => __awaiter(this, void 0, void 0, function* () {
            const { buildPaths, testPaths } = yield (0, project_tsconfig_paths_1.getProjectTsConfigPaths)(tree);
            const basePath = process.cwd();
            const allPaths = [...buildPaths, ...testPaths];
            if (!allPaths.length) {
                throw new schematics_1.SchematicsException('Could not find any tsconfig file. Cannot add `teardown` flag to `TestBed`.');
            }
            for (const tsconfigPath of allPaths) {
                runTestbedTeardownMigration(tree, tsconfigPath, basePath);
            }
        });
    }
    exports.default = default_1;
    function runTestbedTeardownMigration(tree, tsconfigPath, basePath) {
        const { program } = (0, compiler_host_1.createMigrationProgram)(tree, tsconfigPath, basePath);
        const typeChecker = program.getTypeChecker();
        const sourceFiles = program.getSourceFiles().filter(sourceFile => (0, compiler_host_1.canMigrateFile)(basePath, sourceFile, program));
        const initTestEnvironmentResult = (0, util_1.findInitTestEnvironmentCalls)(typeChecker, sourceFiles);
        const printer = typescript_1.default.createPrinter();
        // If we identified at least one call to `initTestEnvironment` (can be migrated or unmigrated),
        // we don't need to migrate `configureTestingModule` or `withModule` calls, because they'll take
        // the default teardown behavior from the environment. This is preferrable, because it'll result
        // in the least number of changes to users' code.
        if (initTestEnvironmentResult.totalCalls > 0) {
            // Migrate all of the unmigrated calls `initTestEnvironment`. This could be zero
            // if the user has already opted into the new teardown behavior themselves.
            initTestEnvironmentResult.callsToMigrate.forEach(node => {
                const { span, text } = (0, util_1.getInitTestEnvironmentLiteralReplacement)(node, printer);
                const update = tree.beginUpdate((0, path_1.relative)(basePath, node.getSourceFile().fileName));
                // The update appears to break if we try to call `remove` with a zero length.
                if (span.length > 0) {
                    update.remove(span.start, span.length);
                }
                update.insertRight(span.start, text);
                tree.commitUpdate(update);
            });
        }
        else {
            // Otherwise migrate the metadata passed into the `configureTestingModule` and `withModule`
            // calls. This scenario is less likely, but it could happen if `initTestEnvironment` has been
            // abstracted away or is inside a .js file.
            sourceFiles.forEach(sourceFile => {
                (0, util_1.findTestModuleMetadataNodes)(typeChecker, sourceFile).forEach(node => {
                    const migrated = (0, util_1.migrateTestModuleMetadataLiteral)(node);
                    const update = tree.beginUpdate((0, path_1.relative)(basePath, node.getSourceFile().fileName));
                    update.remove(node.getStart(), node.getWidth());
                    update.insertRight(node.getStart(), printer.printNode(typescript_1.default.EmitHint.Unspecified, migrated, node.getSourceFile()));
                    tree.commitUpdate(update);
                });
            });
        }
    }
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9jb3JlL3NjaGVtYXRpY3MvbWlncmF0aW9ucy90ZXN0YmVkLXRlYXJkb3duL2luZGV4LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7R0FNRzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0lBRUgsMkRBQTJFO0lBQzNFLCtCQUE4QjtJQUM5Qiw0REFBNEI7SUFFNUIsa0dBQTJFO0lBQzNFLDJGQUE0RjtJQUU1RixvRkFBNko7SUFHN0osa0VBQWtFO0lBQ2xFO1FBQ0UsT0FBTyxDQUFPLElBQVUsRUFBRSxFQUFFO1lBQzFCLE1BQU0sRUFBQyxVQUFVLEVBQUUsU0FBUyxFQUFDLEdBQUcsTUFBTSxJQUFBLGdEQUF1QixFQUFDLElBQUksQ0FBQyxDQUFDO1lBQ3BFLE1BQU0sUUFBUSxHQUFHLE9BQU8sQ0FBQyxHQUFHLEVBQUUsQ0FBQztZQUMvQixNQUFNLFFBQVEsR0FBRyxDQUFDLEdBQUcsVUFBVSxFQUFFLEdBQUcsU0FBUyxDQUFDLENBQUM7WUFFL0MsSUFBSSxDQUFDLFFBQVEsQ0FBQyxNQUFNLEVBQUU7Z0JBQ3BCLE1BQU0sSUFBSSxnQ0FBbUIsQ0FDekIsNEVBQTRFLENBQUMsQ0FBQzthQUNuRjtZQUVELEtBQUssTUFBTSxZQUFZLElBQUksUUFBUSxFQUFFO2dCQUNuQywyQkFBMkIsQ0FBQyxJQUFJLEVBQUUsWUFBWSxFQUFFLFFBQVEsQ0FBQyxDQUFDO2FBQzNEO1FBQ0gsQ0FBQyxDQUFBLENBQUM7SUFDSixDQUFDO0lBZkQsNEJBZUM7SUFFRCxTQUFTLDJCQUEyQixDQUFDLElBQVUsRUFBRSxZQUFvQixFQUFFLFFBQWdCO1FBQ3JGLE1BQU0sRUFBQyxPQUFPLEVBQUMsR0FBRyxJQUFBLHNDQUFzQixFQUFDLElBQUksRUFBRSxZQUFZLEVBQUUsUUFBUSxDQUFDLENBQUM7UUFDdkUsTUFBTSxXQUFXLEdBQUcsT0FBTyxDQUFDLGNBQWMsRUFBRSxDQUFDO1FBQzdDLE1BQU0sV0FBVyxHQUNiLE9BQU8sQ0FBQyxjQUFjLEVBQUUsQ0FBQyxNQUFNLENBQUMsVUFBVSxDQUFDLEVBQUUsQ0FBQyxJQUFBLDhCQUFjLEVBQUMsUUFBUSxFQUFFLFVBQVUsRUFBRSxPQUFPLENBQUMsQ0FBQyxDQUFDO1FBQ2pHLE1BQU0seUJBQXlCLEdBQUcsSUFBQSxtQ0FBNEIsRUFBQyxXQUFXLEVBQUUsV0FBVyxDQUFDLENBQUM7UUFDekYsTUFBTSxPQUFPLEdBQUcsb0JBQUUsQ0FBQyxhQUFhLEVBQUUsQ0FBQztRQUVuQywrRkFBK0Y7UUFDL0YsZ0dBQWdHO1FBQ2hHLGdHQUFnRztRQUNoRyxpREFBaUQ7UUFDakQsSUFBSSx5QkFBeUIsQ0FBQyxVQUFVLEdBQUcsQ0FBQyxFQUFFO1lBQzVDLGdGQUFnRjtZQUNoRiwyRUFBMkU7WUFDM0UseUJBQXlCLENBQUMsY0FBYyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsRUFBRTtnQkFDdEQsTUFBTSxFQUFDLElBQUksRUFBRSxJQUFJLEVBQUMsR0FBRyxJQUFBLCtDQUF3QyxFQUFDLElBQUksRUFBRSxPQUFPLENBQUMsQ0FBQztnQkFDN0UsTUFBTSxNQUFNLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFBLGVBQVEsRUFBQyxRQUFRLEVBQUUsSUFBSSxDQUFDLGFBQWEsRUFBRSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUM7Z0JBQ25GLDZFQUE2RTtnQkFDN0UsSUFBSSxJQUFJLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRTtvQkFDbkIsTUFBTSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsS0FBSyxFQUFFLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztpQkFDeEM7Z0JBQ0QsTUFBTSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsS0FBSyxFQUFFLElBQUksQ0FBQyxDQUFDO2dCQUNyQyxJQUFJLENBQUMsWUFBWSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1lBQzVCLENBQUMsQ0FBQyxDQUFDO1NBQ0o7YUFBTTtZQUNMLDJGQUEyRjtZQUMzRiw2RkFBNkY7WUFDN0YsMkNBQTJDO1lBQzNDLFdBQVcsQ0FBQyxPQUFPLENBQUMsVUFBVSxDQUFDLEVBQUU7Z0JBQy9CLElBQUEsa0NBQTJCLEVBQUMsV0FBVyxFQUFFLFVBQVUsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsRUFBRTtvQkFDbEUsTUFBTSxRQUFRLEdBQUcsSUFBQSx1Q0FBZ0MsRUFBQyxJQUFJLENBQUMsQ0FBQztvQkFDeEQsTUFBTSxNQUFNLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFBLGVBQVEsRUFBQyxRQUFRLEVBQUUsSUFBSSxDQUFDLGFBQWEsRUFBRSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUM7b0JBQ25GLE1BQU0sQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRSxFQUFFLElBQUksQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFDO29CQUNoRCxNQUFNLENBQUMsV0FBVyxDQUNkLElBQUksQ0FBQyxRQUFRLEVBQUUsRUFDZixPQUFPLENBQUMsU0FBUyxDQUFDLG9CQUFFLENBQUMsUUFBUSxDQUFDLFdBQVcsRUFBRSxRQUFRLEVBQUUsSUFBSSxDQUFDLGFBQWEsRUFBRSxDQUFDLENBQUMsQ0FBQztvQkFDaEYsSUFBSSxDQUFDLFlBQVksQ0FBQyxNQUFNLENBQUMsQ0FBQztnQkFDNUIsQ0FBQyxDQUFDLENBQUM7WUFDTCxDQUFDLENBQUMsQ0FBQztTQUNKO0lBQ0gsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge1J1bGUsIFNjaGVtYXRpY3NFeGNlcHRpb24sIFRyZWV9IGZyb20gJ0Bhbmd1bGFyLWRldmtpdC9zY2hlbWF0aWNzJztcbmltcG9ydCB7cmVsYXRpdmV9IGZyb20gJ3BhdGgnO1xuaW1wb3J0IHRzIGZyb20gJ3R5cGVzY3JpcHQnO1xuXG5pbXBvcnQge2dldFByb2plY3RUc0NvbmZpZ1BhdGhzfSBmcm9tICcuLi8uLi91dGlscy9wcm9qZWN0X3RzY29uZmlnX3BhdGhzJztcbmltcG9ydCB7Y2FuTWlncmF0ZUZpbGUsIGNyZWF0ZU1pZ3JhdGlvblByb2dyYW19IGZyb20gJy4uLy4uL3V0aWxzL3R5cGVzY3JpcHQvY29tcGlsZXJfaG9zdCc7XG5cbmltcG9ydCB7ZmluZEluaXRUZXN0RW52aXJvbm1lbnRDYWxscywgZmluZFRlc3RNb2R1bGVNZXRhZGF0YU5vZGVzLCBnZXRJbml0VGVzdEVudmlyb25tZW50TGl0ZXJhbFJlcGxhY2VtZW50LCBtaWdyYXRlVGVzdE1vZHVsZU1ldGFkYXRhTGl0ZXJhbH0gZnJvbSAnLi91dGlsJztcblxuXG4vKiogTWlncmF0aW9uIHRoYXQgYWRkcyB0aGUgYHRlYXJkb3duYCBmbGFnIHRvIGBUZXN0QmVkYCBjYWxscy4gKi9cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uKCk6IFJ1bGUge1xuICByZXR1cm4gYXN5bmMgKHRyZWU6IFRyZWUpID0+IHtcbiAgICBjb25zdCB7YnVpbGRQYXRocywgdGVzdFBhdGhzfSA9IGF3YWl0IGdldFByb2plY3RUc0NvbmZpZ1BhdGhzKHRyZWUpO1xuICAgIGNvbnN0IGJhc2VQYXRoID0gcHJvY2Vzcy5jd2QoKTtcbiAgICBjb25zdCBhbGxQYXRocyA9IFsuLi5idWlsZFBhdGhzLCAuLi50ZXN0UGF0aHNdO1xuXG4gICAgaWYgKCFhbGxQYXRocy5sZW5ndGgpIHtcbiAgICAgIHRocm93IG5ldyBTY2hlbWF0aWNzRXhjZXB0aW9uKFxuICAgICAgICAgICdDb3VsZCBub3QgZmluZCBhbnkgdHNjb25maWcgZmlsZS4gQ2Fubm90IGFkZCBgdGVhcmRvd25gIGZsYWcgdG8gYFRlc3RCZWRgLicpO1xuICAgIH1cblxuICAgIGZvciAoY29uc3QgdHNjb25maWdQYXRoIG9mIGFsbFBhdGhzKSB7XG4gICAgICBydW5UZXN0YmVkVGVhcmRvd25NaWdyYXRpb24odHJlZSwgdHNjb25maWdQYXRoLCBiYXNlUGF0aCk7XG4gICAgfVxuICB9O1xufVxuXG5mdW5jdGlvbiBydW5UZXN0YmVkVGVhcmRvd25NaWdyYXRpb24odHJlZTogVHJlZSwgdHNjb25maWdQYXRoOiBzdHJpbmcsIGJhc2VQYXRoOiBzdHJpbmcpIHtcbiAgY29uc3Qge3Byb2dyYW19ID0gY3JlYXRlTWlncmF0aW9uUHJvZ3JhbSh0cmVlLCB0c2NvbmZpZ1BhdGgsIGJhc2VQYXRoKTtcbiAgY29uc3QgdHlwZUNoZWNrZXIgPSBwcm9ncmFtLmdldFR5cGVDaGVja2VyKCk7XG4gIGNvbnN0IHNvdXJjZUZpbGVzID1cbiAgICAgIHByb2dyYW0uZ2V0U291cmNlRmlsZXMoKS5maWx0ZXIoc291cmNlRmlsZSA9PiBjYW5NaWdyYXRlRmlsZShiYXNlUGF0aCwgc291cmNlRmlsZSwgcHJvZ3JhbSkpO1xuICBjb25zdCBpbml0VGVzdEVudmlyb25tZW50UmVzdWx0ID0gZmluZEluaXRUZXN0RW52aXJvbm1lbnRDYWxscyh0eXBlQ2hlY2tlciwgc291cmNlRmlsZXMpO1xuICBjb25zdCBwcmludGVyID0gdHMuY3JlYXRlUHJpbnRlcigpO1xuXG4gIC8vIElmIHdlIGlkZW50aWZpZWQgYXQgbGVhc3Qgb25lIGNhbGwgdG8gYGluaXRUZXN0RW52aXJvbm1lbnRgIChjYW4gYmUgbWlncmF0ZWQgb3IgdW5taWdyYXRlZCksXG4gIC8vIHdlIGRvbid0IG5lZWQgdG8gbWlncmF0ZSBgY29uZmlndXJlVGVzdGluZ01vZHVsZWAgb3IgYHdpdGhNb2R1bGVgIGNhbGxzLCBiZWNhdXNlIHRoZXknbGwgdGFrZVxuICAvLyB0aGUgZGVmYXVsdCB0ZWFyZG93biBiZWhhdmlvciBmcm9tIHRoZSBlbnZpcm9ubWVudC4gVGhpcyBpcyBwcmVmZXJyYWJsZSwgYmVjYXVzZSBpdCdsbCByZXN1bHRcbiAgLy8gaW4gdGhlIGxlYXN0IG51bWJlciBvZiBjaGFuZ2VzIHRvIHVzZXJzJyBjb2RlLlxuICBpZiAoaW5pdFRlc3RFbnZpcm9ubWVudFJlc3VsdC50b3RhbENhbGxzID4gMCkge1xuICAgIC8vIE1pZ3JhdGUgYWxsIG9mIHRoZSB1bm1pZ3JhdGVkIGNhbGxzIGBpbml0VGVzdEVudmlyb25tZW50YC4gVGhpcyBjb3VsZCBiZSB6ZXJvXG4gICAgLy8gaWYgdGhlIHVzZXIgaGFzIGFscmVhZHkgb3B0ZWQgaW50byB0aGUgbmV3IHRlYXJkb3duIGJlaGF2aW9yIHRoZW1zZWx2ZXMuXG4gICAgaW5pdFRlc3RFbnZpcm9ubWVudFJlc3VsdC5jYWxsc1RvTWlncmF0ZS5mb3JFYWNoKG5vZGUgPT4ge1xuICAgICAgY29uc3Qge3NwYW4sIHRleHR9ID0gZ2V0SW5pdFRlc3RFbnZpcm9ubWVudExpdGVyYWxSZXBsYWNlbWVudChub2RlLCBwcmludGVyKTtcbiAgICAgIGNvbnN0IHVwZGF0ZSA9IHRyZWUuYmVnaW5VcGRhdGUocmVsYXRpdmUoYmFzZVBhdGgsIG5vZGUuZ2V0U291cmNlRmlsZSgpLmZpbGVOYW1lKSk7XG4gICAgICAvLyBUaGUgdXBkYXRlIGFwcGVhcnMgdG8gYnJlYWsgaWYgd2UgdHJ5IHRvIGNhbGwgYHJlbW92ZWAgd2l0aCBhIHplcm8gbGVuZ3RoLlxuICAgICAgaWYgKHNwYW4ubGVuZ3RoID4gMCkge1xuICAgICAgICB1cGRhdGUucmVtb3ZlKHNwYW4uc3RhcnQsIHNwYW4ubGVuZ3RoKTtcbiAgICAgIH1cbiAgICAgIHVwZGF0ZS5pbnNlcnRSaWdodChzcGFuLnN0YXJ0LCB0ZXh0KTtcbiAgICAgIHRyZWUuY29tbWl0VXBkYXRlKHVwZGF0ZSk7XG4gICAgfSk7XG4gIH0gZWxzZSB7XG4gICAgLy8gT3RoZXJ3aXNlIG1pZ3JhdGUgdGhlIG1ldGFkYXRhIHBhc3NlZCBpbnRvIHRoZSBgY29uZmlndXJlVGVzdGluZ01vZHVsZWAgYW5kIGB3aXRoTW9kdWxlYFxuICAgIC8vIGNhbGxzLiBUaGlzIHNjZW5hcmlvIGlzIGxlc3MgbGlrZWx5LCBidXQgaXQgY291bGQgaGFwcGVuIGlmIGBpbml0VGVzdEVudmlyb25tZW50YCBoYXMgYmVlblxuICAgIC8vIGFic3RyYWN0ZWQgYXdheSBvciBpcyBpbnNpZGUgYSAuanMgZmlsZS5cbiAgICBzb3VyY2VGaWxlcy5mb3JFYWNoKHNvdXJjZUZpbGUgPT4ge1xuICAgICAgZmluZFRlc3RNb2R1bGVNZXRhZGF0YU5vZGVzKHR5cGVDaGVja2VyLCBzb3VyY2VGaWxlKS5mb3JFYWNoKG5vZGUgPT4ge1xuICAgICAgICBjb25zdCBtaWdyYXRlZCA9IG1pZ3JhdGVUZXN0TW9kdWxlTWV0YWRhdGFMaXRlcmFsKG5vZGUpO1xuICAgICAgICBjb25zdCB1cGRhdGUgPSB0cmVlLmJlZ2luVXBkYXRlKHJlbGF0aXZlKGJhc2VQYXRoLCBub2RlLmdldFNvdXJjZUZpbGUoKS5maWxlTmFtZSkpO1xuICAgICAgICB1cGRhdGUucmVtb3ZlKG5vZGUuZ2V0U3RhcnQoKSwgbm9kZS5nZXRXaWR0aCgpKTtcbiAgICAgICAgdXBkYXRlLmluc2VydFJpZ2h0KFxuICAgICAgICAgICAgbm9kZS5nZXRTdGFydCgpLFxuICAgICAgICAgICAgcHJpbnRlci5wcmludE5vZGUodHMuRW1pdEhpbnQuVW5zcGVjaWZpZWQsIG1pZ3JhdGVkLCBub2RlLmdldFNvdXJjZUZpbGUoKSkpO1xuICAgICAgICB0cmVlLmNvbW1pdFVwZGF0ZSh1cGRhdGUpO1xuICAgICAgfSk7XG4gICAgfSk7XG4gIH1cbn1cbiJdfQ==