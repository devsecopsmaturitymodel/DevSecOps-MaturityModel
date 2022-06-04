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
exports.findModuleFromOptions = exports.addModuleImportToModule = exports.addModuleImportToRootModule = exports.parseSourceFile = void 0;
const schematics_1 = require("@angular-devkit/schematics");
const change_1 = require("@schematics/angular/utility/change");
const workspace_1 = require("@schematics/angular/utility/workspace");
const find_module_1 = require("@schematics/angular/utility/find-module");
const ts = require("typescript");
const project_main_file_1 = require("./project-main-file");
const vendored_ast_utils_1 = require("./vendored-ast-utils");
/** Reads file given path and returns TypeScript source file. */
function parseSourceFile(host, path) {
    const buffer = host.read(path);
    if (!buffer) {
        throw new schematics_1.SchematicsException(`Could not find file for path: ${path}`);
    }
    return ts.createSourceFile(path, buffer.toString(), ts.ScriptTarget.Latest, true);
}
exports.parseSourceFile = parseSourceFile;
/** Import and add module to root app module. */
function addModuleImportToRootModule(host, moduleName, src, project) {
    const modulePath = (0, vendored_ast_utils_1.getAppModulePath)(host, (0, project_main_file_1.getProjectMainFile)(project));
    addModuleImportToModule(host, modulePath, moduleName, src);
}
exports.addModuleImportToRootModule = addModuleImportToRootModule;
/**
 * Import and add module to specific module path.
 * @param host the tree we are updating
 * @param modulePath src location of the module to import
 * @param moduleName name of module to import
 * @param src src location to import
 */
