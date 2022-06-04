/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { ComponentHarness, HarnessPredicate } from '@angular/cdk/testing';
import { TabNavBarHarnessFilters, TabLinkHarnessFilters } from './tab-harness-filters';
import { MatTabLinkHarness } from './tab-link-harness';
import { MatTabNavPanelHarness } from './tab-nav-panel-harness';
/** Harness for interacting with a standard mat-tab-nav-bar in tests. */
export declare class MatTabNavBarHarness extends ComponentHarness {
    /** The selector for the host element of a `MatTabNavBar` instance. */
    static hostSelector: string;
    /**
     * Gets a `HarnessPredicate` that can be used to search for a `MatTabNavBar` that meets
     * certain criteria.
     * @param options Options for filtering which tab nav bar instances are considered a match.
     * @return a `HarnessPredicate` configured with the given options.
     */
    static with(options?: TabNavBarHarnessFilters): HarnessPredicate<MatTabNavBarHarness>;
    /**
     * Gets the list of links in the nav bar.
     * @param filter Optionally filters which links are included.
     */
    getLinks(filter?: TabLinkHarnessFilters): Promise<MatTabLinkHarness[]>;
    /** Gets the active link in the nav bar. */
    getActiveLink(): Promise<MatTabLinkHarness>;
    /**
     * Clicks a link inside the nav bar.
     * @param filter An optional filter to apply to the child link. The first link matching the filter
     *     will be clicked.
     */
    clickLink(filter?: TabLinkHarnessFilters): Promise<void>;
    /** Gets the panel associated with the nav bar. */
    getPanel(): Promise<MatTabNavPanelHarness>;
}
