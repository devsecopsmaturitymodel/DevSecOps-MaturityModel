/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { HarnessPredicate } from '@angular/cdk/testing';
import { DatepickerToggleHarnessFilters } from './datepicker-harness-filters';
import { DatepickerTriggerHarnessBase } from './datepicker-trigger-harness-base';
/** Harness for interacting with a standard Material datepicker toggle in tests. */
export declare class MatDatepickerToggleHarness extends DatepickerTriggerHarnessBase {
    static hostSelector: string;
    /** The clickable button inside the toggle. */
    private _button;
    /**
     * Gets a `HarnessPredicate` that can be used to search for a `MatDatepickerToggleHarness` that
     * meets certain criteria.
     * @param options Options for filtering which datepicker toggle instances are considered a match.
     * @return a `HarnessPredicate` configured with the given options.
     */
    static with(options?: DatepickerToggleHarnessFilters): HarnessPredicate<MatDatepickerToggleHarness>;
    /** Gets whether the calendar associated with the toggle is open. */
    isCalendarOpen(): Promise<boolean>;
    /** Whether the toggle is disabled. */
    isDisabled(): Promise<boolean>;
    protected _openCalendar(): Promise<void>;
}
