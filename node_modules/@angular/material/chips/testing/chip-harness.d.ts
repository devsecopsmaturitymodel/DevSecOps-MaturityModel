/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { ContentContainerComponentHarness, HarnessPredicate } from '@angular/cdk/testing';
import { MatChipAvatarHarness } from './chip-avatar-harness';
import { ChipAvatarHarnessFilters, ChipHarnessFilters, ChipRemoveHarnessFilters } from './chip-harness-filters';
import { MatChipRemoveHarness } from './chip-remove-harness';
/** Harness for interacting with a standard selectable Angular Material chip in tests. */
export declare class MatChipHarness extends ContentContainerComponentHarness {
    /** The selector for the host element of a `MatChip` instance. */
    static hostSelector: string;
    /**
     * Gets a `HarnessPredicate` that can be used to search for a `MatChipHarness` that meets
     * certain criteria.
     * @param options Options for filtering which chip instances are considered a match.
     * @return a `HarnessPredicate` configured with the given options.
     */
    static with(options?: ChipHarnessFilters): HarnessPredicate<MatChipHarness>;
    /** Gets the text of the chip. */
    getText(): Promise<string>;
    /**
     * Whether the chip is selected.
     * @deprecated Use `MatChipOptionHarness.isSelected` instead.
     * @breaking-change 12.0.0
     */
    isSelected(): Promise<boolean>;
    /** Whether the chip is disabled. */
    isDisabled(): Promise<boolean>;
    /**
     * Selects the given chip. Only applies if it's selectable.
     * @deprecated Use `MatChipOptionHarness.select` instead.
     * @breaking-change 12.0.0
     */
    select(): Promise<void>;
    /**
     * Deselects the given chip. Only applies if it's selectable.
     * @deprecated Use `MatChipOptionHarness.deselect` instead.
     * @breaking-change 12.0.0
     */
    deselect(): Promise<void>;
    /**
     * Toggles the selected state of the given chip. Only applies if it's selectable.
     * @deprecated Use `MatChipOptionHarness.toggle` instead.
     * @breaking-change 12.0.0
     */
    toggle(): Promise<void>;
    /** Removes the given chip. Only applies if it's removable. */
    remove(): Promise<void>;
    /**
     * Gets the remove button inside of a chip.
     * @param filter Optionally filters which remove buttons are included.
     */
    getRemoveButton(filter?: ChipRemoveHarnessFilters): Promise<MatChipRemoveHarness>;
    /**
     * Gets the avatar inside a chip.
     * @param filter Optionally filters which avatars are included.
     */
    getAvatar(filter?: ChipAvatarHarnessFilters): Promise<MatChipAvatarHarness | null>;
}
