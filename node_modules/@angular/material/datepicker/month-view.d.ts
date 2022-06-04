import { AfterContentInit, ChangeDetectorRef, EventEmitter, OnDestroy, SimpleChanges, OnChanges } from '@angular/core';
import { DateAdapter, MatDateFormats } from '@angular/material/core';
import { Directionality } from '@angular/cdk/bidi';
import { MatCalendarBody, MatCalendarCell, MatCalendarUserEvent, MatCalendarCellClassFunction } from './calendar-body';
import { DateRange } from './date-selection-model';
import { MatDateRangeSelectionStrategy } from './date-range-selection-strategy';
import * as i0 from "@angular/core";
/**
 * An internal component used to display a single month in the datepicker.
 * @docs-private
 */
export declare class MatMonthView<D> implements AfterContentInit, OnChanges, OnDestroy {
    readonly _changeDetectorRef: ChangeDetectorRef;
    private _dateFormats;
    _dateAdapter: DateAdapter<D>;
    private _dir?;
    private _rangeStrategy?;
    private _rerenderSubscription;
    /** Flag used to filter out space/enter keyup events that originated outside of the view. */
    private _selectionKeyPressed;
    /**
     * The date to display in this month view (everything other than the month and year is ignored).
     */
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
    /** Function used to filter which dates are selectable. */
    dateFilter: (date: D) => boolean;
    /** Function that can be used to add custom CSS classes to dates. */
    dateClass: MatCalendarCellClassFunction<D>;
    /** Start of the comparison range. */
    comparisonStart: D | null;
    /** End of the comparison range. */
    comparisonEnd: D | null;
    /** Emits when a new date is selected. */
    readonly selectedChange: EventEmitter<D | null>;
    /** Emits when any date is selected. */
    readonly _userSelection: EventEmitter<MatCalendarUserEvent<D | null>>;
    /** Emits when any date is activated. */
    readonly activeDateChange: EventEmitter<D>;
    /** The body of calendar table */
    _matCalendarBody: MatCalendarBody;
    /** The label for this month (e.g. "January 2017"). */
    _monthLabel: string;
    /** Grid of calendar cells representing the dates of the month. */
    _weeks: MatCalendarCell[][];
    /** The number of blank cells in the first row before the 1st of the month. */
    _firstWeekOffset: number;
    /** Start value of the currently-shown date range. */
    _rangeStart: number | null;
    /** End value of the currently-shown date range. */
    _rangeEnd: number | null;
    /** Start value of the currently-shown comparison date range. */
    _comparisonRangeStart: number | null;
    /** End value of the currently-shown comparison date range. */
    _comparisonRangeEnd: number | null;
    /** Start of the preview range. */
    _previewStart: number | null;
    /** End of the preview range. */
    _previewEnd: number | null;
    /** Whether the user is currently selecting a range of dates. */
    _isRange: boolean;
    /** The date of the month that today falls on. Null if today is in another month. */
    _todayDate: number | null;
    /** The names of the weekdays. */
    _weekdays: {
        long: string;
        narrow: string;
    }[];
    constructor(_changeDetectorRef: ChangeDetectorRef, _dateFormats: MatDateFormats, _dateAdapter: DateAdapter<D>, _dir?: Directionality | undefined, _rangeStrategy?: MatDateRangeSelectionStrategy<D> | undefined);
    ngAfterContentInit(): void;
    ngOnChanges(changes: SimpleChanges): void;
    ngOnDestroy(): void;
    /** Handles when a new date is selected. */
    _dateSelected(event: MatCalendarUserEvent<number>): void;
    /** Handles keydown events on the calendar body when calendar is in month view. */
    _handleCalendarBodyKeydown(event: KeyboardEvent): void;
    /** Handles keyup events on the calendar body when calendar is in month view. */
    _handleCalendarBodyKeyup(event: KeyboardEvent): void;
    /** Initializes this month view. */
    _init(): void;
    /** Focuses the active cell after the microtask queue is empty. */
    _focusActiveCell(movePreview?: boolean): void;
    /** Called when the user has activated a new cell and the preview needs to be updated. */
    _previewChanged({ event, value: cell }: MatCalendarUserEvent<MatCalendarCell<D> | null>): void;
    /** Initializes the weekdays. */
    private _initWeekdays;
    /** Creates MatCalendarCells for the dates in this month. */
    private _createWeekCells;
    /** Date filter for the month */
    private _shouldEnableDate;
    /**
     * Gets the date in this month that the given Date falls on.
     * Returns null if the given Date is in another month.
     */
    private _getDateInCurrentMonth;
    /** Checks whether the 2 dates are non-null and fall within the same month of the same year. */
    private _hasSameMonthAndYear;
    /** Gets the value that will be used to one cell to another. */
    private _getCellCompareValue;
    /** Determines whether the user has the RTL layout direction. */
    private _isRtl;
    /** Sets the current range based on a model value. */
    private _setRanges;
    /** Gets whether a date can be selected in the month view. */
    private _canSelect;
    static ɵfac: i0.ɵɵFactoryDeclaration<MatMonthView<any>, [null, { optional: true; }, { optional: true; }, { optional: true; }, { optional: true; }]>;
    static ɵcmp: i0.ɵɵComponentDeclaration<MatMonthView<any>, "mat-month-view", ["matMonthView"], { "activeDate": "activeDate"; "selected": "selected"; "minDate": "minDate"; "maxDate": "maxDate"; "dateFilter": "dateFilter"; "dateClass": "dateClass"; "comparisonStart": "comparisonStart"; "comparisonEnd": "comparisonEnd"; }, { "selectedChange": "selectedChange"; "_userSelection": "_userSelection"; "activeDateChange": "activeDateChange"; }, never, never>;
}
