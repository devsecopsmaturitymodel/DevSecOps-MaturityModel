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
exports.addTypographyClass = exports.addThemeToAppStyles = void 0;
const core_1 = require("@angular-devkit/core");
const schematics_1 = require("@angular-devkit/schematics");
const schematics_2 = require("@angular/cdk/schematics");
const change_1 = require("@schematics/angular/utility/change");
const workspace_1 = require("@schematics/angular/utility/workspace");
const path_1 = require("path");
const create_custom_theme_1 = require("./create-custom-theme");
/** Path segment that can be found in paths that refer to a prebuilt theme. */
const prebuiltThemePathSegment = '@angular/material/prebuilt-themes';
/** Default file name of the custom theme that can be generated. */
const defaultCustomThemeFilename = 'custom-theme.scss';
/** Add pre-built styles to the main project style file. */
function addThemeToAppStyles(options) {
    return (host, context) => {
        const themeName = options.theme || 'indigo-pink';
        return themeName === 'custom'
            ? insertCustomTheme(options.project, host, context.logger)
            : insertPrebuiltTheme(options.project, themeName, context.logger);
    };
}
exports.addThemeToAppStyles = addThemeToAppStyles;
/** Adds the global typography class to the body element. */
function addTypographyClass(options) {
    return (host) => __awaiter(this, void 0, void 0, function* () {
        const workspace = yield (0, workspace_1.getWorkspace)(host);
        const project = (0, schematics_2.getProjectFromWorkspace)(workspace, options.project);
        const projectIndexFiles = (0, schematics_2.getProjectIndexFiles)(project);
        if (!projectIndexFiles.length) {
            throw new schematics_1.SchematicsException('No project index HTML file could be found.');
        }
        if (options.typography) {
            projectIndexFiles.forEach(path => (0, schematics_2.addBodyClass)(host, path, 'mat-typography'));
        }
    });
}
exports.addTypographyClass = addTypographyClass;
/**
 * Insert a custom theme to project style file. If no valid style file could be found, a new
 * Scss file for the custom theme will be created.
 */
function insertCustomTheme(projectName, host, logger) {
    return __awaiter(this, void 0, void 0, function* () {
        const workspace = yield (0, workspace_1.getWorkspace)(host);
        const project = (0, schematics_2.getProjectFromWorkspace)(workspace, projectName);
        const stylesPath = (0, schematics_2.getProjectStyleFile)(project, 'scss');
        const themeContent = (0, create_custom_theme_1.createCustomTheme)(projectName);
        if (!stylesPath) {
            if (!project.sourceRoot) {
                throw new schematics_1.SchematicsException(`Could not find source root for project: "${projectName}". ` +
                    `Please make sure that the "sourceRoot" property is set in the workspace config.`);
            }
            // Normalize the path through the devkit utilities because we want to avoid having
            // unnecessary path segments and windows backslash delimiters.
            const customThemePath = (0, core_1.normalize)((0, path_1.join)(project.sourceRoot, defaultCustomThemeFilename));
            if (host.exists(customThemePath)) {
                logger.warn(`Cannot create a custom Angular Material theme because
          ${customThemePath} already exists. Skipping custom theme generation.`);
                return (0, schematics_1.noop)();
            }
            host.create(customThemePath, themeContent);
            return addThemeStyleToTarget(projectName, 'build', customThemePath, logger);
        }
        const insertion = new change_1.InsertChange(stylesPath, 0, themeContent);
        const recorder = host.beginUpdate(stylesPath);
        recorder.insertLeft(insertion.pos, insertion.toAdd);
        host.commitUpdate(recorder);
        return (0, schematics_1.noop)();
    });
}
/** Insert a pre-built theme into the angular.json file. */
function insertPrebuiltTheme(project, theme, logger) {
    // Path needs to be always relative to the `package.json` or workspace root.
    const themePath = `./node_modules/@angular/material/prebuilt-themes/${theme}.css`;
    return (0, schematics_1.chain)([
        addThemeStyleToTarget(project, 'build', themePath, logger),
        addThemeStyleToTarget(project, 'test', themePath, logger),
    ]);
}
/** Adds a theming style entry to the given project target options. */
function addThemeStyleToTarget(projectName, targetName, assetPath, logger) {
    return (0, workspace_1.updateWorkspace)(workspace => {
        const project = (0, schematics_2.getProjectFromWorkspace)(workspace, projectName);
        // Do not update the builder options in case the target does not use the default CLI builder.
        if (!validateDefaultTargetBuilder(project, targetName, logger)) {
            return;
        }
        const targetOptions = (0, schematics_2.getProjectTargetOptions)(project, targetName);
        const styles = targetOptions.styles;
        if (!styles) {
            targetOptions.styles = [assetPath];
        }
        else {
            const existingStyles = styles.map(s => (typeof s === 'string' ? s : s.input));
            for (let [index, stylePath] of existingStyles.entries()) {
                // If the given asset is already specified in the styles, we don't need to do anything.
                if (stylePath === assetPath) {
                    return;
                }
                // In case a prebuilt theme is already set up, we can safely replace the theme with the new
                // theme file. If a custom theme is set up, we are not able to safely replace the custom
                // theme because these files can contain custom styles, while prebuilt themes are
                // always packaged and considered replaceable.
                if (stylePath.includes(defaultCustomThemeFilename)) {
                    logger.error(`Could not add the selected theme to the CLI project ` +
                        `configuration because there is already a custom theme file referenced.`);
                    logger.info(`Please manually add the following style file to your configuration:`);
                    logger.info(`    ${assetPath}`);
                    return;
                }
                else if (stylePath.includes(prebuiltThemePathSegment)) {
                    styles.splice(index, 1);
                }
            }
            styles.unshift(assetPath);
        }
    });
}
/**
 * Validates that the specified project target is configured with the default builders which are
 * provided by the Angular CLI. If the configured builder does not match the default builder,
 * this function can either throw or just show a warning.
 */
