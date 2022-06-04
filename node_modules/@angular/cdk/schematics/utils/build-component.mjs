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
exports.buildComponent = void 0;
const core_1 = require("@angular-devkit/core");
const schematics_1 = require("@angular-devkit/schematics");
const change_1 = require("@schematics/angular/utility/change");
const workspace_1 = require("@schematics/angular/utility/workspace");
const find_module_1 = require("@schematics/angular/utility/find-module");
const parse_name_1 = require("@schematics/angular/utility/parse-name");
const validation_1 = require("@schematics/angular/utility/validation");
const workspace_models_1 = require("@schematics/angular/utility/workspace-models");
const fs_1 = require("fs");
const path_1 = require("path");
const ts = require("typescript");
const vendored_ast_utils_1 = require("../utils/vendored-ast-utils");
const get_project_1 = require("./get-project");
const schematic_options_1 = require("./schematic-options");
/**
 * Build a default project path for generating.
 * @param project The project to build the path for.
 */
function buildDefaultPath(project) {
    const root = project.sourceRoot ? `/${project.sourceRoot}/` : `/${project.root}/src/`;
    const projectDirName = project.extensions.projectType === workspace_models_1.ProjectType.Application ? 'app' : 'lib';
    return `${root}${projectDirName}`;
}
/**
 * List of style extensions which are CSS compatible. All supported CLI style extensions can be
 * found here: angular/angular-cli/main/packages/schematics/angular/ng-new/schema.json#L118-L122
 */
const supportedCssExtensions = ['css', 'scss', 'less'];
function readIntoSourceFile(host, modulePath) {
    const text = host.read(modulePath);
    if (text === null) {
        throw new schematics_1.SchematicsException(`File ${modulePath} does not exist.`);
    }
    return ts.createSourceFile(modulePath, text.toString('utf-8'), ts.ScriptTarget.Latest, true);
}
function addDeclarationToNgModule(options) {
    return (host) => {
        if (options.skipImport || !options.module) {
            return host;
        }
        const modulePath = options.module;
        let source = readIntoSourceFile(host, modulePath);
        const componentPath = `/${options.path}/` +
            (options.flat ? '' : core_1.strings.dasherize(options.name) + '/') +
            core_1.strings.dasherize(options.name) +
            '.component';
        const relativePath = (0, find_module_1.buildRelativePath)(modulePath, componentPath);
        const classifiedName = core_1.strings.classify(`${options.name}Component`);
        const declarationChanges = (0, vendored_ast_utils_1.addDeclarationToModule)(source, modulePath, classifiedName, relativePath);
        const declarationRecorder = host.beginUpdate(modulePath);
        for (const change of declarationChanges) {
            if (change instanceof change_1.InsertChange) {
                declarationRecorder.insertLeft(change.pos, change.toAdd);
            }
        }
        host.commitUpdate(declarationRecorder);
        if (options.export) {
            // Need to refresh the AST because we overwrote the file in the host.
            source = readIntoSourceFile(host, modulePath);
            const exportRecorder = host.beginUpdate(modulePath);
            const exportChanges = (0, vendored_ast_utils_1.addExportToModule)(source, modulePath, core_1.strings.classify(`${options.name}Component`), relativePath);
            for (const change of exportChanges) {
                if (change instanceof change_1.InsertChange) {
                    exportRecorder.insertLeft(change.pos, change.toAdd);
                }
            }
            host.commitUpdate(exportRecorder);
        }
        return host;
    };
}
function buildSelector(options, projectPrefix) {
    let selector = core_1.strings.dasherize(options.name);
    if (options.prefix) {
        selector = `${options.prefix}-${selector}`;
    }
    else if (options.prefix === undefined && projectPrefix) {
        selector = `${projectPrefix}-${selector}`;
    }
    return selector;
}
/**
 * Indents the text content with the amount of specified spaces. The spaces will be added after
 * every line-break. This utility function can be used inside of EJS templates to properly
 * include the additional files.
 */
function indentTextContent(text, numSpaces) {
    // In the Material project there should be only LF line-endings, but the schematic files
    // are not being linted and therefore there can be also CRLF or just CR line-endings.
    return text.replace(/(\r\n|\r|\n)/g, `$1${' '.repeat(numSpaces)}`);
}
/**
 * Rule that copies and interpolates the files that belong to this schematic context. Additionally
 * a list of file paths can be passed to this rule in order to expose them inside the EJS
 * template context.
 *
 * This allows inlining the external template or stylesheet files in EJS without having
 * to manually duplicate the file content.
 */
