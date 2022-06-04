/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { NgModule } from '@angular/core';
import { MatCommonModule } from '../common-behaviors/common-module';
import { MatRipple } from './ripple';
import * as i0 from "@angular/core";
export * from './ripple';
export * from './ripple-ref';
export * from './ripple-renderer';
export class MatRippleModule {
}
MatRippleModule.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: MatRippleModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
MatRippleModule.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: MatRippleModule, declarations: [MatRipple], imports: [MatCommonModule], exports: [MatRipple, MatCommonModule] });
MatRippleModule.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: MatRippleModule, imports: [[MatCommonModule], MatCommonModule] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: MatRippleModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [MatCommonModule],
                    exports: [MatRipple, MatCommonModule],
                    declarations: [MatRipple],
                }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi9zcmMvbWF0ZXJpYWwvY29yZS9yaXBwbGUvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBRUgsT0FBTyxFQUFDLFFBQVEsRUFBQyxNQUFNLGVBQWUsQ0FBQztBQUN2QyxPQUFPLEVBQUMsZUFBZSxFQUFDLE1BQU0sbUNBQW1DLENBQUM7QUFDbEUsT0FBTyxFQUFDLFNBQVMsRUFBQyxNQUFNLFVBQVUsQ0FBQzs7QUFFbkMsY0FBYyxVQUFVLENBQUM7QUFDekIsY0FBYyxjQUFjLENBQUM7QUFDN0IsY0FBYyxtQkFBbUIsQ0FBQztBQU9sQyxNQUFNLE9BQU8sZUFBZTs7NEdBQWYsZUFBZTs2R0FBZixlQUFlLGlCQUZYLFNBQVMsYUFGZCxlQUFlLGFBQ2YsU0FBUyxFQUFFLGVBQWU7NkdBR3pCLGVBQWUsWUFKakIsQ0FBQyxlQUFlLENBQUMsRUFDTCxlQUFlOzJGQUd6QixlQUFlO2tCQUwzQixRQUFRO21CQUFDO29CQUNSLE9BQU8sRUFBRSxDQUFDLGVBQWUsQ0FBQztvQkFDMUIsT0FBTyxFQUFFLENBQUMsU0FBUyxFQUFFLGVBQWUsQ0FBQztvQkFDckMsWUFBWSxFQUFFLENBQUMsU0FBUyxDQUFDO2lCQUMxQiIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge05nTW9kdWxlfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7TWF0Q29tbW9uTW9kdWxlfSBmcm9tICcuLi9jb21tb24tYmVoYXZpb3JzL2NvbW1vbi1tb2R1bGUnO1xuaW1wb3J0IHtNYXRSaXBwbGV9IGZyb20gJy4vcmlwcGxlJztcblxuZXhwb3J0ICogZnJvbSAnLi9yaXBwbGUnO1xuZXhwb3J0ICogZnJvbSAnLi9yaXBwbGUtcmVmJztcbmV4cG9ydCAqIGZyb20gJy4vcmlwcGxlLXJlbmRlcmVyJztcblxuQE5nTW9kdWxlKHtcbiAgaW1wb3J0czogW01hdENvbW1vbk1vZHVsZV0sXG4gIGV4cG9ydHM6IFtNYXRSaXBwbGUsIE1hdENvbW1vbk1vZHVsZV0sXG4gIGRlY2xhcmF0aW9uczogW01hdFJpcHBsZV0sXG59KVxuZXhwb3J0IGNsYXNzIE1hdFJpcHBsZU1vZHVsZSB7fVxuIl19