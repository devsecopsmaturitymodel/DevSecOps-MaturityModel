/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { Directive, Optional, Self } from '@angular/core';
import { ControlContainer } from './control_container';
import { NgControl } from './ng_control';
import * as i0 from "@angular/core";
import * as i1 from "./ng_control";
import * as i2 from "./control_container";
export class AbstractControlStatus {
    constructor(cd) {
        this._cd = cd;
    }
    is(status) {
        // Currently with ViewEngine (in AOT mode) it's not possible to use private methods in host
        // bindings.
        // TODO: once ViewEngine is removed, this function should be refactored:
        //  - make the `is` method `protected`, so it's not accessible publicly
        //  - move the `submitted` status logic to the `NgControlStatusGroup` class
        //    and make it `private` or `protected` too.
        if (status === 'submitted') {
            // We check for the `submitted` field from `NgForm` and `FormGroupDirective` classes, but
            // we avoid instanceof checks to prevent non-tree-shakable references to those types.
            return !!this._cd?.submitted;
        }
        return !!this._cd?.control?.[status];
    }
}
export const ngControlStatusHost = {
    '[class.ng-untouched]': 'is("untouched")',
    '[class.ng-touched]': 'is("touched")',
    '[class.ng-pristine]': 'is("pristine")',
    '[class.ng-dirty]': 'is("dirty")',
    '[class.ng-valid]': 'is("valid")',
    '[class.ng-invalid]': 'is("invalid")',
    '[class.ng-pending]': 'is("pending")',
};
export const ngGroupStatusHost = {
    '[class.ng-untouched]': 'is("untouched")',
    '[class.ng-touched]': 'is("touched")',
    '[class.ng-pristine]': 'is("pristine")',
    '[class.ng-dirty]': 'is("dirty")',
    '[class.ng-valid]': 'is("valid")',
    '[class.ng-invalid]': 'is("invalid")',
    '[class.ng-pending]': 'is("pending")',
    '[class.ng-submitted]': 'is("submitted")',
};
/**
 * @description
 * Directive automatically applied to Angular form controls that sets CSS classes
 * based on control status.
 *
 * @usageNotes
 *
 * ### CSS classes applied
 *
 * The following classes are applied as the properties become true:
 *
 * * ng-valid
 * * ng-invalid
 * * ng-pending
 * * ng-pristine
 * * ng-dirty
 * * ng-untouched
 * * ng-touched
 *
 * @ngModule ReactiveFormsModule
 * @ngModule FormsModule
 * @publicApi
 */
export class NgControlStatus extends AbstractControlStatus {
    constructor(cd) {
        super(cd);
    }
}
NgControlStatus.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.10", ngImport: i0, type: NgControlStatus, deps: [{ token: i1.NgControl, self: true }], target: i0.ɵɵFactoryTarget.Directive });
NgControlStatus.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "12.0.0", version: "13.3.10", type: NgControlStatus, selector: "[formControlName],[ngModel],[formControl]", host: { properties: { "class.ng-untouched": "is(\"untouched\")", "class.ng-touched": "is(\"touched\")", "class.ng-pristine": "is(\"pristine\")", "class.ng-dirty": "is(\"dirty\")", "class.ng-valid": "is(\"valid\")", "class.ng-invalid": "is(\"invalid\")", "class.ng-pending": "is(\"pending\")" } }, usesInheritance: true, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.10", ngImport: i0, type: NgControlStatus, decorators: [{
            type: Directive,
            args: [{ selector: '[formControlName],[ngModel],[formControl]', host: ngControlStatusHost }]
        }], ctorParameters: function () { return [{ type: i1.NgControl, decorators: [{
                    type: Self
                }] }]; } });
/**
 * @description
 * Directive automatically applied to Angular form groups that sets CSS classes
 * based on control status (valid/invalid/dirty/etc). On groups, this includes the additional
 * class ng-submitted.
 *
 * @see `NgControlStatus`
 *
 * @ngModule ReactiveFormsModule
 * @ngModule FormsModule
 * @publicApi
 */
