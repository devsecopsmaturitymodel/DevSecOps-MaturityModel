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
 * Scaffolds a new navigation component.
 * Internally it bootstraps the base component schematic
 */
function default_1(options) {
    return (0, schematics_1.chain)([
        (0, schematics_2.buildComponent)(Object.assign({}, options), {
            template: './__path__/__name@dasherize@if-flat__/__name@dasherize__.component.html.template',
            stylesheet: './__path__/__name@dasherize@if-flat__/__name@dasherize__.component.__style__.template',
        }),
        options.skipImport ? (0, schematics_1.noop)() : addNavModulesToModule(options),
    ]);
}
exports.default = default_1;
/**
 * Adds the required modules to the relative module.
 */
function addNavModulesToModule(options) {
    return (host) => __awaiter(this, void 0, void 0, function* () {
        const modulePath = (yield (0, schematics_2.findModuleFromOptions)(host, options));
        (0, schematics_2.addModuleImportToModule)(host, modulePath, 'LayoutModule', '@angular/cdk/layout');
        (0, schematics_2.addModuleImportToModule)(host, modulePath, 'MatToolbarModule', '@angular/material/toolbar');
        (0, schematics_2.addModuleImportToModule)(host, modulePath, 'MatButtonModule', '@angular/material/button');
        (0, schematics_2.addModuleImportToModule)(host, modulePath, 'MatSidenavModule', '@angular/material/sidenav');
        (0, schematics_2.addModuleImportToModule)(host, modulePath, 'MatIconModule', '@angular/material/icon');
        (0, schematics_2.addModuleImportToModule)(host, modulePath, 'MatListModule', '@angular/material/list');
    });
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9zcmMvbWF0ZXJpYWwvc2NoZW1hdGljcy9uZy1nZW5lcmF0ZS9uYXZpZ2F0aW9uL2luZGV4LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7O0dBTUc7Ozs7Ozs7Ozs7O0FBRUgsMkRBQW1FO0FBQ25FLHdEQUlpQztBQUdqQzs7O0dBR0c7QUFDSCxtQkFBeUIsT0FBZTtJQUN0QyxPQUFPLElBQUEsa0JBQUssRUFBQztRQUNYLElBQUEsMkJBQWMsb0JBQ1IsT0FBTyxHQUNYO1lBQ0UsUUFBUSxFQUNOLGtGQUFrRjtZQUNwRixVQUFVLEVBQ1IsdUZBQXVGO1NBQzFGLENBQ0Y7UUFDRCxPQUFPLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxJQUFBLGlCQUFJLEdBQUUsQ0FBQyxDQUFDLENBQUMscUJBQXFCLENBQUMsT0FBTyxDQUFDO0tBQzdELENBQUMsQ0FBQztBQUNMLENBQUM7QUFiRCw0QkFhQztBQUVEOztHQUVHO0FBQ0gsU0FBUyxxQkFBcUIsQ0FBQyxPQUFlO0lBQzVDLE9BQU8sQ0FBTyxJQUFVLEVBQUUsRUFBRTtRQUMxQixNQUFNLFVBQVUsR0FBRyxDQUFDLE1BQU0sSUFBQSxrQ0FBcUIsRUFBQyxJQUFJLEVBQUUsT0FBTyxDQUFDLENBQUUsQ0FBQztRQUNqRSxJQUFBLG9DQUF1QixFQUFDLElBQUksRUFBRSxVQUFVLEVBQUUsY0FBYyxFQUFFLHFCQUFxQixDQUFDLENBQUM7UUFDakYsSUFBQSxvQ0FBdUIsRUFBQyxJQUFJLEVBQUUsVUFBVSxFQUFFLGtCQUFrQixFQUFFLDJCQUEyQixDQUFDLENBQUM7UUFDM0YsSUFBQSxvQ0FBdUIsRUFBQyxJQUFJLEVBQUUsVUFBVSxFQUFFLGlCQUFpQixFQUFFLDBCQUEwQixDQUFDLENBQUM7UUFDekYsSUFBQSxvQ0FBdUIsRUFBQyxJQUFJLEVBQUUsVUFBVSxFQUFFLGtCQUFrQixFQUFFLDJCQUEyQixDQUFDLENBQUM7UUFDM0YsSUFBQSxvQ0FBdUIsRUFBQyxJQUFJLEVBQUUsVUFBVSxFQUFFLGVBQWUsRUFBRSx3QkFBd0IsQ0FBQyxDQUFDO1FBQ3JGLElBQUEsb0NBQXVCLEVBQUMsSUFBSSxFQUFFLFVBQVUsRUFBRSxlQUFlLEVBQUUsd0JBQXdCLENBQUMsQ0FBQztJQUN2RixDQUFDLENBQUEsQ0FBQztBQUNKLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtjaGFpbiwgbm9vcCwgUnVsZSwgVHJlZX0gZnJvbSAnQGFuZ3VsYXItZGV2a2l0L3NjaGVtYXRpY3MnO1xuaW1wb3J0IHtcbiAgYWRkTW9kdWxlSW1wb3J0VG9Nb2R1bGUsXG4gIGJ1aWxkQ29tcG9uZW50LFxuICBmaW5kTW9kdWxlRnJvbU9wdGlvbnMsXG59IGZyb20gJ0Bhbmd1bGFyL2Nkay9zY2hlbWF0aWNzJztcbmltcG9ydCB7U2NoZW1hfSBmcm9tICcuL3NjaGVtYSc7XG5cbi8qKlxuICogU2NhZmZvbGRzIGEgbmV3IG5hdmlnYXRpb24gY29tcG9uZW50LlxuICogSW50ZXJuYWxseSBpdCBib290c3RyYXBzIHRoZSBiYXNlIGNvbXBvbmVudCBzY2hlbWF0aWNcbiAqL1xuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gKG9wdGlvbnM6IFNjaGVtYSk6IFJ1bGUge1xuICByZXR1cm4gY2hhaW4oW1xuICAgIGJ1aWxkQ29tcG9uZW50KFxuICAgICAgey4uLm9wdGlvbnN9LFxuICAgICAge1xuICAgICAgICB0ZW1wbGF0ZTpcbiAgICAgICAgICAnLi9fX3BhdGhfXy9fX25hbWVAZGFzaGVyaXplQGlmLWZsYXRfXy9fX25hbWVAZGFzaGVyaXplX18uY29tcG9uZW50Lmh0bWwudGVtcGxhdGUnLFxuICAgICAgICBzdHlsZXNoZWV0OlxuICAgICAgICAgICcuL19fcGF0aF9fL19fbmFtZUBkYXNoZXJpemVAaWYtZmxhdF9fL19fbmFtZUBkYXNoZXJpemVfXy5jb21wb25lbnQuX19zdHlsZV9fLnRlbXBsYXRlJyxcbiAgICAgIH0sXG4gICAgKSxcbiAgICBvcHRpb25zLnNraXBJbXBvcnQgPyBub29wKCkgOiBhZGROYXZNb2R1bGVzVG9Nb2R1bGUob3B0aW9ucyksXG4gIF0pO1xufVxuXG4vKipcbiAqIEFkZHMgdGhlIHJlcXVpcmVkIG1vZHVsZXMgdG8gdGhlIHJlbGF0aXZlIG1vZHVsZS5cbiAqL1xuZnVuY3Rpb24gYWRkTmF2TW9kdWxlc1RvTW9kdWxlKG9wdGlvbnM6IFNjaGVtYSkge1xuICByZXR1cm4gYXN5bmMgKGhvc3Q6IFRyZWUpID0+IHtcbiAgICBjb25zdCBtb2R1bGVQYXRoID0gKGF3YWl0IGZpbmRNb2R1bGVGcm9tT3B0aW9ucyhob3N0LCBvcHRpb25zKSkhO1xuICAgIGFkZE1vZHVsZUltcG9ydFRvTW9kdWxlKGhvc3QsIG1vZHVsZVBhdGgsICdMYXlvdXRNb2R1bGUnLCAnQGFuZ3VsYXIvY2RrL2xheW91dCcpO1xuICAgIGFkZE1vZHVsZUltcG9ydFRvTW9kdWxlKGhvc3QsIG1vZHVsZVBhdGgsICdNYXRUb29sYmFyTW9kdWxlJywgJ0Bhbmd1bGFyL21hdGVyaWFsL3Rvb2xiYXInKTtcbiAgICBhZGRNb2R1bGVJbXBvcnRUb01vZHVsZShob3N0LCBtb2R1bGVQYXRoLCAnTWF0QnV0dG9uTW9kdWxlJywgJ0Bhbmd1bGFyL21hdGVyaWFsL2J1dHRvbicpO1xuICAgIGFkZE1vZHVsZUltcG9ydFRvTW9kdWxlKGhvc3QsIG1vZHVsZVBhdGgsICdNYXRTaWRlbmF2TW9kdWxlJywgJ0Bhbmd1bGFyL21hdGVyaWFsL3NpZGVuYXYnKTtcbiAgICBhZGRNb2R1bGVJbXBvcnRUb01vZHVsZShob3N0LCBtb2R1bGVQYXRoLCAnTWF0SWNvbk1vZHVsZScsICdAYW5ndWxhci9tYXRlcmlhbC9pY29uJyk7XG4gICAgYWRkTW9kdWxlSW1wb3J0VG9Nb2R1bGUoaG9zdCwgbW9kdWxlUGF0aCwgJ01hdExpc3RNb2R1bGUnLCAnQGFuZ3VsYXIvbWF0ZXJpYWwvbGlzdCcpO1xuICB9O1xufVxuIl19