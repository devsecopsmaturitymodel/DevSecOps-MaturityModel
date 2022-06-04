/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { FactoryProvider, OnDestroy } from '@angular/core';
import { DateAdapter } from '@angular/material/core';
import { Observable } from 'rxjs';
import * as i0 from "@angular/core";
/** A class representing a range of dates. */
export declare class DateRange<D> {
    /** The start date of the range. */
    readonly start: D | null;
    /** The end date of the range. */
    readonly end: D | null;
    /**
     * Ensures that objects with a `start` and `end` property can't be assigned to a variable that
     * expects a `DateRange`
     */
    private _disableStructuralEquivalency;
    constructor(
    /** The start date of the range. */
    start: D | null, 
    /** The end date of the range. */
    end: D | null);
}
/**
 * Conditionally picks the date type, if a DateRange is passed in.
 * @docs-private
 */
export declare type ExtractDateTypeFromSelection<T> = T extends DateRange<infer D> ? D : NonNullable<T>;
/**
 * Event emitted by the date selection model when its selection changes.
 * @docs-private
 */
export interface DateSelectionModelChange<S> {
    /** New value for the selection. */
    selection: S;
    /** Object that triggered the change. */
    source: unknown;
    /** Previous value */
    oldValue?: S;
}
/**
 * A selection model containing a date selection.
 * @docs-private
 */
export declare abstract class MatDateSelectionModel<S, D = ExtractDateTypeFromSelection<S>> implements OnDestroy {
    /** The current selection. */
    readonly selection: S;
    protected _adapter: DateAdapter<D>;
    private readonly _selectionChanged;
    /** Emits when the selection has changed. */
    selectionChanged: Observable<DateSelectionModelChange<S>>;
    protected constructor(
    /** The current selection. */
    selection: S, _adapter: DateAdapter<D>);
    /**
     * Updates the current selection in the model.
     * @param value New selection that should be assigned.
     * @param source Object that triggered the selection change.
     */
    updateSelection(value: S, source: unknown): void;
    ngOnDestroy(): void;
    protected _isValidDateInstance(date: D): boolean;
    /** Adds a date to the current selection. */
    abstract add(date: D | null): void;
    /** Checks whether the current selection is valid. */
    abstract isValid(): boolean;
    /** Checks whether the current selection is complete. */
    abstract isComplete(): boolean;
    /** Clones the selection model. */
    abstract clone(): MatDateSelectionModel<S, D>;
    static ɵfac: i0.ɵɵFactoryDeclaration<MatDateSelectionModel<any, any>, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<MatDateSelectionModel<any, any>>;
}
/**
 * A selection model that contains a single date.
 * @docs-private
 */
export declare class MatSingleDateSelectionModel<D> extends MatDateSelectionModel<D | null, D> {
    constructor(adapter: DateAdapter<D>);
    /**
     * Adds a date to the current selection. In the case of a single date selection, the added date
     * simply overwrites the previous selection
     */
    add(date: D | null): void;
    /** Checks whether the current selection is valid. */
    isValid(): boolean;
    /**
     * Checks whether the current selection is complete. In the case of a single date selection, this
     * is true if the current selection is not null.
     */
    isComplete(): boolean;
    /** Clones the selection model. */
    clone(): MatSingleDateSelectionModel<D>;
    static ɵfac: i0.ɵɵFactoryDeclaration<MatSingleDateSelectionModel<any>, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<MatSingleDateSelectionModel<any>>;
}
/**
 * A selection model that contains a date range.
 * @docs-private
 */
export declare class MatRangeDateSelectionModel<D> extends MatDateSelectionModel<DateRange<D>, D> {
    constructor(adapter: DateAdapter<D>);
    /**
     * Adds a date to the current selection. In the case of a date range selection, the added date
     * fills in the next `null` value in the range. If both the start and the end already have a date,
     * the selection is reset so that the given date is the new `start` and the `end` is null.
     */
    add(date: D | null): void;
    /** Checks whether the current selection is valid. */
    isValid(): boolean;
    /**
     * Checks whether the current selection is complete. In the case of a date range selection, this
     * is true if the current selection has a non-null `start` and `end`.
     */
    isComplete(): boolean;
    /** Clones the selection model. */
    clone(): MatRangeDateSelectionModel<D>;
    static ɵfac: i0.ɵɵFactoryDeclaration<MatRangeDateSelectionModel<any>, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<MatRangeDateSelectionModel<any>>;
}
/** @docs-private */
export declare function MAT_SINGLE_DATE_SELECTION_MODEL_FACTORY(parent: MatSingleDateSelectionModel<unknown>, adapter: DateAdapter<unknown>): MatSingleDateSelectionModel<unknown>;
/**
 * Used to provide a single selection model to a component.
 * @docs-private
 */
export declare const MAT_SINGLE_DATE_SELECTION_MODEL_PROVIDER: FactoryProvider;
/** @docs-private */
export declare function MAT_RANGE_DATE_SELECTION_MODEL_FACTORY(parent: MatSingleDateSelectionModel<unknown>, adapter: DateAdapter<unknown>): MatSingleDateSelectionModel<unknown>;
/**
 * Used to provide a range selection model to a component.
 * @docs-private
 */
export declare const MAT_RANGE_DATE_SELECTION_MODEL_PROVIDER: FactoryProvider;
