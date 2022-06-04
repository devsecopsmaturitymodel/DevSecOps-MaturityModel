/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { CdkStepperNext, CdkStepperPrevious } from '@angular/cdk/stepper';
import { Directive } from '@angular/core';
import * as i0 from "@angular/core";
/** Button that moves to the next step in a stepper workflow. */
export class MatStepperNext extends CdkStepperNext {
}
MatStepperNext.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: MatStepperNext, deps: null, target: i0.ɵɵFactoryTarget.Directive });
MatStepperNext.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "12.0.0", version: "13.3.0", type: MatStepperNext, selector: "button[matStepperNext]", inputs: { type: "type" }, host: { properties: { "type": "type" }, classAttribute: "mat-stepper-next" }, usesInheritance: true, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: MatStepperNext, decorators: [{
            type: Directive,
            args: [{
                    selector: 'button[matStepperNext]',
                    host: {
                        'class': 'mat-stepper-next',
                        '[type]': 'type',
                    },
                    inputs: ['type'],
                }]
        }] });
/** Button that moves to the previous step in a stepper workflow. */
export class MatStepperPrevious extends CdkStepperPrevious {
}
MatStepperPrevious.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: MatStepperPrevious, deps: null, target: i0.ɵɵFactoryTarget.Directive });
MatStepperPrevious.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "12.0.0", version: "13.3.0", type: MatStepperPrevious, selector: "button[matStepperPrevious]", inputs: { type: "type" }, host: { properties: { "type": "type" }, classAttribute: "mat-stepper-previous" }, usesInheritance: true, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: MatStepperPrevious, decorators: [{
            type: Directive,
            args: [{
                    selector: 'button[matStepperPrevious]',
                    host: {
                        'class': 'mat-stepper-previous',
                        '[type]': 'type',
                    },
                    inputs: ['type'],
                }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3RlcHBlci1idXR0b24uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9zcmMvbWF0ZXJpYWwvc3RlcHBlci9zdGVwcGVyLWJ1dHRvbi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0dBTUc7QUFFSCxPQUFPLEVBQUMsY0FBYyxFQUFFLGtCQUFrQixFQUFDLE1BQU0sc0JBQXNCLENBQUM7QUFDeEUsT0FBTyxFQUFDLFNBQVMsRUFBQyxNQUFNLGVBQWUsQ0FBQzs7QUFFeEMsZ0VBQWdFO0FBU2hFLE1BQU0sT0FBTyxjQUFlLFNBQVEsY0FBYzs7MkdBQXJDLGNBQWM7K0ZBQWQsY0FBYzsyRkFBZCxjQUFjO2tCQVIxQixTQUFTO21CQUFDO29CQUNULFFBQVEsRUFBRSx3QkFBd0I7b0JBQ2xDLElBQUksRUFBRTt3QkFDSixPQUFPLEVBQUUsa0JBQWtCO3dCQUMzQixRQUFRLEVBQUUsTUFBTTtxQkFDakI7b0JBQ0QsTUFBTSxFQUFFLENBQUMsTUFBTSxDQUFDO2lCQUNqQjs7QUFHRCxvRUFBb0U7QUFTcEUsTUFBTSxPQUFPLGtCQUFtQixTQUFRLGtCQUFrQjs7K0dBQTdDLGtCQUFrQjttR0FBbEIsa0JBQWtCOzJGQUFsQixrQkFBa0I7a0JBUjlCLFNBQVM7bUJBQUM7b0JBQ1QsUUFBUSxFQUFFLDRCQUE0QjtvQkFDdEMsSUFBSSxFQUFFO3dCQUNKLE9BQU8sRUFBRSxzQkFBc0I7d0JBQy9CLFFBQVEsRUFBRSxNQUFNO3FCQUNqQjtvQkFDRCxNQUFNLEVBQUUsQ0FBQyxNQUFNLENBQUM7aUJBQ2pCIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7Q2RrU3RlcHBlck5leHQsIENka1N0ZXBwZXJQcmV2aW91c30gZnJvbSAnQGFuZ3VsYXIvY2RrL3N0ZXBwZXInO1xuaW1wb3J0IHtEaXJlY3RpdmV9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuXG4vKiogQnV0dG9uIHRoYXQgbW92ZXMgdG8gdGhlIG5leHQgc3RlcCBpbiBhIHN0ZXBwZXIgd29ya2Zsb3cuICovXG5ARGlyZWN0aXZlKHtcbiAgc2VsZWN0b3I6ICdidXR0b25bbWF0U3RlcHBlck5leHRdJyxcbiAgaG9zdDoge1xuICAgICdjbGFzcyc6ICdtYXQtc3RlcHBlci1uZXh0JyxcbiAgICAnW3R5cGVdJzogJ3R5cGUnLFxuICB9LFxuICBpbnB1dHM6IFsndHlwZSddLFxufSlcbmV4cG9ydCBjbGFzcyBNYXRTdGVwcGVyTmV4dCBleHRlbmRzIENka1N0ZXBwZXJOZXh0IHt9XG5cbi8qKiBCdXR0b24gdGhhdCBtb3ZlcyB0byB0aGUgcHJldmlvdXMgc3RlcCBpbiBhIHN0ZXBwZXIgd29ya2Zsb3cuICovXG5ARGlyZWN0aXZlKHtcbiAgc2VsZWN0b3I6ICdidXR0b25bbWF0U3RlcHBlclByZXZpb3VzXScsXG4gIGhvc3Q6IHtcbiAgICAnY2xhc3MnOiAnbWF0LXN0ZXBwZXItcHJldmlvdXMnLFxuICAgICdbdHlwZV0nOiAndHlwZScsXG4gIH0sXG4gIGlucHV0czogWyd0eXBlJ10sXG59KVxuZXhwb3J0IGNsYXNzIE1hdFN0ZXBwZXJQcmV2aW91cyBleHRlbmRzIENka1N0ZXBwZXJQcmV2aW91cyB7fVxuIl19