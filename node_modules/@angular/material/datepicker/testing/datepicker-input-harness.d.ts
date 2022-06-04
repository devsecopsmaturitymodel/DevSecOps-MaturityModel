/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { HarnessPredicate } from '@angular/cdk/testing';
import { DatepickerInputHarnessFilters, CalendarHarnessFilters } from './datepicker-harness-filters';
import { MatDatepickerInputHarnessBase } from './datepicker-input-harness-base';
import { MatCalendarHarness } from './calendar-harness';
import { DatepickerTrigger } from './datepicker-trigger-harness-base';
/** Harness for interacting with a standard Material datepicker inputs in tests. */
export declare class MatDatepickerInputHarness extends MatDatepickerInputHarnessBase implements DatepickerTrigger {
    static hostSelector: string;
    /**
     * Gets a `HarnessPredicate` that can be used to search for a `MatDatepickerInputHarness`
     * that meets certain criteria.
     * @param options Options for filtering which input instances are considered a match.
     * @return a `HarnessPredicate` configured with the given options.
     */
    static with(options?: DatepickerInputHarnessFilters): HarnessPredicate<MatDatepickerInputHarness>;
    /** Gets whether the calendar associated with the input is open. */
    isCalendarOpen(): Promise<boolean>;
    /** Opens the calendar associated with the input. */
    openCalendar(): Promise<void>;
    /** Closes the calendar associated with the input. */
    closeCalendar(): Promise<void>;
    /** Whether a calendar is associated with the input. */
    hasCalendar(): Promise<boolean>;
    /**
     * Gets the `MatCalendarHarness` that is associated with the trigger.
     * @param filter Optionally filters which calendar is included.
     */
    getCalendar(filter?: CalendarHarnessFilters): Promise<MatCalendarHarness>;
}
