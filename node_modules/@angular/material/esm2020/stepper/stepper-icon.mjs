/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { Directive, Input, TemplateRef } from '@angular/core';
import * as i0 from "@angular/core";
/**
 * Template to be used to override the icons inside the step header.
 */
export class MatStepperIcon {
    constructor(templateRef) {
        this.templateRef = templateRef;
    }
}
MatStepperIcon.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: MatStepperIcon, deps: [{ token: i0.TemplateRef }], target: i0.ɵɵFactoryTarget.Directive });
MatStepperIcon.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "12.0.0", version: "13.3.0", type: MatStepperIcon, selector: "ng-template[matStepperIcon]", inputs: { name: ["matStepperIcon", "name"] }, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: MatStepperIcon, decorators: [{
            type: Directive,
            args: [{
                    selector: 'ng-template[matStepperIcon]',
                }]
        }], ctorParameters: function () { return [{ type: i0.TemplateRef }]; }, propDecorators: { name: [{
                type: Input,
                args: ['matStepperIcon']
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3RlcHBlci1pY29uLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vc3JjL21hdGVyaWFsL3N0ZXBwZXIvc3RlcHBlci1pY29uLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7R0FNRztBQUVILE9BQU8sRUFBQyxTQUFTLEVBQUUsS0FBSyxFQUFFLFdBQVcsRUFBQyxNQUFNLGVBQWUsQ0FBQzs7QUFhNUQ7O0dBRUc7QUFJSCxNQUFNLE9BQU8sY0FBYztJQUl6QixZQUFtQixXQUErQztRQUEvQyxnQkFBVyxHQUFYLFdBQVcsQ0FBb0M7SUFBRyxDQUFDOzsyR0FKM0QsY0FBYzsrRkFBZCxjQUFjOzJGQUFkLGNBQWM7a0JBSDFCLFNBQVM7bUJBQUM7b0JBQ1QsUUFBUSxFQUFFLDZCQUE2QjtpQkFDeEM7a0dBRzBCLElBQUk7c0JBQTVCLEtBQUs7dUJBQUMsZ0JBQWdCIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7RGlyZWN0aXZlLCBJbnB1dCwgVGVtcGxhdGVSZWZ9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtTdGVwU3RhdGV9IGZyb20gJ0Bhbmd1bGFyL2Nkay9zdGVwcGVyJztcblxuLyoqIFRlbXBsYXRlIGNvbnRleHQgYXZhaWxhYmxlIHRvIGFuIGF0dGFjaGVkIGBtYXRTdGVwcGVySWNvbmAuICovXG5leHBvcnQgaW50ZXJmYWNlIE1hdFN0ZXBwZXJJY29uQ29udGV4dCB7XG4gIC8qKiBJbmRleCBvZiB0aGUgc3RlcC4gKi9cbiAgaW5kZXg6IG51bWJlcjtcbiAgLyoqIFdoZXRoZXIgdGhlIHN0ZXAgaXMgY3VycmVudGx5IGFjdGl2ZS4gKi9cbiAgYWN0aXZlOiBib29sZWFuO1xuICAvKiogV2hldGhlciB0aGUgc3RlcCBpcyBvcHRpb25hbC4gKi9cbiAgb3B0aW9uYWw6IGJvb2xlYW47XG59XG5cbi8qKlxuICogVGVtcGxhdGUgdG8gYmUgdXNlZCB0byBvdmVycmlkZSB0aGUgaWNvbnMgaW5zaWRlIHRoZSBzdGVwIGhlYWRlci5cbiAqL1xuQERpcmVjdGl2ZSh7XG4gIHNlbGVjdG9yOiAnbmctdGVtcGxhdGVbbWF0U3RlcHBlckljb25dJyxcbn0pXG5leHBvcnQgY2xhc3MgTWF0U3RlcHBlckljb24ge1xuICAvKiogTmFtZSBvZiB0aGUgaWNvbiB0byBiZSBvdmVycmlkZGVuLiAqL1xuICBASW5wdXQoJ21hdFN0ZXBwZXJJY29uJykgbmFtZTogU3RlcFN0YXRlO1xuXG4gIGNvbnN0cnVjdG9yKHB1YmxpYyB0ZW1wbGF0ZVJlZjogVGVtcGxhdGVSZWY8TWF0U3RlcHBlckljb25Db250ZXh0Pikge31cbn1cbiJdfQ==