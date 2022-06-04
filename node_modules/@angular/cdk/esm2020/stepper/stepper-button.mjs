/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { Directive, Input } from '@angular/core';
import { CdkStepper } from './stepper';
import * as i0 from "@angular/core";
import * as i1 from "./stepper";
/** Button that moves to the next step in a stepper workflow. */
export class CdkStepperNext {
    constructor(_stepper) {
        this._stepper = _stepper;
        /** Type of the next button. Defaults to "submit" if not specified. */
        this.type = 'submit';
    }
}
CdkStepperNext.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: CdkStepperNext, deps: [{ token: i1.CdkStepper }], target: i0.ɵɵFactoryTarget.Directive });
CdkStepperNext.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "12.0.0", version: "13.3.0", type: CdkStepperNext, selector: "button[cdkStepperNext]", inputs: { type: "type" }, host: { listeners: { "click": "_stepper.next()" }, properties: { "type": "type" } }, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: CdkStepperNext, decorators: [{
            type: Directive,
            args: [{
                    selector: 'button[cdkStepperNext]',
                    host: {
                        '[type]': 'type',
                        '(click)': '_stepper.next()',
                    },
                }]
        }], ctorParameters: function () { return [{ type: i1.CdkStepper }]; }, propDecorators: { type: [{
                type: Input
            }] } });
/** Button that moves to the previous step in a stepper workflow. */
export class CdkStepperPrevious {
    constructor(_stepper) {
        this._stepper = _stepper;
        /** Type of the previous button. Defaults to "button" if not specified. */
        this.type = 'button';
    }
}
CdkStepperPrevious.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: CdkStepperPrevious, deps: [{ token: i1.CdkStepper }], target: i0.ɵɵFactoryTarget.Directive });
CdkStepperPrevious.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "12.0.0", version: "13.3.0", type: CdkStepperPrevious, selector: "button[cdkStepperPrevious]", inputs: { type: "type" }, host: { listeners: { "click": "_stepper.previous()" }, properties: { "type": "type" } }, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: CdkStepperPrevious, decorators: [{
            type: Directive,
            args: [{
                    selector: 'button[cdkStepperPrevious]',
                    host: {
                        '[type]': 'type',
                        '(click)': '_stepper.previous()',
                    },
                }]
        }], ctorParameters: function () { return [{ type: i1.CdkStepper }]; }, propDecorators: { type: [{
                type: Input
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3RlcHBlci1idXR0b24uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9zcmMvY2RrL3N0ZXBwZXIvc3RlcHBlci1idXR0b24udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBRUgsT0FBTyxFQUFDLFNBQVMsRUFBRSxLQUFLLEVBQUMsTUFBTSxlQUFlLENBQUM7QUFFL0MsT0FBTyxFQUFDLFVBQVUsRUFBQyxNQUFNLFdBQVcsQ0FBQzs7O0FBRXJDLGdFQUFnRTtBQVFoRSxNQUFNLE9BQU8sY0FBYztJQUl6QixZQUFtQixRQUFvQjtRQUFwQixhQUFRLEdBQVIsUUFBUSxDQUFZO1FBSHZDLHNFQUFzRTtRQUM3RCxTQUFJLEdBQVcsUUFBUSxDQUFDO0lBRVMsQ0FBQzs7MkdBSmhDLGNBQWM7K0ZBQWQsY0FBYzsyRkFBZCxjQUFjO2tCQVAxQixTQUFTO21CQUFDO29CQUNULFFBQVEsRUFBRSx3QkFBd0I7b0JBQ2xDLElBQUksRUFBRTt3QkFDSixRQUFRLEVBQUUsTUFBTTt3QkFDaEIsU0FBUyxFQUFFLGlCQUFpQjtxQkFDN0I7aUJBQ0Y7aUdBR1UsSUFBSTtzQkFBWixLQUFLOztBQUtSLG9FQUFvRTtBQVFwRSxNQUFNLE9BQU8sa0JBQWtCO0lBSTdCLFlBQW1CLFFBQW9CO1FBQXBCLGFBQVEsR0FBUixRQUFRLENBQVk7UUFIdkMsMEVBQTBFO1FBQ2pFLFNBQUksR0FBVyxRQUFRLENBQUM7SUFFUyxDQUFDOzsrR0FKaEMsa0JBQWtCO21HQUFsQixrQkFBa0I7MkZBQWxCLGtCQUFrQjtrQkFQOUIsU0FBUzttQkFBQztvQkFDVCxRQUFRLEVBQUUsNEJBQTRCO29CQUN0QyxJQUFJLEVBQUU7d0JBQ0osUUFBUSxFQUFFLE1BQU07d0JBQ2hCLFNBQVMsRUFBRSxxQkFBcUI7cUJBQ2pDO2lCQUNGO2lHQUdVLElBQUk7c0JBQVosS0FBSyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge0RpcmVjdGl2ZSwgSW5wdXR9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuXG5pbXBvcnQge0Nka1N0ZXBwZXJ9IGZyb20gJy4vc3RlcHBlcic7XG5cbi8qKiBCdXR0b24gdGhhdCBtb3ZlcyB0byB0aGUgbmV4dCBzdGVwIGluIGEgc3RlcHBlciB3b3JrZmxvdy4gKi9cbkBEaXJlY3RpdmUoe1xuICBzZWxlY3RvcjogJ2J1dHRvbltjZGtTdGVwcGVyTmV4dF0nLFxuICBob3N0OiB7XG4gICAgJ1t0eXBlXSc6ICd0eXBlJyxcbiAgICAnKGNsaWNrKSc6ICdfc3RlcHBlci5uZXh0KCknLFxuICB9LFxufSlcbmV4cG9ydCBjbGFzcyBDZGtTdGVwcGVyTmV4dCB7XG4gIC8qKiBUeXBlIG9mIHRoZSBuZXh0IGJ1dHRvbi4gRGVmYXVsdHMgdG8gXCJzdWJtaXRcIiBpZiBub3Qgc3BlY2lmaWVkLiAqL1xuICBASW5wdXQoKSB0eXBlOiBzdHJpbmcgPSAnc3VibWl0JztcblxuICBjb25zdHJ1Y3RvcihwdWJsaWMgX3N0ZXBwZXI6IENka1N0ZXBwZXIpIHt9XG59XG5cbi8qKiBCdXR0b24gdGhhdCBtb3ZlcyB0byB0aGUgcHJldmlvdXMgc3RlcCBpbiBhIHN0ZXBwZXIgd29ya2Zsb3cuICovXG5ARGlyZWN0aXZlKHtcbiAgc2VsZWN0b3I6ICdidXR0b25bY2RrU3RlcHBlclByZXZpb3VzXScsXG4gIGhvc3Q6IHtcbiAgICAnW3R5cGVdJzogJ3R5cGUnLFxuICAgICcoY2xpY2spJzogJ19zdGVwcGVyLnByZXZpb3VzKCknLFxuICB9LFxufSlcbmV4cG9ydCBjbGFzcyBDZGtTdGVwcGVyUHJldmlvdXMge1xuICAvKiogVHlwZSBvZiB0aGUgcHJldmlvdXMgYnV0dG9uLiBEZWZhdWx0cyB0byBcImJ1dHRvblwiIGlmIG5vdCBzcGVjaWZpZWQuICovXG4gIEBJbnB1dCgpIHR5cGU6IHN0cmluZyA9ICdidXR0b24nO1xuXG4gIGNvbnN0cnVjdG9yKHB1YmxpYyBfc3RlcHBlcjogQ2RrU3RlcHBlcikge31cbn1cbiJdfQ==