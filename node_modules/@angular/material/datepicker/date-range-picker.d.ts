import { MatDatepickerBase, MatDatepickerContent, MatDatepickerControl } from './datepicker-base';
import { DateRange } from './date-selection-model';
import * as i0 from "@angular/core";
/**
 * Input that can be associated with a date range picker.
 * @docs-private
 */
export interface MatDateRangePickerInput<D> extends MatDatepickerControl<D> {
    comparisonStart: D | null;
    comparisonEnd: D | null;
}
/** Component responsible for managing the date range picker popup/dialog. */
export declare class MatDateRangePicker<D> extends MatDatepickerBase<MatDateRangePickerInput<D>, DateRange<D>, D> {
    protected _forwardContentValues(instance: MatDatepickerContent<DateRange<D>, D>): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<MatDateRangePicker<any>, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<MatDateRangePicker<any>, "mat-date-range-picker", ["matDateRangePicker"], {}, {}, never, never>;
}
