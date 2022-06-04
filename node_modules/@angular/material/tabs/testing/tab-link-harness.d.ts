/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { ComponentHarness, HarnessPredicate } from '@angular/cdk/testing';
import { TabLinkHarnessFilters } from './tab-harness-filters';
/** Harness for interacting with a standard Angular Material tab link in tests. */
export declare class MatTabLinkHarness extends ComponentHarness {
    /** The selector for the host element of a `MatTabLink` instance. */
    static hostSelector: string;
    /**
     * Gets a `HarnessPredicate` that can be used to search for a `MatTabLinkHarness` that meets
     * certain criteria.
     * @param options Options for filtering which tab link instances are considered a match.
     * @return a `HarnessPredicate` configured with the given options.
     */
    static with(options?: TabLinkHarnessFilters): HarnessPredicate<MatTabLinkHarness>;
    /** Gets the label of the link. */
    getLabel(): Promise<string>;
    /** Whether the link is active. */
    isActive(): Promise<boolean>;
    /** Whether the link is disabled. */
    isDisabled(): Promise<boolean>;
    /** Clicks on the link. */
    click(): Promise<void>;
}