function buildComponent(options, additionalFiles = {}) {
    return (host, ctx) => __awaiter(this, void 0, void 0, function* () {
        const context = ctx;
        const workspace = yield (0, workspace_1.getWorkspace)(host);
        const project = (0, get_project_1.getProjectFromWorkspace)(workspace, options.project);
        const defaultComponentOptions = (0, schematic_options_1.getDefaultComponentOptions)(project);
        // TODO(devversion): Remove if we drop support for older CLI versions.
        // This handles an unreported breaking change from the @angular-devkit/schematics. Previously
        // the description path resolved to the factory file, but starting from 6.2.0, it resolves
        // to the factory directory.
        const schematicPath = (0, fs_1.statSync)(context.schematic.description.path).isDirectory()
            ? context.schematic.description.path
            : (0, path_1.dirname)(context.schematic.description.path);
        const schematicFilesUrl = './files';
        const schematicFilesPath = (0, path_1.resolve)(schematicPath, schematicFilesUrl);
        // Add the default component option values to the options if an option is not explicitly
        // specified but a default component option is available.
        Object.keys(options)
            .filter(key => options[key] == null &&
            defaultComponentOptions[key])
            .forEach(key => (options[key] = defaultComponentOptions[key]));
        if (options.path === undefined) {
            // TODO(jelbourn): figure out if the need for this `as any` is a bug due to two different
            // incompatible `ProjectDefinition` classes in @angular-devkit
            options.path = buildDefaultPath(project);
        }
        options.module = (0, find_module_1.findModuleFromOptions)(host, options);
        const parsedPath = (0, parse_name_1.parseName)(options.path, options.name);
        options.name = parsedPath.name;
        options.path = parsedPath.path;
        options.selector = options.selector || buildSelector(options, project.prefix);
        (0, validation_1.validateHtmlSelector)(options.selector);
        // In case the specified style extension is not part of the supported CSS supersets,
        // we generate the stylesheets with the "css" extension. This ensures that we don't
        // accidentally generate invalid stylesheets (e.g. drag-drop-comp.styl) which will
        // break the Angular CLI project. See: https://github.com/angular/components/issues/15164
        if (!supportedCssExtensions.includes(options.style)) {
            // TODO: Cast is necessary as we can't use the Style enum which has been introduced
            // within CLI v7.3.0-rc.0. This would break the schematic for older CLI versions.
            options.style = 'css';
        }
        // Object that will be used as context for the EJS templates.
        const baseTemplateContext = Object.assign(Object.assign(Object.assign({}, core_1.strings), { 'if-flat': (s) => (options.flat ? '' : s) }), options);
        // Key-value object that includes the specified additional files with their loaded content.
        // The resolved contents can be used inside EJS templates.
        const resolvedFiles = {};
        for (let key in additionalFiles) {
            if (additionalFiles[key]) {
                const fileContent = (0, fs_1.readFileSync)((0, path_1.join)(schematicFilesPath, additionalFiles[key]), 'utf-8');
                // Interpolate the additional files with the base EJS template context.
                resolvedFiles[key] = (0, core_1.template)(fileContent)(baseTemplateContext);
            }
        }
        const templateSource = (0, schematics_1.apply)((0, schematics_1.url)(schematicFilesUrl), [
            options.skipTests ? (0, schematics_1.filter)(path => !path.endsWith('.spec.ts.template')) : (0, schematics_1.noop)(),
            options.inlineStyle ? (0, schematics_1.filter)(path => !path.endsWith('.__style__.template')) : (0, schematics_1.noop)(),
            options.inlineTemplate ? (0, schematics_1.filter)(path => !path.endsWith('.html.template')) : (0, schematics_1.noop)(),
            // Treat the template options as any, because the type definition for the template options
            // is made unnecessarily explicit. Every type of object can be used in the EJS template.
            (0, schematics_1.applyTemplates)(Object.assign({ indentTextContent, resolvedFiles }, baseTemplateContext)),
            // TODO(devversion): figure out why we cannot just remove the first parameter
            // See for example: angular-cli#schematics/angular/component/index.ts#L160
            (0, schematics_1.move)(null, parsedPath.path),
        ]);
        return () => (0, schematics_1.chain)([
            (0, schematics_1.branchAndMerge)((0, schematics_1.chain)([addDeclarationToNgModule(options), (0, schematics_1.mergeWith)(templateSource)])),
        ])(host, context);
    });
}
exports.buildComponent = buildComponent;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnVpbGQtY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vc3JjL2Nkay9zY2hlbWF0aWNzL3V0aWxzL2J1aWxkLWNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7OztHQU1HOzs7Ozs7Ozs7Ozs7QUFFSCwrQ0FBOEU7QUFDOUUsMkRBYW9DO0FBR3BDLCtEQUFnRTtBQUNoRSxxRUFBbUU7QUFDbkUseUVBQWlHO0FBQ2pHLHVFQUFpRTtBQUNqRSx1RUFBNEU7QUFDNUUsbUZBQXlFO0FBQ3pFLDJCQUEwQztBQUMxQywrQkFBNEM7QUFDNUMsaUNBQWlDO0FBQ2pDLG9FQUFzRjtBQUN0RiwrQ0FBc0Q7QUFDdEQsMkRBQStEO0FBRy9EOzs7R0FHRztBQUNILFNBQVMsZ0JBQWdCLENBQUMsT0FBMEI7SUFDbEQsTUFBTSxJQUFJLEdBQUcsT0FBTyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsSUFBSSxPQUFPLENBQUMsVUFBVSxHQUFHLENBQUMsQ0FBQyxDQUFDLElBQUksT0FBTyxDQUFDLElBQUksT0FBTyxDQUFDO0lBRXRGLE1BQU0sY0FBYyxHQUFHLE9BQU8sQ0FBQyxVQUFVLENBQUMsV0FBVyxLQUFLLDhCQUFXLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQztJQUVsRyxPQUFPLEdBQUcsSUFBSSxHQUFHLGNBQWMsRUFBRSxDQUFDO0FBQ3BDLENBQUM7QUFFRDs7O0dBR0c7QUFDSCxNQUFNLHNCQUFzQixHQUFHLENBQUMsS0FBSyxFQUFFLE1BQU0sRUFBRSxNQUFNLENBQUMsQ0FBQztBQUV2RCxTQUFTLGtCQUFrQixDQUFDLElBQVUsRUFBRSxVQUFrQjtJQUN4RCxNQUFNLElBQUksR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDO0lBQ25DLElBQUksSUFBSSxLQUFLLElBQUksRUFBRTtRQUNqQixN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QUMsQ0FBQyxDQUFDLENBQUMsSUFBQSxpQkFBSSxHQUFFO1lBQ2hGLE9BQU8sQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLElBQUEsbUJBQU0sRUFBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxxQkFBcUIsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUEsaUJBQUksR0FBRTtZQUNwRixPQUFPLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQyxJQUFBLG1CQUFNLEVBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsZ0JBQWdCLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFBLGlCQUFJLEdBQUU7WUFDbEYsMEZBQTBGO1lBQzFGLHdGQUF3RjtZQUN4RixJQUFBLDJCQUFjLEVBQUMsZ0JBQUMsaUJBQWlCLEVBQUUsYUFBYSxJQUFLLG1CQUFtQixDQUFRLENBQUM7WUFDakYsNkVBQTZFO1lBQzdFLDBFQUEwRTtZQUMxRSxJQUFBLGlCQUFJLEVBQUMsSUFBVyxFQUFFLFVBQVUsQ0FBQyxJQUFJLENBQUM7U0FDbkMsQ0FBQyxDQUFDO1FBRUgsT0FBTyxHQUFHLEVBQUUsQ0FDVixJQUFBLGtCQUFLLEVBQUM7WUFDSixJQUFBLDJCQUFjLEVBQUMsSUFBQSxrQkFBSyxFQUFDLENBQUMsd0JBQXdCLENBQUMsT0FBTyxDQUFDLEVBQUUsSUFBQSxzQkFBUyxFQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUMsQ0FBQztTQUN0RixDQUFDLENBQUMsSUFBSSxFQUFFLE9BQU8sQ0FBQyxDQUFDO0lBQ3RCLENBQUMsQ0FBQSxDQUFDO0FBQ0osQ0FBQztBQW5HRCx3Q0FtR0MiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtzdHJpbmdzLCB0ZW1wbGF0ZSBhcyBpbnRlcnBvbGF0ZVRlbXBsYXRlfSBmcm9tICdAYW5ndWxhci1kZXZraXQvY29yZSc7XG5pbXBvcnQge1xuICBhcHBseSxcbiAgYXBwbHlUZW1wbGF0ZXMsXG4gIGJyYW5jaEFuZE1lcmdlLFxuICBjaGFpbixcbiAgZmlsdGVyLFxuICBtZXJnZVdpdGgsXG4gIG1vdmUsXG4gIG5vb3AsXG4gIFJ1bGUsXG4gIFNjaGVtYXRpY3NFeGNlcHRpb24sXG4gIFRyZWUsXG4gIHVybCxcbn0gZnJvbSAnQGFuZ3VsYXItZGV2a2l0L3NjaGVtYXRpY3MnO1xuaW1wb3J0IHtGaWxlU3lzdGVtU2NoZW1hdGljQ29udGV4dH0gZnJvbSAnQGFuZ3VsYXItZGV2a2l0L3NjaGVtYXRpY3MvdG9vbHMnO1xuaW1wb3J0IHtTY2hlbWEgYXMgQ29tcG9uZW50T3B0aW9ucywgU3R5bGV9IGZyb20gJ0BzY2hlbWF0aWNzL2FuZ3VsYXIvY29tcG9uZW50L3NjaGVtYSc7XG5pbXBvcnQge0luc2VydENoYW5nZX0gZnJvbSAnQHNjaGVtYXRpY3MvYW5ndWxhci91dGlsaXR5L2NoYW5nZSc7XG5pbXBvcnQge2dldFdvcmtzcGFjZX0gZnJvbSAnQHNjaGVtYXRpY3MvYW5ndWxhci91dGlsaXR5L3dvcmtzcGFjZSc7XG5pbXBvcnQge2J1aWxkUmVsYXRpdmVQYXRoLCBmaW5kTW9kdWxlRnJvbU9wdGlvbnN9IGZyb20gJ0BzY2hlbWF0aWNzL2FuZ3VsYXIvdXRpbGl0eS9maW5kLW1vZHVsZSc7XG5pbXBvcnQge3BhcnNlTmFtZX0gZnJvbSAnQHNjaGVtYXRpY3MvYW5ndWxhci91dGlsaXR5L3BhcnNlLW5hbWUnO1xuaW1wb3J0IHt2YWxpZGF0ZUh0bWxTZWxlY3Rvcn0gZnJvbSAnQHNjaGVtYXRpY3MvYW5ndWxhci91dGlsaXR5L3ZhbGlkYXRpb24nO1xuaW1wb3J0IHtQcm9qZWN0VHlwZX0gZnJvbSAnQHNjaGVtYXRpY3MvYW5ndWxhci91dGlsaXR5L3dvcmtzcGFjZS1tb2RlbHMnO1xuaW1wb3J0IHtyZWFkRmlsZVN5bmMsIHN0YXRTeW5jfSBmcm9tICdmcyc7XG5pbXBvcnQge2Rpcm5hbWUsIGpvaW4sIHJlc29sdmV9IGZyb20gJ3BhdGgnO1xuaW1wb3J0ICogYXMgdHMgZnJvbSAndHlwZXNjcmlwdCc7XG5pbXBvcnQge2FkZERlY2xhcmF0aW9uVG9Nb2R1bGUsIGFkZEV4cG9ydFRvTW9kdWxlfSBmcm9tICcuLi91dGlscy92ZW5kb3JlZC1hc3QtdXRpbHMnO1xuaW1wb3J0IHtnZXRQcm9qZWN0RnJvbVdvcmtzcGFjZX0gZnJvbSAnLi9nZXQtcHJvamVjdCc7XG5pbXBvcnQge2dldERlZmF1bHRDb21wb25lbnRPcHRpb25zfSBmcm9tICcuL3NjaGVtYXRpYy1vcHRpb25zJztcbmltcG9ydCB7UHJvamVjdERlZmluaXRpb259IGZyb20gJ0Bhbmd1bGFyLWRldmtpdC9jb3JlL3NyYy93b3Jrc3BhY2UnO1xuXG4vKipcbiAqIEJ1aWxkIGEgZGVmYXVsdCBwcm9qZWN0IHBhdGggZm9yIGdlbmVyYXRpbmcuXG4gKiBAcGFyYW0gcHJvamVjdCBUaGUgcHJvamVjdCB0byBidWlsZCB0aGUgcGF0aCBmb3IuXG4gKi9cbmZ1bmN0aW9uIGJ1aWxkRGVmYXVsdFBhdGgocHJvamVjdDogUHJvamVjdERlZmluaXRpb24pOiBzdHJpbmcge1xuICBjb25zdCByb290ID0gcHJvamVjdC5zb3VyY2VSb290ID8gYC8ke3Byb2plY3Quc291cmNlUm9vdH0vYCA6IGAvJHtwcm9qZWN0LnJvb3R9L3NyYy9gO1xuXG4gIGNvbnN0IHByb2plY3REaXJOYW1lID0gcHJvamVjdC5leHRlbnNpb25zLnByb2plY3RUeXBlID09PSBQcm9qZWN0VHlwZS5BcHBsaWNhdGlvbiA/ICdhcHAnIDogJ2xpYic7XG5cbiAgcmV0dXJuIGAke3Jvb3R9JHtwcm9qZWN0RGlyTmFtZX1gO1xufVxuXG4vKipcbiAqIExpc3Qgb2Ygc3R5bGUgZXh0ZW5zaW9ucyB3aGljaCBhcmUgQ1NTIGNvbXBhdGlibGUuIEFsbCBzdXBwb3J0ZWQgQ0xJIHN0eWxlIGV4dGVuc2lvbnMgY2FuIGJlXG4gKiBmb3VuZCBoZXJlOiBhbmd1bGFyL2FuZ3VsYXItY2xpL21haW4vcGFja2FnZXMvc2NoZW1hdGljcy9hbmd1bGFyL25nLW5ldy9zY2hlbWEuanNvbiNMMTE4LUwxMjJcbiAqL1xuY29uc3Qgc3VwcG9ydGVkQ3NzRXh0ZW5zaW9ucyA9IFsnY3NzJywgJ3Njc3MnLCAnbGVzcyddO1xuXG5mdW5jdGlvbiByZWFkSW50b1NvdXJjZUZpbGUoaG9zdDogVHJlZSwgbW9kdWxlUGF0aDogc3RyaW5nKSB7XG4gIGNvbnN0IHRleHQgPSBob3N0LnJlYWQobW9kdWxlUGF0aCk7XG4gIGlmICh0ZXh0ID09PSBudWxsKSB7XG4gICAgdGhyb3cgbmV3IFNjaGVtYXRpY3NFeGNlcHRpb24oYEZpbGUgJHttb2R1bGVQYXRofSBkb2VzIG5vdCBleGlzdC5gKTtcbiAgfVxuXG4gIHJldHVybiB0cy5jcmVhdGVTb3VyY2VGaWxlKG1vZHVsZVBhdGgsIHRleHQudG9TdHJpbmcoJ3V0Zi04JyksIHRzLlNjcmlwdFRhcmdldC5MYXRlc3QsIHRydWUpO1xufVxuXG5mdW5jdGlvbiBhZGREZWNsYXJhdGlvblRvTmdNb2R1bGUob3B0aW9uczogQ29tcG9uZW50T3B0aW9ucyk6IFJ1bGUge1xuICByZXR1cm4gKGhvc3Q6IFRyZWUpID0+IHtcbiAgICBpZiAob3B0aW9ucy5za2lwSW1wb3J0IHx8ICFvcHRpb25zLm1vZHVsZSkge1xuICAgICAgcmV0dXJuIGhvc3Q7XG4gICAgfVxuXG4gICAgY29uc3QgbW9kdWxlUGF0aCA9IG9wdGlvbnMubW9kdWxlO1xuICAgIGxldCBzb3VyY2UgPSByZWFkSW50b1NvdXJjZUZpbGUoaG9zdCwgbW9kdWxlUGF0aCk7XG5cbiAgICBjb25zdCBjb21wb25lbnRQYXRoID1cbiAgICAgIGAvJHtvcHRpb25zLnBhdGh9L2AgK1xuICAgICAgKG9wdGlvbnMuZmxhdCA/ICcnIDogc3RyaW5ncy5kYXNoZXJpemUob3B0aW9ucy5uYW1lKSArICcvJykgK1xuICAgICAgc3RyaW5ncy5kYXNoZXJpemUob3B0aW9ucy5uYW1lKSArXG4gICAgICAnLmNvbXBvbmVudCc7XG4gICAgY29uc3QgcmVsYXRpdmVQYXRoID0gYnVpbGRSZWxhdGl2ZVBhdGgobW9kdWxlUGF0aCwgY29tcG9uZW50UGF0aCk7XG4gICAgY29uc3QgY2xhc3NpZmllZE5hbWUgPSBzdHJpbmdzLmNsYXNzaWZ5KGAke29wdGlvbnMubmFtZX1Db21wb25lbnRgKTtcblxuICAgIGNvbnN0IGRlY2xhcmF0aW9uQ2hhbmdlcyA9IGFkZERlY2xhcmF0aW9uVG9Nb2R1bGUoXG4gICAgICBzb3VyY2UsXG4gICAgICBtb2R1bGVQYXRoLFxuICAgICAgY2xhc3NpZmllZE5hbWUsXG4gICAgICByZWxhdGl2ZVBhdGgsXG4gICAgKTtcblxuICAgIGNvbnN0IGRlY2xhcmF0aW9uUmVjb3JkZXIgPSBob3N0LmJlZ2luVXBkYXRlKG1vZHVsZVBhdGgpO1xuICAgIGZvciAoY29uc3QgY2hhbmdlIG9mIGRlY2xhcmF0aW9uQ2hhbmdlcykge1xuICAgICAgaWYgKGNoYW5nZSBpbnN0YW5jZW9mIEluc2VydENoYW5nZSkge1xuICAgICAgICBkZWNsYXJhdGlvblJlY29yZGVyLmluc2VydExlZnQoY2hhbmdlLnBvcywgY2hhbmdlLnRvQWRkKTtcbiAgICAgIH1cbiAgICB9XG4gICAgaG9zdC5jb21taXRVcGRhdGUoZGVjbGFyYXRpb25SZWNvcmRlcik7XG5cbiAgICBpZiAob3B0aW9ucy5leHBvcnQpIHtcbiAgICAgIC8vIE5lZWQgdG8gcmVmcmVzaCB0aGUgQVNUIGJlY2F1c2Ugd2Ugb3Zlcndyb3RlIHRoZSBmaWxlIGluIHRoZSBob3N0LlxuICAgICAgc291cmNlID0gcmVhZEludG9Tb3VyY2VGaWxlKGhvc3QsIG1vZHVsZVBhdGgpO1xuXG4gICAgICBjb25zdCBleHBvcnRSZWNvcmRlciA9IGhvc3QuYmVnaW5VcGRhdGUobW9kdWxlUGF0aCk7XG4gICAgICBjb25zdCBleHBvcnRDaGFuZ2VzID0gYWRkRXhwb3J0VG9Nb2R1bGUoXG4gICAgICAgIHNvdXJjZSxcbiAgICAgICAgbW9kdWxlUGF0aCxcbiAgICAgICAgc3RyaW5ncy5jbGFzc2lmeShgJHtvcHRpb25zLm5hbWV9Q29tcG9uZW50YCksXG4gICAgICAgIHJlbGF0aXZlUGF0aCxcbiAgICAgICk7XG5cbiAgICAgIGZvciAoY29uc3QgY2hhbmdlIG9mIGV4cG9ydENoYW5nZXMpIHtcbiAgICAgICAgaWYgKGNoYW5nZSBpbnN0YW5jZW9mIEluc2VydENoYW5nZSkge1xuICAgICAgICAgIGV4cG9ydFJlY29yZGVyLmluc2VydExlZnQoY2hhbmdlLnBvcywgY2hhbmdlLnRvQWRkKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgaG9zdC5jb21taXRVcGRhdGUoZXhwb3J0UmVjb3JkZXIpO1xuICAgIH1cblxuICAgIHJldHVybiBob3N0O1xuICB9O1xufVxuXG5mdW5jdGlvbiBidWlsZFNlbGVjdG9yKG9wdGlvbnM6IENvbXBvbmVudE9wdGlvbnMsIHByb2plY3RQcmVmaXg/OiBzdHJpbmcpIHtcbiAgbGV0IHNlbGVjdG9yID0gc3RyaW5ncy5kYXNoZXJpemUob3B0aW9ucy5uYW1lKTtcbiAgaWYgKG9wdGlvbnMucHJlZml4KSB7XG4gICAgc2VsZWN0b3IgPSBgJHtvcHRpb25zLnByZWZpeH0tJHtzZWxlY3Rvcn1gO1xuICB9IGVsc2UgaWYgKG9wdGlvbnMucHJlZml4ID09PSB1bmRlZmluZWQgJiYgcHJvamVjdFByZWZpeCkge1xuICAgIHNlbGVjdG9yID0gYCR7cHJvamVjdFByZWZpeH0tJHtzZWxlY3Rvcn1gO1xuICB9XG5cbiAgcmV0dXJuIHNlbGVjdG9yO1xufVxuXG4vKipcbiAqIEluZGVudHMgdGhlIHRleHQgY29udGVudCB3aXRoIHRoZSBhbW91bnQgb2Ygc3BlY2lmaWVkIHNwYWNlcy4gVGhlIHNwYWNlcyB3aWxsIGJlIGFkZGVkIGFmdGVyXG4gKiBldmVyeSBsaW5lLWJyZWFrLiBUaGlzIHV0aWxpdHkgZnVuY3Rpb24gY2FuIGJlIHVzZWQgaW5zaWRlIG9mIEVKUyB0ZW1wbGF0ZXMgdG8gcHJvcGVybHlcbiAqIGluY2x1ZGUgdGhlIGFkZGl0aW9uYWwgZmlsZXMuXG4gKi9cbmZ1bmN0aW9uIGluZGVudFRleHRDb250ZW50KHRleHQ6IHN0cmluZywgbnVtU3BhY2VzOiBudW1iZXIpOiBzdHJpbmcge1xuICAvLyBJbiB0aGUgTWF0ZXJpYWwgcHJvamVjdCB0aGVyZSBzaG91bGQgYmUgb25seSBMRiBsaW5lLWVuZGluZ3MsIGJ1dCB0aGUgc2NoZW1hdGljIGZpbGVzXG4gIC8vIGFyZSBub3QgYmVpbmcgbGludGVkIGFuZCB0aGVyZWZvcmUgdGhlcmUgY2FuIGJlIGFsc28gQ1JMRiBvciBqdXN0IENSIGxpbmUtZW5kaW5ncy5cbiAgcmV0dXJuIHRleHQucmVwbGFjZSgvKFxcclxcbnxcXHJ8XFxuKS9nLCBgJDEkeycgJy5yZXBlYXQobnVtU3BhY2VzKX1gKTtcbn1cblxuLyoqXG4gKiBSdWxlIHRoYXQgY29waWVzIGFuZCBpbnRlcnBvbGF0ZXMgdGhlIGZpbGVzIHRoYXQgYmVsb25nIHRvIHRoaXMgc2NoZW1hdGljIGNvbnRleHQuIEFkZGl0aW9uYWxseVxuICogYSBsaXN0IG9mIGZpbGUgcGF0aHMgY2FuIGJlIHBhc3NlZCB0byB0aGlzIHJ1bGUgaW4gb3JkZXIgdG8gZXhwb3NlIHRoZW0gaW5zaWRlIHRoZSBFSlNcbiAqIHRlbXBsYXRlIGNvbnRleHQuXG4gKlxuICogVGhpcyBhbGxvd3MgaW5saW5pbmcgdGhlIGV4dGVybmFsIHRlbXBsYXRlIG9yIHN0eWxlc2hlZXQgZmlsZXMgaW4gRUpTIHdpdGhvdXQgaGF2aW5nXG4gKiB0byBtYW51YWxseSBkdXBsaWNhdGUgdGhlIGZpbGUgY29udGVudC5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGJ1aWxkQ29tcG9uZW50KFxuICBvcHRpb25zOiBDb21wb25lbnRPcHRpb25zLFxuICBhZGRpdGlvbmFsRmlsZXM6IHtba2V5OiBzdHJpbmddOiBzdHJpbmd9ID0ge30sXG4pOiBSdWxlIHtcbiAgcmV0dXJuIGFzeW5jIChob3N0LCBjdHgpID0+IHtcbiAgICBjb25zdCBjb250ZXh0ID0gY3R4IGFzIEZpbGVTeXN0ZW1TY2hlbWF0aWNDb250ZXh0O1xuICAgIGNvbnN0IHdvcmtzcGFjZSA9IGF3YWl0IGdldFdvcmtzcGFjZShob3N0KTtcbiAgICBjb25zdCBwcm9qZWN0ID0gZ2V0UHJvamVjdEZyb21Xb3Jrc3BhY2Uod29ya3NwYWNlLCBvcHRpb25zLnByb2plY3QpO1xuICAgIGNvbnN0IGRlZmF1bHRDb21wb25lbnRPcHRpb25zID0gZ2V0RGVmYXVsdENvbXBvbmVudE9wdGlvbnMocHJvamVjdCk7XG5cbiAgICAvLyBUT0RPKGRldnZlcnNpb24pOiBSZW1vdmUgaWYgd2UgZHJvcCBzdXBwb3J0IGZvciBvbGRlciBDTEkgdmVyc2lvbnMuXG4gICAgLy8gVGhpcyBoYW5kbGVzIGFuIHVucmVwb3J0ZWQgYnJlYWtpbmcgY2hhbmdlIGZyb20gdGhlIEBhbmd1bGFyLWRldmtpdC9zY2hlbWF0aWNzLiBQcmV2aW91c2x5XG4gICAgLy8gdGhlIGRlc2NyaXB0aW9uIHBhdGggcmVzb2x2ZWQgdG8gdGhlIGZhY3RvcnkgZmlsZSwgYnV0IHN0YXJ0aW5nIGZyb20gNi4yLjAsIGl0IHJlc29sdmVzXG4gICAgLy8gdG8gdGhlIGZhY3RvcnkgZGlyZWN0b3J5LlxuICAgIGNvbnN0IHNjaGVtYXRpY1BhdGggPSBzdGF0U3luYyhjb250ZXh0LnNjaGVtYXRpYy5kZXNjcmlwdGlvbi5wYXRoKS5pc0RpcmVjdG9yeSgpXG4gICAgICA/IGNvbnRleHQuc2NoZW1hdGljLmRlc2NyaXB0aW9uLnBhdGhcbiAgICAgIDogZGlybmFtZShjb250ZXh0LnNjaGVtYXRpYy5kZXNjcmlwdGlvbi5wYXRoKTtcblxuICAgIGNvbnN0IHNjaGVtYXRpY0ZpbGVzVXJsID0gJy4vZmlsZXMnO1xuICAgIGNvbnN0IHNjaGVtYXRpY0ZpbGVzUGF0aCA9IHJlc29sdmUoc2NoZW1hdGljUGF0aCwgc2NoZW1hdGljRmlsZXNVcmwpO1xuXG4gICAgLy8gQWRkIHRoZSBkZWZhdWx0IGNvbXBvbmVudCBvcHRpb24gdmFsdWVzIHRvIHRoZSBvcHRpb25zIGlmIGFuIG9wdGlvbiBpcyBub3QgZXhwbGljaXRseVxuICAgIC8vIHNwZWNpZmllZCBidXQgYSBkZWZhdWx0IGNvbXBvbmVudCBvcHRpb24gaXMgYXZhaWxhYmxlLlxuICAgIE9iamVjdC5rZXlzKG9wdGlvbnMpXG4gICAgICAuZmlsdGVyKFxuICAgICAgICBrZXkgPT5cbiAgICAgICAgICBvcHRpb25zW2tleSBhcyBrZXlvZiBDb21wb25lbnRPcHRpb25zXSA9PSBudWxsICYmXG4gICAgICAgICAgZGVmYXVsdENvbXBvbmVudE9wdGlvbnNba2V5IGFzIGtleW9mIENvbXBvbmVudE9wdGlvbnNdLFxuICAgICAgKVxuICAgICAgLmZvckVhY2goXG4gICAgICAgIGtleSA9PlxuICAgICAgICAgICgob3B0aW9ucyBhcyBhbnkpW2tleV0gPSAoZGVmYXVsdENvbXBvbmVudE9wdGlvbnMgYXMgQ29tcG9uZW50T3B0aW9ucylbXG4gICAgICAgICAgICBrZXkgYXMga2V5b2YgQ29tcG9uZW50T3B0aW9uc1xuICAgICAgICAgIF0pLFxuICAgICAgKTtcblxuICAgIGlmIChvcHRpb25zLnBhdGggPT09IHVuZGVmaW5lZCkge1xuICAgICAgLy8gVE9ETyhqZWxib3Vybik6IGZpZ3VyZSBvdXQgaWYgdGhlIG5lZWQgZm9yIHRoaXMgYGFzIGFueWAgaXMgYSBidWcgZHVlIHRvIHR3byBkaWZmZXJlbnRcbiAgICAgIC8vIGluY29tcGF0aWJsZSBgUHJvamVjdERlZmluaXRpb25gIGNsYXNzZXMgaW4gQGFuZ3VsYXItZGV2a2l0XG4gICAgICBvcHRpb25zLnBhdGggPSBidWlsZERlZmF1bHRQYXRoKHByb2plY3QgYXMgYW55KTtcbiAgICB9XG5cbiAgICBvcHRpb25zLm1vZHVsZSA9IGZpbmRNb2R1bGVGcm9tT3B0aW9ucyhob3N0LCBvcHRpb25zKTtcblxuICAgIGNvbnN0IHBhcnNlZFBhdGggPSBwYXJzZU5hbWUob3B0aW9ucy5wYXRoISwgb3B0aW9ucy5uYW1lKTtcblxuICAgIG9wdGlvbnMubmFtZSA9IHBhcnNlZFBhdGgubmFtZTtcbiAgICBvcHRpb25zLnBhdGggPSBwYXJzZWRQYXRoLnBhdGg7XG4gICAgb3B0aW9ucy5zZWxlY3RvciA9IG9wdGlvbnMuc2VsZWN0b3IgfHwgYnVpbGRTZWxlY3RvcihvcHRpb25zLCBwcm9qZWN0LnByZWZpeCk7XG5cbiAgICB2YWxpZGF0ZUh0bWxTZWxlY3RvcihvcHRpb25zLnNlbGVjdG9yISk7XG5cbiAgICAvLyBJbiBjYXNlIHRoZSBzcGVjaWZpZWQgc3R5bGUgZXh0ZW5zaW9uIGlzIG5vdCBwYXJ0IG9mIHRoZSBzdXBwb3J0ZWQgQ1NTIHN1cGVyc2V0cyxcbiAgICAvLyB3ZSBnZW5lcmF0ZSB0aGUgc3R5bGVzaGVldHMgd2l0aCB0aGUgXCJjc3NcIiBleHRlbnNpb24uIFRoaXMgZW5zdXJlcyB0aGF0IHdlIGRvbid0XG4gICAgLy8gYWNjaWRlbnRhbGx5IGdlbmVyYXRlIGludmFsaWQgc3R5bGVzaGVldHMgKGUuZy4gZHJhZy1kcm9wLWNvbXAuc3R5bCkgd2hpY2ggd2lsbFxuICAgIC8vIGJyZWFrIHRoZSBBbmd1bGFyIENMSSBwcm9qZWN0LiBTZWU6IGh0dHBzOi8vZ2l0aHViLmNvbS9hbmd1bGFyL2NvbXBvbmVudHMvaXNzdWVzLzE1MTY0XG4gICAgaWYgKCFzdXBwb3J0ZWRDc3NFeHRlbnNpb25zLmluY2x1ZGVzKG9wdGlvbnMuc3R5bGUhKSkge1xuICAgICAgLy8gVE9ETzogQ2FzdCBpcyBuZWNlc3NhcnkgYXMgd2UgY2FuJ3QgdXNlIHRoZSBTdHlsZSBlbnVtIHdoaWNoIGhhcyBiZWVuIGludHJvZHVjZWRcbiAgICAgIC8vIHdpdGhpbiBDTEkgdjcuMy4wLXJjLjAuIFRoaXMgd291bGQgYnJlYWsgdGhlIHNjaGVtYXRpYyBmb3Igb2xkZXIgQ0xJIHZlcnNpb25zLlxuICAgICAgb3B0aW9ucy5zdHlsZSA9ICdjc3MnIGFzIFN0eWxlO1xuICAgIH1cblxuICAgIC8vIE9iamVjdCB0aGF0IHdpbGwgYmUgdXNlZCBhcyBjb250ZXh0IGZvciB0aGUgRUpTIHRlbXBsYXRlcy5cbiAgICBjb25zdCBiYXNlVGVtcGxhdGVDb250ZXh0ID0ge1xuICAgICAgLi4uc3RyaW5ncyxcbiAgICAgICdpZi1mbGF0JzogKHM6IHN0cmluZykgPT4gKG9wdGlvbnMuZmxhdCA/ICcnIDogcyksXG4gICAgICAuLi5vcHRpb25zLFxuICAgIH07XG5cbiAgICAvLyBLZXktdmFsdWUgb2JqZWN0IHRoYXQgaW5jbHVkZXMgdGhlIHNwZWNpZmllZCBhZGRpdGlvbmFsIGZpbGVzIHdpdGggdGhlaXIgbG9hZGVkIGNvbnRlbnQuXG4gICAgLy8gVGhlIHJlc29sdmVkIGNvbnRlbnRzIGNhbiBiZSB1c2VkIGluc2lkZSBFSlMgdGVtcGxhdGVzLlxuICAgIGNvbnN0IHJlc29sdmVkRmlsZXM6IFJlY29yZDxzdHJpbmcsIHN0cmluZz4gPSB7fTtcblxuICAgIGZvciAobGV0IGtleSBpbiBhZGRpdGlvbmFsRmlsZXMpIHtcbiAgICAgIGlmIChhZGRpdGlvbmFsRmlsZXNba2V5XSkge1xuICAgICAgICBjb25zdCBmaWxlQ29udGVudCA9IHJlYWRGaWxlU3luYyhqb2luKHNjaGVtYXRpY0ZpbGVzUGF0aCwgYWRkaXRpb25hbEZpbGVzW2tleV0pLCAndXRmLTgnKTtcblxuICAgICAgICAvLyBJbnRlcnBvbGF0ZSB0aGUgYWRkaXRpb25hbCBmaWxlcyB3aXRoIHRoZSBiYXNlIEVKUyB0ZW1wbGF0ZSBjb250ZXh0LlxuICAgICAgICByZXNvbHZlZEZpbGVzW2tleV0gPSBpbnRlcnBvbGF0ZVRlbXBsYXRlKGZpbGVDb250ZW50KShiYXNlVGVtcGxhdGVDb250ZXh0KTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBjb25zdCB0ZW1wbGF0ZVNvdXJjZSA9IGFwcGx5KHVybChzY2hlbWF0aWNGaWxlc1VybCksIFtcbiAgICAgIG9wdGlvbnMuc2tpcFRlc3RzID8gZmlsdGVyKHBhdGggPT4gIXBhdGguZW5kc1dpdGgoJy5zcGVjLnRzLnRlbXBsYXRlJykpIDogbm9vcCgpLFxuICAgICAgb3B0aW9ucy5pbmxpbmVTdHlsZSA/IGZpbHRlcihwYXRoID0+ICFwYXRoLmVuZHNXaXRoKCcuX19zdHlsZV9fLnRlbXBsYXRlJykpIDogbm9vcCgpLFxuICAgICAgb3B0aW9ucy5pbmxpbmVUZW1wbGF0ZSA/IGZpbHRlcihwYXRoID0+ICFwYXRoLmVuZHNXaXRoKCcuaHRtbC50ZW1wbGF0ZScpKSA6IG5vb3AoKSxcbiAgICAgIC8vIFRyZWF0IHRoZSB0ZW1wbGF0ZSBvcHRpb25zIGFzIGFueSwgYmVjYXVzZSB0aGUgdHlwZSBkZWZpbml0aW9uIGZvciB0aGUgdGVtcGxhdGUgb3B0aW9uc1xuICAgICAgLy8gaXMgbWFkZSB1bm5lY2Vzc2FyaWx5IGV4cGxpY2l0LiBFdmVyeSB0eXBlIG9mIG9iamVjdCBjYW4gYmUgdXNlZCBpbiB0aGUgRUpTIHRlbXBsYXRlLlxuICAgICAgYXBwbHlUZW1wbGF0ZXMoe2luZGVudFRleHRDb250ZW50LCByZXNvbHZlZEZpbGVzLCAuLi5iYXNlVGVtcGxhdGVDb250ZXh0fSBhcyBhbnkpLFxuICAgICAgLy8gVE9ETyhkZXZ2ZXJzaW9uKTogZmlndXJlIG91dCB3aHkgd2UgY2Fubm90IGp1c3QgcmVtb3ZlIHRoZSBmaXJzdCBwYXJhbWV0ZXJcbiAgICAgIC8vIFNlZSBmb3IgZXhhbXBsZTogYW5ndWxhci1jbGkjc2NoZW1hdGljcy9hbmd1bGFyL2NvbXBvbmVudC9pbmRleC50cyNMMTYwXG4gICAgICBtb3ZlKG51bGwgYXMgYW55LCBwYXJzZWRQYXRoLnBhdGgpLFxuICAgIF0pO1xuXG4gICAgcmV0dXJuICgpID0+XG4gICAgICBjaGFpbihbXG4gICAgICAgIGJyYW5jaEFuZE1lcmdlKGNoYWluKFthZGREZWNsYXJhdGlvblRvTmdNb2R1bGUob3B0aW9ucyksIG1lcmdlV2l0aCh0ZW1wbGF0ZVNvdXJjZSldKSksXG4gICAgICBdKShob3N0LCBjb250ZXh0KTtcbiAgfTtcbn1cbiJdfQ==