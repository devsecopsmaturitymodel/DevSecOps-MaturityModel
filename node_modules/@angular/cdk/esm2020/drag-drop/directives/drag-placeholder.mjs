/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { Directive, TemplateRef, Input, InjectionToken } from '@angular/core';
import * as i0 from "@angular/core";
/**
 * Injection token that can be used to reference instances of `CdkDragPlaceholder`. It serves as
 * alternative token to the actual `CdkDragPlaceholder` class which could cause unnecessary
 * retention of the class and its directive metadata.
 */
export const CDK_DRAG_PLACEHOLDER = new InjectionToken('CdkDragPlaceholder');
/**
 * Element that will be used as a template for the placeholder of a CdkDrag when
 * it is being dragged. The placeholder is displayed in place of the element being dragged.
 */
export class CdkDragPlaceholder {
    constructor(templateRef) {
        this.templateRef = templateRef;
    }
}
CdkDragPlaceholder.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: CdkDragPlaceholder, deps: [{ token: i0.TemplateRef }], target: i0.ɵɵFactoryTarget.Directive });
CdkDragPlaceholder.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "12.0.0", version: "13.3.0", type: CdkDragPlaceholder, selector: "ng-template[cdkDragPlaceholder]", inputs: { data: "data" }, providers: [{ provide: CDK_DRAG_PLACEHOLDER, useExisting: CdkDragPlaceholder }], ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: CdkDragPlaceholder, decorators: [{
            type: Directive,
            args: [{
                    selector: 'ng-template[cdkDragPlaceholder]',
                    providers: [{ provide: CDK_DRAG_PLACEHOLDER, useExisting: CdkDragPlaceholder }],
                }]
        }], ctorParameters: function () { return [{ type: i0.TemplateRef }]; }, propDecorators: { data: [{
                type: Input
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZHJhZy1wbGFjZWhvbGRlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uL3NyYy9jZGsvZHJhZy1kcm9wL2RpcmVjdGl2ZXMvZHJhZy1wbGFjZWhvbGRlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0dBTUc7QUFFSCxPQUFPLEVBQUMsU0FBUyxFQUFFLFdBQVcsRUFBRSxLQUFLLEVBQUUsY0FBYyxFQUFDLE1BQU0sZUFBZSxDQUFDOztBQUU1RTs7OztHQUlHO0FBQ0gsTUFBTSxDQUFDLE1BQU0sb0JBQW9CLEdBQUcsSUFBSSxjQUFjLENBQXFCLG9CQUFvQixDQUFDLENBQUM7QUFFakc7OztHQUdHO0FBS0gsTUFBTSxPQUFPLGtCQUFrQjtJQUc3QixZQUFtQixXQUEyQjtRQUEzQixnQkFBVyxHQUFYLFdBQVcsQ0FBZ0I7SUFBRyxDQUFDOzsrR0FIdkMsa0JBQWtCO21HQUFsQixrQkFBa0Isb0ZBRmxCLENBQUMsRUFBQyxPQUFPLEVBQUUsb0JBQW9CLEVBQUUsV0FBVyxFQUFFLGtCQUFrQixFQUFDLENBQUM7MkZBRWxFLGtCQUFrQjtrQkFKOUIsU0FBUzttQkFBQztvQkFDVCxRQUFRLEVBQUUsaUNBQWlDO29CQUMzQyxTQUFTLEVBQUUsQ0FBQyxFQUFDLE9BQU8sRUFBRSxvQkFBb0IsRUFBRSxXQUFXLG9CQUFvQixFQUFDLENBQUM7aUJBQzlFO2tHQUdVLElBQUk7c0JBQVosS0FBSyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge0RpcmVjdGl2ZSwgVGVtcGxhdGVSZWYsIElucHV0LCBJbmplY3Rpb25Ub2tlbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5cbi8qKlxuICogSW5qZWN0aW9uIHRva2VuIHRoYXQgY2FuIGJlIHVzZWQgdG8gcmVmZXJlbmNlIGluc3RhbmNlcyBvZiBgQ2RrRHJhZ1BsYWNlaG9sZGVyYC4gSXQgc2VydmVzIGFzXG4gKiBhbHRlcm5hdGl2ZSB0b2tlbiB0byB0aGUgYWN0dWFsIGBDZGtEcmFnUGxhY2Vob2xkZXJgIGNsYXNzIHdoaWNoIGNvdWxkIGNhdXNlIHVubmVjZXNzYXJ5XG4gKiByZXRlbnRpb24gb2YgdGhlIGNsYXNzIGFuZCBpdHMgZGlyZWN0aXZlIG1ldGFkYXRhLlxuICovXG5leHBvcnQgY29uc3QgQ0RLX0RSQUdfUExBQ0VIT0xERVIgPSBuZXcgSW5qZWN0aW9uVG9rZW48Q2RrRHJhZ1BsYWNlaG9sZGVyPignQ2RrRHJhZ1BsYWNlaG9sZGVyJyk7XG5cbi8qKlxuICogRWxlbWVudCB0aGF0IHdpbGwgYmUgdXNlZCBhcyBhIHRlbXBsYXRlIGZvciB0aGUgcGxhY2Vob2xkZXIgb2YgYSBDZGtEcmFnIHdoZW5cbiAqIGl0IGlzIGJlaW5nIGRyYWdnZWQuIFRoZSBwbGFjZWhvbGRlciBpcyBkaXNwbGF5ZWQgaW4gcGxhY2Ugb2YgdGhlIGVsZW1lbnQgYmVpbmcgZHJhZ2dlZC5cbiAqL1xuQERpcmVjdGl2ZSh7XG4gIHNlbGVjdG9yOiAnbmctdGVtcGxhdGVbY2RrRHJhZ1BsYWNlaG9sZGVyXScsXG4gIHByb3ZpZGVyczogW3twcm92aWRlOiBDREtfRFJBR19QTEFDRUhPTERFUiwgdXNlRXhpc3Rpbmc6IENka0RyYWdQbGFjZWhvbGRlcn1dLFxufSlcbmV4cG9ydCBjbGFzcyBDZGtEcmFnUGxhY2Vob2xkZXI8VCA9IGFueT4ge1xuICAvKiogQ29udGV4dCBkYXRhIHRvIGJlIGFkZGVkIHRvIHRoZSBwbGFjZWhvbGRlciB0ZW1wbGF0ZSBpbnN0YW5jZS4gKi9cbiAgQElucHV0KCkgZGF0YTogVDtcbiAgY29uc3RydWN0b3IocHVibGljIHRlbXBsYXRlUmVmOiBUZW1wbGF0ZVJlZjxUPikge31cbn1cbiJdfQ==