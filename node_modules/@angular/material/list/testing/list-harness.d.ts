/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { HarnessPredicate } from '@angular/cdk/testing';
import { MatListHarnessBase } from './list-harness-base';
import { ListHarnessFilters, ListItemHarnessFilters } from './list-harness-filters';
import { MatListItemHarnessBase } from './list-item-harness-base';
/** Harness for interacting with a standard mat-list in tests. */
export declare class MatListHarness extends MatListHarnessBase<typeof MatListItemHarness, MatListItemHarness, ListItemHarnessFilters> {
    /** The selector for the host element of a `MatList` instance. */
    static hostSelector: string;
    /**
     * Gets a `HarnessPredicate` that can be used to search for a `MatListHarness` that meets certain
     * criteria.
     * @param options Options for filtering which list instances are considered a match.
     * @return a `HarnessPredicate` configured with the given options.
     */
    static with(options?: ListHarnessFilters): HarnessPredicate<MatListHarness>;
    _itemHarness: typeof MatListItemHarness;
}
/** Harness for interacting with a list item. */
export declare class MatListItemHarness extends MatListItemHarnessBase {
    /** The selector for the host element of a `MatListItem` instance. */
    static hostSelector: string;
    /**
     * Gets a `HarnessPredicate` that can be used to search for a `MatListItemHarness` that meets
     * certain criteria.
     * @param options Options for filtering which list item instances are considered a match.
     * @return a `HarnessPredicate` configured with the given options.
     */
    static with(options?: ListItemHarnessFilters): HarnessPredicate<MatListItemHarness>;
}
