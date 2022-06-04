/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { ElementRef, InjectionToken, OnInit, Injector, DoCheck } from '@angular/core';
import { NgForm, FormGroupDirective, NgControl, ValidatorFn } from '@angular/forms';
import { CanUpdateErrorState, DateAdapter, MatDateFormats, ErrorStateMatcher } from '@angular/material/core';
import { MatDatepickerInputBase, DateFilterFn } from './datepicker-input-base';
import { DateRange, DateSelectionModelChange } from './date-selection-model';
import * as i0 from "@angular/core";
/** Parent component that should be wrapped around `MatStartDate` and `MatEndDate`. */
export interface MatDateRangeInputParent<D> {
    id: string;
    min: D | null;
    max: D | null;
    dateFilter: DateFilterFn<D>;
    rangePicker: {
        opened: boolean;
        id: string;
    };
    _startInput: MatDateRangeInputPartBase<D>;
    _endInput: MatDateRangeInputPartBase<D>;
    _groupDisabled: boolean;
    _handleChildValueChange(): void;
    _openDatepicker(): void;
}
/**
 * Used to provide the date range input wrapper component
 * to the parts without circular dependencies.
 */
export declare const MAT_DATE_RANGE_INPUT_PARENT: InjectionToken<MatDateRangeInputParent<unknown>>;
/**
 * Base class for the individual inputs that can be projected inside a `mat-date-range-input`.
 */
declare abstract class MatDateRangeInputPartBase<D> extends MatDatepickerInputBase<DateRange<D>> implements OnInit, DoCheck {
    _rangeInput: MatDateRangeInputParent<D>;
    _defaultErrorStateMatcher: ErrorStateMatcher;
    private _injector;
    _parentForm: NgForm;
    _parentFormGroup: FormGroupDirective;
    /** @docs-private */
    ngControl: NgControl;
    /** @docs-private */
    abstract updateErrorState(): void;
    protected abstract _validator: ValidatorFn | null;
    protected abstract _assignValueToModel(value: D | null): void;
    protected abstract _getValueFromModel(modelValue: DateRange<D>): D | null;
    constructor(_rangeInput: MatDateRangeInputParent<D>, elementRef: ElementRef<HTMLInputElement>, _defaultErrorStateMatcher: ErrorStateMatcher, _injector: Injector, _parentForm: NgForm, _parentFormGroup: FormGroupDirective, dateAdapter: DateAdapter<D>, dateFormats: MatDateFormats);
    ngOnInit(): void;
    ngDoCheck(): void;
    /** Gets whether the input is empty. */
    isEmpty(): boolean;
    /** Gets the placeholder of the input. */
    _getPlaceholder(): string;
    /** Focuses the input. */
    focus(): void;
    /** Handles `input` events on the input element. */
    _onInput(value: string): void;
    /** Opens the datepicker associated with the input. */
    protected _openPopup(): void;
    /** Gets the minimum date from the range input. */
    _getMinDate(): D | null;
    /** Gets the maximum date from the range input. */
    _getMaxDate(): D | null;
    /** Gets the date filter function from the range input. */
    protected _getDateFilter(): DateFilterFn<D>;
    protected _parentDisabled(): boolean;
    protected _shouldHandleChangeEvent({ source }: DateSelectionModelChange<DateRange<D>>): boolean;
    protected _assignValueProgrammatically(value: D | null): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<MatDateRangeInputPartBase<any>, [null, null, null, null, { optional: true; }, { optional: true; }, { optional: true; }, { optional: true; }]>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<MatDateRangeInputPartBase<any>, never, never, {}, {}, never>;
}
declare const _MatDateRangeInputBase: import("@angular/material/core")._Constructor<CanUpdateErrorState> & import("@angular/material/core")._AbstractConstructor<CanUpdateErrorState> & typeof MatDateRangeInputPartBase;
/** Input for entering the start date in a `mat-date-range-input`. */
export declare class MatStartDate<D> extends _MatDateRangeInputBase<D> implements CanUpdateErrorState {
    /** Validator that checks that the start date isn't after the end date. */
    private _startValidator;
    constructor(rangeInput: MatDateRangeInputParent<D>, elementRef: ElementRef<HTMLInputElement>, defaultErrorStateMatcher: ErrorStateMatcher, injector: Injector, parentForm: NgForm, parentFormGroup: FormGroupDirective, dateAdapter: DateAdapter<D>, dateFormats: MatDateFormats);
    protected _validator: ValidatorFn | null;
    protected _getValueFromModel(modelValue: DateRange<D>): D | null;
    protected _shouldHandleChangeEvent(change: DateSelectionModelChange<DateRange<D>>): boolean;
    protected _assignValueToModel(value: D | null): void;
    protected _formatValue(value: D | null): void;
    /** Gets the value that should be used when mirroring the input's size. */
    getMirrorValue(): string;
    static ɵfac: i0.ɵɵFactoryDeclaration<MatStartDate<any>, [null, null, null, null, { optional: true; }, { optional: true; }, { optional: true; }, { optional: true; }]>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<MatStartDate<any>, "input[matStartDate]", never, { "errorStateMatcher": "errorStateMatcher"; }, { "dateChange": "dateChange"; "dateInput": "dateInput"; }, never>;
}
/** Input for entering the end date in a `mat-date-range-input`. */
export declare class MatEndDate<D> extends _MatDateRangeInputBase<D> implements CanUpdateErrorState {
    /** Validator that checks that the end date isn't before the start date. */
    private _endValidator;
    constructor(rangeInput: MatDateRangeInputParent<D>, elementRef: ElementRef<HTMLInputElement>, defaultErrorStateMatcher: ErrorStateMatcher, injector: Injector, parentForm: NgForm, parentFormGroup: FormGroupDirective, dateAdapter: DateAdapter<D>, dateFormats: MatDateFormats);
    protected _validator: ValidatorFn | null;
    protected _getValueFromModel(modelValue: DateRange<D>): D | null;
    protected _shouldHandleChangeEvent(change: DateSelectionModelChange<DateRange<D>>): boolean;
    protected _assignValueToModel(value: D | null): void;
    _onKeydown(event: KeyboardEvent): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<MatEndDate<any>, [null, null, null, null, { optional: true; }, { optional: true; }, { optional: true; }, { optional: true; }]>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<MatEndDate<any>, "input[matEndDate]", never, { "errorStateMatcher": "errorStateMatcher"; }, { "dateChange": "dateChange"; "dateInput": "dateInput"; }, never>;
}
export {};
