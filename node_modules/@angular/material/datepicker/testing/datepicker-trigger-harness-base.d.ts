/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { ComponentHarness, LocatorFactory, TestElement } from '@angular/cdk/testing';
import { CalendarHarnessFilters } from './datepicker-harness-filters';
import { MatCalendarHarness } from './calendar-harness';
/** Interface for a test harness that can open and close a calendar. */
export interface DatepickerTrigger {
    isCalendarOpen(): Promise<boolean>;
    openCalendar(): Promise<void>;
    closeCalendar(): Promise<void>;
    hasCalendar(): Promise<boolean>;
    getCalendar(filter?: CalendarHarnessFilters): Promise<MatCalendarHarness>;
}
/** Base class for harnesses that can trigger a calendar. */
export declare abstract class DatepickerTriggerHarnessBase extends ComponentHarness implements DatepickerTrigger {
    /** Whether the trigger is disabled. */
    abstract isDisabled(): Promise<boolean>;
    /** Whether the calendar associated with the trigger is open. */
    abstract isCalendarOpen(): Promise<boolean>;
    /** Opens the calendar associated with the trigger. */
    protected abstract _openCalendar(): Promise<void>;
    /** Opens the calendar if the trigger is enabled and it has a calendar. */
    openCalendar(): Promise<void>;
    /** Closes the calendar if it is open. */
    closeCalendar(): Promise<void>;
    /** Gets whether there is a calendar associated with the trigger. */
    hasCalendar(): Promise<boolean>;
    /**
     * Gets the `MatCalendarHarness` that is associated with the trigger.
     * @param filter Optionally filters which calendar is included.
     */
    getCalendar(filter?: CalendarHarnessFilters): Promise<MatCalendarHarness>;
}
/** Gets the ID of the calendar that a particular test element can trigger. */
export declare function getCalendarId(host: Promise<TestElement>): Promise<string | null>;
/** Closes the calendar with a specific ID. */
export declare function closeCalendar(calendarId: Promise<string | null>, documentLocator: LocatorFactory): Promise<void>;
/** Gets the test harness for a calendar associated with a particular host. */
export declare function getCalendar(filter: CalendarHarnessFilters, host: Promise<TestElement>, documentLocator: LocatorFactory): Promise<MatCalendarHarness>;
