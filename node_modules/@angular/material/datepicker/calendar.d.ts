/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { ComponentType, Portal } from '@angular/cdk/portal';
import { AfterContentInit, AfterViewChecked, ChangeDetectorRef, EventEmitter, OnChanges, OnDestroy, SimpleChanges } from '@angular/core';
import { DateAdapter, MatDateFormats } from '@angular/material/core';
import { Subject } from 'rxjs';
import { MatCalendarUserEvent, MatCalendarCellClassFunction } from './calendar-body';
import { MatDatepickerIntl } from './datepicker-intl';
import { MatMonthView } from './month-view';
import { MatMultiYearView } from './multi-year-view';
import { MatYearView } from './year-view';
import { DateRange } from './date-selection-model';
import * as i0 from "@angular/core";
/**
 * Possible views for the calendar.
 * @docs-private
 */
export declare type MatCalendarView = 'month' | 'year' | 'multi-year';
/** Default header for MatCalendar */
export declare class MatCalendarHeader<D> {
    private _intl;
    calendar: MatCalendar<D>;
    private _dateAdapter;
    private _dateFormats;
    _buttonDescriptionId: string;
    constructor(_intl: MatDatepickerIntl, calendar: MatCalendar<D>, _dateAdapter: DateAdapter<D>, _dateFormats: MatDateFormats, changeDetectorRef: ChangeDetectorRef);
    /** The label for the current calendar view. */
    get periodButtonText(): string;
    get periodButtonLabel(): string;
    /** The label for the previous button. */
    get prevButtonLabel(): string;
    /** The label for the next button. */
    get nextButtonLabel(): string;
    /** Handles user clicks on the period label. */
    currentPeriodClicked(): void;
    /** Handles user clicks on the previous button. */
    previousClicked(): void;
    /** Handles user clicks on the next button. */
    nextClicked(): void;
    /** Whether the previous period button is enabled. */
    previousEnabled(): boolean;
    /** Whether the next period button is enabled. */
    nextEnabled(): boolean;
    /** Whether the two dates represent the same view in the current view mode (month or year). */
    private _isSameView;
    static ɵfac: i0.ɵɵFactoryDeclaration<MatCalendarHeader<any>, [null, null, { optional: true; }, { optional: true; }, null]>;
    static ɵcmp: i0.ɵɵComponentDeclaration<MatCalendarHeader<any>, "mat-calendar-header", ["matCalendarHeader"], {}, {}, never, ["*"]>;
}
/** A calendar that is used as part of the datepicker. */
export declare class MatCalendar<D> implements AfterContentInit, AfterViewChecked, OnDestroy, OnChanges {
    private _dateAdapter;
    private _dateFormats;
    private _changeDetectorRef;
    /** An input indicating the type of the header component, if set. */
    headerComponent: ComponentType<any>;
    /** A portal containing the header component type for this calendar. */
    _calendarHeaderPortal: Portal<any>;
    private _intlChanges;
    /**
     * Used for scheduling that focus should be moved to the active cell on the next tick.
     * We need to schedule it, rather than do it immediately, because we have to wait
     * for Angular to re-evaluate the view children.
     */
    private _moveFocusOnNextTick;
    /** A date representing the period (month or year) to start the calendar in. */
    get startAt(): D | null;
    set startAt(value: D | null);
    private _startAt;
    /** Whether the calendar should be started in month or year view. */
    startView: MatCalendarView;
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
    /** Emits when the currently selected date changes. */
    readonly selectedChange: EventEmitter<D | null>;
    /**
     * Emits the year chosen in multiyear view.
     * This doesn't imply a change on the selected date.
     */
    readonly yearSelected: EventEmitter<D>;
    /**
     * Emits the month chosen in year view.
     * This doesn't imply a change on the selected date.
     */
    readonly monthSelected: EventEmitter<D>;
    /**
     * Emits when the current view changes.
     */
    readonly viewChanged: EventEmitter<MatCalendarView>;
    /** Emits when any date is selected. */
    readonly _userSelection: EventEmitter<MatCalendarUserEvent<D | null>>;
    /** Reference to the current month view component. */
    monthView: MatMonthView<D>;
    /** Reference to the current year view component. */
    yearView: MatYearView<D>;
    /** Reference to the current multi-year view component. */
    multiYearView: MatMultiYearView<D>;
    /**
     * The current active date. This determines which time period is shown and which date is
     * highlighted when using keyboard navigation.
     */
    get activeDate(): D;
    set activeDate(value: D);
    private _clampedActiveDate;
    /** Whether the calendar is in month view. */
    get currentView(): MatCalendarView;
    set currentView(value: MatCalendarView);
    private _currentView;
    /**
     * Emits whenever there is a state change that the header may need to respond to.
     */
    readonly stateChanges: Subject<void>;
    constructor(_intl: MatDatepickerIntl, _dateAdapter: DateAdapter<D>, _dateFormats: MatDateFormats, _changeDetectorRef: ChangeDetectorRef);
    ngAfterContentInit(): void;
    ngAfterViewChecked(): void;
    ngOnDestroy(): void;
    ngOnChanges(changes: SimpleChanges): void;
    /** Focuses the active date. */
    focusActiveCell(): void;
    /** Updates today's date after an update of the active date */
    updateTodaysDate(): void;
    /** Handles date selection in the month view. */
    _dateSelected(event: MatCalendarUserEvent<D | null>): void;
    /** Handles year selection in the multiyear view. */
    _yearSelectedInMultiYearView(normalizedYear: D): void;
    /** Handles month selection in the year view. */
    _monthSelectedInYearView(normalizedMonth: D): void;
    /** Handles year/month selection in the multi-year/year views. */
    _goToDateInView(date: D, view: 'month' | 'year' | 'multi-year'): void;
    /** Returns the component instance that corresponds to the current calendar view. */
    private _getCurrentViewComponent;
    static ɵfac: i0.ɵɵFactoryDeclaration<MatCalendar<any>, [null, { optional: true; }, { optional: true; }, null]>;
    static ɵcmp: i0.ɵɵComponentDeclaration<MatCalendar<any>, "mat-calendar", ["matCalendar"], { "headerComponent": "headerComponent"; "startAt": "startAt"; "startView": "startView"; "selected": "selected"; "minDate": "minDate"; "maxDate": "maxDate"; "dateFilter": "dateFilter"; "dateClass": "dateClass"; "comparisonStart": "comparisonStart"; "comparisonEnd": "comparisonEnd"; }, { "selectedChange": "selectedChange"; "yearSelected": "yearSelected"; "monthSelected": "monthSelected"; "viewChanged": "viewChanged"; "_userSelection": "_userSelection"; }, never, never>;
}
