/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { NgModule } from '@angular/core';
import { MatSortHeader } from './sort-header';
import { MatSort } from './sort';
import { MAT_SORT_HEADER_INTL_PROVIDER } from './sort-header-intl';
import { CommonModule } from '@angular/common';
import { MatCommonModule } from '@angular/material/core';
import * as i0 from "@angular/core";
export class MatSortModule {
}
MatSortModule.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: MatSortModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
MatSortModule.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: MatSortModule, declarations: [MatSort, MatSortHeader], imports: [CommonModule, MatCommonModule], exports: [MatSort, MatSortHeader] });
MatSortModule.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: MatSortModule, providers: [MAT_SORT_HEADER_INTL_PROVIDER], imports: [[CommonModule, MatCommonModule]] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: MatSortModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [CommonModule, MatCommonModule],
                    exports: [MatSort, MatSortHeader],
                    declarations: [MatSort, MatSortHeader],
                    providers: [MAT_SORT_HEADER_INTL_PROVIDER],
                }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic29ydC1tb2R1bGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9zcmMvbWF0ZXJpYWwvc29ydC9zb3J0LW1vZHVsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0dBTUc7QUFFSCxPQUFPLEVBQUMsUUFBUSxFQUFDLE1BQU0sZUFBZSxDQUFDO0FBQ3ZDLE9BQU8sRUFBQyxhQUFhLEVBQUMsTUFBTSxlQUFlLENBQUM7QUFDNUMsT0FBTyxFQUFDLE9BQU8sRUFBQyxNQUFNLFFBQVEsQ0FBQztBQUMvQixPQUFPLEVBQUMsNkJBQTZCLEVBQUMsTUFBTSxvQkFBb0IsQ0FBQztBQUNqRSxPQUFPLEVBQUMsWUFBWSxFQUFDLE1BQU0saUJBQWlCLENBQUM7QUFDN0MsT0FBTyxFQUFDLGVBQWUsRUFBQyxNQUFNLHdCQUF3QixDQUFDOztBQVF2RCxNQUFNLE9BQU8sYUFBYTs7MEdBQWIsYUFBYTsyR0FBYixhQUFhLGlCQUhULE9BQU8sRUFBRSxhQUFhLGFBRjNCLFlBQVksRUFBRSxlQUFlLGFBQzdCLE9BQU8sRUFBRSxhQUFhOzJHQUlyQixhQUFhLGFBRmIsQ0FBQyw2QkFBNkIsQ0FBQyxZQUhqQyxDQUFDLFlBQVksRUFBRSxlQUFlLENBQUM7MkZBSzdCLGFBQWE7a0JBTnpCLFFBQVE7bUJBQUM7b0JBQ1IsT0FBTyxFQUFFLENBQUMsWUFBWSxFQUFFLGVBQWUsQ0FBQztvQkFDeEMsT0FBTyxFQUFFLENBQUMsT0FBTyxFQUFFLGFBQWEsQ0FBQztvQkFDakMsWUFBWSxFQUFFLENBQUMsT0FBTyxFQUFFLGFBQWEsQ0FBQztvQkFDdEMsU0FBUyxFQUFFLENBQUMsNkJBQTZCLENBQUM7aUJBQzNDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7TmdNb2R1bGV9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtNYXRTb3J0SGVhZGVyfSBmcm9tICcuL3NvcnQtaGVhZGVyJztcbmltcG9ydCB7TWF0U29ydH0gZnJvbSAnLi9zb3J0JztcbmltcG9ydCB7TUFUX1NPUlRfSEVBREVSX0lOVExfUFJPVklERVJ9IGZyb20gJy4vc29ydC1oZWFkZXItaW50bCc7XG5pbXBvcnQge0NvbW1vbk1vZHVsZX0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uJztcbmltcG9ydCB7TWF0Q29tbW9uTW9kdWxlfSBmcm9tICdAYW5ndWxhci9tYXRlcmlhbC9jb3JlJztcblxuQE5nTW9kdWxlKHtcbiAgaW1wb3J0czogW0NvbW1vbk1vZHVsZSwgTWF0Q29tbW9uTW9kdWxlXSxcbiAgZXhwb3J0czogW01hdFNvcnQsIE1hdFNvcnRIZWFkZXJdLFxuICBkZWNsYXJhdGlvbnM6IFtNYXRTb3J0LCBNYXRTb3J0SGVhZGVyXSxcbiAgcHJvdmlkZXJzOiBbTUFUX1NPUlRfSEVBREVSX0lOVExfUFJPVklERVJdLFxufSlcbmV4cG9ydCBjbGFzcyBNYXRTb3J0TW9kdWxlIHt9XG4iXX0=