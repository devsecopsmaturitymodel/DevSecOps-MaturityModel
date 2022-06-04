/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { MatDatepickerBase } from './datepicker-base';
import { MAT_RANGE_DATE_SELECTION_MODEL_PROVIDER } from './date-selection-model';
import { MAT_CALENDAR_RANGE_STRATEGY_PROVIDER } from './date-range-selection-strategy';
import * as i0 from "@angular/core";
// TODO(mmalerba): We use a component instead of a directive here so the user can use implicit
// template reference variables (e.g. #d vs #d="matDateRangePicker"). We can change this to a
// directive if angular adds support for `exportAs: '$implicit'` on directives.
/** Component responsible for managing the date range picker popup/dialog. */
export class MatDateRangePicker extends MatDatepickerBase {
    _forwardContentValues(instance) {
        super._forwardContentValues(instance);
        const input = this.datepickerInput;
        if (input) {
            instance.comparisonStart = input.comparisonStart;
            instance.comparisonEnd = input.comparisonEnd;
        }
    }
}
MatDateRangePicker.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: MatDateRangePicker, deps: null, target: i0.ɵɵFactoryTarget.Component });
MatDateRangePicker.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "12.0.0", version: "13.3.0", type: MatDateRangePicker, selector: "mat-date-range-picker", providers: [
        MAT_RANGE_DATE_SELECTION_MODEL_PROVIDER,
        MAT_CALENDAR_RANGE_STRATEGY_PROVIDER,
        { provide: MatDatepickerBase, useExisting: MatDateRangePicker },
    ], exportAs: ["matDateRangePicker"], usesInheritance: true, ngImport: i0, template: '', isInline: true, changeDetection: i0.ChangeDetectionStrategy.OnPush, encapsulation: i0.ViewEncapsulation.None });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: MatDateRangePicker, decorators: [{
            type: Component,
            args: [{
                    selector: 'mat-date-range-picker',
                    template: '',
                    exportAs: 'matDateRangePicker',
                    changeDetection: ChangeDetectionStrategy.OnPush,
                    encapsulation: ViewEncapsulation.None,
                    providers: [
                        MAT_RANGE_DATE_SELECTION_MODEL_PROVIDER,
                        MAT_CALENDAR_RANGE_STRATEGY_PROVIDER,
                        { provide: MatDatepickerBase, useExisting: MatDateRangePicker },
                    ],
                }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGF0ZS1yYW5nZS1waWNrZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9zcmMvbWF0ZXJpYWwvZGF0ZXBpY2tlci9kYXRlLXJhbmdlLXBpY2tlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0dBTUc7QUFFSCxPQUFPLEVBQUMsdUJBQXVCLEVBQUUsU0FBUyxFQUFFLGlCQUFpQixFQUFDLE1BQU0sZUFBZSxDQUFDO0FBQ3BGLE9BQU8sRUFBQyxpQkFBaUIsRUFBNkMsTUFBTSxtQkFBbUIsQ0FBQztBQUNoRyxPQUFPLEVBQUMsdUNBQXVDLEVBQVksTUFBTSx3QkFBd0IsQ0FBQztBQUMxRixPQUFPLEVBQUMsb0NBQW9DLEVBQUMsTUFBTSxpQ0FBaUMsQ0FBQzs7QUFXckYsOEZBQThGO0FBQzlGLDZGQUE2RjtBQUM3RiwrRUFBK0U7QUFDL0UsNkVBQTZFO0FBYTdFLE1BQU0sT0FBTyxrQkFBc0IsU0FBUSxpQkFJMUM7SUFDb0IscUJBQXFCLENBQUMsUUFBK0M7UUFDdEYsS0FBSyxDQUFDLHFCQUFxQixDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBRXRDLE1BQU0sS0FBSyxHQUFHLElBQUksQ0FBQyxlQUFlLENBQUM7UUFFbkMsSUFBSSxLQUFLLEVBQUU7WUFDVCxRQUFRLENBQUMsZUFBZSxHQUFHLEtBQUssQ0FBQyxlQUFlLENBQUM7WUFDakQsUUFBUSxDQUFDLGFBQWEsR0FBRyxLQUFLLENBQUMsYUFBYSxDQUFDO1NBQzlDO0lBQ0gsQ0FBQzs7K0dBZFUsa0JBQWtCO21HQUFsQixrQkFBa0IsZ0RBTmxCO1FBQ1QsdUNBQXVDO1FBQ3ZDLG9DQUFvQztRQUNwQyxFQUFDLE9BQU8sRUFBRSxpQkFBaUIsRUFBRSxXQUFXLEVBQUUsa0JBQWtCLEVBQUM7S0FDOUQsbUZBUlMsRUFBRTsyRkFVRCxrQkFBa0I7a0JBWjlCLFNBQVM7bUJBQUM7b0JBQ1QsUUFBUSxFQUFFLHVCQUF1QjtvQkFDakMsUUFBUSxFQUFFLEVBQUU7b0JBQ1osUUFBUSxFQUFFLG9CQUFvQjtvQkFDOUIsZUFBZSxFQUFFLHVCQUF1QixDQUFDLE1BQU07b0JBQy9DLGFBQWEsRUFBRSxpQkFBaUIsQ0FBQyxJQUFJO29CQUNyQyxTQUFTLEVBQUU7d0JBQ1QsdUNBQXVDO3dCQUN2QyxvQ0FBb0M7d0JBQ3BDLEVBQUMsT0FBTyxFQUFFLGlCQUFpQixFQUFFLFdBQVcsb0JBQW9CLEVBQUM7cUJBQzlEO2lCQUNGIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7Q2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3ksIENvbXBvbmVudCwgVmlld0VuY2Fwc3VsYXRpb259IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtNYXREYXRlcGlja2VyQmFzZSwgTWF0RGF0ZXBpY2tlckNvbnRlbnQsIE1hdERhdGVwaWNrZXJDb250cm9sfSBmcm9tICcuL2RhdGVwaWNrZXItYmFzZSc7XG5pbXBvcnQge01BVF9SQU5HRV9EQVRFX1NFTEVDVElPTl9NT0RFTF9QUk9WSURFUiwgRGF0ZVJhbmdlfSBmcm9tICcuL2RhdGUtc2VsZWN0aW9uLW1vZGVsJztcbmltcG9ydCB7TUFUX0NBTEVOREFSX1JBTkdFX1NUUkFURUdZX1BST1ZJREVSfSBmcm9tICcuL2RhdGUtcmFuZ2Utc2VsZWN0aW9uLXN0cmF0ZWd5JztcblxuLyoqXG4gKiBJbnB1dCB0aGF0IGNhbiBiZSBhc3NvY2lhdGVkIHdpdGggYSBkYXRlIHJhbmdlIHBpY2tlci5cbiAqIEBkb2NzLXByaXZhdGVcbiAqL1xuZXhwb3J0IGludGVyZmFjZSBNYXREYXRlUmFuZ2VQaWNrZXJJbnB1dDxEPiBleHRlbmRzIE1hdERhdGVwaWNrZXJDb250cm9sPEQ+IHtcbiAgY29tcGFyaXNvblN0YXJ0OiBEIHwgbnVsbDtcbiAgY29tcGFyaXNvbkVuZDogRCB8IG51bGw7XG59XG5cbi8vIFRPRE8obW1hbGVyYmEpOiBXZSB1c2UgYSBjb21wb25lbnQgaW5zdGVhZCBvZiBhIGRpcmVjdGl2ZSBoZXJlIHNvIHRoZSB1c2VyIGNhbiB1c2UgaW1wbGljaXRcbi8vIHRlbXBsYXRlIHJlZmVyZW5jZSB2YXJpYWJsZXMgKGUuZy4gI2QgdnMgI2Q9XCJtYXREYXRlUmFuZ2VQaWNrZXJcIikuIFdlIGNhbiBjaGFuZ2UgdGhpcyB0byBhXG4vLyBkaXJlY3RpdmUgaWYgYW5ndWxhciBhZGRzIHN1cHBvcnQgZm9yIGBleHBvcnRBczogJyRpbXBsaWNpdCdgIG9uIGRpcmVjdGl2ZXMuXG4vKiogQ29tcG9uZW50IHJlc3BvbnNpYmxlIGZvciBtYW5hZ2luZyB0aGUgZGF0ZSByYW5nZSBwaWNrZXIgcG9wdXAvZGlhbG9nLiAqL1xuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnbWF0LWRhdGUtcmFuZ2UtcGlja2VyJyxcbiAgdGVtcGxhdGU6ICcnLFxuICBleHBvcnRBczogJ21hdERhdGVSYW5nZVBpY2tlcicsXG4gIGNoYW5nZURldGVjdGlvbjogQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kuT25QdXNoLFxuICBlbmNhcHN1bGF0aW9uOiBWaWV3RW5jYXBzdWxhdGlvbi5Ob25lLFxuICBwcm92aWRlcnM6IFtcbiAgICBNQVRfUkFOR0VfREFURV9TRUxFQ1RJT05fTU9ERUxfUFJPVklERVIsXG4gICAgTUFUX0NBTEVOREFSX1JBTkdFX1NUUkFURUdZX1BST1ZJREVSLFxuICAgIHtwcm92aWRlOiBNYXREYXRlcGlja2VyQmFzZSwgdXNlRXhpc3Rpbmc6IE1hdERhdGVSYW5nZVBpY2tlcn0sXG4gIF0sXG59KVxuZXhwb3J0IGNsYXNzIE1hdERhdGVSYW5nZVBpY2tlcjxEPiBleHRlbmRzIE1hdERhdGVwaWNrZXJCYXNlPFxuICBNYXREYXRlUmFuZ2VQaWNrZXJJbnB1dDxEPixcbiAgRGF0ZVJhbmdlPEQ+LFxuICBEXG4+IHtcbiAgcHJvdGVjdGVkIG92ZXJyaWRlIF9mb3J3YXJkQ29udGVudFZhbHVlcyhpbnN0YW5jZTogTWF0RGF0ZXBpY2tlckNvbnRlbnQ8RGF0ZVJhbmdlPEQ+LCBEPikge1xuICAgIHN1cGVyLl9mb3J3YXJkQ29udGVudFZhbHVlcyhpbnN0YW5jZSk7XG5cbiAgICBjb25zdCBpbnB1dCA9IHRoaXMuZGF0ZXBpY2tlcklucHV0O1xuXG4gICAgaWYgKGlucHV0KSB7XG4gICAgICBpbnN0YW5jZS5jb21wYXJpc29uU3RhcnQgPSBpbnB1dC5jb21wYXJpc29uU3RhcnQ7XG4gICAgICBpbnN0YW5jZS5jb21wYXJpc29uRW5kID0gaW5wdXQuY29tcGFyaXNvbkVuZDtcbiAgICB9XG4gIH1cbn1cbiJdfQ==