"use strict";
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.MiscClassNamesMigration = void 0;
const schematics_1 = require("@angular/cdk/schematics");
const ts = require("typescript");
/**
 * Migration that looks for class name identifiers that have been removed but
 * cannot be automatically migrated.
 */
class MiscClassNamesMigration extends schematics_1.Migration {
    constructor() {
        super(...arguments);
        // Only enable this rule if the migration targets version 6. The rule
        // currently only includes migrations for V6 deprecations.
        this.enabled = this.targetVersion === schematics_1.TargetVersion.V6;
    }
    visitNode(node) {
        if (ts.isIdentifier(node)) {
            this._visitIdentifier(node);
        }
    }
    _visitIdentifier(identifier) {
        // Migration for: https://github.com/angular/components/pull/10279 (v6)
        if (identifier.getText() === 'MatDrawerToggleResult') {
            this.createFailureAtNode(identifier, `Found "MatDrawerToggleResult" which has changed from a class type to a string ` +
                `literal type. Your code may need to be updated.`);
        }
        // Migration for: https://github.com/angular/components/pull/10398 (v6)
        if (identifier.getText() === 'MatListOptionChange') {
            this.createFailureAtNode(identifier, `Found usage of "MatListOptionChange" which has been removed. Please listen for ` +
                `"selectionChange" on "MatSelectionList" instead.`);
        }
    }
}
exports.MiscClassNamesMigration = MiscClassNamesMigration;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWlzYy1jbGFzcy1uYW1lcy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3NyYy9tYXRlcmlhbC9zY2hlbWF0aWNzL25nLXVwZGF0ZS9taWdyYXRpb25zL21pc2MtY2hlY2tzL21pc2MtY2xhc3MtbmFtZXMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7R0FNRzs7O0FBRUgsd0RBQWlFO0FBQ2pFLGlDQUFpQztBQUVqQzs7O0dBR0c7QUFDSCxNQUFhLHVCQUF3QixTQUFRLHNCQUFlO0lBQTVEOztRQUNFLHFFQUFxRTtRQUNyRSwwREFBMEQ7UUFDMUQsWUFBTyxHQUFHLElBQUksQ0FBQyxhQUFhLEtBQUssMEJBQWEsQ0FBQyxFQUFFLENBQUM7SUEyQnBELENBQUM7SUF6QlUsU0FBUyxDQUFDLElBQWE7UUFDOUIsSUFBSSxFQUFFLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxFQUFFO1lBQ3pCLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxJQUFJLENBQUMsQ0FBQztTQUM3QjtJQUNILENBQUM7SUFFTyxnQkFBZ0IsQ0FBQyxVQUF5QjtRQUNoRCx1RUFBdUU7UUFDdkUsSUFBSSxVQUFVLENBQUMsT0FBTyxFQUFFLEtBQUssdUJBQXVCLEVBQUU7WUFDcEQsSUFBSSxDQUFDLG1CQUFtQixDQUN0QixVQUFVLEVBQ1YsZ0ZBQWdGO2dCQUM5RSxpREFBaUQsQ0FDcEQsQ0FBQztTQUNIO1FBRUQsdUVBQXVFO1FBQ3ZFLElBQUksVUFBVSxDQUFDLE9BQU8sRUFBRSxLQUFLLHFCQUFxQixFQUFFO1lBQ2xELElBQUksQ0FBQyxtQkFBbUIsQ0FDdEIsVUFBVSxFQUNWLGlGQUFpRjtnQkFDL0Usa0RBQWtELENBQ3JELENBQUM7U0FDSDtJQUNILENBQUM7Q0FDRjtBQTlCRCwwREE4QkMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtNaWdyYXRpb24sIFRhcmdldFZlcnNpb259IGZyb20gJ0Bhbmd1bGFyL2Nkay9zY2hlbWF0aWNzJztcbmltcG9ydCAqIGFzIHRzIGZyb20gJ3R5cGVzY3JpcHQnO1xuXG4vKipcbiAqIE1pZ3JhdGlvbiB0aGF0IGxvb2tzIGZvciBjbGFzcyBuYW1lIGlkZW50aWZpZXJzIHRoYXQgaGF2ZSBiZWVuIHJlbW92ZWQgYnV0XG4gKiBjYW5ub3QgYmUgYXV0b21hdGljYWxseSBtaWdyYXRlZC5cbiAqL1xuZXhwb3J0IGNsYXNzIE1pc2NDbGFzc05hbWVzTWlncmF0aW9uIGV4dGVuZHMgTWlncmF0aW9uPG51bGw+IHtcbiAgLy8gT25seSBlbmFibGUgdGhpcyBydWxlIGlmIHRoZSBtaWdyYXRpb24gdGFyZ2V0cyB2ZXJzaW9uIDYuIFRoZSBydWxlXG4gIC8vIGN1cnJlbnRseSBvbmx5IGluY2x1ZGVzIG1pZ3JhdGlvbnMgZm9yIFY2IGRlcHJlY2F0aW9ucy5cbiAgZW5hYmxlZCA9IHRoaXMudGFyZ2V0VmVyc2lvbiA9PT0gVGFyZ2V0VmVyc2lvbi5WNjtcblxuICBvdmVycmlkZSB2aXNpdE5vZGUobm9kZTogdHMuTm9kZSk6IHZvaWQge1xuICAgIGlmICh0cy5pc0lkZW50aWZpZXIobm9kZSkpIHtcbiAgICAgIHRoaXMuX3Zpc2l0SWRlbnRpZmllcihub2RlKTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIF92aXNpdElkZW50aWZpZXIoaWRlbnRpZmllcjogdHMuSWRlbnRpZmllcikge1xuICAgIC8vIE1pZ3JhdGlvbiBmb3I6IGh0dHBzOi8vZ2l0aHViLmNvbS9hbmd1bGFyL2NvbXBvbmVudHMvcHVsbC8xMDI3OSAodjYpXG4gICAgaWYgKGlkZW50aWZpZXIuZ2V0VGV4dCgpID09PSAnTWF0RHJhd2VyVG9nZ2xlUmVzdWx0Jykge1xuICAgICAgdGhpcy5jcmVhdGVGYWlsdXJlQXROb2RlKFxuICAgICAgICBpZGVudGlmaWVyLFxuICAgICAgICBgRm91bmQgXCJNYXREcmF3ZXJUb2dnbGVSZXN1bHRcIiB3aGljaCBoYXMgY2hhbmdlZCBmcm9tIGEgY2xhc3MgdHlwZSB0byBhIHN0cmluZyBgICtcbiAgICAgICAgICBgbGl0ZXJhbCB0eXBlLiBZb3VyIGNvZGUgbWF5IG5lZWQgdG8gYmUgdXBkYXRlZC5gLFxuICAgICAgKTtcbiAgICB9XG5cbiAgICAvLyBNaWdyYXRpb24gZm9yOiBodHRwczovL2dpdGh1Yi5jb20vYW5ndWxhci9jb21wb25lbnRzL3B1bGwvMTAzOTggKHY2KVxuICAgIGlmIChpZGVudGlmaWVyLmdldFRleHQoKSA9PT0gJ01hdExpc3RPcHRpb25DaGFuZ2UnKSB7XG4gICAgICB0aGlzLmNyZWF0ZUZhaWx1cmVBdE5vZGUoXG4gICAgICAgIGlkZW50aWZpZXIsXG4gICAgICAgIGBGb3VuZCB1c2FnZSBvZiBcIk1hdExpc3RPcHRpb25DaGFuZ2VcIiB3aGljaCBoYXMgYmVlbiByZW1vdmVkLiBQbGVhc2UgbGlzdGVuIGZvciBgICtcbiAgICAgICAgICBgXCJzZWxlY3Rpb25DaGFuZ2VcIiBvbiBcIk1hdFNlbGVjdGlvbkxpc3RcIiBpbnN0ZWFkLmAsXG4gICAgICApO1xuICAgIH1cbiAgfVxufVxuIl19