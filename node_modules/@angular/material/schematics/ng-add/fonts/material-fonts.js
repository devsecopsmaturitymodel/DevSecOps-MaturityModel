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
exports.addFontsToIndex = void 0;
const schematics_1 = require("@angular-devkit/schematics");
const schematics_2 = require("@angular/cdk/schematics");
const workspace_1 = require("@schematics/angular/utility/workspace");
/** Adds the Material Design fonts to the index HTML file. */
function addFontsToIndex(options) {
    return (host) => __awaiter(this, void 0, void 0, function* () {
        const workspace = yield (0, workspace_1.getWorkspace)(host);
        const project = (0, schematics_2.getProjectFromWorkspace)(workspace, options.project);
        const projectIndexFiles = (0, schematics_2.getProjectIndexFiles)(project);
        if (!projectIndexFiles.length) {
            throw new schematics_1.SchematicsException('No project index HTML file could be found.');
        }
        const preconnect = `<link rel="preconnect" href="https://fonts.gstatic.com">`;
        const fonts = [
            'https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500&display=swap',
            'https://fonts.googleapis.com/icon?family=Material+Icons',
        ];
        projectIndexFiles.forEach(indexFilePath => {
            (0, schematics_2.appendHtmlElementToHead)(host, indexFilePath, preconnect);
            fonts.forEach(font => {
                (0, schematics_2.appendHtmlElementToHead)(host, indexFilePath, `<link href="${font}" rel="stylesheet">`);
            });
        });
    });
}
exports.addFontsToIndex = addFontsToIndex;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWF0ZXJpYWwtZm9udHMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9zcmMvbWF0ZXJpYWwvc2NoZW1hdGljcy9uZy1hZGQvZm9udHMvbWF0ZXJpYWwtZm9udHMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7R0FNRzs7Ozs7Ozs7Ozs7O0FBRUgsMkRBQTJFO0FBQzNFLHdEQUlpQztBQUNqQyxxRUFBbUU7QUFHbkUsNkRBQTZEO0FBQzdELFNBQWdCLGVBQWUsQ0FBQyxPQUFlO0lBQzdDLE9BQU8sQ0FBTyxJQUFVLEVBQUUsRUFBRTtRQUMxQixNQUFNLFNBQVMsR0FBRyxNQUFNLElBQUEsd0JBQVksRUFBQyxJQUFJLENBQUMsQ0FBQztRQUMzQyxNQUFNLE9BQU8sR0FBRyxJQUFBLG9DQUF1QixFQUFDLFNBQVMsRUFBRSxPQUFPLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDcEUsTUFBTSxpQkFBaUIsR0FBRyxJQUFBLGlDQUFvQixFQUFDLE9BQU8sQ0FBQyxDQUFDO1FBRXhELElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxNQUFNLEVBQUU7WUFDN0IsTUFBTSxJQUFJLGdDQUFtQixDQUFDLDRDQUE0QyxDQUFDLENBQUM7U0FDN0U7UUFFRCxNQUFNLFVBQVUsR0FBRywwREFBMEQsQ0FBQztRQUM5RSxNQUFNLEtBQUssR0FBRztZQUNaLCtFQUErRTtZQUMvRSx5REFBeUQ7U0FDMUQsQ0FBQztRQUVGLGlCQUFpQixDQUFDLE9BQU8sQ0FBQyxhQUFhLENBQUMsRUFBRTtZQUN4QyxJQUFBLG9DQUF1QixFQUFDLElBQUksRUFBRSxhQUFhLEVBQUUsVUFBVSxDQUFDLENBQUM7WUFFekQsS0FBSyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsRUFBRTtnQkFDbkIsSUFBQSxvQ0FBdUIsRUFBQyxJQUFJLEVBQUUsYUFBYSxFQUFFLGVBQWUsSUFBSSxxQkFBcUIsQ0FBQyxDQUFDO1lBQ3pGLENBQUMsQ0FBQyxDQUFDO1FBQ0wsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDLENBQUEsQ0FBQztBQUNKLENBQUM7QUF4QkQsMENBd0JDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7UnVsZSwgU2NoZW1hdGljc0V4Y2VwdGlvbiwgVHJlZX0gZnJvbSAnQGFuZ3VsYXItZGV2a2l0L3NjaGVtYXRpY3MnO1xuaW1wb3J0IHtcbiAgYXBwZW5kSHRtbEVsZW1lbnRUb0hlYWQsXG4gIGdldFByb2plY3RGcm9tV29ya3NwYWNlLFxuICBnZXRQcm9qZWN0SW5kZXhGaWxlcyxcbn0gZnJvbSAnQGFuZ3VsYXIvY2RrL3NjaGVtYXRpY3MnO1xuaW1wb3J0IHtnZXRXb3Jrc3BhY2V9IGZyb20gJ0BzY2hlbWF0aWNzL2FuZ3VsYXIvdXRpbGl0eS93b3Jrc3BhY2UnO1xuaW1wb3J0IHtTY2hlbWF9IGZyb20gJy4uL3NjaGVtYSc7XG5cbi8qKiBBZGRzIHRoZSBNYXRlcmlhbCBEZXNpZ24gZm9udHMgdG8gdGhlIGluZGV4IEhUTUwgZmlsZS4gKi9cbmV4cG9ydCBmdW5jdGlvbiBhZGRGb250c1RvSW5kZXgob3B0aW9uczogU2NoZW1hKTogUnVsZSB7XG4gIHJldHVybiBhc3luYyAoaG9zdDogVHJlZSkgPT4ge1xuICAgIGNvbnN0IHdvcmtzcGFjZSA9IGF3YWl0IGdldFdvcmtzcGFjZShob3N0KTtcbiAgICBjb25zdCBwcm9qZWN0ID0gZ2V0UHJvamVjdEZyb21Xb3Jrc3BhY2Uod29ya3NwYWNlLCBvcHRpb25zLnByb2plY3QpO1xuICAgIGNvbnN0IHByb2plY3RJbmRleEZpbGVzID0gZ2V0UHJvamVjdEluZGV4RmlsZXMocHJvamVjdCk7XG5cbiAgICBpZiAoIXByb2plY3RJbmRleEZpbGVzLmxlbmd0aCkge1xuICAgICAgdGhyb3cgbmV3IFNjaGVtYXRpY3NFeGNlcHRpb24oJ05vIHByb2plY3QgaW5kZXggSFRNTCBmaWxlIGNvdWxkIGJlIGZvdW5kLicpO1xuICAgIH1cblxuICAgIGNvbnN0IHByZWNvbm5lY3QgPSBgPGxpbmsgcmVsPVwicHJlY29ubmVjdFwiIGhyZWY9XCJodHRwczovL2ZvbnRzLmdzdGF0aWMuY29tXCI+YDtcbiAgICBjb25zdCBmb250cyA9IFtcbiAgICAgICdodHRwczovL2ZvbnRzLmdvb2dsZWFwaXMuY29tL2NzczI/ZmFtaWx5PVJvYm90bzp3Z2h0QDMwMDs0MDA7NTAwJmRpc3BsYXk9c3dhcCcsXG4gICAgICAnaHR0cHM6Ly9mb250cy5nb29nbGVhcGlzLmNvbS9pY29uP2ZhbWlseT1NYXRlcmlhbCtJY29ucycsXG4gICAgXTtcblxuICAgIHByb2plY3RJbmRleEZpbGVzLmZvckVhY2goaW5kZXhGaWxlUGF0aCA9PiB7XG4gICAgICBhcHBlbmRIdG1sRWxlbWVudFRvSGVhZChob3N0LCBpbmRleEZpbGVQYXRoLCBwcmVjb25uZWN0KTtcblxuICAgICAgZm9udHMuZm9yRWFjaChmb250ID0+IHtcbiAgICAgICAgYXBwZW5kSHRtbEVsZW1lbnRUb0hlYWQoaG9zdCwgaW5kZXhGaWxlUGF0aCwgYDxsaW5rIGhyZWY9XCIke2ZvbnR9XCIgcmVsPVwic3R5bGVzaGVldFwiPmApO1xuICAgICAgfSk7XG4gICAgfSk7XG4gIH07XG59XG4iXX0=