function validateDefaultTargetBuilder(project, targetName, logger) {
    const defaultBuilder = schematics_2.defaultTargetBuilders[targetName];
    const targetConfig = project.targets && project.targets.get(targetName);
    const isDefaultBuilder = targetConfig && targetConfig['builder'] === defaultBuilder;
    // Because the build setup for the Angular CLI can be customized by developers, we can't know
    // where to put the theme file in the workspace configuration if custom builders are being
    // used. In case the builder has been changed for the "build" target, we throw an error and
    // exit because setting up a theme is a primary goal of `ng-add`. Otherwise if just the "test"
    // builder has been changed, we warn because a theme is not mandatory for running tests
    // with Material. See: https://github.com/angular/components/issues/14176
    if (!isDefaultBuilder && targetName === 'build') {
        throw new schematics_1.SchematicsException(`Your project is not using the default builders for ` +
            `"${targetName}". The Angular Material schematics cannot add a theme to the workspace ` +
            `configuration if the builder has been changed.`);
    }
    else if (!isDefaultBuilder) {
        // for non-build targets we gracefully report the error without actually aborting the
        // setup schematic. This is because a theme is not mandatory for running tests.
        logger.warn(`Your project is not using the default builders for "${targetName}". This ` +
            `means that we cannot add the configured theme to the "${targetName}" target.`);
    }
    return isDefaultBuilder;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGhlbWluZy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3NyYy9tYXRlcmlhbC9zY2hlbWF0aWNzL25nLWFkZC90aGVtaW5nL3RoZW1pbmcudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7R0FNRzs7Ozs7Ozs7Ozs7O0FBRUgsK0NBQXdEO0FBRXhELDJEQU9vQztBQUNwQyx3REFPaUM7QUFDakMsK0RBQWdFO0FBQ2hFLHFFQUFvRjtBQUNwRiwrQkFBMEI7QUFFMUIsK0RBQXdEO0FBRXhELDhFQUE4RTtBQUM5RSxNQUFNLHdCQUF3QixHQUFHLG1DQUFtQyxDQUFDO0FBRXJFLG1FQUFtRTtBQUNuRSxNQUFNLDBCQUEwQixHQUFHLG1CQUFtQixDQUFDO0FBRXZELDJEQUEyRDtBQUMzRCxTQUFnQixtQkFBbUIsQ0FBQyxPQUFlO0lBQ2pELE9BQU8sQ0FBQyxJQUFVLEVBQUUsT0FBeUIsRUFBRSxFQUFFO1FBQy9DLE1BQU0sU0FBUyxHQUFHLE9BQU8sQ0FBQyxLQUFLLElBQUksYUFBYSxDQUFDO1FBQ2pELE9BQU8sU0FBUyxLQUFLLFFBQVE7WUFDM0IsQ0FBQyxDQUFDLGlCQUFpQixDQUFDLE9BQU8sQ0FBQyxPQUFPLEVBQUUsSUFBSSxFQUFFLE9BQU8sQ0FBQyxNQUFNLENBQUM7WUFDMUQsQ0FBQyxDQUFDLG1CQUFtQixDQUFDLE9BQU8sQ0FBQyxPQUFPLEVBQUUsU0FBUyxFQUFFLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQztJQUN0RSxDQUFDLENBQUM7QUFDSixDQUFDO0FBUEQsa0RBT0M7QUFFRCw0REFBNEQ7QUFDNUQsU0FBZ0Isa0JBQWtCLENBQUMsT0FBZTtJQUNoRCxPQUFPLENBQU8sSUFBVSxFQUFFLEVBQUU7UUFDMUIsTUFBTSxTQUFTLEdBQUcsTUFBTSxJQUFBLHdCQUFZLEVBQUMsSUFBSSxDQUFDLENBQUM7UUFDM0MsTUFBTSxPQUFPLEdBQUcsSUFBQSxvQ0FBdUIsRUFBQyxT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O0FBQzFCLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtub3JtYWxpemUsIGxvZ2dpbmd9IGZyb20gJ0Bhbmd1bGFyLWRldmtpdC9jb3JlJztcbmltcG9ydCB7UHJvamVjdERlZmluaXRpb259IGZyb20gJ0Bhbmd1bGFyLWRldmtpdC9jb3JlL3NyYy93b3Jrc3BhY2UnO1xuaW1wb3J0IHtcbiAgY2hhaW4sXG4gIG5vb3AsXG4gIFJ1bGUsXG4gIFNjaGVtYXRpY0NvbnRleHQsXG4gIFNjaGVtYXRpY3NFeGNlcHRpb24sXG4gIFRyZWUsXG59IGZyb20gJ0Bhbmd1bGFyLWRldmtpdC9zY2hlbWF0aWNzJztcbmltcG9ydCB7XG4gIGFkZEJvZHlDbGFzcyxcbiAgZGVmYXVsdFRhcmdldEJ1aWxkZXJzLFxuICBnZXRQcm9qZWN0RnJvbVdvcmtzcGFjZSxcbiAgZ2V0UHJvamVjdFN0eWxlRmlsZSxcbiAgZ2V0UHJvamVjdFRhcmdldE9wdGlvbnMsXG4gIGdldFByb2plY3RJbmRleEZpbGVzLFxufSBmcm9tICdAYW5ndWxhci9jZGsvc2NoZW1hdGljcyc7XG5pbXBvcnQge0luc2VydENoYW5nZX0gZnJvbSAnQHNjaGVtYXRpY3MvYW5ndWxhci91dGlsaXR5L2NoYW5nZSc7XG5pbXBvcnQge2dldFdvcmtzcGFjZSwgdXBkYXRlV29ya3NwYWNlfSBmcm9tICdAc2NoZW1hdGljcy9hbmd1bGFyL3V0aWxpdHkvd29ya3NwYWNlJztcbmltcG9ydCB7am9pbn0gZnJvbSAncGF0aCc7XG5pbXBvcnQge1NjaGVtYX0gZnJvbSAnLi4vc2NoZW1hJztcbmltcG9ydCB7Y3JlYXRlQ3VzdG9tVGhlbWV9IGZyb20gJy4vY3JlYXRlLWN1c3RvbS10aGVtZSc7XG5cbi8qKiBQYXRoIHNlZ21lbnQgdGhhdCBjYW4gYmUgZm91bmQgaW4gcGF0aHMgdGhhdCByZWZlciB0byBhIHByZWJ1aWx0IHRoZW1lLiAqL1xuY29uc3QgcHJlYnVpbHRUaGVtZVBhdGhTZWdtZW50ID0gJ0Bhbmd1bGFyL21hdGVyaWFsL3ByZWJ1aWx0LXRoZW1lcyc7XG5cbi8qKiBEZWZhdWx0IGZpbGUgbmFtZSBvZiB0aGUgY3VzdG9tIHRoZW1lIHRoYXQgY2FuIGJlIGdlbmVyYXRlZC4gKi9cbmNvbnN0IGRlZmF1bHRDdXN0b21UaGVtZUZpbGVuYW1lID0gJ2N1c3RvbS10aGVtZS5zY3NzJztcblxuLyoqIEFkZCBwcmUtYnVpbHQgc3R5bGVzIHRvIHRoZSBtYWluIHByb2plY3Qgc3R5bGUgZmlsZS4gKi9cbmV4cG9ydCBmdW5jdGlvbiBhZGRUaGVtZVRvQXBwU3R5bGVzKG9wdGlvbnM6IFNjaGVtYSk6IFJ1bGUge1xuICByZXR1cm4gKGhvc3Q6IFRyZWUsIGNvbnRleHQ6IFNjaGVtYXRpY0NvbnRleHQpID0+IHtcbiAgICBjb25zdCB0aGVtZU5hbWUgPSBvcHRpb25zLnRoZW1lIHx8ICdpbmRpZ28tcGluayc7XG4gICAgcmV0dXJuIHRoZW1lTmFtZSA9PT0gJ2N1c3RvbSdcbiAgICAgID8gaW5zZXJ0Q3VzdG9tVGhlbWUob3B0aW9ucy5wcm9qZWN0LCBob3N0LCBjb250ZXh0LmxvZ2dlcilcbiAgICAgIDogaW5zZXJ0UHJlYnVpbHRUaGVtZShvcHRpb25zLnByb2plY3QsIHRoZW1lTmFtZSwgY29udGV4dC5sb2dnZXIpO1xuICB9O1xufVxuXG4vKiogQWRkcyB0aGUgZ2xvYmFsIHR5cG9ncmFwaHkgY2xhc3MgdG8gdGhlIGJvZHkgZWxlbWVudC4gKi9cbmV4cG9ydCBmdW5jdGlvbiBhZGRUeXBvZ3JhcGh5Q2xhc3Mob3B0aW9uczogU2NoZW1hKTogUnVsZSB7XG4gIHJldHVybiBhc3luYyAoaG9zdDogVHJlZSkgPT4ge1xuICAgIGNvbnN0IHdvcmtzcGFjZSA9IGF3YWl0IGdldFdvcmtzcGFjZShob3N0KTtcbiAgICBjb25zdCBwcm9qZWN0ID0gZ2V0UHJvamVjdEZyb21Xb3Jrc3BhY2Uod29ya3NwYWNlLCBvcHRpb25zLnByb2plY3QpO1xuICAgIGNvbnN0IHByb2plY3RJbmRleEZpbGVzID0gZ2V0UHJvamVjdEluZGV4RmlsZXMocHJvamVjdCk7XG5cbiAgICBpZiAoIXByb2plY3RJbmRleEZpbGVzLmxlbmd0aCkge1xuICAgICAgdGhyb3cgbmV3IFNjaGVtYXRpY3NFeGNlcHRpb24oJ05vIHByb2plY3QgaW5kZXggSFRNTCBmaWxlIGNvdWxkIGJlIGZvdW5kLicpO1xuICAgIH1cblxuICAgIGlmIChvcHRpb25zLnR5cG9ncmFwaHkpIHtcbiAgICAgIHByb2plY3RJbmRleEZpbGVzLmZvckVhY2gocGF0aCA9PiBhZGRCb2R5Q2xhc3MoaG9zdCwgcGF0aCwgJ21hdC10eXBvZ3JhcGh5JykpO1xuICAgIH1cbiAgfTtcbn1cblxuLyoqXG4gKiBJbnNlcnQgYSBjdXN0b20gdGhlbWUgdG8gcHJvamVjdCBzdHlsZSBmaWxlLiBJZiBubyB2YWxpZCBzdHlsZSBmaWxlIGNvdWxkIGJlIGZvdW5kLCBhIG5ld1xuICogU2NzcyBmaWxlIGZvciB0aGUgY3VzdG9tIHRoZW1lIHdpbGwgYmUgY3JlYXRlZC5cbiAqL1xuYXN5bmMgZnVuY3Rpb24gaW5zZXJ0Q3VzdG9tVGhlbWUoXG4gIHByb2plY3ROYW1lOiBzdHJpbmcsXG4gIGhvc3Q6IFRyZWUsXG4gIGxvZ2dlcjogbG9nZ2luZy5Mb2dnZXJBcGksXG4pOiBQcm9taXNlPFJ1bGU+IHtcbiAgY29uc3Qgd29ya3NwYWNlID0gYXdhaXQgZ2V0V29ya3NwYWNlKGhvc3QpO1xuICBjb25zdCBwcm9qZWN0ID0gZ2V0UHJvamVjdEZyb21Xb3Jrc3BhY2Uod29ya3NwYWNlLCBwcm9qZWN0TmFtZSk7XG4gIGNvbnN0IHN0eWxlc1BhdGggPSBnZXRQcm9qZWN0U3R5bGVGaWxlKHByb2plY3QsICdzY3NzJyk7XG4gIGNvbnN0IHRoZW1lQ29udGVudCA9IGNyZWF0ZUN1c3RvbVRoZW1lKHByb2plY3ROYW1lKTtcblxuICBpZiAoIXN0eWxlc1BhdGgpIHtcbiAgICBpZiAoIXByb2plY3Quc291cmNlUm9vdCkge1xuICAgICAgdGhyb3cgbmV3IFNjaGVtYXRpY3NFeGNlcHRpb24oXG4gICAgICAgIGBDb3VsZCBub3QgZmluZCBzb3VyY2Ugcm9vdCBmb3IgcHJvamVjdDogXCIke3Byb2plY3ROYW1lfVwiLiBgICtcbiAgICAgICAgICBgUGxlYXNlIG1ha2Ugc3VyZSB0aGF0IHRoZSBcInNvdXJjZVJvb3RcIiBwcm9wZXJ0eSBpcyBzZXQgaW4gdGhlIHdvcmtzcGFjZSBjb25maWcuYCxcbiAgICAgICk7XG4gICAgfVxuXG4gICAgLy8gTm9ybWFsaXplIHRoZSBwYXRoIHRocm91Z2ggdGhlIGRldmtpdCB1dGlsaXRpZXMgYmVjYXVzZSB3ZSB3YW50IHRvIGF2b2lkIGhhdmluZ1xuICAgIC8vIHVubmVjZXNzYXJ5IHBhdGggc2VnbWVudHMgYW5kIHdpbmRvd3MgYmFja3NsYXNoIGRlbGltaXRlcnMuXG4gICAgY29uc3QgY3VzdG9tVGhlbWVQYXRoID0gbm9ybWFsaXplKGpvaW4ocHJvamVjdC5zb3VyY2VSb290LCBkZWZhdWx0Q3VzdG9tVGhlbWVGaWxlbmFtZSkpO1xuXG4gICAgaWYgKGhvc3QuZXhpc3RzKGN1c3RvbVRoZW1lUGF0aCkpIHtcbiAgICAgIGxvZ2dlci53YXJuKGBDYW5ub3QgY3JlYXRlIGEgY3VzdG9tIEFuZ3VsYXIgTWF0ZXJpYWwgdGhlbWUgYmVjYXVzZVxuICAgICAgICAgICR7Y3VzdG9tVGhlbWVQYXRofSBhbHJlYWR5IGV4aXN0cy4gU2tpcHBpbmcgY3VzdG9tIHRoZW1lIGdlbmVyYXRpb24uYCk7XG4gICAgICByZXR1cm4gbm9vcCgpO1xuICAgIH1cblxuICAgIGhvc3QuY3JlYXRlKGN1c3RvbVRoZW1lUGF0aCwgdGhlbWVDb250ZW50KTtcbiAgICByZXR1cm4gYWRkVGhlbWVTdHlsZVRvVGFyZ2V0KHByb2plY3ROYW1lLCAnYnVpbGQnLCBjdXN0b21UaGVtZVBhdGgsIGxvZ2dlcik7XG4gIH1cblxuICBjb25zdCBpbnNlcnRpb24gPSBuZXcgSW5zZXJ0Q2hhbmdlKHN0eWxlc1BhdGgsIDAsIHRoZW1lQ29udGVudCk7XG4gIGNvbnN0IHJlY29yZGVyID0gaG9zdC5iZWdpblVwZGF0ZShzdHlsZXNQYXRoKTtcblxuICByZWNvcmRlci5pbnNlcnRMZWZ0KGluc2VydGlvbi5wb3MsIGluc2VydGlvbi50b0FkZCk7XG4gIGhvc3QuY29tbWl0VXBkYXRlKHJlY29yZGVyKTtcbiAgcmV0dXJuIG5vb3AoKTtcbn1cblxuLyoqIEluc2VydCBhIHByZS1idWlsdCB0aGVtZSBpbnRvIHRoZSBhbmd1bGFyLmpzb24gZmlsZS4gKi9cbmZ1bmN0aW9uIGluc2VydFByZWJ1aWx0VGhlbWUocHJvamVjdDogc3RyaW5nLCB0aGVtZTogc3RyaW5nLCBsb2dnZXI6IGxvZ2dpbmcuTG9nZ2VyQXBpKTogUnVsZSB7XG4gIC8vIFBhdGggbmVlZHMgdG8gYmUgYWx3YXlzIHJlbGF0aXZlIHRvIHRoZSBgcGFja2FnZS5qc29uYCBvciB3b3Jrc3BhY2Ugcm9vdC5cbiAgY29uc3QgdGhlbWVQYXRoID0gYC4vbm9kZV9tb2R1bGVzL0Bhbmd1bGFyL21hdGVyaWFsL3ByZWJ1aWx0LXRoZW1lcy8ke3RoZW1lfS5jc3NgO1xuXG4gIHJldHVybiBjaGFpbihbXG4gICAgYWRkVGhlbWVTdHlsZVRvVGFyZ2V0KHByb2plY3QsICdidWlsZCcsIHRoZW1lUGF0aCwgbG9nZ2VyKSxcbiAgICBhZGRUaGVtZVN0eWxlVG9UYXJnZXQocHJvamVjdCwgJ3Rlc3QnLCB0aGVtZVBhdGgsIGxvZ2dlciksXG4gIF0pO1xufVxuXG4vKiogQWRkcyBhIHRoZW1pbmcgc3R5bGUgZW50cnkgdG8gdGhlIGdpdmVuIHByb2plY3QgdGFyZ2V0IG9wdGlvbnMuICovXG5mdW5jdGlvbiBhZGRUaGVtZVN0eWxlVG9UYXJnZXQoXG4gIHByb2plY3ROYW1lOiBzdHJpbmcsXG4gIHRhcmdldE5hbWU6ICd0ZXN0JyB8ICdidWlsZCcsXG4gIGFzc2V0UGF0aDogc3RyaW5nLFxuICBsb2dnZXI6IGxvZ2dpbmcuTG9nZ2VyQXBpLFxuKTogUnVsZSB7XG4gIHJldHVybiB1cGRhdGVXb3Jrc3BhY2Uod29ya3NwYWNlID0+IHtcbiAgICBjb25zdCBwcm9qZWN0ID0gZ2V0UHJvamVjdEZyb21Xb3Jrc3BhY2Uod29ya3NwYWNlLCBwcm9qZWN0TmFtZSk7XG5cbiAgICAvLyBEbyBub3QgdXBkYXRlIHRoZSBidWlsZGVyIG9wdGlvbnMgaW4gY2FzZSB0aGUgdGFyZ2V0IGRvZXMgbm90IHVzZSB0aGUgZGVmYXVsdCBDTEkgYnVpbGRlci5cbiAgICBpZiAoIXZhbGlkYXRlRGVmYXVsdFRhcmdldEJ1aWxkZXIocHJvamVjdCwgdGFyZ2V0TmFtZSwgbG9nZ2VyKSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGNvbnN0IHRhcmdldE9wdGlvbnMgPSBnZXRQcm9qZWN0VGFyZ2V0T3B0aW9ucyhwcm9qZWN0LCB0YXJnZXROYW1lKTtcbiAgICBjb25zdCBzdHlsZXMgPSB0YXJnZXRPcHRpb25zLnN0eWxlcyBhcyAoc3RyaW5nIHwge2lucHV0OiBzdHJpbmd9KVtdO1xuXG4gICAgaWYgKCFzdHlsZXMpIHtcbiAgICAgIHRhcmdldE9wdGlvbnMuc3R5bGVzID0gW2Fzc2V0UGF0aF07XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnN0IGV4aXN0aW5nU3R5bGVzID0gc3R5bGVzLm1hcChzID0+ICh0eXBlb2YgcyA9PT0gJ3N0cmluZycgPyBzIDogcy5pbnB1dCkpO1xuXG4gICAgICBmb3IgKGxldCBbaW5kZXgsIHN0eWxlUGF0aF0gb2YgZXhpc3RpbmdTdHlsZXMuZW50cmllcygpKSB7XG4gICAgICAgIC8vIElmIHRoZSBnaXZlbiBhc3NldCBpcyBhbHJlYWR5IHNwZWNpZmllZCBpbiB0aGUgc3R5bGVzLCB3ZSBkb24ndCBuZWVkIHRvIGRvIGFueXRoaW5nLlxuICAgICAgICBpZiAoc3R5bGVQYXRoID09PSBhc3NldFBhdGgpIHtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICAvLyBJbiBjYXNlIGEgcHJlYnVpbHQgdGhlbWUgaXMgYWxyZWFkeSBzZXQgdXAsIHdlIGNhbiBzYWZlbHkgcmVwbGFjZSB0aGUgdGhlbWUgd2l0aCB0aGUgbmV3XG4gICAgICAgIC8vIHRoZW1lIGZpbGUuIElmIGEgY3VzdG9tIHRoZW1lIGlzIHNldCB1cCwgd2UgYXJlIG5vdCBhYmxlIHRvIHNhZmVseSByZXBsYWNlIHRoZSBjdXN0b21cbiAgICAgICAgLy8gdGhlbWUgYmVjYXVzZSB0aGVzZSBmaWxlcyBjYW4gY29udGFpbiBjdXN0b20gc3R5bGVzLCB3aGlsZSBwcmVidWlsdCB0aGVtZXMgYXJlXG4gICAgICAgIC8vIGFsd2F5cyBwYWNrYWdlZCBhbmQgY29uc2lkZXJlZCByZXBsYWNlYWJsZS5cbiAgICAgICAgaWYgKHN0eWxlUGF0aC5pbmNsdWRlcyhkZWZhdWx0Q3VzdG9tVGhlbWVGaWxlbmFtZSkpIHtcbiAgICAgICAgICBsb2dnZXIuZXJyb3IoXG4gICAgICAgICAgICBgQ291bGQgbm90IGFkZCB0aGUgc2VsZWN0ZWQgdGhlbWUgdG8gdGhlIENMSSBwcm9qZWN0IGAgK1xuICAgICAgICAgICAgICBgY29uZmlndXJhdGlvbiBiZWNhdXNlIHRoZXJlIGlzIGFscmVhZHkgYSBjdXN0b20gdGhlbWUgZmlsZSByZWZlcmVuY2VkLmAsXG4gICAgICAgICAgKTtcbiAgICAgICAgICBsb2dnZXIuaW5mbyhgUGxlYXNlIG1hbnVhbGx5IGFkZCB0aGUgZm9sbG93aW5nIHN0eWxlIGZpbGUgdG8geW91ciBjb25maWd1cmF0aW9uOmApO1xuICAgICAgICAgIGxvZ2dlci5pbmZvKGAgICAgJHthc3NldFBhdGh9YCk7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9IGVsc2UgaWYgKHN0eWxlUGF0aC5pbmNsdWRlcyhwcmVidWlsdFRoZW1lUGF0aFNlZ21lbnQpKSB7XG4gICAgICAgICAgc3R5bGVzLnNwbGljZShpbmRleCwgMSk7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgc3R5bGVzLnVuc2hpZnQoYXNzZXRQYXRoKTtcbiAgICB9XG4gIH0pO1xufVxuXG4vKipcbiAqIFZhbGlkYXRlcyB0aGF0IHRoZSBzcGVjaWZpZWQgcHJvamVjdCB0YXJnZXQgaXMgY29uZmlndXJlZCB3aXRoIHRoZSBkZWZhdWx0IGJ1aWxkZXJzIHdoaWNoIGFyZVxuICogcHJvdmlkZWQgYnkgdGhlIEFuZ3VsYXIgQ0xJLiBJZiB0aGUgY29uZmlndXJlZCBidWlsZGVyIGRvZXMgbm90IG1hdGNoIHRoZSBkZWZhdWx0IGJ1aWxkZXIsXG4gKiB0aGlzIGZ1bmN0aW9uIGNhbiBlaXRoZXIgdGhyb3cgb3IganVzdCBzaG93IGEgd2FybmluZy5cbiAqL1xuZnVuY3Rpb24gdmFsaWRhdGVEZWZhdWx0VGFyZ2V0QnVpbGRlcihcbiAgcHJvamVjdDogUHJvamVjdERlZmluaXRpb24sXG4gIHRhcmdldE5hbWU6ICdidWlsZCcgfCAndGVzdCcsXG4gIGxvZ2dlcjogbG9nZ2luZy5Mb2dnZXJBcGksXG4pIHtcbiAgY29uc3QgZGVmYXVsdEJ1aWxkZXIgPSBkZWZhdWx0VGFyZ2V0QnVpbGRlcnNbdGFyZ2V0TmFtZV07XG4gIGNvbnN0IHRhcmdldENvbmZpZyA9IHByb2plY3QudGFyZ2V0cyAmJiBwcm9qZWN0LnRhcmdldHMuZ2V0KHRhcmdldE5hbWUpO1xuICBjb25zdCBpc0RlZmF1bHRCdWlsZGVyID0gdGFyZ2V0Q29uZmlnICYmIHRhcmdldENvbmZpZ1snYnVpbGRlciddID09PSBkZWZhdWx0QnVpbGRlcjtcblxuICAvLyBCZWNhdXNlIHRoZSBidWlsZCBzZXR1cCBmb3IgdGhlIEFuZ3VsYXIgQ0xJIGNhbiBiZSBjdXN0b21pemVkIGJ5IGRldmVsb3BlcnMsIHdlIGNhbid0IGtub3dcbiAgLy8gd2hlcmUgdG8gcHV0IHRoZSB0aGVtZSBmaWxlIGluIHRoZSB3b3Jrc3BhY2UgY29uZmlndXJhdGlvbiBpZiBjdXN0b20gYnVpbGRlcnMgYXJlIGJlaW5nXG4gIC8vIHVzZWQuIEluIGNhc2UgdGhlIGJ1aWxkZXIgaGFzIGJlZW4gY2hhbmdlZCBmb3IgdGhlIFwiYnVpbGRcIiB0YXJnZXQsIHdlIHRocm93IGFuIGVycm9yIGFuZFxuICAvLyBleGl0IGJlY2F1c2Ugc2V0dGluZyB1cCBhIHRoZW1lIGlzIGEgcHJpbWFyeSBnb2FsIG9mIGBuZy1hZGRgLiBPdGhlcndpc2UgaWYganVzdCB0aGUgXCJ0ZXN0XCJcbiAgLy8gYnVpbGRlciBoYXMgYmVlbiBjaGFuZ2VkLCB3ZSB3YXJuIGJlY2F1c2UgYSB0aGVtZSBpcyBub3QgbWFuZGF0b3J5IGZvciBydW5uaW5nIHRlc3RzXG4gIC8vIHdpdGggTWF0ZXJpYWwuIFNlZTogaHR0cHM6Ly9naXRodWIuY29tL2FuZ3VsYXIvY29tcG9uZW50cy9pc3N1ZXMvMTQxNzZcbiAgaWYgKCFpc0RlZmF1bHRCdWlsZGVyICYmIHRhcmdldE5hbWUgPT09ICdidWlsZCcpIHtcbiAgICB0aHJvdyBuZXcgU2NoZW1hdGljc0V4Y2VwdGlvbihcbiAgICAgIGBZb3VyIHByb2plY3QgaXMgbm90IHVzaW5nIHRoZSBkZWZhdWx0IGJ1aWxkZXJzIGZvciBgICtcbiAgICAgICAgYFwiJHt0YXJnZXROYW1lfVwiLiBUaGUgQW5ndWxhciBNYXRlcmlhbCBzY2hlbWF0aWNzIGNhbm5vdCBhZGQgYSB0aGVtZSB0byB0aGUgd29ya3NwYWNlIGAgK1xuICAgICAgICBgY29uZmlndXJhdGlvbiBpZiB0aGUgYnVpbGRlciBoYXMgYmVlbiBjaGFuZ2VkLmAsXG4gICAgKTtcbiAgfSBlbHNlIGlmICghaXNEZWZhdWx0QnVpbGRlcikge1xuICAgIC8vIGZvciBub24tYnVpbGQgdGFyZ2V0cyB3ZSBncmFjZWZ1bGx5IHJlcG9ydCB0aGUgZXJyb3Igd2l0aG91dCBhY3R1YWxseSBhYm9ydGluZyB0aGVcbiAgICAvLyBzZXR1cCBzY2hlbWF0aWMuIFRoaXMgaXMgYmVjYXVzZSBhIHRoZW1lIGlzIG5vdCBtYW5kYXRvcnkgZm9yIHJ1bm5pbmcgdGVzdHMuXG4gICAgbG9nZ2VyLndhcm4oXG4gICAgICBgWW91ciBwcm9qZWN0IGlzIG5vdCB1c2luZyB0aGUgZGVmYXVsdCBidWlsZGVycyBmb3IgXCIke3RhcmdldE5hbWV9XCIuIFRoaXMgYCArXG4gICAgICAgIGBtZWFucyB0aGF0IHdlIGNhbm5vdCBhZGQgdGhlIGNvbmZpZ3VyZWQgdGhlbWUgdG8gdGhlIFwiJHt0YXJnZXROYW1lfVwiIHRhcmdldC5gLFxuICAgICk7XG4gIH1cblxuICByZXR1cm4gaXNEZWZhdWx0QnVpbGRlcjtcbn1cbiJdfQ==