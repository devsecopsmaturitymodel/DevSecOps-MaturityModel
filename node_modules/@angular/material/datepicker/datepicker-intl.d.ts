import { Subject } from 'rxjs';
import * as i0 from "@angular/core";
/** Datepicker data that requires internationalization. */
export declare class MatDatepickerIntl {
    /**
     * Stream that emits whenever the labels here are changed. Use this to notify
     * components if the labels have changed after initialization.
     */
    readonly changes: Subject<void>;
    /** A label for the calendar popup (used by screen readers). */
    calendarLabel: string;
    /** A label for the button used to open the calendar popup (used by screen readers). */
    openCalendarLabel: string;
    /** Label for the button used to close the calendar popup. */
    closeCalendarLabel: string;
    /** A label for the previous month button (used by screen readers). */
    prevMonthLabel: string;
    /** A label for the next month button (used by screen readers). */
    nextMonthLabel: string;
    /** A label for the previous year button (used by screen readers). */
    prevYearLabel: string;
    /** A label for the next year button (used by screen readers). */
    nextYearLabel: string;
    /** A label for the previous multi-year button (used by screen readers). */
    prevMultiYearLabel: string;
    /** A label for the next multi-year button (used by screen readers). */
    nextMultiYearLabel: string;
    /** A label for the 'switch to month view' button (used by screen readers). */
    switchToMonthViewLabel: string;
    /** A label for the 'switch to year view' button (used by screen readers). */
    switchToMultiYearViewLabel: string;
    /** Formats a range of years. */
    formatYearRange(start: string, end: string): string;
    static ɵfac: i0.ɵɵFactoryDeclaration<MatDatepickerIntl, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<MatDatepickerIntl>;
}
