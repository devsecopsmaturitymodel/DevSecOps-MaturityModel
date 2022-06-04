"use strict";
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClassNamesMigration = void 0;
const ts = require("typescript");
const migration_1 = require("../../update-tool/migration");
const imports_1 = require("../typescript/imports");
const module_specifiers_1 = require("../typescript/module-specifiers");
const upgrade_data_1 = require("../upgrade-data");
/**
 * Migration that walks through every identifier that is part of Angular Material or thr CDK
 * and replaces the outdated name with the new one if specified in the upgrade data.
 */
// TODO: rework this rule to identify symbols using the import identifier resolver. This
// makes it more robust, less AST convoluted and is more TypeScript AST idiomatic. COMP-300.
class ClassNamesMigration extends migration_1.Migration {
    constructor() {
        super(...arguments);
        /** Change data that upgrades to the specified target version. */
        this.data = (0, upgrade_data_1.getVersionUpgradeData)(this, 'classNames');
        /**
         * List of identifier names that have been imported from `@angular/material` or `@angular/cdk`
         * in the current source file and therefore can be considered trusted.
         */
        this.trustedIdentifiers = new Set();
        /** List of namespaces that have been imported from `@angular/material` or `@angular/cdk`. */
        this.trustedNamespaces = new Set();
        // Only enable the migration rule if there is upgrade data.
        this.enabled = this.data.length !== 0;
    }
    visitNode(node) {
        if (ts.isIdentifier(node)) {
            this._visitIdentifier(node);
        }
    }
    /** Method that is called for every identifier inside of the specified project. */
    _visitIdentifier(identifier) {
        // For identifiers that aren't listed in the className data, the whole check can be
        // skipped safely.
        if (!this.data.some(data => data.replace === identifier.text)) {
            return;
        }
        // For namespace imports that are referring to Angular Material or the CDK, we store the
        // namespace name in order to be able to safely find identifiers that don't belong to the
        // developer's application.
        if ((0, imports_1.isNamespaceImportNode)(identifier) && (0, module_specifiers_1.isMaterialImportDeclaration)(identifier)) {
            this.trustedNamespaces.add(identifier.text);
            return this._createFailureWithReplacement(identifier);
        }
        // For export declarations that are referring to Angular Material or the CDK, the identifier
        // can be immediately updated to the new name.
        if ((0, imports_1.isExportSpecifierNode)(identifier) && (0, module_specifiers_1.isMaterialExportDeclaration)(identifier)) {
            return this._createFailureWithReplacement(identifier);
        }
        // For import declarations that are referring to Angular Material or the CDK, the name of
        // the import identifiers. This allows us to identify identifiers that belong to Material and
        // the CDK, and we won't accidentally touch a developer's identifier.
        if ((0, imports_1.isImportSpecifierNode)(identifier) && (0, module_specifiers_1.isMaterialImportDeclaration)(identifier)) {
            this.trustedIdentifiers.add(identifier.text);
            return this._createFailureWithReplacement(identifier);
        }
        // In case the identifier is part of a property access expression, we need to verify that the
        // property access originates from a namespace that has been imported from Material or the CDK.
        if (ts.isPropertyAccessExpression(identifier.parent)) {
            const expression = identifier.parent.expression;
            if (ts.isIdentifier(expression) && this.trustedNamespaces.has(expression.text)) {
                return this._createFailureWithReplacement(identifier);
            }
        }
        else if (this.trustedIdentifiers.has(identifier.text)) {
            return this._createFailureWithReplacement(identifier);
        }
    }
    /** Creates a failure and replacement for the specified identifier. */
    _createFailureWithReplacement(identifier) {
        const classData = this.data.find(data => data.replace === identifier.text);
        const filePath = this.fileSystem.resolve(identifier.getSourceFile().fileName);
        this.fileSystem
            .edit(filePath)
            .remove(identifier.getStart(), identifier.getWidth())
            .insertRight(identifier.getStart(), classData.replaceWith);
    }
}
exports.ClassNamesMigration = ClassNamesMigration;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2xhc3MtbmFtZXMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9zcmMvY2RrL3NjaGVtYXRpY3MvbmctdXBkYXRlL21pZ3JhdGlvbnMvY2xhc3MtbmFtZXMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7R0FNRzs7O0FBRUgsaUNBQWlDO0FBQ2pDLDJEQUFzRDtBQUd0RCxtREFJK0I7QUFDL0IsdUVBR3lDO0FBQ3pDLGtEQUFtRTtBQUVuRTs7O0dBR0c7QUFDSCx3RkFBd0Y7QUFDeEYsNEZBQTRGO0FBQzVGLE1BQWEsbUJBQW9CLFNBQVEscUJBQXNCO0lBQS9EOztRQUNFLGlFQUFpRTtRQUNqRSxTQUFJLEdBQTJCLElBQUEsb0NBQXFCLEVBQUMsSUFBSSxFQUFFLFlBQVksQ0FBQyxDQUFDO1FBRXpFOzs7V0FHRztRQUNILHVCQUFrQixHQUFnQixJQUFJLEdBQUcsRUFBRSxDQUFDO1FBRTVDLDZGQUE2RjtRQUM3RixzQkFBaUIsR0FBZ0IsSUFBSSxHQUFHLEVBQUUsQ0FBQztRQUUzQywyREFBMkQ7UUFDM0QsWUFBTyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxLQUFLLENBQUMsQ0FBQztJQStEbkMsQ0FBQztJQTdEVSxTQUFTLENBQUMsSUFBYTtRQUM5QixJQUFJLEVBQUUsQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLEVBQUU7WUFDekIsSUFBSSxDQUFDLGdCQUFnQixDQUFDLElBQUksQ0FBQyxDQUFDO1NBQzdCO0lBQ0gsQ0FBQztJQUVELGtGQUFrRjtJQUMxRSxnQkFBZ0IsQ0FBQyxVQUF5QjtRQUNoRCxtRkFBbUY7UUFDbkYsa0JBQWtCO1FBQ2xCLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxPQUFPLEtBQUssVUFBVSxDQUFDLElBQUksQ0FBQyxFQUFFO1lBQzdELE9BQU87U0FDUjtRQUVELHdGQUF3RjtRQUN4Rix5RkFBeUY7UUFDekYsMkJBQTJCO1FBQzNCLElBQUksSUFBQSwrQkFBcUIsRUFBQyxVQUFVLENBQUMsSUFBSSxJQUFBLCtDQUEyQixFQUFDLFVBQVUsQ0FBQyxFQUFFO1lBQ2hGLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxDQUFDO1lBRTVDLE9BQU8sSUFBSSxDQUFDLDZCQUE2QixDQUFDLFVBQVUsQ0FBQyxDQUFDO1NBQ3ZEO1FBRUQsNEZBQTRGO1FBQzVGLDhDQUE4QztRQUM5QyxJQUFJLElBQUEsK0JBQXFCLEVBQUMsVUFBVSxDQUFDLElBQUksSUFBQSwrQ0FBMkIsRUFBQyxVQUFVLENBQUMsRUFBRTtZQUNoRixPQUFPLElBQUksQ0FBQyw2QkFBNkIsQ0FBQyxVQUFVLENBQUMsQ0FBQztTQUN2RDtRQUVELHlGQUF5RjtRQUN6Riw2RkFBNkY7UUFDN0YscUVBQXFFO1FBQ3JFLElBQUksSUFBQSwrQkFBcUIsRUFBQyxVQUFVLENBQUMsSUFBSSxJQUFBLCtDQUEyQixFQUFDLFVBQVUsQ0FBQyxFQUFFO1lBQ2hGLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxDQUFDO1lBRTdDLE9BQU8sSUFBSSxDQUFDLDZCQUE2QixDQUFDLFVBQVUsQ0FBQyxDQUFDO1NBQ3ZEO1FBRUQsNkZBQTZGO1FBQzdGLCtGQUErRjtRQUMvRixJQUFJLEVBQUUsQ0FBQywwQkFBMEIsQ0FBQyxVQUFVLENBQUMsTUFBTSxDQUFDLEVBQUU7WUFDcEQsTUFBTSxVQUFVLEdBQUcsVUFBVSxDQUFDLE1BQU0sQ0FBQyxVQUFVLENBQUM7WUFFaEQsSUFBSSxFQUFFLENBQUMsWUFBWSxDQUFDLFVBQVUsQ0FBQyxJQUFJLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxFQUFFO2dCQUM5RSxPQUFPLElBQUksQ0FBQyw2QkFBNkIsQ0FBQyxVQUFVLENBQUMsQ0FBQzthQUN2RDtTQUNGO2FBQU0sSUFBSSxJQUFJLENBQUMsa0JBQWtCLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsRUFBRTtZQUN2RCxPQUFPLElBQUksQ0FBQyw2QkFBNkIsQ0FBQyxVQUFVLENBQUMsQ0FBQztTQUN2RDtJQUNILENBQUM7SUFFRCxzRUFBc0U7SUFDOUQsNkJBQTZCLENBQUMsVUFBeUI7UUFDN0QsTUFBTSxTQUFTLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsT0FBTyxLQUFLLFVBQVUsQ0FBQyxJQUFJLENBQUUsQ0FBQztRQUM1RSxNQUFNLFFBQVEsR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFDLE9BQU8sQ0FBQyxVQUFVLENBQUMsYUFBYSxFQUFFLENBQUMsUUFBUSxDQUFDLENBQUM7UUFFOUUsSUFBSSxDQUFDLFVBQVU7YUFDWixJQUFJLENBQUMsUUFBUSxDQUFDO2FBQ2QsTUFBTSxDQUFDLFVBQVUsQ0FBQyxRQUFRLEVBQUUsRUFBRSxVQUFVLENBQUMsUUFBUSxFQUFFLENBQUM7YUFDcEQsV0FBVyxDQUFDLFVBQVUsQ0FBQyxRQUFRLEVBQUUsRUFBRSxTQUFTLENBQUMsV0FBVyxDQUFDLENBQUM7SUFDL0QsQ0FBQztDQUNGO0FBN0VELGtEQTZFQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQgKiBhcyB0cyBmcm9tICd0eXBlc2NyaXB0JztcbmltcG9ydCB7TWlncmF0aW9ufSBmcm9tICcuLi8uLi91cGRhdGUtdG9vbC9taWdyYXRpb24nO1xuXG5pbXBvcnQge0NsYXNzTmFtZVVwZ3JhZGVEYXRhfSBmcm9tICcuLi9kYXRhJztcbmltcG9ydCB7XG4gIGlzRXhwb3J0U3BlY2lmaWVyTm9kZSxcbiAgaXNJbXBvcnRTcGVjaWZpZXJOb2RlLFxuICBpc05hbWVzcGFjZUltcG9ydE5vZGUsXG59IGZyb20gJy4uL3R5cGVzY3JpcHQvaW1wb3J0cyc7XG5pbXBvcnQge1xuICBpc01hdGVyaWFsRXhwb3J0RGVjbGFyYXRpb24sXG4gIGlzTWF0ZXJpYWxJbXBvcnREZWNsYXJhdGlvbixcbn0gZnJvbSAnLi4vdHlwZXNjcmlwdC9tb2R1bGUtc3BlY2lmaWVycyc7XG5pbXBvcnQge2dldFZlcnNpb25VcGdyYWRlRGF0YSwgVXBncmFkZURhdGF9IGZyb20gJy4uL3VwZ3JhZGUtZGF0YSc7XG5cbi8qKlxuICogTWlncmF0aW9uIHRoYXQgd2Fsa3MgdGhyb3VnaCBldmVyeSBpZGVudGlmaWVyIHRoYXQgaXMgcGFydCBvZiBBbmd1bGFyIE1hdGVyaWFsIG9yIHRociBDREtcbiAqIGFuZCByZXBsYWNlcyB0aGUgb3V0ZGF0ZWQgbmFtZSB3aXRoIHRoZSBuZXcgb25lIGlmIHNwZWNpZmllZCBpbiB0aGUgdXBncmFkZSBkYXRhLlxuICovXG4vLyBUT0RPOiByZXdvcmsgdGhpcyBydWxlIHRvIGlkZW50aWZ5IHN5bWJvbHMgdXNpbmcgdGhlIGltcG9ydCBpZGVudGlmaWVyIHJlc29sdmVyLiBUaGlzXG4vLyBtYWtlcyBpdCBtb3JlIHJvYnVzdCwgbGVzcyBBU1QgY29udm9sdXRlZCBhbmQgaXMgbW9yZSBUeXBlU2NyaXB0IEFTVCBpZGlvbWF0aWMuIENPTVAtMzAwLlxuZXhwb3J0IGNsYXNzIENsYXNzTmFtZXNNaWdyYXRpb24gZXh0ZW5kcyBNaWdyYXRpb248VXBncmFkZURhdGE+IHtcbiAgLyoqIENoYW5nZSBkYXRhIHRoYXQgdXBncmFkZXMgdG8gdGhlIHNwZWNpZmllZCB0YXJnZXQgdmVyc2lvbi4gKi9cbiAgZGF0YTogQ2xhc3NOYW1lVXBncmFkZURhdGFbXSA9IGdldFZlcnNpb25VcGdyYWRlRGF0YSh0aGlzLCAnY2xhc3NOYW1lcycpO1xuXG4gIC8qKlxuICAgKiBMaXN0IG9mIGlkZW50aWZpZXIgbmFtZXMgdGhhdCBoYXZlIGJlZW4gaW1wb3J0ZWQgZnJvbSBgQGFuZ3VsYXIvbWF0ZXJpYWxgIG9yIGBAYW5ndWxhci9jZGtgXG4gICAqIGluIHRoZSBjdXJyZW50IHNvdXJjZSBmaWxlIGFuZCB0aGVyZWZvcmUgY2FuIGJlIGNvbnNpZGVyZWQgdHJ1c3RlZC5cbiAgICovXG4gIHRydXN0ZWRJZGVudGlmaWVyczogU2V0PHN0cmluZz4gPSBuZXcgU2V0KCk7XG5cbiAgLyoqIExpc3Qgb2YgbmFtZXNwYWNlcyB0aGF0IGhhdmUgYmVlbiBpbXBvcnRlZCBmcm9tIGBAYW5ndWxhci9tYXRlcmlhbGAgb3IgYEBhbmd1bGFyL2Nka2AuICovXG4gIHRydXN0ZWROYW1lc3BhY2VzOiBTZXQ8c3RyaW5nPiA9IG5ldyBTZXQoKTtcblxuICAvLyBPbmx5IGVuYWJsZSB0aGUgbWlncmF0aW9uIHJ1bGUgaWYgdGhlcmUgaXMgdXBncmFkZSBkYXRhLlxuICBlbmFibGVkID0gdGhpcy5kYXRhLmxlbmd0aCAhPT0gMDtcblxuICBvdmVycmlkZSB2aXNpdE5vZGUobm9kZTogdHMuTm9kZSk6IHZvaWQge1xuICAgIGlmICh0cy5pc0lkZW50aWZpZXIobm9kZSkpIHtcbiAgICAgIHRoaXMuX3Zpc2l0SWRlbnRpZmllcihub2RlKTtcbiAgICB9XG4gIH1cblxuICAvKiogTWV0aG9kIHRoYXQgaXMgY2FsbGVkIGZvciBldmVyeSBpZGVudGlmaWVyIGluc2lkZSBvZiB0aGUgc3BlY2lmaWVkIHByb2plY3QuICovXG4gIHByaXZhdGUgX3Zpc2l0SWRlbnRpZmllcihpZGVudGlmaWVyOiB0cy5JZGVudGlmaWVyKSB7XG4gICAgLy8gRm9yIGlkZW50aWZpZXJzIHRoYXQgYXJlbid0IGxpc3RlZCBpbiB0aGUgY2xhc3NOYW1lIGRhdGEsIHRoZSB3aG9sZSBjaGVjayBjYW4gYmVcbiAgICAvLyBza2lwcGVkIHNhZmVseS5cbiAgICBpZiAoIXRoaXMuZGF0YS5zb21lKGRhdGEgPT4gZGF0YS5yZXBsYWNlID09PSBpZGVudGlmaWVyLnRleHQpKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgLy8gRm9yIG5hbWVzcGFjZSBpbXBvcnRzIHRoYXQgYXJlIHJlZmVycmluZyB0byBBbmd1bGFyIE1hdGVyaWFsIG9yIHRoZSBDREssIHdlIHN0b3JlIHRoZVxuICAgIC8vIG5hbWVzcGFjZSBuYW1lIGluIG9yZGVyIHRvIGJlIGFibGUgdG8gc2FmZWx5IGZpbmQgaWRlbnRpZmllcnMgdGhhdCBkb24ndCBiZWxvbmcgdG8gdGhlXG4gICAgLy8gZGV2ZWxvcGVyJ3MgYXBwbGljYXRpb24uXG4gICAgaWYgKGlzTmFtZXNwYWNlSW1wb3J0Tm9kZShpZGVudGlmaWVyKSAmJiBpc01hdGVyaWFsSW1wb3J0RGVjbGFyYXRpb24oaWRlbnRpZmllcikpIHtcbiAgICAgIHRoaXMudHJ1c3RlZE5hbWVzcGFjZXMuYWRkKGlkZW50aWZpZXIudGV4dCk7XG5cbiAgICAgIHJldHVybiB0aGlzLl9jcmVhdGVGYWlsdXJlV2l0aFJlcGxhY2VtZW50KGlkZW50aWZpZXIpO1xuICAgIH1cblxuICAgIC8vIEZvciBleHBvcnQgZGVjbGFyYXRpb25zIHRoYXQgYXJlIHJlZmVycmluZyB0byBBbmd1bGFyIE1hdGVyaWFsIG9yIHRoZSBDREssIHRoZSBpZGVudGlmaWVyXG4gICAgLy8gY2FuIGJlIGltbWVkaWF0ZWx5IHVwZGF0ZWQgdG8gdGhlIG5ldyBuYW1lLlxuICAgIGlmIChpc0V4cG9ydFNwZWNpZmllck5vZGUoaWRlbnRpZmllcikgJiYgaXNNYXRlcmlhbEV4cG9ydERlY2xhcmF0aW9uKGlkZW50aWZpZXIpKSB7XG4gICAgICByZXR1cm4gdGhpcy5fY3JlYXRlRmFpbHVyZVdpdGhSZXBsYWNlbWVudChpZGVudGlmaWVyKTtcbiAgICB9XG5cbiAgICAvLyBGb3IgaW1wb3J0IGRlY2xhcmF0aW9ucyB0aGF0IGFyZSByZWZlcnJpbmcgdG8gQW5ndWxhciBNYXRlcmlhbCBvciB0aGUgQ0RLLCB0aGUgbmFtZSBvZlxuICAgIC8vIHRoZSBpbXBvcnQgaWRlbnRpZmllcnMuIFRoaXMgYWxsb3dzIHVzIHRvIGlkZW50aWZ5IGlkZW50aWZpZXJzIHRoYXQgYmVsb25nIHRvIE1hdGVyaWFsIGFuZFxuICAgIC8vIHRoZSBDREssIGFuZCB3ZSB3b24ndCBhY2NpZGVudGFsbHkgdG91Y2ggYSBkZXZlbG9wZXIncyBpZGVudGlmaWVyLlxuICAgIGlmIChpc0ltcG9ydFNwZWNpZmllck5vZGUoaWRlbnRpZmllcikgJiYgaXNNYXRlcmlhbEltcG9ydERlY2xhcmF0aW9uKGlkZW50aWZpZXIpKSB7XG4gICAgICB0aGlzLnRydXN0ZWRJZGVudGlmaWVycy5hZGQoaWRlbnRpZmllci50ZXh0KTtcblxuICAgICAgcmV0dXJuIHRoaXMuX2NyZWF0ZUZhaWx1cmVXaXRoUmVwbGFjZW1lbnQoaWRlbnRpZmllcik7XG4gICAgfVxuXG4gICAgLy8gSW4gY2FzZSB0aGUgaWRlbnRpZmllciBpcyBwYXJ0IG9mIGEgcHJvcGVydHkgYWNjZXNzIGV4cHJlc3Npb24sIHdlIG5lZWQgdG8gdmVyaWZ5IHRoYXQgdGhlXG4gICAgLy8gcHJvcGVydHkgYWNjZXNzIG9yaWdpbmF0ZXMgZnJvbSBhIG5hbWVzcGFjZSB0aGF0IGhhcyBiZWVuIGltcG9ydGVkIGZyb20gTWF0ZXJpYWwgb3IgdGhlIENESy5cbiAgICBpZiAodHMuaXNQcm9wZXJ0eUFjY2Vzc0V4cHJlc3Npb24oaWRlbnRpZmllci5wYXJlbnQpKSB7XG4gICAgICBjb25zdCBleHByZXNzaW9uID0gaWRlbnRpZmllci5wYXJlbnQuZXhwcmVzc2lvbjtcblxuICAgICAgaWYgKHRzLmlzSWRlbnRpZmllcihleHByZXNzaW9uKSAmJiB0aGlzLnRydXN0ZWROYW1lc3BhY2VzLmhhcyhleHByZXNzaW9uLnRleHQpKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9jcmVhdGVGYWlsdXJlV2l0aFJlcGxhY2VtZW50KGlkZW50aWZpZXIpO1xuICAgICAgfVxuICAgIH0gZWxzZSBpZiAodGhpcy50cnVzdGVkSWRlbnRpZmllcnMuaGFzKGlkZW50aWZpZXIudGV4dCkpIHtcbiAgICAgIHJldHVybiB0aGlzLl9jcmVhdGVGYWlsdXJlV2l0aFJlcGxhY2VtZW50KGlkZW50aWZpZXIpO1xuICAgIH1cbiAgfVxuXG4gIC8qKiBDcmVhdGVzIGEgZmFpbHVyZSBhbmQgcmVwbGFjZW1lbnQgZm9yIHRoZSBzcGVjaWZpZWQgaWRlbnRpZmllci4gKi9cbiAgcHJpdmF0ZSBfY3JlYXRlRmFpbHVyZVdpdGhSZXBsYWNlbWVudChpZGVudGlmaWVyOiB0cy5JZGVudGlmaWVyKSB7XG4gICAgY29uc3QgY2xhc3NEYXRhID0gdGhpcy5kYXRhLmZpbmQoZGF0YSA9PiBkYXRhLnJlcGxhY2UgPT09IGlkZW50aWZpZXIudGV4dCkhO1xuICAgIGNvbnN0IGZpbGVQYXRoID0gdGhpcy5maWxlU3lzdGVtLnJlc29sdmUoaWRlbnRpZmllci5nZXRTb3VyY2VGaWxlKCkuZmlsZU5hbWUpO1xuXG4gICAgdGhpcy5maWxlU3lzdGVtXG4gICAgICAuZWRpdChmaWxlUGF0aClcbiAgICAgIC5yZW1vdmUoaWRlbnRpZmllci5nZXRTdGFydCgpLCBpZGVudGlmaWVyLmdldFdpZHRoKCkpXG4gICAgICAuaW5zZXJ0UmlnaHQoaWRlbnRpZmllci5nZXRTdGFydCgpLCBjbGFzc0RhdGEucmVwbGFjZVdpdGgpO1xuICB9XG59XG4iXX0=