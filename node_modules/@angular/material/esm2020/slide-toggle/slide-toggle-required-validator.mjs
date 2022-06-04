/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { Directive, forwardRef } from '@angular/core';
import { CheckboxRequiredValidator, NG_VALIDATORS } from '@angular/forms';
import * as i0 from "@angular/core";
export const MAT_SLIDE_TOGGLE_REQUIRED_VALIDATOR = {
    provide: NG_VALIDATORS,
    useExisting: forwardRef(() => MatSlideToggleRequiredValidator),
    multi: true,
};
/**
 * Validator for Material slide-toggle components with the required attribute in a
 * template-driven form. The default validator for required form controls asserts
 * that the control value is not undefined but that is not appropriate for a slide-toggle
 * where the value is always defined.
 *
 * Required slide-toggle form controls are valid when checked.
 */
export class MatSlideToggleRequiredValidator extends CheckboxRequiredValidator {
}
MatSlideToggleRequiredValidator.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: MatSlideToggleRequiredValidator, deps: null, target: i0.ɵɵFactoryTarget.Directive });
MatSlideToggleRequiredValidator.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "12.0.0", version: "13.3.0", type: MatSlideToggleRequiredValidator, selector: "mat-slide-toggle[required][formControlName],\n             mat-slide-toggle[required][formControl], mat-slide-toggle[required][ngModel]", providers: [MAT_SLIDE_TOGGLE_REQUIRED_VALIDATOR], usesInheritance: true, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: MatSlideToggleRequiredValidator, decorators: [{
            type: Directive,
            args: [{
                    selector: `mat-slide-toggle[required][formControlName],
             mat-slide-toggle[required][formControl], mat-slide-toggle[required][ngModel]`,
                    providers: [MAT_SLIDE_TOGGLE_REQUIRED_VALIDATOR],
                }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2xpZGUtdG9nZ2xlLXJlcXVpcmVkLXZhbGlkYXRvci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3NyYy9tYXRlcmlhbC9zbGlkZS10b2dnbGUvc2xpZGUtdG9nZ2xlLXJlcXVpcmVkLXZhbGlkYXRvci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0dBTUc7QUFFSCxPQUFPLEVBQUMsU0FBUyxFQUFFLFVBQVUsRUFBVyxNQUFNLGVBQWUsQ0FBQztBQUM5RCxPQUFPLEVBQUMseUJBQXlCLEVBQUUsYUFBYSxFQUFDLE1BQU0sZ0JBQWdCLENBQUM7O0FBRXhFLE1BQU0sQ0FBQyxNQUFNLG1DQUFtQyxHQUFhO0lBQzNELE9BQU8sRUFBRSxhQUFhO0lBQ3RCLFdBQVcsRUFBRSxVQUFVLENBQUMsR0FBRyxFQUFFLENBQUMsK0JBQStCLENBQUM7SUFDOUQsS0FBSyxFQUFFLElBQUk7Q0FDWixDQUFDO0FBRUY7Ozs7Ozs7R0FPRztBQU1ILE1BQU0sT0FBTywrQkFBZ0MsU0FBUSx5QkFBeUI7OzRIQUFqRSwrQkFBK0I7Z0hBQS9CLCtCQUErQixrS0FGL0IsQ0FBQyxtQ0FBbUMsQ0FBQzsyRkFFckMsK0JBQStCO2tCQUwzQyxTQUFTO21CQUFDO29CQUNULFFBQVEsRUFBRTswRkFDOEU7b0JBQ3hGLFNBQVMsRUFBRSxDQUFDLG1DQUFtQyxDQUFDO2lCQUNqRCIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge0RpcmVjdGl2ZSwgZm9yd2FyZFJlZiwgUHJvdmlkZXJ9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtDaGVja2JveFJlcXVpcmVkVmFsaWRhdG9yLCBOR19WQUxJREFUT1JTfSBmcm9tICdAYW5ndWxhci9mb3Jtcyc7XG5cbmV4cG9ydCBjb25zdCBNQVRfU0xJREVfVE9HR0xFX1JFUVVJUkVEX1ZBTElEQVRPUjogUHJvdmlkZXIgPSB7XG4gIHByb3ZpZGU6IE5HX1ZBTElEQVRPUlMsXG4gIHVzZUV4aXN0aW5nOiBmb3J3YXJkUmVmKCgpID0+IE1hdFNsaWRlVG9nZ2xlUmVxdWlyZWRWYWxpZGF0b3IpLFxuICBtdWx0aTogdHJ1ZSxcbn07XG5cbi8qKlxuICogVmFsaWRhdG9yIGZvciBNYXRlcmlhbCBzbGlkZS10b2dnbGUgY29tcG9uZW50cyB3aXRoIHRoZSByZXF1aXJlZCBhdHRyaWJ1dGUgaW4gYVxuICogdGVtcGxhdGUtZHJpdmVuIGZvcm0uIFRoZSBkZWZhdWx0IHZhbGlkYXRvciBmb3IgcmVxdWlyZWQgZm9ybSBjb250cm9scyBhc3NlcnRzXG4gKiB0aGF0IHRoZSBjb250cm9sIHZhbHVlIGlzIG5vdCB1bmRlZmluZWQgYnV0IHRoYXQgaXMgbm90IGFwcHJvcHJpYXRlIGZvciBhIHNsaWRlLXRvZ2dsZVxuICogd2hlcmUgdGhlIHZhbHVlIGlzIGFsd2F5cyBkZWZpbmVkLlxuICpcbiAqIFJlcXVpcmVkIHNsaWRlLXRvZ2dsZSBmb3JtIGNvbnRyb2xzIGFyZSB2YWxpZCB3aGVuIGNoZWNrZWQuXG4gKi9cbkBEaXJlY3RpdmUoe1xuICBzZWxlY3RvcjogYG1hdC1zbGlkZS10b2dnbGVbcmVxdWlyZWRdW2Zvcm1Db250cm9sTmFtZV0sXG4gICAgICAgICAgICAgbWF0LXNsaWRlLXRvZ2dsZVtyZXF1aXJlZF1bZm9ybUNvbnRyb2xdLCBtYXQtc2xpZGUtdG9nZ2xlW3JlcXVpcmVkXVtuZ01vZGVsXWAsXG4gIHByb3ZpZGVyczogW01BVF9TTElERV9UT0dHTEVfUkVRVUlSRURfVkFMSURBVE9SXSxcbn0pXG5leHBvcnQgY2xhc3MgTWF0U2xpZGVUb2dnbGVSZXF1aXJlZFZhbGlkYXRvciBleHRlbmRzIENoZWNrYm94UmVxdWlyZWRWYWxpZGF0b3Ige31cbiJdfQ==