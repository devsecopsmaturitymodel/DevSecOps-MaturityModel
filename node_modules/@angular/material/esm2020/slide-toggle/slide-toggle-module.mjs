/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { ObserversModule } from '@angular/cdk/observers';
import { NgModule } from '@angular/core';
import { MatCommonModule, MatRippleModule } from '@angular/material/core';
import { MatSlideToggle } from './slide-toggle';
import { MatSlideToggleRequiredValidator } from './slide-toggle-required-validator';
import * as i0 from "@angular/core";
/** This module is used by both original and MDC-based slide-toggle implementations. */
export class _MatSlideToggleRequiredValidatorModule {
}
_MatSlideToggleRequiredValidatorModule.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: _MatSlideToggleRequiredValidatorModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
_MatSlideToggleRequiredValidatorModule.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: _MatSlideToggleRequiredValidatorModule, declarations: [MatSlideToggleRequiredValidator], exports: [MatSlideToggleRequiredValidator] });
_MatSlideToggleRequiredValidatorModule.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: _MatSlideToggleRequiredValidatorModule });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: _MatSlideToggleRequiredValidatorModule, decorators: [{
            type: NgModule,
            args: [{
                    exports: [MatSlideToggleRequiredValidator],
                    declarations: [MatSlideToggleRequiredValidator],
                }]
        }] });
export class MatSlideToggleModule {
}
MatSlideToggleModule.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: MatSlideToggleModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
MatSlideToggleModule.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: MatSlideToggleModule, declarations: [MatSlideToggle], imports: [_MatSlideToggleRequiredValidatorModule, MatRippleModule,
        MatCommonModule,
        ObserversModule], exports: [_MatSlideToggleRequiredValidatorModule, MatSlideToggle, MatCommonModule] });
