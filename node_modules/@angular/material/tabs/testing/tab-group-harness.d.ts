/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { ComponentHarness, HarnessPredicate } from '@angular/cdk/testing';
import { TabGroupHarnessFilters, TabHarnessFilters } from './tab-harness-filters';
import { MatTabHarness } from './tab-harness';
/** Harness for interacting with a standard mat-tab-group in tests. */
export declare class MatTabGroupHarness extends ComponentHarness {
    /** The selector for the host element of a `MatTabGroup` instance. */
    static hostSelector: string;
    /**
     * Gets a `HarnessPredicate` that can be used to search for a `MatTabGroupHarness` that meets
     * certain criteria.
     * @param options Options for filtering which tab group instances are considered a match.
     * @return a `HarnessPredicate` configured with the given options.
     */
    static with(options?: TabGroupHarnessFilters): HarnessPredicate<MatTabGroupHarness>;
    /**
     * Gets the list of tabs in the tab group.
     * @param filter Optionally filters which tabs are included.
     */
    getTabs(filter?: TabHarnessFilters): Promise<MatTabHarness[]>;
    /** Gets the selected tab of the tab group. */
    getSelectedTab(): Promise<MatTabHarness>;
    /**
     * Selects a tab in this tab group.
     * @param filter An optional filter to apply to the child tabs. The first tab matching the filter
     *     will be selected.
     */
    selectTab(filter?: TabHarnessFilters): Promise<void>;
}
