/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { ComponentHarness, HarnessPredicate } from '@angular/cdk/testing';
import { OptionHarnessFilters } from './option-harness-filters';
/** Harness for interacting with a `mat-option` in tests. */
export declare class MatOptionHarness extends ComponentHarness {
    /** Selector used to locate option instances. */
    static hostSelector: string;
    /** Element containing the option's text. */
    private _text;
    /**
     * Gets a `HarnessPredicate` that can be used to search for a `MatOptionsHarness` that meets
     * certain criteria.
     * @param options Options for filtering which option instances are considered a match.
     * @return a `HarnessPredicate` configured with the given options.
     */
    static with(options?: OptionHarnessFilters): HarnessPredicate<MatOptionHarness>;
    /** Clicks the option. */
    click(): Promise<void>;
    /** Gets the option's label text. */
    getText(): Promise<string>;
    /** Gets whether the option is disabled. */
    isDisabled(): Promise<boolean>;
    /** Gets whether the option is selected. */
    isSelected(): Promise<boolean>;
    /** Gets whether the option is active. */
    isActive(): Promise<boolean>;
    /** Gets whether the option is in multiple selection mode. */
    isMultiple(): Promise<boolean>;
}
