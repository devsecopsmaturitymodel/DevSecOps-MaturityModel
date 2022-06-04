/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { ComponentHarness, HarnessPredicate } from '@angular/cdk/testing';
import { OptgroupHarnessFilters } from './optgroup-harness-filters';
import { MatOptionHarness } from './option-harness';
import { OptionHarnessFilters } from './option-harness-filters';
/** Harness for interacting with a `mat-optgroup` in tests. */
export declare class MatOptgroupHarness extends ComponentHarness {
    /** Selector used to locate option group instances. */
    static hostSelector: string;
    private _label;
    /**
     * Gets a `HarnessPredicate` that can be used to search for a `MatOptgroupHarness` that meets
     * certain criteria.
     * @param options Options for filtering which option instances are considered a match.
     * @return a `HarnessPredicate` configured with the given options.
     */
    static with(options?: OptgroupHarnessFilters): HarnessPredicate<MatOptgroupHarness>;
    /** Gets the option group's label text. */
    getLabelText(): Promise<string>;
    /** Gets whether the option group is disabled. */
    isDisabled(): Promise<boolean>;
    /**
     * Gets the options that are inside the group.
     * @param filter Optionally filters which options are included.
     */
    getOptions(filter?: OptionHarnessFilters): Promise<MatOptionHarness[]>;
}