MatSlideToggleModule.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: MatSlideToggleModule, imports: [[
            _MatSlideToggleRequiredValidatorModule,
            MatRippleModule,
            MatCommonModule,
            ObserversModule,
        ], _MatSlideToggleRequiredValidatorModule, MatCommonModule] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: MatSlideToggleModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [
                        _MatSlideToggleRequiredValidatorModule,
                        MatRippleModule,
                        MatCommonModule,
                        ObserversModule,
                    ],
                    exports: [_MatSlideToggleRequiredValidatorModule, MatSlideToggle, MatCommonModule],
                    declarations: [MatSlideToggle],
                }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2xpZGUtdG9nZ2xlLW1vZHVsZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3NyYy9tYXRlcmlhbC9zbGlkZS10b2dnbGUvc2xpZGUtdG9nZ2xlLW1vZHVsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0dBTUc7QUFFSCxPQUFPLEVBQUMsZUFBZSxFQUFDLE1BQU0sd0JBQXdCLENBQUM7QUFDdkQsT0FBTyxFQUFDLFFBQVEsRUFBQyxNQUFNLGVBQWUsQ0FBQztBQUN2QyxPQUFPLEVBQUMsZUFBZSxFQUFFLGVBQWUsRUFBQyxNQUFNLHdCQUF3QixDQUFDO0FBQ3hFLE9BQU8sRUFBQyxjQUFjLEVBQUMsTUFBTSxnQkFBZ0IsQ0FBQztBQUM5QyxPQUFPLEVBQUMsK0JBQStCLEVBQUMsTUFBTSxtQ0FBbUMsQ0FBQzs7QUFFbEYsdUZBQXVGO0FBS3ZGLE1BQU0sT0FBTyxzQ0FBc0M7O21JQUF0QyxzQ0FBc0M7b0lBQXRDLHNDQUFzQyxpQkFGbEMsK0JBQStCLGFBRHBDLCtCQUErQjtvSUFHOUIsc0NBQXNDOzJGQUF0QyxzQ0FBc0M7a0JBSmxELFFBQVE7bUJBQUM7b0JBQ1IsT0FBTyxFQUFFLENBQUMsK0JBQStCLENBQUM7b0JBQzFDLFlBQVksRUFBRSxDQUFDLCtCQUErQixDQUFDO2lCQUNoRDs7QUFhRCxNQUFNLE9BQU8sb0JBQW9COztpSEFBcEIsb0JBQW9CO2tIQUFwQixvQkFBb0IsaUJBRmhCLGNBQWMsYUFWbEIsc0NBQXNDLEVBSy9DLGVBQWU7UUFDZixlQUFlO1FBQ2YsZUFBZSxhQVBOLHNDQUFzQyxFQVNDLGNBQWMsRUFBRSxlQUFlO2tIQUd0RSxvQkFBb0IsWUFUdEI7WUFDUCxzQ0FBc0M7WUFDdEMsZUFBZTtZQUNmLGVBQWU7WUFDZixlQUFlO1NBQ2hCLEVBUlUsc0NBQXNDLEVBU2lCLGVBQWU7MkZBR3RFLG9CQUFvQjtrQkFWaEMsUUFBUTttQkFBQztvQkFDUixPQUFPLEVBQUU7d0JBQ1Asc0NBQXNDO3dCQUN0QyxlQUFlO3dCQUNmLGVBQWU7d0JBQ2YsZUFBZTtxQkFDaEI7b0JBQ0QsT0FBTyxFQUFFLENBQUMsc0NBQXNDLEVBQUUsY0FBYyxFQUFFLGVBQWUsQ0FBQztvQkFDbEYsWUFBWSxFQUFFLENBQUMsY0FBYyxDQUFDO2lCQUMvQiIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge09ic2VydmVyc01vZHVsZX0gZnJvbSAnQGFuZ3VsYXIvY2RrL29ic2VydmVycyc7XG5pbXBvcnQge05nTW9kdWxlfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7TWF0Q29tbW9uTW9kdWxlLCBNYXRSaXBwbGVNb2R1bGV9IGZyb20gJ0Bhbmd1bGFyL21hdGVyaWFsL2NvcmUnO1xuaW1wb3J0IHtNYXRTbGlkZVRvZ2dsZX0gZnJvbSAnLi9zbGlkZS10b2dnbGUnO1xuaW1wb3J0IHtNYXRTbGlkZVRvZ2dsZVJlcXVpcmVkVmFsaWRhdG9yfSBmcm9tICcuL3NsaWRlLXRvZ2dsZS1yZXF1aXJlZC12YWxpZGF0b3InO1xuXG4vKiogVGhpcyBtb2R1bGUgaXMgdXNlZCBieSBib3RoIG9yaWdpbmFsIGFuZCBNREMtYmFzZWQgc2xpZGUtdG9nZ2xlIGltcGxlbWVudGF0aW9ucy4gKi9cbkBOZ01vZHVsZSh7XG4gIGV4cG9ydHM6IFtNYXRTbGlkZVRvZ2dsZVJlcXVpcmVkVmFsaWRhdG9yXSxcbiAgZGVjbGFyYXRpb25zOiBbTWF0U2xpZGVUb2dnbGVSZXF1aXJlZFZhbGlkYXRvcl0sXG59KVxuZXhwb3J0IGNsYXNzIF9NYXRTbGlkZVRvZ2dsZVJlcXVpcmVkVmFsaWRhdG9yTW9kdWxlIHt9XG5cbkBOZ01vZHVsZSh7XG4gIGltcG9ydHM6IFtcbiAgICBfTWF0U2xpZGVUb2dnbGVSZXF1aXJlZFZhbGlkYXRvck1vZHVsZSxcbiAgICBNYXRSaXBwbGVNb2R1bGUsXG4gICAgTWF0Q29tbW9uTW9kdWxlLFxuICAgIE9ic2VydmVyc01vZHVsZSxcbiAgXSxcbiAgZXhwb3J0czogW19NYXRTbGlkZVRvZ2dsZVJlcXVpcmVkVmFsaWRhdG9yTW9kdWxlLCBNYXRTbGlkZVRvZ2dsZSwgTWF0Q29tbW9uTW9kdWxlXSxcbiAgZGVjbGFyYXRpb25zOiBbTWF0U2xpZGVUb2dnbGVdLFxufSlcbmV4cG9ydCBjbGFzcyBNYXRTbGlkZVRvZ2dsZU1vZHVsZSB7fVxuIl19