function addModuleImportToModule(host, modulePath, moduleName, src) {
    const moduleSource = parseSourceFile(host, modulePath);
    if (!moduleSource) {
        throw new schematics_1.SchematicsException(`Module not found: ${modulePath}`);
    }
    const changes = (0, vendored_ast_utils_1.addImportToModule)(moduleSource, modulePath, moduleName, src);
    const recorder = host.beginUpdate(modulePath);
    changes.forEach(change => {
        if (change instanceof change_1.InsertChange) {
            recorder.insertLeft(change.pos, change.toAdd);
        }
    });
    host.commitUpdate(recorder);
}
exports.addModuleImportToModule = addModuleImportToModule;
/** Wraps the internal find module from options with undefined path handling  */
function findModuleFromOptions(host, options) {
    return __awaiter(this, void 0, void 0, function* () {
        const workspace = yield (0, workspace_1.getWorkspace)(host);
        if (!options.project) {
            options.project = Array.from(workspace.projects.keys())[0];
        }
        const project = workspace.projects.get(options.project);
        if (options.path === undefined) {
            options.path = `/${project.root}/src/app`;
        }
        return (0, find_module_1.findModuleFromOptions)(host, options);
    });
}
exports.findModuleFromOptions = findModuleFromOptions;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXN0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vc3JjL2Nkay9zY2hlbWF0aWNzL3V0aWxzL2FzdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7OztHQU1HOzs7Ozs7Ozs7Ozs7QUFFSCwyREFBcUU7QUFFckUsK0RBQWdFO0FBQ2hFLHFFQUFtRTtBQUNuRSx5RUFBb0c7QUFFcEcsaUNBQWlDO0FBQ2pDLDJEQUF1RDtBQUN2RCw2REFBeUU7QUFFekUsZ0VBQWdFO0FBQ2hFLFNBQWdCLGVBQWUsQ0FBQyxJQUFVLEVBQUUsSUFBWTtJQUN0RCxNQUFNLE1BQU0sR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQy9CLElBQUksQ0FBQyxNQUFNLEVBQUU7UUFDWCxNQUFNLElBQUksZ0NBQW1CLENBQUMsaUNBQWlDLElBQUksRUFBRSxDQUFDLENBQUM7S0FDeEU7SUFDRCxPQUFPLEVBQUUsQ0FBQyxnQkFBZ0IsQ0FBQyxJQUFJLEVBQUUsTUFBTSxDQUFDLFFBQVEsRUFBRSxFQUFFLEVBQUUsQ0FBQyxZQUFZLENBQUMsTUFBTSxFQUFFLElBQUksQ0FBQyxDQUFDO0FBQ3BGLENBQUM7QUFORCwwQ0FNQztBQUVELGdEQUFnRDtBQUNoRCxTQUFnQiwyQkFBMkIsQ0FDekMsSUFBVSxFQUNWLFVBQWtCLEVBQ2xCLEdBQVcsRUFDWCxPQUEwQjtJQUUxQixNQUFNLFVBQVUsR0FBRyxJQUFBLHFDQUFnQixFQUFDLElBQUksRUFBRSxJQUFBLHNDQUFrQixFQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUM7SUFDdkUsdUJBQXVCLENBQUMsSUFBSSxFQUFFLFVBQVUsRUFBRSxVQUFVLEVBQUUsR0FBRyxDQUFDLENBQUM7QUFDN0QsQ0FBQztBQVJELGtFQVFDO0FBRUQ7Ozs7OztHQU1HO0FBQ0gsU0FBZ0IsdUJBQXVCLENBQ3JDLElBQVUsRUFDVixVQUFrQixFQUNsQixVQUFrQixFQUNsQixHQUFXO0lBRVgsTUFBTSxZQUFZLEdBQUcsZUFBZSxDQUFDLElBQUksRUFBRSxVQUFVLENBQUMsQ0FBQztJQUV2RCxJQUFJLENBQUMsWUFBWSxFQUFFO1FBQ2pCLE1BQU0sSUFBSSxnQ0FBbUIsQ0FBQyxxQkFBcUIsVUFBVSxFQUFFLENBQUMsQ0FBQztLQUNsRTtJQUVELE1BQU0sT0FBTyxHQUFHLElBQUEsc0NBQWlCLEVBQUMsWUFBWSxFQUFFLFVBQVUsRUFBRSxVQUFVLEVBQUUsR0FBRyxDQUFDLENBQUM7SUFDN0UsTUFBTSxRQUFRLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQyxVQUFVLENBQUMsQ0FBQztJQUU5QyxPQUFPLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxFQUFFO1FBQ3ZCLElBQUksTUFBTSxZQUFZLHFCQUFZLEVBQUU7WUFDbEMsUUFBUSxDQUFDLFVBQVUsQ0FBQyxNQUFNLENBQUMsR0FBRyxFQUFFLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQztTQUMvQztJQUNILENBQUMsQ0FBQyxDQUFDO0lBRUgsSUFBSSxDQUFDLFlBQVksQ0FBQyxRQUFRLENBQUMsQ0FBQztBQUM5QixDQUFDO0FBdEJELDBEQXNCQztBQUVELGdGQUFnRjtBQUNoRixTQUFzQixxQkFBcUIsQ0FDekMsSUFBVSxFQUNWLE9BQXlCOztRQUV6QixNQUFNLFNBQVMsR0FBRyxNQUFNLElBQUEsd0JBQVksRUFBQyxJQUFJLENBQUMsQ0FBQztRQUUzQyxJQUFJLENBQUMsT0FBTyxDQUFDLE9BQU8sRUFBRTtZQUNwQixPQUFPLENBQUMsT0FBTyxHQUFHLEtBQUssQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1NBQzVEO1FBRUQsTUFBTSxPQUFPLEdBQUcsU0FBUyxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBRSxDQUFDO1FBRXpELElBQUksT0FBTyxDQUFDLElBQUksS0FBSyxTQUFTLEVBQUU7WUFDOUIsT0FBTyxDQUFDLElBQUksR0FBRyxJQUFJLE9BQU8sQ0FBQyxJQUFJLFVBQVUsQ0FBQztTQUMzQztRQUVELE9BQU8sSUFBQSxtQ0FBa0IsRUFBQyxJQUFJLEVBQUUsT0FBTyxDQUFDLENBQUM7SUFDM0MsQ0FBQztDQUFBO0FBakJELHNEQWlCQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge1NjaGVtYXRpY3NFeGNlcHRpb24sIFRyZWV9IGZyb20gJ0Bhbmd1bGFyLWRldmtpdC9zY2hlbWF0aWNzJztcbmltcG9ydCB7U2NoZW1hIGFzIENvbXBvbmVudE9wdGlvbnN9IGZyb20gJ0BzY2hlbWF0aWNzL2FuZ3VsYXIvY29tcG9uZW50L3NjaGVtYSc7XG5pbXBvcnQge0luc2VydENoYW5nZX0gZnJvbSAnQHNjaGVtYXRpY3MvYW5ndWxhci91dGlsaXR5L2NoYW5nZSc7XG5pbXBvcnQge2dldFdvcmtzcGFjZX0gZnJvbSAnQHNjaGVtYXRpY3MvYW5ndWxhci91dGlsaXR5L3dvcmtzcGFjZSc7XG5pbXBvcnQge2ZpbmRNb2R1bGVGcm9tT3B0aW9ucyBhcyBpbnRlcm5hbEZpbmRNb2R1bGV9IGZyb20gJ0BzY2hlbWF0aWNzL2FuZ3VsYXIvdXRpbGl0eS9maW5kLW1vZHVsZSc7XG5pbXBvcnQge1Byb2plY3REZWZpbml0aW9ufSBmcm9tICdAYW5ndWxhci1kZXZraXQvY29yZS9zcmMvd29ya3NwYWNlJztcbmltcG9ydCAqIGFzIHRzIGZyb20gJ3R5cGVzY3JpcHQnO1xuaW1wb3J0IHtnZXRQcm9qZWN0TWFpbkZpbGV9IGZyb20gJy4vcHJvamVjdC1tYWluLWZpbGUnO1xuaW1wb3J0IHthZGRJbXBvcnRUb01vZHVsZSwgZ2V0QXBwTW9kdWxlUGF0aH0gZnJvbSAnLi92ZW5kb3JlZC1hc3QtdXRpbHMnO1xuXG4vKiogUmVhZHMgZmlsZSBnaXZlbiBwYXRoIGFuZCByZXR1cm5zIFR5cGVTY3JpcHQgc291cmNlIGZpbGUuICovXG5leHBvcnQgZnVuY3Rpb24gcGFyc2VTb3VyY2VGaWxlKGhvc3Q6IFRyZWUsIHBhdGg6IHN0cmluZyk6IHRzLlNvdXJjZUZpbGUge1xuICBjb25zdCBidWZmZXIgPSBob3N0LnJlYWQocGF0aCk7XG4gIGlmICghYnVmZmVyKSB7XG4gICAgdGhyb3cgbmV3IFNjaGVtYXRpY3NFeGNlcHRpb24oYENvdWxkIG5vdCBmaW5kIGZpbGUgZm9yIHBhdGg6ICR7cGF0aH1gKTtcbiAgfVxuICByZXR1cm4gdHMuY3JlYXRlU291cmNlRmlsZShwYXRoLCBidWZmZXIudG9TdHJpbmcoKSwgdHMuU2NyaXB0VGFyZ2V0LkxhdGVzdCwgdHJ1ZSk7XG59XG5cbi8qKiBJbXBvcnQgYW5kIGFkZCBtb2R1bGUgdG8gcm9vdCBhcHAgbW9kdWxlLiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGFkZE1vZHVsZUltcG9ydFRvUm9vdE1vZHVsZShcbiAgaG9zdDogVHJlZSxcbiAgbW9kdWxlTmFtZTogc3RyaW5nLFxuICBzcmM6IHN0cmluZyxcbiAgcHJvamVjdDogUHJvamVjdERlZmluaXRpb24sXG4pIHtcbiAgY29uc3QgbW9kdWxlUGF0aCA9IGdldEFwcE1vZHVsZVBhdGgoaG9zdCwgZ2V0UHJvamVjdE1haW5GaWxlKHByb2plY3QpKTtcbiAgYWRkTW9kdWxlSW1wb3J0VG9Nb2R1bGUoaG9zdCwgbW9kdWxlUGF0aCwgbW9kdWxlTmFtZSwgc3JjKTtcbn1cblxuLyoqXG4gKiBJbXBvcnQgYW5kIGFkZCBtb2R1bGUgdG8gc3BlY2lmaWMgbW9kdWxlIHBhdGguXG4gKiBAcGFyYW0gaG9zdCB0aGUgdHJlZSB3ZSBhcmUgdXBkYXRpbmdcbiAqIEBwYXJhbSBtb2R1bGVQYXRoIHNyYyBsb2NhdGlvbiBvZiB0aGUgbW9kdWxlIHRvIGltcG9ydFxuICogQHBhcmFtIG1vZHVsZU5hbWUgbmFtZSBvZiBtb2R1bGUgdG8gaW1wb3J0XG4gKiBAcGFyYW0gc3JjIHNyYyBsb2NhdGlvbiB0byBpbXBvcnRcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGFkZE1vZHVsZUltcG9ydFRvTW9kdWxlKFxuICBob3N0OiBUcmVlLFxuICBtb2R1bGVQYXRoOiBzdHJpbmcsXG4gIG1vZHVsZU5hbWU6IHN0cmluZyxcbiAgc3JjOiBzdHJpbmcsXG4pIHtcbiAgY29uc3QgbW9kdWxlU291cmNlID0gcGFyc2VTb3VyY2VGaWxlKGhvc3QsIG1vZHVsZVBhdGgpO1xuXG4gIGlmICghbW9kdWxlU291cmNlKSB7XG4gICAgdGhyb3cgbmV3IFNjaGVtYXRpY3NFeGNlcHRpb24oYE1vZHVsZSBub3QgZm91bmQ6ICR7bW9kdWxlUGF0aH1gKTtcbiAgfVxuXG4gIGNvbnN0IGNoYW5nZXMgPSBhZGRJbXBvcnRUb01vZHVsZShtb2R1bGVTb3VyY2UsIG1vZHVsZVBhdGgsIG1vZHVsZU5hbWUsIHNyYyk7XG4gIGNvbnN0IHJlY29yZGVyID0gaG9zdC5iZWdpblVwZGF0ZShtb2R1bGVQYXRoKTtcblxuICBjaGFuZ2VzLmZvckVhY2goY2hhbmdlID0+IHtcbiAgICBpZiAoY2hhbmdlIGluc3RhbmNlb2YgSW5zZXJ0Q2hhbmdlKSB7XG4gICAgICByZWNvcmRlci5pbnNlcnRMZWZ0KGNoYW5nZS5wb3MsIGNoYW5nZS50b0FkZCk7XG4gICAgfVxuICB9KTtcblxuICBob3N0LmNvbW1pdFVwZGF0ZShyZWNvcmRlcik7XG59XG5cbi8qKiBXcmFwcyB0aGUgaW50ZXJuYWwgZmluZCBtb2R1bGUgZnJvbSBvcHRpb25zIHdpdGggdW5kZWZpbmVkIHBhdGggaGFuZGxpbmcgICovXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gZmluZE1vZHVsZUZyb21PcHRpb25zKFxuICBob3N0OiBUcmVlLFxuICBvcHRpb25zOiBDb21wb25lbnRPcHRpb25zLFxuKTogUHJvbWlzZTxzdHJpbmcgfCB1bmRlZmluZWQ+IHtcbiAgY29uc3Qgd29ya3NwYWNlID0gYXdhaXQgZ2V0V29ya3NwYWNlKGhvc3QpO1xuXG4gIGlmICghb3B0aW9ucy5wcm9qZWN0KSB7XG4gICAgb3B0aW9ucy5wcm9qZWN0ID0gQXJyYXkuZnJvbSh3b3Jrc3BhY2UucHJvamVjdHMua2V5cygpKVswXTtcbiAgfVxuXG4gIGNvbnN0IHByb2plY3QgPSB3b3Jrc3BhY2UucHJvamVjdHMuZ2V0KG9wdGlvbnMucHJvamVjdCkhO1xuXG4gIGlmIChvcHRpb25zLnBhdGggPT09IHVuZGVmaW5lZCkge1xuICAgIG9wdGlvbnMucGF0aCA9IGAvJHtwcm9qZWN0LnJvb3R9L3NyYy9hcHBgO1xuICB9XG5cbiAgcmV0dXJuIGludGVybmFsRmluZE1vZHVsZShob3N0LCBvcHRpb25zKTtcbn1cbiJdfQ==