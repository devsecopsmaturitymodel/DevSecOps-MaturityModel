"use strict";
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.SymbolRemovalMigration = void 0;
const ts = require("typescript");
const migration_1 = require("../../update-tool/migration");
const upgrade_data_1 = require("../upgrade-data");
/** Migration that flags imports for symbols that have been removed. */
class SymbolRemovalMigration extends migration_1.Migration {
    constructor() {
        super(...arguments);
        /** Change data that upgrades to the specified target version. */
        this.data = (0, upgrade_data_1.getVersionUpgradeData)(this, 'symbolRemoval');
        // Only enable the migration rule if there is upgrade data.
        this.enabled = this.data.length !== 0;
    }
    visitNode(node) {
        if (!ts.isImportDeclaration(node) || !ts.isStringLiteral(node.moduleSpecifier)) {
            return;
        }
        const namedBindings = node.importClause && node.importClause.namedBindings;
        if (!namedBindings || !ts.isNamedImports(namedBindings)) {
            return;
        }
        const moduleNameMatches = this.data.filter(entry => node.moduleSpecifier.text === entry.module);
        if (!moduleNameMatches.length) {
            return;
        }
        namedBindings.elements.forEach(element => {
            var _a;
            const elementName = ((_a = element.propertyName) === null || _a === void 0 ? void 0 : _a.text) || element.name.text;
            moduleNameMatches.forEach(match => {
                if (match.name === elementName) {
                    this.createFailureAtNode(element, match.message);
                }
            });
        });
    }
}
exports.SymbolRemovalMigration = SymbolRemovalMigration;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3ltYm9sLXJlbW92YWwuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9zcmMvY2RrL3NjaGVtYXRpY3MvbmctdXBkYXRlL21pZ3JhdGlvbnMvc3ltYm9sLXJlbW92YWwudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7R0FNRzs7O0FBRUgsaUNBQWlDO0FBQ2pDLDJEQUFzRDtBQUV0RCxrREFBbUU7QUFFbkUsdUVBQXVFO0FBQ3ZFLE1BQWEsc0JBQXVCLFNBQVEscUJBQXNCO0lBQWxFOztRQUNFLGlFQUFpRTtRQUNqRSxTQUFJLEdBQStCLElBQUEsb0NBQXFCLEVBQUMsSUFBSSxFQUFFLGVBQWUsQ0FBQyxDQUFDO1FBRWhGLDJEQUEyRDtRQUMzRCxZQUFPLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLEtBQUssQ0FBQyxDQUFDO0lBK0JuQyxDQUFDO0lBN0JVLFNBQVMsQ0FBQyxJQUFhO1FBQzlCLElBQUksQ0FBQyxFQUFFLENBQUMsbUJBQW1CLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsZUFBZSxDQUFDLElBQUksQ0FBQyxlQUFlLENBQUMsRUFBRTtZQUM5RSxPQUFPO1NBQ1I7UUFFRCxNQUFNLGFBQWEsR0FBRyxJQUFJLENBQUMsWUFBWSxJQUFJLElBQUksQ0FBQyxZQUFZLENBQUMsYUFBYSxDQUFDO1FBRTNFLElBQUksQ0FBQyxhQUFhLElBQUksQ0FBQyxFQUFFLENBQUMsY0FBYyxDQUFDLGFBQWEsQ0FBQyxFQUFFO1lBQ3ZELE9BQU87U0FDUjtRQUVELE1BQU0saUJBQWlCLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQ3hDLEtBQUssQ0FBQyxFQUFFLENBQUUsSUFBSSxDQUFDLGVBQW9DLENBQUMsSUFBSSxLQUFLLEtBQUssQ0FBQyxNQUFNLENBQzFFLENBQUM7UUFFRixJQUFJLENBQUMsaUJBQWlCLENBQUMsTUFBTSxFQUFFO1lBQzdCLE9BQU87U0FDUjtRQUVELGFBQWEsQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxFQUFFOztZQUN2QyxNQUFNLFdBQVcsR0FBRyxDQUFBLE1BQUEsT0FBTyxDQUFDLFlBQVksMENBQUUsSUFBSSxLQUFJLE9BQU8sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDO1lBRXBFLGlCQUFpQixDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsRUFBRTtnQkFDaEMsSUFBSSxLQUFLLENBQUMsSUFBSSxLQUFLLFdBQVcsRUFBRTtvQkFDOUIsSUFBSSxDQUFDLG1CQUFtQixDQUFDLE9BQU8sRUFBRSxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUM7aUJBQ2xEO1lBQ0gsQ0FBQyxDQUFDLENBQUM7UUFDTCxDQUFDLENBQUMsQ0FBQztJQUNMLENBQUM7Q0FDRjtBQXBDRCx3REFvQ0MiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0ICogYXMgdHMgZnJvbSAndHlwZXNjcmlwdCc7XG5pbXBvcnQge01pZ3JhdGlvbn0gZnJvbSAnLi4vLi4vdXBkYXRlLXRvb2wvbWlncmF0aW9uJztcbmltcG9ydCB7U3ltYm9sUmVtb3ZhbFVwZ3JhZGVEYXRhfSBmcm9tICcuLi9kYXRhJztcbmltcG9ydCB7Z2V0VmVyc2lvblVwZ3JhZGVEYXRhLCBVcGdyYWRlRGF0YX0gZnJvbSAnLi4vdXBncmFkZS1kYXRhJztcblxuLyoqIE1pZ3JhdGlvbiB0aGF0IGZsYWdzIGltcG9ydHMgZm9yIHN5bWJvbHMgdGhhdCBoYXZlIGJlZW4gcmVtb3ZlZC4gKi9cbmV4cG9ydCBjbGFzcyBTeW1ib2xSZW1vdmFsTWlncmF0aW9uIGV4dGVuZHMgTWlncmF0aW9uPFVwZ3JhZGVEYXRhPiB7XG4gIC8qKiBDaGFuZ2UgZGF0YSB0aGF0IHVwZ3JhZGVzIHRvIHRoZSBzcGVjaWZpZWQgdGFyZ2V0IHZlcnNpb24uICovXG4gIGRhdGE6IFN5bWJvbFJlbW92YWxVcGdyYWRlRGF0YVtdID0gZ2V0VmVyc2lvblVwZ3JhZGVEYXRhKHRoaXMsICdzeW1ib2xSZW1vdmFsJyk7XG5cbiAgLy8gT25seSBlbmFibGUgdGhlIG1pZ3JhdGlvbiBydWxlIGlmIHRoZXJlIGlzIHVwZ3JhZGUgZGF0YS5cbiAgZW5hYmxlZCA9IHRoaXMuZGF0YS5sZW5ndGggIT09IDA7XG5cbiAgb3ZlcnJpZGUgdmlzaXROb2RlKG5vZGU6IHRzLk5vZGUpOiB2b2lkIHtcbiAgICBpZiAoIXRzLmlzSW1wb3J0RGVjbGFyYXRpb24obm9kZSkgfHwgIXRzLmlzU3RyaW5nTGl0ZXJhbChub2RlLm1vZHVsZVNwZWNpZmllcikpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCBuYW1lZEJpbmRpbmdzID0gbm9kZS5pbXBvcnRDbGF1c2UgJiYgbm9kZS5pbXBvcnRDbGF1c2UubmFtZWRCaW5kaW5ncztcblxuICAgIGlmICghbmFtZWRCaW5kaW5ncyB8fCAhdHMuaXNOYW1lZEltcG9ydHMobmFtZWRCaW5kaW5ncykpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCBtb2R1bGVOYW1lTWF0Y2hlcyA9IHRoaXMuZGF0YS5maWx0ZXIoXG4gICAgICBlbnRyeSA9PiAobm9kZS5tb2R1bGVTcGVjaWZpZXIgYXMgdHMuU3RyaW5nTGl0ZXJhbCkudGV4dCA9PT0gZW50cnkubW9kdWxlLFxuICAgICk7XG5cbiAgICBpZiAoIW1vZHVsZU5hbWVNYXRjaGVzLmxlbmd0aCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIG5hbWVkQmluZGluZ3MuZWxlbWVudHMuZm9yRWFjaChlbGVtZW50ID0+IHtcbiAgICAgIGNvbnN0IGVsZW1lbnROYW1lID0gZWxlbWVudC5wcm9wZXJ0eU5hbWU/LnRleHQgfHwgZWxlbWVudC5uYW1lLnRleHQ7XG5cbiAgICAgIG1vZHVsZU5hbWVNYXRjaGVzLmZvckVhY2gobWF0Y2ggPT4ge1xuICAgICAgICBpZiAobWF0Y2gubmFtZSA9PT0gZWxlbWVudE5hbWUpIHtcbiAgICAgICAgICB0aGlzLmNyZWF0ZUZhaWx1cmVBdE5vZGUoZWxlbWVudCwgbWF0Y2gubWVzc2FnZSk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH0pO1xuICB9XG59XG4iXX0=