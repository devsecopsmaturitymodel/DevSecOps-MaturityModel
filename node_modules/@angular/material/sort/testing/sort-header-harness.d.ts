/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { ComponentHarness, HarnessPredicate } from '@angular/cdk/testing';
import { SortDirection } from '@angular/material/sort';
import { SortHeaderHarnessFilters } from './sort-harness-filters';
/** Harness for interacting with a standard Angular Material sort header in tests. */
export declare class MatSortHeaderHarness extends ComponentHarness {
    static hostSelector: string;
    private _container;
    /**
     * Gets a `HarnessPredicate` that can be used to
     * search for a sort header with specific attributes.
     */
    static with(options?: SortHeaderHarnessFilters): HarnessPredicate<MatSortHeaderHarness>;
    /** Gets the label of the sort header. */
    getLabel(): Promise<string>;
    /** Gets the sorting direction of the header. */
    getSortDirection(): Promise<SortDirection>;
    /** Gets whether the sort header is currently being sorted by. */
    isActive(): Promise<boolean>;
    /** Whether the sort header is disabled. */
    isDisabled(): Promise<boolean>;
    /** Clicks the header to change its sorting direction. Only works if the header is enabled. */
    click(): Promise<void>;
}
