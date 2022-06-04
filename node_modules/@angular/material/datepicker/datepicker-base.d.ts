/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { Directionality } from '@angular/cdk/bidi';
import { BooleanInput } from '@angular/cdk/coercion';
import { Overlay, ScrollStrategy } from '@angular/cdk/overlay';
import { ComponentType, TemplatePortal } from '@angular/cdk/portal';
import { AfterViewInit, ElementRef, EventEmitter, InjectionToken, NgZone, OnDestroy, ViewContainerRef, ChangeDetectorRef, OnChanges, SimpleChanges, OnInit } from '@angular/core';
import { CanColor, DateAdapter, ThemePalette } from '@angular/material/core';
import { Subject, Observable } from 'rxjs';
import { MatCalendar, MatCalendarView } from './calendar';
import { MatCalendarUserEvent, MatCalendarCellClassFunction } from './calendar-body';
import { DateFilterFn } from './datepicker-input-base';
import { ExtractDateTypeFromSelection, MatDateSelectionModel, DateRange } from './date-selection-model';
import { MatDateRangeSelectionStrategy } from './date-range-selection-strategy';
import { MatDatepickerIntl } from './datepicker-intl';
import * as i0 from "@angular/core";
/** Injection token that determines the scroll handling while the calendar is open. */
export declare const MAT_DATEPICKER_SCROLL_STRATEGY: InjectionToken<() => ScrollStrategy>;
/** @docs-private */
export declare function MAT_DATEPICKER_SCROLL_STRATEGY_FACTORY(overlay: Overlay): () => ScrollStrategy;
/** Possible positions for the datepicker dropdown along the X axis. */
export declare type DatepickerDropdownPositionX = 'start' | 'end';
/** Possible positions for the datepicker dropdown along the Y axis. */
export declare type DatepickerDropdownPositionY = 'above' | 'below';
/** @docs-private */
export declare const MAT_DATEPICKER_SCROLL_STRATEGY_FACTORY_PROVIDER: {
    provide: InjectionToken<() => ScrollStrategy>;
    deps: (typeof Overlay)[];
    useFactory: typeof MAT_DATEPICKER_SCROLL_STRATEGY_FACTORY;
};
/** @docs-private */
declare const _MatDatepickerContentBase: import("@angular/material/core")._Constructor<CanColor> & import("@angular/material/core")._AbstractConstructor<CanColor> & {
    new (_elementRef: ElementRef): {
        _elementRef: ElementRef;
    };
};
/**
 * Component used as the content for the datepicker overlay. We use this instead of using
 * MatCalendar directly as the content so we can control the initial focus. This also gives us a
 * place to put additional features of the overlay that are not part of the calendar itself in the
 * future. (e.g. confirmation buttons).
 * @docs-private
 */
