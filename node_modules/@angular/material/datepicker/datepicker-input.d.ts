/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { ElementRef, OnDestroy } from '@angular/core';
import { ValidatorFn } from '@angular/forms';
import { DateAdapter, MatDateFormats, ThemePalette } from '@angular/material/core';
import { MatFormField } from '@angular/material/form-field';
import { MatDatepickerInputBase, DateFilterFn } from './datepicker-input-base';
import { MatDatepickerControl, MatDatepickerPanel } from './datepicker-base';
import { DateSelectionModelChange } from './date-selection-model';
import * as i0 from "@angular/core";
/** @docs-private */
export declare const MAT_DATEPICKER_VALUE_ACCESSOR: any;
/** @docs-private */
export declare const MAT_DATEPICKER_VALIDATORS: any;
/** Directive used to connect an input to a MatDatepicker. */
export declare class MatDatepickerInput<D> extends MatDatepickerInputBase<D | null, D> implements MatDatepickerControl<D | null>, OnDestroy {
    private _formField?;
    private _closedSubscription;
    /** The datepicker that this input is associated with. */
    set matDatepicker(datepicker: MatDatepickerPanel<MatDatepickerControl<D>, D | null, D>);
    _datepicker: MatDatepickerPanel<MatDatepickerControl<D>, D | null, D>;
    /** The minimum valid date. */
    get min(): D | null;
    set min(value: D | null);
    private _min;
    /** The maximum valid date. */
    get max(): D | null;
    set max(value: D | null);
    private _max;
    /** Function that can be used to filter out dates within the datepicker. */
    get dateFilter(): DateFilterFn<D | null>;
    set dateFilter(value: DateFilterFn<D | null>);
    private _dateFilter;
    /** The combined form control validator for this input. */
    protected _validator: ValidatorFn | null;
    constructor(elementRef: ElementRef<HTMLInputElement>, dateAdapter: DateAdapter<D>, dateFormats: MatDateFormats, _formField?: MatFormField | undefined);
    /**
     * Gets the element that the datepicker popup should be connected to.
     * @return The element to connect the popup to.
     */
    getConnectedOverlayOrigin(): ElementRef;
    /** Gets the ID of an element that should be used a description for the calendar overlay. */
    getOverlayLabelId(): string | null;
    /** Returns the palette used by the input's form field, if any. */
    getThemePalette(): ThemePalette;
    /** Gets the value at which the calendar should start. */
    getStartValue(): D | null;
    ngOnDestroy(): void;
    /** Opens the associated datepicker. */
    protected _openPopup(): void;
    protected _getValueFromModel(modelValue: D | null): D | null;
    protected _assignValueToModel(value: D | null): void;
    /** Gets the input's minimum date. */
    _getMinDate(): D | null;
    /** Gets the input's maximum date. */
    _getMaxDate(): D | null;
    /** Gets the input's date filtering function. */
    protected _getDateFilter(): DateFilterFn<D | null>;
    protected _shouldHandleChangeEvent(event: DateSelectionModelChange<D>): boolean;
    static ɵfac: i0.ɵɵFactoryDeclaration<MatDatepickerInput<any>, [null, { optional: true; }, { optional: true; }, { optional: true; }]>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<MatDatepickerInput<any>, "input[matDatepicker]", ["matDatepickerInput"], { "matDatepicker": "matDatepicker"; "min": "min"; "max": "max"; "dateFilter": "matDatepickerFilter"; }, {}, never>;
}
