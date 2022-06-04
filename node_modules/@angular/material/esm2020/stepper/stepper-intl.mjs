/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { Injectable, Optional, SkipSelf } from '@angular/core';
import { Subject } from 'rxjs';
import * as i0 from "@angular/core";
/** Stepper data that is required for internationalization. */
export class MatStepperIntl {
    constructor() {
        /**
         * Stream that emits whenever the labels here are changed. Use this to notify
         * components if the labels have changed after initialization.
         */
        this.changes = new Subject();
        /** Label that is rendered below optional steps. */
        this.optionalLabel = 'Optional';
        /** Label that is used to indicate step as completed to screen readers. */
        this.completedLabel = 'Completed';
        /** Label that is used to indicate step as editable to screen readers. */
        this.editableLabel = 'Editable';
    }
}
MatStepperIntl.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: MatStepperIntl, deps: [], target: i0.ɵɵFactoryTarget.Injectable });
MatStepperIntl.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: MatStepperIntl, providedIn: 'root' });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: MatStepperIntl, decorators: [{
            type: Injectable,
            args: [{ providedIn: 'root' }]
        }] });
/** @docs-private */
export function MAT_STEPPER_INTL_PROVIDER_FACTORY(parentIntl) {
    return parentIntl || new MatStepperIntl();
}
/** @docs-private */
export const MAT_STEPPER_INTL_PROVIDER = {
    provide: MatStepperIntl,
    deps: [[new Optional(), new SkipSelf(), MatStepperIntl]],
    useFactory: MAT_STEPPER_INTL_PROVIDER_FACTORY,
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3RlcHBlci1pbnRsLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vc3JjL21hdGVyaWFsL3N0ZXBwZXIvc3RlcHBlci1pbnRsLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7R0FNRztBQUVILE9BQU8sRUFBQyxVQUFVLEVBQUUsUUFBUSxFQUFFLFFBQVEsRUFBQyxNQUFNLGVBQWUsQ0FBQztBQUM3RCxPQUFPLEVBQUMsT0FBTyxFQUFDLE1BQU0sTUFBTSxDQUFDOztBQUU3Qiw4REFBOEQ7QUFFOUQsTUFBTSxPQUFPLGNBQWM7SUFEM0I7UUFFRTs7O1dBR0c7UUFDTSxZQUFPLEdBQWtCLElBQUksT0FBTyxFQUFRLENBQUM7UUFFdEQsbURBQW1EO1FBQ25ELGtCQUFhLEdBQVcsVUFBVSxDQUFDO1FBRW5DLDBFQUEwRTtRQUMxRSxtQkFBYyxHQUFXLFdBQVcsQ0FBQztRQUVyQyx5RUFBeUU7UUFDekUsa0JBQWEsR0FBVyxVQUFVLENBQUM7S0FDcEM7OzJHQWZZLGNBQWM7K0dBQWQsY0FBYyxjQURGLE1BQU07MkZBQ2xCLGNBQWM7a0JBRDFCLFVBQVU7bUJBQUMsRUFBQyxVQUFVLEVBQUUsTUFBTSxFQUFDOztBQWtCaEMsb0JBQW9CO0FBQ3BCLE1BQU0sVUFBVSxpQ0FBaUMsQ0FBQyxVQUEwQjtJQUMxRSxPQUFPLFVBQVUsSUFBSSxJQUFJLGNBQWMsRUFBRSxDQUFDO0FBQzVDLENBQUM7QUFFRCxvQkFBb0I7QUFDcEIsTUFBTSxDQUFDLE1BQU0seUJBQXlCLEdBQUc7SUFDdkMsT0FBTyxFQUFFLGNBQWM7SUFDdkIsSUFBSSxFQUFFLENBQUMsQ0FBQyxJQUFJLFFBQVEsRUFBRSxFQUFFLElBQUksUUFBUSxFQUFFLEVBQUUsY0FBYyxDQUFDLENBQUM7SUFDeEQsVUFBVSxFQUFFLGlDQUFpQztDQUM5QyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7SW5qZWN0YWJsZSwgT3B0aW9uYWwsIFNraXBTZWxmfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7U3ViamVjdH0gZnJvbSAncnhqcyc7XG5cbi8qKiBTdGVwcGVyIGRhdGEgdGhhdCBpcyByZXF1aXJlZCBmb3IgaW50ZXJuYXRpb25hbGl6YXRpb24uICovXG5ASW5qZWN0YWJsZSh7cHJvdmlkZWRJbjogJ3Jvb3QnfSlcbmV4cG9ydCBjbGFzcyBNYXRTdGVwcGVySW50bCB7XG4gIC8qKlxuICAgKiBTdHJlYW0gdGhhdCBlbWl0cyB3aGVuZXZlciB0aGUgbGFiZWxzIGhlcmUgYXJlIGNoYW5nZWQuIFVzZSB0aGlzIHRvIG5vdGlmeVxuICAgKiBjb21wb25lbnRzIGlmIHRoZSBsYWJlbHMgaGF2ZSBjaGFuZ2VkIGFmdGVyIGluaXRpYWxpemF0aW9uLlxuICAgKi9cbiAgcmVhZG9ubHkgY2hhbmdlczogU3ViamVjdDx2b2lkPiA9IG5ldyBTdWJqZWN0PHZvaWQ+KCk7XG5cbiAgLyoqIExhYmVsIHRoYXQgaXMgcmVuZGVyZWQgYmVsb3cgb3B0aW9uYWwgc3RlcHMuICovXG4gIG9wdGlvbmFsTGFiZWw6IHN0cmluZyA9ICdPcHRpb25hbCc7XG5cbiAgLyoqIExhYmVsIHRoYXQgaXMgdXNlZCB0byBpbmRpY2F0ZSBzdGVwIGFzIGNvbXBsZXRlZCB0byBzY3JlZW4gcmVhZGVycy4gKi9cbiAgY29tcGxldGVkTGFiZWw6IHN0cmluZyA9ICdDb21wbGV0ZWQnO1xuXG4gIC8qKiBMYWJlbCB0aGF0IGlzIHVzZWQgdG8gaW5kaWNhdGUgc3RlcCBhcyBlZGl0YWJsZSB0byBzY3JlZW4gcmVhZGVycy4gKi9cbiAgZWRpdGFibGVMYWJlbDogc3RyaW5nID0gJ0VkaXRhYmxlJztcbn1cblxuLyoqIEBkb2NzLXByaXZhdGUgKi9cbmV4cG9ydCBmdW5jdGlvbiBNQVRfU1RFUFBFUl9JTlRMX1BST1ZJREVSX0ZBQ1RPUlkocGFyZW50SW50bDogTWF0U3RlcHBlckludGwpIHtcbiAgcmV0dXJuIHBhcmVudEludGwgfHwgbmV3IE1hdFN0ZXBwZXJJbnRsKCk7XG59XG5cbi8qKiBAZG9jcy1wcml2YXRlICovXG5leHBvcnQgY29uc3QgTUFUX1NURVBQRVJfSU5UTF9QUk9WSURFUiA9IHtcbiAgcHJvdmlkZTogTWF0U3RlcHBlckludGwsXG4gIGRlcHM6IFtbbmV3IE9wdGlvbmFsKCksIG5ldyBTa2lwU2VsZigpLCBNYXRTdGVwcGVySW50bF1dLFxuICB1c2VGYWN0b3J5OiBNQVRfU1RFUFBFUl9JTlRMX1BST1ZJREVSX0ZBQ1RPUlksXG59O1xuIl19