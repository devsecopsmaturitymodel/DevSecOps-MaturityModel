/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { ContentContainerComponentHarness, HarnessLoader, HarnessPredicate } from '@angular/cdk/testing';
import { TabHarnessFilters } from './tab-harness-filters';
/** Harness for interacting with a standard Angular Material tab-label in tests. */
export declare class MatTabHarness extends ContentContainerComponentHarness<string> {
    /** The selector for the host element of a `MatTab` instance. */
    static hostSelector: string;
    /**
     * Gets a `HarnessPredicate` that can be used to search for a `MatTabHarness` that meets
     * certain criteria.
     * @param options Options for filtering which tab instances are considered a match.
     * @return a `HarnessPredicate` configured with the given options.
     */
    static with(options?: TabHarnessFilters): HarnessPredicate<MatTabHarness>;
    /** Gets the label of the tab. */
    getLabel(): Promise<string>;
    /** Gets the aria-label of the tab. */
    getAriaLabel(): Promise<string | null>;
    /** Gets the value of the "aria-labelledby" attribute. */
    getAriaLabelledby(): Promise<string | null>;
    /** Whether the tab is selected. */
    isSelected(): Promise<boolean>;
    /** Whether the tab is disabled. */
    isDisabled(): Promise<boolean>;
    /** Selects the given tab by clicking on the label. Tab cannot be selected if disabled. */
    select(): Promise<void>;
    /** Gets the text content of the tab. */
    getTextContent(): Promise<string>;
    protected getRootHarnessLoader(): Promise<HarnessLoader>;
    /** Gets the element id for the content of the current tab. */
    private _getContentId;
}
