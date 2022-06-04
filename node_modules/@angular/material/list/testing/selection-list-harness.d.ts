/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { HarnessPredicate } from '@angular/cdk/testing';
import { MatListOptionCheckboxPosition } from '@angular/material/list';
import { MatListHarnessBase } from './list-harness-base';
import { ListItemHarnessFilters, ListOptionHarnessFilters, SelectionListHarnessFilters } from './list-harness-filters';
import { MatListItemHarnessBase } from './list-item-harness-base';
/** Harness for interacting with a standard mat-selection-list in tests. */
export declare class MatSelectionListHarness extends MatListHarnessBase<typeof MatListOptionHarness, MatListOptionHarness, ListOptionHarnessFilters> {
    /** The selector for the host element of a `MatSelectionList` instance. */
    static hostSelector: string;
    /**
     * Gets a `HarnessPredicate` that can be used to search for a `MatSelectionListHarness` that meets
     * certain criteria.
     * @param options Options for filtering which selection list instances are considered a match.
     * @return a `HarnessPredicate` configured with the given options.
     */
    static with(options?: SelectionListHarnessFilters): HarnessPredicate<MatSelectionListHarness>;
    _itemHarness: typeof MatListOptionHarness;
    /** Whether the selection list is disabled. */
    isDisabled(): Promise<boolean>;
    /**
     * Selects all items matching any of the given filters.
     * @param filters Filters that specify which items should be selected.
     */
    selectItems(...filters: ListOptionHarnessFilters[]): Promise<void>;
    /**
     * Deselects all items matching any of the given filters.
     * @param filters Filters that specify which items should be deselected.
     */
    deselectItems(...filters: ListItemHarnessFilters[]): Promise<void>;
    /** Gets all items matching the given list of filters. */
    private _getItems;
}
/** Harness for interacting with a list option. */
export declare class MatListOptionHarness extends MatListItemHarnessBase {
    /** The selector for the host element of a `MatListOption` instance. */
    static hostSelector: string;
    /**
     * Gets a `HarnessPredicate` that can be used to search for a `MatListOptionHarness` that
     * meets certain criteria.
     * @param options Options for filtering which list option instances are considered a match.
     * @return a `HarnessPredicate` configured with the given options.
     */
    static with(options?: ListOptionHarnessFilters): HarnessPredicate<MatListOptionHarness>;
    private _itemContent;
    /** Gets the position of the checkbox relative to the list option content. */
    getCheckboxPosition(): Promise<MatListOptionCheckboxPosition>;
    /** Whether the list option is selected. */
    isSelected(): Promise<boolean>;
    /** Focuses the list option. */
    focus(): Promise<void>;
    /** Blurs the list option. */
    blur(): Promise<void>;
    /** Whether the list option is focused. */
    isFocused(): Promise<boolean>;
    /** Toggles the checked state of the checkbox. */
    toggle(): Promise<void>;
    /**
     * Puts the list option in a checked state by toggling it if it is currently unchecked, or doing
     * nothing if it is already checked.
     */
    select(): Promise<void>;
    /**
     * Puts the list option in an unchecked state by toggling it if it is currently checked, or doing
     * nothing if it is already unchecked.
     */
    deselect(): Promise<void>;
}