export class NgControlStatusGroup extends AbstractControlStatus {
    constructor(cd) {
        super(cd);
    }
}
NgControlStatusGroup.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.10", ngImport: i0, type: NgControlStatusGroup, deps: [{ token: i2.ControlContainer, optional: true, self: true }], target: i0.ɵɵFactoryTarget.Directive });
NgControlStatusGroup.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "12.0.0", version: "13.3.10", type: NgControlStatusGroup, selector: "[formGroupName],[formArrayName],[ngModelGroup],[formGroup],form:not([ngNoForm]),[ngForm]", host: { properties: { "class.ng-untouched": "is(\"untouched\")", "class.ng-touched": "is(\"touched\")", "class.ng-pristine": "is(\"pristine\")", "class.ng-dirty": "is(\"dirty\")", "class.ng-valid": "is(\"valid\")", "class.ng-invalid": "is(\"invalid\")", "class.ng-pending": "is(\"pending\")", "class.ng-submitted": "is(\"submitted\")" } }, usesInheritance: true, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.10", ngImport: i0, type: NgControlStatusGroup, decorators: [{
            type: Directive,
            args: [{
                    selector: '[formGroupName],[formArrayName],[ngModelGroup],[formGroup],form:not([ngNoForm]),[ngForm]',
                    host: ngGroupStatusHost
                }]
        }], ctorParameters: function () { return [{ type: i2.ControlContainer, decorators: [{
                    type: Optional
                }, {
                    type: Self
                }] }]; } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmdfY29udHJvbF9zdGF0dXMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9mb3Jtcy9zcmMvZGlyZWN0aXZlcy9uZ19jb250cm9sX3N0YXR1cy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0dBTUc7QUFFSCxPQUFPLEVBQUMsU0FBUyxFQUFFLFFBQVEsRUFBRSxJQUFJLEVBQUMsTUFBTSxlQUFlLENBQUM7QUFHeEQsT0FBTyxFQUFDLGdCQUFnQixFQUFDLE1BQU0scUJBQXFCLENBQUM7QUFDckQsT0FBTyxFQUFDLFNBQVMsRUFBQyxNQUFNLGNBQWMsQ0FBQzs7OztBQUt2QyxNQUFNLE9BQU8scUJBQXFCO0lBR2hDLFlBQVksRUFBaUM7UUFDM0MsSUFBSSxDQUFDLEdBQUcsR0FBRyxFQUFFLENBQUM7SUFDaEIsQ0FBQztJQUVELEVBQUUsQ0FBQyxNQUF3QjtRQUN6QiwyRkFBMkY7UUFDM0YsWUFBWTtRQUNaLHdFQUF3RTtRQUN4RSx1RUFBdUU7UUFDdkUsMkVBQTJFO1FBQzNFLCtDQUErQztRQUMvQyxJQUFJLE1BQU0sS0FBSyxXQUFXLEVBQUU7WUFDMUIseUZBQXlGO1lBQ3pGLHFGQUFxRjtZQUNyRixPQUFPLENBQUMsQ0FBRSxJQUFJLENBQUMsR0FBOEMsRUFBRSxTQUFTLENBQUM7U0FDMUU7UUFDRCxPQUFPLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxFQUFFLE9BQU8sRUFBRSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0lBQ3ZDLENBQUM7Q0FDRjtBQUVELE1BQU0sQ0FBQyxNQUFNLG1CQUFtQixHQUFHO0lBQ2pDLHNCQUFzQixFQUFFLGlCQUFpQjtJQUN6QyxvQkFBb0IsRUFBRSxlQUFlO0lBQ3JDLHFCQUFxQixFQUFFLGdCQUFnQjtJQUN2QyxrQkFBa0IsRUFBRSxhQUFhO0lBQ2pDLGtCQUFrQixFQUFFLGFBQWE7SUFDakMsb0JBQW9CLEVBQUUsZUFBZTtJQUNyQyxvQkFBb0IsRUFBRSxlQUFlO0NBQ3RDLENBQUM7QUFFRixNQUFNLENBQUMsTUFBTSxpQkFBaUIsR0FBRztJQUMvQixzQkFBc0IsRUFBRSxpQkFBaUI7SUFDekMsb0JBQW9CLEVBQUUsZUFBZTtJQUNyQyxxQkFBcUIsRUFBRSxnQkFBZ0I7SUFDdkMsa0JBQWtCLEVBQUUsYUFBYTtJQUNqQyxrQkFBa0IsRUFBRSxhQUFhO0lBQ2pDLG9CQUFvQixFQUFFLGVBQWU7SUFDckMsb0JBQW9CLEVBQUUsZUFBZTtJQUNyQyxzQkFBc0IsRUFBRSxpQkFBaUI7Q0FDMUMsQ0FBQztBQUVGOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0dBc0JHO0FBRUgsTUFBTSxPQUFPLGVBQWdCLFNBQVEscUJBQXFCO0lBQ3hELFlBQW9CLEVBQWE7UUFDL0IsS0FBSyxDQUFDLEVBQUUsQ0FBQyxDQUFDO0lBQ1osQ0FBQzs7dUhBSFUsZUFBZTsyR0FBZixlQUFlO3NHQUFmLGVBQWU7a0JBRDNCLFNBQVM7bUJBQUMsRUFBQyxRQUFRLEVBQUUsMkNBQTJDLEVBQUUsSUFBSSxFQUFFLG1CQUFtQixFQUFDOzswQkFFOUUsSUFBSTs7QUFLbkI7Ozs7Ozs7Ozs7O0dBV0c7QUFNSCxNQUFNLE9BQU8sb0JBQXFCLFNBQVEscUJBQXFCO0lBQzdELFlBQWdDLEVBQW9CO1FBQ2xELEtBQUssQ0FBQyxFQUFFLENBQUMsQ0FBQztJQUNaLENBQUM7OzRIQUhVLG9CQUFvQjtnSEFBcEIsb0JBQW9CO3NHQUFwQixvQkFBb0I7a0JBTGhDLFNBQVM7bUJBQUM7b0JBQ1QsUUFBUSxFQUNKLDBGQUEwRjtvQkFDOUYsSUFBSSxFQUFFLGlCQUFpQjtpQkFDeEI7OzBCQUVjLFFBQVE7OzBCQUFJLElBQUkiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtEaXJlY3RpdmUsIE9wdGlvbmFsLCBTZWxmfSBmcm9tICdAYW5ndWxhci9jb3JlJztcblxuaW1wb3J0IHtBYnN0cmFjdENvbnRyb2xEaXJlY3RpdmV9IGZyb20gJy4vYWJzdHJhY3RfY29udHJvbF9kaXJlY3RpdmUnO1xuaW1wb3J0IHtDb250cm9sQ29udGFpbmVyfSBmcm9tICcuL2NvbnRyb2xfY29udGFpbmVyJztcbmltcG9ydCB7TmdDb250cm9sfSBmcm9tICcuL25nX2NvbnRyb2wnO1xuXG50eXBlIEFueUNvbnRyb2xTdGF0dXMgPVxuICAgICd1bnRvdWNoZWQnfCd0b3VjaGVkJ3wncHJpc3RpbmUnfCdkaXJ0eSd8J3ZhbGlkJ3wnaW52YWxpZCd8J3BlbmRpbmcnfCdzdWJtaXR0ZWQnO1xuXG5leHBvcnQgY2xhc3MgQWJzdHJhY3RDb250cm9sU3RhdHVzIHtcbiAgcHJpdmF0ZSBfY2Q6IEFic3RyYWN0Q29udHJvbERpcmVjdGl2ZXxudWxsO1xuXG4gIGNvbnN0cnVjdG9yKGNkOiBBYnN0cmFjdENvbnRyb2xEaXJlY3RpdmV8bnVsbCkge1xuICAgIHRoaXMuX2NkID0gY2Q7XG4gIH1cblxuICBpcyhzdGF0dXM6IEFueUNvbnRyb2xTdGF0dXMpOiBib29sZWFuIHtcbiAgICAvLyBDdXJyZW50bHkgd2l0aCBWaWV3RW5naW5lIChpbiBBT1QgbW9kZSkgaXQncyBub3QgcG9zc2libGUgdG8gdXNlIHByaXZhdGUgbWV0aG9kcyBpbiBob3N0XG4gICAgLy8gYmluZGluZ3MuXG4gICAgLy8gVE9ETzogb25jZSBWaWV3RW5naW5lIGlzIHJlbW92ZWQsIHRoaXMgZnVuY3Rpb24gc2hvdWxkIGJlIHJlZmFjdG9yZWQ6XG4gICAgLy8gIC0gbWFrZSB0aGUgYGlzYCBtZXRob2QgYHByb3RlY3RlZGAsIHNvIGl0J3Mgbm90IGFjY2Vzc2libGUgcHVibGljbHlcbiAgICAvLyAgLSBtb3ZlIHRoZSBgc3VibWl0dGVkYCBzdGF0dXMgbG9naWMgdG8gdGhlIGBOZ0NvbnRyb2xTdGF0dXNHcm91cGAgY2xhc3NcbiAgICAvLyAgICBhbmQgbWFrZSBpdCBgcHJpdmF0ZWAgb3IgYHByb3RlY3RlZGAgdG9vLlxuICAgIGlmIChzdGF0dXMgPT09ICdzdWJtaXR0ZWQnKSB7XG4gICAgICAvLyBXZSBjaGVjayBmb3IgdGhlIGBzdWJtaXR0ZWRgIGZpZWxkIGZyb20gYE5nRm9ybWAgYW5kIGBGb3JtR3JvdXBEaXJlY3RpdmVgIGNsYXNzZXMsIGJ1dFxuICAgICAgLy8gd2UgYXZvaWQgaW5zdGFuY2VvZiBjaGVja3MgdG8gcHJldmVudCBub24tdHJlZS1zaGFrYWJsZSByZWZlcmVuY2VzIHRvIHRob3NlIHR5cGVzLlxuICAgICAgcmV0dXJuICEhKHRoaXMuX2NkIGFzIHVua25vd24gYXMge3N1Ym1pdHRlZDogYm9vbGVhbn0gfCBudWxsKT8uc3VibWl0dGVkO1xuICAgIH1cbiAgICByZXR1cm4gISF0aGlzLl9jZD8uY29udHJvbD8uW3N0YXR1c107XG4gIH1cbn1cblxuZXhwb3J0IGNvbnN0IG5nQ29udHJvbFN0YXR1c0hvc3QgPSB7XG4gICdbY2xhc3MubmctdW50b3VjaGVkXSc6ICdpcyhcInVudG91Y2hlZFwiKScsXG4gICdbY2xhc3MubmctdG91Y2hlZF0nOiAnaXMoXCJ0b3VjaGVkXCIpJyxcbiAgJ1tjbGFzcy5uZy1wcmlzdGluZV0nOiAnaXMoXCJwcmlzdGluZVwiKScsXG4gICdbY2xhc3MubmctZGlydHldJzogJ2lzKFwiZGlydHlcIiknLFxuICAnW2NsYXNzLm5nLXZhbGlkXSc6ICdpcyhcInZhbGlkXCIpJyxcbiAgJ1tjbGFzcy5uZy1pbnZhbGlkXSc6ICdpcyhcImludmFsaWRcIiknLFxuICAnW2NsYXNzLm5nLXBlbmRpbmddJzogJ2lzKFwicGVuZGluZ1wiKScsXG59O1xuXG5leHBvcnQgY29uc3QgbmdHcm91cFN0YXR1c0hvc3QgPSB7XG4gICdbY2xhc3MubmctdW50b3VjaGVkXSc6ICdpcyhcInVudG91Y2hlZFwiKScsXG4gICdbY2xhc3MubmctdG91Y2hlZF0nOiAnaXMoXCJ0b3VjaGVkXCIpJyxcbiAgJ1tjbGFzcy5uZy1wcmlzdGluZV0nOiAnaXMoXCJwcmlzdGluZVwiKScsXG4gICdbY2xhc3MubmctZGlydHldJzogJ2lzKFwiZGlydHlcIiknLFxuICAnW2NsYXNzLm5nLXZhbGlkXSc6ICdpcyhcInZhbGlkXCIpJyxcbiAgJ1tjbGFzcy5uZy1pbnZhbGlkXSc6ICdpcyhcImludmFsaWRcIiknLFxuICAnW2NsYXNzLm5nLXBlbmRpbmddJzogJ2lzKFwicGVuZGluZ1wiKScsXG4gICdbY2xhc3Mubmctc3VibWl0dGVkXSc6ICdpcyhcInN1Ym1pdHRlZFwiKScsXG59O1xuXG4vKipcbiAqIEBkZXNjcmlwdGlvblxuICogRGlyZWN0aXZlIGF1dG9tYXRpY2FsbHkgYXBwbGllZCB0byBBbmd1bGFyIGZvcm0gY29udHJvbHMgdGhhdCBzZXRzIENTUyBjbGFzc2VzXG4gKiBiYXNlZCBvbiBjb250cm9sIHN0YXR1cy5cbiAqXG4gKiBAdXNhZ2VOb3Rlc1xuICpcbiAqICMjIyBDU1MgY2xhc3NlcyBhcHBsaWVkXG4gKlxuICogVGhlIGZvbGxvd2luZyBjbGFzc2VzIGFyZSBhcHBsaWVkIGFzIHRoZSBwcm9wZXJ0aWVzIGJlY29tZSB0cnVlOlxuICpcbiAqICogbmctdmFsaWRcbiAqICogbmctaW52YWxpZFxuICogKiBuZy1wZW5kaW5nXG4gKiAqIG5nLXByaXN0aW5lXG4gKiAqIG5nLWRpcnR5XG4gKiAqIG5nLXVudG91Y2hlZFxuICogKiBuZy10b3VjaGVkXG4gKlxuICogQG5nTW9kdWxlIFJlYWN0aXZlRm9ybXNNb2R1bGVcbiAqIEBuZ01vZHVsZSBGb3Jtc01vZHVsZVxuICogQHB1YmxpY0FwaVxuICovXG5ARGlyZWN0aXZlKHtzZWxlY3RvcjogJ1tmb3JtQ29udHJvbE5hbWVdLFtuZ01vZGVsXSxbZm9ybUNvbnRyb2xdJywgaG9zdDogbmdDb250cm9sU3RhdHVzSG9zdH0pXG5leHBvcnQgY2xhc3MgTmdDb250cm9sU3RhdHVzIGV4dGVuZHMgQWJzdHJhY3RDb250cm9sU3RhdHVzIHtcbiAgY29uc3RydWN0b3IoQFNlbGYoKSBjZDogTmdDb250cm9sKSB7XG4gICAgc3VwZXIoY2QpO1xuICB9XG59XG5cbi8qKlxuICogQGRlc2NyaXB0aW9uXG4gKiBEaXJlY3RpdmUgYXV0b21hdGljYWxseSBhcHBsaWVkIHRvIEFuZ3VsYXIgZm9ybSBncm91cHMgdGhhdCBzZXRzIENTUyBjbGFzc2VzXG4gKiBiYXNlZCBvbiBjb250cm9sIHN0YXR1cyAodmFsaWQvaW52YWxpZC9kaXJ0eS9ldGMpLiBPbiBncm91cHMsIHRoaXMgaW5jbHVkZXMgdGhlIGFkZGl0aW9uYWxcbiAqIGNsYXNzIG5nLXN1Ym1pdHRlZC5cbiAqXG4gKiBAc2VlIGBOZ0NvbnRyb2xTdGF0dXNgXG4gKlxuICogQG5nTW9kdWxlIFJlYWN0aXZlRm9ybXNNb2R1bGVcbiAqIEBuZ01vZHVsZSBGb3Jtc01vZHVsZVxuICogQHB1YmxpY0FwaVxuICovXG5ARGlyZWN0aXZlKHtcbiAgc2VsZWN0b3I6XG4gICAgICAnW2Zvcm1Hcm91cE5hbWVdLFtmb3JtQXJyYXlOYW1lXSxbbmdNb2RlbEdyb3VwXSxbZm9ybUdyb3VwXSxmb3JtOm5vdChbbmdOb0Zvcm1dKSxbbmdGb3JtXScsXG4gIGhvc3Q6IG5nR3JvdXBTdGF0dXNIb3N0XG59KVxuZXhwb3J0IGNsYXNzIE5nQ29udHJvbFN0YXR1c0dyb3VwIGV4dGVuZHMgQWJzdHJhY3RDb250cm9sU3RhdHVzIHtcbiAgY29uc3RydWN0b3IoQE9wdGlvbmFsKCkgQFNlbGYoKSBjZDogQ29udHJvbENvbnRhaW5lcikge1xuICAgIHN1cGVyKGNkKTtcbiAgfVxufVxuIl19