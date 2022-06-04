/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { HarnessPredicate } from '@angular/cdk/testing';
import { MatDatepickerInputHarnessBase } from './datepicker-input-harness-base';
import { DatepickerTriggerHarnessBase } from './datepicker-trigger-harness-base';
import { DatepickerInputHarnessFilters, DateRangeInputHarnessFilters } from './datepicker-harness-filters';
/** Harness for interacting with a standard Material date range start input in tests. */
export declare class MatStartDateHarness extends MatDatepickerInputHarnessBase {
    static hostSelector: string;
    /**
     * Gets a `HarnessPredicate` that can be used to search for a `MatStartDateHarness`
     * that meets certain criteria.
     * @param options Options for filtering which input instances are considered a match.
     * @return a `HarnessPredicate` configured with the given options.
     */
    static with(options?: DatepickerInputHarnessFilters): HarnessPredicate<MatStartDateHarness>;
}
/** Harness for interacting with a standard Material date range end input in tests. */
export declare class MatEndDateHarness extends MatDatepickerInputHarnessBase {
    static hostSelector: string;
    /**
     * Gets a `HarnessPredicate` that can be used to search for a `MatEndDateHarness`
     * that meets certain criteria.
     * @param options Options for filtering which input instances are considered a match.
     * @return a `HarnessPredicate` configured with the given options.
     */
    static with(options?: DatepickerInputHarnessFilters): HarnessPredicate<MatEndDateHarness>;
}
/** Harness for interacting with a standard Material date range input in tests. */
export declare class MatDateRangeInputHarness extends DatepickerTriggerHarnessBase {
    static hostSelector: string;
    /**
     * Gets a `HarnessPredicate` that can be used to search for a `MatDateRangeInputHarness`
     * that meets certain criteria.
     * @param options Options for filtering which input instances are considered a match.
     * @return a `HarnessPredicate` configured with the given options.
     */
    static with(options?: DateRangeInputHarnessFilters): HarnessPredicate<MatDateRangeInputHarness>;
    /** Gets the combined value of the start and end inputs, including the separator. */
    getValue(): Promise<string>;
    /** Gets the inner start date input inside the range input. */
    getStartInput(): Promise<MatStartDateHarness>;
    /** Gets the inner start date input inside the range input. */
    getEndInput(): Promise<MatEndDateHarness>;
    /** Gets the separator text between the values of the two inputs. */
    getSeparator(): Promise<string>;
    /** Gets whether the range input is disabled. */
    isDisabled(): Promise<boolean>;
    /** Gets whether the range input is required. */
    isRequired(): Promise<boolean>;
    /** Opens the calendar associated with the input. */
    isCalendarOpen(): Promise<boolean>;
    protected _openCalendar(): Promise<void>;
}
