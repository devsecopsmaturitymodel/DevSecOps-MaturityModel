"use strict";
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.MiscImportsMigration = void 0;
const schematics_1 = require("@angular/cdk/schematics");
const ts = require("typescript");
/**
 * Migration that detects import declarations that refer to outdated identifiers from
 * Angular Material which cannot be updated automatically.
 */
class MiscImportsMigration extends schematics_1.Migration {
    constructor() {
        super(...arguments);
        // Only enable this rule if the migration targets version 6. The rule
        // currently only includes migrations for V6 deprecations.
        this.enabled = this.targetVersion === schematics_1.TargetVersion.V6;
    }
    visitNode(node) {
        if (ts.isImportDeclaration(node)) {
            this._visitImportDeclaration(node);
        }
    }
    _visitImportDeclaration(node) {
        if (!(0, schematics_1.isMaterialImportDeclaration)(node) ||
            !node.importClause ||
            !node.importClause.namedBindings) {
            return;
        }
        const namedBindings = node.importClause.namedBindings;
        if (ts.isNamedImports(namedBindings)) {
            // Migration for: https://github.com/angular/components/pull/10405 (v6)
            this._checkAnimationConstants(namedBindings);
        }
    }
    /**
     * Checks for named imports that refer to the deleted animation constants.
     * https://github.com/angular/components/commit/9f3bf274c4f15f0b0fbd8ab7dbf1a453076e66d9
     */
    _checkAnimationConstants(namedImports) {
        namedImports.elements
            .filter(element => ts.isIdentifier(element.name))
            .forEach(element => {
            const importName = element.name.text;
            if (importName === 'SHOW_ANIMATION' || importName === 'HIDE_ANIMATION') {
                this.createFailureAtNode(element, `Found deprecated symbol "${importName}" which has been removed`);
            }
        });
    }
}
exports.MiscImportsMigration = MiscImportsMigration;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWlzYy1pbXBvcnRzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vc3JjL21hdGVyaWFsL3NjaGVtYXRpY3MvbmctdXBkYXRlL21pZ3JhdGlvbnMvbWlzYy1jaGVja3MvbWlzYy1pbXBvcnRzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7O0dBTUc7OztBQUVILHdEQUE4RjtBQUM5RixpQ0FBaUM7QUFFakM7OztHQUdHO0FBQ0gsTUFBYSxvQkFBcUIsU0FBUSxzQkFBZTtJQUF6RDs7UUFDRSxxRUFBcUU7UUFDckUsMERBQTBEO1FBQzFELFlBQU8sR0FBRyxJQUFJLENBQUMsYUFBYSxLQUFLLDBCQUFhLENBQUMsRUFBRSxDQUFDO0lBMkNwRCxDQUFDO0lBekNVLFNBQVMsQ0FBQyxJQUFhO1FBQzlCLElBQUksRUFBRSxDQUFDLG1CQUFtQixDQUFDLElBQUksQ0FBQyxFQUFFO1lBQ2hDLElBQUksQ0FBQyx1QkFBdUIsQ0FBQyxJQUFJLENBQUMsQ0FBQztTQUNwQztJQUNILENBQUM7SUFFTyx1QkFBdUIsQ0FBQyxJQUEwQjtRQUN4RCxJQUNFLENBQUMsSUFBQSx3Q0FBMkIsRUFBQyxJQUFJLENBQUM7WUFDbEMsQ0FBQyxJQUFJLENBQUMsWUFBWTtZQUNsQixDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsYUFBYSxFQUNoQztZQUNBLE9BQU87U0FDUjtRQUVELE1BQU0sYUFBYSxHQUFHLElBQUksQ0FBQyxZQUFZLENBQUMsYUFBYSxDQUFDO1FBRXRELElBQUksRUFBRSxDQUFDLGNBQWMsQ0FBQyxhQUFhLENBQUMsRUFBRTtZQUNwQyx1RUFBdUU7WUFDdkUsSUFBSSxDQUFDLHdCQUF3QixDQUFDLGFBQWEsQ0FBQyxDQUFDO1NBQzlDO0lBQ0gsQ0FBQztJQUVEOzs7T0FHRztJQUNLLHdCQUF3QixDQUFDLFlBQTZCO1FBQzVELFlBQVksQ0FBQyxRQUFRO2FBQ2xCLE1BQU0sQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxZQUFZLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDO2FBQ2hELE9BQU8sQ0FBQyxPQUFPLENBQUMsRUFBRTtZQUNqQixNQUFNLFVBQVUsR0FBRyxPQUFPLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQztZQUVyQyxJQUFJLFVBQVUsS0FBSyxnQkFBZ0IsSUFBSSxVQUFVLEtBQUssZ0JBQWdCLEVBQUU7Z0JBQ3RFLElBQUksQ0FBQyxtQkFBbUIsQ0FDdEIsT0FBTyxFQUNQLDRCQUE0QixVQUFVLDBCQUEwQixDQUNqRSxDQUFDO2FBQ0g7UUFDSCxDQUFDLENBQUMsQ0FBQztJQUNQLENBQUM7Q0FDRjtBQTlDRCxvREE4Q0MiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtpc01hdGVyaWFsSW1wb3J0RGVjbGFyYXRpb24sIE1pZ3JhdGlvbiwgVGFyZ2V0VmVyc2lvbn0gZnJvbSAnQGFuZ3VsYXIvY2RrL3NjaGVtYXRpY3MnO1xuaW1wb3J0ICogYXMgdHMgZnJvbSAndHlwZXNjcmlwdCc7XG5cbi8qKlxuICogTWlncmF0aW9uIHRoYXQgZGV0ZWN0cyBpbXBvcnQgZGVjbGFyYXRpb25zIHRoYXQgcmVmZXIgdG8gb3V0ZGF0ZWQgaWRlbnRpZmllcnMgZnJvbVxuICogQW5ndWxhciBNYXRlcmlhbCB3aGljaCBjYW5ub3QgYmUgdXBkYXRlZCBhdXRvbWF0aWNhbGx5LlxuICovXG5leHBvcnQgY2xhc3MgTWlzY0ltcG9ydHNNaWdyYXRpb24gZXh0ZW5kcyBNaWdyYXRpb248bnVsbD4ge1xuICAvLyBPbmx5IGVuYWJsZSB0aGlzIHJ1bGUgaWYgdGhlIG1pZ3JhdGlvbiB0YXJnZXRzIHZlcnNpb24gNi4gVGhlIHJ1bGVcbiAgLy8gY3VycmVudGx5IG9ubHkgaW5jbHVkZXMgbWlncmF0aW9ucyBmb3IgVjYgZGVwcmVjYXRpb25zLlxuICBlbmFibGVkID0gdGhpcy50YXJnZXRWZXJzaW9uID09PSBUYXJnZXRWZXJzaW9uLlY2O1xuXG4gIG92ZXJyaWRlIHZpc2l0Tm9kZShub2RlOiB0cy5Ob2RlKTogdm9pZCB7XG4gICAgaWYgKHRzLmlzSW1wb3J0RGVjbGFyYXRpb24obm9kZSkpIHtcbiAgICAgIHRoaXMuX3Zpc2l0SW1wb3J0RGVjbGFyYXRpb24obm9kZSk7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBfdmlzaXRJbXBvcnREZWNsYXJhdGlvbihub2RlOiB0cy5JbXBvcnREZWNsYXJhdGlvbikge1xuICAgIGlmIChcbiAgICAgICFpc01hdGVyaWFsSW1wb3J0RGVjbGFyYXRpb24obm9kZSkgfHxcbiAgICAgICFub2RlLmltcG9ydENsYXVzZSB8fFxuICAgICAgIW5vZGUuaW1wb3J0Q2xhdXNlLm5hbWVkQmluZGluZ3NcbiAgICApIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCBuYW1lZEJpbmRpbmdzID0gbm9kZS5pbXBvcnRDbGF1c2UubmFtZWRCaW5kaW5ncztcblxuICAgIGlmICh0cy5pc05hbWVkSW1wb3J0cyhuYW1lZEJpbmRpbmdzKSkge1xuICAgICAgLy8gTWlncmF0aW9uIGZvcjogaHR0cHM6Ly9naXRodWIuY29tL2FuZ3VsYXIvY29tcG9uZW50cy9wdWxsLzEwNDA1ICh2NilcbiAgICAgIHRoaXMuX2NoZWNrQW5pbWF0aW9uQ29uc3RhbnRzKG5hbWVkQmluZGluZ3MpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBDaGVja3MgZm9yIG5hbWVkIGltcG9ydHMgdGhhdCByZWZlciB0byB0aGUgZGVsZXRlZCBhbmltYXRpb24gY29uc3RhbnRzLlxuICAgKiBodHRwczovL2dpdGh1Yi5jb20vYW5ndWxhci9jb21wb25lbnRzL2NvbW1pdC85ZjNiZjI3NGM0ZjE1ZjBiMGZiZDhhYjdkYmYxYTQ1MzA3NmU2NmQ5XG4gICAqL1xuICBwcml2YXRlIF9jaGVja0FuaW1hdGlvbkNvbnN0YW50cyhuYW1lZEltcG9ydHM6IHRzLk5hbWVkSW1wb3J0cykge1xuICAgIG5hbWVkSW1wb3J0cy5lbGVtZW50c1xuICAgICAgLmZpbHRlcihlbGVtZW50ID0+IHRzLmlzSWRlbnRpZmllcihlbGVtZW50Lm5hbWUpKVxuICAgICAgLmZvckVhY2goZWxlbWVudCA9PiB7XG4gICAgICAgIGNvbnN0IGltcG9ydE5hbWUgPSBlbGVtZW50Lm5hbWUudGV4dDtcblxuICAgICAgICBpZiAoaW1wb3J0TmFtZSA9PT0gJ1NIT1dfQU5JTUFUSU9OJyB8fCBpbXBvcnROYW1lID09PSAnSElERV9BTklNQVRJT04nKSB7XG4gICAgICAgICAgdGhpcy5jcmVhdGVGYWlsdXJlQXROb2RlKFxuICAgICAgICAgICAgZWxlbWVudCxcbiAgICAgICAgICAgIGBGb3VuZCBkZXByZWNhdGVkIHN5bWJvbCBcIiR7aW1wb3J0TmFtZX1cIiB3aGljaCBoYXMgYmVlbiByZW1vdmVkYCxcbiAgICAgICAgICApO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgfVxufVxuIl19