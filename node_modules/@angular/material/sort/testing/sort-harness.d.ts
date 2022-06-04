/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { ComponentHarness, HarnessPredicate } from '@angular/cdk/testing';
import { SortHarnessFilters, SortHeaderHarnessFilters } from './sort-harness-filters';
import { MatSortHeaderHarness } from './sort-header-harness';
/** Harness for interacting with a standard `mat-sort` in tests. */
export declare class MatSortHarness extends ComponentHarness {
    static hostSelector: string;
    /**
     * Gets a `HarnessPredicate` that can be used to search for a `mat-sort` with specific attributes.
     * @param options Options for narrowing the search.
     * @return a `HarnessPredicate` configured with the given options.
     */
    static with(options?: SortHarnessFilters): HarnessPredicate<MatSortHarness>;
    /** Gets all of the sort headers in the `mat-sort`. */
    getSortHeaders(filter?: SortHeaderHarnessFilters): Promise<MatSortHeaderHarness[]>;
    /** Gets the selected header in the `mat-sort`. */
    getActiveHeader(): Promise<MatSortHeaderHarness | null>;
}
