/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { NgModule } from '@angular/core';
import { CdkStepper, CdkStep } from './stepper';
import { CdkStepLabel } from './step-label';
import { CdkStepperNext, CdkStepperPrevious } from './stepper-button';
import { CdkStepHeader } from './step-header';
import { BidiModule } from '@angular/cdk/bidi';
import * as i0 from "@angular/core";
export class CdkStepperModule {
}
CdkStepperModule.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: CdkStepperModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
CdkStepperModule.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: CdkStepperModule, declarations: [CdkStep,
        CdkStepper,
        CdkStepHeader,
        CdkStepLabel,
        CdkStepperNext,
        CdkStepperPrevious], imports: [BidiModule], exports: [CdkStep, CdkStepper, CdkStepHeader, CdkStepLabel, CdkStepperNext, CdkStepperPrevious] });
CdkStepperModule.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: CdkStepperModule, imports: [[BidiModule]] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: CdkStepperModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [BidiModule],
                    exports: [CdkStep, CdkStepper, CdkStepHeader, CdkStepLabel, CdkStepperNext, CdkStepperPrevious],
                    declarations: [
                        CdkStep,
                        CdkStepper,
                        CdkStepHeader,
                        CdkStepLabel,
                        CdkStepperNext,
                        CdkStepperPrevious,
                    ],
                }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3RlcHBlci1tb2R1bGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9zcmMvY2RrL3N0ZXBwZXIvc3RlcHBlci1tb2R1bGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBRUgsT0FBTyxFQUFDLFFBQVEsRUFBQyxNQUFNLGVBQWUsQ0FBQztBQUN2QyxPQUFPLEVBQUMsVUFBVSxFQUFFLE9BQU8sRUFBQyxNQUFNLFdBQVcsQ0FBQztBQUM5QyxPQUFPLEVBQUMsWUFBWSxFQUFDLE1BQU0sY0FBYyxDQUFDO0FBQzFDLE9BQU8sRUFBQyxjQUFjLEVBQUUsa0JBQWtCLEVBQUMsTUFBTSxrQkFBa0IsQ0FBQztBQUNwRSxPQUFPLEVBQUMsYUFBYSxFQUFDLE1BQU0sZUFBZSxDQUFDO0FBQzVDLE9BQU8sRUFBQyxVQUFVLEVBQUMsTUFBTSxtQkFBbUIsQ0FBQzs7QUFjN0MsTUFBTSxPQUFPLGdCQUFnQjs7NkdBQWhCLGdCQUFnQjs4R0FBaEIsZ0JBQWdCLGlCQVJ6QixPQUFPO1FBQ1AsVUFBVTtRQUNWLGFBQWE7UUFDYixZQUFZO1FBQ1osY0FBYztRQUNkLGtCQUFrQixhQVJWLFVBQVUsYUFDVixPQUFPLEVBQUUsVUFBVSxFQUFFLGFBQWEsRUFBRSxZQUFZLEVBQUUsY0FBYyxFQUFFLGtCQUFrQjs4R0FVbkYsZ0JBQWdCLFlBWGxCLENBQUMsVUFBVSxDQUFDOzJGQVdWLGdCQUFnQjtrQkFaNUIsUUFBUTttQkFBQztvQkFDUixPQUFPLEVBQUUsQ0FBQyxVQUFVLENBQUM7b0JBQ3JCLE9BQU8sRUFBRSxDQUFDLE9BQU8sRUFBRSxVQUFVLEVBQUUsYUFBYSxFQUFFLFlBQVksRUFBRSxjQUFjLEVBQUUsa0JBQWtCLENBQUM7b0JBQy9GLFlBQVksRUFBRTt3QkFDWixPQUFPO3dCQUNQLFVBQVU7d0JBQ1YsYUFBYTt3QkFDYixZQUFZO3dCQUNaLGNBQWM7d0JBQ2Qsa0JBQWtCO3FCQUNuQjtpQkFDRiIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge05nTW9kdWxlfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7Q2RrU3RlcHBlciwgQ2RrU3RlcH0gZnJvbSAnLi9zdGVwcGVyJztcbmltcG9ydCB7Q2RrU3RlcExhYmVsfSBmcm9tICcuL3N0ZXAtbGFiZWwnO1xuaW1wb3J0IHtDZGtTdGVwcGVyTmV4dCwgQ2RrU3RlcHBlclByZXZpb3VzfSBmcm9tICcuL3N0ZXBwZXItYnV0dG9uJztcbmltcG9ydCB7Q2RrU3RlcEhlYWRlcn0gZnJvbSAnLi9zdGVwLWhlYWRlcic7XG5pbXBvcnQge0JpZGlNb2R1bGV9IGZyb20gJ0Bhbmd1bGFyL2Nkay9iaWRpJztcblxuQE5nTW9kdWxlKHtcbiAgaW1wb3J0czogW0JpZGlNb2R1bGVdLFxuICBleHBvcnRzOiBbQ2RrU3RlcCwgQ2RrU3RlcHBlciwgQ2RrU3RlcEhlYWRlciwgQ2RrU3RlcExhYmVsLCBDZGtTdGVwcGVyTmV4dCwgQ2RrU3RlcHBlclByZXZpb3VzXSxcbiAgZGVjbGFyYXRpb25zOiBbXG4gICAgQ2RrU3RlcCxcbiAgICBDZGtTdGVwcGVyLFxuICAgIENka1N0ZXBIZWFkZXIsXG4gICAgQ2RrU3RlcExhYmVsLFxuICAgIENka1N0ZXBwZXJOZXh0LFxuICAgIENka1N0ZXBwZXJQcmV2aW91cyxcbiAgXSxcbn0pXG5leHBvcnQgY2xhc3MgQ2RrU3RlcHBlck1vZHVsZSB7fVxuIl19