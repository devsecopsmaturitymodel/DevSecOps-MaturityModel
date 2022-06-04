/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { HarnessPredicate, ComponentHarness } from '@angular/cdk/testing';
import { ChipRemoveHarnessFilters } from './chip-harness-filters';
/** Harness for interacting with a standard Material chip remove button in tests. */
export declare class MatChipRemoveHarness extends ComponentHarness {
    static hostSelector: string;
    /**
     * Gets a `HarnessPredicate` that can be used to search for a `MatChipRemoveHarness` that meets
     * certain criteria.
     * @param options Options for filtering which input instances are considered a match.
     * @return a `HarnessPredicate` configured with the given options.
     */
    static with(options?: ChipRemoveHarnessFilters): HarnessPredicate<MatChipRemoveHarness>;
    /** Clicks the remove button. */
    click(): Promise<void>;
}
