import { AfterContentInit, ChangeDetectorRef, EventEmitter, OnDestroy } from '@angular/core';
import { DateAdapter } from '@angular/material/core';
import { Directionality } from '@angular/cdk/bidi';
import { MatCalendarBody, MatCalendarCell, MatCalendarUserEvent, MatCalendarCellClassFunction } from './calendar-body';
import { DateRange } from './date-selection-model';
import * as i0 from "@angular/core";
export declare const yearsPerPage = 24;
export declare const yearsPerRow = 4;
/**
 * An internal component used to display a year selector in the datepicker.
 * @docs-private
 */
export declare class MatMultiYearView<D> implements AfterContentInit, OnDestroy {
    private _changeDetectorRef;
    _dateAdapter: DateAdapter<D>;
    private _dir?;
    private _rerenderSubscription;
    /** Flag used to filter out space/enter keyup events that originated outside of the view. */
    private _selectionKeyPressed;
    /** The date to display in this multi-year view (everything other than the year is ignored). */
    get activeDate(): D;
    set activeDate(value: D);
    private _activeDate;
    /** The currently selected date. */
    get selected(): DateRange<D> | D | null;
    set selected(value: DateRange<D> | D | null);
    private _selected;
    /** The minimum selectable date. */
    get minDate(): D | null;
    set minDate(value: D | null);
    private _minDate;
    /** The maximum selectable date. */
    get maxDate(): D | null;
    set maxDate(value: D | null);
    private _maxDate;
    /** A function used to filter which dates are selectable. */
    dateFilter: (date: D) => boolean;
    /** Function that can be used to add custom CSS classes to date cells. */
    dateClass: MatCalendarCellClassFunction<D>;
    /** Emits when a new year is selected. */
    readonly selectedChange: EventEmitter<D>;
    /** Emits the selected year. This doesn't imply a change on the selected date */
    readonly yearSelected: EventEmitter<D>;
    /** Emits when any date is activated. */
    readonly activeDateChange: EventEmitter<D>;
    /** The body of calendar table */
    _matCalendarBody: MatCalendarBody;
    /** Grid of calendar cells representing the currently displayed years. */
    _years: MatCalendarCell[][];
    /** The year that today falls on. */
    _todayYear: number;
    /** The year of the selected date. Null if the selected date is null. */
    _selectedYear: number | null;
    constructor(_changeDetectorRef: ChangeDetectorRef, _dateAdapter: DateAdapter<D>, _dir?: Directionality | undefined);
    ngAfterContentInit(): void;
    ngOnDestroy(): void;
    /** Initializes this multi-year view. */
    _init(): void;
    /** Handles when a new year is selected. */
    _yearSelected(event: MatCalendarUserEvent<number>): void;
    /** Handles keydown events on the calendar body when calendar is in multi-year view. */
    _handleCalendarBodyKeydown(event: KeyboardEvent): void;
    /** Handles keyup events on the calendar body when calendar is in multi-year view. */
    _handleCalendarBodyKeyup(event: KeyboardEvent): void;
    _getActiveCell(): number;
    /** Focuses the active cell after the microtask queue is empty. */
    _focusActiveCell(): void;
    /** Creates an MatCalendarCell for the given year. */
    private _createCellForYear;
    /** Whether the given year is enabled. */
    private _shouldEnableYear;
    /** Determines whether the user has the RTL layout direction. */
    private _isRtl;
    /** Sets the currently-highlighted year based on a model value. */
    private _setSelectedYear;
    static ɵfac: i0.ɵɵFactoryDeclaration<MatMultiYearView<any>, [null, { optional: true; }, { optional: true; }]>;
    static ɵcmp: i0.ɵɵComponentDeclaration<MatMultiYearView<any>, "mat-multi-year-view", ["matMultiYearView"], { "activeDate": "activeDate"; "selected": "selected"; "minDate": "minDate"; "maxDate": "maxDate"; "dateFilter": "dateFilter"; "dateClass": "dateClass"; }, { "selectedChange": "selectedChange"; "yearSelected": "yearSelected"; "activeDateChange": "activeDateChange"; }, never, never>;
}
export declare function isSameMultiYearView<D>(dateAdapter: DateAdapter<D>, date1: D, date2: D, minDate: D | null, maxDate: D | null): boolean;
/**
 * When the multi-year view is first opened, the active year will be in view.
 * So we compute how many years are between the active year and the *slot* where our
 * "startingYear" will render when paged into view.
 */
export declare function getActiveOffset<D>(dateAdapter: DateAdapter<D>, activeDate: D, minDate: D | null, maxDate: D | null): number;
