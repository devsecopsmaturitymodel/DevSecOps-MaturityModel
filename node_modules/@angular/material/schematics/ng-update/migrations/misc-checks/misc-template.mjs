"use strict";
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.MiscTemplateMigration = void 0;
const schematics_1 = require("@angular/cdk/schematics");
/**
 * Migration that walks through every inline or external template and reports if there
 * are outdated usages of the Angular Material API that needs to be updated manually.
 */
class MiscTemplateMigration extends schematics_1.Migration {
    constructor() {
        super(...arguments);
        // Only enable this rule if the migration targets version 6. The rule
        // currently only includes migrations for V6 deprecations.
        this.enabled = this.targetVersion === schematics_1.TargetVersion.V6;
    }
    visitTemplate(template) {
        // Migration for: https://github.com/angular/components/pull/10398 (v6)
        (0, schematics_1.findOutputsOnElementWithTag)(template.content, 'selectionChange', ['mat-list-option']).forEach(offset => {
            this.failures.push({
                filePath: template.filePath,
                position: template.getCharacterAndLineOfPosition(template.start + offset),
                message: `Found deprecated "selectionChange" output binding on "mat-list-option". ` +
                    `Use "selectionChange" on "mat-selection-list" instead.`,
            });
        });
        // Migration for: https://github.com/angular/components/pull/10413 (v6)
        (0, schematics_1.findOutputsOnElementWithTag)(template.content, 'selectedChanged', ['mat-datepicker']).forEach(offset => {
            this.failures.push({
                filePath: template.filePath,
                position: template.getCharacterAndLineOfPosition(template.start + offset),
                message: `Found deprecated "selectedChanged" output binding on "mat-datepicker". ` +
                    `Use "dateChange" or "dateInput" on "<input [matDatepicker]>" instead.`,
            });
        });
        // Migration for: https://github.com/angular/components/commit/f0bf6e7 (v6)
        (0, schematics_1.findInputsOnElementWithTag)(template.content, 'selected', ['mat-button-toggle-group']).forEach(offset => {
            this.failures.push({
                filePath: template.filePath,
                position: template.getCharacterAndLineOfPosition(template.start + offset),
                message: `Found deprecated "selected" input binding on "mat-radio-button-group". ` +
                    `Use "value" instead.`,
            });
        });
    }
}
exports.MiscTemplateMigration = MiscTemplateMigration;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWlzYy10ZW1wbGF0ZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3NyYy9tYXRlcmlhbC9zY2hlbWF0aWNzL25nLXVwZGF0ZS9taWdyYXRpb25zL21pc2MtY2hlY2tzL21pc2MtdGVtcGxhdGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7R0FNRzs7O0FBRUgsd0RBTWlDO0FBRWpDOzs7R0FHRztBQUNILE1BQWEscUJBQXNCLFNBQVEsc0JBQWU7SUFBMUQ7O1FBQ0UscUVBQXFFO1FBQ3JFLDBEQUEwRDtRQUMxRCxZQUFPLEdBQUcsSUFBSSxDQUFDLGFBQWEsS0FBSywwQkFBYSxDQUFDLEVBQUUsQ0FBQztJQTBDcEQsQ0FBQztJQXhDVSxhQUFhLENBQUMsUUFBMEI7UUFDL0MsdUVBQXVFO1FBQ3ZFLElBQUEsd0NBQTJCLEVBQUMsUUFBUSxDQUFDLE9BQU8sRUFBRSxpQkFBaUIsRUFBRSxDQUFDLGlCQUFpQixDQUFDLENBQUMsQ0FBQyxPQUFPLENBQzNGLE1BQU0sQ0FBQyxFQUFFO1lBQ1AsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUM7Z0JBQ2pCLFFBQVEsRUFBRSxRQUFRLENBQUMsUUFBUTtnQkFDM0IsUUFBUSxFQUFFLFFBQVEsQ0FBQyw2QkFBNkIsQ0FBQyxRQUFRLENBQUMsS0FBSyxHQUFHLE1BQU0sQ0FBQztnQkFDekUsT0FBTyxFQUNMLDBFQUEwRTtvQkFDMUUsd0RBQXdEO2FBQzNELENBQUMsQ0FBQztRQUNMLENBQUMsQ0FDRixDQUFDO1FBRUYsdUVBQXVFO1FBQ3ZFLElBQUEsd0NBQTJCLEVBQUMsUUFBUSxDQUFDLE9BQU8sRUFBRSxpQkFBaUIsRUFBRSxDQUFDLGdCQUFnQixDQUFDLENBQUMsQ0FBQyxPQUFPLENBQzFGLE1BQU0sQ0FBQyxFQUFFO1lBQ1AsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUM7Z0JBQ2pCLFFBQVEsRUFBRSxRQUFRLENBQUMsUUFBUTtnQkFDM0IsUUFBUSxFQUFFLFFBQVEsQ0FBQyw2QkFBNkIsQ0FBQyxRQUFRLENBQUMsS0FBSyxHQUFHLE1BQU0sQ0FBQztnQkFDekUsT0FBTyxFQUNMLHlFQUF5RTtvQkFDekUsdUVBQXVFO2FBQzFFLENBQUMsQ0FBQztRQUNMLENBQUMsQ0FDRixDQUFDO1FBRUYsMkVBQTJFO1FBQzNFLElBQUEsdUNBQTBCLEVBQUMsUUFBUSxDQUFDLE9BQU8sRUFBRSxVQUFVLEVBQUUsQ0FBQyx5QkFBeUIsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUMzRixNQUFNLENBQUMsRUFBRTtZQUNQLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDO2dCQUNqQixRQUFRLEVBQUUsUUFBUSxDQUFDLFFBQVE7Z0JBQzNCLFFBQVEsRUFBRSxRQUFRLENBQUMsNkJBQTZCLENBQUMsUUFBUSxDQUFDLEtBQUssR0FBRyxNQUFNLENBQUM7Z0JBQ3pFLE9BQU8sRUFDTCx5RUFBeUU7b0JBQ3pFLHNCQUFzQjthQUN6QixDQUFDLENBQUM7UUFDTCxDQUFDLENBQ0YsQ0FBQztJQUNKLENBQUM7Q0FDRjtBQTdDRCxzREE2Q0MiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtcbiAgZmluZElucHV0c09uRWxlbWVudFdpdGhUYWcsXG4gIGZpbmRPdXRwdXRzT25FbGVtZW50V2l0aFRhZyxcbiAgTWlncmF0aW9uLFxuICBSZXNvbHZlZFJlc291cmNlLFxuICBUYXJnZXRWZXJzaW9uLFxufSBmcm9tICdAYW5ndWxhci9jZGsvc2NoZW1hdGljcyc7XG5cbi8qKlxuICogTWlncmF0aW9uIHRoYXQgd2Fsa3MgdGhyb3VnaCBldmVyeSBpbmxpbmUgb3IgZXh0ZXJuYWwgdGVtcGxhdGUgYW5kIHJlcG9ydHMgaWYgdGhlcmVcbiAqIGFyZSBvdXRkYXRlZCB1c2FnZXMgb2YgdGhlIEFuZ3VsYXIgTWF0ZXJpYWwgQVBJIHRoYXQgbmVlZHMgdG8gYmUgdXBkYXRlZCBtYW51YWxseS5cbiAqL1xuZXhwb3J0IGNsYXNzIE1pc2NUZW1wbGF0ZU1pZ3JhdGlvbiBleHRlbmRzIE1pZ3JhdGlvbjxudWxsPiB7XG4gIC8vIE9ubHkgZW5hYmxlIHRoaXMgcnVsZSBpZiB0aGUgbWlncmF0aW9uIHRhcmdldHMgdmVyc2lvbiA2LiBUaGUgcnVsZVxuICAvLyBjdXJyZW50bHkgb25seSBpbmNsdWRlcyBtaWdyYXRpb25zIGZvciBWNiBkZXByZWNhdGlvbnMuXG4gIGVuYWJsZWQgPSB0aGlzLnRhcmdldFZlcnNpb24gPT09IFRhcmdldFZlcnNpb24uVjY7XG5cbiAgb3ZlcnJpZGUgdmlzaXRUZW1wbGF0ZSh0ZW1wbGF0ZTogUmVzb2x2ZWRSZXNvdXJjZSk6IHZvaWQge1xuICAgIC8vIE1pZ3JhdGlvbiBmb3I6IGh0dHBzOi8vZ2l0aHViLmNvbS9hbmd1bGFyL2NvbXBvbmVudHMvcHVsbC8xMDM5OCAodjYpXG4gICAgZmluZE91dHB1dHNPbkVsZW1lbnRXaXRoVGFnKHRlbXBsYXRlLmNvbnRlbnQsICdzZWxlY3Rpb25DaGFuZ2UnLCBbJ21hdC1saXN0LW9wdGlvbiddKS5mb3JFYWNoKFxuICAgICAgb2Zmc2V0ID0+IHtcbiAgICAgICAgdGhpcy5mYWlsdXJlcy5wdXNoKHtcbiAgICAgICAgICBmaWxlUGF0aDogdGVtcGxhdGUuZmlsZVBhdGgsXG4gICAgICAgICAgcG9zaXRpb246IHRlbXBsYXRlLmdldENoYXJhY3RlckFuZExpbmVPZlBvc2l0aW9uKHRlbXBsYXRlLnN0YXJ0ICsgb2Zmc2V0KSxcbiAgICAgICAgICBtZXNzYWdlOlxuICAgICAgICAgICAgYEZvdW5kIGRlcHJlY2F0ZWQgXCJzZWxlY3Rpb25DaGFuZ2VcIiBvdXRwdXQgYmluZGluZyBvbiBcIm1hdC1saXN0LW9wdGlvblwiLiBgICtcbiAgICAgICAgICAgIGBVc2UgXCJzZWxlY3Rpb25DaGFuZ2VcIiBvbiBcIm1hdC1zZWxlY3Rpb24tbGlzdFwiIGluc3RlYWQuYCxcbiAgICAgICAgfSk7XG4gICAgICB9LFxuICAgICk7XG5cbiAgICAvLyBNaWdyYXRpb24gZm9yOiBodHRwczovL2dpdGh1Yi5jb20vYW5ndWxhci9jb21wb25lbnRzL3B1bGwvMTA0MTMgKHY2KVxuICAgIGZpbmRPdXRwdXRzT25FbGVtZW50V2l0aFRhZyh0ZW1wbGF0ZS5jb250ZW50LCAnc2VsZWN0ZWRDaGFuZ2VkJywgWydtYXQtZGF0ZXBpY2tlciddKS5mb3JFYWNoKFxuICAgICAgb2Zmc2V0ID0+IHtcbiAgICAgICAgdGhpcy5mYWlsdXJlcy5wdXNoKHtcbiAgICAgICAgICBmaWxlUGF0aDogdGVtcGxhdGUuZmlsZVBhdGgsXG4gICAgICAgICAgcG9zaXRpb246IHRlbXBsYXRlLmdldENoYXJhY3RlckFuZExpbmVPZlBvc2l0aW9uKHRlbXBsYXRlLnN0YXJ0ICsgb2Zmc2V0KSxcbiAgICAgICAgICBtZXNzYWdlOlxuICAgICAgICAgICAgYEZvdW5kIGRlcHJlY2F0ZWQgXCJzZWxlY3RlZENoYW5nZWRcIiBvdXRwdXQgYmluZGluZyBvbiBcIm1hdC1kYXRlcGlja2VyXCIuIGAgK1xuICAgICAgICAgICAgYFVzZSBcImRhdGVDaGFuZ2VcIiBvciBcImRhdGVJbnB1dFwiIG9uIFwiPGlucHV0IFttYXREYXRlcGlja2VyXT5cIiBpbnN0ZWFkLmAsXG4gICAgICAgIH0pO1xuICAgICAgfSxcbiAgICApO1xuXG4gICAgLy8gTWlncmF0aW9uIGZvcjogaHR0cHM6Ly9naXRodWIuY29tL2FuZ3VsYXIvY29tcG9uZW50cy9jb21taXQvZjBiZjZlNyAodjYpXG4gICAgZmluZElucHV0c09uRWxlbWVudFdpdGhUYWcodGVtcGxhdGUuY29udGVudCwgJ3NlbGVjdGVkJywgWydtYXQtYnV0dG9uLXRvZ2dsZS1ncm91cCddKS5mb3JFYWNoKFxuICAgICAgb2Zmc2V0ID0+IHtcbiAgICAgICAgdGhpcy5mYWlsdXJlcy5wdXNoKHtcbiAgICAgICAgICBmaWxlUGF0aDogdGVtcGxhdGUuZmlsZVBhdGgsXG4gICAgICAgICAgcG9zaXRpb246IHRlbXBsYXRlLmdldENoYXJhY3RlckFuZExpbmVPZlBvc2l0aW9uKHRlbXBsYXRlLnN0YXJ0ICsgb2Zmc2V0KSxcbiAgICAgICAgICBtZXNzYWdlOlxuICAgICAgICAgICAgYEZvdW5kIGRlcHJlY2F0ZWQgXCJzZWxlY3RlZFwiIGlucHV0IGJpbmRpbmcgb24gXCJtYXQtcmFkaW8tYnV0dG9uLWdyb3VwXCIuIGAgK1xuICAgICAgICAgICAgYFVzZSBcInZhbHVlXCIgaW5zdGVhZC5gLFxuICAgICAgICB9KTtcbiAgICAgIH0sXG4gICAgKTtcbiAgfVxufVxuIl19