/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define("@angular/core/schematics/utils/ng_component_template", ["require", "exports", "path", "typescript", "@angular/core/schematics/utils/line_mappings", "@angular/core/schematics/utils/ng_decorators", "@angular/core/schematics/utils/typescript/functions", "@angular/core/schematics/utils/typescript/property_name"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.NgComponentTemplateVisitor = void 0;
    const path_1 = require("path");
    const typescript_1 = __importDefault(require("typescript"));
    const line_mappings_1 = require("@angular/core/schematics/utils/line_mappings");
    const ng_decorators_1 = require("@angular/core/schematics/utils/ng_decorators");
    const functions_1 = require("@angular/core/schematics/utils/typescript/functions");
    const property_name_1 = require("@angular/core/schematics/utils/typescript/property_name");
    /**
     * Visitor that can be used to determine Angular templates referenced within given
     * TypeScript source files (inline templates or external referenced templates)
     */
    class NgComponentTemplateVisitor {
        constructor(typeChecker, _basePath, _tree) {
            this.typeChecker = typeChecker;
            this._basePath = _basePath;
            this._tree = _tree;
            this.resolvedTemplates = [];
        }
        visitNode(node) {
            if (node.kind === typescript_1.default.SyntaxKind.ClassDeclaration) {
                this.visitClassDeclaration(node);
            }
            typescript_1.default.forEachChild(node, n => this.visitNode(n));
        }
        visitClassDeclaration(node) {
            if (!node.decorators || !node.decorators.length) {
                return;
            }
            const ngDecorators = (0, ng_decorators_1.getAngularDecorators)(this.typeChecker, node.decorators);
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
            if (!typescript_1.default.isObjectLiteralExpression(componentMetadata)) {
                return;
            }
            const sourceFile = node.getSourceFile();
            const sourceFileName = sourceFile.fileName;
            // Walk through all component metadata properties and determine the referenced
            // HTML templates (either external or inline)
            componentMetadata.properties.forEach(property => {
                if (!typescript_1.default.isPropertyAssignment(property)) {
                    return;
                }
                const propertyName = (0, property_name_1.getPropertyNameText)(property.name);
                // In case there is an inline template specified, ensure that the value is statically
                // analyzable by checking if the initializer is a string literal-like node.
                if (propertyName === 'template' && typescript_1.default.isStringLiteralLike(property.initializer)) {
                    // Need to add an offset of one to the start because the template quotes are
                    // not part of the template content.
                    // The `getText()` method gives us the original raw text.
                    // We could have used the `text` property, but if the template is defined as a backtick
                    // string then the `text` property contains a "cooked" version of the string. Such cooked
                    // strings will have converted CRLF characters to only LF. This messes up string
                    // replacements in template migrations.
                    // The raw text returned by `getText()` includes the enclosing quotes so we change the
                    // `content` and `start` values accordingly.
                    const content = property.initializer.getText().slice(1, -1);
                    const start = property.initializer.getStart() + 1;
                    this.resolvedTemplates.push({
                        filePath: sourceFileName,
                        container: node,
                        content,
                        inline: true,
                        start: start,
                        getCharacterAndLineOfPosition: pos => typescript_1.default.getLineAndCharacterOfPosition(sourceFile, pos + start)
                    });
                }
                if (propertyName === 'templateUrl' && typescript_1.default.isStringLiteralLike(property.initializer)) {
                    const templateDiskPath = (0, path_1.resolve)((0, path_1.dirname)(sourceFileName), property.initializer.text);
                    // TODO(devversion): Remove this when the TypeScript compiler host is fully virtual
                    // relying on the devkit virtual tree and not dealing with disk paths. This is blocked on
                    // providing common utilities for schematics/migrations, given this is done in the
                    // Angular CDK already:
                    // https://github.com/angular/components/blob/3704400ee67e0190c9783e16367587489c803ebc/src/cdk/schematics/update-tool/utils/virtual-host.ts.
                    const templateDevkitPath = (0, path_1.relative)(this._basePath, templateDiskPath);
                    // In case the template does not exist in the file system, skip this
                    // external template.
                    if (!this._tree.exists(templateDevkitPath)) {
                        return;
                    }
                    const fileContent = this._tree.read(templateDevkitPath).toString();
                    const lineStartsMap = (0, line_mappings_1.computeLineStartsMap)(fileContent);
                    this.resolvedTemplates.push({
                        filePath: templateDiskPath,
                        container: node,
                        content: fileContent,
                        inline: false,
                        start: 0,
                        getCharacterAndLineOfPosition: pos => (0, line_mappings_1.getLineAndCharacterFromPosition)(lineStartsMap, pos),
                    });
                }
            });
        }
    }
    exports.NgComponentTemplateVisitor = NgComponentTemplateVisitor;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmdfY29tcG9uZW50X3RlbXBsYXRlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvY29yZS9zY2hlbWF0aWNzL3V0aWxzL25nX2NvbXBvbmVudF90ZW1wbGF0ZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0dBTUc7Ozs7Ozs7Ozs7Ozs7Ozs7SUFJSCwrQkFBZ0Q7SUFDaEQsNERBQTRCO0lBRTVCLGdGQUFzRjtJQUN0RixnRkFBcUQ7SUFDckQsbUZBQXdEO0lBQ3hELDJGQUErRDtJQXVCL0Q7OztPQUdHO0lBQ0gsTUFBYSwwQkFBMEI7UUFHckMsWUFBbUIsV0FBMkIsRUFBVSxTQUFpQixFQUFVLEtBQVc7WUFBM0UsZ0JBQVcsR0FBWCxXQUFXLENBQWdCO1lBQVUsY0FBUyxHQUFULFNBQVMsQ0FBUTtZQUFVLFVBQUssR0FBTCxLQUFLLENBQU07WUFGOUYsc0JBQWlCLEdBQXVCLEVBQUUsQ0FBQztRQUVzRCxDQUFDO1FBRWxHLFNBQVMsQ0FBQyxJQUFhO1lBQ3JCLElBQUksSUFBSSxDQUFDLElBQUksS0FBSyxvQkFBRSxDQUFDLFVBQVUsQ0FBQyxnQkFBZ0IsRUFBRTtnQkFDaEQsSUFBSSxDQUFDLHFCQUFxQixDQUFDLElBQTJCLENBQUMsQ0FBQzthQUN6RDtZQUVELG9CQUFFLENBQUMsWUFBWSxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNoRCxDQUFDO1FBRU8scUJBQXFCLENBQUMsSUFBeUI7WUFDckQsSUFBSSxDQUFDLElBQUksQ0FBQyxVQUFVLElBQUksQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLE1BQU0sRUFBRTtnQkFDL0MsT0FBTzthQUNSO1lBRUQsTUFBTSxZQUFZLEdBQUcsSUFBQSxvQ0FBb0IsRUFBQyxJQUFJLENBQUMsV0FBVyxFQUFFLElBQUksQ0FBQyxVQUFVLENB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LENBQUMsTUFBTSxDQUFDLGtCQUFrQixDQUFDLEVBQUU7d0JBQzFDLE9BQU87cUJBQ1I7b0JBRUQsTUFBTSxXQUFXLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsa0JBQWtCLENBQUUsQ0FBQyxRQUFRLEVBQUUsQ0FBQztvQkFDcEUsTUFBTSxhQUFhLEdBQUcsSUFBQSxvQ0FBb0IsRUFBQyxXQUFXLENBQUMsQ0FBQztvQkFFeEQsSUFBSSxDQUFDLGlCQUFpQixDQUFDLElBQUksQ0FBQzt3QkFDMUIsUUFBUSxFQUFFLGdCQUFnQjt3QkFDMUIsU0FBUyxFQUFFLElBQUk7d0JBQ2YsT0FBTyxFQUFFLFdBQVc7d0JBQ3BCLE1BQU0sRUFBRSxLQUFLO3dCQUNiLEtBQUssRUFBRSxDQUFDO3dCQUNSLDZCQUE2QixFQUFFLEdBQUcsQ0FBQyxFQUFFLENBQUMsSUFBQSwrQ0FBK0IsRUFBQyxhQUFhLEVBQUUsR0FBRyxDQUFDO3FCQUMxRixDQUFDLENBQUM7aUJBQ0o7WUFDSCxDQUFDLENBQUMsQ0FBQztRQUNMLENBQUM7S0FDRjtJQXpHRCxnRUF5R0MiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtUcmVlfSBmcm9tICdAYW5ndWxhci1kZXZraXQvc2NoZW1hdGljcyc7XG5pbXBvcnQge2V4aXN0c1N5bmMsIHJlYWRGaWxlU3luY30gZnJvbSAnZnMnO1xuaW1wb3J0IHtkaXJuYW1lLCByZWxhdGl2ZSwgcmVzb2x2ZX0gZnJvbSAncGF0aCc7XG5pbXBvcnQgdHMgZnJvbSAndHlwZXNjcmlwdCc7XG5cbmltcG9ydCB7Y29tcHV0ZUxpbmVTdGFydHNNYXAsIGdldExpbmVBbmRDaGFyYWN0ZXJGcm9tUG9zaXRpb259IGZyb20gJy4vbGluZV9tYXBwaW5ncyc7XG5pbXBvcnQge2dldEFuZ3VsYXJEZWNvcmF0b3JzfSBmcm9tICcuL25nX2RlY29yYXRvcnMnO1xuaW1wb3J0IHt1bndyYXBFeHByZXNzaW9ufSBmcm9tICcuL3R5cGVzY3JpcHQvZnVuY3Rpb25zJztcbmltcG9ydCB7Z2V0UHJvcGVydHlOYW1lVGV4dH0gZnJvbSAnLi90eXBlc2NyaXB0L3Byb3BlcnR5X25hbWUnO1xuXG5leHBvcnQgaW50ZXJmYWNlIFJlc29sdmVkVGVtcGxhdGUge1xuICAvKiogQ2xhc3MgZGVjbGFyYXRpb24gdGhhdCBjb250YWlucyB0aGlzIHRlbXBsYXRlLiAqL1xuICBjb250YWluZXI6IHRzLkNsYXNzRGVjbGFyYXRpb247XG4gIC8qKiBGaWxlIGNvbnRlbnQgb2YgdGhlIGdpdmVuIHRlbXBsYXRlLiAqL1xuICBjb250ZW50OiBzdHJpbmc7XG4gIC8qKiBTdGFydCBvZmZzZXQgb2YgdGhlIHRlbXBsYXRlIGNvbnRlbnQgKGUuZy4gaW4gdGhlIGlubGluZSBzb3VyY2UgZmlsZSkgKi9cbiAgc3RhcnQ6IG51bWJlcjtcbiAgLyoqIFdoZXRoZXIgdGhlIGdpdmVuIHRlbXBsYXRlIGlzIGlubGluZSBvciBub3QuICovXG4gIGlubGluZTogYm9vbGVhbjtcbiAgLyoqIFBhdGggdG8gdGhlIGZpbGUgdGhhdCBjb250YWlucyB0aGlzIHRlbXBsYXRlLiAqL1xuICBmaWxlUGF0aDogc3RyaW5nO1xuICAvKipcbiAgICogR2V0cyB0aGUgY2hhcmFjdGVyIGFuZCBsaW5lIG9mIGEgZ2l2ZW4gcG9zaXRpb24gaW5kZXggaW4gdGhlIHRlbXBsYXRlLlxuICAgKiBJZiB0aGUgdGVtcGxhdGUgaXMgZGVjbGFyZWQgaW5saW5lIHdpdGhpbiBhIFR5cGVTY3JpcHQgc291cmNlIGZpbGUsIHRoZSBsaW5lIGFuZFxuICAgKiBjaGFyYWN0ZXIgYXJlIGJhc2VkIG9uIHRoZSBmdWxsIHNvdXJjZSBmaWxlIGNvbnRlbnQuXG4gICAqL1xuICBnZXRDaGFyYWN0ZXJBbmRMaW5lT2ZQb3NpdGlvbjogKHBvczogbnVtYmVyKSA9PiB7XG4gICAgY2hhcmFjdGVyOiBudW1iZXIsIGxpbmU6IG51bWJlclxuICB9O1xufVxuXG4vKipcbiAqIFZpc2l0b3IgdGhhdCBjYW4gYmUgdXNlZCB0byBkZXRlcm1pbmUgQW5ndWxhciB0ZW1wbGF0ZXMgcmVmZXJlbmNlZCB3aXRoaW4gZ2l2ZW5cbiAqIFR5cGVTY3JpcHQgc291cmNlIGZpbGVzIChpbmxpbmUgdGVtcGxhdGVzIG9yIGV4dGVybmFsIHJlZmVyZW5jZWQgdGVtcGxhdGVzKVxuICovXG5leHBvcnQgY2xhc3MgTmdDb21wb25lbnRUZW1wbGF0ZVZpc2l0b3Ige1xuICByZXNvbHZlZFRlbXBsYXRlczogUmVzb2x2ZWRUZW1wbGF0ZVtdID0gW107XG5cbiAgY29uc3RydWN0b3IocHVibGljIHR5cGVDaGVja2VyOiB0cy5UeXBlQ2hlY2tlciwgcHJpdmF0ZSBfYmFzZVBhdGg6IHN0cmluZywgcHJpdmF0ZSBfdHJlZTogVHJlZSkge31cblxuICB2aXNpdE5vZGUobm9kZTogdHMuTm9kZSkge1xuICAgIGlmIChub2RlLmtpbmQgPT09IHRzLlN5bnRheEtpbmQuQ2xhc3NEZWNsYXJhdGlvbikge1xuICAgICAgdGhpcy52aXNpdENsYXNzRGVjbGFyYXRpb24obm9kZSBhcyB0cy5DbGFzc0RlY2xhcmF0aW9uKTtcbiAgICB9XG5cbiAgICB0cy5mb3JFYWNoQ2hpbGQobm9kZSwgbiA9PiB0aGlzLnZpc2l0Tm9kZShuKSk7XG4gIH1cblxuICBwcml2YXRlIHZpc2l0Q2xhc3NEZWNsYXJhdGlvbihub2RlOiB0cy5DbGFzc0RlY2xhcmF0aW9uKSB7XG4gICAgaWYgKCFub2RlLmRlY29yYXRvcnMgfHwgIW5vZGUuZGVjb3JhdG9ycy5sZW5ndGgpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCBuZ0RlY29yYXRvcnMgPSBnZXRBbmd1bGFyRGVjb3JhdG9ycyh0aGlzLnR5cGVDaGVja2VyLCBub2RlLmRlY29yYXRvcnMpO1xuICAgIGNvbnN0IGNvbXBvbmVudERlY29yYXRvciA9IG5nRGVjb3JhdG9ycy5maW5kKGRlYyA9PiBkZWMubmFtZSA9PT0gJ0NvbXBvbmVudCcpO1xuXG4gICAgLy8gSW4gY2FzZSBubyBcIkBDb21wb25lbnRcIiBkZWNvcmF0b3IgY291bGQgYmUgZm91bmQgb24gdGhlIGN1cnJlbnQgY2xhc3MsIHNraXAuXG4gICAgaWYgKCFjb21wb25lbnREZWNvcmF0b3IpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCBkZWNvcmF0b3JDYWxsID0gY29tcG9uZW50RGVjb3JhdG9yLm5vZGUuZXhwcmVzc2lvbjtcblxuICAgIC8vIEluIGNhc2UgdGhlIGNvbXBvbmVudCBkZWNvcmF0b3IgY2FsbCBpcyBub3QgdmFsaWQsIHNraXAgdGhpcyBjbGFzcyBkZWNsYXJhdGlvbi5cbiAgICBpZiAoZGVjb3JhdG9yQ2FsbC5hcmd1bWVudHMubGVuZ3RoICE9PSAxKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY29uc3QgY29tcG9uZW50TWV0YWRhdGEgPSB1bndyYXBFeHByZXNzaW9uKGRlY29yYXRvckNhbGwuYXJndW1lbnRzWzBdKTtcblxuICAgIC8vIEVuc3VyZSB0aGF0IHRoZSBjb21wb25lbnQgbWV0YWRhdGEgaXMgYW4gb2JqZWN0IGxpdGVyYWwgZXhwcmVzc2lvbi5cbiAgICBpZiAoIXRzLmlzT2JqZWN0TGl0ZXJhbEV4cHJlc3Npb24oY29tcG9uZW50TWV0YWRhdGEpKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY29uc3Qgc291cmNlRmlsZSA9IG5vZGUuZ2V0U291cmNlRmlsZSgpO1xuICAgIGNvbnN0IHNvdXJjZUZpbGVOYW1lID0gc291cmNlRmlsZS5maWxlTmFtZTtcblxuICAgIC8vIFdhbGsgdGhyb3VnaCBhbGwgY29tcG9uZW50IG1ldGFkYXRhIHByb3BlcnRpZXMgYW5kIGRldGVybWluZSB0aGUgcmVmZXJlbmNlZFxuICAgIC8vIEhUTUwgdGVtcGxhdGVzIChlaXRoZXIgZXh0ZXJuYWwgb3IgaW5saW5lKVxuICAgIGNvbXBvbmVudE1ldGFkYXRhLnByb3BlcnRpZXMuZm9yRWFjaChwcm9wZXJ0eSA9PiB7XG4gICAgICBpZiAoIXRzLmlzUHJvcGVydHlBc3NpZ25tZW50KHByb3BlcnR5KSkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IHByb3BlcnR5TmFtZSA9IGdldFByb3BlcnR5TmFtZVRleHQocHJvcGVydHkubmFtZSk7XG5cbiAgICAgIC8vIEluIGNhc2UgdGhlcmUgaXMgYW4gaW5saW5lIHRlbXBsYXRlIHNwZWNpZmllZCwgZW5zdXJlIHRoYXQgdGhlIHZhbHVlIGlzIHN0YXRpY2FsbHlcbiAgICAgIC8vIGFuYWx5emFibGUgYnkgY2hlY2tpbmcgaWYgdGhlIGluaXRpYWxpemVyIGlzIGEgc3RyaW5nIGxpdGVyYWwtbGlrZSBub2RlLlxuICAgICAgaWYgKHByb3BlcnR5TmFtZSA9PT0gJ3RlbXBsYXRlJyAmJiB0cy5pc1N0cmluZ0xpdGVyYWxMaWtlKHByb3BlcnR5LmluaXRpYWxpemVyKSkge1xuICAgICAgICAvLyBOZWVkIHRvIGFkZCBhbiBvZmZzZXQgb2Ygb25lIHRvIHRoZSBzdGFydCBiZWNhdXNlIHRoZSB0ZW1wbGF0ZSBxdW90ZXMgYXJlXG4gICAgICAgIC8vIG5vdCBwYXJ0IG9mIHRoZSB0ZW1wbGF0ZSBjb250ZW50LlxuICAgICAgICAvLyBUaGUgYGdldFRleHQoKWAgbWV0aG9kIGdpdmVzIHVzIHRoZSBvcmlnaW5hbCByYXcgdGV4dC5cbiAgICAgICAgLy8gV2UgY291bGQgaGF2ZSB1c2VkIHRoZSBgdGV4dGAgcHJvcGVydHksIGJ1dCBpZiB0aGUgdGVtcGxhdGUgaXMgZGVmaW5lZCBhcyBhIGJhY2t0aWNrXG4gICAgICAgIC8vIHN0cmluZyB0aGVuIHRoZSBgdGV4dGAgcHJvcGVydHkgY29udGFpbnMgYSBcImNvb2tlZFwiIHZlcnNpb24gb2YgdGhlIHN0cmluZy4gU3VjaCBjb29rZWRcbiAgICAgICAgLy8gc3RyaW5ncyB3aWxsIGhhdmUgY29udmVydGVkIENSTEYgY2hhcmFjdGVycyB0byBvbmx5IExGLiBUaGlzIG1lc3NlcyB1cCBzdHJpbmdcbiAgICAgICAgLy8gcmVwbGFjZW1lbnRzIGluIHRlbXBsYXRlIG1pZ3JhdGlvbnMuXG4gICAgICAgIC8vIFRoZSByYXcgdGV4dCByZXR1cm5lZCBieSBgZ2V0VGV4dCgpYCBpbmNsdWRlcyB0aGUgZW5jbG9zaW5nIHF1b3RlcyBzbyB3ZSBjaGFuZ2UgdGhlXG4gICAgICAgIC8vIGBjb250ZW50YCBhbmQgYHN0YXJ0YCB2YWx1ZXMgYWNjb3JkaW5nbHkuXG4gICAgICAgIGNvbnN0IGNvbnRlbnQgPSBwcm9wZXJ0eS5pbml0aWFsaXplci5nZXRUZXh0KCkuc2xpY2UoMSwgLTEpO1xuICAgICAgICBjb25zdCBzdGFydCA9IHByb3BlcnR5LmluaXRpYWxpemVyLmdldFN0YXJ0KCkgKyAxO1xuICAgICAgICB0aGlzLnJlc29sdmVkVGVtcGxhdGVzLnB1c2goe1xuICAgICAgICAgIGZpbGVQYXRoOiBzb3VyY2VGaWxlTmFtZSxcbiAgICAgICAgICBjb250YWluZXI6IG5vZGUsXG4gICAgICAgICAgY29udGVudCxcbiAgICAgICAgICBpbmxpbmU6IHRydWUsXG4gICAgICAgICAgc3RhcnQ6IHN0YXJ0LFxuICAgICAgICAgIGdldENoYXJhY3RlckFuZExpbmVPZlBvc2l0aW9uOiBwb3MgPT5cbiAgICAgICAgICAgICAgdHMuZ2V0TGluZUFuZENoYXJhY3Rlck9mUG9zaXRpb24oc291cmNlRmlsZSwgcG9zICsgc3RhcnQpXG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgICAgaWYgKHByb3BlcnR5TmFtZSA9PT0gJ3RlbXBsYXRlVXJsJyAmJiB0cy5pc1N0cmluZ0xpdGVyYWxMaWtlKHByb3BlcnR5LmluaXRpYWxpemVyKSkge1xuICAgICAgICBjb25zdCB0ZW1wbGF0ZURpc2tQYXRoID0gcmVzb2x2ZShkaXJuYW1lKHNvdXJjZUZpbGVOYW1lKSwgcHJvcGVydHkuaW5pdGlhbGl6ZXIudGV4dCk7XG4gICAgICAgIC8vIFRPRE8oZGV2dmVyc2lvbik6IFJlbW92ZSB0aGlzIHdoZW4gdGhlIFR5cGVTY3JpcHQgY29tcGlsZXIgaG9zdCBpcyBmdWxseSB2aXJ0dWFsXG4gICAgICAgIC8vIHJlbHlpbmcgb24gdGhlIGRldmtpdCB2aXJ0dWFsIHRyZWUgYW5kIG5vdCBkZWFsaW5nIHdpdGggZGlzayBwYXRocy4gVGhpcyBpcyBibG9ja2VkIG9uXG4gICAgICAgIC8vIHByb3ZpZGluZyBjb21tb24gdXRpbGl0aWVzIGZvciBzY2hlbWF0aWNzL21pZ3JhdGlvbnMsIGdpdmVuIHRoaXMgaXMgZG9uZSBpbiB0aGVcbiAgICAgICAgLy8gQW5ndWxhciBDREsgYWxyZWFkeTpcbiAgICAgICAgLy8gaHR0cHM6Ly9naXRodWIuY29tL2FuZ3VsYXIvY29tcG9uZW50cy9ibG9iLzM3MDQ0MDBlZTY3ZTAxOTBjOTc4M2UxNjM2NzU4NzQ4OWM4MDNlYmMvc3JjL2Nkay9zY2hlbWF0aWNzL3VwZGF0ZS10b29sL3V0aWxzL3ZpcnR1YWwtaG9zdC50cy5cbiAgICAgICAgY29uc3QgdGVtcGxhdGVEZXZraXRQYXRoID0gcmVsYXRpdmUodGhpcy5fYmFzZVBhdGgsIHRlbXBsYXRlRGlza1BhdGgpO1xuXG4gICAgICAgIC8vIEluIGNhc2UgdGhlIHRlbXBsYXRlIGRvZXMgbm90IGV4aXN0IGluIHRoZSBmaWxlIHN5c3RlbSwgc2tpcCB0aGlzXG4gICAgICAgIC8vIGV4dGVybmFsIHRlbXBsYXRlLlxuICAgICAgICBpZiAoIXRoaXMuX3RyZWUuZXhpc3RzKHRlbXBsYXRlRGV2a2l0UGF0aCkpIHtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBmaWxlQ29udGVudCA9IHRoaXMuX3RyZWUucmVhZCh0ZW1wbGF0ZURldmtpdFBhdGgpIS50b1N0cmluZygpO1xuICAgICAgICBjb25zdCBsaW5lU3RhcnRzTWFwID0gY29tcHV0ZUxpbmVTdGFydHNNYXAoZmlsZUNvbnRlbnQpO1xuXG4gICAgICAgIHRoaXMucmVzb2x2ZWRUZW1wbGF0ZXMucHVzaCh7XG4gICAgICAgICAgZmlsZVBhdGg6IHRlbXBsYXRlRGlza1BhdGgsXG4gICAgICAgICAgY29udGFpbmVyOiBub2RlLFxuICAgICAgICAgIGNvbnRlbnQ6IGZpbGVDb250ZW50LFxuICAgICAgICAgIGlubGluZTogZmFsc2UsXG4gICAgICAgICAgc3RhcnQ6IDAsXG4gICAgICAgICAgZ2V0Q2hhcmFjdGVyQW5kTGluZU9mUG9zaXRpb246IHBvcyA9PiBnZXRMaW5lQW5kQ2hhcmFjdGVyRnJvbVBvc2l0aW9uKGxpbmVTdGFydHNNYXAsIHBvcyksXG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG59XG4iXX0=