/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { ComponentHarness, HarnessPredicate } from '@angular/cdk/testing';
import { MatChipHarness } from './chip-harness';
import { MatChipInputHarness } from './chip-input-harness';
import { ChipListHarnessFilters, ChipHarnessFilters, ChipInputHarnessFilters } from './chip-harness-filters';
/** Base class for chip list harnesses. */
export declare abstract class _MatChipListHarnessBase extends ComponentHarness {
    /** Gets whether the chip list is disabled. */
    isDisabled(): Promise<boolean>;
    /** Gets whether the chip list is required. */
    isRequired(): Promise<boolean>;
    /** Gets whether the chip list is invalid. */
    isInvalid(): Promise<boolean>;
    /** Gets whether the chip list is in multi selection mode. */
    isMultiple(): Promise<boolean>;
    /** Gets whether the orientation of the chip list. */
    getOrientation(): Promise<'horizontal' | 'vertical'>;
}
/** Harness for interacting with a standard chip list in tests. */
export declare class MatChipListHarness extends _MatChipListHarnessBase {
    /** The selector for the host element of a `MatChipList` instance. */
    static hostSelector: string;
    /**
     * Gets a `HarnessPredicate` that can be used to search for a `MatChipListHarness` that meets
     * certain criteria.
     * @param options Options for filtering which chip list instances are considered a match.
     * @return a `HarnessPredicate` configured with the given options.
     */
    static with(options?: ChipListHarnessFilters): HarnessPredicate<MatChipListHarness>;
    /**
     * Gets the list of chips inside the chip list.
     * @param filter Optionally filters which chips are included.
     */
    getChips(filter?: ChipHarnessFilters): Promise<MatChipHarness[]>;
    /**
     * Selects a chip inside the chip list.
     * @param filter An optional filter to apply to the child chips.
     *    All the chips matching the filter will be selected.
     * @deprecated Use `MatChipListboxHarness.selectChips` instead.
     * @breaking-change 12.0.0
     */
    selectChips(filter?: ChipHarnessFilters): Promise<void>;
    /**
     * Gets the `MatChipInput` inside the chip list.
     * @param filter Optionally filters which chip input is included.
     */
    getInput(filter?: ChipInputHarnessFilters): Promise<MatChipInputHarness>;
}
