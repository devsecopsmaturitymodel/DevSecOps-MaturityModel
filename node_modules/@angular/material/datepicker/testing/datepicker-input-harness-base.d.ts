/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { ComponentHarnessConstructor, HarnessPredicate } from '@angular/cdk/testing';
import { MatFormFieldControlHarness } from '@angular/material/form-field/testing/control';
import { DatepickerInputHarnessFilters } from './datepicker-harness-filters';
/** Sets up the filter predicates for a datepicker input harness. */
export declare function getInputPredicate<T extends MatDatepickerInputHarnessBase>(type: ComponentHarnessConstructor<T>, options: DatepickerInputHarnessFilters): HarnessPredicate<T>;
/** Base class for datepicker input harnesses. */
export declare abstract class MatDatepickerInputHarnessBase extends MatFormFieldControlHarness {
    /** Whether the input is disabled. */
    isDisabled(): Promise<boolean>;
    /** Whether the input is required. */
    isRequired(): Promise<boolean>;
    /** Gets the value of the input. */
    getValue(): Promise<string>;
    /**
     * Sets the value of the input. The value will be set by simulating
     * keypresses that correspond to the given value.
     */
    setValue(newValue: string): Promise<void>;
    /** Gets the placeholder of the input. */
    getPlaceholder(): Promise<string>;
    /**
     * Focuses the input and returns a promise that indicates when the
     * action is complete.
     */
    focus(): Promise<void>;
    /**
     * Blurs the input and returns a promise that indicates when the
     * action is complete.
     */
    blur(): Promise<void>;
    /** Whether the input is focused. */
    isFocused(): Promise<boolean>;
    /** Gets the formatted minimum date for the input's value. */
    getMin(): Promise<string | null>;
    /** Gets the formatted maximum date for the input's value. */
    getMax(): Promise<string | null>;
}
