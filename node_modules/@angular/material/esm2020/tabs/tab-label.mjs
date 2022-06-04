/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { Directive, Inject, InjectionToken, Optional, TemplateRef, ViewContainerRef, } from '@angular/core';
import { CdkPortal } from '@angular/cdk/portal';
import * as i0 from "@angular/core";
/**
 * Injection token that can be used to reference instances of `MatTabLabel`. It serves as
 * alternative token to the actual `MatTabLabel` class which could cause unnecessary
 * retention of the class and its directive metadata.
 */
export const MAT_TAB_LABEL = new InjectionToken('MatTabLabel');
/**
 * Used to provide a tab label to a tab without causing a circular dependency.
 * @docs-private
 */
export const MAT_TAB = new InjectionToken('MAT_TAB');
/** Used to flag tab labels for use with the portal directive */
export class MatTabLabel extends CdkPortal {
    constructor(templateRef, viewContainerRef, _closestTab) {
        super(templateRef, viewContainerRef);
        this._closestTab = _closestTab;
    }
}
MatTabLabel.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: MatTabLabel, deps: [{ token: i0.TemplateRef }, { token: i0.ViewContainerRef }, { token: MAT_TAB, optional: true }], target: i0.ɵɵFactoryTarget.Directive });
MatTabLabel.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "12.0.0", version: "13.3.0", type: MatTabLabel, selector: "[mat-tab-label], [matTabLabel]", providers: [{ provide: MAT_TAB_LABEL, useExisting: MatTabLabel }], usesInheritance: true, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: MatTabLabel, decorators: [{
            type: Directive,
            args: [{
                    selector: '[mat-tab-label], [matTabLabel]',
                    providers: [{ provide: MAT_TAB_LABEL, useExisting: MatTabLabel }],
                }]
        }], ctorParameters: function () { return [{ type: i0.TemplateRef }, { type: i0.ViewContainerRef }, { type: undefined, decorators: [{
                    type: Inject,
                    args: [MAT_TAB]
                }, {
                    type: Optional
                }] }]; } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGFiLWxhYmVsLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vc3JjL21hdGVyaWFsL3RhYnMvdGFiLWxhYmVsLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7R0FNRztBQUVILE9BQU8sRUFDTCxTQUFTLEVBQ1QsTUFBTSxFQUNOLGNBQWMsRUFDZCxRQUFRLEVBQ1IsV0FBVyxFQUNYLGdCQUFnQixHQUNqQixNQUFNLGVBQWUsQ0FBQztBQUN2QixPQUFPLEVBQUMsU0FBUyxFQUFDLE1BQU0scUJBQXFCLENBQUM7O0FBRTlDOzs7O0dBSUc7QUFDSCxNQUFNLENBQUMsTUFBTSxhQUFhLEdBQUcsSUFBSSxjQUFjLENBQWMsYUFBYSxDQUFDLENBQUM7QUFFNUU7OztHQUdHO0FBQ0gsTUFBTSxDQUFDLE1BQU0sT0FBTyxHQUFHLElBQUksY0FBYyxDQUFNLFNBQVMsQ0FBQyxDQUFDO0FBRTFELGdFQUFnRTtBQUtoRSxNQUFNLE9BQU8sV0FBWSxTQUFRLFNBQVM7SUFDeEMsWUFDRSxXQUE2QixFQUM3QixnQkFBa0MsRUFDRSxXQUFnQjtRQUVwRCxLQUFLLENBQUMsV0FBVyxFQUFFLGdCQUFnQixDQUFDLENBQUM7UUFGRCxnQkFBVyxHQUFYLFdBQVcsQ0FBSztJQUd0RCxDQUFDOzt3R0FQVSxXQUFXLDZFQUlaLE9BQU87NEZBSk4sV0FBVyx5REFGWCxDQUFDLEVBQUMsT0FBTyxFQUFFLGFBQWEsRUFBRSxXQUFXLEVBQUUsV0FBVyxFQUFDLENBQUM7MkZBRXBELFdBQVc7a0JBSnZCLFNBQVM7bUJBQUM7b0JBQ1QsUUFBUSxFQUFFLGdDQUFnQztvQkFDMUMsU0FBUyxFQUFFLENBQUMsRUFBQyxPQUFPLEVBQUUsYUFBYSxFQUFFLFdBQVcsYUFBYSxFQUFDLENBQUM7aUJBQ2hFOzswQkFLSSxNQUFNOzJCQUFDLE9BQU87OzBCQUFHLFFBQVEiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtcbiAgRGlyZWN0aXZlLFxuICBJbmplY3QsXG4gIEluamVjdGlvblRva2VuLFxuICBPcHRpb25hbCxcbiAgVGVtcGxhdGVSZWYsXG4gIFZpZXdDb250YWluZXJSZWYsXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtDZGtQb3J0YWx9IGZyb20gJ0Bhbmd1bGFyL2Nkay9wb3J0YWwnO1xuXG4vKipcbiAqIEluamVjdGlvbiB0b2tlbiB0aGF0IGNhbiBiZSB1c2VkIHRvIHJlZmVyZW5jZSBpbnN0YW5jZXMgb2YgYE1hdFRhYkxhYmVsYC4gSXQgc2VydmVzIGFzXG4gKiBhbHRlcm5hdGl2ZSB0b2tlbiB0byB0aGUgYWN0dWFsIGBNYXRUYWJMYWJlbGAgY2xhc3Mgd2hpY2ggY291bGQgY2F1c2UgdW5uZWNlc3NhcnlcbiAqIHJldGVudGlvbiBvZiB0aGUgY2xhc3MgYW5kIGl0cyBkaXJlY3RpdmUgbWV0YWRhdGEuXG4gKi9cbmV4cG9ydCBjb25zdCBNQVRfVEFCX0xBQkVMID0gbmV3IEluamVjdGlvblRva2VuPE1hdFRhYkxhYmVsPignTWF0VGFiTGFiZWwnKTtcblxuLyoqXG4gKiBVc2VkIHRvIHByb3ZpZGUgYSB0YWIgbGFiZWwgdG8gYSB0YWIgd2l0aG91dCBjYXVzaW5nIGEgY2lyY3VsYXIgZGVwZW5kZW5jeS5cbiAqIEBkb2NzLXByaXZhdGVcbiAqL1xuZXhwb3J0IGNvbnN0IE1BVF9UQUIgPSBuZXcgSW5qZWN0aW9uVG9rZW48YW55PignTUFUX1RBQicpO1xuXG4vKiogVXNlZCB0byBmbGFnIHRhYiBsYWJlbHMgZm9yIHVzZSB3aXRoIHRoZSBwb3J0YWwgZGlyZWN0aXZlICovXG5ARGlyZWN0aXZlKHtcbiAgc2VsZWN0b3I6ICdbbWF0LXRhYi1sYWJlbF0sIFttYXRUYWJMYWJlbF0nLFxuICBwcm92aWRlcnM6IFt7cHJvdmlkZTogTUFUX1RBQl9MQUJFTCwgdXNlRXhpc3Rpbmc6IE1hdFRhYkxhYmVsfV0sXG59KVxuZXhwb3J0IGNsYXNzIE1hdFRhYkxhYmVsIGV4dGVuZHMgQ2RrUG9ydGFsIHtcbiAgY29uc3RydWN0b3IoXG4gICAgdGVtcGxhdGVSZWY6IFRlbXBsYXRlUmVmPGFueT4sXG4gICAgdmlld0NvbnRhaW5lclJlZjogVmlld0NvbnRhaW5lclJlZixcbiAgICBASW5qZWN0KE1BVF9UQUIpIEBPcHRpb25hbCgpIHB1YmxpYyBfY2xvc2VzdFRhYjogYW55LFxuICApIHtcbiAgICBzdXBlcih0ZW1wbGF0ZVJlZiwgdmlld0NvbnRhaW5lclJlZik7XG4gIH1cbn1cbiJdfQ==