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
const schematics_1 = require("@angular-devkit/schematics");
const schematics_2 = require("@angular/cdk/schematics");
/**
 * Scaffolds a new table component.
 * Internally it bootstraps the base component schematic
 */
function default_1(options) {
    return (0, schematics_1.chain)([
        (0, schematics_2.buildComponent)(Object.assign({}, options), {
            template: './__path__/__name@dasherize@if-flat__/__name@dasherize__.component.html.template',
            stylesheet: './__path__/__name@dasherize@if-flat__/__name@dasherize__.component.__style__.template',
        }),
        options.skipImport ? (0, schematics_1.noop)() : addTableModulesToModule(options),
    ]);
}
exports.default = default_1;
/**
 * Adds the required modules to the relative module.
 */
function addTableModulesToModule(options) {
    return (host) => __awaiter(this, void 0, void 0, function* () {
        const modulePath = (yield (0, schematics_2.findModuleFromOptions)(host, options));
        (0, schematics_2.addModuleImportToModule)(host, modulePath, 'MatTableModule', '@angular/material/table');
        (0, schematics_2.addModuleImportToModule)(host, modulePath, 'MatPaginatorModule', '@angular/material/paginator');
        (0, schematics_2.addModuleImportToModule)(host, modulePath, 'MatSortModule', '@angular/material/sort');
    });
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9zcmMvbWF0ZXJpYWwvc2NoZW1hdGljcy9uZy1nZW5lcmF0ZS90YWJsZS9pbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7OztHQU1HOzs7Ozs7Ozs7OztBQUVILDJEQUFtRTtBQUNuRSx3REFJaUM7QUFHakM7OztHQUdHO0FBQ0gsbUJBQXlCLE9BQWU7SUFDdEMsT0FBTyxJQUFBLGtCQUFLLEVBQUM7UUFDWCxJQUFBLDJCQUFjLG9CQUNSLE9BQU8sR0FDWDtZQUNFLFFBQVEsRUFDTixrRkFBa0Y7WUFDcEYsVUFBVSxFQUNSLHVGQUF1RjtTQUMxRixDQUNGO1FBQ0QsT0FBTyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsSUFBQSxpQkFBSSxHQUFFLENBQUMsQ0FBQyxDQUFDLHVCQUF1QixDQUFDLE9BQU8sQ0FBQztLQUMvRCxDQUFDLENBQUM7QUFDTCxDQUFDO0FBYkQsNEJBYUM7QUFFRDs7R0FFRztBQUNILFNBQVMsdUJBQXVCLENBQUMsT0FBZTtJQUM5QyxPQUFPLENBQU8sSUFBVSxFQUFFLEVBQUU7UUFDMUIsTUFBTSxVQUFVLEdBQUcsQ0FBQyxNQUFNLElBQUEsa0NBQXFCLEVBQUMsSUFBSSxFQUFFLE9BQU8sQ0FBQyxDQUFFLENBQUM7UUFDakUsSUFBQSxvQ0FBdUIsRUFBQyxJQUFJLEVBQUUsVUFBVSxFQUFFLGdCQUFnQixFQUFFLHlCQUF5QixDQUFDLENBQUM7UUFDdkYsSUFBQSxvQ0FBdUIsRUFBQyxJQUFJLEVBQUUsVUFBVSxFQUFFLG9CQUFvQixFQUFFLDZCQUE2QixDQUFDLENBQUM7UUFDL0YsSUFBQSxvQ0FBdUIsRUFBQyxJQUFJLEVBQUUsVUFBVSxFQUFFLGVBQWUsRUFBRSx3QkFBd0IsQ0FBQyxDQUFDO0lBQ3ZGLENBQUMsQ0FBQSxDQUFDO0FBQ0osQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge2NoYWluLCBub29wLCBSdWxlLCBUcmVlfSBmcm9tICdAYW5ndWxhci1kZXZraXQvc2NoZW1hdGljcyc7XG5pbXBvcnQge1xuICBhZGRNb2R1bGVJbXBvcnRUb01vZHVsZSxcbiAgYnVpbGRDb21wb25lbnQsXG4gIGZpbmRNb2R1bGVGcm9tT3B0aW9ucyxcbn0gZnJvbSAnQGFuZ3VsYXIvY2RrL3NjaGVtYXRpY3MnO1xuaW1wb3J0IHtTY2hlbWF9IGZyb20gJy4vc2NoZW1hJztcblxuLyoqXG4gKiBTY2FmZm9sZHMgYSBuZXcgdGFibGUgY29tcG9uZW50LlxuICogSW50ZXJuYWxseSBpdCBib290c3RyYXBzIHRoZSBiYXNlIGNvbXBvbmVudCBzY2hlbWF0aWNcbiAqL1xuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gKG9wdGlvbnM6IFNjaGVtYSk6IFJ1bGUge1xuICByZXR1cm4gY2hhaW4oW1xuICAgIGJ1aWxkQ29tcG9uZW50KFxuICAgICAgey4uLm9wdGlvbnN9LFxuICAgICAge1xuICAgICAgICB0ZW1wbGF0ZTpcbiAgICAgICAgICAnLi9fX3BhdGhfXy9fX25hbWVAZGFzaGVyaXplQGlmLWZsYXRfXy9fX25hbWVAZGFzaGVyaXplX18uY29tcG9uZW50Lmh0bWwudGVtcGxhdGUnLFxuICAgICAgICBzdHlsZXNoZWV0OlxuICAgICAgICAgICcuL19fcGF0aF9fL19fbmFtZUBkYXNoZXJpemVAaWYtZmxhdF9fL19fbmFtZUBkYXNoZXJpemVfXy5jb21wb25lbnQuX19zdHlsZV9fLnRlbXBsYXRlJyxcbiAgICAgIH0sXG4gICAgKSxcbiAgICBvcHRpb25zLnNraXBJbXBvcnQgPyBub29wKCkgOiBhZGRUYWJsZU1vZHVsZXNUb01vZHVsZShvcHRpb25zKSxcbiAgXSk7XG59XG5cbi8qKlxuICogQWRkcyB0aGUgcmVxdWlyZWQgbW9kdWxlcyB0byB0aGUgcmVsYXRpdmUgbW9kdWxlLlxuICovXG5mdW5jdGlvbiBhZGRUYWJsZU1vZHVsZXNUb01vZHVsZShvcHRpb25zOiBTY2hlbWEpIHtcbiAgcmV0dXJuIGFzeW5jIChob3N0OiBUcmVlKSA9PiB7XG4gICAgY29uc3QgbW9kdWxlUGF0aCA9IChhd2FpdCBmaW5kTW9kdWxlRnJvbU9wdGlvbnMoaG9zdCwgb3B0aW9ucykpITtcbiAgICBhZGRNb2R1bGVJbXBvcnRUb01vZHVsZShob3N0LCBtb2R1bGVQYXRoLCAnTWF0VGFibGVNb2R1bGUnLCAnQGFuZ3VsYXIvbWF0ZXJpYWwvdGFibGUnKTtcbiAgICBhZGRNb2R1bGVJbXBvcnRUb01vZHVsZShob3N0LCBtb2R1bGVQYXRoLCAnTWF0UGFnaW5hdG9yTW9kdWxlJywgJ0Bhbmd1bGFyL21hdGVyaWFsL3BhZ2luYXRvcicpO1xuICAgIGFkZE1vZHVsZUltcG9ydFRvTW9kdWxlKGhvc3QsIG1vZHVsZVBhdGgsICdNYXRTb3J0TW9kdWxlJywgJ0Bhbmd1bGFyL21hdGVyaWFsL3NvcnQnKTtcbiAgfTtcbn1cbiJdfQ==