"use strict";
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClassInheritanceMigration = void 0;
const ts = require("typescript");
const migration_1 = require("../../update-tool/migration");
const base_types_1 = require("../typescript/base-types");
const upgrade_data_1 = require("../upgrade-data");
/**
 * Migration that identifies class declarations that extend CDK or Material classes
 * which had a public property change.
 */
class ClassInheritanceMigration extends migration_1.Migration {
    constructor() {
        super(...arguments);
        /**
         * Map of classes that have been updated. Each class name maps to the according property
         * change data.
         */
        this.propertyNames = new Map();
        // Only enable the migration rule if there is upgrade data.
        this.enabled = this.propertyNames.size !== 0;
    }
    init() {
        (0, upgrade_data_1.getVersionUpgradeData)(this, 'propertyNames')
            .filter(data => data.limitedTo && data.limitedTo.classes)
            .forEach(data => data.limitedTo.classes.forEach(name => this.propertyNames.set(name, data)));
    }
    visitNode(node) {
        if (ts.isClassDeclaration(node)) {
            this._visitClassDeclaration(node);
        }
    }
    _visitClassDeclaration(node) {
        const baseTypes = (0, base_types_1.determineBaseTypes)(node);
        const className = node.name ? node.name.text : '{unknown-name}';
        if (!baseTypes) {
            return;
        }
        baseTypes.forEach(typeName => {
            const data = this.propertyNames.get(typeName);
            if (data) {
                this.createFailureAtNode(node, `Found class "${className}" which extends class ` +
                    `"${typeName}". Please note that the base class property ` +
                    `"${data.replace}" has changed to "${data.replaceWith}". ` +
                    `You may need to update your class as well.`);
            }
        });
    }
}
exports.ClassInheritanceMigration = ClassInheritanceMigration;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2xhc3MtaW5oZXJpdGFuY2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9zcmMvY2RrL3NjaGVtYXRpY3MvbmctdXBkYXRlL21pZ3JhdGlvbnMvY2xhc3MtaW5oZXJpdGFuY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7R0FNRzs7O0FBRUgsaUNBQWlDO0FBQ2pDLDJEQUFzRDtBQUV0RCx5REFBNEQ7QUFDNUQsa0RBQW1FO0FBRW5FOzs7R0FHRztBQUNILE1BQWEseUJBQTBCLFNBQVEscUJBQXNCO0lBQXJFOztRQUNFOzs7V0FHRztRQUNILGtCQUFhLEdBQUcsSUFBSSxHQUFHLEVBQW1DLENBQUM7UUFFM0QsMkRBQTJEO1FBQzNELFlBQU8sR0FBRyxJQUFJLENBQUMsYUFBYSxDQUFDLElBQUksS0FBSyxDQUFDLENBQUM7SUFvQzFDLENBQUM7SUFsQ1UsSUFBSTtRQUNYLElBQUEsb0NBQXFCLEVBQUMsSUFBSSxFQUFFLGVBQWUsQ0FBQzthQUN6QyxNQUFNLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsU0FBUyxJQUFJLElBQUksQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDO2FBQ3hELE9BQU8sQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsR0FBRyxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDakcsQ0FBQztJQUVRLFNBQVMsQ0FBQyxJQUFhO1FBQzlCLElBQUksRUFBRSxDQUFDLGtCQUFrQixDQUFDLElBQUksQ0FBQyxFQUFFO1lBQy9CLElBQUksQ0FBQyxzQkFBc0IsQ0FBQyxJQUFJLENBQUMsQ0FBQztTQUNuQztJQUNILENBQUM7SUFFTyxzQkFBc0IsQ0FBQyxJQUF5QjtRQUN0RCxNQUFNLFNBQVMsR0FBRyxJQUFBLCtCQUFrQixFQUFDLElBQUksQ0FBQyxDQUFDO1FBQzNDLE1BQU0sU0FBUyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxnQkFBZ0IsQ0FBQztRQUVoRSxJQUFJLENBQUMsU0FBUyxFQUFFO1lBQ2QsT0FBTztTQUNSO1FBRUQsU0FBUyxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsRUFBRTtZQUMzQixNQUFNLElBQUksR0FBRyxJQUFJLENBQUMsYUFBYSxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsQ0FBQztZQUU5QyxJQUFJLElBQUksRUFBRTtnQkFDUixJQUFJLENBQUMsbUJBQW1CLENBQ3RCLElBQUksRUFDSixnQkFBZ0IsU0FBUyx3QkFBd0I7b0JBQy9DLElBQUksUUFBUSw4Q0FBOEM7b0JBQzFELElBQUksSUFBSSxDQUFDLE9BQU8scUJBQXFCLElBQUksQ0FBQyxXQUFXLEtBQUs7b0JBQzFELDRDQUE0QyxDQUMvQyxDQUFDO2FBQ0g7UUFDSCxDQUFDLENBQUMsQ0FBQztJQUNMLENBQUM7Q0FDRjtBQTVDRCw4REE0Q0MiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0ICogYXMgdHMgZnJvbSAndHlwZXNjcmlwdCc7XG5pbXBvcnQge01pZ3JhdGlvbn0gZnJvbSAnLi4vLi4vdXBkYXRlLXRvb2wvbWlncmF0aW9uJztcbmltcG9ydCB7UHJvcGVydHlOYW1lVXBncmFkZURhdGF9IGZyb20gJy4uL2RhdGEvcHJvcGVydHktbmFtZXMnO1xuaW1wb3J0IHtkZXRlcm1pbmVCYXNlVHlwZXN9IGZyb20gJy4uL3R5cGVzY3JpcHQvYmFzZS10eXBlcyc7XG5pbXBvcnQge2dldFZlcnNpb25VcGdyYWRlRGF0YSwgVXBncmFkZURhdGF9IGZyb20gJy4uL3VwZ3JhZGUtZGF0YSc7XG5cbi8qKlxuICogTWlncmF0aW9uIHRoYXQgaWRlbnRpZmllcyBjbGFzcyBkZWNsYXJhdGlvbnMgdGhhdCBleHRlbmQgQ0RLIG9yIE1hdGVyaWFsIGNsYXNzZXNcbiAqIHdoaWNoIGhhZCBhIHB1YmxpYyBwcm9wZXJ0eSBjaGFuZ2UuXG4gKi9cbmV4cG9ydCBjbGFzcyBDbGFzc0luaGVyaXRhbmNlTWlncmF0aW9uIGV4dGVuZHMgTWlncmF0aW9uPFVwZ3JhZGVEYXRhPiB7XG4gIC8qKlxuICAgKiBNYXAgb2YgY2xhc3NlcyB0aGF0IGhhdmUgYmVlbiB1cGRhdGVkLiBFYWNoIGNsYXNzIG5hbWUgbWFwcyB0byB0aGUgYWNjb3JkaW5nIHByb3BlcnR5XG4gICAqIGNoYW5nZSBkYXRhLlxuICAgKi9cbiAgcHJvcGVydHlOYW1lcyA9IG5ldyBNYXA8c3RyaW5nLCBQcm9wZXJ0eU5hbWVVcGdyYWRlRGF0YT4oKTtcblxuICAvLyBPbmx5IGVuYWJsZSB0aGUgbWlncmF0aW9uIHJ1bGUgaWYgdGhlcmUgaXMgdXBncmFkZSBkYXRhLlxuICBlbmFibGVkID0gdGhpcy5wcm9wZXJ0eU5hbWVzLnNpemUgIT09IDA7XG5cbiAgb3ZlcnJpZGUgaW5pdCgpOiB2b2lkIHtcbiAgICBnZXRWZXJzaW9uVXBncmFkZURhdGEodGhpcywgJ3Byb3BlcnR5TmFtZXMnKVxuICAgICAgLmZpbHRlcihkYXRhID0+IGRhdGEubGltaXRlZFRvICYmIGRhdGEubGltaXRlZFRvLmNsYXNzZXMpXG4gICAgICAuZm9yRWFjaChkYXRhID0+IGRhdGEubGltaXRlZFRvLmNsYXNzZXMuZm9yRWFjaChuYW1lID0+IHRoaXMucHJvcGVydHlOYW1lcy5zZXQobmFtZSwgZGF0YSkpKTtcbiAgfVxuXG4gIG92ZXJyaWRlIHZpc2l0Tm9kZShub2RlOiB0cy5Ob2RlKTogdm9pZCB7XG4gICAgaWYgKHRzLmlzQ2xhc3NEZWNsYXJhdGlvbihub2RlKSkge1xuICAgICAgdGhpcy5fdmlzaXRDbGFzc0RlY2xhcmF0aW9uKG5vZGUpO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgX3Zpc2l0Q2xhc3NEZWNsYXJhdGlvbihub2RlOiB0cy5DbGFzc0RlY2xhcmF0aW9uKSB7XG4gICAgY29uc3QgYmFzZVR5cGVzID0gZGV0ZXJtaW5lQmFzZVR5cGVzKG5vZGUpO1xuICAgIGNvbnN0IGNsYXNzTmFtZSA9IG5vZGUubmFtZSA/IG5vZGUubmFtZS50ZXh0IDogJ3t1bmtub3duLW5hbWV9JztcblxuICAgIGlmICghYmFzZVR5cGVzKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgYmFzZVR5cGVzLmZvckVhY2godHlwZU5hbWUgPT4ge1xuICAgICAgY29uc3QgZGF0YSA9IHRoaXMucHJvcGVydHlOYW1lcy5nZXQodHlwZU5hbWUpO1xuXG4gICAgICBpZiAoZGF0YSkge1xuICAgICAgICB0aGlzLmNyZWF0ZUZhaWx1cmVBdE5vZGUoXG4gICAgICAgICAgbm9kZSxcbiAgICAgICAgICBgRm91bmQgY2xhc3MgXCIke2NsYXNzTmFtZX1cIiB3aGljaCBleHRlbmRzIGNsYXNzIGAgK1xuICAgICAgICAgICAgYFwiJHt0eXBlTmFtZX1cIi4gUGxlYXNlIG5vdGUgdGhhdCB0aGUgYmFzZSBjbGFzcyBwcm9wZXJ0eSBgICtcbiAgICAgICAgICAgIGBcIiR7ZGF0YS5yZXBsYWNlfVwiIGhhcyBjaGFuZ2VkIHRvIFwiJHtkYXRhLnJlcGxhY2VXaXRofVwiLiBgICtcbiAgICAgICAgICAgIGBZb3UgbWF5IG5lZWQgdG8gdXBkYXRlIHlvdXIgY2xhc3MgYXMgd2VsbC5gLFxuICAgICAgICApO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG59XG4iXX0=