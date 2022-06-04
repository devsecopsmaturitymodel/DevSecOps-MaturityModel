"use strict";
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.ComponentResourceCollector = void 0;
const path_1 = require("path");
const ts = require("typescript");
const decorators_1 = require("./utils/decorators");
const functions_1 = require("./utils/functions");
const line_mappings_1 = require("./utils/line-mappings");
const property_name_1 = require("./utils/property-name");
/**
 * Collector that can be used to find Angular templates and stylesheets referenced within
 * given TypeScript source files (inline or external referenced files)
 */
class ComponentResourceCollector {
    constructor(typeChecker, _fileSystem) {
        this.typeChecker = typeChecker;
        this._fileSystem = _fileSystem;
        this.resolvedTemplates = [];
        this.resolvedStylesheets = [];
    }
    visitNode(node) {
        if (node.kind === ts.SyntaxKind.ClassDeclaration) {
            this._visitClassDeclaration(node);
        }
    }
    _visitClassDeclaration(node) {
        if (!node.decorators || !node.decorators.length) {
            return;
        }
        const ngDecorators = (0, decorators_1.getAngularDecorators)(this.typeChecker, node.decorators);
        const componentDecorator = ngDecorators.find(dec => dec.name === 'Component');
        // In case no "@Component" decorator could be found on the current class, skip.
        if (!componentDecorator) {
            return;
        }
        const decoratorCall = componentDecorator.node.expression;
        // In case the component decorator call is not valid, skip this class declaration.
        if (decoratorCall.arguments.length !== 1) {
            return;
        }
        const componentMetadata = (0, functions_1.unwrapExpression)(decoratorCall.arguments[0]);
        // Ensure that the component metadata is an object literal expression.
        if (!ts.isObjectLiteralExpression(componentMetadata)) {
            return;
        }
        const sourceFile = node.getSourceFile();
        const filePath = this._fileSystem.resolve(sourceFile.fileName);
        const sourceFileDirPath = (0, path_1.dirname)(sourceFile.fileName);
        // Walk through all component metadata properties and determine the referenced
        // HTML templates (either external or inline)
        componentMetadata.properties.forEach(property => {
            if (!ts.isPropertyAssignment(property)) {
                return;
            }
            const propertyName = (0, property_name_1.getPropertyNameText)(property.name);
            if (propertyName === 'styles' && ts.isArrayLiteralExpression(property.initializer)) {
                property.initializer.elements.forEach(el => {
                    if (ts.isStringLiteralLike(el)) {
                        // Need to add an offset of one to the start because the template quotes are
                        // not part of the template content.
                        const templateStartIdx = el.getStart() + 1;
                        this.resolvedStylesheets.push({
                            filePath,
                            container: node,
                            content: el.text,
                            inline: true,
                            start: templateStartIdx,
                            getCharacterAndLineOfPosition: pos => ts.getLineAndCharacterOfPosition(sourceFile, pos + templateStartIdx),
                        });
                    }
                });
            }
            // In case there is an inline template specified, ensure that the value is statically
            // analyzable by checking if the initializer is a string literal-like node.
            if (propertyName === 'template' && ts.isStringLiteralLike(property.initializer)) {
                // Need to add an offset of one to the start because the template quotes are
                // not part of the template content.
                const templateStartIdx = property.initializer.getStart() + 1;
                this.resolvedTemplates.push({
                    filePath,
                    container: node,
                    content: property.initializer.text,
                    inline: true,
                    start: templateStartIdx,
                    getCharacterAndLineOfPosition: pos => ts.getLineAndCharacterOfPosition(sourceFile, pos + templateStartIdx),
                });
            }
            if (propertyName === 'styleUrls' && ts.isArrayLiteralExpression(property.initializer)) {
                property.initializer.elements.forEach(el => {
                    if (ts.isStringLiteralLike(el)) {
                        const stylesheetPath = this._fileSystem.resolve(sourceFileDirPath, el.text);
                        const stylesheet = this.resolveExternalStylesheet(stylesheetPath, node);
                        if (stylesheet) {
                            this.resolvedStylesheets.push(stylesheet);
                        }
                    }
                });
            }
            if (propertyName === 'templateUrl' && ts.isStringLiteralLike(property.initializer)) {
                const templateUrl = property.initializer.text;
                const templatePath = this._fileSystem.resolve(sourceFileDirPath, templateUrl);
                // In case the template does not exist in the file system, skip this
                // external template.
                if (!this._fileSystem.fileExists(templatePath)) {
                    return;
                }
                const fileContent = this._fileSystem.read(templatePath);
                if (fileContent) {
                    const lineStartsMap = (0, line_mappings_1.computeLineStartsMap)(fileContent);
                    this.resolvedTemplates.push({
                        filePath: templatePath,
                        container: node,
                        content: fileContent,
                        inline: false,
                        start: 0,
                        getCharacterAndLineOfPosition: p => (0, line_mappings_1.getLineAndCharacterFromPosition)(lineStartsMap, p),
                    });
                }
            }
        });
    }
    /** Resolves an external stylesheet by reading its content and computing line mappings. */
    resolveExternalStylesheet(filePath, container) {
        const fileContent = this._fileSystem.read(filePath);
        if (!fileContent) {
            return null;
        }
        const lineStartsMap = (0, line_mappings_1.computeLineStartsMap)(fileContent);
        return {
            filePath: filePath,
            container: container,
            content: fileContent,
            inline: false,
            start: 0,
            getCharacterAndLineOfPosition: pos => (0, line_mappings_1.getLineAndCharacterFromPosition)(lineStartsMap, pos),
        };
    }
}
exports.ComponentResourceCollector = ComponentResourceCollector;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29tcG9uZW50LXJlc291cmNlLWNvbGxlY3Rvci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uL3NyYy9jZGsvc2NoZW1hdGljcy91cGRhdGUtdG9vbC9jb21wb25lbnQtcmVzb3VyY2UtY29sbGVjdG9yLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7O0dBTUc7OztBQUVILCtCQUE2QjtBQUM3QixpQ0FBaUM7QUFFakMsbURBQXdEO0FBQ3hELGlEQUFtRDtBQUNuRCx5REFJK0I7QUFDL0IseURBQTBEO0FBcUIxRDs7O0dBR0c7QUFDSCxNQUFhLDBCQUEwQjtJQUlyQyxZQUFtQixXQUEyQixFQUFVLFdBQXVCO1FBQTVELGdCQUFXLEdBQVgsV0FBVyxDQUFnQjtRQUFVLGdCQUFXLEdBQVgsV0FBVyxDQUFZO1FBSC9FLHNCQUFpQixHQUF1QixFQUFFLENBQUM7UUFDM0Msd0JBQW1CLEdBQXVCLEVBQUUsQ0FBQztJQUVxQyxDQUFDO0lBRW5GLFNBQVMsQ0FBQyxJQUFhO1FBQ3JCLElBQUksSUFBSSxDQUFDLElBQUksS0FBSyxFQUFFLENBQUMsVUFBVSxDQUFDLGdCQUFnQixFQUFFO1lBQ2hELElBQUksQ0FBQyxzQkFBc0IsQ0FBQyxJQUEyQixDQUFDLENBQUM7U0FDMUQ7SUFDSCxDQUFDO0lBRU8sc0JBQXNCLENBQUMsSUFBeUI7UUFDdEQsSUFBSSxDQUFDLElBQUksQ0FBQyxVQUFVLElBQUksQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLE1BQU0sRUFBRTtZQUMvQyxPQUFPO1NBQ1I7UUFFRCxNQUFNLFlBQVksR0FBRyxJQUFBLGlDQUFvQixFQUFDLElBQUksQ0FBQyxXQUFXLEVBQUUsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDO1FBQzdFLE1BQU0sa0JBQWtCLEdBQUcsWUFBWSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxJQUFJLEtBQUssV0FBVyxDQUFDLENB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QUMsQ0FBQztvQkFFeEQsSUFBSSxDQUFDLGlCQUFpQixDQUFDLElBQUksQ0FBQzt3QkFDMUIsUUFBUSxFQUFFLFlBQVk7d0JBQ3RCLFNBQVMsRUFBRSxJQUFJO3dCQUNmLE9BQU8sRUFBRSxXQUFXO3dCQUNwQixNQUFNLEVBQUUsS0FBSzt3QkFDYixLQUFLLEVBQUUsQ0FBQzt3QkFDUiw2QkFBNkIsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLElBQUEsK0NBQStCLEVBQUMsYUFBYSxFQUFFLENBQUMsQ0FBQztxQkFDdEYsQ0FBQyxDQUFDO2lCQUNKO2FBQ0Y7UUFDSCxDQUFDLENBQUMsQ0FBQztJQUNMLENBQUM7SUFFRCwwRkFBMEY7SUFDMUYseUJBQXlCLENBQ3ZCLFFBQXVCLEVBQ3ZCLFNBQXFDO1FBRXJDLE1BQU0sV0FBVyxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBRXBELElBQUksQ0FBQyxXQUFXLEVBQUU7WUFDaEIsT0FBTyxJQUFJLENBQUM7U0FDYjtRQUVELE1BQU0sYUFBYSxHQUFHLElBQUEsb0NBQW9CLEVBQUMsV0FBVyxDQUFDLENBQUM7UUFFeEQsT0FBTztZQUNMLFFBQVEsRUFBRSxRQUFRO1lBQ2xCLFNBQVMsRUFBRSxTQUFTO1lBQ3BCLE9BQU8sRUFBRSxXQUFXO1lBQ3BCLE1BQU0sRUFBRSxLQUFLO1lBQ2IsS0FBSyxFQUFFLENBQUM7WUFDUiw2QkFBNkIsRUFBRSxHQUFHLENBQUMsRUFBRSxDQUFDLElBQUEsK0NBQStCLEVBQUMsYUFBYSxFQUFFLEdBQUcsQ0FBQztTQUMxRixDQUFDO0lBQ0osQ0FBQztDQUNGO0FBdkpELGdFQXVKQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge2Rpcm5hbWV9IGZyb20gJ3BhdGgnO1xuaW1wb3J0ICogYXMgdHMgZnJvbSAndHlwZXNjcmlwdCc7XG5pbXBvcnQge0ZpbGVTeXN0ZW0sIFdvcmtzcGFjZVBhdGh9IGZyb20gJy4vZmlsZS1zeXN0ZW0nO1xuaW1wb3J0IHtnZXRBbmd1bGFyRGVjb3JhdG9yc30gZnJvbSAnLi91dGlscy9kZWNvcmF0b3JzJztcbmltcG9ydCB7dW53cmFwRXhwcmVzc2lvbn0gZnJvbSAnLi91dGlscy9mdW5jdGlvbnMnO1xuaW1wb3J0IHtcbiAgY29tcHV0ZUxpbmVTdGFydHNNYXAsXG4gIGdldExpbmVBbmRDaGFyYWN0ZXJGcm9tUG9zaXRpb24sXG4gIExpbmVBbmRDaGFyYWN0ZXIsXG59IGZyb20gJy4vdXRpbHMvbGluZS1tYXBwaW5ncyc7XG5pbXBvcnQge2dldFByb3BlcnR5TmFtZVRleHR9IGZyb20gJy4vdXRpbHMvcHJvcGVydHktbmFtZSc7XG5cbmV4cG9ydCBpbnRlcmZhY2UgUmVzb2x2ZWRSZXNvdXJjZSB7XG4gIC8qKiBDbGFzcyBkZWNsYXJhdGlvbiB0aGF0IGNvbnRhaW5zIHRoaXMgcmVzb3VyY2UuICovXG4gIGNvbnRhaW5lcjogdHMuQ2xhc3NEZWNsYXJhdGlvbiB8IG51bGw7XG4gIC8qKiBGaWxlIGNvbnRlbnQgb2YgdGhlIGdpdmVuIHRlbXBsYXRlLiAqL1xuICBjb250ZW50OiBzdHJpbmc7XG4gIC8qKiBTdGFydCBvZmZzZXQgb2YgdGhlIHJlc291cmNlIGNvbnRlbnQgKGUuZy4gaW4gdGhlIGlubGluZSBzb3VyY2UgZmlsZSkgKi9cbiAgc3RhcnQ6IG51bWJlcjtcbiAgLyoqIFdoZXRoZXIgdGhlIGdpdmVuIHJlc291cmNlIGlzIGlubGluZSBvciBub3QuICovXG4gIGlubGluZTogYm9vbGVhbjtcbiAgLyoqIFBhdGggdG8gdGhlIGZpbGUgdGhhdCBjb250YWlucyB0aGlzIHJlc291cmNlLiAqL1xuICBmaWxlUGF0aDogV29ya3NwYWNlUGF0aDtcbiAgLyoqXG4gICAqIEdldHMgdGhlIGNoYXJhY3RlciBhbmQgbGluZSBvZiBhIGdpdmVuIHBvc2l0aW9uIGluZGV4IGluIHRoZSByZXNvdXJjZS5cbiAgICogSWYgdGhlIHJlc291cmNlIGlzIGRlY2xhcmVkIGlubGluZSB3aXRoaW4gYSBUeXBlU2NyaXB0IHNvdXJjZSBmaWxlLCB0aGUgbGluZSBhbmRcbiAgICogY2hhcmFjdGVyIGFyZSBiYXNlZCBvbiB0aGUgZnVsbCBzb3VyY2UgZmlsZSBjb250ZW50LlxuICAgKi9cbiAgZ2V0Q2hhcmFjdGVyQW5kTGluZU9mUG9zaXRpb246IChwb3M6IG51bWJlcikgPT4gTGluZUFuZENoYXJhY3Rlcjtcbn1cblxuLyoqXG4gKiBDb2xsZWN0b3IgdGhhdCBjYW4gYmUgdXNlZCB0byBmaW5kIEFuZ3VsYXIgdGVtcGxhdGVzIGFuZCBzdHlsZXNoZWV0cyByZWZlcmVuY2VkIHdpdGhpblxuICogZ2l2ZW4gVHlwZVNjcmlwdCBzb3VyY2UgZmlsZXMgKGlubGluZSBvciBleHRlcm5hbCByZWZlcmVuY2VkIGZpbGVzKVxuICovXG5leHBvcnQgY2xhc3MgQ29tcG9uZW50UmVzb3VyY2VDb2xsZWN0b3Ige1xuICByZXNvbHZlZFRlbXBsYXRlczogUmVzb2x2ZWRSZXNvdXJjZVtdID0gW107XG4gIHJlc29sdmVkU3R5bGVzaGVldHM6IFJlc29sdmVkUmVzb3VyY2VbXSA9IFtdO1xuXG4gIGNvbnN0cnVjdG9yKHB1YmxpYyB0eXBlQ2hlY2tlcjogdHMuVHlwZUNoZWNrZXIsIHByaXZhdGUgX2ZpbGVTeXN0ZW06IEZpbGVTeXN0ZW0pIHt9XG5cbiAgdmlzaXROb2RlKG5vZGU6IHRzLk5vZGUpIHtcbiAgICBpZiAobm9kZS5raW5kID09PSB0cy5TeW50YXhLaW5kLkNsYXNzRGVjbGFyYXRpb24pIHtcbiAgICAgIHRoaXMuX3Zpc2l0Q2xhc3NEZWNsYXJhdGlvbihub2RlIGFzIHRzLkNsYXNzRGVjbGFyYXRpb24pO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgX3Zpc2l0Q2xhc3NEZWNsYXJhdGlvbihub2RlOiB0cy5DbGFzc0RlY2xhcmF0aW9uKSB7XG4gICAgaWYgKCFub2RlLmRlY29yYXRvcnMgfHwgIW5vZGUuZGVjb3JhdG9ycy5sZW5ndGgpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCBuZ0RlY29yYXRvcnMgPSBnZXRBbmd1bGFyRGVjb3JhdG9ycyh0aGlzLnR5cGVDaGVja2VyLCBub2RlLmRlY29yYXRvcnMpO1xuICAgIGNvbnN0IGNvbXBvbmVudERlY29yYXRvciA9IG5nRGVjb3JhdG9ycy5maW5kKGRlYyA9PiBkZWMubmFtZSA9PT0gJ0NvbXBvbmVudCcpO1xuXG4gICAgLy8gSW4gY2FzZSBubyBcIkBDb21wb25lbnRcIiBkZWNvcmF0b3IgY291bGQgYmUgZm91bmQgb24gdGhlIGN1cnJlbnQgY2xhc3MsIHNraXAuXG4gICAgaWYgKCFjb21wb25lbnREZWNvcmF0b3IpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCBkZWNvcmF0b3JDYWxsID0gY29tcG9uZW50RGVjb3JhdG9yLm5vZGUuZXhwcmVzc2lvbjtcblxuICAgIC8vIEluIGNhc2UgdGhlIGNvbXBvbmVudCBkZWNvcmF0b3IgY2FsbCBpcyBub3QgdmFsaWQsIHNraXAgdGhpcyBjbGFzcyBkZWNsYXJhdGlvbi5cbiAgICBpZiAoZGVjb3JhdG9yQ2FsbC5hcmd1bWVudHMubGVuZ3RoICE9PSAxKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY29uc3QgY29tcG9uZW50TWV0YWRhdGEgPSB1bndyYXBFeHByZXNzaW9uKGRlY29yYXRvckNhbGwuYXJndW1lbnRzWzBdKTtcblxuICAgIC8vIEVuc3VyZSB0aGF0IHRoZSBjb21wb25lbnQgbWV0YWRhdGEgaXMgYW4gb2JqZWN0IGxpdGVyYWwgZXhwcmVzc2lvbi5cbiAgICBpZiAoIXRzLmlzT2JqZWN0TGl0ZXJhbEV4cHJlc3Npb24oY29tcG9uZW50TWV0YWRhdGEpKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY29uc3Qgc291cmNlRmlsZSA9IG5vZGUuZ2V0U291cmNlRmlsZSgpO1xuICAgIGNvbnN0IGZpbGVQYXRoID0gdGhpcy5fZmlsZVN5c3RlbS5yZXNvbHZlKHNvdXJjZUZpbGUuZmlsZU5hbWUpO1xuICAgIGNvbnN0IHNvdXJjZUZpbGVEaXJQYXRoID0gZGlybmFtZShzb3VyY2VGaWxlLmZpbGVOYW1lKTtcblxuICAgIC8vIFdhbGsgdGhyb3VnaCBhbGwgY29tcG9uZW50IG1ldGFkYXRhIHByb3BlcnRpZXMgYW5kIGRldGVybWluZSB0aGUgcmVmZXJlbmNlZFxuICAgIC8vIEhUTUwgdGVtcGxhdGVzIChlaXRoZXIgZXh0ZXJuYWwgb3IgaW5saW5lKVxuICAgIGNvbXBvbmVudE1ldGFkYXRhLnByb3BlcnRpZXMuZm9yRWFjaChwcm9wZXJ0eSA9PiB7XG4gICAgICBpZiAoIXRzLmlzUHJvcGVydHlBc3NpZ25tZW50KHByb3BlcnR5KSkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IHByb3BlcnR5TmFtZSA9IGdldFByb3BlcnR5TmFtZVRleHQocHJvcGVydHkubmFtZSk7XG5cbiAgICAgIGlmIChwcm9wZXJ0eU5hbWUgPT09ICdzdHlsZXMnICYmIHRzLmlzQXJyYXlMaXRlcmFsRXhwcmVzc2lvbihwcm9wZXJ0eS5pbml0aWFsaXplcikpIHtcbiAgICAgICAgcHJvcGVydHkuaW5pdGlhbGl6ZXIuZWxlbWVudHMuZm9yRWFjaChlbCA9PiB7XG4gICAgICAgICAgaWYgKHRzLmlzU3RyaW5nTGl0ZXJhbExpa2UoZWwpKSB7XG4gICAgICAgICAgICAvLyBOZWVkIHRvIGFkZCBhbiBvZmZzZXQgb2Ygb25lIHRvIHRoZSBzdGFydCBiZWNhdXNlIHRoZSB0ZW1wbGF0ZSBxdW90ZXMgYXJlXG4gICAgICAgICAgICAvLyBub3QgcGFydCBvZiB0aGUgdGVtcGxhdGUgY29udGVudC5cbiAgICAgICAgICAgIGNvbnN0IHRlbXBsYXRlU3RhcnRJZHggPSBlbC5nZXRTdGFydCgpICsgMTtcbiAgICAgICAgICAgIHRoaXMucmVzb2x2ZWRTdHlsZXNoZWV0cy5wdXNoKHtcbiAgICAgICAgICAgICAgZmlsZVBhdGgsXG4gICAgICAgICAgICAgIGNvbnRhaW5lcjogbm9kZSxcbiAgICAgICAgICAgICAgY29udGVudDogZWwudGV4dCxcbiAgICAgICAgICAgICAgaW5saW5lOiB0cnVlLFxuICAgICAgICAgICAgICBzdGFydDogdGVtcGxhdGVTdGFydElkeCxcbiAgICAgICAgICAgICAgZ2V0Q2hhcmFjdGVyQW5kTGluZU9mUG9zaXRpb246IHBvcyA9PlxuICAgICAgICAgICAgICAgIHRzLmdldExpbmVBbmRDaGFyYWN0ZXJPZlBvc2l0aW9uKHNvdXJjZUZpbGUsIHBvcyArIHRlbXBsYXRlU3RhcnRJZHgpLFxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgIH1cblxuICAgICAgLy8gSW4gY2FzZSB0aGVyZSBpcyBhbiBpbmxpbmUgdGVtcGxhdGUgc3BlY2lmaWVkLCBlbnN1cmUgdGhhdCB0aGUgdmFsdWUgaXMgc3RhdGljYWxseVxuICAgICAgLy8gYW5hbHl6YWJsZSBieSBjaGVja2luZyBpZiB0aGUgaW5pdGlhbGl6ZXIgaXMgYSBzdHJpbmcgbGl0ZXJhbC1saWtlIG5vZGUuXG4gICAgICBpZiAocHJvcGVydHlOYW1lID09PSAndGVtcGxhdGUnICYmIHRzLmlzU3RyaW5nTGl0ZXJhbExpa2UocHJvcGVydHkuaW5pdGlhbGl6ZXIpKSB7XG4gICAgICAgIC8vIE5lZWQgdG8gYWRkIGFuIG9mZnNldCBvZiBvbmUgdG8gdGhlIHN0YXJ0IGJlY2F1c2UgdGhlIHRlbXBsYXRlIHF1b3RlcyBhcmVcbiAgICAgICAgLy8gbm90IHBhcnQgb2YgdGhlIHRlbXBsYXRlIGNvbnRlbnQuXG4gICAgICAgIGNvbnN0IHRlbXBsYXRlU3RhcnRJZHggPSBwcm9wZXJ0eS5pbml0aWFsaXplci5nZXRTdGFydCgpICsgMTtcbiAgICAgICAgdGhpcy5yZXNvbHZlZFRlbXBsYXRlcy5wdXNoKHtcbiAgICAgICAgICBmaWxlUGF0aCxcbiAgICAgICAgICBjb250YWluZXI6IG5vZGUsXG4gICAgICAgICAgY29udGVudDogcHJvcGVydHkuaW5pdGlhbGl6ZXIudGV4dCxcbiAgICAgICAgICBpbmxpbmU6IHRydWUsXG4gICAgICAgICAgc3RhcnQ6IHRlbXBsYXRlU3RhcnRJZHgsXG4gICAgICAgICAgZ2V0Q2hhcmFjdGVyQW5kTGluZU9mUG9zaXRpb246IHBvcyA9PlxuICAgICAgICAgICAgdHMuZ2V0TGluZUFuZENoYXJhY3Rlck9mUG9zaXRpb24oc291cmNlRmlsZSwgcG9zICsgdGVtcGxhdGVTdGFydElkeCksXG4gICAgICAgIH0pO1xuICAgICAgfVxuXG4gICAgICBpZiAocHJvcGVydHlOYW1lID09PSAnc3R5bGVVcmxzJyAmJiB0cy5pc0FycmF5TGl0ZXJhbEV4cHJlc3Npb24ocHJvcGVydHkuaW5pdGlhbGl6ZXIpKSB7XG4gICAgICAgIHByb3BlcnR5LmluaXRpYWxpemVyLmVsZW1lbnRzLmZvckVhY2goZWwgPT4ge1xuICAgICAgICAgIGlmICh0cy5pc1N0cmluZ0xpdGVyYWxMaWtlKGVsKSkge1xuICAgICAgICAgICAgY29uc3Qgc3R5bGVzaGVldFBhdGggPSB0aGlzLl9maWxlU3lzdGVtLnJlc29sdmUoc291cmNlRmlsZURpclBhdGgsIGVsLnRleHQpO1xuICAgICAgICAgICAgY29uc3Qgc3R5bGVzaGVldCA9IHRoaXMucmVzb2x2ZUV4dGVybmFsU3R5bGVzaGVldChzdHlsZXNoZWV0UGF0aCwgbm9kZSk7XG5cbiAgICAgICAgICAgIGlmIChzdHlsZXNoZWV0KSB7XG4gICAgICAgICAgICAgIHRoaXMucmVzb2x2ZWRTdHlsZXNoZWV0cy5wdXNoKHN0eWxlc2hlZXQpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICB9XG5cbiAgICAgIGlmIChwcm9wZXJ0eU5hbWUgPT09ICd0ZW1wbGF0ZVVybCcgJiYgdHMuaXNTdHJpbmdMaXRlcmFsTGlrZShwcm9wZXJ0eS5pbml0aWFsaXplcikpIHtcbiAgICAgICAgY29uc3QgdGVtcGxhdGVVcmwgPSBwcm9wZXJ0eS5pbml0aWFsaXplci50ZXh0O1xuICAgICAgICBjb25zdCB0ZW1wbGF0ZVBhdGggPSB0aGlzLl9maWxlU3lzdGVtLnJlc29sdmUoc291cmNlRmlsZURpclBhdGgsIHRlbXBsYXRlVXJsKTtcblxuICAgICAgICAvLyBJbiBjYXNlIHRoZSB0ZW1wbGF0ZSBkb2VzIG5vdCBleGlzdCBpbiB0aGUgZmlsZSBzeXN0ZW0sIHNraXAgdGhpc1xuICAgICAgICAvLyBleHRlcm5hbCB0ZW1wbGF0ZS5cbiAgICAgICAgaWYgKCF0aGlzLl9maWxlU3lzdGVtLmZpbGVFeGlzdHModGVtcGxhdGVQYXRoKSkge1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IGZpbGVDb250ZW50ID0gdGhpcy5fZmlsZVN5c3RlbS5yZWFkKHRlbXBsYXRlUGF0aCk7XG5cbiAgICAgICAgaWYgKGZpbGVDb250ZW50KSB7XG4gICAgICAgICAgY29uc3QgbGluZVN0YXJ0c01hcCA9IGNvbXB1dGVMaW5lU3RhcnRzTWFwKGZpbGVDb250ZW50KTtcblxuICAgICAgICAgIHRoaXMucmVzb2x2ZWRUZW1wbGF0ZXMucHVzaCh7XG4gICAgICAgICAgICBmaWxlUGF0aDogdGVtcGxhdGVQYXRoLFxuICAgICAgICAgICAgY29udGFpbmVyOiBub2RlLFxuICAgICAgICAgICAgY29udGVudDogZmlsZUNvbnRlbnQsXG4gICAgICAgICAgICBpbmxpbmU6IGZhbHNlLFxuICAgICAgICAgICAgc3RhcnQ6IDAsXG4gICAgICAgICAgICBnZXRDaGFyYWN0ZXJBbmRMaW5lT2ZQb3NpdGlvbjogcCA9PiBnZXRMaW5lQW5kQ2hhcmFjdGVyRnJvbVBvc2l0aW9uKGxpbmVTdGFydHNNYXAsIHApLFxuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICAvKiogUmVzb2x2ZXMgYW4gZXh0ZXJuYWwgc3R5bGVzaGVldCBieSByZWFkaW5nIGl0cyBjb250ZW50IGFuZCBjb21wdXRpbmcgbGluZSBtYXBwaW5ncy4gKi9cbiAgcmVzb2x2ZUV4dGVybmFsU3R5bGVzaGVldChcbiAgICBmaWxlUGF0aDogV29ya3NwYWNlUGF0aCxcbiAgICBjb250YWluZXI6IHRzLkNsYXNzRGVjbGFyYXRpb24gfCBudWxsLFxuICApOiBSZXNvbHZlZFJlc291cmNlIHwgbnVsbCB7XG4gICAgY29uc3QgZmlsZUNvbnRlbnQgPSB0aGlzLl9maWxlU3lzdGVtLnJlYWQoZmlsZVBhdGgpO1xuXG4gICAgaWYgKCFmaWxlQ29udGVudCkge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgY29uc3QgbGluZVN0YXJ0c01hcCA9IGNvbXB1dGVMaW5lU3RhcnRzTWFwKGZpbGVDb250ZW50KTtcblxuICAgIHJldHVybiB7XG4gICAgICBmaWxlUGF0aDogZmlsZVBhdGgsXG4gICAgICBjb250YWluZXI6IGNvbnRhaW5lcixcbiAgICAgIGNvbnRlbnQ6IGZpbGVDb250ZW50LFxuICAgICAgaW5saW5lOiBmYWxzZSxcbiAgICAgIHN0YXJ0OiAwLFxuICAgICAgZ2V0Q2hhcmFjdGVyQW5kTGluZU9mUG9zaXRpb246IHBvcyA9PiBnZXRMaW5lQW5kQ2hhcmFjdGVyRnJvbVBvc2l0aW9uKGxpbmVTdGFydHNNYXAsIHBvcyksXG4gICAgfTtcbiAgfVxufVxuIl19