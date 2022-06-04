/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { HarnessPredicate } from '@angular/cdk/testing';
import { MatListHarnessBase } from './list-harness-base';
import { NavListHarnessFilters, NavListItemHarnessFilters } from './list-harness-filters';
import { MatListItemHarnessBase } from './list-item-harness-base';
/** Harness for interacting with a standard mat-nav-list in tests. */
export declare class MatNavListHarness extends MatListHarnessBase<typeof MatNavListItemHarness, MatNavListItemHarness, NavListItemHarnessFilters> {
    /** The selector for the host element of a `MatNavList` instance. */
    static hostSelector: string;
    /**
     * Gets a `HarnessPredicate` that can be used to search for a `MatNavListHarness` that meets
     * certain criteria.
     * @param options Options for filtering which nav list instances are considered a match.
     * @return a `HarnessPredicate` configured with the given options.
     */
    static with(options?: NavListHarnessFilters): HarnessPredicate<MatNavListHarness>;
    _itemHarness: typeof MatNavListItemHarness;
}
/** Harness for interacting with a nav list item. */
export declare class MatNavListItemHarness extends MatListItemHarnessBase {
    /** The selector for the host element of a `MatListItem` instance. */
    static hostSelector: string;
    /**
     * Gets a `HarnessPredicate` that can be used to search for a `MatNavListItemHarness` that
     * meets certain criteria.
     * @param options Options for filtering which nav list item instances are considered a match.
     * @return a `HarnessPredicate` configured with the given options.
     */
    static with(options?: NavListItemHarnessFilters): HarnessPredicate<MatNavListItemHarness>;
    /** Gets the href for this nav list item. */
    getHref(): Promise<string | null>;
    /** Clicks on the nav list item. */
    click(): Promise<void>;
    /** Focuses the nav list item. */
    focus(): Promise<void>;
    /** Blurs the nav list item. */
    blur(): Promise<void>;
    /** Whether the nav list item is focused. */
    isFocused(): Promise<boolean>;
}
