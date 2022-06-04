"use strict";
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
const tasks_1 = require("@angular-devkit/schematics/tasks");
const package_config_1 = require("./package-config");
/**
 * Schematic factory entry-point for the `ng-add` schematic. The ng-add schematic will be
 * automatically executed if developers run `ng add @angular/cdk`.
 *
 * By default, the CLI already installs the package that has been specified with `ng add`.
 * We just store the version in the `package.json` in case the package manager didn't. Also
 * this ensures that there will be no error that says that the CDK does not support `ng add`.
 */
function default_1() {
    return (host, context) => {
        // The CLI inserts `@angular/cdk` into the `package.json` before this schematic runs. This
        // means that we do not need to insert the CDK into `package.json` files again. In some cases
        // though, it could happen that this schematic runs outside of the CLI `ng add` command, or
        // the CDK is only listed as a dev dependency. If that is the case, we insert a version based
        // on the current build version (substituted version placeholder).
        if ((0, package_config_1.getPackageVersionFromPackageJson)(host, '@angular/cdk') === null) {
            // In order to align the CDK version with other Angular dependencies that are setup by
            // `@schematics/angular`, we use tilde instead of caret. This is default for Angular
            // dependencies in new CLI projects.
            (0, package_config_1.addPackageToPackageJson)(host, '@angular/cdk', `~13.3.8`);
            // Add a task to run the package manager. This is necessary because we updated the
            // workspace "package.json" file and we want lock files to reflect the new version range.
            context.addTask(new tasks_1.NodePackageInstallTask());
        }
    };
}
exports.default = default_1;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi9zcmMvY2RrL3NjaGVtYXRpY3MvbmctYWRkL2luZGV4LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7O0dBTUc7O0FBR0gsNERBQXdFO0FBQ3hFLHFEQUEyRjtBQUUzRjs7Ozs7OztHQU9HO0FBQ0g7SUFDRSxPQUFPLENBQUMsSUFBVSxFQUFFLE9BQXlCLEVBQUUsRUFBRTtRQUMvQywwRkFBMEY7UUFDMUYsNkZBQTZGO1FBQzdGLDJGQUEyRjtRQUMzRiw2RkFBNkY7UUFDN0Ysa0VBQWtFO1FBQ2xFLElBQUksSUFBQSxpREFBZ0MsRUFBQyxJQUFJLEVBQUUsY0FBYyxDQUFDLEtBQUssSUFBSSxFQUFFO1lBQ25FLHNGQUFzRjtZQUN0RixvRkFBb0Y7WUFDcEYsb0NBQW9DO1lBQ3BDLElBQUEsd0NBQXVCLEVBQUMsSUFBSSxFQUFFLGNBQWMsRUFBRSxvQkFBb0IsQ0FBQyxDQUFDO1lBRXBFLGtGQUFrRjtZQUNsRix5RkFBeUY7WUFDekYsT0FBTyxDQUFDLE9BQU8sQ0FBQyxJQUFJLDhCQUFzQixFQUFFLENBQUMsQ0FBQztTQUMvQztJQUNILENBQUMsQ0FBQztBQUNKLENBQUM7QUFsQkQsNEJBa0JDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7UnVsZSwgU2NoZW1hdGljQ29udGV4dCwgVHJlZX0gZnJvbSAnQGFuZ3VsYXItZGV2a2l0L3NjaGVtYXRpY3MnO1xuaW1wb3J0IHtOb2RlUGFja2FnZUluc3RhbGxUYXNrfSBmcm9tICdAYW5ndWxhci1kZXZraXQvc2NoZW1hdGljcy90YXNrcyc7XG5pbXBvcnQge2FkZFBhY2thZ2VUb1BhY2thZ2VKc29uLCBnZXRQYWNrYWdlVmVyc2lvbkZyb21QYWNrYWdlSnNvbn0gZnJvbSAnLi9wYWNrYWdlLWNvbmZpZyc7XG5cbi8qKlxuICogU2NoZW1hdGljIGZhY3RvcnkgZW50cnktcG9pbnQgZm9yIHRoZSBgbmctYWRkYCBzY2hlbWF0aWMuIFRoZSBuZy1hZGQgc2NoZW1hdGljIHdpbGwgYmVcbiAqIGF1dG9tYXRpY2FsbHkgZXhlY3V0ZWQgaWYgZGV2ZWxvcGVycyBydW4gYG5nIGFkZCBAYW5ndWxhci9jZGtgLlxuICpcbiAqIEJ5IGRlZmF1bHQsIHRoZSBDTEkgYWxyZWFkeSBpbnN0YWxscyB0aGUgcGFja2FnZSB0aGF0IGhhcyBiZWVuIHNwZWNpZmllZCB3aXRoIGBuZyBhZGRgLlxuICogV2UganVzdCBzdG9yZSB0aGUgdmVyc2lvbiBpbiB0aGUgYHBhY2thZ2UuanNvbmAgaW4gY2FzZSB0aGUgcGFja2FnZSBtYW5hZ2VyIGRpZG4ndC4gQWxzb1xuICogdGhpcyBlbnN1cmVzIHRoYXQgdGhlcmUgd2lsbCBiZSBubyBlcnJvciB0aGF0IHNheXMgdGhhdCB0aGUgQ0RLIGRvZXMgbm90IHN1cHBvcnQgYG5nIGFkZGAuXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uICgpOiBSdWxlIHtcbiAgcmV0dXJuIChob3N0OiBUcmVlLCBjb250ZXh0OiBTY2hlbWF0aWNDb250ZXh0KSA9PiB7XG4gICAgLy8gVGhlIENMSSBpbnNlcnRzIGBAYW5ndWxhci9jZGtgIGludG8gdGhlIGBwYWNrYWdlLmpzb25gIGJlZm9yZSB0aGlzIHNjaGVtYXRpYyBydW5zLiBUaGlzXG4gICAgLy8gbWVhbnMgdGhhdCB3ZSBkbyBub3QgbmVlZCB0byBpbnNlcnQgdGhlIENESyBpbnRvIGBwYWNrYWdlLmpzb25gIGZpbGVzIGFnYWluLiBJbiBzb21lIGNhc2VzXG4gICAgLy8gdGhvdWdoLCBpdCBjb3VsZCBoYXBwZW4gdGhhdCB0aGlzIHNjaGVtYXRpYyBydW5zIG91dHNpZGUgb2YgdGhlIENMSSBgbmcgYWRkYCBjb21tYW5kLCBvclxuICAgIC8vIHRoZSBDREsgaXMgb25seSBsaXN0ZWQgYXMgYSBkZXYgZGVwZW5kZW5jeS4gSWYgdGhhdCBpcyB0aGUgY2FzZSwgd2UgaW5zZXJ0IGEgdmVyc2lvbiBiYXNlZFxuICAgIC8vIG9uIHRoZSBjdXJyZW50IGJ1aWxkIHZlcnNpb24gKHN1YnN0aXR1dGVkIHZlcnNpb24gcGxhY2Vob2xkZXIpLlxuICAgIGlmIChnZXRQYWNrYWdlVmVyc2lvbkZyb21QYWNrYWdlSnNvbihob3N0LCAnQGFuZ3VsYXIvY2RrJykgPT09IG51bGwpIHtcbiAgICAgIC8vIEluIG9yZGVyIHRvIGFsaWduIHRoZSBDREsgdmVyc2lvbiB3aXRoIG90aGVyIEFuZ3VsYXIgZGVwZW5kZW5jaWVzIHRoYXQgYXJlIHNldHVwIGJ5XG4gICAgICAvLyBgQHNjaGVtYXRpY3MvYW5ndWxhcmAsIHdlIHVzZSB0aWxkZSBpbnN0ZWFkIG9mIGNhcmV0LiBUaGlzIGlzIGRlZmF1bHQgZm9yIEFuZ3VsYXJcbiAgICAgIC8vIGRlcGVuZGVuY2llcyBpbiBuZXcgQ0xJIHByb2plY3RzLlxuICAgICAgYWRkUGFja2FnZVRvUGFja2FnZUpzb24oaG9zdCwgJ0Bhbmd1bGFyL2NkaycsIGB+MC4wLjAtUExBQ0VIT0xERVJgKTtcblxuICAgICAgLy8gQWRkIGEgdGFzayB0byBydW4gdGhlIHBhY2thZ2UgbWFuYWdlci4gVGhpcyBpcyBuZWNlc3NhcnkgYmVjYXVzZSB3ZSB1cGRhdGVkIHRoZVxuICAgICAgLy8gd29ya3NwYWNlIFwicGFja2FnZS5qc29uXCIgZmlsZSBhbmQgd2Ugd2FudCBsb2NrIGZpbGVzIHRvIHJlZmxlY3QgdGhlIG5ldyB2ZXJzaW9uIHJhbmdlLlxuICAgICAgY29udGV4dC5hZGRUYXNrKG5ldyBOb2RlUGFja2FnZUluc3RhbGxUYXNrKCkpO1xuICAgIH1cbiAgfTtcbn1cbiJdfQ==