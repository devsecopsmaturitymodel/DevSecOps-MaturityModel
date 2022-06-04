/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { HarnessPredicate, ComponentHarness, TestKey } from '@angular/cdk/testing';
import { ChipInputHarnessFilters } from './chip-harness-filters';
/** Harness for interacting with a standard Material chip inputs in tests. */
export declare class MatChipInputHarness extends ComponentHarness {
    static hostSelector: string;
    /**
     * Gets a `HarnessPredicate` that can be used to search for a `MatChipInputHarness` that meets
     * certain criteria.
     * @param options Options for filtering which input instances are considered a match.
     * @return a `HarnessPredicate` configured with the given options.
     */
    static with(options?: ChipInputHarnessFilters): HarnessPredicate<MatChipInputHarness>;
    /** Whether the input is disabled. */
    isDisabled(): Promise<boolean>;
    /** Whether the input is required. */
    isRequired(): Promise<boolean>;
    /** Gets the value of the input. */
    getValue(): Promise<string>;
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
    /**
     * Sets the value of the input. The value will be set by simulating
     * keypresses that correspond to the given value.
     */
    setValue(newValue: string): Promise<void>;
    /** Sends a chip separator key to the input element. */
    sendSeparatorKey(key: TestKey | string): Promise<void>;
}
