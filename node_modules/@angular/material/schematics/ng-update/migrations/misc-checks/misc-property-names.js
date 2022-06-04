"use strict";
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.MiscPropertyNamesMigration = void 0;
const schematics_1 = require("@angular/cdk/schematics");
const ts = require("typescript");
/**
 * Migration that walks through every property access expression and and reports a failure if
 * a given property name no longer exists but cannot be automatically migrated.
 */
class MiscPropertyNamesMigration extends schematics_1.Migration {
    constructor() {
        super(...arguments);
        // Only enable this rule if the migration targets version 6. The rule
        // currently only includes migrations for V6 deprecations.
        this.enabled = this.targetVersion === schematics_1.TargetVersion.V6;
    }
    visitNode(node) {
        if (ts.isPropertyAccessExpression(node)) {
            this._visitPropertyAccessExpression(node);
        }
    }
    _visitPropertyAccessExpression(node) {
        const hostType = this.typeChecker.getTypeAtLocation(node.expression);
        const typeName = hostType && hostType.symbol && hostType.symbol.getName();
        // Migration for: https://github.com/angular/components/pull/10398 (v6)
        if (typeName === 'MatListOption' && node.name.text === 'selectionChange') {
            this.createFailureAtNode(node, `Found deprecated property "selectionChange" of ` +
                `class "MatListOption". Use the "selectionChange" property on the ` +
                `parent "MatSelectionList" instead.`);
        }
        // Migration for: https://github.com/angular/components/pull/10413 (v6)
        if (typeName === 'MatDatepicker' && node.name.text === 'selectedChanged') {
            this.createFailureAtNode(node, `Found deprecated property "selectedChanged" of ` +
                `class "MatDatepicker". Use the "dateChange" or "dateInput" methods ` +
                `on "MatDatepickerInput" instead.`);
        }
    }
}
exports.MiscPropertyNamesMigration = MiscPropertyNamesMigration;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWlzYy1wcm9wZXJ0eS1uYW1lcy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3NyYy9tYXRlcmlhbC9zY2hlbWF0aWNzL25nLXVwZGF0ZS9taWdyYXRpb25zL21pc2MtY2hlY2tzL21pc2MtcHJvcGVydHktbmFtZXMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7R0FNRzs7O0FBRUgsd0RBQWlFO0FBQ2pFLGlDQUFpQztBQUVqQzs7O0dBR0c7QUFDSCxNQUFhLDBCQUEyQixTQUFRLHNCQUFlO0lBQS9EOztRQUNFLHFFQUFxRTtRQUNyRSwwREFBMEQ7UUFDMUQsWUFBTyxHQUFHLElBQUksQ0FBQyxhQUFhLEtBQUssMEJBQWEsQ0FBQyxFQUFFLENBQUM7SUFnQ3BELENBQUM7SUE5QlUsU0FBUyxDQUFDLElBQWE7UUFDOUIsSUFBSSxFQUFFLENBQUMsMEJBQTBCLENBQUMsSUFBSSxDQUFDLEVBQUU7WUFDdkMsSUFBSSxDQUFDLDhCQUE4QixDQUFDLElBQUksQ0FBQyxDQUFDO1NBQzNDO0lBQ0gsQ0FBQztJQUVPLDhCQUE4QixDQUFDLElBQWlDO1FBQ3RFLE1BQU0sUUFBUSxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUMsaUJBQWlCLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDO1FBQ3JFLE1BQU0sUUFBUSxHQUFHLFFBQVEsSUFBSSxRQUFRLENBQUMsTUFBTSxJQUFJLFFBQVEsQ0FBQyxNQUFNLENBQUMsT0FBTyxFQUFFLENBQUM7UUFFMUUsdUVBQXVFO1FBQ3ZFLElBQUksUUFBUSxLQUFLLGVBQWUsSUFBSSxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksS0FBSyxpQkFBaUIsRUFBRTtZQUN4RSxJQUFJLENBQUMsbUJBQW1CLENBQ3RCLElBQUksRUFDSixpREFBaUQ7Z0JBQy9DLG1FQUFtRTtnQkFDbkUsb0NBQW9DLENBQ3ZDLENBQUM7U0FDSDtRQUVELHVFQUF1RTtRQUN2RSxJQUFJLFFBQVEsS0FBSyxlQUFlLElBQUksSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLEtBQUssaUJBQWlCLEVBQUU7WUFDeEUsSUFBSSxDQUFDLG1CQUFtQixDQUN0QixJQUFJLEVBQ0osaURBQWlEO2dCQUMvQyxxRUFBcUU7Z0JBQ3JFLGtDQUFrQyxDQUNyQyxDQUFDO1NBQ0g7SUFDSCxDQUFDO0NBQ0Y7QUFuQ0QsZ0VBbUNDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7TWlncmF0aW9uLCBUYXJnZXRWZXJzaW9ufSBmcm9tICdAYW5ndWxhci9jZGsvc2NoZW1hdGljcyc7XG5pbXBvcnQgKiBhcyB0cyBmcm9tICd0eXBlc2NyaXB0JztcblxuLyoqXG4gKiBNaWdyYXRpb24gdGhhdCB3YWxrcyB0aHJvdWdoIGV2ZXJ5IHByb3BlcnR5IGFjY2VzcyBleHByZXNzaW9uIGFuZCBhbmQgcmVwb3J0cyBhIGZhaWx1cmUgaWZcbiAqIGEgZ2l2ZW4gcHJvcGVydHkgbmFtZSBubyBsb25nZXIgZXhpc3RzIGJ1dCBjYW5ub3QgYmUgYXV0b21hdGljYWxseSBtaWdyYXRlZC5cbiAqL1xuZXhwb3J0IGNsYXNzIE1pc2NQcm9wZXJ0eU5hbWVzTWlncmF0aW9uIGV4dGVuZHMgTWlncmF0aW9uPG51bGw+IHtcbiAgLy8gT25seSBlbmFibGUgdGhpcyBydWxlIGlmIHRoZSBtaWdyYXRpb24gdGFyZ2V0cyB2ZXJzaW9uIDYuIFRoZSBydWxlXG4gIC8vIGN1cnJlbnRseSBvbmx5IGluY2x1ZGVzIG1pZ3JhdGlvbnMgZm9yIFY2IGRlcHJlY2F0aW9ucy5cbiAgZW5hYmxlZCA9IHRoaXMudGFyZ2V0VmVyc2lvbiA9PT0gVGFyZ2V0VmVyc2lvbi5WNjtcblxuICBvdmVycmlkZSB2aXNpdE5vZGUobm9kZTogdHMuTm9kZSk6IHZvaWQge1xuICAgIGlmICh0cy5pc1Byb3BlcnR5QWNjZXNzRXhwcmVzc2lvbihub2RlKSkge1xuICAgICAgdGhpcy5fdmlzaXRQcm9wZXJ0eUFjY2Vzc0V4cHJlc3Npb24obm9kZSk7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBfdmlzaXRQcm9wZXJ0eUFjY2Vzc0V4cHJlc3Npb24obm9kZTogdHMuUHJvcGVydHlBY2Nlc3NFeHByZXNzaW9uKSB7XG4gICAgY29uc3QgaG9zdFR5cGUgPSB0aGlzLnR5cGVDaGVja2VyLmdldFR5cGVBdExvY2F0aW9uKG5vZGUuZXhwcmVzc2lvbik7XG4gICAgY29uc3QgdHlwZU5hbWUgPSBob3N0VHlwZSAmJiBob3N0VHlwZS5zeW1ib2wgJiYgaG9zdFR5cGUuc3ltYm9sLmdldE5hbWUoKTtcblxuICAgIC8vIE1pZ3JhdGlvbiBmb3I6IGh0dHBzOi8vZ2l0aHViLmNvbS9hbmd1bGFyL2NvbXBvbmVudHMvcHVsbC8xMDM5OCAodjYpXG4gICAgaWYgKHR5cGVOYW1lID09PSAnTWF0TGlzdE9wdGlvbicgJiYgbm9kZS5uYW1lLnRleHQgPT09ICdzZWxlY3Rpb25DaGFuZ2UnKSB7XG4gICAgICB0aGlzLmNyZWF0ZUZhaWx1cmVBdE5vZGUoXG4gICAgICAgIG5vZGUsXG4gICAgICAgIGBGb3VuZCBkZXByZWNhdGVkIHByb3BlcnR5IFwic2VsZWN0aW9uQ2hhbmdlXCIgb2YgYCArXG4gICAgICAgICAgYGNsYXNzIFwiTWF0TGlzdE9wdGlvblwiLiBVc2UgdGhlIFwic2VsZWN0aW9uQ2hhbmdlXCIgcHJvcGVydHkgb24gdGhlIGAgK1xuICAgICAgICAgIGBwYXJlbnQgXCJNYXRTZWxlY3Rpb25MaXN0XCIgaW5zdGVhZC5gLFxuICAgICAgKTtcbiAgICB9XG5cbiAgICAvLyBNaWdyYXRpb24gZm9yOiBodHRwczovL2dpdGh1Yi5jb20vYW5ndWxhci9jb21wb25lbnRzL3B1bGwvMTA0MTMgKHY2KVxuICAgIGlmICh0eXBlTmFtZSA9PT0gJ01hdERhdGVwaWNrZXInICYmIG5vZGUubmFtZS50ZXh0ID09PSAnc2VsZWN0ZWRDaGFuZ2VkJykge1xuICAgICAgdGhpcy5jcmVhdGVGYWlsdXJlQXROb2RlKFxuICAgICAgICBub2RlLFxuICAgICAgICBgRm91bmQgZGVwcmVjYXRlZCBwcm9wZXJ0eSBcInNlbGVjdGVkQ2hhbmdlZFwiIG9mIGAgK1xuICAgICAgICAgIGBjbGFzcyBcIk1hdERhdGVwaWNrZXJcIi4gVXNlIHRoZSBcImRhdGVDaGFuZ2VcIiBvciBcImRhdGVJbnB1dFwiIG1ldGhvZHMgYCArXG4gICAgICAgICAgYG9uIFwiTWF0RGF0ZXBpY2tlcklucHV0XCIgaW5zdGVhZC5gLFxuICAgICAgKTtcbiAgICB9XG4gIH1cbn1cbiJdfQ==