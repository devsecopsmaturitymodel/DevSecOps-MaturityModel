/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { HarnessPredicate, ComponentHarness } from '@angular/cdk/testing';
import { CalendarHarnessFilters, CalendarCellHarnessFilters } from './datepicker-harness-filters';
import { MatCalendarCellHarness } from './calendar-cell-harness';
/** Possible views of a `MatCalendarHarness`. */
export declare const enum CalendarView {
    MONTH = 0,
    YEAR = 1,
    MULTI_YEAR = 2
}
/** Harness for interacting with a standard Material calendar in tests. */
export declare class MatCalendarHarness extends ComponentHarness {
    static hostSelector: string;
    /** Queries for the calendar's period toggle button. */
    private _periodButton;
    /**
     * Gets a `HarnessPredicate` that can be used to search for a `MatCalendarHarness`
     * that meets certain criteria.
     * @param options Options for filtering which calendar instances are considered a match.
     * @return a `HarnessPredicate` configured with the given options.
     */
    static with(options?: CalendarHarnessFilters): HarnessPredicate<MatCalendarHarness>;
    /**
     * Gets a list of cells inside the calendar.
     * @param filter Optionally filters which cells are included.
     */
    getCells(filter?: CalendarCellHarnessFilters): Promise<MatCalendarCellHarness[]>;
    /** Gets the current view that is being shown inside the calendar. */
    getCurrentView(): Promise<CalendarView>;
    /** Gets the label of the current calendar view. */
    getCurrentViewLabel(): Promise<string>;
    /** Changes the calendar view by clicking on the view toggle button. */
    changeView(): Promise<void>;
    /** Goes to the next page of the current view (e.g. next month when inside the month view). */
    next(): Promise<void>;
    /**
     * Goes to the previous page of the current view
     * (e.g. previous month when inside the month view).
     */
    previous(): Promise<void>;
    /**
     * Selects a cell in the current calendar view.
     * @param filter An optional filter to apply to the cells. The first cell matching the filter
     *     will be selected.
     */
    selectCell(filter?: CalendarCellHarnessFilters): Promise<void>;
}