export declare class MatDatepickerContent<S, D = ExtractDateTypeFromSelection<S>> extends _MatDatepickerContentBase implements OnInit, AfterViewInit, OnDestroy, CanColor {
    private _changeDetectorRef;
    private _globalModel;
    private _dateAdapter;
    private _rangeSelectionStrategy;
    private _subscriptions;
    private _model;
    /** Reference to the internal calendar component. */
    _calendar: MatCalendar<D>;
    /** Reference to the datepicker that created the overlay. */
    datepicker: MatDatepickerBase<any, S, D>;
    /** Start of the comparison range. */
    comparisonStart: D | null;
    /** End of the comparison range. */
    comparisonEnd: D | null;
    /** Whether the datepicker is above or below the input. */
    _isAbove: boolean;
    /** Current state of the animation. */
    _animationState: 'enter-dropdown' | 'enter-dialog' | 'void';
    /** Emits when an animation has finished. */
    readonly _animationDone: Subject<void>;
    /** Text for the close button. */
    _closeButtonText: string;
    /** Whether the close button currently has focus. */
    _closeButtonFocused: boolean;
    /** Portal with projected action buttons. */
    _actionsPortal: TemplatePortal | null;
    /** Id of the label for the `role="dialog"` element. */
    _dialogLabelId: string | null;
    constructor(elementRef: ElementRef, _changeDetectorRef: ChangeDetectorRef, _globalModel: MatDateSelectionModel<S, D>, _dateAdapter: DateAdapter<D>, _rangeSelectionStrategy: MatDateRangeSelectionStrategy<D>, intl: MatDatepickerIntl);
    ngOnInit(): void;
    ngAfterViewInit(): void;
    ngOnDestroy(): void;
    _handleUserSelection(event: MatCalendarUserEvent<D | null>): void;
    _startExitAnimation(): void;
    _getSelected(): D | DateRange<D> | null;
    /** Applies the current pending selection to the global model. */
    _applyPendingSelection(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<MatDatepickerContent<any, any>, [null, null, null, null, { optional: true; }, null]>;
    static ɵcmp: i0.ɵɵComponentDeclaration<MatDatepickerContent<any, any>, "mat-datepicker-content", ["matDatepickerContent"], { "color": "color"; }, {}, never, never>;
}
/** Form control that can be associated with a datepicker. */
export interface MatDatepickerControl<D> {
    getStartValue(): D | null;
    getThemePalette(): ThemePalette;
    min: D | null;
    max: D | null;
    disabled: boolean;
    dateFilter: DateFilterFn<D>;
    getConnectedOverlayOrigin(): ElementRef;
    getOverlayLabelId(): string | null;
    stateChanges: Observable<void>;
}
/** A datepicker that can be attached to a {@link MatDatepickerControl}. */
export interface MatDatepickerPanel<C extends MatDatepickerControl<D>, S, D = ExtractDateTypeFromSelection<S>> {
    /** Stream that emits whenever the date picker is closed. */
    closedStream: EventEmitter<void>;
    /** Color palette to use on the datepicker's calendar. */
    color: ThemePalette;
    /** The input element the datepicker is associated with. */
    datepickerInput: C;
    /** Whether the datepicker pop-up should be disabled. */
    disabled: boolean;
    /** The id for the datepicker's calendar. */
    id: string;
    /** Whether the datepicker is open. */
    opened: boolean;
    /** Stream that emits whenever the date picker is opened. */
    openedStream: EventEmitter<void>;
    /** Emits when the datepicker's state changes. */
    stateChanges: Subject<void>;
    /** Opens the datepicker. */
    open(): void;
    /** Register an input with the datepicker. */
    registerInput(input: C): MatDateSelectionModel<S, D>;
}
/** Base class for a datepicker. */
export declare abstract class MatDatepickerBase<C extends MatDatepickerControl<D>, S, D = ExtractDateTypeFromSelection<S>> implements MatDatepickerPanel<C, S, D>, OnDestroy, OnChanges {
    private _overlay;
    private _ngZone;
    private _viewContainerRef;
    private _dateAdapter;
    private _dir;
    private _model;
    private _scrollStrategy;
    private _inputStateChanges;
    /** An input indicating the type of the custom header component for the calendar, if set. */
    calendarHeaderComponent: ComponentType<any>;
    /** The date to open the calendar to initially. */
    get startAt(): D | null;
    set startAt(value: D | null);
    private _startAt;
    /** The view that the calendar should start in. */
    startView: 'month' | 'year' | 'multi-year';
    /** Color palette to use on the datepicker's calendar. */
    get color(): ThemePalette;
    set color(value: ThemePalette);
    _color: ThemePalette;
    /**
     * Whether the calendar UI is in touch mode. In touch mode the calendar opens in a dialog rather
     * than a dropdown and elements have more padding to allow for bigger touch targets.
     */
    get touchUi(): boolean;
    set touchUi(value: BooleanInput);
    private _touchUi;
    /** Whether the datepicker pop-up should be disabled. */
    get disabled(): boolean;
    set disabled(value: BooleanInput);
    private _disabled;
    /** Preferred position of the datepicker in the X axis. */
    xPosition: DatepickerDropdownPositionX;
    /** Preferred position of the datepicker in the Y axis. */
    yPosition: DatepickerDropdownPositionY;
    /**
     * Whether to restore focus to the previously-focused element when the calendar is closed.
     * Note that automatic focus restoration is an accessibility feature and it is recommended that
     * you provide your own equivalent, if you decide to turn it off.
     */
    get restoreFocus(): boolean;
    set restoreFocus(value: BooleanInput);
    private _restoreFocus;
    /**
     * Emits selected year in multiyear view.
     * This doesn't imply a change on the selected date.
     */
    readonly yearSelected: EventEmitter<D>;
    /**
     * Emits selected month in year view.
     * This doesn't imply a change on the selected date.
     */
    readonly monthSelected: EventEmitter<D>;
    /**
     * Emits when the current view changes.
     */
    readonly viewChanged: EventEmitter<MatCalendarView>;
    /** Function that can be used to add custom CSS classes to dates. */
    dateClass: MatCalendarCellClassFunction<D>;
    /** Emits when the datepicker has been opened. */
    readonly openedStream: EventEmitter<void>;
    /** Emits when the datepicker has been closed. */
    readonly closedStream: EventEmitter<void>;
    /**
     * Classes to be passed to the date picker panel.
     * Supports string and string array values, similar to `ngClass`.
     */
    get panelClass(): string | string[];
    set panelClass(value: string | string[]);
    private _panelClass;
    /** Whether the calendar is open. */
    get opened(): boolean;
    set opened(value: BooleanInput);
    private _opened;
    /** The id for the datepicker calendar. */
    id: string;
    /** The minimum selectable date. */
    _getMinDate(): D | null;
    /** The maximum selectable date. */
    _getMaxDate(): D | null;
    _getDateFilter(): DateFilterFn<D>;
    /** A reference to the overlay into which we've rendered the calendar. */
    private _overlayRef;
    /** Reference to the component instance rendered in the overlay. */
    private _componentRef;
    /** The element that was focused before the datepicker was opened. */
    private _focusedElementBeforeOpen;
    /** Unique class that will be added to the backdrop so that the test harnesses can look it up. */
    private _backdropHarnessClass;
    /** Currently-registered actions portal. */
    private _actionsPortal;
    /** The input element this datepicker is associated with. */
    datepickerInput: C;
    /** Emits when the datepicker's state changes. */
    readonly stateChanges: Subject<void>;
    constructor(_overlay: Overlay, _ngZone: NgZone, _viewContainerRef: ViewContainerRef, scrollStrategy: any, _dateAdapter: DateAdapter<D>, _dir: Directionality, _model: MatDateSelectionModel<S, D>);
    ngOnChanges(changes: SimpleChanges): void;
    ngOnDestroy(): void;
    /** Selects the given date */
    select(date: D): void;
    /** Emits the selected year in multiyear view */
    _selectYear(normalizedYear: D): void;
    /** Emits selected month in year view */
    _selectMonth(normalizedMonth: D): void;
    /** Emits changed view */
    _viewChanged(view: MatCalendarView): void;
    /**
     * Register an input with this datepicker.
     * @param input The datepicker input to register with this datepicker.
     * @returns Selection model that the input should hook itself up to.
     */
    registerInput(input: C): MatDateSelectionModel<S, D>;
    /**
     * Registers a portal containing action buttons with the datepicker.
     * @param portal Portal to be registered.
     */
    registerActions(portal: TemplatePortal): void;
    /**
     * Removes a portal containing action buttons from the datepicker.
     * @param portal Portal to be removed.
     */
    removeActions(portal: TemplatePortal): void;
    /** Open the calendar. */
    open(): void;
    /** Close the calendar. */
    close(): void;
    /** Applies the current pending selection on the overlay to the model. */
    _applyPendingSelection(): void;
    /** Forwards relevant values from the datepicker to the datepicker content inside the overlay. */
    protected _forwardContentValues(instance: MatDatepickerContent<S, D>): void;
    /** Opens the overlay with the calendar. */
    private _openOverlay;
    /** Destroys the current overlay. */
    private _destroyOverlay;
    /** Gets a position strategy that will open the calendar as a dropdown. */
    private _getDialogStrategy;
    /** Gets a position strategy that will open the calendar as a dropdown. */
    private _getDropdownStrategy;
    /** Sets the positions of the datepicker in dropdown mode based on the current configuration. */
    private _setConnectedPositions;
    /** Gets an observable that will emit when the overlay is supposed to be closed. */
    private _getCloseStream;
    static ɵfac: i0.ɵɵFactoryDeclaration<MatDatepickerBase<any, any, any>, [null, null, null, null, { optional: true; }, { optional: true; }, null]>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<MatDatepickerBase<any, any, any>, never, never, { "calendarHeaderComponent": "calendarHeaderComponent"; "startAt": "startAt"; "startView": "startView"; "color": "color"; "touchUi": "touchUi"; "disabled": "disabled"; "xPosition": "xPosition"; "yPosition": "yPosition"; "restoreFocus": "restoreFocus"; "dateClass": "dateClass"; "panelClass": "panelClass"; "opened": "opened"; }, { "yearSelected": "yearSelected"; "monthSelected": "monthSelected"; "viewChanged": "viewChanged"; "openedStream": "opened"; "closedStream": "closed"; }, never>;
}
export {};
