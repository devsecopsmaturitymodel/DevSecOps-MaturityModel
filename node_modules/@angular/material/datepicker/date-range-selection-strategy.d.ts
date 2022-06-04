/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { InjectionToken, FactoryProvider } from '@angular/core';
import { DateAdapter } from '@angular/material/core';
import { DateRange } from './date-selection-model';
import * as i0 from "@angular/core";
/** Injection token used to customize the date range selection behavior. */
export declare const MAT_DATE_RANGE_SELECTION_STRATEGY: InjectionToken<MatDateRangeSelectionStrategy<any>>;
/** Object that can be provided in order to customize the date range selection behavior. */
export interface MatDateRangeSelectionStrategy<D> {
    /**
     * Called when the user has finished selecting a value.
     * @param date Date that was selected. Will be null if the user cleared the selection.
     * @param currentRange Range that is currently show in the calendar.
     * @param event DOM event that triggered the selection. Currently only corresponds to a `click`
     *    event, but it may get expanded in the future.
     */
    selectionFinished(date: D | null, currentRange: DateRange<D>, event: Event): DateRange<D>;
    /**
     * Called when the user has activated a new date (e.g. by hovering over
     * it or moving focus) and the calendar tries to display a date range.
     *
     * @param activeDate Date that the user has activated. Will be null if the user moved
     *    focus to an element that's no a calendar cell.
     * @param currentRange Range that is currently shown in the calendar.
     * @param event DOM event that caused the preview to be changed. Will be either a
     *    `mouseenter`/`mouseleave` or `focus`/`blur` depending on how the user is navigating.
     */
    createPreview(activeDate: D | null, currentRange: DateRange<D>, event: Event): DateRange<D>;
}
/** Provides the default date range selection behavior. */
export declare class DefaultMatCalendarRangeStrategy<D> implements MatDateRangeSelectionStrategy<D> {
    private _dateAdapter;
    constructor(_dateAdapter: DateAdapter<D>);
    selectionFinished(date: D, currentRange: DateRange<D>): DateRange<D>;
    createPreview(activeDate: D | null, currentRange: DateRange<D>): DateRange<D>;
    static ɵfac: i0.ɵɵFactoryDeclaration<DefaultMatCalendarRangeStrategy<any>, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<DefaultMatCalendarRangeStrategy<any>>;
}
/** @docs-private */
export declare function MAT_CALENDAR_RANGE_STRATEGY_PROVIDER_FACTORY(parent: MatDateRangeSelectionStrategy<unknown>, adapter: DateAdapter<unknown>): MatDateRangeSelectionStrategy<unknown>;
/** @docs-private */
export declare const MAT_CALENDAR_RANGE_STRATEGY_PROVIDER: FactoryProvider;
