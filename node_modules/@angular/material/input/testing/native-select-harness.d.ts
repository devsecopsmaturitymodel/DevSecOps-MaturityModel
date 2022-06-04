/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { HarnessPredicate } from '@angular/cdk/testing';
import { MatFormFieldControlHarness } from '@angular/material/form-field/testing/control';
import { MatNativeOptionHarness } from './native-option-harness';
import { NativeOptionHarnessFilters, NativeSelectHarnessFilters } from './native-select-harness-filters';
/** Harness for interacting with a native `select` in tests. */
export declare class MatNativeSelectHarness extends MatFormFieldControlHarness {
    static hostSelector: string;
    /**
     * Gets a `HarnessPredicate` that can be used to search for a `MatNativeSelectHarness` that meets
     * certain criteria.
     * @param options Options for filtering which select instances are considered a match.
     * @return a `HarnessPredicate` configured with the given options.
     */
    static with(options?: NativeSelectHarnessFilters): HarnessPredicate<MatNativeSelectHarness>;
    /** Gets a boolean promise indicating if the select is disabled. */
    isDisabled(): Promise<boolean>;
    /** Gets a boolean promise indicating if the select is required. */
    isRequired(): Promise<boolean>;
    /** Gets a boolean promise indicating if the select is in multi-selection mode. */
    isMultiple(): Promise<boolean>;
    /** Gets the name of the select. */
    getName(): Promise<string>;
    /** Gets the id of the select. */
    getId(): Promise<string>;
    /** Focuses the select and returns a void promise that indicates when the action is complete. */
    focus(): Promise<void>;
    /** Blurs the select and returns a void promise that indicates when the action is complete. */
    blur(): Promise<void>;
    /** Whether the select is focused. */
    isFocused(): Promise<boolean>;
    /** Gets the options inside the select panel. */
    getOptions(filter?: NativeOptionHarnessFilters): Promise<MatNativeOptionHarness[]>;
    /**
     * Selects the options that match the passed-in filter. If the select is in multi-selection
     * mode all options will be clicked, otherwise the harness will pick the first matching option.
     */
    selectOptions(filter?: NativeOptionHarnessFilters): Promise<void>;
}
