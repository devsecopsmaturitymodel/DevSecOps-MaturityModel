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
        define("@angular/core/schematics/migrations/entry-components/util", ["require", "exports", "typescript", "@angular/core/schematics/utils/typescript/decorators"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.migrateEntryComponentsUsages = void 0;
    const typescript_1 = __importDefault(require("typescript"));
    const decorators_1 = require("@angular/core/schematics/utils/typescript/decorators");
    /** Finds and migrates all Angular decorators that pass in `entryComponents`. */
    function migrateEntryComponentsUsages(typeChecker, printer, sourceFile) {
        const results = [];
        sourceFile.forEachChild(function walk(node) {
            if (typescript_1.default.isDecorator(node) && typescript_1.default.isCallExpression(node.expression) &&
                node.expression.arguments.length === 1 &&
                typescript_1.default.isObjectLiteralExpression(node.expression.arguments[0])) {
                const analysis = (0, decorators_1.getCallDecoratorImport)(typeChecker, node);
                if (analysis && analysis.importModule === '@angular/core' &&
                    (analysis.name === 'Component' || analysis.name === 'NgModule')) {
                    const literal = node.expression.arguments[0];
                    const entryComponentsProp = literal.properties.find(property => typescript_1.default.isPropertyAssignment(property) && typescript_1.default.isIdentifier(property.name) &&
                        property.name.text === 'entryComponents');
                    if (entryComponentsProp) {
                        const replacementNode = typescript_1.default.updateObjectLiteral(literal, literal.properties.filter(prop => prop !== entryComponentsProp));
                        results.push({
                            start: literal.getStart(),
                            length: literal.getWidth(),
                            end: literal.getEnd(),
                            replacement: printer.printNode(typescript_1.default.EmitHint.Unspecified, replacementNode, sourceFile)
                        });
                    }
                }
            }
            node.forEachChild(walk);
        });
        // Sort the operations in reverse order in order to avoid
        // issues when migrating multiple usages within the same file.
        return results.sort((a, b) => b.start - a.start);
    }
    exports.migrateEntryComponentsUsages = migrateEntryComponentsUsages;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXRpbC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2NvcmUvc2NoZW1hdGljcy9taWdyYXRpb25zL2VudHJ5LWNvbXBvbmVudHMvdXRpbC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0dBTUc7Ozs7Ozs7Ozs7Ozs7Ozs7SUFFSCw0REFBNEI7SUFFNUIscUZBQXlFO0lBRXpFLGdGQUFnRjtJQUNoRixTQUFnQiw0QkFBNEIsQ0FDeEMsV0FBMkIsRUFBRSxPQUFtQixFQUFFLFVBQXlCO1FBQzdFLE1BQU0sT0FBTyxHQUF3RSxFQUFFLENBQUM7UUFFeEYsVUFBVSxDQUFDLFlBQVksQ0FBQyxTQUFTLElBQUksQ0FBQyxJQUFhO1lBQ2pELElBQUksb0JBQUUsQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLElBQUksb0JBQUUsQ0FBQyxnQkFBZ0IsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDO2dCQUM1RCxJQUFJLENBQUMsVUFBVSxDQUFDLFNBQVMsQ0FBQyxNQUFNLEtBQUssQ0FBQztnQkFDdEMsb0JBQUUsQ0FBQyx5QkFBeUIsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFO2dCQUM5RCxNQUFNLFFBQVEsR0FBRyxJQUFBLG1DQUFzQixFQUFDLFdBQVcsRUFBRSxJQUFJLENBQUMsQ0FBQztnQkFFM0QsSUFBSSxRQUFRLElBQUksUUFBUSxDQUFDLFlBQVksS0FBSyxlQUFlO29CQUNyRCxDQUFDLFFBQVEsQ0FBQyxJQUFJLEtBQUssV0FBVyxJQUFJLFFBQVEsQ0FBQyxJQUFJLEtBQUssVUFBVSxDQUFDLEVBQUU7b0JBQ25FLE1BQU0sT0FBTyxHQUFHLElBQUksQ0FBQyxVQUFVLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDO29CQUM3QyxNQUFNLG1CQUFtQixHQUFHLE9BQU8sQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUMvQyxRQUFRLENBQUMsRUFBRSxDQUFDLG9CQUFFLENBQUMsb0JBQW9CLENBQUMsUUFBUSxDQUFDLElBQUksb0JBQUUsQ0FBQyxZQUFZLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQzt3QkFDM0UsUUFBUSxDQUFDLElBQUksQ0FBQyxJQUFJLEtBQUssaUJBQWlCLENBQUMsQ0FBQztvQkFFbEQsSUFBSSxtQkFBbUIsRUFBRTt3QkFDdkIsTUFBTSxlQUFlLEdBQUcsb0JBQUUsQ0FBQyxtQkFBbUIsQ0FDMUMsT0FBTyxFQUFFLE9BQU8sQ0FBQyxVQUFVLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsSUFBSSxLQUFLLG1CQUFtQixDQUFDLENBQUMsQ0FBQzt3QkFFOUUsT0FBTyxDQUFDLElBQUksQ0FBQzs0QkFDWCxLQUFLLEVBQUUsT0FBTyxDQUFDLFFBQVEsRUFBRTs0QkFDekIsTUFBTSxFQUFFLE9BQU8sQ0FBQyxRQUFRLEVBQUU7NEJBQzFCLEdBQUcsRUFBRSxPQUFPLENBQUMsTUFBTSxFQUFFOzRCQUNyQixXQUFXLEVBQUUsT0FBTyxDQUFDLFNBQVMsQ0FBQyxvQkFBRSxDQUFDLFFBQVEsQ0FBQyxXQUFXLEVBQUUsZUFBZSxFQUFFLFVBQVUsQ0FBQzt5QkFDckYsQ0FBQyxDQUFDO3FCQUNKO2lCQUNGO2FBQ0Y7WUFFRCxJQUFJLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQzFCLENBQUMsQ0FBQyxDQUFDO1FBRUgseURBQXlEO1FBQ3pELDhEQUE4RDtRQUM5RCxPQUFPLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUMsS0FBSyxHQUFHLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUNuRCxDQUFDO0lBckNELG9FQXFDQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQgdHMgZnJvbSAndHlwZXNjcmlwdCc7XG5cbmltcG9ydCB7Z2V0Q2FsbERlY29yYXRvckltcG9ydH0gZnJvbSAnLi4vLi4vdXRpbHMvdHlwZXNjcmlwdC9kZWNvcmF0b3JzJztcblxuLyoqIEZpbmRzIGFuZCBtaWdyYXRlcyBhbGwgQW5ndWxhciBkZWNvcmF0b3JzIHRoYXQgcGFzcyBpbiBgZW50cnlDb21wb25lbnRzYC4gKi9cbmV4cG9ydCBmdW5jdGlvbiBtaWdyYXRlRW50cnlDb21wb25lbnRzVXNhZ2VzKFxuICAgIHR5cGVDaGVja2VyOiB0cy5UeXBlQ2hlY2tlciwgcHJpbnRlcjogdHMuUHJpbnRlciwgc291cmNlRmlsZTogdHMuU291cmNlRmlsZSkge1xuICBjb25zdCByZXN1bHRzOiB7c3RhcnQ6IG51bWJlciwgbGVuZ3RoOiBudW1iZXIsIGVuZDogbnVtYmVyLCByZXBsYWNlbWVudDogc3RyaW5nfVtdID0gW107XG5cbiAgc291cmNlRmlsZS5mb3JFYWNoQ2hpbGQoZnVuY3Rpb24gd2Fsayhub2RlOiB0cy5Ob2RlKSB7XG4gICAgaWYgKHRzLmlzRGVjb3JhdG9yKG5vZGUpICYmIHRzLmlzQ2FsbEV4cHJlc3Npb24obm9kZS5leHByZXNzaW9uKSAmJlxuICAgICAgICBub2RlLmV4cHJlc3Npb24uYXJndW1lbnRzLmxlbmd0aCA9PT0gMSAmJlxuICAgICAgICB0cy5pc09iamVjdExpdGVyYWxFeHByZXNzaW9uKG5vZGUuZXhwcmVzc2lvbi5hcmd1bWVudHNbMF0pKSB7XG4gICAgICBjb25zdCBhbmFseXNpcyA9IGdldENhbGxEZWNvcmF0b3JJbXBvcnQodHlwZUNoZWNrZXIsIG5vZGUpO1xuXG4gICAgICBpZiAoYW5hbHlzaXMgJiYgYW5hbHlzaXMuaW1wb3J0TW9kdWxlID09PSAnQGFuZ3VsYXIvY29yZScgJiZcbiAgICAgICAgICAoYW5hbHlzaXMubmFtZSA9PT0gJ0NvbXBvbmVudCcgfHwgYW5hbHlzaXMubmFtZSA9PT0gJ05nTW9kdWxlJykpIHtcbiAgICAgICAgY29uc3QgbGl0ZXJhbCA9IG5vZGUuZXhwcmVzc2lvbi5hcmd1bWVudHNbMF07XG4gICAgICAgIGNvbnN0IGVudHJ5Q29tcG9uZW50c1Byb3AgPSBsaXRlcmFsLnByb3BlcnRpZXMuZmluZChcbiAgICAgICAgICAgIHByb3BlcnR5ID0+IHRzLmlzUHJvcGVydHlBc3NpZ25tZW50KHByb3BlcnR5KSAmJiB0cy5pc0lkZW50aWZpZXIocHJvcGVydHkubmFtZSkgJiZcbiAgICAgICAgICAgICAgICBwcm9wZXJ0eS5uYW1lLnRleHQgPT09ICdlbnRyeUNvbXBvbmVudHMnKTtcblxuICAgICAgICBpZiAoZW50cnlDb21wb25lbnRzUHJvcCkge1xuICAgICAgICAgIGNvbnN0IHJlcGxhY2VtZW50Tm9kZSA9IHRzLnVwZGF0ZU9iamVjdExpdGVyYWwoXG4gICAgICAgICAgICAgIGxpdGVyYWwsIGxpdGVyYWwucHJvcGVydGllcy5maWx0ZXIocHJvcCA9PiBwcm9wICE9PSBlbnRyeUNvbXBvbmVudHNQcm9wKSk7XG5cbiAgICAgICAgICByZXN1bHRzLnB1c2goe1xuICAgICAgICAgICAgc3RhcnQ6IGxpdGVyYWwuZ2V0U3RhcnQoKSxcbiAgICAgICAgICAgIGxlbmd0aDogbGl0ZXJhbC5nZXRXaWR0aCgpLFxuICAgICAgICAgICAgZW5kOiBsaXRlcmFsLmdldEVuZCgpLFxuICAgICAgICAgICAgcmVwbGFjZW1lbnQ6IHByaW50ZXIucHJpbnROb2RlKHRzLkVtaXRIaW50LlVuc3BlY2lmaWVkLCByZXBsYWNlbWVudE5vZGUsIHNvdXJjZUZpbGUpXG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICBub2RlLmZvckVhY2hDaGlsZCh3YWxrKTtcbiAgfSk7XG5cbiAgLy8gU29ydCB0aGUgb3BlcmF0aW9ucyBpbiByZXZlcnNlIG9yZGVyIGluIG9yZGVyIHRvIGF2b2lkXG4gIC8vIGlzc3VlcyB3aGVuIG1pZ3JhdGluZyBtdWx0aXBsZSB1c2FnZXMgd2l0aGluIHRoZSBzYW1lIGZpbGUuXG4gIHJldHVybiByZXN1bHRzLnNvcnQoKGEsIGIpID0+IGIuc3RhcnQgLSBhLnN0YXJ0KTtcbn1cbiJdfQ==